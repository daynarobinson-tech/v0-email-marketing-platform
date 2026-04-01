# Bloom

Bloom is a hybrid Web2 + Web3 email marketing platform that turns subscriber engagement into redeemable value.

Subscribers earn platform tokens for meaningful email interactions like opens and clicks. Senders use those tokens to drive higher engagement, stronger retention, and more sales by offering discounts, store credit, shipping perks, and other incentives inside their own ecosystem. Behind the scenes, Bloom uses blockchain rails for auditable consent, token allocation, and reward distribution while keeping the user experience familiar and simple.

Built for the PL_Genesis: Frontiers of Collaboration Hackathon, Bloom explores a collaboration primitive for marketing: aligning subscriber attention and sender incentives through verifiable, programmable rewards.

## Why This Matters

Email is still one of the highest-ROI channels in digital commerce, but the relationship between senders and subscribers is broken:

- Subscribers are asked for attention and data but receive little direct value in return.
- Brands struggle with low engagement, weak trust, and rising acquisition costs.
- Consent and reward programs are often fragmented, opaque, and difficult to audit.

Bloom reframes email as a two-sided value exchange:

- Subscribers are rewarded for genuine engagement.
- Senders increase opens, clicks, and downstream conversions.
- Consent and token activity can be tracked using blockchain infrastructure for stronger trust and compliance.

## Business Model

Bloom is designed as a subscription software product with a closed-loop token economy inside the platform.

### How Bloom Makes Money

- Senders subscribe to Bloom as a SaaS platform.
- A percentage of that subscription payment is allocated toward the sender's token inventory inside Bloom.
- That in-platform balance is what the sender sees and uses to fund subscriber rewards.
- Senders can purchase additional token inventory whenever they want to support more campaigns or richer incentives.

Bloom therefore has multiple revenue layers:

- subscription revenue
- additional in-platform token purchases
- future premium features such as analytics, compliance tooling, and enterprise controls

### Closed-Loop Token Model

Bloom tokens are designed to stay inside the Bloom ecosystem:

- senders use them to incentivize email engagement
- subscribers earn them through opens and clicks
- subscribers redeem them for discounts, credits, shipping perks, and other benefits inside the sender's ecosystem
- the token does not need to leave Bloom to create value

This keeps the system easy to understand for mainstream users while still benefiting from programmable blockchain-backed accounting.

### How Sponsors And Infrastructure Partners Make Money

The infrastructure and sponsor layer beneath Bloom can make money through the rails they provide:

- transaction fees
- wallet infrastructure and identity tooling
- developer platform or API usage
- ecosystem growth and enterprise partnerships

In Bloom's model, sponsors create value by enabling:

- onchain consent records
- token allocation and token distribution events
- wallet-linked identity and rewards
- auditable redemption and compliance trails

So Bloom monetizes the application and business outcome, while the underlying Web3 stack monetizes trust, verification, and transactions.

## Hackathon Fit

Bloom is designed to fit the spirit of PL_Genesis: Frontiers of Collaboration by focusing on open coordination, digital trust, and real-world incentive design across Web2 and Web3.

This project sits at the intersection of:

- `Web3`: auditable token allocation, identity-linked rewards, and compliance primitives
- `Crypto / Economic Systems`: incentive design for healthier sender-subscriber relationships
- `Digital Human Rights`: consent tracking and transparent reward distribution

It also aligns well with sponsor-style infrastructure challenges by using:

- `Flow` for wallet-connected reward identity and token-oriented loyalty abstractions
- `World ID` for human verification / sybil resistance
- `Supabase` for product data, auth, and rapid iteration
- `Next.js` for the application layer and polished demo UX

## Core Product Vision

Bloom is not trying to force end users to think like crypto users.

The intended experience is:

- The sender signs up and receives an initial token allocation.
- The sender creates campaigns and decides how many tokens each interaction is worth.
- The subscriber signs up like they would for any normal email list.
- The subscriber earns tokens through opens and clicks.
- The subscriber redeems those tokens for partial-value rewards inside the sender's own ecosystem.
- The chain handles trust, proof, and distribution rails in the background.

This is the key product thesis:

- Web2 handles usability.
- Web3 handles trust, accounting, and programmable incentives.

## Consent Ledger And Audits

One of Bloom's strongest differentiators is the idea that every subscriber opt-in can be recorded to a ledger on the blockchain.

That ledger can create a durable record of:

- who subscribed
- when they subscribed
- which sender or campaign they subscribed through
- when rewards were distributed
- how redemption activity occurred over time

This matters because audits become much stronger when Bloom can show an immutable, time-stamped trail rather than relying only on fragmented internal marketing records.

For senders, this improves:

- consent auditability
- compliance confidence
- trust in token distribution
- internal reporting for legal, marketing, and operations teams

For subscribers, it creates a clearer sense that rewards and participation are being tracked fairly and transparently.

## What The App Does Today

### Marketing Site

- Landing page for Bloom
- Product positioning around rewarded engagement, trust, and growth
- Pricing and feature sections for sender acquisition

### Subscriber Experience

