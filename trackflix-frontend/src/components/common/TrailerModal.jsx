import React, { useEffect, useRef } from "react";

const TrailerModal = ({ url, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    if (modalRef.current) modalRef.current.focus();

    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-6 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-title"
    >
      <div
        className="relative w-full max-w-5xl aspect-video bg-black rounded-xl shadow-2xl overflow-hidden outline-none"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        ref={modalRef}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-zinc-800 bg-opacity-70 rounded-full p-2 hover:bg-red-600 transition-colors z-10"
          aria-label="Close trailer"
        >
          ×
        </button>

        <iframe
          className="w-full h-full"
          src={url}
          title="Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default TrailerModal;
