const siteUrl = "https://treatmentlane.com";
const host = new URL(siteUrl).hostname;
const key = "300c384005892d75d23af72af6fc9f63";
const keyLocation = `${siteUrl}/${key}.txt`;
const endpoint = "https://api.indexnow.org/indexnow";
const batchSize = 10000;

const sitemapResponse = await fetch(`${siteUrl}/sitemap.xml`);
if (!sitemapResponse.ok) throw new Error(`Could not load the sitemap: ${sitemapResponse.status}`);

const sitemap = await sitemapResponse.text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map((match) => match[1])
  .filter((url) => new URL(url).hostname === host);

if (!urls.length) throw new Error("The sitemap did not contain any same-host URLs.");

const verificationResponse = await fetch(keyLocation);
const verificationBody = (await verificationResponse.text()).trim();
if (!verificationResponse.ok || verificationBody !== key) {
  throw new Error(`IndexNow key verification failed: ${verificationResponse.status}`);
}

const results = [];
for (let index = 0; index < urls.length; index += batchSize) {
  const urlList = urls.slice(index, index + batchSize);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  const body = await response.text();
  const batch = index / batchSize + 1;
  results.push({ batch, urls: urlList.length, status: response.status });
  if (![200, 202].includes(response.status)) {
    throw new Error(`IndexNow batch ${batch} failed with ${response.status}: ${body.slice(0, 300)}`);
  }
}

console.log(JSON.stringify({ submitted: urls.length, keyLocation, results }, null, 2));
