# Product Requirements and User Stories: Bidroom

This PRD preserves the strategic choices from the earlier business plan and adjusts them where current platform facts materially affect scope. The key adjustment is this: SIMAP already gives suppliers manual search, saved search subscriptions, document download after registration and interest registration, a Q&A forum, and online submission. SIMAP also has an API, but authenticated access is tied to user roles and tenderer registration. That means the smallest credible Bidroom product is not a new tender portal and not a submission tool. It is a qualification and evidence workflow that starts once a user has found a tender and can provide the relevant documents. citeturn4view1turn12view1turn20view0

## Product foundation

**Evidence quality note**

Facts from official or competitor sources are cited inline. Product choices, priorities, and UX requirements are strategic recommendations derived from the prior business plan plus current source constraints. Unvalidated items are labeled as assumptions or open questions.

**Document control**

| Field | Value |
| --- | --- |
| Product name | Bidroom |
| Version | v0.9 draft |
| Status | Draft for founder review |
| Date | 2026-06-10 |
| Owner | Malik |
| Document type | Product Requirements Document |
| Source inputs used | Founder-provided market analysis and business plan; current SIMAP platform pages, FAQs, API terms and changelog; Swiss SME portal procurement guidance; Swiss data-protection guidance; competitor pricing and feature pages. citeturn4view1turn12view1turn20view0turn22view0turn11view0turn4view5turn4view6turn4view7 |
| Core assumptions | Swiss-first launch; launch wedge is Swiss IT, cloud, cyber, data, and digital consultancies with 5 to 100 employees; solo technical founder; low to medium budget; cautious risk profile; bootstrapped SaaS, not services-first agency. |
| Out-of-scope technical decisions | Final cloud vendor, database, OCR provider, authentication vendor, payment processor, LLM provider, exact hosting region implementation. |
| Product constraints already known | Product must not imply it is an official SIMAP publication; SIMAP source data and Bidroom commentary must be clearly separated; MVP should not rely on persistent SIMAP credential automation; MVP should not include tender submission or signature validation. citeturn20view0turn12view1 |

**Product summary**

| Item | Requirement |
| --- | --- |
| One-sentence definition | Bidroom is supplier-side software that turns a Swiss public tender notice and its documents into a source-linked qualification brief, evidence checklist, and bid-or-pass workspace. |
| Main target user | A bid lead, operations lead, founder, or delivery lead at a Swiss IT or digital consultancy that bids repeatedly on public tenders but does not have a full procurement team. |
| Core problem | Firms can find tenders in SIMAP, but they still spend too much senior time reading documents, spotting blockers too late, and reassembling evidence manually. SIMAP itself already covers search, subscriptions, documents, questions, and online submission, so the gap is qualification and workflow, not portal access. citeturn4view1turn12view1 |
| Core value proposition | Help a supplier decide faster and more defensibly whether a tender fits, what could disqualify it, what evidence is required, and what must happen next. |
| Main use case | A user pastes a SIMAP notice URL, uploads the tender documents they already obtained, and receives a structured, source-linked qualification brief. |
| First wow moment | Within minutes, the user sees four things on one screen: likely blockers, key deadlines, required evidence, and a reasoned initial fit assessment with citations. |
| Business model summary | Free trial, then subscription. Early plans should be lighter and cheaper than the Swiss specialist baseline, because Bidroom is intentionally narrower at launch than TenderLift and less drafting-heavy than TenderClaw. TenderLift currently advertises CHF 190 per month Pro and CHF 390 per month Team. TenderClaw advertises CHF 39 per month after a three-month free trial, with an additional success-fee coach model. TenderWolf advertises €79 and €149 per month. citeturn11view0turn4view5turn4view6 |
| Trust and safety constraints | Source-linked, not source-free; decision support, not legal advice; no autonomous submission; no implied official status; no training on customer documents by default; no collusion-adjacent pricing or competitor coordination features. SIMAP requires commercial reusers to distinguish their additions from official data and display that SIMAP data are authoritative. citeturn20view0turn19search1 |
| What makes it different | It is positioned between discovery and proposal writing. It is Swiss-first, narrower than general tender platforms, and centered on qualification, evidence reuse, and trustable citations rather than broad drafting promises. |

**Product positioning**

| Item | Requirement |
| --- | --- |
| Product category | Supplier-side tender qualification and evidence workflow software |
| Narrow launch wedge | Swiss IT services, cloud, cybersecurity, data, and digital consultancies |
| Long-term vision | A supplier operating system for public-tender qualification, evidence reuse, and bid preparation across selected source platforms and countries |
| Primary positioning statement | Bidroom helps Swiss suppliers qualify public tenders before they spend senior time writing bids. |
| Homepage headline | Qualify Swiss public tenders before they consume your team. |
| Short descriptor | Source-linked SIMAP qualification, evidence workflow, and bid-or-pass decisions for Swiss suppliers. |
| Key promise | Bidroom will help users make faster, better documented bid-or-pass decisions. It will not claim to guarantee eligibility or wins. |
| What the product must never imply | Not an official SIMAP publication, not legal advice, not guaranteed compliance, not autonomous proposal submission, not a hidden consultant marketplace. |

This positioning follows directly from the current market and platform baseline. SIMAP already gives suppliers free search, up to 10 saved search subscriptions per user, document download after interest registration, Q&A, and online submission. TenderLift already sells broad Swiss tender monitoring with fit scoring, multilingual tender text, cited PDF summaries, change alerts, and an eligibility checklist. TenderClaw already sells a much broader grants-plus-tenders-plus-drafting story. Bidroom should therefore start one layer lower than generic discovery and one layer earlier than full drafting: qualification, evidence, and decision support. citeturn12view1turn11view0turn15view0

**Product boundaries**

**What the product is**

| Product role | Description | User value |
| --- | --- | --- |
| Qualification workspace | Reads a notice and documents, extracts likely blockers, deadlines, criteria, and required evidence | Cuts wasted review time |
| Evidence workflow | Connects tender requirements to reusable references, certifications, declarations, and CVs | Reduces repeated admin work |
| Bid-or-pass record | Lets teams record a decision, rationale, and next actions | Creates internal clarity and accountability |
| Exportable brief | Produces a clean summary for internal alignment | Makes adoption easier for small teams |
| Trustable analysis layer | Separates official tender source material from Bidroom interpretation and citations | Builds trust and reduces hallucination risk |

**What the product is not**

| Non-goal | Why it is out |
| --- | --- |
| Not an official publication of SIMAP | SIMAP requires third-party reusers not to create the impression that their output is an official publication and to state that SIMAP data are authoritative. citeturn20view0 |
| Not a submission tool | SIMAP already handles online submission and signature validation through the federal validator. Bidroom should not enter that risk area in v1. citeturn12view1 |
| Not a legal advice product | Swiss procurement criteria are formal. The product should support review, not give final legal interpretations. citeturn9search0turn10search0 |
| Not a bid-writing autopilot | That area is crowded, harder to trust, and broader than the launch wedge. Competitors already push drafting far more aggressively. citeturn15view0 |
| Not a public tender mirror in MVP | Legally and operationally unnecessary at launch. SIMAP already provides public search, and republishing creates additional compliance surface. citeturn4view1turn20view0 |
| Not a competitor-price or collusion tool | Competition authorities actively monitor bid rigging in public procurement. Bidroom must avoid features that could aid coordination or price alignment. citeturn19search1turn19search12 |
| Not an enterprise suite at launch | Would slow delivery and blur the wedge |
| Not an agency or coach marketplace at launch | Adds operational complexity and trust ambiguity |

**Product principles**

Swiss FADP now embeds privacy by design and privacy by default, and SIMAP API terms require official source data and third-party commentary to remain distinct. Those are not legal footnotes. They are product-shaping constraints. citeturn22view2turn20view0

| Principle | Meaning | Practical requirement | Good behavior | Bad behavior |
| --- | --- | --- | --- | --- |
| Source first | No important finding without evidence | Every blocker, deadline, criterion, and evidence item must link to source text or source file location | "Reference project evidence requested" with a source citation | "Looks eligible" with no traceability |
| Analysis is separate from source | Official data and Bidroom interpretation are different objects | UI must visually label "Official source" and "Bidroom analysis" separately | Read-only notice metadata plus clearly labeled analysis cards | Rewriting SIMAP fields into Bidroom wording without distinction |
| Decision support, not delegated compliance | Final responsibility stays with the customer | Product language must say "potential blocker", "needs review", or "based on provided documents" where appropriate | User confirms bid or pass | System auto-commits "eligible" |
| Fast first value | The first tender should not require a full setup project | Minimal setup before first analysis; deeper profile comes later | Sign up, paste URL, upload docs, get brief | Force full enterprise-style onboarding first |
| Privacy minimalism | Do not collect or expose more than needed | No training on customer docs by default; support views hide document content by default | Metadata-first support tools | Full document access for all admins |
| Honest uncertainty | The system must show what it does not know | Low-confidence findings are flagged and never presented as certain | "Question window not found in uploaded docs" | Invented deadline because one was expected |
| Build for repeat work | The product should save effort over repeated tenders | Focus the library and checklist on reusable evidence and recurring tasks | Reuse certification across tenders | One-off flashy summaries with no workflow memory |
| Narrow scope wins | Launch on the smallest wedge with real repeat demand | IT-service tender qualification first | Deep support for one user type | Shallow support for everyone |
| Text first, complex files later | Attachment variety is real | MVP supports text-oriented documents first and fails gracefully on unsupported files. SIMAP document formats can include e.g. DWG and compressed archives, which are not good MVP targets. citeturn12view0 | Clear unsupported-file warning | Pretend analysis of unreadable CAD files |
| Calm B2B trust language | Procurement users are risk-sensitive | Avoid "AI autopilot", "guaranteed", "win more automatically" | Conservative copy with audit cues | Hype-oriented promise language |

