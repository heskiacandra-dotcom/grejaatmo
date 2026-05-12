// scripts/seed.ts
// Database seeding script — run with: npx tsx scripts/seed.ts
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const DB_CONFIG = {
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "3306"),
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "gereja_atmodirono",
  multipleStatements: true,
};

async function seed() {
  console.log("🌱 Starting database seed...");

  // 1. Create database if not exists
  const rootConn = await mysql.createConnection({
    ...DB_CONFIG,
    database: undefined,
  });

  await rootConn.query(
    `CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
  );
  console.log(`✅ Database '${DB_CONFIG.database}' ready`);
  await rootConn.end();

  // 2. Connect to database
  const conn = await mysql.createConnection(DB_CONFIG);
  console.log("✅ Connected to MySQL");

  // 3. Create tables
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(36) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255),
      role ENUM('admin','superadmin') DEFAULT 'admin' NOT NULL,
      avatar VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      color VARCHAR(7) DEFAULT '#C9A84C',
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(500) NOT NULL,
      slug VARCHAR(500) NOT NULL UNIQUE,
      excerpt TEXT,
      content TEXT NOT NULL,
      cover_image VARCHAR(500),
      category_id INT,
      author_id VARCHAR(36) NOT NULL,
      status ENUM('draft','published','archived') DEFAULT 'draft' NOT NULL,
      is_featured TINYINT(1) DEFAULT 0,
      published_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS mass_schedules (
      id INT AUTO_INCREMENT PRIMARY KEY,
      day_of_week ENUM('Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu') NOT NULL,
      time VARCHAR(10) NOT NULL,
      location VARCHAR(255) NOT NULL,
      celebrant VARCHAR(255),
      notes TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS special_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      event_date DATE NOT NULL,
      event_time VARCHAR(10),
      location VARCHAR(255),
      description TEXT,
      liturgical_season VARCHAR(100),
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS warta (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      edition_date DATE NOT NULL,
      file_url VARCHAR(500) NOT NULL,
      thumbnail VARCHAR(500),
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS announcements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      priority ENUM('low','normal','high') DEFAULT 'normal',
      start_date DATE,
      end_date DATE,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS settings (
      \`key\` VARCHAR(100) PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

    CREATE TABLE IF NOT EXISTS gallery (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255),
      image_url VARCHAR(500) NOT NULL,
      category VARCHAR(100) DEFAULT 'umum',
      is_featured TINYINT(1) DEFAULT 0,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  console.log("✅ All tables created");

  // 4. Seed admin user
  const adminId = randomUUID();
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await conn.query(
    `INSERT IGNORE INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)`,
    [adminId, "Administrator Paroki", "admin@paroki.id", hashedPassword, "superadmin"]
  );
  console.log("✅ Admin user created: admin@paroki.id / admin123");

  // 5. Seed categories
  await conn.query(`
    INSERT IGNORE INTO categories (name, slug, color) VALUES
    ('Kegiatan Paroki', 'kegiatan-paroki', '#C9A84C'),
    ('Kaum Muda', 'kaum-muda', '#7C9C6E'),
    ('Sosial', 'sosial', '#6B9BC9'),
    ('Iman & Spiritualitas', 'iman-spiritualitas', '#9B6B9B'),
    ('Pengumuman', 'pengumuman', '#C9A84C');
  `);
  console.log("✅ Categories seeded");

  // 6. Seed mass schedules
  await conn.query(`DELETE FROM mass_schedules;`);
  await conn.query(`
    INSERT INTO mass_schedules (day_of_week, time, location, celebrant, notes, is_active) VALUES
    ('Senin', '06:00', 'Gereja Paroki', 'Rm. Andreas Wahyu, Pr', 'Misa Harian', 1),
    ('Selasa', '06:00', 'Gereja Paroki', 'Rm. Benediktus Surya, Pr', 'Misa Harian', 1),
    ('Rabu', '06:00', 'Gereja Paroki', 'Rm. Andreas Wahyu, Pr', 'Misa Harian', 1),
    ('Kamis', '06:00', 'Gereja Paroki', 'Rm. Benediktus Surya, Pr', 'Misa Harian', 1),
    ('Jumat', '06:00', 'Gereja Paroki', 'Rm. Andreas Wahyu, Pr', 'Misa Harian', 1),
    ('Sabtu', '06:00', 'Gereja Paroki', 'Rm. Benediktus Surya, Pr', 'Misa Harian', 1),
    ('Sabtu', '17:00', 'Gereja Paroki', 'Rm. Andreas Wahyu, Pr', 'Misa Sabtu Sore (Vigili Minggu)', 1),
    ('Minggu', '07:00', 'Gereja Paroki', 'Rm. Benediktus Surya, Pr', 'Misa Minggu Pertama', 1),
    ('Minggu', '09:00', 'Gereja Paroki', 'Rm. Andreas Wahyu, Pr', 'Misa Minggu Bahasa Indonesia', 1),
    ('Minggu', '17:00', 'Gereja Paroki', 'Rm. Benediktus Surya, Pr', 'Misa Minggu Sore', 1);
  `);
  console.log("✅ Mass schedules seeded");

  // 7. Seed announcements
  await conn.query(`
    INSERT IGNORE INTO announcements (title, content, priority, is_active) VALUES
    ('Perubahan Jadwal Misa Minggu Pertama Bulan Mei', 'Misa Minggu pertama bulan Mei akan dimulai pukul 08.00 WIB.', 'high', 1),
    ('Pendaftaran Baptis Bayi Bulan Juni 2025', 'Pendaftaran baptis bayi untuk bulan Juni dibuka mulai 5 Mei 2025.', 'normal', 1),
    ('Kolekte Khusus: Dana Pembangunan Gereja', 'Akan ada kolekte khusus untuk dana pembangunan renovasi Gereja.', 'normal', 1);
  `);
  console.log("✅ Announcements seeded");

  // 8. Seed settings
  await conn.query(`
    INSERT INTO settings (\`key\`, value) VALUES
    ('site_name', 'Paroki Keluarga Kudus Atmodirono'),
    ('site_tagline', 'Komunitas Iman dalam Semangat Keluarga Kudus Nazaret'),
    ('contact_phone', '(024) 8317XXX'),
    ('contact_email', 'info@paroki-keluargakudus.id'),
    ('address', 'Jl. Atmodirono, Wonodri, Kec. Semarang Selatan, Kota Semarang'),
    ('office_hours', 'Senin – Sabtu: 08.00 – 16.00 WIB')
    ON DUPLICATE KEY UPDATE value = VALUES(value);
  `);
  console.log("✅ Settings seeded");

  await conn.end();
  console.log("\n🎉 Database seeded successfully!");
  console.log("📧 Admin login: admin@paroki.id");
  console.log("🔑 Password: admin123");
  console.log("\n⚠️  GANTI PASSWORD SETELAH LOGIN PERTAMA!");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
