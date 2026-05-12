"use client";
// src/components/cms/CmsSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Newspaper,
  Clock,
  BookOpen,
  Bell,
  Settings,
  Users,
  LogOut,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";

const navItems = [
  { href: "/cms", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/cms/warta", label: "Warta & Berita", icon: BookOpen },
  { href: "/cms/jadwal", label: "Jadwal Misa", icon: Clock },
  { href: "/cms/tentang", label: "Tentang Paroki", icon: ImageIcon },
  { href: "/cms/users", label: "Pengguna", icon: Users },
  { href: "/cms/pengaturan", label: "Kontak", icon: Settings },
];

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export function CmsSidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="cms-sidebar"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto",
        padding: "1.75rem 1.25rem",
        borderRight: "1px solid rgba(201,168,76,0.1)",
        background: "linear-gradient(180deg, #1A1614 0%, #110F0E 100%)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          padding: "0 0 1.75rem 0",
          borderBottom: "1px solid rgba(201,168,76,0.1)",
          marginBottom: "1.75rem",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "12px",
            background: "rgba(201,168,76,0.05)",
            border: "1px solid rgba(201,168,76,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
          }}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={32}
            height={32}
            style={{
              objectFit: "contain",
            }}
          />
        </div>
        <div>
          <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.55rem", letterSpacing: "0.2em", color: "#C9A84C", textTransform: "uppercase", fontWeight: 700 }}>
            CMS Console
          </p>
          <p style={{ fontFamily: "Playfair Display, serif", fontSize: "0.9rem", color: "#FDFAF4", fontWeight: 700, lineHeight: 1.2 }}>
            Atmodirono
          </p>
        </div>
      </div>

      {/* Nav Items */}
      <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          if (href === "/cms/users" && user?.role !== "superadmin") {
            return null;
          }
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`cms-nav-link ${active ? "active" : ""}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.875rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.75rem",
                color: active ? "#FDFAF4" : "rgba(253,250,244,0.5)",
                background: active ? "rgba(201,168,76,0.12)" : "transparent",
                border: `1px solid ${active ? "rgba(201,168,76,0.2)" : "transparent"}`,
                textDecoration: "none",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                fontFamily: active ? "Cinzel, serif" : "inherit",
                fontWeight: active ? 600 : 400,
                letterSpacing: active ? "0.02em" : "normal"
              }}
            >
              <Icon size={18} style={{ color: active ? "#C9A84C" : "currentColor" }} />
              <span style={{ fontSize: "0.875rem" }}>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div
        style={{
          borderTop: "1px solid rgba(201,168,76,0.1)",
          paddingTop: "1.5rem",
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        {/* User info */}
        {user && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.875rem",
              padding: "0.875rem",
              borderRadius: "0.875rem",
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.08)",
              marginBottom: "0.75rem",
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                background: "linear-gradient(135deg, rgba(201,168,76,0.2) 0%, rgba(201,168,76,0.05) 100%)",
                border: "1px solid rgba(201,168,76,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Playfair Display, serif",
                fontSize: "1.1rem",
                color: "#C9A84C",
                flexShrink: 0,
                fontWeight: 700
              }}
            >
              {user.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "0.85rem", color: "#FDFAF4", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name}
              </p>
              <p style={{ fontSize: "0.7rem", color: "rgba(253,250,244,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: "1px" }}>
                {user.email}
              </p>
            </div>
          </div>
        )}

        <Link 
          href="/" 
          target="_blank" 
          className="cms-nav-link-bottom"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            color: "rgba(253,250,244,0.5)",
            textDecoration: "none",
            fontSize: "0.8rem",
            transition: "all 0.2s ease"
          }}
        >
          <ExternalLink size={16} />
          <span>Buka Website</span>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/auth/login" })}
          style={{
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: "0.875rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            color: "rgba(180,60,60,0.7)",
            fontSize: "0.8rem",
            transition: "all 0.2s ease"
          }}
          className="cms-nav-link-logout"
        >
          <LogOut size={16} />
          <span>Keluar Sesi</span>
        </button>
      </div>

      <style jsx>{`
        .cms-nav-link:hover {
          background: rgba(253,250,244,0.03) !important;
          color: #FDFAF4 !important;
          transform: translateX(4px);
        }
        .cms-nav-link.active:hover {
          background: rgba(201,168,76,0.15) !important;
          transform: none;
        }
        .cms-nav-link-bottom:hover {
          color: #C9A84C !important;
          background: rgba(201,168,76,0.05) !important;
        }
        .cms-nav-link-logout:hover {
          color: #EF4444 !important;
          background: rgba(239,68,68,0.05) !important;
        }
      `}</style>
    </aside>

  );
}
