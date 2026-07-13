"use client";
// src/app/login/page.tsx
import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { gsap } from "gsap";
import { Eye, EyeOff, Lock, Mail, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    // Check URL for Google access denied error
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "AccessDenied") {
        setError("Akses ditolak. Akun Google Anda belum terdaftar sebagai Admin.");
      }
    }

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
        gsap.fromTo(
          formRef.current,
          { x: -8 },
          { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" }
        );
      } else {
        router.push("/cms");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1A1614 0%, #2C2420 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background ornaments */}
      <div style={{ position: "absolute", top: "-150px", right: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-150px", left: "-150px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div ref={formRef} style={{ width: "100%", maxWidth: "420px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ display: "inline-block" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                border: "1px solid rgba(201,168,76,0.3)",
                background: "rgba(201,168,76,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.75rem",
                margin: "0 auto 1.25rem",
              }}
            >
              <Image
                src="/logo.png"
                alt="Logo Paroki"
                width={56}
                height={56}
                style={{
                  objectFit: "contain",

                  opacity: 0.85,
                }}
              />
            </div>
          </Link>
          <h1
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.5rem",
              color: "#FDFAF4",
              fontWeight: 600,
              marginBottom: "0.4rem",
            }}
          >
            Masuk ke CMS
          </h1>
          <p
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(201,168,76,0.6)",
              textTransform: "uppercase",
            }}
          >
            Paroki Keluarga Kudus Atmodirono
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "rgba(253,250,244,0.04)",
            border: "1px solid rgba(201,168,76,0.15)",
            borderRadius: "1rem",
            padding: "2.5rem",
            backdropFilter: "blur(12px)",
          }}
        >
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                background: "rgba(180,60,60,0.1)",
                border: "1px solid rgba(180,60,60,0.25)",
                borderRadius: "0.5rem",
                padding: "0.875rem 1rem",
                marginBottom: "1.5rem",
              }}
            >
              <AlertCircle size={16} style={{ color: "#E07070", flexShrink: 0 }} />
              <p style={{ fontSize: "0.85rem", color: "#E07070" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "1.25rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(201,168,76,0.7)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(253,250,244,0.3)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@paroki.id"
                  style={{
                    width: "100%",
                    padding: "0.875rem 1rem 0.875rem 2.75rem",
                    background: "rgba(253,250,244,0.06)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "0.5rem",
                    color: "#FDFAF4",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.3s ease",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: "2rem" }}>
              <label
                style={{
                  display: "block",
                  fontFamily: "Cinzel, serif",
                  fontSize: "0.6rem",
                  letterSpacing: "0.15em",
                  color: "rgba(201,168,76,0.7)",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "rgba(253,250,244,0.3)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.875rem 3rem 0.875rem 2.75rem",
                    background: "rgba(253,250,244,0.06)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    borderRadius: "0.5rem",
                    color: "#FDFAF4",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(253,250,244,0.4)",
                    padding: 0,
                    display: "flex",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0" }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.2)" }} />
            <span style={{ padding: "0 0.75rem", fontSize: "0.75rem", color: "rgba(253,250,244,0.4)" }}>ATAU</span>
            <div style={{ flex: 1, height: "1px", background: "rgba(201,168,76,0.2)" }} />
          </div>

          {/* Google Login Button */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/cms" })}
            type="button"
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "0.875rem",
              background: "rgba(253,250,244,0.05)",
              border: "1px solid rgba(253,250,244,0.1)",
              borderRadius: "0.5rem",
              color: "#FDFAF4",
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "rgba(253,250,244,0.1)")}
            onMouseOut={(e) => (e.currentTarget.style.background = "rgba(253,250,244,0.05)")}
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Masuk dengan Google
          </button>
        </div>

        {/* Back link */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            href="/"
            style={{
              fontFamily: "Cinzel, serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              color: "rgba(253,250,244,0.4)",
              textDecoration: "none",
              textTransform: "uppercase",
            }}
          >
            ← Kembali ke Halaman Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