## Users and workflows

**Stakeholders**

| Stakeholder | Goals | Pain points | Risks | Product requirements created by this stakeholder |
| --- | --- | --- | --- | --- |
| Bid lead / operations lead | Qualify quickly, avoid missed blockers, keep evidence organized | Manual reading, ad hoc spreadsheets, scattered files | Distrust if analysis is opaque | Source citations, checklist, evidence mapping, export |
| Founder / managing partner | Stop wasting senior hours, decide whether to pursue public-sector revenue | Tenders feel formal, unfamiliar, risky | Will not pay for a vague tool | Fast value, clear ROI, simple pricing |
| Delivery lead / subject-matter lead | Review only when worth it | Late involvement on poor-fit tenders | Sees tool as extra admin | Early blocker summary and clear assigns |
| External bid consultant | Reuse qualification work across clients | Repetitive document reading | Fears disintermediation | Consultant mode later, multi-workspace later |
| Workspace admin | Manage access, billing, retention | Sensitive files, user churn | Security and privacy failures | Roles, audit logs, deletion, exports |
| Support / founder operator | Diagnose failures without violating privacy | Parser errors, user confusion | Overexposure to customer docs | Metadata-first admin console, break-glass access |
| SIMAP association | Preserve proper reuse conditions | Misleading republication, misuse, legal breaches | Access restrictions, contract termination | Official disclaimer, source separation, compliant reuse citeturn20view0 |
| Regulators / legal reviewers | Avoid misleading advice and privacy violations | Ambiguous wording, over-automation | Product claims exceed safe scope | Prohibited wording, consent checks, data rights support |
| Payment and subprocessor partners | Clean billing and lawful processing | Failed payments, unclear subprocessors | Charge disputes, compliance issues | Billing states, DPA-ready architecture requirements |
| Engineering and AI agents | Build safely and incrementally | Scope creep, hidden requirement gaps | Overbuilding wrong features | Traceability, strict priorities, requirement IDs |

**Target segments**

| Segment | Who they are | Problem | Current workaround | Trigger event | Pain intensity | Willingness to pay | Reachability | Trust barriers | Launch priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Swiss IT and cloud consultancies | 5 to 100 person firms selling digital services to public buyers | Poor-fit tender review consumes senior hours | SIMAP search, saved searches, email, spreadsheet, ChatGPT | A live relevant SIMAP notice appears | High | Medium to high | High | Fear of hallucinated compliance claims | Highest |
| Cybersecurity and managed-service providers | Similar size, higher compliance burden | Requirements and evidence requests are dense | Manual review by technical leads | Security-heavy tender or framework agreement | High | High | Medium | Need proof and citations, not generic summaries | High |
| Data, AI, and software boutiques | Want public-sector revenue but weak internal procurement habits | Public procurement process feels foreign | Avoid bidding or use ad hoc help | First public opportunity in their niche | Medium to high | Medium | Medium | They may think they do not bid often enough | Medium |
| Engineering consultancies | Established bidders with more repeat volume | Repetitive review and multilingual docs | Internal templates and PM review | Multiple concurrent bids | High | High | Medium | More complex annexes and drawings | Medium, but second wedge |
| Bid consultants | Manage qualification for multiple suppliers | Repeated reading and checklist creation | Email and folder-heavy process | Handling several client tenders at once | Medium | High | Medium | May prefer white-label or multi-client mode | Later |

**Personas**

| Persona | Situation | Goal | Current workaround | Main frustration | Trigger moment | Success moment | Objections | Required capabilities | Best message |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Lina, operations lead | 25-person cloud and cyber consultancy | Decide within one morning whether the team should bid | SIMAP alerts, spreadsheet, shared drive | The team reads too much before they know if it fits | New tender from canton or federal buyer | She sees blockers, deadlines, and missing evidence in one view | "I do not trust black-box AI" | Source-linked analysis, checklist, export, comments | See the blockers before your team spends the day |
| Marco, founder | 12-person data and AI consultancy new to public tenders | Avoid wasting billable senior time | Gut feel, peer advice, occasional consultant | Procurement feels formal and hard to decode | A tender closely matches company services | He gets a reasoned bid-or-pass brief and can say no with confidence | "We do not bid often enough for SaaS" | Very fast first analysis, low-friction trial, clear rationale | Know in minutes whether this tender deserves your time |
| Sophie, delivery partner | Engineering-adjacent boutique already bidding | Reduce repetitive review and document chaos | Internal templates and manual PDF reading | Addenda and evidence collection are expensive and error-prone | Multiple tenders overlap | She delegates from a structured checklist instead of rereading documents | "We already have a process" | Reusable evidence, change-aware reanalysis, exports | Keep your process. Remove the most expensive manual review |
| Daniel, external bid consultant | Supports several SME clients | Standardize qualification work across accounts | Email, Word, folders | Rebuilding the same checklists client by client | New client asks for quick screening | He produces a client-ready brief quickly | "I need client separation and branded output" | Multi-workspace, branded export, later consultant mode | Turn repetitive qualification work into a reusable workflow |

**Jobs to be done**

| Type | Job statement | MVP importance | In scope |
| --- | --- | --- | --- |
| Functional | When I find a relevant SIMAP tender, I want to understand likely blockers, deadlines, and evidence requests quickly, so I can decide whether to bid before wasting senior time. | Highest | Yes |
| Functional | When I upload tender documents, I want the product to separate official source facts from Bidroom analysis, so I can trust what came from where. | Highest | Yes |
| Functional | When a tender requires recurring evidence, I want to attach reusable files and facts to a checklist, so I do not rebuild the same package every time. | Highest | Yes |
| Functional | When my team decides to bid or pass, I want to store that decision and the reason, so later review is possible. | High | Yes |
| Functional | When tender documents change, I want to know what changed and whether it affects our earlier decision, so missed addenda do not hurt us. | High | Partial in v1 |
| Emotional | When I review a public tender, I want to feel I did not miss an obvious disqualifier, so I can defend the decision internally. | High | Yes |
| Emotional | When the tool is uncertain, I want it to say so clearly, so I do not over-trust it. | High | Yes |
| Social | When I share an internal recommendation, I want it to look structured and professional, so colleagues take it seriously. | Medium | Yes |
| Operational | When I run qualification repeatedly, I want my evidence library to get more useful over time, so the second and third tender are easier than the first. | High | Yes |
| Out of scope | When I decide to bid, I want the system to write the entire proposal and prepare final submission files automatically. | Low for MVP, attractive later | No |
| Out of scope | When I price a tender, I want the system to tell me what competitors will bid. | Unsafe | No |
| Out of scope | When I am done, I want the system to submit directly into SIMAP and manage signature validation. | Unsafe and unnecessary in v1 | No |

**Core user journeys**

| Journey | Persona | Trigger | Start state | Steps | Desired end state | Failure states | Recovery behavior | Required features | Success metric |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| First-time visitor | Marco | Sees landing page or referral | No account | Read positioning, view sample analysis, start trial | Understands what Bidroom does and does not do | Messaging too broad or too vague | Show sample report and clear non-goals | Marketing site, sample report, compliant copy | Trial start rate |
| Activation | Lina | Wants to test on a live tender | New account | Create workspace, set minimal company profile, paste SIMAP URL, upload docs | First qualification brief completed | Invalid URL, missing docs, processing stalls | Explain which inputs are required and why | Auth, workspace, URL intake, upload, processing status | First dossier completed within 24 hours |
| Core value | Lina | Analysis ready | Tender dossier exists | Open summary, inspect blockers, review deadlines, inspect citations, record bid or pass | Decision saved with rationale | Findings have no citations, uncertainty hidden | Flag missing confidence and allow feedback | Summary, citations, confidence, decision record | Decision recorded per dossier |
| Save or return | Sophie | Tender moves forward or changes | Existing dossier | Return to dossier, update evidence, rerun analysis on new docs, export brief | Dossier remains current and useful | Stale docs, forgotten deadlines | Stale marker, reminder, compare versions | Versioning, checklist, reminders, export | Repeat usage per account |
| Payment or upgrade | Marco | Trial limit reached or second teammate needed | Active trial or solo plan | Review limits, upgrade, confirm entitlements | Paid account active without data loss | Charges unclear, surprise lockout | Show plan comparison and grace rules clearly | Billing, entitlements, upgrade UX | Trial-to-paid conversion |
| Data export or deletion | Workspace admin | Wants to leave or handle compliance request | Existing paid or canceled account | Request export, download package, delete workspace or account | Data exported or deleted within policy window | Export incomplete, deletion opaque | Status screen and confirmations | Export tooling, deletion workflow | Fulfilled requests within SLA |
| Admin or support | Founder operator | User reports parser failure | Support account only | Lookup account metadata, inspect safe logs, view processing error, optionally use break-glass access | Issue diagnosed without unnecessary document exposure | Admin sees too much by default | Force explicit, logged escalation for file access | Admin console, safe logs, audit trail | Time to first useful support response |

