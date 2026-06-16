# Monitoring & Alerting

## Health Checks

Setiap service utama memiliki Docker healthcheck:

- `postgres` — `pg_isready`
- `api` — `GET http://localhost:3000/health` (DB check via Prisma)
- `web` — `GET http://localhost:80/health` (proxy ke API)

Lihat status:

```bash
docker compose ps
```

## Prometheus Metrics

Endpoint tersedia di `/api/metrics`:

- `http_requests_total` — counter by method/route/status
- `http_request_duration_seconds` — histogram latensi
- default Node.js metrics (`process_cpu_*`, `process_memory_*`, dll.)

Gunakan Prometheus untuk scrape target `api:3000/api/metrics`.

## Uptime Monitor

`scripts/monitor.sh` atau container `monitor` memeriksa setiap 60 detik:

- `GET /health` (200)
- `GET /api/public/articles?limit=1` (200)
- `GET /` (200)

Jika salah satu gagal, script mencetak alert dan mengirim webhook jika dikonfigurasi.

### Konfigurasi alert

```bash
ALERT_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Untuk Docker Compose:

```bash
MONITOR_URL=http://web
ALERT_WEBHOOK=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Jalankan manual

```bash
./scripts/monitor.sh
```
