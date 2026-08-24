# PRD 002 — Perbaikan Bug Komponen Skeleton & Import Test

**Status:** Ready for implementation
**Author:** Hermes (tech lead)
**Tanggal:** 2026-08-24
**Tipe:** Bugfix (bounded)
**Asal temuan:** PR #23 — ditemukan saat menulis test komponen, sengaja tidak diperbaiki di sana agar test PR tetap murni.

---

## Goal

Memperbaiki tiga bug nyata di frontend yang saat ini memengaruhi tampilan loading state.

## Problem

### Bug 1 — `Skeleton` membuang prop `style` (severity: MEDIUM)

`apps/web/src/Skeleton.jsx:3` menerima hanya empat prop:

```jsx
export function Skeleton({ width, height, circle = false, className = "" })
```

Padahal **21 pemanggil** mengoper `style`. Prop itu tidak pernah dibaca, jadi dibuang tanpa peringatan.

Dampak nyata pada tampilan:

| Pemanggil | Yang hilang | Akibat visual |
|---|---|---|
| `SkeletonArticle:56` | `width: "60%"`, `marginBottom: 16` | Skeleton judul artikel jadi 100% lebar, tidak ada jarak bawah |
| `SkeletonArticle:58` | `marginTop: 24`, `borderRadius` | Blok gambar menempel, sudut tajam |
| `SkeletonKajianRow:68,70,71,72,75,76` | `borderRadius`, `width` persentase | Semua sudut tajam, semua baris 100% lebar |
| `SkeletonBatchCard:86,88,89,92,93,96` | `borderRadius`, `width` persentase | Sama seperti di atas |
| `LazyImage:61` | `position: absolute`, `inset: 0`, `borderRadius: 0` | Placeholder tidak menutupi container |

### Bug 2 — Import rapuh di test lama (severity: LOW)

`apps/web/src/api/public.test.js:19` mengimpor `"../api.js"`, padahal file sebenarnya `apps/web/src/api.ts`. Ini hanya berfungsi berkat fallback resolusi vite di mode node. Karena itulah `vite.config.js` terpaksa memakai `environmentMatchGlobs` alih-alih `environment: "jsdom"` global.

### Bug 3 — `Skeleton` memakai `||` alih-alih `??` (severity: LOW)

`Skeleton.jsx:7` memakai `width || "100%"`. Nilai `0` adalah falsy, sehingga `width={0}` jatuh ke `"100%"`. Belum ada pemanggil yang terdampak, tapi ini jebakan.

---

## User Story

Sebagai pembaca yang membuka halaman dengan koneksi lambat, saya melihat placeholder loading yang bentuknya menyerupai konten aslinya, sehingga perpindahan dari loading ke konten tidak terasa melompat.

---

## Acceptance Criteria

**Bug 1 — prop `style`**

- **AC1** — `Skeleton` menerima prop `style` dan menerapkannya pada elemen yang dirender.
- **AC2** — `style` yang dioper menimpa nilai default. Contoh: `<Skeleton width={100} style={{ width: "60%" }} />` menghasilkan lebar akhir `60%`.
- **AC3** — Properti dalam `style` yang tidak berkaitan dengan `width`/`height` (misal `marginBottom`, `borderRadius`, `position`, `inset`) diterapkan apa adanya.
- **AC4** — Memanggil `Skeleton` tanpa `style` berperilaku sama persis seperti sebelumnya.
- **AC5** — Test `"should ignore an unsupported style prop"` di `Skeleton.test.jsx:58` diperbarui menjadi test yang membuktikan `style` **diterapkan**, bukan diabaikan. Nama test disesuaikan.

**Bug 2 — import**

- **AC6** — `apps/web/src/api/public.test.js` mengimpor path yang benar, tanpa mengandalkan fallback resolusi.
- **AC7** — Setelah AC6, `vite.config.js` dapat memakai `environment: "jsdom"` global dan seluruh test tetap lulus. Bila ternyata masih ada test lain yang bergantung mode node, pertahankan `environmentMatchGlobs` dan **laporkan alasannya**.

**Bug 3 — nullish coalescing**

- **AC8** — `width={0}` menghasilkan lebar `0`, bukan `"100%"`.
- **AC9** — `height={0}` menghasilkan tinggi `0`, bukan `"1em"`.
- **AC10** — `width`/`height` yang `undefined` tetap memakai default `"100%"`/`"1em"`.

**Umum**

- **AC11** — Seluruh 104 test yang ada tetap lulus (kecuali AC5 yang memang diubah maksudnya).
- **AC12** — Tidak ada perubahan pada `apps/api`.

---

## Out of Scope

- Mengubah desain atau nilai styling apa pun di luar yang disebut di atas
- Refactor komponen Skeleton lainnya (`SkeletonText`, `SkeletonCard`, `SkeletonGrid`)
- Menambah dependency baru
- Perubahan pada backend

---

## Non-Functional Requirements

- Tidak ada perubahan perilaku selain perbaikan bug yang disebutkan
- Tidak ada dependency baru
- Gate wajib lulus: `./scripts/agent-gate.sh web`

---

## Technical Context

**File yang boleh diubah:**

- `apps/web/src/Skeleton.jsx`
- `apps/web/src/Skeleton.test.jsx`
- `apps/web/src/api/public.test.js`
- `apps/web/vite.config.js` (hanya bila AC7 memungkinkan)

**Pola yang sudah benar** ada di komponen tetangga pada file yang sama:

```jsx
export function SkeletonCard({ children, style = {} }) {
  return <div className="skeleton skeleton-card" style={{ padding: 0, ...style }}>{children}</div>;
}
```

Ikuti pola itu: default dulu, lalu `...style` di akhir supaya bisa menimpa.

---

## Definition of Done

- [ ] AC1–AC12 terpenuhi
- [ ] `./scripts/agent-gate.sh web` lulus
- [ ] Tidak ada file di luar allowlist yang berubah
- [ ] Jumlah test tidak berkurang dari 104
