# PASAL Portal — Supabase Setup Guide

Follow these steps **once** to connect the portal to a live Supabase database.

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (free account works fine)
2. Click **New project**
3. Fill in:
   - **Name**: `PASAL Portal`
   - **Database password**: choose a strong password (save it!)
   - **Region**: pick one close to Ghana (e.g. `Europe West` or `US East`)
4. Click **Create new project** — wait ~1 min for it to initialize

---

## Step 2 — Run the Database Schema

1. In your project sidebar go to **SQL Editor**
2. Click **New query**
3. Open the file [`supabase-schema.sql`](./supabase-schema.sql) from your project root
4. **Copy the entire contents** and paste into the SQL Editor
5. Click **Run** (green button)

✅ This creates all 6 tables (`concerns`, `suggestions`, `opportunities`, `events`, `announcements`, `admins`) plus the `increment_likes` function and all Row Level Security policies.

---

## Step 3 — Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL** (e.g. `https://abcxyz.supabase.co`)
   - **anon / public key** (the long `eyJ...` string under "Project API keys")

---

## Step 4 — Configure Local Environment

In your project folder, create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never commit `.env.local` to Git** — it's already in `.gitignore`

Then restart your dev server:
```bash
npm run dev
```

---

## Step 5 — Create Your Admin User

1. In Supabase → **Authentication** → **Users** → click **Invite user**
2. Enter the email address you want to use as admin (e.g. `admin@pasal.ug.edu.gh`)
3. Check your email and **accept the invite** — this sets your password
4. Copy the **User UID** from the Users table (the `id` column)
5. Go back to **SQL Editor** and run:

```sql
INSERT INTO public.admins (id, email)
VALUES ('PASTE-YOUR-USER-UUID-HERE', 'admin@pasal.ug.edu.gh');
```

✅ You can now log in at `/admin/login` with that email and password.

---

## Step 6 — Deploy to Vercel

1. Push your project to GitHub
2. Go to [https://vercel.com](https://vercel.com) → **New Project** → import your GitHub repo
3. Under **Environment Variables**, add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |

4. Click **Deploy**

After deployment, go back to Supabase → **Authentication** → **URL Configuration** and set:
- **Site URL**: `https://your-app.vercel.app`
- **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Step 7 — Update OG Metadata URL

Once you have your Vercel URL, update this line in [`src/app/layout.tsx`](./src/app/layout.tsx):

```ts
metadataBase: new URL("https://your-actual-domain.vercel.app"),
```

---

## Security Notes

| Feature | How it's handled |
|---------|-----------------|
| Admin auth | Supabase Auth (email + password) |
| Admin-only writes | Row Level Security (RLS) policies — all write operations require `auth.role() = 'authenticated'` |
| Public reads | All tables allow `SELECT` without authentication |
| Student submissions | `concerns` and `suggestions` allow public `INSERT` |
| Likes | `increment_likes` RPC function with `SECURITY DEFINER` |

---

## Troubleshooting

**Portal still shows demo data after adding keys?**
→ Clear your browser's localStorage: Open DevTools → Application → Local Storage → Clear all `pasal_*` keys, then refresh.

**Admin login not working after Supabase setup?**
→ Make sure you ran the `INSERT INTO public.admins` SQL in Step 5. The portal checks this table to verify admin status.

**RLS policy errors in Supabase logs?**
→ Check the table policies under Database → Tables → [table name] → Policies.
