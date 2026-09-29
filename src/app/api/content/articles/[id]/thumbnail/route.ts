import { getPublishedArticleThumbnail } from "@/lib/articles";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const thumbnail = await getPublishedArticleThumbnail(id);
  if (!thumbnail) return new Response(null, { status: 404 });
  return new Response(Buffer.from(thumbnail.data, "base64"), {
    headers: {
      "Content-Type": thumbnail.mimeType,
      "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
    },
  });
}