- Subscribe to a sender's list
- Create an account and log in
- View a subscriber dashboard
- See earned tokens and recent engagement activity
- Connect a Flow wallet
- Verify identity with World ID
- Redeem tokens for sender-specific perks like discounts, store credit, free shipping, and VIP access

### Sender Experience

- View subscriber and campaign data
- Import subscribers by CSV
- Create and manage campaigns
- Export a compliance-style subscriber report
- In demo mode, configure:
  - token allocation
  - token top-ups
  - reward values for sign-up, opens, and clicks
  - redemption catalog options available to subscribers

### Tracking / Rewards Logic

- Email open tracking endpoint
- Email click tracking endpoint
- Token balances updated based on engagement
- Reward redemption recorded in the database
- Long-term product direction: anchor consent and token-distribution events to an onchain ledger for stronger auditability

## Demo-Ready Story

The strongest demo framing for Bloom is:

1. A sender launches a campaign and allocates incentives.
2. A subscriber joins and begins earning tokens through engagement.
3. The sender sees improved engagement and a clearer path to conversion.
4. The subscriber redeems rewards that create a reason to buy again.
5. Consent, identity, and reward distribution are backed by verifiable infrastructure rather than opaque marketing software alone.

That demo works especially well when framed as:

- better subscriber incentives
- better sender conversion economics
- better auditability through blockchain-backed records

## Current Architecture

### Frontend

- `Next.js 16`
- `React 19`
- `Tailwind CSS`
- `shadcn/ui` style component system

### Backend / Data

- `Supabase Auth`
- `Supabase Postgres`
- server and browser clients through `@supabase/ssr`
- offchain application state paired with a roadmap for onchain consent and reward records

### Web3 / Identity

- `Flow FCL` for wallet connectivity
- `World ID` for personhood verification
- blockchain-backed consent ledger and token accounting model

### Key Data Models

- `subscribers`
- `events`
- `campaigns`
- `redemptions`

## Repo Structure

- `app/`: App Router pages, routes, and layouts
- `components/`: marketing UI, dashboard UI, wallet/verification components
- `lib/supabase/`: Supabase client/server helpers and middleware
- `supabase/schema.sql`: main Supabase schema draft
- `supabase/seed_test_subscribers.sql`: test seed data for subscriber demo profiles
- `scripts/001_create_tables.sql`: earlier setup script used during prototyping

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_WLD_APP_ID=your_world_id_app_id
NEXT_PUBLIC_WLD_ACTION=verify-personhood
NEXT_PUBLIC_WC_PROJECT_ID=your_walletconnect_project_id
```

### 3. Run the app

```bash
npm run dev
```

Open `http://localhost:3000`

## Suggested Demo Flow

For a hackathon demo, the cleanest flow is:

1. Start on the Bloom landing page and explain the broken incentives in email.
2. Show the sender dashboard and token program controls in demo mode.
3. Create a campaign with token rewards for opens and clicks.
4. Show the subscriber dashboard with token earnings and verification status.
5. Open the redeem page to show sender-specific rewards.
6. Close by explaining how blockchain-backed consent and token distribution make the system more trustworthy and programmable.

## View Demo
https://v0-email-marketing-platform-liard.vercel.app/

## What Is Strong Today

- Clear product narrative
- Strong demo UX for both sender and subscriber
- Concrete value exchange between attention and rewards
- Practical Web2 onboarding with Web3 infrastructure behind it
- Demo-mode token economics controls for telling the story well

## What Still Needs Improvement

To maximize Bloom's chance of winning and to strengthen it beyond demo stage, these are the most important next steps:

- unify the database schema so all expected fields match production code
- harden auth and role handling for sender vs subscriber access
- move token logic from mock/prototype behavior toward sender-specific treasury accounting
- attach open/click events to campaigns for stronger analytics
- write proper RLS policies for production safety
- complete sender-side top-up and treasury management flows
- add explicit blockchain event recording for consent and token issuance

## Bloom is not "email with crypto"  but "a better collaboration protocol between brands and subscribers"

Bloom uses programmable incentives to repair a broken relationship between brands and subscribers:

- attention becomes measurable
- consent becomes auditable
- rewards become transparent
- trust becomes infrastructure

That makes Bloom a stronger fit for PL_Genesis than a generic loyalty app because it is really about coordination, incentives, and digital trust at the edge between everyday consumer software and open systems.

## Known Limitations

- This is still a prototype and demo-focused implementation.
- Some schema and security details need hardening before production use.
- Typecheck currently hits a pre-existing issue in the World ID component.
- Lint is configured in `package.json`, but `eslint` is not currently installed in this repo.

## Submission Summary

Bloom is a Web2-native, Web3-backed email marketing platform where:

- senders allocate tokenized incentives to campaigns
- subscribers earn rewards from real engagement
- rewards convert into discounts and perks that drive purchases
- blockchain infrastructure strengthens compliance, trust, and distribution
- every subscriber opt-in can be anchored to a blockchain ledger for audit support
- Bloom earns through subscriptions and additional in-platform token purchases
- infrastructure sponsors benefit from transaction, identity, and wallet-layer usage
- tokens remain inside the Bloom ecosystem instead of behaving like an external speculative asset

It is a collaboration system for incentives, not just a marketing dashboard.
