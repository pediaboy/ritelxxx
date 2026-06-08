# RITELCOMMUNITY.ID SCREENER

Premium stock screener untuk investor ritel Indonesia.

## Tech Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** + **Framer Motion**
- **Supabase** (PostgreSQL)
- **Vercel** (Hosting)
- **Cheerio + Axios** (Web Scraping)

## Pages
- `/` - Dashboard (IDX BUMN20 + Berita terbaru)
- `/news` - Halaman berita saham
- `/ownership` - Data company ownership IDX
- `/pricing` - Invoice VIP dengan timer 24 jam
- `/admin` - CMS Panel (password: pedia123)

## Setup
1. Clone repo
2. Copy `.env.example` ke `.env.local` dan isi credentials Supabase
3. Jalankan `npm install && npm run dev`

## Supabase Setup
Buat tabel `global_settings`:
```sql
CREATE TABLE global_settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO global_settings (key, value) VALUES
  ('vip_price', '299000'),
  ('bank_account', '1234567890'),
  ('bank_name', 'BCA'),
  ('bank_holder', 'THIRAFI THARIQ AL IDRIS'),
  ('wa_link', 'https://chat.whatsapp.com/invite/example')
ON CONFLICT (key) DO NOTHING;
```

## Development by THIRAFI THARIQ AL IDRIS
