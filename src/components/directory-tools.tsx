"use client";

import { Download, Printer } from "lucide-react";

type DirectoryToolProvider = {
  name: string;
  city: string;
  state: string;
  phone: string | null;
  website: string | null;
  verificationStatus: string;
  href: string;
};

function csvCell(value: string | null) {
  const safeValue = value && /^[=+@-]/.test(value) ? `'${value}` : value || "";
  return `"${safeValue.replaceAll('"', '""')}"`;
}

export function DirectoryTools({ providers }: { providers: DirectoryToolProvider[] }) {
  function downloadResults() {
    const rows = [
      ["Name", "City", "State", "Phone", "Website", "Listing status", "TreatmentLane URL"],
      ...providers.map((provider) => [
        provider.name,
        provider.city,
        provider.state,
        provider.phone,
        provider.website,
        provider.verificationStatus,
        new URL(provider.href, window.location.origin).toString(),
      ]),
    ];
    const csv = rows.map((row) => row.map(csvCell).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "treatmentlane-directory-results.csv";
    link.style.display = "none";
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  }

  if (!providers.length) return null;

  return (
    <div className="directory-tools" aria-label="Directory result tools">
      <button type="button" onClick={() => window.print()}><Printer size={16} /> Print</button>
      <button type="button" onClick={downloadResults}><Download size={16} /> Download page</button>
    </div>
  );
}
