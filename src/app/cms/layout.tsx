"use client";
// src/app/cms/layout.tsx
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from "next/navigation";
import { CmsSidebar } from "@/components/cms/CmsSidebar";
import { Menu, X } from "lucide-react";

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }
  }, [status]);

  // Close sidebar on navigation (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  if (status === "loading") {
    return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", background: "#F5F0E4" }}>Memuat...</div>;
  }

  if (!session) return null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F0E4", position: "relative" }}>
      {/* Mobile Header */}
      <div 
        className="md:hidden mobile-header" 
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          right: 0, 
          height: "60px", 
          background: "#1A1614", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          padding: "0 1.25rem", 
          zIndex: 1000,
          borderBottom: "1px solid rgba(201,168,76,0.2)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.png" alt="Logo" style={{ width: 28, height: 28, objectFit: "contain" }} />
          <span style={{ fontFamily: "Playfair Display, serif", color: "#FDFAF4", fontSize: "0.9rem", fontWeight: 600 }}>CMS Admin</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{ background: "none", border: "none", color: "#C9A84C", cursor: "pointer" }}
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          style={{ 
            position: "fixed", 
            inset: 0, 
            background: "rgba(0,0,0,0.5)", 
            backdropFilter: "blur(4px)",
            zIndex: 998 
          }}
        />
      )}

      {/* Sidebar Container */}
      <div 
        className={`cms-sidebar-container ${isSidebarOpen ? "open" : ""}`}
        style={{
          transition: "transform 0.3s ease",
          zIndex: 999
        }}
      >
        <CmsSidebar user={session.user as any} />
      </div>

      {/* Main Content */}
      <main style={{ 
        flex: 1, 
        overflow: "auto", 
        paddingTop: "60px", // space for mobile header
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }} className="md:pt-0">
        <div className="container-cms" style={{ padding: "clamp(1rem, 3vw, 2.5rem)", width: "100%" }}>
          {children}
        </div>
      </main>

      <style jsx global>{`
        .mobile-header {
          display: flex;
        }
        @media (min-width: 768px) {
          .mobile-header {
            display: none !important;
          }
        }
        .cms-sidebar-container {
          position: fixed;
          top: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          width: 260px;
        }
        .cms-sidebar-container.open {
          transform: translateX(0);
        }
        .container-cms {
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 768px) {
          .cms-sidebar-container {
            position: sticky;
            transform: translateX(0);
          }
          main {
            padding-top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

