# Deploy Muslim Hebat ke VPS (Docker only)

Stack: Caddy (HTTPS) → Nginx `web` → Nest `api` → Postgres. Heroku tidak dipakai.

## 1. Siapkan VPS

Ubuntu 22.04/24.04, 1 vCPU / 1 GB RAM cukup.

```sh
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
```

Log out/in, lalu cek `docker compose version`.

Buka firewall: **22, 80, 443**. Jangan buka 5432.

## 2. Clone dan isi env

```sh
git clone https://github.com/agoesset/muslim-hebat.git
cd muslim-hebat
cp .env.example .env
nano .env
```

Wajib diganti (jangan placeholder):

- `POSTGRES_PASSWORD` — panjang, unik
- `JWT_SECRET` — minimal 32 karakter
- `SITE_HOST=muslimhebat.com`
- `SITE_URL=https://muslimhebat.com`
- `VITE_SITE_URL=https://muslimhebat.com`
- `WEB_ORIGIN=https://muslimhebat.com`
- `ACME_EMAIL` — email kamu (Let's Encrypt)
- `METRICS_TOKEN`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` kalau mau seed

`VITE_*` di-bake saat `docker compose build`. Ganti domain → build ulang.

## 3. DNS + Cloudflare

Di Cloudflare, record A:

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `@` | IP VPS | DNS only (abu-abu) dulu |
| A | `www` | IP VPS | DNS only |

Matikan proxy (awan oranye) untuk **sertifikat pertama**. Setelah `https://muslimhebat.com` hijau:

- SSL/TLS mode: **Full (strict)**
- Proxy boleh dihidupkan lagi (awan oranye)

Kalau proxy tetap oranye dari awal, Let's Encrypt sering gagal.

## 4. Deploy

```sh
scripts/vps-deploy.sh
```

Atau:

```sh
docker compose up --build -d
```

API menjalankan `prisma migrate deploy` saat start.

Cek:

```sh
docker compose ps
curl -fsS https://muslimhebat.com/health
curl -fsS https://muslimhebat.com/health/ready
curl -fsS https://muslimhebat.com/sitemap.xml | head
```

Seed admin (hanya first deploy, kalau DB kosong):

```sh
docker compose exec api npm run seed
```

## 5. Pindah data dari Heroku

Di laptop (butuh Heroku CLI + akses app `muslimhebat`):

```sh
scripts/export-heroku-db.sh
scp backups/heroku-*.dump user@VPS_IP:~/muslim-hebat/backups/
```

Di VPS:

```sh
scripts/import-postgres-dump.sh backups/heroku-XXXX.dump
```

Upload file lama di Heroku tidak ikut dump. Salin terpisah kalau ada.

## 6. Update berikutnya

```sh
cd muslim-hebat
git pull
scripts/vps-deploy.sh
```

## 7. Matikan Heroku

Setelah DNS sudah 24 jam di VPS dan cek di atas lulus:

```sh
heroku ps:scale web=0 --app muslimhebat
```

Jangan destroy dulu sampai yakin backup VPS jalan (`docker compose exec backup ls -la /backups`).
