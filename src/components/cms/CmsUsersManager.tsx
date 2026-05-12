"use client";
// src/components/cms/CmsUsersManager.tsx
import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Check, Shield, Eye, EyeOff, RefreshCw } from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "superadmin";
  createdAt: string;
}

type FormMode = "create" | "edit";

export function CmsUsersManager() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "superadmin",
  });

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = () => {
    setLoading(true);
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUsers(data.data);
      })
      .catch(() => showToast("Gagal mengambil data pengguna", "err"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openCreate = () => {
    setFormMode("create");
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "admin" });
    setShowPassword(false);
    setShowForm(true);
  };

  const openEdit = (user: AdminUser) => {
    setFormMode("edit");
    setEditingUser(user);
    setForm({ name: user.name, email: user.email, password: "", role: user.role });
    setShowPassword(false);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.email) {
      showToast("Nama dan email wajib diisi", "err");
      return;
    }

    setSaving(true);
    try {
      let res: Response;
      if (formMode === "create") {
        res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        const payload: Record<string, string> = {
          name: form.name,
          email: form.email,
          role: form.role,
        };
        if (form.password) payload.password = form.password;

        res = await fetch(`/api/users/${editingUser!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (data.success) {
        fetchUsers();
        setShowForm(false);
        showToast(formMode === "create" ? "Pengguna berhasil dibuat ✓" : "Pengguna berhasil diperbarui ✓");
      } else {
        showToast(data.error || "Gagal menyimpan", "err");
      }
    } catch {
      showToast("Terjadi kesalahan", "err");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`Hapus pengguna ${user.name}?`)) return;
    try {
      const res = await fetch(`/api/users/${user.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        showToast("Pengguna dihapus ✓");
      } else {
        showToast(data.error || "Gagal menghapus", "err");
      }
    } catch {
      showToast("Gagal menghapus pengguna", "err");
    }
  };

  return (
    <div style={{ padding: "2.5rem" }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            zIndex: 9999,
            background: toast.type === "ok" ? "rgba(107,124,94,0.95)" : "rgba(180,60,60,0.95)",
            color: "#FDFAF4",
            padding: "1rem 1.25rem",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Check size={16} /> {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.75rem", color: "#1A1614", fontWeight: 700 }}>
            Kelola Pengguna Admin
          </h1>
          <p style={{ fontSize: "0.875rem", color: "#8B7355", marginTop: "0.25rem" }}>
            {loading ? "Memuat..." : `${users.length} akun admin terdaftar`}
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={fetchUsers}
            style={{ width: 40, height: 40, borderRadius: "0.5rem", border: "1px solid #E2D8C0", background: "#F5F0E4", color: "#8B7355", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button onClick={openCreate} className="btn-gold">
            <Plus size={16} /> Tambah Admin
          </button>
        </div>
      </div>

      {/* Security notice */}
      <div style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "0.75rem", padding: "1rem 1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "2rem" }}>
        <Shield size={18} style={{ color: "#C9A84C", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p style={{ fontFamily: "Cinzel, serif", fontSize: "0.65rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#A07830", fontWeight: 600, marginBottom: "0.25rem" }}>
            Keamanan Akun
          </p>
          <p style={{ fontSize: "0.82rem", color: "#8B7355" }}>
            Hanya Admin dan Super Admin yang dapat mengakses CMS. Halaman login tidak tersedia untuk umum. Gunakan password yang kuat (min. 8 karakter) dan ganti secara berkala.
          </p>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(26,22,20,0.7)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}
          onClick={(e) => e.target === e.currentTarget && setShowForm(false)}
        >
          <div className="card" style={{ width: "100%", maxWidth: "440px", padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Playfair Display, serif", fontSize: "1.25rem", color: "#1A1614" }}>
                {formMode === "create" ? "Tambah Admin Baru" : `Edit: ${editingUser?.name}`}
              </h2>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#8B7355" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  className="input-sacred"
                  placeholder="Nama admin"
                />
              </div>
              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  className="input-sacred"
                  placeholder="admin@paroki.id"
                />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.12em", color: "#C9A84C", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  Peran
                </label>
                <select
                  value={form.role}
                  onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as any }))}
                  className="input-sacred"
                >
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ flex: 1, padding: "0.75rem", borderRadius: "0.4rem", border: "1px solid #E2D8C0", background: "transparent", color: "#8B7355", cursor: "pointer", fontFamily: "Cinzel, serif", fontSize: "0.7rem", textTransform: "uppercase" }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="btn-gold"
                style={{ flex: 1, justifyContent: "center", opacity: saving ? 0.7 : 1 }}
              >
                {saving ? "Menyimpan..." : formMode === "create" ? "Buat Akun" : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users table */}
      <div className="card" style={{ overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: "3rem", textAlign: "center", color: "#B09878", fontFamily: "Cinzel, serif", fontSize: "0.8rem" }}>Memuat data...</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F5F0E4", borderBottom: "1px solid #E2D8C0" }}>
                {["Pengguna", "Email", "Peran", "Bergabung", "Aksi"].map((col) => (
                  <th key={col} style={{ padding: "0.875rem 1rem", textAlign: "left", fontFamily: "Cinzel, serif", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#8B7355", fontWeight: 600 }}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #E2D8C0" }}>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: "50%",
                          background: user.role === "superadmin" ? "rgba(201,168,76,0.15)" : "#F5F0E4",
                          border: `1px solid ${user.role === "superadmin" ? "rgba(201,168,76,0.3)" : "#E2D8C0"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <span style={{ fontFamily: "Playfair Display, serif", fontSize: "1rem", color: user.role === "superadmin" ? "#C9A84C" : "#8B7355" }}>
                          {user.name[0]?.toUpperCase()}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.9rem", color: "#1A1614", fontWeight: 500 }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.875rem", color: "#8B7355" }}>{user.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span
                      style={{
                        background: user.role === "superadmin" ? "rgba(201,168,76,0.12)" : "#F5F0E4",
                        color: user.role === "superadmin" ? "#A07830" : "#8B7355",
                        border: `1px solid ${user.role === "superadmin" ? "rgba(201,168,76,0.3)" : "#E2D8C0"}`,
                        padding: "0.2rem 0.6rem", borderRadius: "999px",
                        fontFamily: "Cinzel, serif", fontSize: "0.6rem", textTransform: "uppercase",
                        display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      }}
                    >
                      <Shield size={10} />
                      {user.role === "superadmin" ? "Super Admin" : "Admin"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", fontSize: "0.8rem", color: "#B09878" }}>
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "-"}
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        onClick={() => openEdit(user)}
                        style={{ width: 32, height: 32, borderRadius: "0.4rem", border: "1px solid rgba(201,168,76,0.25)", background: "rgba(201,168,76,0.1)", color: "#C9A84C", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        style={{ width: 32, height: 32, borderRadius: "0.4rem", border: "1px solid rgba(180,60,60,0.2)", background: "rgba(180,60,60,0.08)", color: "#b43c3c", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
