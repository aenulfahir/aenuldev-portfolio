import { supabase } from "./supabase";

/**
 * Compress an image file using Canvas API
 * Maintains sharpness while reducing file size
 */
export async function compressImage(
    file: File,
    maxWidth: number = 1200,
    quality: number = 0.85
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                // Scale down if larger than maxWidth
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                // Use high-quality image rendering
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject(new Error("Could not compress image"));
                        }
                    },
                    "image/webp", // WebP for best compression + quality
                    quality
                );
            };

            img.onerror = () => reject(new Error("Could not load image"));
        };

        reader.onerror = () => reject(new Error("Could not read file"));
    });
}

/**
 * Upload a project image to Supabase Storage
 */
export async function uploadProjectImage(
    file: File,
    projectId: string,
    imageSlot: 1 | 2 | 3
): Promise<string> {
    // Compress image first
    const compressedBlob = await compressImage(file);

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `${projectId}/image${imageSlot}_${timestamp}.webp`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
        .from("project-images")
        .upload(filename, compressedBlob, {
            contentType: "image/webp",
            upsert: true,
        });

    if (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
        .from("project-images")
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Delete a project image from Supabase Storage
 */
export async function deleteProjectImage(imageUrl: string): Promise<void> {
    // Extract path from URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/project-images\/(.+)/);

    if (!pathMatch) {
        console.warn("Could not parse image path from URL:", imageUrl);
        return;
    }

    const filePath = pathMatch[1];

    const { error } = await supabase.storage
        .from("project-images")
        .remove([filePath]);

    if (error) {
        console.error("Failed to delete image:", error);
    }
}

/**
 * Get a file preview URL for display before upload
 */
export function getFilePreviewUrl(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke a file preview URL to free memory
 */
export function revokeFilePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
}
