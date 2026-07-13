"use client";
import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function PopupAnnouncement() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data?.popupEnabled) {
          setData(resData.data);
          // Small delay before showing pop-up
          setTimeout(() => setIsOpen(true), 1500);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const closePopup = () => {
    setIsOpen(false);
  };

  // Hide on admin pages and login page
  if (pathname?.startsWith("/cms") || pathname?.startsWith("/auth") || pathname === "/login") {
    return null;
  }

  if (!isOpen || !data) return null;

  const images = data.popupImages && Array.isArray(data.popupImages) ? data.popupImages : [];
  if (images.length === 0) return null;

  const handlePrev = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(26, 22, 20, 0.8)",
        backdropFilter: "blur(8px)",
        zIndex: 999999,
        display: "grid",
        placeItems: "center",
        padding: "1rem",
        height: "100dvh",
        width: "100vw",
        animation: "fadeIn 0.3s ease-out",
      }}
      onClick={closePopup}
    >
      <div
        style={{
          background: "#FDFAF4",
          width: "min(500px, calc(100vw - 2rem))",
          maxHeight: "90dvh",
          borderRadius: "1rem",
          overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          position: "relative",
          animation: "modalZoom 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          border: "1px solid #E2D8C0",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closePopup}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "rgba(253, 250, 244, 0.9)",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            color: "#1A1614",
          }}
        >
          <X size={20} />
        </button>

        <div style={{ width: "100%", position: "relative", flex: 1, overflow: "hidden", display: "flex", alignItems: "center" }}>
          <img 
            src={images[currentIndex]} 
            alt={`Pengumuman ${currentIndex + 1}`} 
            style={{ 
              width: "100%", 
              height: "auto", 
              maxHeight: "90dvh",
              objectFit: "contain",
              display: "block" 
            }} 
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                style={{ position: "absolute", top: "50%", left: "0.5rem", transform: "translateY(-50%)", background: "rgba(253, 250, 244, 0.9)", border: "none", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", color: "#1A1614" }}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={handleNext}
                style={{ position: "absolute", top: "50%", right: "0.5rem", transform: "translateY(-50%)", background: "rgba(253, 250, 244, 0.9)", border: "none", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10, boxShadow: "0 2px 10px rgba(0,0,0,0.1)", color: "#1A1614" }}
              >
                <ChevronRight size={24} />
              </button>

              <div style={{ position: "absolute", bottom: "1rem", left: "0", right: "0", display: "flex", justifyContent: "center", gap: "0.5rem", zIndex: 10 }}>
                {images.map((_: string, i: number) => (
                  <div key={i} style={{ width: "8px", height: "8px", borderRadius: "50%", background: i === currentIndex ? "#C9A84C" : "rgba(253, 250, 244, 0.5)", transition: "background 0.3s" }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalZoom { 
          from { opacity: 0; transform: scale(0.9); } 
          to { opacity: 1; transform: scale(1); } 
        }
      `}} />
    </div>
  );
}
