// src/lib/db/schema.ts
import {
  mysqlTable,
  varchar,
  text,
  int,
  timestamp,
  boolean,
  datetime,
  mysqlEnum,
  primaryKey,
  date,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),
  role: mysqlEnum("role", ["admin", "superadmin"]).default("admin").notNull(),
  avatar: varchar("avatar", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Sessions (NextAuth) ──────────────────────────────────────────────────────
export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("session_token", { length: 255 }).primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  expires: datetime("expires").notNull(),
});

export const verificationTokens = mysqlTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: datetime("expires").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
  })
);

// ─── Kategori ─────────────────────────────────────────────────────────────────
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  color: varchar("color", { length: 7 }).default("#C9A84C"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Berita / Posts ───────────────────────────────────────────────────────────
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  coverImage: varchar("cover_image", { length: 500 }),
  categoryId: int("category_id"),
  authorId: varchar("author_id", { length: 36 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  isFeatured: boolean("is_featured").default(false),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Jadwal Misa ──────────────────────────────────────────────────────────────
export const massSchedules = mysqlTable("mass_schedules", {
  id: int("id").autoincrement().primaryKey(),
  dayOfWeek: mysqlEnum("day_of_week", [
    "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu",
  ]).notNull(),
  time: varchar("time", { length: 10 }).notNull(), // HH:MM
  location: varchar("location", { length: 255 }).notNull(),
  celebrant: varchar("celebrant", { length: 255 }),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Misa Khusus / Events ────────────────────────────────────────────────────
export const specialEvents = mysqlTable("special_events", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  eventDate: date("event_date").notNull(),
  eventTime: varchar("event_time", { length: 10 }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  liturgicalSeason: varchar("liturgical_season", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Warta Paroki ─────────────────────────────────────────────────────────────
export const warta = mysqlTable("warta", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  editionDate: date("edition_date").notNull(),
  fileUrl: varchar("file_url", { length: 500 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Pengumuman ───────────────────────────────────────────────────────────────
export const announcements = mysqlTable("announcements", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  priority: mysqlEnum("priority", ["low", "normal", "high"]).default("normal"),
  startDate: date("start_date"),
  endDate: date("end_date"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Pengaturan Website ───────────────────────────────────────────────────────
export const settings = mysqlTable("settings", {
  key: varchar("key", { length: 100 }).primaryKey(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
});

// ─── Galeri ──────────────────────────────────────────────────────────────────
export const gallery = mysqlTable("gallery", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }).default("umum"),
  isFeatured: boolean("is_featured").default(false),
  sortOrder: int("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
