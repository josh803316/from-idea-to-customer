// ── Persona content types ─────────────────────────────────────────────────────

export interface PersonaHero {
  headline: string;
  subhead: string;
  primaryCta: string;
}

export interface PersonaJourneyEra {
  feeling: string; // how this era felt to them
  pain: string;    // what sucked
}

export interface PersonaJourney {
  waterfall: PersonaJourneyEra;
  agile: PersonaJourneyEra;
  aiNative: PersonaJourneyEra;
  insight: string; // their bottom-line takeaway
}

export interface PersonaStep {
  emoji: string;
  label: string;
  desc: string;
}

export interface PersonaContent {
  hero: PersonaHero;
  journey: PersonaJourney;
  modelsIntro: string;
  howToBuild: PersonaStep[];
  waitlist: { headline: string; subtext: string };
  definitionOfDone: string;
  vocabulary: string[]; // key terms this persona cares about
}

export interface Persona {
  slug: string;
  name: string;
  emoji: string;
  color: string;        // tailwind bg class for the node
  ringColor: string;    // tailwind ring/border class
  textColor: string;    // tailwind text class
  tagline: string;
  group: 'core' | 'team' | 'business';
  content: PersonaContent;
}

// ── Persona definitions ───────────────────────────────────────────────────────

export const PERSONAS: Persona[] = [
  // ── CORE ──────────────────────────────────────────────────────────────────
  {
    slug: 'founder',
    name: 'Founder',
    emoji: '🚀',
    color: 'bg-violet-600',
    ringColor: 'ring-violet-400',
    textColor: 'text-violet-400',
    tagline: 'From idea to revenue, end-to-end',
    group: 'core',
    content: {
      hero: {
        headline: "Your idea is 10× closer to customers than it's ever been",
        subhead:
          'AI gives solo founders and small teams the leverage of a full engineering org. The moat is now judgment and taste — not headcount.',
        primaryCta: 'See how founders build today →',
      },
      journey: {
        waterfall: {
          feeling: 'Your idea sat on a whiteboard for 18 months',
          pain: 'You needed a CTO, architects, and a full team before users saw a single screen. Most ideas died waiting for engineers.',
        },
        agile: {
          feeling: 'Sprints gave you pace, but still required developers to move',
          pain: '4–8 week cycles to validate a hypothesis. Every assumption cost a sprint. Pivoting meant renegotiating the backlog.',
        },
        aiNative: {
          feeling: 'You describe the product. AI builds the scaffold. You ship this week.',
          pain: 'The only bottleneck left is your ability to make good decisions quickly.',
        },
        insight: 'The era of "I need to hire engineers to start" is over. Judgment is the new moat.',
      },
      modelsIntro:
        'These are the engines behind your AI-native stack. Pick one as your foundation model — it\'s the "brain" behind everything from your product\'s chat interface to your internal tooling.',
      howToBuild: [
        { emoji: '💡', label: 'Define the problem', desc: 'Write the problem statement in one sentence. Who hurts, and why?' },
        { emoji: '🤖', label: 'AI scaffolds', desc: 'Prompt an AI to generate the skeleton — routes, components, DB schema.' },
        { emoji: '👁️', label: 'You review', desc: 'Read every line. AI makes confident mistakes. Your judgment is the filter.' },
        { emoji: '🔗', label: 'AI connects', desc: 'Wire up payments, auth, and APIs by describing the integration.' },
        { emoji: '🚀', label: 'Ship & learn', desc: 'Deploy to real users this week. Assumptions are expensive. Feedback is free.' },
      ],
      waitlist: {
        headline: 'Learn to build your own company with AI',
        subtext: 'A curriculum for founders who want to go from idea to paying customers — without waiting for a technical co-founder.',
      },
      definitionOfDone: 'Customers are paying and asking for more',
      vocabulary: ['PMF', 'CAC', 'LTV', 'runway', 'pivot', 'MVP', 'co-founder', 'traction'],
    },
  },

  {
    slug: 'engineering',
    name: 'Engineering',
    emoji: '⚙️',
    color: 'bg-blue-600',
    ringColor: 'ring-blue-400',
    textColor: 'text-blue-400',
    tagline: 'Review more code than you write',
    group: 'core',
    content: {
      hero: {
        headline: 'AI is your pair programmer, architect, and rubber duck',
        subhead:
          'You review more code than you write. Your judgment on architecture, security, and tradeoffs is the multiplier — not your typing speed.',
        primaryCta: 'See the engineering workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Months of architecture docs before a line was reviewable',
          pain: 'Specs changed by the time you implemented them. You built to a requirements doc that was already wrong.',
        },
        agile: {
          feeling: 'Two-week sprints. Daily standups. Velocity metrics.',
          pain: 'Tech debt was deferred, not eliminated. You were always building, never refining. Burnout came from the pace.',
        },
        aiNative: {
          feeling: 'You prompt, review, and guide. AI scaffolds the boilerplate.',
          pain: 'The challenge is now verification, not creation. You need sharp instincts for what AI gets subtly wrong.',
        },
        insight: 'Engineering leverage has never been higher — and the bar for what "senior" means has shifted completely.',
      },
      modelsIntro:
        'These models are now your toolchain. GPT-4o and Claude are your coding partners — they understand your codebase, write tests, and explain errors. Knowing which model excels at what is now a core engineering skill.',
      howToBuild: [
        { emoji: '📐', label: 'Define constraints', desc: 'Architecture decisions first. What\'s the shape of the system before AI touches it?' },
        { emoji: '🤖', label: 'AI generates', desc: 'Prompt for specific modules. Keep prompts scoped — AI drifts with vague asks.' },
        { emoji: '🔍', label: 'Review for correctness', desc: 'Check edge cases, error handling, security. This is your highest leverage.' },
        { emoji: '🔗', label: 'AI wires APIs', desc: 'Describe integrations — auth flows, third-party APIs, DB schemas.' },
        { emoji: '🧪', label: 'Ship with tests', desc: 'AI writes the tests too. Your job: verify coverage and failure modes.' },
      ],
      waitlist: {
        headline: 'Level up your AI-native engineering skills',
        subtext: 'Learn the workflows, prompting patterns, and review instincts that separate AI-leveraged engineers from the rest.',
      },
      definitionOfDone: 'Tests pass, it\'s deployed, it\'s observable — and nothing surprised us at 3am',
      vocabulary: ['architecture', 'tech debt', 'CI/CD', 'observability', 'code review', 'scalability', 'refactor'],
    },
  },

  {
    slug: 'product',
    name: 'Product',
    emoji: '🎯',
    color: 'bg-rose-600',
    ringColor: 'ring-rose-400',
    textColor: 'text-rose-400',
    tagline: 'Ship at the speed of customer feedback',
    group: 'core',
    content: {
      hero: {
        headline: 'Ship features at the speed of customer feedback',
        subhead:
          'AI compresses the distance between insight and implementation. You finally move faster than the backlog — and validate assumptions before they\'re in a sprint.',
        primaryCta: 'See the product workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'You wrote PRDs for quarters, then waited months to see if you were right',
          pain: 'By the time engineering finished, the market had moved. You shipped what customers asked for six months ago.',
        },
        agile: {
          feeling: 'Sprint planning every two weeks. Your ideas competed for engineering time.',
          pain: 'The backlog was your graveyard. Good ideas died waiting. Priorities shifted, but sprints didn\'t.',
        },
        aiNative: {
          feeling: 'Write a spec, get a working prototype the same day.',
          pain: 'Validate with real users before it\'s on the roadmap. The constraint is now discovery speed, not delivery speed.',
        },
        insight: 'Product velocity is no longer bottlenecked by engineering — it\'s bottlenecked by the quality of your thinking.',
      },
      modelsIntro:
        'Foundation models don\'t just power the features you\'re building — they\'re your research partner. Use them to synthesize user interview transcripts, generate spec alternatives, and pressure-test your assumptions before engineering touches it.',
      howToBuild: [
        { emoji: '🗣️', label: 'Talk to users', desc: 'AI helps synthesize interviews. You still need to have the conversations.' },
        { emoji: '📝', label: 'Write the spec', desc: 'One page. Problem, user, success metric, non-goals. AI iterates with you.' },
        { emoji: '🤖', label: 'AI prototypes', desc: 'Get a working prototype to test the core assumption — today.' },
        { emoji: '📊', label: 'Validate fast', desc: 'Put it in front of users. Was the assumption right? Revise or proceed.' },
        { emoji: '🚀', label: 'Ship it', desc: 'The spec becomes the prompt. Engineering reviews and deploys.' },
      ],
      waitlist: {
        headline: 'Build better products with AI in the loop',
        subtext: 'A curriculum for product thinkers who want to close the gap between insight and shipped feature.',
      },
      definitionOfDone: 'Users adopted the feature and the target metric moved',
      vocabulary: ['PRD', 'backlog', 'sprint', 'user story', 'acceptance criteria', 'KPI', 'roadmap', 'discovery'],
    },
  },

  // ── TEAM ──────────────────────────────────────────────────────────────────
  {
    slug: 'design',
    name: 'Design',
    emoji: '🎨',
    color: 'bg-pink-600',
    ringColor: 'ring-pink-400',
    textColor: 'text-pink-400',
    tagline: 'From mockup to working product in hours',
    group: 'team',
    content: {
      hero: {
        headline: 'From mockup to working product in hours',
        subhead:
          'AI bridges the design-to-code gap. Your vision ships without translation loss — and you can iterate on the real thing, not a Figma frame.',
        primaryCta: 'See the design workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Designs were handed off, and something got lost in every translation',
          pain: 'Pixel-perfect was a negotiation. By the time engineering implemented it, the design intent had been compromised a dozen times.',
        },
        agile: {
          feeling: 'Design sprints helped, but the Figma-to-production gap persisted',
          pain: 'You were always designing for a version of the product that didn\'t exist yet. Feedback came late, iteration was expensive.',
        },
        aiNative: {
          feeling: 'Describe the interface. Generate the component. Ship the intent.',
          pain: 'The new challenge: ensuring AI-generated code respects your design system and accessibility standards.',
        },
        insight: 'Design decisions now survive the handoff. The designer who learns to prompt well owns the final output.',
      },
      modelsIntro:
        'Foundation models understand design intent. Describe a component in terms of user experience — not just pixels — and get working code. Vision models can review screenshots and flag accessibility issues. The design loop just got a lot tighter.',
      howToBuild: [
        { emoji: '🖼️', label: 'Design the intent', desc: 'What job does this interface do? Document the experience, not just the pixels.' },
        { emoji: '🤖', label: 'AI generates components', desc: 'Prompt with your design system tokens. Get real, styled components — not placeholders.' },
        { emoji: '🔍', label: 'You review fidelity', desc: 'Does it match the intent? Check accessibility, edge cases, empty states.' },
        { emoji: '🎛️', label: 'Iterate in the real thing', desc: 'No more Figma-to-dev back-and-forth. Refine the live component.' },
        { emoji: '✅', label: 'Ship with confidence', desc: 'The user experience that ships is the one you designed.' },
      ],
      waitlist: {
        headline: 'Design products that ship as designed',
        subtext: 'Learn to close the Figma-to-production gap with AI-native design workflows.',
      },
      definitionOfDone: 'It looks right, it feels right — and users don\'t notice the interface',
      vocabulary: ['design system', 'component', 'accessibility', 'UX', 'handoff', 'design tokens', 'prototype', 'intent'],
    },
  },

  {
    slug: 'quality',
    name: 'Quality',
    emoji: '🛡️',
    color: 'bg-emerald-600',
    ringColor: 'ring-emerald-400',
    textColor: 'text-emerald-400',
    tagline: 'Ship with confidence, not anxiety',
    group: 'team',
    content: {
      hero: {
        headline: 'Ship with confidence, not anxiety',
        subhead:
          'AI writes the tests, flags the edge cases, and catches regressions before users do. You move from writing coverage to ensuring it.',
        primaryCta: 'See the QA workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'QA was a gate at the end of a long, expensive process',
          pain: 'Defects found late were expensive to fix. Rework was painful. The team saw QA as the bottleneck, not the safety net.',
        },
        agile: {
          feeling: 'Continuous testing improved — but QA was still the sprint bottleneck',
          pain: 'Test automation helped, but keeping up with sprint velocity required constant triage. Coverage was always incomplete.',
        },
        aiNative: {
          feeling: 'Tests are generated alongside code. Coverage is a given, not a chase.',
          pain: 'The new challenge: reviewing what AI generates for quality, not writing it from scratch.',
        },
        insight: 'QA shifts from a phase to a property of the code — baked in from the first prompt, not applied at the end.',
      },
      modelsIntro:
        'AI models now write unit tests, integration tests, and edge case scenarios from a description of behavior. They also review code for common failure modes, race conditions, and security issues. Your expertise shapes what they look for.',
      howToBuild: [
        { emoji: '📋', label: 'Define acceptance criteria', desc: 'Clear criteria upfront means AI can generate tests that actually validate intent.' },
        { emoji: '🤖', label: 'AI generates test suites', desc: 'Unit, integration, and edge case tests generated alongside the feature code.' },
        { emoji: '🔍', label: 'You review coverage', desc: 'Check for what AI missed: business logic, state transitions, failure modes.' },
        { emoji: '🔄', label: 'Automate regression', desc: 'AI maintains the test suite as code changes. Regression becomes automatic.' },
        { emoji: '✅', label: 'Ship with a green check', desc: 'Nothing reaches production without a passing suite. You own that bar.' },
      ],
      waitlist: {
        headline: 'Build quality into every layer of the stack',
        subtext: 'Learn how AI-native teams make quality a property of the code, not a gate at the end of the pipeline.',
      },
      definitionOfDone: 'Nothing broke in production that we didn\'t already know about',
      vocabulary: ['coverage', 'regression', 'acceptance criteria', 'edge case', 'CI', 'flaky test', 'test pyramid', 'MTTR'],
    },
  },

  {
    slug: 'operations',
    name: 'Operations',
    emoji: '🔧',
    color: 'bg-cyan-600',
    ringColor: 'ring-cyan-400',
    textColor: 'text-cyan-400',
    tagline: 'Infrastructure that runs itself while you sleep',
    group: 'team',
    content: {
      hero: {
        headline: 'Infrastructure that runs itself while you sleep',
        subhead:
          'AI-native ops means self-healing systems, automated runbooks, and observability that explains the problem — not just surfaces it.',
        primaryCta: 'See the ops workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Ops was an afterthought. Deployment was a ceremony.',
          pain: '"It works on my machine" was a real answer. Production was a mystery until something broke. On-call meant all-hands.',
        },
        agile: {
          feeling: 'CI/CD improved delivery — but on-call still meant sleepless nights',
          pain: 'DevOps culture helped, but the tools still required deep human interpretation. Alerts were noisy. Context was lost.',
        },
        aiNative: {
          feeling: 'AI monitors, alerts with context, and suggests the fix.',
          pain: 'You approve and verify — you\'re no longer the first responder to every alert. The hard part is trusting the automation.',
        },
        insight: 'The ops role shifts from firefighting to designing systems that fire fewer alerts in the first place.',
      },
      modelsIntro:
        'AI models now read log output, interpret stack traces, and suggest root causes in plain English. They write deployment scripts, generate runbooks from incident postmortems, and monitor infrastructure drift. Your expertise defines what to watch for.',
      howToBuild: [
        { emoji: '📊', label: 'Instrument everything', desc: 'Logs, traces, metrics. AI is only as good as the signal you give it.' },
        { emoji: '🤖', label: 'AI generates runbooks', desc: 'Describe the system; get runbooks, rollback scripts, and alert thresholds.' },
        { emoji: '🔍', label: 'Review for accuracy', desc: 'AI gets the happy path right. You catch the edge cases it doesn\'t know about.' },
        { emoji: '🔗', label: 'AI connects monitoring', desc: 'Wire up alerts, PagerDuty, Slack — described in plain language.' },
        { emoji: '🚀', label: 'Deploy with confidence', desc: 'Automated rollback, canary deploys, and health checks. You review, not babysit.' },
      ],
      waitlist: {
        headline: 'Build systems that run themselves',
        subtext: 'Learn how AI-native teams automate operations, reduce toil, and sleep through the night.',
      },
      definitionOfDone: '99.9% uptime, zero surprise incidents, the team slept through the night',
      vocabulary: ['SRE', 'SLA', 'MTTR', 'incident', 'runbook', 'observability', 'toil', 'canary deploy', 'postmortem'],
    },
  },

  {
    slug: 'security',
    name: 'Security',
    emoji: '🔒',
    color: 'bg-amber-600',
    ringColor: 'ring-amber-400',
    textColor: 'text-amber-400',
    tagline: 'Secure by default, not secure after the fact',
    group: 'team',
    content: {
      hero: {
        headline: 'Build secure by default, not secure after the fact',
        subhead:
          'AI flags vulnerabilities as code is written, not after it ships. Security shifts left so far it disappears into the development workflow itself.',
        primaryCta: 'See the security workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Security was a review gate before launch — and a postmortem after breach',
          pain: 'Pen tests happened once. Most vulnerabilities were found in production by someone other than your team.',
        },
        agile: {
          feeling: 'Security scanning improved, but it was bolted on — not baked in',
          pain: 'OWASP checks ran in CI but were rarely first-class sprint priorities. Security was the team\'s job after engineering was "done."',
        },
        aiNative: {
          feeling: 'AI reviews code for vulnerabilities in real time, every commit.',
          pain: 'The new attack surface is AI-generated code itself — model hallucinations can introduce subtle, hard-to-spot vulnerabilities.',
        },
        insight: 'Security in an AI-native world means auditing what AI produces, not just what humans write.',
      },
      modelsIntro:
        'AI models can review code for OWASP Top 10 vulnerabilities, identify exposed secrets, flag insecure defaults, and suggest remediations — at the speed of development. The challenge: AI can also generate insecure code confidently. Your expertise is the final review layer.',
      howToBuild: [
        { emoji: '🏗️', label: 'Threat model first', desc: 'Define the attack surface before AI writes a line. What are you protecting?' },
        { emoji: '🤖', label: 'AI generates with constraints', desc: 'Security requirements in the prompt. Parameterized queries, secrets management, input validation — by default.' },
        { emoji: '🔍', label: 'Security review', desc: 'Review AI output for OWASP issues, hardcoded secrets, and insecure patterns.' },
        { emoji: '🔗', label: 'AI automates compliance', desc: 'Generate audit trails, compliance docs, and security headers automatically.' },
        { emoji: '🛡️', label: 'Ship with assurance', desc: 'Automated scanning, SBOM generation, and vulnerability monitoring in the pipeline.' },
      ],
      waitlist: {
        headline: 'Build security into the AI-native development workflow',
        subtext: 'Learn to review AI-generated code for vulnerabilities and make security a property of the build — not a gate before launch.',
      },
      definitionOfDone: 'No known critical vulnerabilities, every secret is managed, compliance is automated',
      vocabulary: ['OWASP', 'CVE', 'threat model', 'attack surface', 'secrets management', 'SBOM', 'zero-trust', 'pen test'],
    },
  },

  // ── BUSINESS ──────────────────────────────────────────────────────────────
  {
    slug: 'customer',
    name: 'Customer',
    emoji: '👤',
    color: 'bg-teal-600',
    ringColor: 'ring-teal-400',
    textColor: 'text-teal-400',
    tagline: 'Software that finally fits how you work',
    group: 'business',
    content: {
      hero: {
        headline: 'Products that understand you — not the other way around',
        subhead:
          'AI-native products adapt to your language, your workflow, and your context. The era of one-size-fits-all software that you have to bend yourself to fit is ending.',
        primaryCta: 'See what\'s changing →',
      },
      journey: {
        waterfall: {
          feeling: 'Software felt generic. It was built for everyone, which meant it fit no one.',
          pain: 'You learned the tool\'s language, not the other way around. Workarounds became habits. The manual was a fiction.',
        },
        agile: {
          feeling: 'Apps got better faster — but your feedback still took months to become features',
          pain: 'You submitted a support ticket. It became a backlog item. It shipped in Q3. You\'d already worked around it.',
        },
        aiNative: {
          feeling: 'Products now speak your language, learn your patterns, and update based on how you use them.',
          pain: 'The challenge is trust — knowing when to rely on AI-powered suggestions and when to verify.',
        },
        insight: 'The best AI-native products make you feel like they were built just for you — because they adapt to you in real time.',
      },
      modelsIntro:
        'Foundation models are what power the intelligence behind your favorite apps. When your email client drafts a reply, your IDE completes your code, or your support bot actually understands your problem — that\'s a foundation model at work.',
      howToBuild: [
        { emoji: '🗣️', label: 'Tell it what you need', desc: 'Describe the problem in your words. Good AI products don\'t require training to use.' },
        { emoji: '🤖', label: 'Let AI do the heavy lifting', desc: 'Drafts, summaries, analyses — AI handles the labor. You make the decisions.' },
        { emoji: '✏️', label: 'Refine the output', desc: 'AI gets you to 80% fast. Your judgment and context close the gap.' },
        { emoji: '🔁', label: 'Give feedback', desc: 'The product learns from how you work. Better feedback → better outcomes.' },
        { emoji: '✅', label: 'Verify and ship', desc: 'You own the result. AI is a collaborator, not a replacement for your judgment.' },
      ],
      waitlist: {
        headline: 'Learn how AI-native products actually work',
        subtext: 'Understand the technology behind the products you use every day — and how to get more out of them.',
      },
      definitionOfDone: 'My problem is solved and I didn\'t need to read a manual to get there',
      vocabulary: ['onboarding', 'support ticket', 'workflow', 'use case', 'feature request', 'user experience', 'trust'],
    },
  },

  {
    slug: 'executive',
    name: 'Executive',
    emoji: '📈',
    color: 'bg-indigo-600',
    ringColor: 'ring-indigo-400',
    textColor: 'text-indigo-400',
    tagline: 'The moat has moved — from headcount to AI leverage',
    group: 'business',
    content: {
      hero: {
        headline: 'The competitive moat has moved from headcount to AI leverage',
        subhead:
          'Teams that adopt AI-native workflows outship teams 3× their size. The question isn\'t whether to adopt — it\'s whether you\'re moving fast enough.',
        primaryCta: 'See the strategic picture →',
      },
      journey: {
        waterfall: {
          feeling: 'Capital went to headcount. Timelines justified board presentations.',
          pain: 'Risk was in the plan. Hiring was the lever for output. Missed timelines were explained with resource constraints.',
        },
        agile: {
          feeling: 'Delivery velocity improved — but scaling still meant hiring',
          pain: 'Predictability came at the cost of adaptability. Agile gave you sprints, but the org structure was still waterfall.',
        },
        aiNative: {
          feeling: 'Small AI-leveraged teams outcompete large teams without it.',
          pain: 'The risk isn\'t adopting AI — it\'s your competitors adopting it faster. The window to build this capability is now.',
        },
        insight: 'AI leverage is the new capital efficiency metric. The executive question is: what\'s our AI leverage ratio?',
      },
      modelsIntro:
        'These are the foundation model providers competing for your infrastructure spend. OpenAI, Anthropic, and Google are the hyperscalers of this decade — the choice of foundation model is now a strategic decision with the same weight as cloud provider selection.',
      howToBuild: [
        { emoji: '🎯', label: 'Set the AI strategy', desc: 'Where does AI create competitive advantage? Pick two bets and go deep.' },
        { emoji: '🤖', label: 'Empower the team', desc: 'AI tools remove blockers. Your job is ensuring they\'re in the workflow, not on a pilot list.' },
        { emoji: '📊', label: 'Measure leverage', desc: 'Features shipped per engineer. Time-to-production. Cost per output. Track the delta.' },
        { emoji: '🔗', label: 'Build the capability', desc: 'AI-native isn\'t a project — it\'s an organizational capability. Invest in it structurally.' },
        { emoji: '🚀', label: 'Outship the market', desc: 'Speed is now a strategic advantage, not just an engineering metric.' },
      ],
      waitlist: {
        headline: 'Build an AI-native organization',
        subtext: 'A curriculum for executives who want to lead the transition — not manage the aftermath.',
      },
      definitionOfDone: 'The company hit its OKRs and the team is 12 months ahead of the roadmap',
      vocabulary: ['leverage', 'OKR', 'capital efficiency', 'competitive moat', 'organizational capability', 'AI strategy', 'board'],
    },
  },

  {
    slug: 'support',
    name: 'Support',
    emoji: '💬',
    color: 'bg-sky-600',
    ringColor: 'ring-sky-400',
    textColor: 'text-sky-400',
    tagline: 'Resolve issues before customers know they exist',
    group: 'business',
    content: {
      hero: {
        headline: 'Resolve issues before customers know they exist',
        subhead:
          'AI-native products self-report problems, suggest resolutions, and empower customers to help themselves. Your team handles the complex — the rest resolves itself.',
        primaryCta: 'See the support workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Long queues, lost context, and customers waiting days for answers',
          pain: 'Every handoff lost context. Tier 1 → Tier 2 → Engineering was a game of telephone. Customers felt it.',
        },
        agile: {
          feeling: 'Helpdesks got better tooling, but the same issues recurred at the same rate',
          pain: 'You were managing symptoms, not causes. Sprints didn\'t fix the underlying product issues that created the tickets.',
        },
        aiNative: {
          feeling: 'AI drafts responses, surfaces known issues, and deflects what can be self-served.',
          pain: 'The tickets that reach you are genuinely hard. The AI handles the long tail — you handle the relationship moments.',
        },
        insight: 'Support in an AI-native product is a feedback loop engine — every ticket is a signal about what to fix or clarify.',
      },
      modelsIntro:
        'Foundation models power the AI agents that deflect your tier-1 tickets, draft your tier-2 responses, and surface patterns across thousands of conversations. The signal in your support data is richer than it\'s ever been — if you have the right model reading it.',
      howToBuild: [
        { emoji: '📚', label: 'Build the knowledge base', desc: 'AI is only as helpful as the docs it can search. Invest in structured knowledge.' },
        { emoji: '🤖', label: 'AI handles tier-1', desc: 'Common questions, account lookups, status checks — AI resolves these without human intervention.' },
        { emoji: '✏️', label: 'AI drafts tier-2', desc: 'Complex tickets get AI-drafted responses. You review, personalize, and send.' },
        { emoji: '📊', label: 'AI surfaces patterns', desc: 'What are the top 10 ticket drivers this week? AI tells you before you ask.' },
        { emoji: '🔁', label: 'Feed signals to product', desc: 'Support is the product\'s early warning system. Close the loop with engineering.' },
      ],
      waitlist: {
        headline: 'Build support that scales without scaling the team',
        subtext: 'Learn how AI-native support teams handle more volume with higher satisfaction scores.',
      },
      definitionOfDone: 'Customer solved their problem without opening a ticket — and if they did, it was resolved in under 2 hours',
      vocabulary: ['CSAT', 'ticket deflection', 'tier-1', 'SLA', 'knowledge base', 'churn signal', 'escalation', 'NPS'],
    },
  },

  {
    slug: 'partners',
    name: 'Partners',
    emoji: '🤝',
    color: 'bg-lime-600',
    ringColor: 'ring-lime-400',
    textColor: 'text-lime-400',
    tagline: 'Build once, distribute everywhere',
    group: 'business',
    content: {
      hero: {
        headline: 'Build on platforms that multiply your reach',
        subhead:
          'AI-native platforms give partners the same leverage as their core teams. Integrate once, and your customers inherit every improvement that follows.',
        primaryCta: 'See the partner workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Partner integrations took quarters. API docs were a PDF.',
          pain: 'SDKs were afterthoughts. Each integration was a custom project. Both sides needed dedicated engineers.',
        },
        agile: {
          feeling: 'Partner programs improved, but each integration was still bespoke',
          pain: 'Even with better APIs, integrations required sustained engineering investment from both parties to maintain.',
        },
        aiNative: {
          feeling: 'AI-generated SDKs, self-updating docs, and LLM-powered integration assistants.',
          pain: 'The integration risk shifts from "can we build it" to "can we keep it working as both platforms evolve."',
        },
        insight: 'The best platforms today feel like extensions of your own product — not third-party integrations.',
      },
      modelsIntro:
        'Foundation model APIs are now the lingua franca of the AI ecosystem. Understanding how OpenAI, Anthropic, and Google expose their models determines how easy it is to build on top of them — and how much lock-in you\'re accepting.',
      howToBuild: [
        { emoji: '🗺️', label: 'Map the integration points', desc: 'What data, events, and actions need to flow between systems?' },
        { emoji: '🤖', label: 'AI generates the SDK', desc: 'Describe the API contract. AI generates typed SDKs for your target languages.' },
        { emoji: '📚', label: 'AI writes the docs', desc: 'Integration docs generated from the API spec — and kept in sync automatically.' },
        { emoji: '🔗', label: 'Build the webhook layer', desc: 'Real-time event flow between systems. AI helps design the event schema.' },
        { emoji: '🚀', label: 'Partners ship in days', desc: 'Good DX means fast adoption. Measure time-to-first-integration.' },
      ],
      waitlist: {
        headline: 'Build an ecosystem, not just a product',
        subtext: 'Learn how AI-native companies design for extensibility and build partner ecosystems that multiply their distribution.',
      },
      definitionOfDone: 'The integration works, both sets of customers benefit, and neither team needed a weekly sync to maintain it',
      vocabulary: ['API', 'SDK', 'webhook', 'ISV', 'marketplace', 'integration', 'DX', 'co-sell', 'ecosystem'],
    },
  },

  {
    slug: 'sales',
    name: 'Sales',
    emoji: '💰',
    color: 'bg-green-600',
    ringColor: 'ring-green-400',
    textColor: 'text-green-400',
    tagline: 'Close deals with demos that build themselves',
    group: 'business',
    content: {
      hero: {
        headline: 'Close deals with demos that build themselves',
        subhead:
          'AI gives every rep a full-stack engineer in their pocket. POCs take hours, not sprint cycles — and you stop losing deals while waiting for technical resources.',
        primaryCta: 'See the sales workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Sales cycles waited on engineering for demos — and champions moved on',
          pain: 'By the time the POC was ready, the champion had moved on, the budget cycle had closed, or the competitor had already won.',
        },
        agile: {
          feeling: 'Better — but sales still depended on engineering capacity for technical deals',
          pain: 'SE bandwidth was the constraint. Complex deals required engineers who had other priorities. Win rates suffered.',
        },
        aiNative: {
          feeling: 'Reps build their own demos. POCs ship in hours. Engineering reviews before it goes live.',
          pain: 'The new constraint is rep judgment — knowing what to build and what to promise.',
        },
        insight: 'The gap between "we can do that" and "here it is" just collapsed. The rep who can show is the rep who closes.',
      },
      modelsIntro:
        'Foundation models are what your prospects are evaluating — whether they know it or not. Understanding which models power which use cases, and how they compare, is now a core part of the technical sales conversation.',
      howToBuild: [
        { emoji: '🎯', label: 'Qualify the use case', desc: 'What specific problem are they solving? Good demos solve one thing perfectly.' },
        { emoji: '🤖', label: 'AI builds the POC', desc: 'Describe the demo requirements. Get a working proof of concept today.' },
        { emoji: '👁️', label: 'Engineering reviews', desc: 'Quick review before it goes to the prospect. No surprises on the demo call.' },
        { emoji: '🎬', label: 'Demo the real thing', desc: 'Not slides. Not wireframes. A working product solving their specific problem.' },
        { emoji: '🤝', label: 'Close on momentum', desc: 'Speed signals capability. A same-week POC is its own credibility.' },
      ],
      waitlist: {
        headline: 'Win more deals in the AI-native era',
        subtext: 'Learn how top sales teams are using AI to compress sales cycles and increase win rates on technical deals.',
      },
      definitionOfDone: 'Closed won, customer live, expansion conversation already scheduled',
      vocabulary: ['POC', 'champion', 'technical win', 'deal velocity', 'objection handling', 'pipeline', 'close rate', 'AE', 'SE'],
    },
  },

  {
    slug: 'marketing',
    name: 'Marketing',
    emoji: '📣',
    color: 'bg-orange-600',
    ringColor: 'ring-orange-400',
    textColor: 'text-orange-400',
    tagline: 'Content and campaigns at the speed of the market',
    group: 'business',
    content: {
      hero: {
        headline: 'Content and campaigns at the speed of the market',
        subhead:
          'AI writes the first draft, generates the variants, and tests the copy. You direct the strategy and own the brand — AI handles the production volume.',
        primaryCta: 'See the marketing workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Campaign briefs went through six stakeholders, and by launch the moment had passed',
          pain: 'The content calendar was always 6 weeks behind the news cycle. Production was the bottleneck, not strategy.',
        },
        agile: {
          feeling: 'Content calendars helped — but production velocity was still the constraint',
          pain: 'You planned better than you executed. The approval chain and production process still lagged the market.',
        },
        aiNative: {
          feeling: 'Brief to publish in hours. AI generates variants, you pick winners.',
          pain: 'Brand voice, accuracy, and legal review are still human jobs. The risk is publishing too fast without the right guardrails.',
        },
        insight: 'Marketing leverage is now about prompting quality and judgment, not production bandwidth.',
      },
      modelsIntro:
        'Foundation models are your content production team. They write copy, generate images, produce video scripts, and A/B test messaging. The marketer who knows how to direct AI produces at 10× the volume with consistent quality — and uses their time for strategy, not execution.',
      howToBuild: [
        { emoji: '🎯', label: 'Set the strategic brief', desc: 'Audience, message, goal. This is your job. AI can\'t replace strategic clarity.' },
        { emoji: '🤖', label: 'AI generates the content', desc: 'Blog posts, social copy, email sequences, ad variants — at volume.' },
        { emoji: '✏️', label: 'You refine the voice', desc: 'AI gets to 80% fast. You close the gap with brand knowledge and judgment.' },
        { emoji: '🧪', label: 'Test aggressively', desc: 'AI makes variant creation free. Test 10 headlines instead of 2. Let data decide.' },
        { emoji: '📊', label: 'Measure and iterate', desc: 'AI helps interpret results and generate the next hypothesis. Ship the learnings.' },
      ],
      waitlist: {
        headline: 'Market at the speed of AI',
        subtext: 'Learn how AI-native marketing teams produce more, test more, and grow faster without burning out their teams.',
      },
      definitionOfDone: 'Pipeline generated, conversion improving, and the brand is stronger than it was 90 days ago',
      vocabulary: ['CAC', 'conversion rate', 'content calendar', 'brand voice', 'A/B test', 'funnel', 'SEO', 'GTM'],
    },
  },

  {
    slug: 'finance',
    name: 'Finance',
    emoji: '📊',
    color: 'bg-yellow-600',
    ringColor: 'ring-yellow-400',
    textColor: 'text-yellow-400',
    tagline: 'More output per dollar of engineering spend',
    group: 'business',
    content: {
      hero: {
        headline: 'More output per dollar of engineering spend',
        subhead:
          'AI-native teams do the work of teams 3× their size. Your runway goes further when every engineer has AI leverage — and the unit economics of building shift permanently.',
        primaryCta: 'See the financial case →',
      },
      journey: {
        waterfall: {
          feeling: 'Every feature was a capital allocation decision with a 12-month payback cycle',
          pain: 'CapEx-heavy, slow to realize value. Engineering headcount was the primary lever for output, and it was expensive.',
        },
        agile: {
          feeling: 'OpEx model, but headcount was still the main dial for engineering output',
          pain: 'Sprint teams had finite capacity. Scaling meant hiring. Hiring was slow and expensive.',
        },
        aiNative: {
          feeling: 'One AI-leveraged engineer replaces three without AI. The math on build vs. buy changes.',
          pain: 'The new cost structure is model API spend, tooling, and the organizational change management to adopt it.',
        },
        insight: 'The correct unit for engineering efficiency is now "output per dollar," not "headcount." AI fundamentally changes that ratio.',
      },
      modelsIntro:
        'Foundation model pricing is the new cloud compute pricing — a variable cost that scales with value delivered. Understanding token pricing, context costs, and the tradeoffs between model tiers is now a relevant input to engineering investment decisions.',
      howToBuild: [
        { emoji: '📋', label: 'Model the leverage ratio', desc: 'Before hiring, ask: can AI give the current team this capacity?' },
        { emoji: '🤖', label: 'Invest in AI tooling', desc: 'Copilot, Cursor, AI-native CI/CD. The ROI is measurable within a quarter.' },
        { emoji: '📊', label: 'Measure output per dollar', desc: 'Features shipped, bugs resolved, time-to-production — per engineering dollar.' },
        { emoji: '🔗', label: 'Optimize the model spend', desc: 'Not every call needs GPT-4. Match model tier to task complexity.' },
        { emoji: '📈', label: 'Report the leverage', desc: 'The board cares about unit economics. AI leverage improves every metric that matters.' },
      ],
      waitlist: {
        headline: 'Understand the unit economics of AI-native development',
        subtext: 'Learn how AI changes the build-vs-buy calculus, engineering leverage ratios, and the financial model of software teams.',
      },
      definitionOfDone: 'CAC, LTV, and burn rate are all trending in the right direction — and engineering spend per unit of output is falling',
      vocabulary: ['burn rate', 'runway', 'CAC', 'LTV', 'unit economics', 'OpEx', 'CapEx', 'ROI', 'leverage ratio'],
    },
  },

  {
    slug: 'data',
    name: 'Data',
    emoji: '🔬',
    color: 'bg-purple-600',
    ringColor: 'ring-purple-400',
    textColor: 'text-purple-400',
    tagline: 'Data pipelines that explain themselves',
    group: 'business',
    content: {
      hero: {
        headline: 'Data pipelines that explain themselves',
        subhead:
          'AI writes the queries, spots the anomalies, and summarizes the insights. You make the decisions — the analysis is no longer the bottleneck.',
        primaryCta: 'See the data workflow →',
      },
      journey: {
        waterfall: {
          feeling: 'Data was a quarterly report. By the time you saw it, it was historical.',
          pain: 'Insights arrived after the decisions were already made. The feedback loop was measured in months.',
        },
        agile: {
          feeling: 'Dashboards improved. Real-time data became table stakes. But insight still required analysts.',
          pain: 'Data was available, but interpretation was the bottleneck. The ratio of data to insight was still too low.',
        },
        aiNative: {
          feeling: 'Ask your data a question in plain English. Get the answer, the chart, and the anomaly in seconds.',
          pain: 'The risk is trusting AI-generated analysis without verifying the underlying query or data quality.',
        },
        insight: 'The role of a data professional shifts from writing queries to validating AI-generated insights and asking better questions.',
      },
      modelsIntro:
        'Foundation models with code generation capabilities can write SQL, Python, and data transformation logic from a business question. Vision models can interpret charts and surface patterns humans miss. The value isn\'t just speed — it\'s the ability to explore hypotheses you would have deprioritized due to analysis cost.',
      howToBuild: [
        { emoji: '📦', label: 'Model your data', desc: 'Clean, structured data is the prerequisite. AI can\'t fix bad foundations.' },
        { emoji: '🤖', label: 'AI writes the queries', desc: 'Business question → SQL in seconds. Validate the logic, then run it.' },
        { emoji: '📊', label: 'AI interprets the results', desc: 'Charts, summaries, and anomaly detection. The "what does this mean" step.' },
        { emoji: '🔍', label: 'You verify the analysis', desc: 'AI is confident even when wrong. Data instincts are what catches the subtle errors.' },
        { emoji: '🔁', label: 'Close the loop', desc: 'Insights need to reach decisions. AI helps format findings for each audience.' },
      ],
      waitlist: {
        headline: 'Extract 10× more insight from your data with AI',
        subtext: 'Learn how AI-native data teams move from raw data to actionable insight faster than traditional analytics workflows.',
      },
      definitionOfDone: 'The team made a decision based on data, the data was right, and the decision was made this week — not this quarter',
      vocabulary: ['data model', 'pipeline', 'ETL', 'anomaly', 'semantic layer', 'observability', 'metric tree', 'A/B test'],
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export const DEFAULT_PERSONA_SLUG = 'founder';

export function getPersona(slug: string): Persona {
  return PERSONAS.find((p) => p.slug === slug) ?? PERSONAS[0];
}