## Product structure and scope

The current source and competitor landscape strongly argues for a narrower MVP. SIMAP already provides search, subscriptions, document access after registration and interest declaration, Q&A, and online submission. It also states that notification emails are not guaranteed. TenderLift already offers broad Swiss monitoring, multi-language support, explanations, change alerts, and eligibility checklists. Bidroom should therefore concentrate its P0 scope on qualification after tender discovery, not on rebuilding a weaker version of SIMAP or a full-featured Swiss monitoring suite. citeturn12view1turn20view0turn11view0

**Information architecture**

| Area | Purpose | Main user actions | Priority | Notes |
| --- | --- | --- | --- | --- |
| Marketing site | Explain product and trust boundaries | View sample, start trial, request demo | P0 | Must include disclaimer language and non-goals |
| Sign-up and auth | Account access | Register, verify email, sign in, reset password | P0 | SSO later |
| Workspace home | Entry point after login | View active dossiers, recent decisions, reminders | P0 | Should lead to first tender quickly |
| New analysis intake | Start a dossier | Paste SIMAP URL, upload docs, choose working language | P0 | MVP does not require automated SIMAP sync |
| Tender dossier overview | Central decision screen | Read summary, fit assessment, blockers, deadlines | P0 | Must separate source vs analysis |
| Findings view | Inspect extracted facts | Open citations, confirm or dismiss findings, add notes | P0 | Trust-critical |
| Checklist and tasks | Convert findings into work | Assign tasks, mark complete, attach evidence | P0 | Collaboration light in MVP |
| Evidence library | Store reusable proof | Upload item, classify, attach to tender | P0 | Starts simple |
| Company profile | Improve fit assessments | Edit capabilities, certifications, regions, languages | P0 | Minimal first, richer later |
| Exports and history | Share and audit | Download brief, inspect prior analysis versions | P1 | Internal adoption support |
| Billing and plan | Monetization | Start trial, upgrade, manage seats | P1 | Not needed for pre-pilot prototype |
| Settings and privacy | User control | Edit profile, retention, exports, delete account | P0 | Rights and trust |
| Admin console | Support and moderation | Lookup account, logs, overrides, compliance actions | P1 | Metadata-first |
| Legal and trust pages | Contract and privacy | View privacy, terms, subprocessors, security notes | P0 | Trust requirement |

**Core domain model**

| Object | Description | Owner | Key fields | User actions | Lifecycle states | Relationships | Sensitivity | MVP priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| User | Login identity | Individual | name, email, role, language | register, sign in, invite, remove | invited, active, suspended, deleted | belongs to workspace | Medium | P0 |
| Workspace | Company tenant | Customer company | company name, billing status, working language, admins | create, rename, upgrade, delete | trial, active, grace, canceled | has users, dossiers, evidence, exports | High | P0 |
| Company profile | Qualification baseline | Workspace | capability tags, geographies, languages, certifications, exclusions | edit, enrich, version | draft, active | linked to dossiers and findings | Medium | P0 |
| Tender source item | Official notice reference | System | SIMAP URL, notice ID, authority, title, procedure type, source timestamp | import, refresh | imported, stale, archived | linked to dossier | Low to medium | P0 |
| Tender dossier | User-managed tender case | Workspace | tender title, source item, uploaded docs, analysis version, status | create, process, rerun, archive | draft, processing, ready, needs_review, archived | has findings, tasks, decision, export | High | P0 |
| Uploaded file | Tender or evidence file | Workspace | filename, type, size, upload time, category | upload, replace, delete, download | uploaded, processed, failed, deleted | linked to dossier or evidence item | High | P0 |
| Finding | Structured extracted item | System but editable by user | type, severity, statement, confidence, citation, status | confirm, dismiss, note, filter | open, confirmed, dismissed | belongs to dossier | Medium | P0 |
| Deadline event | Important date | System | date, label, source, confidence | add to calendar later, remind | upcoming, passed, changed | type of finding or related object | Medium | P0 |
| Checklist task | Action generated from findings | Workspace | title, owner, due date, linked finding, linked evidence | assign, complete, reopen | open, in_progress, done, blocked | linked to dossier and evidence | Medium | P0 |
| Evidence item | Reusable company proof | Workspace | title, type, description, tags, validity date, file | upload, edit, link, archive | active, expired, archived | linked to tasks and dossiers | High | P0 |
| Decision record | Bid or pass outcome | Workspace | status, rationale, owner, timestamp | create, edit, reopen | undecided, bid, pass, hold | belongs to dossier | Medium | P0 |
| Export | Shareable output | Workspace | format, generated at, scope, recipient note | generate, download | ready, expired | belongs to dossier | Medium | P1 |
| Alert | Notification item | System | type, trigger, delivery channel, state | view, snooze, dismiss | pending, sent, failed | linked to dossier or billing | Low to medium | P1 |
| Subscription plan | Commercial entitlement | System | plan name, limits, price, status | upgrade, downgrade, cancel | trial, paid, grace, canceled | attached to workspace | Medium | P1 |
| Audit event | Sensitive action record | System | actor, action, object, timestamp, access type | view in admin | immutable | linked across objects | Medium | P1 |
| Support case | Internal operational item | Operator | issue type, severity, status, notes | open, resolve, escalate | open, in_review, resolved | linked to workspace | Medium | P1 |

**Feature inventory**

| Feature name | Description | User value | Priority | Complexity | Risk | Dependencies | MVP inclusion | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Email account creation and login | Basic account system | Access and identity | P0 | Low | Low | None | Yes | SSO later |
| Workspace creation | Company-level space | Data separation | P0 | Low | Low | Auth | Yes | |
| Minimal company profile | Capability baseline for fit analysis | Better signal | P0 | Low | Low | Workspace | Yes | Keep small |
| SIMAP URL intake | Create dossier from public notice URL | Fast start | P0 | Low | Low | Workspace | Yes | SIMAP-only in v1 |
| Manual tender document upload | User adds docs already obtained from SIMAP | Required for meaningful review | P0 | Medium | Medium | Dossier | Yes | Avoids early credential automation |
| Dossier processing status | Shows analysis running state | Trust during processing | P0 | Low | Low | Intake | Yes | |
| Qualification summary | Fit rationale, blockers, deadlines, criteria | Core value | P0 | Medium | High | Analysis pipeline | Yes | |
| Citation viewer | Clickable source references | Trust and auditability | P0 | Medium | High | Analysis pipeline | Yes | Non-negotiable |
| Confidence and uncertainty labels | Shows what is uncertain | Prevents over-trust | P0 | Medium | High | Analysis pipeline | Yes | |
| Finding confirmation and dismissal | User corrects or confirms results | Builds trust | P0 | Low | Medium | Findings | Yes | |
| Deadline timeline | Shows key dates clearly | Reduces missed steps | P0 | Low | Medium | Findings | Yes | |
| Requirement checklist | Action list derived from findings | Operational value | P0 | Medium | Medium | Findings | Yes | |
| Evidence library lite | Store reusable proof documents | Repeat-use value | P0 | Medium | Medium | Workspace | Yes | Start with categories only |
| Link evidence to checklist | Attach reusable evidence to a tender | Cuts repeated work | P0 | Low | Low | Evidence library | Yes | |
| Bid / pass / hold decision record | Save decision and reason | Team clarity | P0 | Low | Low | Dossier | Yes | |
| PDF export | Share brief internally | Adoption | P0 | Low | Low | Dossier | Yes | |
| Data export and deletion | User rights and trust | Compliance and control | P0 | Medium | Medium | Workspace | Yes | |
| Sample dossier | Demo without customer data | Better onboarding | P1 | Low | Low | Marketing | Yes, if easy | Strong trust aid |
| Re-analysis on new docs | Update when user uploads revised files | Handles addenda manually | P1 | Medium | Medium | Dossier versioning | Yes | More useful than auto alerts early |
| Team comments and assignments | Shared workflow | Better collaboration | P1 | Medium | Low | Tasks, users | No for first prototype, yes for paid launch | |
| Calendar and email reminders | Reminder delivery | Lower drop-off | P1 | Medium | Medium | Alerts | No for prototype, yes for paid launch | |
| Smart saved searches | User-defined matching against new notices | Discovery help | P1 | Medium | Medium | Search ingestion | No for MVP | SIMAP already provides basic subscriptions |
| Billing and plan gating | Monetization | Paid launch | P1 | Medium | Medium | Workspace | No for prototype, yes for paid launch | |
| Stale-dossier signal | Marks when source notice changed | Keeps analysis current | P1 | Medium | Medium | Source refresh | No for prototype, yes for paid launch | |
| Shared team workspace up to 5 users | Small-team mode | Higher value account | P1 | Medium | Low | Users, billing | Yes for paid launch | |
| SIMAP authenticated document sync | Pull docs after tenderer auth | Less manual upload | P2 | High | Medium | Platform integration | No | Important later, not first |
| Automatic addenda import and diff | Track notice and document changes automatically | High retention value | P2 | High | Medium | Source sync | No | |
| Consultant multi-client mode | Separate client workspaces | Partner channel | P2 | Medium | Medium | Workspace model | No | |
| CRM / Teams / Slack integration | External workflow links | Convenience | P2 | Medium | Low | API/events | No | |
| International sources | TED, UK, SAM.gov | Market expansion | P3 | High | High | New source packs | No | |
| Proposal drafting assistant | Narrative support | Attractive but risky | P3 | Medium | High | Evidence and analysis | No | Only after qualification core works |
| Public tender directory | Public Bidroom tender archive | SEO | Out | High | High | Source reuse | No | Not for MVP |
| Autonomous submission | Submit into SIMAP | Convenience with high liability | Out | High | Very high | Platform integration | No | |
| Competitor price recommendations | Market intelligence | Unsafe in this category | Out | Medium | Very high | External data | No | |
| Mobile app | Mobile client | Low early value | Out | Medium | Low | All features | No | |

