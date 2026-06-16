import { toast } from "./Toast.jsx";

export async function shareContent({ title, text, url }) {
  const shareData = { title, text, url };

  // Use Web Share API if available (mobile browsers)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      // User cancelled or share failed, fallback to clipboard
    }
  }

  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(url);
    toast("Link berhasil disalin ke clipboard! 📋", "success");
  } catch {
    // Last resort: select text for manual copy
    toast("Gagal menyalin link. Coba salin manual ya.", "error");
  }
}
