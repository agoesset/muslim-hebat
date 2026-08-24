# AGENTS.md — muslim-hebat

Konstitusi repo untuk semua agent (Claude Code, Codex, Hermes). Baca sebelum menyentuh kode.

## Struktur

```
apps/api/    NestJS + Prisma + PostgreSQL   (@muslim-hebat/api)
apps/web/    React + Vite                   (@muslim-hebat/web)
docs/prd/    PRD per fitur, sumber kebenaran acceptance criteria
```

Monorepo npm workspaces. Selalu jalankan perintah dengan `-w @muslim-hebat/api` atau `-w @muslim-hebat/web`.

## Perintah

| Tujuan | Perintah |
|---|---|
| Test | `npm run test -w @muslim-hebat/api` |
| Lint | `npm run lint -w @muslim-hebat/api` |
| Typecheck | `npm run typecheck -w @muslim-hebat/api` |
| Build | `npm run build -w @muslim-hebat/api` |
| Generate Prisma | `npm run db:generate` |

Ganti `api` dengan `web` untuk frontend.

**Wajib:** setelah menyentuh `schema.prisma` atau setelah `npm ci`, jalankan `npm run db:generate` sebelum typecheck. Tanpa itu TypeScript gagal dengan `TS2305: Module '@prisma/client' has no exported member`.

## Aturan Keras

**Jangan pernah:**
- Commit langsung ke `main` — selalu lewat branch `feat/...` atau `fix/...` dan PR
- Mengubah `apps/*/.env` atau file kredensial apa pun
- Menjalankan `prisma migrate` tanpa instruksi eksplisit
- Menambah dependency baru tanpa persetujuan
- Menyentuh file di luar allowlist yang diberikan dalam brief

**Selalu:**
- Tulis test yang gagal lebih dulu, baru implementasi (TDD)
- Jalankan lint + typecheck + test sebelum menyatakan selesai
- Ikuti pola yang sudah ada di file yang sedang diedit

## Konvensi Backend (NestJS)

Controller memakai helper bersama yang sudah ada di `content.controller.ts`:

| Helper | Guna | Catatan |
|---|---|---|
| `publishedWhere` | filter `status: "PUBLISHED"` | selalu pakai untuk endpoint publik |
| `orderByUpdated` | urut `updatedAt` desc | urutan default daftar |
| `parseNumber` | parse aman, `undefined` bila NaN | |
| `parseTake` | default 50, clamp 0–50 | **jangan diubah** — dipakai banyak endpoint |
| `parseSkip` | default 0 | |

Kalau butuh rentang limit berbeda, **buat helper baru**, jangan modifikasi yang lama.

**Prisma:** anotasi tipe eksplisit pada parameter callback. Jangan mengandalkan inferensi — CI menjalankan `tsc` dalam kondisi berbeda dari lokal.

```ts
import type { Article } from "@prisma/client";
items.map((article: Article) => article.id)   // benar
items.map((article) => article.id)            // gagal di CI: TS7006
```

**Error:** `throw new NotFoundException("Article not found")` — pesan konsisten dengan endpoint sejenis.

**Endpoint publik bersifat read-only** kecuali memang dirancang menulis. Jangan menambah efek samping (increment counter, audit) pada endpoint baca.

**Batasi setiap query.** Setiap `findMany` wajib punya `take`. Query tanpa batas akan menarik seluruh tabel begitu data tumbuh.

## Konvensi Frontend (React + Vite)

- Komponen `.jsx` di `apps/web/src/`
- Panggilan API lewat helper di `src/api/`, jangan `fetch` langsung di komponen
- Test pakai vitest (`*.test.js`), jalankan `npm run test -w @muslim-hebat/web`
- Desain: cream `#FAF6ED`, ink `#1A1A18`, bottom nav fixed

## Alur Kerja

1. PRD ada di `docs/prd/NNN-slug.md` — acceptance criteria bernomor adalah definisi "selesai"
2. Kerja di worktree terisolasi: `.worktrees/<nama>` (sudah di-gitignore)
3. TDD: test gagal → implementasi → test lulus
4. Verifikasi: lint + typecheck + test + build
5. Commit dengan pesan yang menjelaskan **kenapa**, rujuk PRD
6. PR ke `main`, tunggu CI hijau

## CI

`.github/workflows/ci.yml` menjalankan berurutan:

```
npm ci → npm run db:generate → lint → typecheck → test → build
```

Kalau CI merah tapi lokal hijau: reproduksi dari salinan bersih tanpa `node_modules`, jangan menebak.

## Test

Baseline saat ini: **65 test API**, **19 test web**. Jumlah ini tidak boleh turun.

Cakupan test wajib menyertakan kasus tepi: input di luar rentang, input non-numerik, tidak ditemukan, hasil kosong, dan bukti tidak ada efek samping.
