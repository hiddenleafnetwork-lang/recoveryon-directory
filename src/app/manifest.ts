import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TreatmentLane",
    short_name: "TreatmentLane",
    description: "A transparent directory for addiction treatment, recovery, and mental health resources.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#247f86",
  };
}
