# Homegrown4Heroes Next.js Website + Member Community

This project contains the public marketing website plus the first application phase:

- Supabase email/password authentication
- Email confirmation
- Discord-name based manual approval workflow
- Approved-member route protection
- Small channel-based community with realtime message updates
- Daily shared menu
- Member order form
- Admin dashboard for approvals, menus, and orders
- Mail-app handoff for order emails (no third-party email service required)

## 1. Install and run the public site

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## 2. Create a Supabase project

Create a free Supabase project, then open **SQL Editor** and run:

`supabase/migrations/001_initial_schema.sql`

Copy `.env.example` to `.env.local` and add the project URL and publishable key:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

In Supabase Authentication URL settings, add:

- Site URL: `http://localhost:3000`
- Redirect URL: `http://localhost:3000/auth/callback`

Use the Vercel production domain equivalents later.

## 3. Create the first administrator

Sign up through `/signup`, confirm the email, and then run the final commented SQL statement in the migration with your email address. This sets your profile to `approved` and `admin`.

## 4. Test the workflow

1. Administrator signs up and is promoted through SQL.
2. A second test user signs up with a Discord name.
3. Administrator opens `/admin` and changes the test member from Pending to Approved.
4. Approved member signs in at `/login` and reaches `/community/hub`.
5. Administrator publishes today's menu.
6. Member posts messages and submits an order.

## 5. Order email workflow

When a member submits an order, the app first saves it in Supabase. It then opens the member's default email application with a pre-filled message addressed to:

- To: `thvlynchburg@homegrown4heroes.org`
- CC: `jennifer@homegrown4heroes.org`

The member reviews the message and presses Send. No Resend account, API key, or email-domain DNS setup is required.

## Important production notes

- Review every RLS policy before launch.
- Enable stronger spam/rate controls before opening signup broadly.
- Add password reset and account-rejection email flows in the next phase.
- Keep `SUPABASE_SERVICE_ROLE_KEY` out of browser code. This scaffold does not require it.
- Vercel environment variables must be added separately for Preview and Production.

## Member experience v5

This version refines the private application without requiring another database migration:

- responsive channel-based community with realtime messages
- prominent daily menu and guided ordering flow
- member order history and status visibility
- admin summary cards and pending-member approval queue
- quick approve/reject controls
- menu publishing designed for nontechnical administrators
- order status management and member directory

Existing Supabase tables and policies from `001_initial_schema.sql` support these features.


## v7 additions
- Real partner and 2026 endorser logo grids
- Sponsorship and 2026 Endorsements pages
- Main photo homepage hero
- Additional supplied photography and video
