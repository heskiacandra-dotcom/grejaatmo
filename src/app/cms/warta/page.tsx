// src/app/cms/warta/page.tsx
"use client";
import { useState } from "react";
import { CmsBeritaList } from "@/components/cms/CmsBeritaList";
import { CmsPengumumanManager } from "@/components/cms/CmsPengumumanManager";
import { CmsWartaManager } from "@/components/cms/CmsWartaManager";
import { CmsPopupManager } from "@/components/cms/CmsPopupManager";
import { Newspaper, Bell, FileText, MonitorUp } from "lucide-react";

export default function CmsWartaPage() {
  const [activeTab, setActiveTab] = useState<"berita" | "pengumuman" | "warta" | "popup">("berita");

  const tabStyle = (isActive: boolean) => ({
    padding: "0.75rem 1.5rem",
    background: "none",
    border: "none",
    borderBottom: isActive ? "2px solid #C9A84C" : "2px solid transparent",
    color: isActive ? "#C9A84C" : "#8B7355",
    fontFamily: "Cinzel, serif",
    fontSize: "0.75rem",
    fontWeight: isActive ? 600 : 400,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    transition: "all 0.2s ease"
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Shared Header Area */}
      <div style={{ padding: "2.5rem 2.5rem 0", background: "#F5F0E4", borderBottom: "1px solid #E2D8C0" }}>
        <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700, marginBottom: "1.5rem" }}>
          Pusat Informasi Paroki
        </h1>
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={() => setActiveTab("berita")} style={tabStyle(activeTab === "berita")}>
            <Newspaper size={16} /> Berita
          </button>
          <button onClick={() => setActiveTab("pengumuman")} style={tabStyle(activeTab === "pengumuman")}>
            <Bell size={16} /> Pengumuman
          </button>
          <button onClick={() => setActiveTab("warta")} style={tabStyle(activeTab === "warta")}>
            <FileText size={16} /> Warta PDF
          </button>
          <button onClick={() => setActiveTab("popup")} style={tabStyle(activeTab === "popup")}>
            <MonitorUp size={16} /> Pop-up
          </button>
        </div>
      </div>

      {/* Tab Content - we hide the internal headers using CSS */}
      <div className="merged-cms-container" style={{ flex: 1 }}>
        <style>{`
          .merged-cms-container > div > div:nth-child(2) h1,
          .merged-cms-container > div > div:nth-child(2) p,
          .merged-cms-container > div > div:first-child h1 {
             display: none !important;
          }
          /* Adjust spacing where headers used to be */
          .merged-cms-container > div > div:nth-child(2) {
             margin-bottom: 0 !important;
             align-items: flex-end !important;
             justify-content: flex-end !important;
          }
          .merged-cms-container > div {
             padding-top: 1.5rem !important;
          }
        `}</style>
        {activeTab === "berita" && <CmsBeritaList />}
        {activeTab === "pengumuman" && <CmsPengumumanManager />}
        {activeTab === "warta" && <CmsWartaManager />}
        {activeTab === "popup" && <CmsPopupManager />}
      </div>
    </div>
  );
}
