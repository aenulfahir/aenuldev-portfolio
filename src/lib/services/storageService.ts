import { supabase } from "../supabase";

// Compression settings
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 0.85; // 85% quality - good balance between size and quality

/**
 * Compress image using canvas
 * - Resize to max dimensions while maintaining aspect ratio
 * - Compress to WebP format for smaller file size
 * - Fallback to JPEG if WebP not supported
 */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > MAX_WIDTH) {
        height = (height * MAX_WIDTH) / width;
        width = MAX_WIDTH;
      }
      if (height > MAX_HEIGHT) {
        width = (width * MAX_HEIGHT) / height;
        height = MAX_HEIGHT;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with smoothing for better quality
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Try WebP first (smaller), fallback to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              `Image compressed: ${(file.size / 1024).toFixed(1)}KB → ${(
                blob.size / 1024
              ).toFixed(1)}KB`
            );
            resolve(blob);
          } else {
            // Fallback to JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) {
                  resolve(jpegBlob);
                } else {
                  reject(new Error("Failed to compress image"));
                }
              },
              "image/jpeg",
              QUALITY
            );
          }
        },
        "image/webp",
        QUALITY
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadImage(
  file: File,
  folder: string = "blog"
): Promise<string> {
  // Compress image before upload
  let uploadFile: Blob | File = file;
  let fileExt = "webp";

  // Only compress image files
  if (file.type.startsWith("image/")) {
    try {
      uploadFile = await compressImage(file);
      // Check if WebP was successful, otherwise use jpeg
      if (uploadFile.type === "image/jpeg") {
        fileExt = "jpg";
      }
    } catch (error) {
      console.warn("Compression failed, uploading original:", error);
      uploadFile = file;
      fileExt = file.name.split(".").pop() || "jpg";
    }
  } else {
    fileExt = file.name.split(".").pop() || "bin";
  }

  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .substring(7)}.${fileExt}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(fileName, uploadFile, {
      cacheControl: "3600",
      upsert: false,
      contentType: uploadFile.type || `image/${fileExt}`,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteImage(url: string): Promise<void> {
  // Extract file path from URL
  const urlParts = url.split("/blog-images/");
  if (urlParts.length < 2) return;

  const filePath = urlParts[1];

  const { error } = await supabase.storage
    .from("blog-images")
    .remove([filePath]);

  if (error) {
    console.error("Error deleting image:", error);
  }
}
