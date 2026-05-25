import { PrismaClient } from "@prisma/client";
import bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@muslimhebat.local";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Admin Muslim Hebat", passwordHash }
  });

  await prisma.siteSetting.upsert({
    where: { key: "theme" },
    update: { value: { palette: "cool", density: "cozy", font: "grotesk", illustrations: true } },
    create: { key: "theme", value: { palette: "cool", density: "cozy", font: "grotesk", illustrations: true } }
  });

  await prisma.article.upsert({
    where: { slug: "hal-kecil-bikin-tenang" },
    update: {},
    create: {
      slug: "hal-kecil-bikin-tenang",
      title: "5 hal kecil yang bikin hati lebih tenang saat overwhelmed",
      excerpt: "Spoiler: bukan tentang langsung jadi orang yang super tenang.",
      body: "Mulai dari hal kecil, ulangi pelan-pelan, dan jaga niat baiknya.",
      category: "Self-growth",
      author: "Nadia R.",
      color: "var(--peach)",
      emoji: "🌿",
      status: "PUBLISHED",
      publishedAt: new Date()
    }
  });

  await prisma.product.upsert({
    where: { slug: "jurnal-ramadhan-30-hari" },
    update: {},
    create: {
      slug: "jurnal-ramadhan-30-hari",
      name: "Jurnal Ramadhan 30 Hari",
      excerpt: "Tracker amal yaumiyyah 30 hari + space refleksi harian.",
      description: "Printable digital untuk membantu ibadah harian lebih konsisten.",
      category: "Worksheet",
      priceCents: 3900000,
      color: "var(--peach)",
      emoji: "📓",
      status: "PUBLISHED"
    }
  });

  await prisma.kajianEvent.upsert({
    where: { slug: "tafsir-surat-al-kahfi" },
    update: {},
    create: {
      slug: "tafsir-surat-al-kahfi",
      title: "Tafsir Surat Al-Kahfi",
      excerpt: "Kajian rutin pekanan untuk tadabbur surat Al-Kahfi.",
      speaker: "Ust. Adi Hidayat",
      location: "Masjid Istiqlal · Jakarta",
      eventType: "Offline",
      startsAt: new Date("2026-05-22T11:10:00.000Z"),
      color: "var(--sage)",
      status: "PUBLISHED"
    }
  });

  await prisma.course.upsert({
    where: { slug: "kelas-tahsin-pemula" },
    update: {},
    create: {
      slug: "kelas-tahsin-pemula",
      title: "Kelas Tahsin Pemula",
      excerpt: "Belajar membaca Al-Qur'an dari nol dengan mentor.",
      description: "12 sesi live dan rekaman untuk pemula.",
      category: "Tahsin",
      level: "Pemula",
      format: "Live Zoom",
      priceCents: 24900000,
      color: "var(--sage)",
      status: "PUBLISHED"
    }
  });

  console.log(`Seeded admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
