# From Idea to Customer

**There is no reason a junior person with no prior experience can't start thinking like a CTO on day one.**

Not *being* a CTO — thinking like one. The difference isn't the mindset. It's the number of squares and the complexity of the trade-offs. The muscle is the same.

This is a curriculum and a living codebase. The site teaches junior engineers how to think like owners — across product, marketing, sales, and technology — and the codebase *is* the teaching artifact. Every architectural decision here is something we'd explain in a lesson.

**Live site:** [from-idea-to-customer.vercel.app](https://from-idea-to-customer.vercel.app)

---

## The Core Concept: Performing in a Multidimensional Field

Running a SaaS business isn't a single job. It's dozens of functions happening simultaneously, each with its own logic, its own experts, and its own failure modes — all of which affect each other.

A coffee shop owner manages inventory, staff, customer experience, local marketing, health codes, and rent negotiations simultaneously. None of those domains disappear just because they're hard. Amazon runs the same play across thousands of dimensions. Baskin-Robbins figured it out with 31 flavors decades before anyone called it a "platform strategy."

Tech stack choices wear different names — Vercel, Cloudflare Workers, AWS, GCP, Azure, Fly.io, Railway, Render, Supabase, Neon, PlanetScale, Heroku — but the trade-offs are always the same: cost, control, scalability, operational burden, and team familiarity.

**You can manage the field. Or the field will manage you.**

The goal of this curriculum is to give you the frameworks to manage it.

---

## The Checkerboard Model

Imagine the full landscape of a SaaS business laid out as a checkerboard. Each square is a unit of responsibility: the onboarding flow, the billing integration, the positioning page, the API docs, the deployment pipeline, the pricing model, the support escalation process.

Every square needs an owner. An owner isn't the person who does the task — it's the person who is responsible for the square being in good shape, who notices when it isn't, and who does something about it whether or not it's "their job."

- **A junior person** gets one square. Own it completely.
- **An intermediate person** manages multiple squares and the intersections between them.
- **A senior person** ensures *other people* own their squares well, and recognizes that the gaps *between* squares are where things break.

The board is finite but larger than any one person. The question is always: what squares do you own, and do you own them fully?

**Ownership isn't a title or an assignment. It's a posture.**

When you own a square, you know its current state without being asked, notice when something is wrong before someone else reports it, can explain it to anyone in thirty seconds, have a point of view on how it could be better, and take action without waiting to be told.

---

## The Hats

Every function of a SaaS business is a lens on the same problem. This curriculum teaches you to put on each hat — not to become that person, but to understand their logic well enough to work with them and make decisions that hold up across all of them.

| Hat | The Core Question |
|-----|------------------|
| **PM** | Who has this problem, how painful is it, and why haven't they solved it? |
| **CTO** | What's the right technology for *this team*, *this problem*, *this moment*? |
| **Sales Lead** | Why would someone pay for this today, and what does the path to "yes" look like? |
| **Marketer** | Does this communicate value in a way that creates demand? |

Owning a square fully means considering it through each lens. Knowing when to go deep, when familiarity is sufficient, and when to bring in a domain expert rather than pretending to be one.

---

## The OS vs. OEM Problem

One of the most useful frameworks for understanding scale is the difference between operating in **OS mode** (direct relationships with end users) and **OEM mode** (relationships mediated through channel partners, resellers, or platform operators).

In OS mode you manage 5 dimensions. In OEM mode those same 5 dimensions multiply — you now also manage the partner's relationship with their customers, their channel's relationship with the market, and the complexity of operating through systems you don't control.

This is why large organizations feel so different from startups. It's not that the problems are different. It's that the board is bigger and the squares affect each other in more ways.

---

## Curriculum Overview

### Foundation: The Ownership Operating System
Before any hat, before any code — the core frameworks every module builds on.

- The Checkerboard model and what it means to own a square
- The Conference Room method: the most effective learning tool most organizations have abandoned
- Bounded vs. unbounded problems: why some work feels clear and other work feels impossible
- The two stages of SaaS maturity (early-stage vs. late-stage) and how the board changes
- Framing: every bad project traces back to a framing failure, not a technical one

### Thinking Like a PM
Understand user problems before writing a single line of code.

- Writing problem statements and user interviews
- One-page PRDs that any engineer could build from
- Prioritization frameworks and defining success metrics
- Why features get cut and why that's usually right

### Thinking Like a CTO
Make technology decisions that serve the business.

- Evaluating trade-offs across stacks, not just technologies
- Designing a monorepo that teaches itself
- Writing the CLAUDE.md (or equivalent) that makes a codebase instantly legible
- Building for the team you have, not the scale you imagine

### Thinking Like a Marketer
Create demand. Everything else is in service of that.

- Positioning and messaging: what you say and who you say it to
- SEO as a channel strategy, not a checklist
- Why engineering decisions directly impact demand generation
- How to think about the funnel from a technical seat

---

## This Codebase Is the Lesson

The site you're reading is built with the same decisions we'd make building a production SaaS. Every choice is explainable to a junior engineer and defensible to a CTO.

### Architecture

```
from-idea-to-customer/
├── packages/
│   ├── web/          # Astro 5 frontend — deployed on Vercel
│   └── api/          # Elysia API server — deployed on Fly.io
├── package.json      # Bun workspaces monorepo
└── tsconfig.base.json
```

### Tech Stack Decisions

| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Bun | Speed, native TypeScript, monorepo tooling |
| Frontend | Astro 5 | Content-first, static by default, islands for interactivity |
| API | Elysia | End-to-end type safety, Bun-native |
| Database | Neon (PostgreSQL) | Serverless Postgres — scales to zero, branches for dev |
| ORM | None — raw `pg` | Visible SQL is better for learning than magic abstractions |
| Styling | Tailwind 4 | CSS-first config, no build plugin overhead |
| Deployment (web) | Vercel | Zero-config Astro adapter, edge network |
| Deployment (api) | Fly.io | Scale-to-zero, simple config, global regions |

### The Site Monitors Itself

The home page shows live Lighthouse scores (Performance, SEO, Accessibility, Best Practices) and Google Analytics engagement metrics — 30-day sessions, bounce rate, average session duration — pulled in real time via the Google PageSpeed Insights API and GA4 Data API.

This is intentional: the site is a real-world example of using your own product as a teaching artifact. Not synthetic data. Not screenshots. The actual numbers.

---

## Development

```bash
# Install dependencies
bun install

# Start both web and API in development
bun run dev

# Run unit tests
bun run test

# Run e2e tests (Playwright)
bun run test:e2e

# Type check all packages
bun run typecheck

# Apply database migrations
bun run db:migrate
```

### Environment Variables

Copy `.env.example` and fill in values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Package | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | api | Neon PostgreSQL connection string |
| `GOOGLE_PSI_API_KEY` | web | PageSpeed Insights API — live Lighthouse scores |
| `GA4_PROPERTY_ID` | web | Google Analytics 4 property ID |
| `GA4_SERVICE_ACCOUNT_B64` | web | Base64-encoded GCP service account JSON for GA4 Data API |
| `YOU_API_KEY` | web | You.com API key for the site assistant |
| `PUBLIC_GA4_MEASUREMENT_ID` | web | GA4 measurement ID (baked at build time) |

---

## The Thesis

Onboarding is a core competency for leaders, not an afterthought.

The best engineering leaders aren't the ones who know the most. They're the ones who can bring others up to speed the fastest, create environments where ownership is the default, and make decisions that hold up across the entire board — not just the squares they personally care about.

This curriculum exists because most engineers are never explicitly taught any of this. They absorb it slowly, by proximity to good leaders, over years. There's no reason it has to take that long.

---

## Contributing

This is a living curriculum. If you find a lesson that's wrong, incomplete, or could be better explained — open an issue or a PR. The best contributions come from people who are currently in the early stages this curriculum addresses.
