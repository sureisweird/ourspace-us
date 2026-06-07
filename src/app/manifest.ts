import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Our Space | Happy Anniversary",
    short_name: "Our Space",
    description:
      "A digital sanctuary celebrating our love, memories, and beautiful moments together.",
    start_url: "/",
    display: "standalone",
    background_color: "#170E0D",
    theme_color: "#170E0D",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
