import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Map ID to corresponding environment variable
    let imageUrl: string | undefined;
    
    switch (id) {
      case "hero":
        imageUrl = process.env.CLOUDINARY_IMAGE_HERO;
        break;
      case "album":
        imageUrl = process.env.CLOUDINARY_IMAGE_ALBUM;
        break;
      case "1":
        imageUrl = process.env.CLOUDINARY_IMAGE_1;
        break;
      case "2":
        imageUrl = process.env.CLOUDINARY_IMAGE_2;
        break;
      case "3":
        imageUrl = process.env.CLOUDINARY_IMAGE_3;
        break;
      case "4":
        imageUrl = process.env.CLOUDINARY_IMAGE_4;
        break;
      case "5":
        imageUrl = process.env.CLOUDINARY_IMAGE_5;
        break;
      default:
        break;
    }

    // If Cloudinary URL (or local path) is configured, proxy it
    if (imageUrl && imageUrl.trim().length > 0) {
      if (imageUrl.startsWith("/")) {
        // If it's a local path (e.g. /images/memory-1.jpg), read from public folder directly
        const { join } = await import("path");
        const { promises: fs } = await import("fs");
        
        const publicFilePath = join(process.cwd(), "public", imageUrl);
        try {
          const fileBuffer = await fs.readFile(publicFilePath);
          const ext = imageUrl.split(".").pop() || "jpg";
          const contentType = ext === "png" ? "image/png" : "image/jpeg";
          return new NextResponse(fileBuffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-store", // Do not cache local dev images
            },
          });
        } catch (err) {
          console.error("Local file read error:", err);
          return new NextResponse("File not found", { status: 404 });
        }
      }

      const imageResponse = await fetch(imageUrl, {
        headers: {
          "User-Agent": "NextJS-Image-Proxy",
        },
        // We can add a Next.js revalidation tag or search params to force caching
        next: { revalidate: 3600 * 24 } // cache for 24 hours at Next.js server level
      });

      if (!imageResponse.ok) {
        return new NextResponse("Failed to fetch image from source", { status: 500 });
      }

      const contentType = imageResponse.headers.get("content-type") || "image/jpeg";
      const imageBuffer = await imageResponse.arrayBuffer();

      return new NextResponse(Buffer.from(imageBuffer), {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable", // Tell browser to cache heavily
        },
      });
    }

    // Fallback: If not configured, redirect to local public images for local development
    let fallbackPath = "/images/memory-1.jpg";
    switch (id) {
      case "hero":
      case "5":
        fallbackPath = "/images/memory-2.jpg";
        break;
      case "1":
        fallbackPath = "/images/memory-3.jpg";
        break;
      case "2":
        fallbackPath = "/images/memory-1.jpg";
        break;
      case "3":
        fallbackPath = "/images/memory-5.jpg";
        break;
      case "4":
        fallbackPath = "/images/memory-4.jpg";
        break;
      default:
        fallbackPath = "/images/memory-1.jpg";
        break;
    }

    return NextResponse.redirect(new URL(fallbackPath, request.url));
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