**Epics**

| Epic ID | Epic name | Goal | User problem solved | Included features | Excluded features | Priority | Dependencies | Risks | Success metrics | Exit criteria |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | Access and workspace setup | Get a real user into a usable workspace fast | Trial setup friction | Auth, workspace, minimal profile | SSO, enterprise provisioning | P0 | None | Low | Signup completion | User can create workspace and reach intake in under 5 minutes |
| E-02 | Tender intake and dossier creation | Let users start from a real SIMAP tender | No fast path from live tender to analysis | SIMAP URL intake, manual upload, status | Full SIMAP sync | P0 | E-01 | Medium | Dossiers created per trial | User can create dossier from URL and docs |
| E-03 | Qualification analysis and citations | Deliver the core product value | Manual document reading is slow and error-prone | Summary, findings, citations, confidence, deadlines | Drafting, pricing help | P0 | E-02 | High | Completed analyses, citation usage | User gets source-linked brief on live tender |
| E-04 | Checklist and evidence workflow | Convert review into work | Findings do not yet move operational work | Checklist, evidence library, link evidence | Deep task system | P0 | E-03 | Medium | Evidence reuse rate | User can attach evidence to checklist items |
| E-05 | Decision and export | Capture value and share it | Decision logic and rationale are lost in chat and email | Bid/pass/hold, rationale, PDF export | Advanced reporting | P0 | E-03 | Low | Decisions per dossier | User can save and export decision |
| E-06 | Retention and alerts | Bring users back when tenders change or deadlines matter | One-off summaries do not retain | Re-analysis, reminders, stale-dossier flag | Full automated monitoring | P1 | E-03, E-05 | Medium | Repeat use | Users revisit active dossiers |
| E-07 | Billing and entitlements | Monetize without breaking trust | No plan control or upgrade flow | Trial, plan limits, upgrade, downgrade | Success-fee logic | P1 | E-01 | Medium | Trial-to-paid | Users can upgrade without losing data |
| E-08 | Privacy, admin, and support | Operate safely | Support needs visibility without privacy overreach | Admin console, safe logs, export/delete, audit | Broad admin content browsing | P1 | All P0 epics | High | Support response time, deletion SLA | Sensitive operations are logged and bounded |

## Stories and requirements

**User stories**

| Story ID | Epic ID | User story | Priority | Rationale | Acceptance criteria | Edge cases | Analytics event | Dependencies | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| US-001 | E-01 | As a first-time visitor, I want to see a sample Bidroom analysis, so that I understand the output before creating an account. | P1 | Trust is hard in procurement | Given a public visitor, when they open the sample page, then they can see a non-confidential example with source/analysis separation and product limitations. | Sample becomes stale | sample_viewed | None | Strong onboarding aid |
| US-002 | E-01 | As a new user, I want to create a workspace with minimal inputs, so that I can test a live tender quickly. | P0 | Fast activation matters | Given a work email, company name, and password or magic-link flow, when sign-up is completed, then a workspace is created and the user lands in intake. | Duplicate email, expired token | workspace_created | None | Use minimal fields |
| US-003 | E-01 | As a workspace owner, I want to set a working language, so that Bidroom presents outputs consistently. | P0 | Switzerland is multilingual | Given a new workspace, when the owner selects a working language, then summaries and UI labels use that choice where supported. | Unsupported language selection | work_language_set | US-002 | MVP output language can be narrower than source language support |
| US-004 | E-01 | As a user, I want to enter a minimal company profile, so that the fit assessment uses my actual capabilities. | P0 | Reduces generic results | Given a workspace, when a user enters capability tags, regions, languages, and certifications, then the profile is saved and used in analysis. | Empty profile | profile_saved | US-002 | Keep required fields small |
| US-005 | E-02 | As a user, I want to paste a SIMAP tender URL, so that I can start analysis from a real opportunity. | P0 | Core intake path | Given a valid SIMAP notice URL, when submitted, then a dossier is created with raw source metadata and processing begins. Given an invalid or unsupported URL, then the system explains why and does not create a broken dossier. | Wrong domain, deleted notice | dossier_created_from_url | US-002 | SIMAP-only in v1 |
| US-006 | E-02 | As a user, I want to upload tender documents obtained from SIMAP, so that Bidroom can analyze the actual tender requirements. | P0 | Notice-only analysis is often insufficient | Given a dossier, when user uploads supported files, then files are attached and queued for analysis. Unsupported files are flagged explicitly. | Password-protected PDFs, oversized files, DWG/7z | tender_docs_uploaded | US-005 | Do not fake support for unreadable files |
| US-007 | E-02 | As a user, I want processing status on my dossier, so that I know what the system is doing and when to wait versus intervene. | P0 | Reduces distrust | Given a new dossier, when analysis is running, then status shows queued, processing, ready, or failed with actionable reason. | Partial failure | dossier_processing_status_viewed | US-005 | |
| US-008 | E-03 | As a user, I want a qualification summary with fit rationale, blockers, deadlines, award criteria, and evidence needs, so that I can decide whether to bid. | P0 | Core product outcome | Given a completed analysis, when user opens summary, then they see structured sections with cited findings and unsupported or uncertain areas explicitly labeled. | No documents, low-confidence extraction | qualification_summary_viewed | US-006 | No hidden certainty |
| US-009 | E-03 | As a user, I want each important finding to show its source citation, so that I can verify it quickly. | P0 | Trust-critical | Given a finding, when clicked, then the system opens the source excerpt or file location that supports it. | Source file unavailable or deleted | citation_opened | US-008 | Mandatory |
| US-010 | E-03 | As a user, I want low-confidence findings to be labeled clearly, so that I do not mistake guesses for facts. | P0 | Hallucination risk | Given a low-confidence finding, when displayed, then it is visually marked for review and not phrased as certain. | All findings low-confidence | finding_review_flagged | US-008 | |
| US-011 | E-03 | As a user, I want to confirm, dismiss, or comment on a finding, so that I can correct errors without abandoning the dossier. | P0 | Recovery path | Given a finding, when user marks it confirmed or wrong, then the new status is saved and visible in the dossier. | Conflicting team edits later | finding_feedback_submitted | US-008 | |
| US-012 | E-04 | As a user, I want a generated checklist from the findings, so that I can turn review into concrete work. | P0 | Reasonable next step | Given a ready dossier, when user opens checklist, then tasks exist for evidence collection and review items detected in analysis. | No tasks extracted | checklist_generated | US-008 | |
| US-013 | E-04 | As a user, I want to upload reusable evidence items, so that I can refer to them across tenders. | P0 | Repeat-use value | Given the evidence library, when a user uploads a file and classifies it, then it becomes available to link to tasks. | Duplicate or expired file | evidence_item_created | US-002 | |
| US-014 | E-04 | As a user, I want to link evidence items to checklist tasks, so that I can see what is covered and what is missing. | P0 | Practical workflow | Given a checklist task, when a user attaches one or more evidence items, then task state updates accordingly. | Wrong evidence attached | evidence_linked_to_task | US-012, US-013 | |
| US-015 | E-05 | As a user, I want to record a bid, pass, or hold decision with rationale, so that future review is possible. | P0 | Core business record | Given an analyzed dossier, when user selects a decision and enters reason, then the decision is stored with timestamp and owner. | User changes mind later | decision_recorded | US-008 | |
| US-016 | E-05 | As a user, I want to export a clean briefing PDF, so that I can share the recommendation internally. | P0 | Work product must travel | Given a dossier with decision or findings, when export is requested, then a PDF is generated with source-analysis separation and disclaimer text. | Export generation fails | dossier_exported | US-008, US-015 | |
| US-017 | E-06 | As a user, I want to rerun analysis when new or updated tender documents arrive, so that my dossier stays current. | P1 | Addenda matter | Given an existing dossier, when a user uploads updated files, then Bidroom creates a new analysis version and surfaces changed findings where possible. | Same file uploaded twice | dossier_reanalyzed | US-006, US-008 | Important before auto-sync |
| US-018 | E-06 | As a user, I want reminders for upcoming deadlines and stale dossiers, so that I revisit the right cases. | P1 | Retention and utility | Given an active dossier with deadlines, when threshold conditions are met, then reminder records are generated and visible; for paid plans, notification delivery obeys user settings. | Email failure | reminder_generated | US-008 | Do not promise guaranteed delivery |
| US-019 | E-07 | As a workspace owner, I want to start a free trial without entering a credit card, so that evaluation friction stays low. | P1 | Category expectation | Given a new workspace, when trial begins, then plan status and limits are visible before billing data is requested. | Trial abuse | trial_started | US-002 | Competitor norm |
| US-020 | E-07 | As a workspace owner, I want to upgrade to a paid plan and keep my data, so that billing does not interrupt work. | P1 | Paid launch requirement | Given an active trial or lower plan, when upgrade succeeds, then entitlements update immediately and existing dossiers remain intact. | Payment failure | plan_upgraded | US-019 | |
| US-021 | E-07 | As a workspace owner, I want clear downgrade and cancellation behavior, so that I know what happens to seats and data. | P1 | Trust in billing | Given a paid plan, when owner cancels or downgrades, then timing, grace period, and data retention outcomes are shown before confirmation. | Plan exceeds new limits | plan_changed | US-020 | |
| US-022 | E-08 | As a user, I want to export my workspace data or delete my account, so that I keep control over my information. | P0 | FADP rights support | Given a verified user, when export or deletion is requested, then the system confirms scope, logs request, and completes it within policy. | Shared workspace ownership conflict | privacy_request_submitted | US-002 | |
| US-023 | E-08 | As a support operator, I want metadata-first diagnostics, so that I can resolve issues without opening sensitive customer documents. | P1 | Privacy boundary | Given a support case, when admin opens account diagnostics, then only metadata and safe logs are shown by default. | Complex parser bug | support_case_opened | Admin console | |
| US-024 | E-08 | As a support operator, I want break-glass document access to require a logged reason, so that exceptional access is controlled. | P1 | Sensitive file risk | Given a support case, when admin requests document access, then the system requires reason entry, logs the event, and exposes only the minimum necessary scope. | Emergency access | break_glass_access_used | US-023 | |

