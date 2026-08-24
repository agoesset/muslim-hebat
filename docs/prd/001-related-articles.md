# PRD 001 — Related Articles Endpoint

**Status:** Ready for implementation
**Author:** Agus Setiawan (via Hermes)
**Tanggal:** 2026-08-24
**Tipe:** Bounded (endpoint baru, mengikuti pola yang sudah ada)

---

## Goal

Pembaca yang selesai membaca satu artikel mendapat rekomendasi artikel lain yang relevan, sehingga betah menjelajah lebih lama di situs.

## Problem

Saat ini halaman detail artikel (`GET /api/public/articles/:slug`) adalah jalan buntu — tidak ada jalur menuju artikel berikutnya selain kembali ke daftar. Tidak ada endpoint rekomendasi sama sekali di codebase.

## User Story

> Sebagai pembaca yang baru selesai membaca sebuah artikel,
> saya ingin melihat beberapa artikel lain yang topiknya mirip,
> supaya saya bisa langsung lanjut membaca tanpa harus mencari sendiri.

---

## Scope

Satu endpoint publik baru:

```
GET /api/public/articles/:slug/related
```

### Query parameter

| Param | Tipe | Default | Batas | Keterangan |
|---|---|---|---|---|
| `limit` | string (angka) | 3 | 1–10 | Jumlah artikel yang dikembalikan |

### Logika relevansi

Artikel dianggap relevan bila memenuhi salah satu, dengan urutan prioritas:

1. **Prioritas 1** — punya minimal satu `tags` yang sama dengan artikel sumber
2. **Prioritas 2** — `category` sama dengan artikel sumber
3. **Pengisi** — bila hasil prioritas 1+2 belum mencukupi `limit`, lengkapi dengan artikel terbaru lainnya

Dalam setiap tingkat prioritas, urutkan berdasarkan `updatedAt` menurun (terbaru dulu), mengikuti `orderByUpdated` yang sudah dipakai endpoint lain.

---

## Acceptance Criteria

Endpoint dianggap selesai bila **semua** poin berikut terpenuhi dan terbukti lewat test:

- [ ] **AC1** — `GET /api/public/articles/:slug/related` mengembalikan `200` dengan array artikel
- [ ] **AC2** — Artikel sumber sendiri **tidak pernah** muncul di hasil
- [ ] **AC3** — Hanya artikel berstatus published yang muncul (memakai `publishedWhere` yang sudah ada)
- [ ] **AC4** — Artikel dengan tag yang sama muncul lebih dulu daripada yang hanya sekategori
- [ ] **AC5** — Bila kandidat relevan kurang dari `limit`, hasil dilengkapi artikel terbaru lain
- [ ] **AC6** — Tidak ada duplikat dalam hasil
- [ ] **AC7** — `?limit=5` mengembalikan maksimal 5 artikel
- [ ] **AC8** — `limit` di luar rentang 1–10 di-clamp, bukan error (`limit=99` → 10, `limit=0` → 1)
- [ ] **AC9** — `limit` non-numerik (`?limit=abc`) jatuh ke default 3, bukan error
- [ ] **AC10** — Slug tidak dikenal → `404` dengan pesan `"Article not found"`, konsisten dengan endpoint detail
- [ ] **AC11** — Artikel sumber berstatus draft → `404` (tidak bocor ke publik)
- [ ] **AC12** — Artikel tanpa tags dan tanpa category tetap `200`, diisi artikel terbaru lain
- [ ] **AC13** — Bila tidak ada artikel lain sama sekali → `200` dengan array kosong `[]`

---

## Out of Scope

Hal-hal berikut **tidak** dikerjakan pada PRD ini:

- Perubahan skema database / migrasi Prisma apa pun
- Perubahan pada frontend (`apps/web`)
- Sistem rekomendasi berbasis ML atau perilaku pembaca
- Caching atau optimasi performa
- Endpoint related untuk produk, kajian, atau kelas
- Perubahan pada endpoint `GET /api/public/articles/:slug` yang sudah ada
- Tracking analitik klik rekomendasi

---

## Non-Functional Requirements

| Aspek | Ketentuan |
|---|---|
| **Autentikasi** | Tidak perlu — endpoint publik, sejajar endpoint publik lain |
| **Rate limiting** | Ikut default global; tidak perlu `@Throttle` khusus (operasi baca) |
| **Efek samping** | **Nol** — tidak menaikkan `reads`, tidak menulis apa pun ke database |
| **Query database** | Maksimal 2 query; hindari N+1 |
| **Format respons** | Array objek `Article`, bentuknya sama persis dengan `GET public/articles` |
| **Penanganan error** | `NotFoundException` dari NestJS, konsisten dengan endpoint lain |

---

## Technical Context

**File yang kemungkinan disentuh:**

| Path | Aksi |
|---|---|
| `apps/api/src/content/content.controller.ts` | Tambah satu handler (referensi: baris 79–92 untuk pola detail) |
| `apps/api/src/content/content.controller.spec.ts` | Tambah test untuk AC1–AC13 |

**Pola yang wajib diikuti (sudah ada di codebase):**

- `publishedWhere` — filter artikel published
- `orderByUpdated` — urutan `updatedAt` menurun
- `parseTake(limit)` — parsing & clamping limit; **periksa dulu perilaku aslinya**, sesuaikan bila rentangnya berbeda dari 1–10
- `NotFoundException("Article not found")` — pola error endpoint detail

**Perintah verifikasi:**

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Keempatnya harus lulus tanpa error baru.

---

## Definition of Done

- [ ] Seluruh AC1–AC13 tercakup test yang lulus
- [ ] `lint`, `typecheck`, `test`, `build` lulus semua
- [ ] Tidak ada perubahan di luar dua file yang disebut di atas
- [ ] Tidak ada migrasi database
- [ ] PR terbuka dengan CI hijau
