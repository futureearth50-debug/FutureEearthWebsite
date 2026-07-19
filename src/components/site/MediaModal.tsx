import { useEffect } from "react";
import { X } from "lucide-react";
import { getLenis } from "@/lib/motion";

export type Media =
  | { type: "video"; src: string; title?: string }
  | { type: "image"; src: string; title?: string };

export function MediaModal({
  media,
  onClose,
  locale,
}: {
  media: Media | null;
  onClose: () => void;
  locale: "en" | "ar";
}) {
  useEffect(() => {
    if (!media) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [media, onClose]);

  if (!media) return null;
  const isVideo = media.type === "video";

  return (
    <div className="fe-lightbox" role="dialog" aria-modal="true" aria-label={media.title || "Media"}>
      <div className="fe-lightbox-scrim" onClick={onClose} />
      <div className="fe-noise" />

      <button className="fe-lightbox-close" onClick={onClose} aria-label={locale === "ar" ? "إغلاق" : "Close"}>
        <X size={20} />
      </button>

      <div className={isVideo ? "fe-media-frame" : "fe-lightbox-body"}>
        {isVideo ? (
          <video
            className="fe-media-video"
            src={media.src}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
          />
        ) : (
          <>
            <div className="fe-lightbox-sheet">
              <img src={media.src} alt={media.title || ""} />
            </div>
            {media.title && (
              <div className="fe-lightbox-meta">
                <h3 className="fe-display" style={{ color: "white", fontSize: "clamp(1rem,1.8vw,1.35rem)", fontWeight: 600 }}>
                  {media.title}
                </h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