**Functional requirements**

| Requirement ID | Requirement | Priority | Source story or epic | Acceptance test idea | Notes |
| --- | --- | --- | --- | --- | --- |
| ACC-001 | The product MUST support workspace creation through an email-based sign-up flow. | P0 | US-002 | Create account and verify workspace exists | |
| ACC-002 | The product MUST support at least two workspace roles in MVP: owner and member. | P0 | E-01 | Invite second user and verify permissions | |
| ACC-003 | The product SHOULD support invite links or email invites for additional members by paid launch. | P1 | US-020 | Send invite and accept it | |
| WRK-001 | The product MUST store a workspace-level working language used for summaries and exports. | P0 | US-003 | Switch language and verify summary locale where supported | |
| WRK-002 | The product MUST collect only a minimal company profile before first real analysis. | P0 | US-004 | Ensure no unnecessary fields block progression | |
| TND-001 | The product MUST accept public SIMAP notice URLs as the primary dossier intake method in MVP. | P0 | US-005 | Submit valid notice URL and create dossier | |
| TND-002 | The product MUST reject unsupported URLs with a clear explanation. | P0 | US-005 | Submit non-SIMAP URL | |
| TND-003 | The product MUST allow users to upload tender documents manually to a dossier. | P0 | US-006 | Upload supported files and verify attachment | |
| TND-004 | The product MUST support PDF and DOCX analysis in MVP and MAY store but not fully analyze additional file types. | P0 | US-006 | Upload PDF and DOCX, verify text extraction | Because SIMAP supports more complex file formats such as DWG and archives, MVP must stay narrower. citeturn12view0 |
| TND-005 | The product MUST flag unsupported, corrupted, oversized, or password-protected files explicitly and MUST NOT imply they were analyzed. | P0 | US-006 | Upload password-protected PDF | |
| TND-006 | The product MUST show dossier processing states and last updated time. | P0 | US-007 | Observe state transitions | |
| ANA-001 | The product MUST produce a structured qualification brief with at least: overview, likely blockers, deadlines, evidence needs, and uncertainty notes. | P0 | US-008 | Verify all sections exist for a standard dossier | |
| ANA-002 | The product SHOULD extract award criteria, procedure type, lots, and question windows when present in the source material. | P0 | US-008 | Use sample tender containing each item | |
| ANA-003 | Every material finding shown to the user MUST include a traceable source citation. | P0 | US-009 | Click finding and verify source excerpt | |
| ANA-004 | The product MUST visually distinguish official source material from Bidroom-generated analysis. | P0 | US-009 | Verify labeled sections in summary and export | Required by SIMAP API terms. citeturn20view0 |
| ANA-005 | The product MUST label low-confidence findings for human review and MUST NOT phrase them as certain facts. | P0 | US-010 | Force low-confidence case | |
| ANA-006 | The product MUST allow users to confirm, dismiss, or comment on findings. | P0 | US-011 | Update finding status | |
| ANA-007 | The product MAY compute an internal fit score, but the primary user-facing output MUST be reasoned fit rationale, not a standalone score. | P1 | E-03 | Verify summary still useful with score hidden | |
| CHK-001 | The product MUST generate a checklist from extracted findings. | P0 | US-012 | Analyze dossier and inspect checklist | |
| CHK-002 | Checklist items MUST support owner, status, due date, and linked finding. | P0 | US-012 | Create and update task | |
| EVD-001 | The product MUST provide an evidence library with typed items at least for reference project, certification, declaration, CV, insurance, and other. | P0 | US-013 | Upload one item of each type | |
| EVD-002 | The product SHOULD support optional validity dates and tags on evidence items by paid launch. | P1 | US-013 | Set validity date and filter | |
| EVD-003 | The product MUST allow evidence items to be linked to checklist tasks. | P0 | US-014 | Attach evidence and verify link | |
| DEC-001 | The product MUST let the user record Bid, Pass, or Hold with rationale and timestamp. | P0 | US-015 | Save each decision state | |
| DEC-002 | The product SHOULD retain decision history when a decision changes. | P1 | US-015 | Change decision and inspect history | |
| EXP-001 | The product MUST export a dossier brief as PDF in MVP. | P0 | US-016 | Generate and download export | |
| EXP-002 | The export MUST include the required source disclaimer and clearly separate source facts from Bidroom analysis. | P0 | US-016 | Inspect generated PDF | SIMAP term driven. citeturn20view0 |
| ALT-001 | The product SHOULD support re-analysis when new files are uploaded to an existing dossier. | P1 | US-017 | Upload revised doc and compare versions | |
| ALT-002 | The product SHOULD support workspace reminders for upcoming deadlines and stale dossiers by paid launch. | P1 | US-018 | Generate reminder based on threshold | |
| BILL-001 | The product MUST support trial, paid, grace, canceled, and delinquent billing states. | P1 | E-07 | Simulate failed payment and cancellation | |
| ENT-001 | The product MUST enforce plan limits by entitlements rather than hard-coded behavior. | P1 | E-07 | Change plan config and verify effect | |
| ENT-002 | The product MUST retain customer data across upgrade and downgrade events unless the user explicitly deletes it. | P1 | US-020, US-021 | Upgrade then downgrade | |
| ADM-001 | The admin console MUST allow support lookup by workspace and user identifiers. | P1 | US-023 | Search test account | |
| ADM-002 | The admin console MUST hide document content by default and show only metadata, events, and processing health. | P1 | US-023 | Verify admin default view | |
| ADM-003 | Break-glass document access MUST require a reason, be time-bounded, and create an audit event. | P1 | US-024 | Trigger break-glass flow | |
| SEC-001 | The product MUST support user-initiated account and workspace export and deletion flows. | P0 | US-022 | Run export and deletion request | |
| SEC-002 | The product MUST default to no training on customer tender and evidence documents. | P0 | Product principle | Verify policy and settings | Contract and trust requirement |
| LEG-001 | Wherever SIMAP source data are reused in product or export outputs, the product MUST display the statement required by SIMAP: "This is not an official publication. The data published on the www.simap.ch platform are authoritative." | P0 | E-03, E-05 | Inspect UI and export | Required by SIMAP API terms. citeturn20view0 |
| LEG-002 | The product MUST NOT modify official SIMAP source fields when displaying them as source material. | P0 | E-03 | Compare displayed source excerpt to original | Required by SIMAP API terms. citeturn20view0 |
| LEG-003 | The product MUST NOT use wording that implies legal advice, official status, guaranteed eligibility, or guaranteed wins. | P0 | Product boundary | Review copy and export templates | |
| LEG-004 | The product MUST NOT submit tenders to SIMAP or validate Qualified Electronic Signatures in MVP. | P0 | Product boundary | No submission or signature UI exists | SIMAP already supports submission and signature validation. citeturn12view1 |
| LEG-005 | The product MUST NOT provide collusion-adjacent features such as competitor price recommendations, bid alignment suggestions, or private competitor signal sharing. | P0 | Product boundary | Feature review | COMCO enforcement context. citeturn19search1turn19search12 |
| LEG-006 | The product MUST preserve the user's ability to request information, correction, deletion, restriction, objection, and portability where applicable under Swiss data-protection law. | P0 | US-022 | Review rights workflows | FADP rights are central. citeturn22view0 |

