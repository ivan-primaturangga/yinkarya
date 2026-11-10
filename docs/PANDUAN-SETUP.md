# Panduan Setup Yin Karya

Panduan ini menyiapkan akun dan kunci yang dibutuhkan. Jangan kirim nilai kunci lewat chat. Isi hanya di `.env.local` (lokal) dan Environment Variables Vercel.

## 1. Supabase (database, login admin, penyimpanan file)

1. Buka https://supabase.com lalu **Start your project** dan login (GitHub/email).
2. **New project**: isi nama `yinkarya`, buat database password (simpan di password manager), pilih region **Southeast Asia (Singapore)**, lalu **Create**. Tunggu sampai siap (±2 menit).
3. Buka **Project Settings → API**. Salin:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (rahasia, hanya untuk server, jangan dibagikan)
4. Buka **Authentication → Providers**: pastikan **Email** aktif. Matikan **Allow new users to sign up** setelah akun admin pertama dibuat.
5. Buka **Authentication → Users → Add user** untuk membuat akun admin pertama (email + password).
6. Storage dan tabel akan dibuat otomatis oleh file migrasi yang saya siapkan di repo. Anda tidak perlu membuatnya manual.

## 2. OpenAI Whisper (transkripsi suara)

1. Buka https://platform.openai.com dan login.
2. **Settings → Billing**: tambahkan saldo (minimal beberapa dolar; Whisper sangat murah, sekitar $0,006 per menit audio).
3. **API keys → Create new secret key**, beri nama `yinkarya`. Salin sekali saja → `OPENAI_API_KEY`.
4. Disarankan atur **limit bulanan** di Billing → Limits agar biaya terkendali.

## 3. Anthropic / Claude API (draf deskripsi dan terjemahan)

Anda menyebut kunci AI belum ada. Pembuatannya:

1. Buka https://console.anthropic.com dan login.
2. **Settings → Billing**: tambahkan kredit.
3. **API keys → Create Key**, beri nama `yinkarya`. Salin sekali saja → `ANTHROPIC_API_KEY`.
4. Atur limit pengeluaran bulanan.

Catatan: fitur AI akan saya buat opsional. Tanpa kunci, tombol "Buat draf AI" nonaktif dan semua pengisian tetap bisa manual.

## 4. Vercel (hosting)

1. Buka https://vercel.com dan login dengan GitHub yang sama (`ivan-primaturangga`).
2. **Add New → Project**, impor repo `yinkarya`, lalu **Deploy** setelah kode ada.
3. Di **Settings → Environment Variables** isi semua variabel di bawah untuk Production dan Preview.
4. Setelah punya domain, tambahkan di **Settings → Domains** lalu isi `NEXT_PUBLIC_SITE_URL`.

## 5. Variabel environment

Buat file `.env.local` di akar proyek (tidak ikut di-commit):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 6. Keamanan singkat

- Jangan commit `.env.local`. Saya akan memastikan `.gitignore` memuatnya.
- `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY` hanya dipakai di server.
- Jika sebuah kunci pernah terkirim ke chat atau repo, segera buat ulang kunci tersebut.
