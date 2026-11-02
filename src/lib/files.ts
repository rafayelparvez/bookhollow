export const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(new Error("Could not read the selected image."));
    reader.readAsDataURL(file);
  });
}