**Non-functional requirements**

| ID | Requirement | Priority | Measurement or acceptance test | Rationale |
| --- | --- | --- | --- | --- |
| NFR-PERF-001 | A notice-only dossier SHOULD reach ready or needs-docs state within 90 seconds median under normal load. | P0 | Median over staged test batch | Fast first value |
| NFR-PERF-002 | A standard dossier with up to 10 supported files and total upload size up to 50 MB SHOULD reach first analysis within 6 minutes median. | P0 | Timed test on representative files | Usable for real work |
| NFR-REL-001 | MVP availability SHOULD target 99.0% monthly excluding planned maintenance. Paid launch SHOULD target 99.5%. | P1 | Uptime monitoring | Serious B2B baseline |
| NFR-REL-002 | No single failed file MAY prevent access to all other dossier results. | P0 | Partial-failure test | Graceful degradation |
| NFR-SEC-001 | All user-facing sessions and data transfers MUST be encrypted in transit. | P0 | Security review | Baseline security |
| NFR-SEC-002 | Stored customer content and metadata MUST be encrypted at rest. | P0 | Security review | Sensitive docs |
| NFR-SEC-003 | Role-based access control MUST apply to workspaces, dossiers, evidence, billing, and admin functions. | P0 | Permission tests | Least privilege |
| NFR-PRIV-001 | The product MUST implement privacy by design and by default, including minimal required collection and privacy-safe defaults. | P0 | Product review checklist | FADP principle. citeturn22view2 |
| NFR-PRIV-002 | Logs MUST NOT store full document bodies or extracted personal data unless strictly necessary for a bounded admin function. | P0 | Log inspection | Support-safe operation |
| NFR-PRIV-003 | User export and deletion requests SHOULD be fulfilled without manual support intervention in standard cases. | P1 | Delete/export test | Rights support |
| NFR-AUD-001 | Sensitive actions such as break-glass access, deletion, billing override, and role changes MUST create immutable audit events. | P1 | Audit trail inspection | Accountability |
| NFR-I18N-001 | The product MUST accept source documents in German, French, Italian, and English. | P0 | Test with sample docs | Swiss market requirement |
| NFR-I18N-002 | MVP summaries and exports MUST support at least English; German SHOULD be supported at paid launch. | P0 | Locale test | Scope control |
| NFR-ACC-001 | Critical flows SHOULD meet WCAG 2.1 AA standards for keyboard traversal, contrast, and form labeling. | P1 | Accessibility audit | Professional baseline |
| NFR-BR-001 | MVP MUST support current major desktop browsers: Chrome, Edge, Firefox, and Safari. | P0 | Cross-browser QA | B2B desktop usage |
| NFR-BK-001 | Customer data MUST be backed up daily, and restore procedures SHOULD be tested at least monthly. | P1 | Backup and restore drill | Operational safety |
| NFR-OBS-001 | Product analytics MUST avoid storing customer document content and SHOULD rely on event metadata only. | P0 | Analytics schema review | Privacy-preserving measurement |
| NFR-MNT-001 | Plan limits, feature flags, and output-copy templates SHOULD be configurable without code changes for routine commercial or policy changes. | P1 | Admin config test | Solo-founder maintainability |

**Trust, legal, privacy, and safety requirements**

| Risk area | Requirement | Allowed behavior | Disallowed behavior | Priority |
| --- | --- | --- | --- | --- |
| Official-source status | Show the SIMAP-required disclaimer wherever source data are reused | "Official source notice" plus Bidroom analysis and required disclaimer | "Official Bidroom SIMAP view" | P0 |
| Source modification | Keep source text unmodified; make commentary separate | Read-only source excerpt with separate analysis card | Rewritten official text presented as source | P0 |
| Legal-advice boundary | Use recommendation language carefully | "Potential blocker based on uploaded docs" | "You are legally eligible" | P0 |
| Submission boundary | Keep submission outside product scope | "Prepare internal brief before SIMAP submission" | "Submit to SIMAP now" button in MVP | P0 |
| Signature and formality | Do not claim validated submission compliance | "Check tender docs for signature requirements" | "Bidroom validated your QES" | P0 |
| Privacy and consent | Require users to confirm they have the right to upload and process personal data in evidence files | Consent/authority acknowledgment on first upload | Silent ingestion of HR-sensitive files with no notice | P0 |
| Data minimization | Collect only what is necessary and allow deletion | Optional evidence metadata, deletion controls | Force excessive profile completion or indefinite retention | P0 |
| Automated decisions | Fit outputs must support human review and override | "Review needed" state and manual decision | Automatic bid/pass with no override | P0 |
| Data subject rights | Support information, correction, deletion, restriction, objection, and portability workflows where applicable | Export and deletion tools | No usable way to fulfill a request | P0 |
| Third-party processing | Disclose subprocessors and no-training policy clearly | Subprocessor list and terms | Hidden third-party sharing of customer docs | P0 |
| Admin access | Default support visibility to metadata only | Break-glass with logged reason | Unrestricted admin browsing of customer files | P1 |
| Competition-law sensitivity | Avoid collusion-adjacent features | Internal qualification workflow only | Price-coordination or competitor bid recommendation features | P0 |
| Future EU expansion | If Bidroom later targets EU users directly, product and legal review MUST assess GDPR territorial scope before launch | Separate EU expansion review | Assume Swiss-only rules are always sufficient | P2. GDPR can apply to non-EU controllers when offering goods or services to data subjects in the Union. citeturn14search1 |

## Commercial model and activation

**Monetization and entitlement model**

Because the trust relationship depends on honest qualification rather than incentive-biased recommendations, the pricing model should be subscription-based, not success-fee-based. TenderClaw currently combines low monthly pricing with a 5% success-fee coach model. That is viable for a grants-plus-services product, but it is a poor trust fit for Bidroom if Bidroom's core job is to recommend whether a user should spend time on a tender at all. TenderLift's current Swiss specialist price points, CHF 190 and CHF 390 per month, show the upper end of what a specialized Swiss tool can ask. TenderWolf and Open Opportunities show that multi-country monitoring products often sit around €79 to £55 per user per month at lower tiers. Bidroom should therefore launch below the Swiss specialist ceiling, with a narrower and more compact promise. citeturn11view0turn4view5turn4view6turn4view7

| Plan | Target user | Included features | Limits | Excluded features | Business rationale |
| --- | --- | --- | --- | --- | --- |
| Trial | First-time evaluator | Core dossier creation, summary, findings, citations, PDF export | 14 days, 3 active dossiers, 1 user | Team collaboration, reminders, advanced exports | Low-friction validation |
| Solo | One bid lead or founder | Trial features plus evidence library and decision history | 1 user, 20 active dossiers, 200 evidence items | Multi-user collaboration, admin-level controls | Small-team self-serve |
| Team | Small bid team | Solo plus shared workspace, assignments, reminders, higher storage | Up to 5 users, 100 active dossiers, 1 shared workspace | SSO, custom retention, custom agreements | Main paid plan |
| Enterprise | Larger or regulated customer | Team plus custom retention, security review package, SSO later, invoicing | Custom | None by default, but implementation may vary | Sales-led later |
| Consultant | External bid advisor | Multi-client workspaces, branded exports, client separation | Custom, later | Out of launch scope | Partner channel later |

**Recommended default launch pricing**

| Plan | Suggested price | Confidence | Notes |
| --- | --- | --- | --- |
| Trial | Free, 14 days, no credit card | High | Matches category expectation and competitor norm |
| Solo | CHF 69 monthly or CHF 59 monthly billed annually | Medium | Narrower than TenderLift, higher-value than a low-end generic tool |
| Team | CHF 169 monthly or CHF 149 monthly billed annually | Medium | Small-team value without enterprise overhead |
| Enterprise | Custom | High | Needed for later security and procurement-heavy buyers |

**What should be free, paid, and never monetized**

| Category | Rule |
| --- | --- |
| Free | Trial access, sample analysis, clear product tour, explanation of limitations |
| Paid | Ongoing dossier storage, evidence library, multi-user access, reminders, larger usage limits |
| Never monetize | Basic source citations, privacy rights workflows, deletion, exported access to the customer's own uploaded evidence, correction of clearly wrong analysis caused by product error |

**Billing and entitlement requirements**

| ID | Requirement | Priority | Notes |
| --- | --- | --- | --- |
| PLAN-001 | Trial MUST start without requiring card entry. | P1 | |
| PLAN-002 | Plan limits MUST be visible before the user hits them. | P1 | |
| ENT-003 | Dossier and evidence limits MUST be configurable by plan. | P1 | |
| BILL-002 | Failed payment SHOULD create a grace period before feature restriction. | P1 | Recommended default: 7 days |
| BILL-003 | During grace, product MUST remain read-only for existing workspaces except billing actions and exports of own data. | P1 | Avoid surprise lockouts |
| BILL-004 | Cancellation MUST take effect at period end unless immediate cancellation is chosen. | P1 | |
| BILL-005 | Refund policy SHOULD be clear and simple. Recommended default: no refund on monthly plans, 30-day refund window on annual plans. | P1 | |
| ENT-004 | Downgrade MUST not silently delete data. It MAY move excess data into read-only state with a clear resolution path. | P1 | |

**Onboarding and activation requirements**

| Topic | Requirement | Recommended default |
| --- | --- | --- |
| First screen | Show two choices: analyze a sample tender or analyze your own tender | Prevent blank first impression |
| Minimal inputs | Work email, company name, working language, SIMAP URL, optional docs | Do not request full company profile first |
| Demo or sample data | Include a safe sample dossier with citations and checklist | Trust aid |
| Required education | Explain three things before first analysis: what Bidroom does, what it does not do, and what documents improve results | Short inline education |
| Progressive disclosure | Ask only for the minimum profile before first result. Ask for deeper profile after first dossier. | Keep time-to-value short |
| Account timing | Require account for storing a real dossier. Allow public sample view without account. | Good balance |
| Activation metric | User completes one live dossier on their own tender and views at least one citation | Core activation |
| Time-to-value target | Under 15 minutes from signup to first qualification brief on a real tender | Ambitious but reasonable |
| Failure states | If docs are missing or unsupported, say exactly what is blocking full analysis and let the user continue with notice-only review | No dead ends |
| Empty states | Every empty page should propose the next useful action, not generic text | Practical UX |

**Acceptance criteria for the first wow moment**

A new user has reached the first wow moment when all of the following are true:

| Condition | Acceptance bar |
| --- | --- |
| Real dossier exists | User created a dossier from a live SIMAP notice URL |
| Enough source material exists | User provided at least the public notice and one supported document, or the product clearly states the analysis is notice-only |
| Qualified summary visible | User sees likely blockers, deadlines, evidence needs, and fit rationale |
| Trust proof visible | At least one important finding has a clickable citation |
| Decision path exists | User can record Bid, Pass, or Hold, or clearly sees what is missing first |

**Content, messaging, and copy requirements**

| Item | Requirement |
| --- | --- |
| Tone of voice | Precise, calm, practical, audit-friendly |
| Words to use | qualify, review, source, evidence, deadline, blocker, checklist, fit, decision |
| Words to avoid | autopilot, guaranteed, official, instant win, compliant by default, replace your bid team |
| Trust-building copy | Explain that source data are authoritative and Bidroom analysis is separate; explain no-training default; explain user retains submission responsibility |
| Error messages | Must say what failed, why it matters, and what the user can do next |
| Empty states | Must propose a next action tied to user value |
| Upgrade prompts | Must be tied to value gained, such as more workspaces, reminders, shared assignments |
| Legal and disclaimer copy | Must be localized where shown and remain visible in exports as well as UI |
| Localization requirements | Product UI can launch English-first, but the product must analyze DE/FR/IT/EN source materials; German UI should be next in line |

**Prohibited phrases**

| Phrase type | Status |
| --- | --- |
| "Official SIMAP partner" unless contractually true | Prohibited |
| "Guaranteed eligible" | Prohibited |
| "Guaranteed compliant submission" | Prohibited |
| "Win more tenders automatically" | Prohibited |
| "We file the bid for you" | Prohibited in MVP |
| "No human review needed" | Prohibited |

**Analytics and success metrics**

| Metric | Definition | Why it matters | Privacy-safe measurement | MVP or launch target |
| --- | --- | --- | --- | --- |
| North star metric | Qualified tender decisions per active workspace per month | Measures real workflow use, not vanity traffic | Count dossiers with decision status | 3+ per active pilot workspace |
| Activation rate | Share of new workspaces that complete one live dossier within 24 hours | Measures time-to-value | Event sequence only | 60% target |
| Citation engagement | Share of analyzed dossiers where at least one citation is opened | Proxy for trust behavior | Event count, no content capture | 50% target |
| Decision completion rate | Share of ready dossiers with Bid, Pass, or Hold recorded | Indicates operational usefulness | Event count | 50% target |
| Evidence reuse rate | Share of dossiers linking at least one pre-existing evidence item | Indicates repeat-value | Link events | 30% by paid launch |
| Weekly active workspaces | Workspaces with at least one dossier action in a week | Retention | Workspace event count | Core retention metric |
| Trial-to-paid conversion | Share of trials converting to paid within evaluation window | Commercial viability | Billing events | 15% target after early pilots |
| Churn | Paying workspaces canceling in a month | Product-market fit proxy | Billing events | Under 4% monthly after stabilization |
| Trust complaint rate | Support tickets tagged inaccurate or misleading per 100 analyzed dossiers | Detects trust breakdown | Ticket metadata | Under 5 per 100 dossiers |
| Quality metric | Deadline extraction accuracy on internal QA set | Core reliability | Internal evaluation set, not customer content | 95% target on QA set |
| Support response time | Time to first useful reply | B2B trust | Support tools | Under 1 business day |

## Operations and delivery

**Admin, support, and operations requirements**

| Requirement area | Requirement |
| --- | --- |
| Account lookup | Admin must be able to find workspace, billing state, plan, and recent processing jobs without opening documents |
| Billing status | Admin must be able to view trial, paid, grace, canceled, and delinquent states |
| Feature entitlement view | Admin must see which plan limits and feature flags apply to a workspace |
| Support-safe logs | Logs should show job status, file type, file size, parser result, and error category, but not raw content by default |
| User feedback | Product should capture structured "wrong finding", "unclear", and "useful" feedback on findings |
| Error reporting | Failed analyses must be grouped by failure type for founder triage |
| Manual overrides | Admin may override plan entitlements or reset stuck analyses, but every override must be logged |
| Data deletion workflows | Admin must be able to fulfill deletion requests and verify completion state |
| Privacy boundaries | Admins must never see all customer documents by default |
| What admins must never see by default | Full evidence files, full tender documents, full extracted personal data, exported customer reports unless break-glass access is used |
| Operational queue | Support should have a queue for processing failures, privacy requests, billing issues, and content-risk escalations |

**Data import, export, and portability**

Swiss data-protection guidance states that data subjects have rights to access, correction, deletion, restriction, objection, and, where technically possible under contract or consent, data portability in a commonly used machine-readable format. Bidroom therefore should not treat export and deletion as back-office favors. They are product requirements. citeturn22view0

| Topic | Requirement | Recommended behavior |
| --- | --- | --- |
| Import sources | MVP imports from SIMAP URL plus user-uploaded documents only | No stored SIMAP credentials in MVP |
| Supported imports | PDF and DOCX analyzed; additional files may be stored or flagged unsupported | Narrow and honest |
| Export formats | PDF brief, CSV checklist, JSON dossier summary, ZIP bundle of customer-uploaded files and metadata | Machine-readable where sensible |
| Data ownership | Customer owns uploaded documents and internal decisions; official source data remain subject to SIMAP terms | State in terms |
| Deletion behavior | User-triggered deletion removes active data promptly and clears backups on retention schedule | Explain timing |
| Cancellation behavior | Canceled paid workspaces become read-only until retention window ends or user deletes | Recommended restore window: 30 days |
| Downgrade behavior | Excess usage becomes read-only, not silently destroyed | Clear upgrade path |
| Lost access | Workspace owner recovery flow required | Operational necessity |
| Versioning | Re-analysis should create a new version, not overwrite earlier interpretation silently | Auditability |
| Validation | Export package should include manifest and timestamps | Easier support and portability |
| Error handling | If export generation fails, user sees status and retry path | No support black hole |

**Edge cases and failure states**

| Edge case | Expected behavior | User message | Priority | Test requirement |
| --- | --- | --- | --- | --- |
| Non-SIMAP URL pasted | Reject intake | This link is not a supported SIMAP tender notice | P0 | URL validation test |
| Valid notice but no docs uploaded | Produce notice-only brief with warning | Analysis is based on public notice only. Upload tender documents for full qualification | P0 | Notice-only scenario |
| Password-protected PDF | Reject analysis of that file, continue dossier | This file is password-protected and was not analyzed | P0 | Protected PDF test |
| Unsupported file type such as DWG or archive | Flag unsupported, continue other files | This file type is not analyzed in the current version | P0 | Unsupported type test |
| Corrupted file upload | Mark file failed | This file could not be processed. Upload a new copy | P0 | Corrupt file test |
| Contradictory deadlines across docs | Show both and mark disputed | Conflicting deadline data found. Please review source citations | P0 | Contradictory source test |
| Low-confidence blocker only | Show review-needed state | Possible blocker detected, but confidence is low | P0 | Low-confidence test |
| Duplicate dossier creation | Offer reuse or duplicate intentionally | A dossier for this notice already exists | P1 | Duplicate flow |
| User uploads personal-data-heavy evidence | Show consent/authority reminder | Confirm you are authorized to upload and process these documents | P0 | Consent gate test |
| Payment failure | Enter grace state | Payment failed. Your workspace is in grace period until [date] | P1 | Billing failure test |
| Network interruption during upload | Preserve partial state or retry | Upload interrupted. Retry or remove partial file | P0 | Upload resilience |
| Processing job timeout | Fail safely, do not invent result | Analysis could not complete. Review file support and retry | P0 | Timeout simulation |
| Stale dossier after source notice changes | Mark as stale, request rerun | Source notice changed since your last analysis | P1 | Refresh test |
| Break-glass access request | Require justification | Admin access requires a reason and is fully logged | P1 | Admin escalation test |
| User misunderstands Bidroom as submission tool | Correct expectation immediately | Bidroom does not submit official bids to SIMAP | P0 | Copy and UX review |

**MVP definition**

The smallest credible product is narrower than the original market-analysis feature list. That is intentional.

| Item | MVP definition |
| --- | --- |
| MVP goal | Prove that Swiss IT-service suppliers will rely on Bidroom for qualification and will pay for that workflow without requiring full drafting |
| MVP target user | Single bid lead or founder in a Swiss IT, cloud, cyber, or data consultancy |
| Included features | Auth, workspace, minimal profile, SIMAP URL intake, manual doc upload, structured qualification brief, citations, confidence states, checklist, evidence library lite, decision record, PDF export, data export/deletion |
| Excluded features | Auto discovery searches, full monitoring, automatic addenda sync, proposal drafting, CRM integration, SIMAP submission, consultant mode, public tender mirror |
| MVP trust bar | Every important finding has a citation or is explicitly labeled unsupported or uncertain |
| MVP quality bar | A normal live tender can be analyzed end-to-end by a first-time pilot user without founder intervention |
| MVP launch risk | Users may still want discovery and alerts first; document quality may be worse than expected; manual upload may feel too heavy |
| MVP success metrics | 5 pilot workspaces, 20 live dossiers analyzed, 50% of dossiers get a recorded decision, at least 3 paid pilot commitments |

**Post-MVP roadmap**

| Phase | Goal | Features | Excluded work | Exit criteria | Key metrics | Risks |
| --- | --- | --- | --- | --- | --- | --- |
| Validation | Test pain and willingness to pay before full build | Sample report, concierge analysis, landing page, interview script | Billing, automation depth, integrations | 3 paid pilots or equivalent commitments | Pilot close rate, interview consistency | Building too early |
| MVP | Deliver qualification core | P0 features from this PRD | Search automation, drafting, international | Pilot users complete live dossiers without founder hand-holding | Activation, decision completion | Trust failure from weak extraction |
| Paid launch | Monetize the core | Billing, plan gating, team seats, reminders, re-analysis improvements | Consultant mode, public directory, SSO | 5 paying workspaces, meaningful weekly activity | Trial-to-paid, WAU | Billing friction |
| Retention and depth | Increase repeat use | Shared tasks, evidence maturity, stale-dossier signals, better re-analysis | International sources, broad enterprise suite | Repeat usage on multiple tenders per account | Repeat dossier rate, evidence reuse | Low tender frequency |
| Expansion | Add second wedge or new source | Consultant plan or second sector, then selected source integrations | Buyer-side tools, autonomous drafting | Clear ROI in launch wedge | Expansion conversion | Scope creep |

**Requirement traceability**

| Business goal | Persona | Job to be done | Epic | User stories | Requirements | Success metric |
| --- | --- | --- | --- | --- | --- | --- |
| Reduce wasted qualification time | Lina | Understand blockers and deadlines fast | E-03 | US-008, US-009, US-010 | ANA-001 to ANA-005 | Activation rate, citation engagement |
| Reduce repeated evidence work | Sophie | Reuse proof across tenders | E-04 | US-012, US-013, US-014 | CHK-001, EVD-001 to EVD-003 | Evidence reuse rate |
| Create defensible bid-or-pass decisions | Marco | Record a decision with reasons | E-05 | US-015, US-016 | DEC-001, EXP-001, EXP-002 | Decision completion rate |
| Preserve trust and compliance | All | Verify source vs analysis and retain user control | E-03, E-08 | US-009, US-010, US-022, US-024 | ANA-003, ANA-004, LEG-001 to LEG-006, NFR-PRIV-001 | Trust complaint rate |
| Monetize without harming trust | Workspace owner | Start small, upgrade when team value appears | E-07 | US-019, US-020, US-021 | BILL-001, ENT-001 to ENT-004 | Trial-to-paid conversion |

**Ticket-generation guidance**

| Guidance area | Rule |
| --- | --- |
| Split tickets by user-visible outcome | One ticket should produce one verifiable change in one flow, object, or requirement |
| Preserve requirement IDs | Every engineering ticket should reference at least one epic, one story ID, and one requirement ID |
| Acceptance criteria | Use concrete Given / When / Then wording and include one failure path |
| Avoid overbuilding | If a feature is P1 or later, do not smuggle it into a P0 ticket as a "small extra" |
| Privacy and trust check | Every ticket touching uploads, findings, exports, logs, or admin views needs a privacy/trust checklist item |
| Analytics discipline | Add event instrumentation only for events defined in this PRD or approved additions |
| Dependency marking | Mark blocker dependencies explicitly in the ticket title or metadata |
| Documentation updates | If a ticket changes behavior, update the relevant PRD section and traceability row when merged |
| Open questions | If implementation reveals a real product ambiguity, create a decision record instead of silently choosing |
| Product boundaries | Tickets that drift toward drafting, public mirroring, or submission should be rejected unless roadmap scope changes |

## Decisions and recommendation

**Open questions and decisions needed**

| Question | Why it matters | Options | Recommended default | Who decides | Blocks MVP |
| --- | --- | --- | --- | --- | --- |
| Should MVP support only manual document upload, or also a SIMAP account connector? | Major scope and compliance impact | Manual only; hybrid; full connector | Manual only for MVP | Founder | No |
| Which working language should launch first? | UX and support scope | English only; German only; English plus German | English UI first, German next, all four input languages supported | Founder | No |
| Should Bidroom show a numeric fit score? | Trust and positioning | Numeric score; categorical signal; no score | Use categorical fit signal with reasons | Founder and pilot users | No |
| Should discovery and saved search matching be in MVP? | Scope and differentiation | Yes; no; partial | No, because SIMAP already covers basic search subscriptions | Founder | No |
| Should the evidence library support expiry tracking in MVP? | Useful but non-essential | Yes; no | Optional date field only | Founder | No |
| How much collaboration belongs in first paid launch? | Team plan value | Notes only; assignments; full comments and votes | Assignments and notes only | Founder | No |
| CH or EU hosting from day one? | Sales trust and legal posture | EU only; CH only; region choice later | CH or EU hosting acceptable, but region must be explicit in sales materials | Founder with legal input | No |
| What is the first hard file-support boundary? | Quality and trust | PDF only; PDF plus DOCX; wider support | PDF plus DOCX analyzed, everything else explicit | Founder | No |
| Should consultants be a launch segment? | GTM focus | Yes; later | Later | Founder | No |
| How much of the export should be machine-readable in MVP? | Effort and portability | PDF only; PDF plus CSV; PDF plus CSV plus JSON | PDF plus CSV now, JSON if low effort | Founder | No |
| What retention window should apply after cancellation? | Trust and costs | Immediate delete; 30 days; 90 days | 30 days read-only by default, with immediate delete option | Founder with legal review | No |
| Should uploads require a user confirmation of upload authority? | Privacy risk | Banner only; explicit checkbox | Explicit acknowledgment on first evidence upload | Founder | No |
| What precision threshold is acceptable for blockers before pilot launch? | Trust risk | Low; medium; high | High for blockers, lower tolerated for nice-to-have summaries | Founder | Yes, for launch quality |
| How should unsupported complex files be handled in the UI? | Important honesty test | Hide; generic fail; explicit unsupported state | Explicit unsupported state plus suggested manual review | Founder | No |

**Final product recommendation**

| Item | Recommendation |
| --- | --- |
| Strongest product wedge | Swiss IT, cloud, cyber, and data consultancies qualifying SIMAP tenders |
| Most important MVP capability | Source-linked qualification brief from a live SIMAP notice plus user-uploaded tender documents |
| Biggest product risk | Users may value discovery or drafting more than qualification alone |
| Biggest trust risk | Weak or opaque extraction, especially around blockers and deadlines |
| First thing to build | Dossier intake plus source-linked qualification summary and checklist |
| First thing not to build | Search portal clone, public tender mirror, or autonomous bid drafting/submission |

The clearest recommendation is to **build the qualification core only after securing paid pilot commitments, and to keep the first shipping product narrower than the market-analysis version**. That means: live SIMAP notice intake, manual document upload, source-linked qualification brief, checklist, evidence library lite, and decision record. Do not spend the first cycle rebuilding discovery, submission, or drafting. That is the wrong battle given what SIMAP and current competitors already cover. citeturn4view1turn12view1turn11view0turn15view0

The strongest version of Bidroom is a conservative, trustworthy qualification layer that turns public-tender documents into a defensible internal decision. The weakest assumption is still market frequency: enough target firms must face this problem often enough to pay subscription revenue rather than use SIMAP plus internal habit. The first thing to do next is to validate this PRD with 5 pilot users and 10 to 20 live dossiers before expanding scope. The first thing not to do is to add proposal drafting because the category already has louder players there, and the trust advantage for Bidroom sits earlier in the workflow.