# Market Analysis and Business Plan: Bidroom

## Executive Summary

**Business summary.** Bidroom should be framed as a Swiss-first supplier-side tender qualification and workflow product, not as a generic "AI tender writer." The strongest starting use case is simple: a small or mid-sized Swiss supplier finds a live SIMAP opportunity, Bidroom reads the notice and attached documents, then shows fit, disqualifiers, deadlines, required evidence, and next actions with source-linked citations back to the tender documents. That problem is real. Public procurement is economically meaningful in Switzerland, SIMAP is the official platform for Confederation, cantons, communes, and related bodies, and SIMAP now supports online submission, search subscriptions, and an API. Swiss SMEs are also the structural majority of the economy, which means many suppliers lack dedicated bid teams. citeturn36view1turn19search0turn18search3turn18search2turn2search22

**Why this could work.** The category is supported by hard market signals. Swiss public procurement is an official, recurring process with formal deadlines, eligibility criteria, and documented award criteria. The federal SME portal explicitly walks firms through SIMAP registration, search, document download, question submission, and online bid submission, and notes typical deadlines such as around 40 days for open procedures and 25 days for selective procedures. At the same time, the market has enough willingness to pay that multiple vendors already charge meaningful prices: TenderClaw at CHF 39 per month after trial, TenderLift from CHF 190 per month, TenderWolf at €79 and €149 per month, Open Opportunities at £50 to £55 per user per month, and BidStats from £350 to £800 per year. Bidroom does not need to invent a market. It needs to win a narrow slice of an existing one. citeturn36view0turn43view1turn32search7turn32search3turn31view0turn8view4turn31view3

**Why this could fail.** The market is not empty. Swiss-focused tools already exist, including TenderLift and TenderClaw, and broader European and global players such as TenderWolf, Mercell, Open Opportunities, Tendium, Stotles, Govly, Brainial, and Minerva already cover adjacent territory. SIMAP itself already offers free search, subscriptions, downloads, and online submission. That means a vague "AI for tenders" product is not enough. Bidroom will fail if it launches as a broad, undifferentiated Swiss tender chatbot, if it tries to auto-draft full proposals too early, or if it cannot prove that its qualification workflow is materially better than SIMAP plus spreadsheets plus a general LLM. It will also fail if it ignores trust, because procurement is formal, auditable, and sensitive to errors. citeturn19search0turn32search3turn32search7turn31view0turn31view4turn31view1turn41search4turn41search8

**Recommended wedge, first product, and business model.**

| Item | Recommendation |
| --- | --- |
| Best launch segment | Swiss IT services, cybersecurity, cloud, data, and digital consultancies with 5 to 100 employees that already bid, or want to bid, on SIMAP |
| Core job | Decide faster whether to bid, avoid disqualification, and keep evidence organized |
| First product | SIMAP-only qualification copilot: tender matching, disqualifier extraction, deadline and addenda tracking, award-criteria extraction, evidence checklist, reusable company profile |
| Business model | Free trial plus subscription, with optional paid onboarding and partner-led expert review |
| Pricing direction | CHF 59 to CHF 149 per month self-serve for early tiers, then higher team or consultant plans |
| Overall recommendation | **Validate first** |

**Verdict.** **Validate first.** This is worth pursuing only as a narrow, source-linked qualification workflow product. It is not worth building as a generic full-stack tender platform from day one.

## Idea, Customers, and Problem

**Idea interpretation and assumptions.**

**Restated idea.** Bidroom is a software product for suppliers that want to win Swiss public contracts more efficiently. It sits between official tender portals and actual bid writing. It should help firms discover relevant tenders, understand what matters, identify blockers, organize evidence, and manage deadlines before they spend expensive human time writing a proposal. This analysis assumes a Switzerland-first launch on SIMAP, with possible later expansion to TED, Find a Tender, and SAM.gov because those sources provide official developer access and structured data. citeturn19search0turn18search3turn35view0turn35view1turn15search2

**What the product is.**
- A supplier-side public tender qualification and compliance workflow tool.
- A SIMAP document reader and requirement extractor with page-level citations.
- A reusable evidence library for references, certifications, CVs, insurance, declarations, and standard company facts.
- A deadline and addenda tracker that reduces missed administrative steps. citeturn19search0turn36view0turn43view1turn43view3

**What the product is not.**
- Not a buyer-side e-procurement suite.
- Not an official SIMAP client unless SIMAP formally approves that positioning.
- Not a legal service.
- Not an autonomous submission tool.
- Not a guaranteed "win more tenders" machine. citeturn21view0turn18search4turn37view0

**Core customer pain.** Small and mid-sized suppliers can find tenders, but that is not the same as qualifying them correctly. The real pain is hidden in the documents: mandatory evidence, deadline changes, restrictive eligibility criteria, unsuitable lot structure, compliance requirements, and vague or multilingual documentation that takes hours to review manually. Swiss public procurement is formal enough that a weak qualification step can waste days or disqualify a bid outright. The PPA requires objectively necessary and verifiable eligibility criteria and disclosed award criteria. The SME portal also makes clear that firms must register, download documents, follow the procedure, and meet formal deadlines. citeturn43view3turn36view0turn43view1

**Main job-to-be-done.** "Help me decide quickly and defensibly whether this tender fits us, what could disqualify us, what documents we need, and what we must do next."

**Assumptions used because your prompt left placeholders unfilled.**
- Founder location: Bern, Switzerland.
- Initial geography: Switzerland first.
- Founder type: solo technical founder with strong software execution and limited initial budget.
- Preferred company type: bootstrapped SaaS, not VC-first.
- Time available: limited, so the product must reach a usable pilot quickly.
- Risk tolerance: moderate, but low appetite for regulated advisory risk.

**Unanswered questions that matter.**
- Do you have direct access to 20 to 30 firms that already bid on SIMAP?
- Do you want self-serve SaaS only, or are you willing to sell pilot services first?
- Do you want to stay supplier-side only, or might you eventually support consultants and bid managers?
- Are you willing to use a Swiss or EU hosting setup from day one?
- Are you open to a narrow vertical, even if that makes the landing page less broad?

**Target customers and personas.**

**Most promising segments.**

| Segment | Who they are | Current workaround | Pain intensity | Willingness to pay | Ease of reach | Trust / distrust factors | Good launch segment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swiss IT consultancies | 5 to 100 person firms selling digital transformation, cloud, cybersecurity, software, data, architecture services to public clients | SIMAP subscriptions, inbox rules, spreadsheets, shared drives, manual document reading, occasional consultants | High | Medium to high | Good via founder-led outbound and LinkedIn | Trust if product cites documents and understands technical criteria. Distrust if it hallucinates methodology or security claims | **Yes** |
| Engineering and planning firms | Firms bidding on infrastructure, planning, technical studies, specialized services | Manual portal monitoring, PM review, internal templates | High | Medium to high | Moderate | Trust if product handles eligibility and lots well. Distrust if it fails on drawings, annexes, and domain details | Maybe, but second wedge |
| Construction-related suppliers and specialist trades | Subcontractors and product suppliers chasing public sector work | Manual search, tender desks, consultants | Medium to high | Medium | Moderate | Trust if it saves real admin time. Distrust if it touches pricing or drawings badly | Not first unless you verticalize hard |
| Bid consultants and procurement advisors | Specialists who support multiple suppliers | Email, document packs, manual review, MS Word | Medium | High | Moderate | Trust if Bidroom saves repetitive qualification work. Distrust if it threatens their role | Good partner channel after first pilots |
| Export-oriented firms looking beyond CH | Firms wanting TED, Find a Tender, or SAM.gov visibility | Multiple portals and aggregators | Medium | Medium | Harder | Trust if data source coverage is broad and accurate | Too early |

**Personas.**

**Lina, bid manager without the title.**  
Situation: Works at a 25-person Swiss cloud and cybersecurity consultancy. Public-sector bids are handled by delivery leads and one operations person, not by a dedicated bid team.  
Problem: Relevant tenders are found too late, and eligibility evidence is scattered across folders.  
Current alternatives: SIMAP alerts, shared mailbox, spreadsheet pipeline, ad hoc use of ChatGPT.  
Trigger event: A public tender is missed, or the firm spends two days qualifying a bid that turns out not to fit.  
Success moment: Within ten minutes, she knows fit, blockers, missing documents, and who owns each task.  
Objections: "I do not want a hallucinating tender bot."  
Best marketing message: "Know in minutes whether a SIMAP tender is worth your team’s time."

**Marco, founder of a 12-person data and AI consultancy.**  
Situation: Wants public-sector revenue but has no procurement process.  
Problem: Procurement language, formal criteria, and deadlines feel unfamiliar and risky.  
Current alternatives: Avoid bidding, ask peers, or pay outside help occasionally.  
Trigger event: A canton or federal office publishes a tender close to the firm’s specialization.  
Success moment: He sees a source-linked fit report that explains why to bid or why to walk away.  
Objections: "We do not bid often enough to justify another tool."  
Best marketing message: "Stop wasting senior consulting hours on bad-fit tenders."

**Sophie, partner at an engineering boutique.**  
Situation: The firm already bids and has templates, but review work is repetitive and multilingual.  
Problem: Every tender still requires manual document trawling and deadline tracking.  
Current alternatives: Internal checklists, Word templates, project managers.  
Trigger event: More simultaneous bids than the team can review carefully.  
Success moment: Bidroom flags disqualifiers, weights, and missing evidence before anyone writes narrative text.  
Objections: "We already have our own process."  
Best marketing message: "Keep your process. Remove the most expensive manual review."

**Problem analysis.**

The problem is real, but intensity varies sharply by segment. For active bidders, the pain is recurring, procedural, and expensive in time. SIMAP lets companies search manually, create search-request subscriptions, download publications, ask questions, and submit tenders online. That solves access, not understanding. The SME portal also shows that firms must follow a multi-step process, and that deadlines are formal and sometimes short, especially in selective procedures. citeturn19search0turn36view0turn43view1

Severity is high when the tender is large enough to matter and the firm lacks a bid team. Under the Swiss PPA, eligibility criteria must be objectively necessary and verifiable, and award criteria and their weighting must be disclosed. In practice, this means a supplier cannot rely on "close enough" interpretation. Missing proof, misunderstanding lots, or misreading suitability requirements can end the bid before quality of delivery is even considered. citeturn43view3turn43view1

Existing alternatives exist, but they leave a gap. Official portals provide access and some alerts. Consultants provide expertise but are expensive and not scalable. Generic LLMs can summarize text, but they do not reliably manage deadlines, evidence libraries, tender-specific disqualifiers, or auditability. Competitor offerings also show the same gap: several emphasize fit scoring, disqualifier extraction, deadline tracking, and checklists, which is a strong market signal that the problem is not only discovery. citeturn19search0turn32search3turn32search7turn31view0

Urgency is moderate to high, not universal. Firms that bid only once per year may not pay. Firms that bid monthly, or that want to start bidding but fear wasting senior time, are much better customers. Users already spend time and sometimes money solving this problem. That supports software, but only for repeat players. The best solution is software plus workflow automation, with optional human review through partners. Pure content is too weak. Pure services scale too slowly. Pure AI drafting is too risky and crowded. citeturn36view0turn32search7turn32search3

## Market Opportunity and Competition

**Market opportunity.**

There is a meaningful market here, but the realistic market is much smaller than the headline procurement spend. The broad market is "supplier-side tender intelligence and bid workflow software." The serviceable short-term market is "Swiss firms that repeatedly bid, or want to bid, on SIMAP." Those are very different numbers.

Swiss structural context is favorable. Switzerland had **609,518** market-oriented enterprises in 2021, and **547,074**, or **89.8 percent**, had fewer than 10 employees. That matters because small firms have the least procurement capacity and the most to gain from software that reduces administrative overhead. Public procurement is also economically meaningful. SECO’s SME portal says public procurement is a significant part of the Swiss economy and notes that the Confederation’s needs alone totaled **CHF 5.55 billion** in construction works, goods, and services in 2018. The Swiss Federal Audit Office also reports that in **2023** the Federal Administration procured services above the WTO threshold with a volume of **CHF 6.39 billion**. citeturn2search22turn36view1turn43view0

The infrastructure trend is favorable too. SIMAP is the official Swiss procurement platform and now supports search subscriptions, online submission, and an API. The UK’s Find a Tender publishes notice data under the Open Government Licence with OCDS API access. TED provides anonymous search API access, bulk XML downloads, CSV subsets, and a fair usage policy, and states that each year contracts worth about **EUR 815 billion** are published and over **3,000** notices appear every working day. SAM.gov also provides a public opportunities API with daily updates. That makes cross-border expansion technically plausible, but it also means raw access to data is not a moat. citeturn19search0turn18search3turn35view1turn35view0turn13search1turn15search2

**TAM, SAM, and SOM logic.**

- **TAM, broad category.** A useful lower-bound market signal is Mercell’s claim of **400,000 active suppliers** on its platform in Europe, plus over **5,000** public entities and **€200 billion** in coverage. That is not an official market census, but it is credible evidence that supplier-side tender software is already a large category. If supplier-side tender tools capture anywhere from roughly CHF 600 to CHF 6,000 per supplier per year, based on observed market pricing from BidStats, TenderClaw, Open Opportunities, TenderWolf, and TenderLift, then a Europe-wide annual software TAM on a 400,000-supplier base is roughly **CHF 240 million to CHF 2.4 billion**. Confidence is medium for category existence, low for precise size. citeturn31view4turn31view3turn32search7turn8view4turn31view0turn32search3

- **SAM, Switzerland-first.** I did not find a current official public SIMAP annual notice total in accessible sources. One Swiss competitor claims **3,000+ annual tenders** and **CHF 20B+** in contract value on SIMAP, but that is competitor marketing and should be treated as directional only. A practical Switzerland-first SAM is therefore better estimated from the likely number of repeat supplier organizations that care enough to pay. My reasoned estimate is **2,000 to 5,000** Swiss organizations with recurring need for tender intelligence and qualification workflow. At an achievable annual ACV of **CHF 700 to CHF 2,000**, that implies a reachable Swiss SAM of roughly **CHF 1.4 million to CHF 10 million ARR**. Confidence is low because the firm count is estimated, not published. citeturn41search15turn18search2turn19search0

- **SOM, realistic for a solo founder or small team.** A credible first 24-month SOM is **30 to 80 paying logos** in one Swiss wedge, not hundreds. At a blended ACV of **CHF 1,200 to CHF 1,800**, that yields approximately **CHF 36,000 to CHF 144,000 ARR**, with upside toward **CHF 200,000+ ARR** if team plans and paid onboarding sell well. That is a viable bootstrapped wedge, but it is not a venture-scale outcome by default.

**Market sizing table.**

| Market segment | Estimated size | Source or assumption | Relevance to Bidroom | Confidence |
| --- | --- | --- | --- | --- |
| Swiss market-oriented enterprises | 609,518 enterprises, 89.8% with fewer than 10 employees | Swiss FSO, 2021 citeturn2search22 | Strong structural reason to target workflow software for under-resourced firms | High |
| Swiss public procurement lower bound | CHF 5.55B Confederation needs in 2018; CHF 6.39B federal services above WTO threshold in 2023 | SECO SME portal, SFAO audit citeturn36view1turn43view0 | Confirms economically meaningful procurement activity | High |
| SIMAP-based active supplier software market in Switzerland | 2,000 to 5,000 firms | Assumption based on official platform scope and repeat-bidder logic; no official count found | Realistic serviceable market for a Swiss-first SaaS | Low |
| Initial Swiss launch wedge | 300 to 1,000 firms | Assumption: IT services, cybersecurity, cloud, data, engineering-adjacent suppliers who bid repeatedly | Best first segment for founder-led GTM | Low |
| Europe-wide supplier-side category | Lower-bound 400,000 active suppliers on Mercell platform | Mercell company claim citeturn31view4 | Shows category is already large beyond Switzerland | Medium |
| Europe-wide procurement data flow | €815B published annually on TED, over 3,000 notices each working day | TED official site citeturn13search1 | Makes expansion plausible and confirms ongoing volume | High |

**Relevant growth trends, adoption barriers, and constraints.**

The main growth trends are digitalization and data-source openness, not AI hype. SIMAP is being continuously developed, highlights an upward trend in online tender submissions, and offers an API. UK procurement moved further into a transparent, open-data model under the Procurement Act 2023 and Find a Tender. TED and SAM.gov also expose structured access. This lowers technical barriers to building products like Bidroom. Unfortunately, it also lowers barriers for competitors. citeturn23view0turn18search3turn14search0turn35view1turn35view0turn15search2

Geographic and language constraints are real. Swiss procurement is multilingual and federally fragmented. SIMAP search operates across DE, FR, IT, and EN. Tender documents may still be messy, attachment-heavy, and harder than the notice text itself. That means document extraction quality, multilingual handling, and source fidelity matter more than flashy chat UI. citeturn33view3

Adoption barriers are mainly trust and bidding frequency. A firm that bids once every 18 months is not a good SaaS customer. A firm that bids monthly or quarterly is. Trust barriers are reinforced by the formal nature of procurement and by competition-law sensitivity around bids. Public procurement also carries anti-corruption and anti-collusion concerns, and Swiss competition authorities continue to focus on bid-rigging. citeturn36view1turn44view1

**Competitor and alternative analysis.**

**Direct and adjacent competitors.**

| Competitor | Product category | Target customer | Public pricing | Strengths | Weaknesses | What to learn | Where opportunity remains |
| --- | --- | --- | --- | --- | --- | --- | --- |
| TenderLift | Swiss tender intelligence and qualification | Swiss SMEs bidding on SIMAP | From CHF 190 per month citeturn32search3 | Very clear Swiss positioning, SIMAP focus, document and eligibility emphasis, MCP integration citeturn32search1turn32search3 | Already occupies the Swiss tender-intelligence niche | Swiss-only and source-specific positioning resonates | Differentiate on one wedge, better evidence library, better source citations, less "AI tool" framing |
| TenderClaw | Swiss AI grants and tenders | Swiss startups, SMEs, IT services | CHF 0 for 3 months, then CHF 39 per month per company citeturn32search7 | Aggressive pricing, combines grants and tenders, clear SIMAP matching and drafting promise citeturn32search2turn32search5 | Broad promise, grant overlap may dilute tender depth, low price can compress market expectations | Low-friction trial matters | Avoid grant sprawl and draft-everything positioning |
| TenderWolf | European tender monitoring and AI screening | Suppliers across Europe | Free, then €79 or €149 per month, enterprise custom citeturn31view0 | Freemium, broad country coverage, clear credit model | Switzerland may be one country among many, not primary wedge | Free discovery can work, but paid value lives in analysis | Win on Swiss nuance and sector-specific templates |
| Open Opportunities | Global tender alert platform and API | International suppliers and teams | £50 or £55 per user per month, API custom citeturn8view4 | Strong data normalization, API angle, broad country coverage | More data platform than workflow product | Structured data and export matter | Bidroom can focus on decision workflow, not just alerts |
| BidStats | UK tender and contract search | UK firms | £350 per year standard, £800 per year pro, insights from £5k citeturn31view3 | Clean pricing ladder, alerts plus awards and buyer data, 80,000+ user claim citeturn31view3 | UK-only and more discovery-heavy | Award data and expiring contracts are valuable later | Start simple, then add award intelligence |
| Tendium | Tender monitoring plus bid workflow | Larger organizations | Contact sales only citeturn31view1 | Full workflow focus, unlimited users, bidflows | Sales-led, likely heavier implementation | Workflow matters more than search alone | A lighter Swiss SMB version can still win |
| Mercell | Major incumbent tendering platform | Buyers and suppliers across Europe | No public self-serve price seen | Scale, buyer relationships, 400,000 active suppliers, 5,000+ public entities citeturn31view4 | Broad, heavier platform, less likely SMB-sharp for Swiss self-serve | Incumbents prove spend exists | Stay narrow and faster |
| Brainial / Minerva / Scalera | Adjacent tender AI, often verticalized | Construction, manufacturing, services, broader public sales | Pricing mostly sales-led or not public citeturn41search4turn41search8turn41search1 | Show vertical and document-centric approaches are fundable and credible | Not a clean Swiss SIMAP SMB wedge | Verticalization beats genericity | Sector-specific qualification remains the best opening |

**Free alternatives and manual substitutes.**
- **SIMAP itself** already provides manual search, search-request subscriptions, document download, question submission, and online tender submission for companies. That is the baseline alternative every prospect already has. citeturn19search0turn36view0
- **Spreadsheets, shared drives, email, and general-purpose LLMs** remain the default internal workaround.
- **Bid consultants and coaches** remain the premium manual alternative. TenderClaw itself sells a coach-assisted tier at CHF 3,000 per application plus a 5 percent success fee, which signals that some customers will pay for human help when stakes are high. citeturn8view2
- **Procurement intelligence incumbents** such as Mercell, Open Opportunities, BidStats, Stotles, and Tendium can enter or sharpen Swiss coverage over time. citeturn31view4turn8view4turn31view3turn31view1

**Positioning map in text form.**

Think of the market across two axes:

- **Horizontal axis:** discovery and alerts on one side, full bid workflow on the other.
- **Vertical axis:** local Swiss depth on one side, broad multi-country coverage on the other.

SIMAP sits at low workflow, high Swiss official coverage. BidStats and Open Opportunities sit closer to discovery and data. Mercell and Tendium sit closer to heavier workflow and broader coverage. TenderLift and TenderClaw already occupy the Swiss AI workflow zone.

That means Bidroom should **not** try to sit in the vague center as "one more Swiss AI tender tool." It should sit in a sharper box: **Swiss public tender qualification and evidence workflow for one narrow supplier wedge.** The remaining opportunity is not raw discovery. It is trusted, source-linked decision support and reusable evidence management for firms that do not have a formal bid operation.

## Positioning, Product, and Business Model

**Differentiation and positioning.**

**Best narrow launch wedge.**  
Swiss IT services, cloud, cybersecurity, data, and digital transformation consultancies that already sell to public-sector buyers or want to start. This wedge is the best fit because:
- documents are relatively text-heavy compared with construction drawings,
- the founder is more likely to understand technical services than public works schedules,
- reference projects, certifications, staffing, methods, and compliance narratives are recurring pain points,
- these firms can usually afford software if it saves senior consultant time.  
This is also a wedge where public procurement is active. Federal and cantonal administrations publish technology-related calls, and SIMAP is the official route to market. citeturn18search2turn41search2

**Broader long-term category.**  
Supplier tender qualification and bid-preparation operating system for public procurement.

**Possible advantages.**
- Swiss-first product with local language support.
- Official-source integration path via SIMAP API, not scraping. citeturn18search3turn21view0
- Strong auditability if every extracted point links back to the source page.
- Faster product iteration than heavy enterprise competitors.
- Potential founder credibility in IT-service tenders if you sell initially into firms like your own network.

**What not to compete on.**
- Global coverage in v1.
- Buyer-side procurement management.
- Autonomous proposal generation.
- Cheapest price in the market.
- Grants plus tenders plus consultants plus marketplace all at once.

**What to emphasize in marketing.**
- "Know if you should bid."
- "See disqualifiers before your team wastes time."
- "Every claim linked to the tender document."
- "Keep your evidence ready."
- "Track addenda and deadlines."

**What to avoid because it creates wrong expectations.**
- "Write winning bids automatically."
- "Guaranteed compliance."
- "Official SIMAP partner," unless that is contractually true.
- "Replace your bid team."
- "No human review needed."

**One-sentence positioning statement.**  
Bidroom is Swiss tender qualification software for suppliers that need to decide faster, avoid disqualification, and keep bid evidence organized across SIMAP opportunities.

**Homepage headline.**  
**Qualify Swiss public tenders before they consume your team.**

**Short descriptor.**  
Source-linked SIMAP analysis, deadline tracking, and evidence workflow for Swiss suppliers.

**Five possible taglines.**
- Bid fewer bad tenders.
- See the blockers before you write.
- Turn SIMAP documents into decisions.
- Keep your bid evidence ready.
- Swiss tender qualification, minus the document chaos.

**Product strategy.**

**Core workflow.**
1. User creates company profile with services, regions, certifications, references, languages, and excluded tender types.
2. Bidroom ingests live SIMAP opportunities and matches them to the profile.
3. User opens a tender and gets a summary with fit score, hard blockers, deadlines, required evidence, questions window, lots, and evaluation criteria, all with source references.
4. User clicks **Bid** or **Pass** and records why.
5. If bidding, Bidroom creates a checklist and pulls reusable evidence from the company library.
6. Bidroom monitors addenda, corrigenda, and deadline changes.
7. User exports a briefing pack or internal task list.

**First wow moment.**  
Paste a SIMAP notice URL and see, within minutes, a clean answer to four questions: **Are we eligible? What can disqualify us? What must we submit? What changes or deadlines matter?**

**MVP scope.**
- SIMAP-only.
- Company profile and fit rules.
- Notice plus attachment ingestion.
- Multilingual extraction for DE, FR, IT, EN input, with output in one chosen working language.
- Mandatory requirement and disqualifier extraction with source links.
- Deadline and addenda tracking.
- Evidence checklist and reusable evidence library.
- Simple team notes and assignments.
- Export to PDF or email summary.

**Explicit non-goals for v1.**
- Full proposal drafting.
- Automated submission to SIMAP.
- TED, Find a Tender, or SAM.gov support.
- Bid pricing recommendations.
- Marketplace matching with consultants.
- Buyer-side tenders management.

**Features that should wait.**
- Narrative draft generation.
- Answer library with assisted rewriting.
- CRM sync.
- Award analysis and buyer maps.
- Multi-country packs.
- Deep subcontractor or consortium workflows.

**Features that sound attractive but are probably distractions.**
- A browser extension.
- A mobile app.
- An AI chat interface as the primary UX.
- A public tender marketplace.
- A grant feature set.

**Key user journeys.**
- New user sets profile and receives first matched digest.
- Existing user opens a tender and decides Bid or Pass.
- User sees missing evidence and uploads or selects required documents.
- Team reviews addenda and deadline changes.
- Manager reviews pipeline and decision reasons.

**Data requirements.**
- Official SIMAP notice metadata.
- Tender documents and updates.
- Company profile data.
- Evidence documents such as references, certifications, CVs, insurance, declarations.
- Activity logs and decision history.

**Integration requirements.**
- SIMAP API or official subscription-compatible data route. citeturn18search3turn21view0
- Email and calendar alerts.
- Cloud storage for evidence documents.
- Billing and auth stack.

**Privacy and security requirements.**
- CH or EU hosting from day one.
- Encryption at rest and in transit.
- Role-based access controls.
- Audit logs.
- Default setting of **no training on customer documents**.
- DPA support for business customers.
- Delete and export controls.

**Trust requirements.**
- Every extracted requirement should cite the source.
- Show confidence and uncertainty, not fake certainty.
- Keep final submission responsibility with the user.
- Maintain a visible change log for tender updates.

**Feature prioritization table.**

| Feature | User value | Priority | Complexity | Risk | MVP or later |
| --- | --- | --- | --- | --- | --- |
| SIMAP ingestion and matching | Finds relevant opportunities | P0 | Medium | Low, if API route is stable | MVP |
| Company profile and filters | Reduces noise | P0 | Low | Low | MVP |
| Eligibility and disqualifier extraction with citations | Saves wasted qualification time | P0 | Medium | Medium, extraction accuracy | MVP |
| Deadline, Q&A window, and addenda tracker | Prevents avoidable failure | P0 | Medium | Low | MVP |
| Evidence checklist | Converts reading into action | P0 | Low | Low | MVP |
| Reusable evidence library | Cuts repeated admin work | P1 | Medium | Medium, document security | MVP |
| Team comments and assignments | Helps collaboration | P1 | Low | Low | MVP |
| Multilingual normalization | Makes Swiss coverage usable | P1 | Medium | Medium | MVP |
| Exportable bid brief | Supports internal adoption | P1 | Low | Low | MVP |
| Narrative drafting assistance | Attractive but risky | P2 | Medium | High, hallucinations and trust | Later |
| CRM and Slack / Teams integration | Good for teams | P2 | Medium | Low | Later |
| TED / FTS / SAM source packs | Expands market | P3 | Medium to high | Medium | Later |
| Automated submission | Tempting but dangerous | P3 | High | High, platform and liability risk | Later or never |

**Business model and pricing.**

The trust relationship favors subscription over success fees. A success fee can distort recommendations. If Bidroom gets paid only when the customer bids, or only when the customer wins, it becomes tempting to push optimistic fit assessments. That is bad product design for a qualification tool.

Relevant benchmarks already exist. TenderClaw is cheap at CHF 39 per month after trial. TenderLift starts at CHF 190 per month. TenderWolf sits at €79 and €149 per month. Open Opportunities is £50 to £55 per user per month. BidStats runs from £350 to £800 per year, with a higher intelligence tier from £5,000. These benchmarks suggest that Swiss and European buyers will pay for data and workflow if it saves time or increases confidence, but price sensitivity varies by segment and maturity. citeturn32search7turn32search3turn31view0turn8view4turn31view3

**Recommended model.**
- Free trial, no credit card.
- Subscription for ongoing use.
- Optional paid onboarding for teams.
- Optional expert-review marketplace later, but only via disclosed partners.

**Models that fit the trust relationship.**
- Monthly or annual SaaS.
- Team plans by workspace limits, evidence library, and collaboration.
- Paid onboarding and migration help.

**Models that would damage trust.**
- Hidden lead generation to consultants.
- Pay-per-tender recommendations that encourage false positives.
- Success-fee-based fit advice.
- Selling user bid content for model training.

**Suggested launch pricing.**

| Tier | Suggested price | For whom | Includes | Why |
| --- | --- | --- | --- | --- |
| Trial | Free for 14 days | Any prospect | Full product, limited workspace volume | Removes friction and matches market norms citeturn32search3turn32search7turn31view3 |
| Solo | CHF 59 per month annual, CHF 69 monthly | Founder or one operator | 1 user, 1 company profile, matched tenders, qualification view, deadlines, export | Sits above ultra-cheap positioning, below TenderLift |
| Team | CHF 149 per month annual, CHF 169 monthly | Small teams | 3 to 5 users, evidence library, assignments, shared notes, priority support | Still affordable for firms saving senior time |
| Consultant / Agency | CHF 349 per month | Advisors handling multiple clients | Multiple client profiles, branded exports, higher limits | Good channel and high-margin add-on |
| Enterprise | Custom | Larger suppliers | SSO, custom fields, security review, data residency options, onboarding | Needed for larger accounts |

**What should be free.**
- Trial access.
- Basic product tour and sample analysis.
- A few public educational pages and calculators.
- Honest explanation of what the tool does and does not do.

**What should be paid.**
- Continuous monitoring.
- Evidence library.
- Team collaboration.
- Exports and reporting.
- Higher analysis volumes.
- Consultant workflows.

**What should never be monetized because it would hurt trust.**
- Source references back to the tender.
- Security basics such as proper deletion.
- Access to a customer’s own uploaded evidence.
- Corrections when extraction was wrong.

**Refund or trial strategy.**
- 14-day free trial.
- 30-day money-back guarantee on annual plans, if you want less friction.

**Unit economics assumptions.**
- Blended early ARPA: CHF 95 to CHF 130 per month.
- Variable COGS: roughly CHF 10 to CHF 25 per active customer per month, mostly LLM, storage, email, and support assumptions.
- Gross margin target: 80 to 90 percent if professional services stay separate.
- Billing complexity: low early. Card payments for self-serve, invoicing for annual team and enterprise.

## Go-to-Market, Brand, and Validation

**Go-to-market strategy.**

The best first channel is **founder-led outbound to a narrow wedge**, not broad SEO and not paid acquisition.

Why: this is a workflow product for a fairly small group of high-intent customers. It benefits from live demos on real tenders. It also needs trust. A generic landing page will not solve that. The category already has competitors, so you need direct learning and direct proof. Public procurement is formal enough that customers will respond better to "here is how we analyzed this actual SIMAP notice" than to broad AI claims. That is especially true in the first wedge of IT services and consultancies. citeturn19search0turn36view0turn32search3turn32search7

**Best first channel.**  
Founder-led outbound to Swiss IT and digital consultancies that mention public clients, framework contracts, cloud, data, cybersecurity, or digital transformation.

**Why that channel fits.**
- Target list is finite and reachable.
- Problem can be demonstrated on a live tender.
- Founder can sell technical credibility.
- Early sales conversations will sharpen the wedge fast.

**SEO opportunities.**
- Useful, but second-order at first.
- Best topics are narrow and intent-heavy, such as SIMAP how-tos, Swiss tender checklists, and evidence requirements for public IT tenders.
- SEO should support credibility, not carry first-month acquisition.

**Content strategy.**
- Publish source-linked teardown posts of live or recent tenders, stripped of any confidential bidder content.
- Write decision-focused content, not broad "AI procurement" content.
- Show how a team should decide Bid or Pass.

**Communities and partnerships.**
- Procurement consultants and tender coaches.
- Firms that already help SMEs access public contracts.
- Industry-specific associations and small consultancies with public-sector exposure.
- Later, accounting or compliance partners are less relevant than procurement partners.

**Paid acquisition suitability.**
- Poor at first.
- Search volumes are likely limited and competitor CPC inflation is likely.
- Keep paid search as a later experiment for high-intent keywords.

**Launch strategy.**
- Start with a private pilot.
- Analyze real SIMAP tenders manually plus with prototypes.
- Get paid pilots before building broad features.
- Publish 2 to 4 strong case studies from live use.

**Founder-led sales and content opportunities.**
- Live qualification walkthroughs.
- LinkedIn posts on "what disqualified this bid."
- Sector-specific webinars for IT vendors.

**Viral or referral potential.**
- Low to moderate.
- The stronger referral channel is likely consultant and peer referral, not product virality.

**Distribution risks.**
- SIMAP could add better supplier-side features.
- Swiss competitors can sharpen their positioning quickly.
- General-purpose LLMs will continue to improve basic summarization.
- Larger incumbents could decide Switzerland is worth more attention. citeturn19search0turn32search3turn32search7turn31view4

**Channel table.**

| Channel | Target segment | Cost | Difficulty | Time to results | Expected user quality | Recommendation |
| --- | --- | --- | --- | --- | --- | --- |
| Founder-led outbound | Swiss IT consultancies | Low cash, high founder time | Medium | Fast | High | **Best first channel** |
| Consultant partners | Bid advisors, procurement coaches | Low to medium | Medium | Medium | High | Strong second channel |
| LinkedIn founder content | Same wedge, plus advisors | Low | Medium | Medium | Medium to high | Good support channel |
| SEO | Broader Swiss supplier market | Low cash, slower payoff | Medium | Slow | Medium | Build gradually |
| Webinar / demo sessions | Vertical prospects | Low | Medium | Medium | Medium to high | Useful once product exists |
| Paid search | High-intent tender keywords | Medium to high | Medium | Fast | Mixed | Not first |
| Broad social ads | General SMEs | Medium | High | Fast | Low | Avoid early |

**Thirty-day validation plan.**
- Build a target list of 100 Swiss firms in the launch wedge.
- Conduct 20 interviews.
- Offer a manual concierge service for live tender qualification on 10 to 15 tenders.
- Charge something, even if modest, for at least 3 pilots. Free feedback is weak evidence.
- Build only enough software to speed up the concierge process.

**Ninety-day launch plan.**
- Convert manual pilot learnings into a SIMAP-only MVP.
- Onboard 5 to 10 pilot firms.
- Analyze at least 50 real tenders.
- Achieve 5 paying customers and 70 percent week-4 retention among pilot users.
- Publish 2 public case studies and 1 benchmark comparison against SIMAP-only workflow.

**Brand and messaging.**

**Naming considerations.**  
Bidroom is short, memorable, and directly evokes bidding, which fits the category. It could still be read as an auction or deal product rather than procurement, so pair it with a precise descriptor on every page, such as **"Swiss public tender qualification software."** Without that, the name will not do enough work.

**Tone of voice.**
- Precise.
- Calm.
- Audit-friendly.
- Slightly conservative.
- Never boastful.

**Trust signals.**
- Swiss or EU hosting.
- Page-level source citations.
- Explicit no-training-on-your-docs policy.
- Clear legal and product disclaimers.
- Release notes and product changelog.
- Security page and DPA.

**Visual direction.**
- Formal B2B, not AI toy.
- Dense enough to look serious, simple enough for non-technical operators.
- Emphasize timelines, blockers, evidence cards, and document citations.
- Avoid neon gradients, mascots, and vague "magic" motifs.

**What the brand should avoid.**
- "Autonomous agent" language.
- Win guarantees.
- Cute AI branding.
- Ambiguous finance-style "offer optimization" language.

**Homepage hero copy.**  
**Qualify Swiss public tenders before they consume your team.**  
Bidroom reads SIMAP notices and documents, shows disqualifiers, deadlines, award criteria, and required evidence, and links every finding back to the source.

**Short explanation for first-time visitors.**  
Bidroom helps Swiss suppliers decide whether to bid, what could block them, which documents they need, and what changed in the tender. It does not replace human judgment. It makes qualification faster and more defensible.

**Five tagline options.**
- See the blockers before you bid.
- Turn tender documents into decisions.
- Fewer bad-fit bids, less document chaos.
- Your SIMAP qualification workflow, finally organized.
- Source-linked tender analysis for Swiss suppliers.

**Five ad or social post angles.**
- "How many senior hours did your last bad-fit tender waste?"
- "SIMAP alerts are not the hard part. Qualification is."
- "This is the one line in the tender document that can disqualify you."
- "Why a general LLM summary is not a qualification workflow."
- "A practical Swiss public tender checklist for IT consultancies."

**Five SEO article ideas.**
- How to decide Bid or Pass on a SIMAP tender
- The Swiss supplier’s checklist for public IT tenders
- SIMAP deadlines, addenda, and common mistakes
- What eligibility criteria really mean in Swiss public procurement
- How to build a reusable evidence library for public tenders

**Validation plan.**

**What must be validated first.**
- That repeat bidders feel acute qualification pain, not just discovery pain.
- That they trust a source-linked workflow more than a generic AI summary.
- That at least a small wedge will pay without requiring full proposal drafting.
- That your chosen wedge bids often enough to justify subscription.

**Landing page test.**
- Build a narrow page for Swiss IT consultancies, not a broad all-industry page.
- CTA should be "Send us one live SIMAP notice and we will return a qualification brief."

**Customer interview plan.**
Ask:
1. How do you currently find and qualify SIMAP tenders?
2. What is the most expensive mistake you have made before writing the bid?
3. What usually kills a tender for you: bad fit, missing evidence, timing, language, pricing, or internal capacity?
4. How long does qualification take today?
5. Who owns the decision to bid?
6. What documents do you repeatedly reassemble?
7. What do you use today: portal alerts, spreadsheets, consultants, internal templates, general LLMs?
8. What would make you distrust a tool like this?
9. Would you pay for "fit plus blockers plus evidence checklist" even without proposal drafting?
10. If yes, how much would feel reasonable monthly?
11. Would you test it on your next live tender?
12. What result would make this indispensable?

**Prototype test.**
- Manually analyze 5 live tenders for each of 3 to 5 pilot firms.
- Compare your output with the team’s current internal process.
- Measure time saved and missed issues detected.

**Pricing test.**
- Test three offers:
  - CHF 59 per month self-serve
  - CHF 149 team plan
  - CHF 500 to CHF 1,000 paid pilot with onboarding

**Smoke test.**
- Cold outreach to 100 target firms.
- Goal: at least 10 meaningful replies, 5 demos, 3 pilot conversations.

**Concierge test.**
- This is strongly recommended.
- It lets you learn document patterns before automating them.
- It also reveals whether customers care more about discovery, qualification, or drafting.

**Success criteria.**
- 15 plus interviews with consistent pain around qualification.
- 5 firms willing to test on a live tender.
- 3 paid pilots, not just free trials.
- Users explicitly preferring source-linked blocker detection over generic summaries.
- At least one team saying, "This would have saved us time on our last tender."

**Kill criteria.**
- Most firms say SIMAP plus internal process is enough.
- Problem only matters for one-off bidders.
- Customers want only full proposal drafting and will not pay for qualification.
- No one will pay for pilots.

## Risks, Operations, Financials, Roadmap, and Final Recommendation

**Legal, regulatory, privacy, and platform risks.**

This is manageable, but only if you stay conservative.

First, Swiss data protection law is current and real. The revised FADP came into force on **1 September 2023**. If you process EU personal data, GDPR also becomes relevant. Supplier evidence packs often contain CVs, signatures, contact details, certifications, and potentially other personal data. That means you need a real privacy posture, not a startup afterthought. citeturn16search0turn16search1turn16search2

Second, SIMAP terms matter. SIMAP’s GTC say the platform is an information system for exchange between contracting authorities and tenderers, that the basic offering is free, and that additional services such as subscriptions and API use may carry fees. The API GTC also say SIMAP data obtained through the API are in JSON format, that published data on SIMAP are authoritative, and that users must not create the impression their redistribution is an official publication. The general GTC also require prior written agreement for reproduction, publishing, or linking of platform structures, applications, or content, subject to specified exceptions. This is not a reason to reject the idea. It is a reason to build with the official API route, keep branding clear, and get legal review of your exact reuse model before launch. citeturn21view0

Third, procurement law imposes process discipline. The Swiss PPA requires equal treatment of tenderers, safeguards confidentiality, and requires eligibility criteria to be objectively necessary and verifiable. It also requires award criteria and, generally, their weighting to be communicated. FDFA guidance similarly stresses transparent evaluation, genuine competition, and documented decisions, and states that goods and services tenders at or above **CHF 230,000** and construction work at or above **CHF 2,000,000** require tendering procedures. Bidroom should therefore position itself as decision support and documentation support, not as a legal interpreter or autonomous bid operator. citeturn37view0turn43view3turn43view1turn44view2

Fourth, antitrust and bid-rigging risk is not theoretical. Swiss competition authorities report around **2,000 rigged awards** of construction contracts uncovered in recent years and continue active awareness work on bid-rigging. Bidroom should never facilitate price coordination, competitor benchmarking, or collusive signaling. Avoid features like "market price recommendation based on similar bidders" in sensitive sectors. citeturn44view1turn43view2

Fifth, platform and data-source risk is moderate. SIMAP, TED, Find a Tender, and SAM.gov all support official access paths, which is good. But terms, schemas, fees, and fair-usage rules can change. TED explicitly publishes an API and fair-usage policy, and Find a Tender publishes notice data under the Open Government Licence and OCDS mappings. The correct design response is source abstraction and careful vendor or API dependency management. citeturn35view0turn35view1turn15search2

**Practical recommendations.**
- Use official APIs or authorized access paths only.
- Keep all extraction source-linked and time-stamped.
- State clearly that final bidder responsibility remains with the customer.
- Do not train models on customer data by default.
- Get legal review on your reuse of SIMAP content, privacy policy, DPA, and disclaimers before launch.
- If you later add expert review, separate software from advice contractually.

**Operations and technical implications.**

**Likely product type.**  
Web app first. No mobile app needed at MVP.

**Core technical components.**
- Source ingestion layer for SIMAP.
- Document processing pipeline for PDFs and attachments.
- Multilingual parsing and normalization.
- Rules or scoring engine for fit, blockers, and evidence requirements.
- Evidence library.
- Alerting and task workflow.
- Admin console and audit logs.

**Data model implications.**
- Organization
- Users and roles
- Tender source and notice metadata
- Documents and extracted facts
- Company evidence objects
- Decision records such as Bid, Pass, Unknown
- Alerts and tasks
- Extraction confidence and citations

**Third-party services likely needed.**
- Auth provider
- Billing
- Email / notification service
- Object storage
- Database and search
- LLM provider
- OCR only where necessary for scanned docs

**Auth and payments needs.**
- Email plus password and SSO later.
- Card payments early, invoice billing for larger annual accounts.

**Analytics needs.**
- Activation metrics
- Tender open to decision time
- Match quality
- False positive complaints
- Conversion from trial to paid
- Retention by team usage

**Admin and support needs.**
- Manual correction tools for extracted fields
- Support inbox
- Content moderation if customer uploads are messy
- Internal review queue for parser failures

**Security and privacy needs.**
- Encryption
- Role-based permissions
- Region-aware storage
- Data deletion
- Export logs
- Contractual controls for subprocessors

**Expected infrastructure cost at MVP stage.**  
Assumption: low hundreds of CHF per month for hosting, database, email, and storage, plus variable LLM and OCR cost that rises with document volume. A realistic MVP cash infrastructure range is around **CHF 200 to CHF 800 per month**, excluding founder labor, with total cost rising as more large documents are analyzed.

**Technical risks.**
- Multilingual and attachment-heavy tenders
- Low-quality scans
- Drawings and annexes outside text workflows
- Requirement extraction accuracy
- Schema changes in source APIs
- Overconfidence in LLM summaries

**What should be prototyped first.**
- A SIMAP URL-to-qualification brief pipeline.
- Evidence checklist extraction.
- Deadline and change tracker.
- A human-review back office for correcting extraction errors during pilots.

**Financial model.**

This should be modeled as a good small bootstrapped SaaS first, not a giant-market fantasy.

**Main assumptions.**
- Launch wedge is narrow and repeat-use.
- Blended paid ARPA starts around CHF 105 per month.
- Trial to paid conversion is more important than raw top-of-funnel.
- Monthly gross churn target should stay below 3.5 percent after early noise.
- Cash CAC is kept low through founder-led sales.
- Variable cost per active paid customer stays near CHF 15 per month.

**Scenario table.**

| Scenario | End of Year 1 paying customers | End of Year 2 paying customers | Blended monthly revenue per customer | End of Year 1 ARR | End of Year 2 ARR | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Conservative | 15 | 45 | CHF 85 | CHF 15,300 | CHF 45,900 | Weak wedge fit, slower trust-building |
| Base | 40 | 120 | CHF 105 | CHF 50,400 | CHF 151,200 | Good niche fit, steady outbound |
| Optimistic | 80 | 250 | CHF 125 | CHF 120,000 | CHF 375,000 | Strong wedge, good referrals, team plans land |

**Break-even estimate.**
- **Cash break-even excluding founder salary:** around **17 to 20** paying customers, assuming roughly CHF 1,500 monthly fixed cash costs and CHF 90 monthly contribution margin per customer.
- **Break-even including a modest founder salary:** around **90 to 100** paying customers.

**Gross margin expectations.**  
If Bidroom stays a software product with optional separate services, gross margin can be good. If it drifts into manual bid writing, margins and scalability deteriorate fast.

**What must be true for this to become a good business.**
- At least one wedge uses it repeatedly.
- Qualification, not just discovery, is what they will pay for.
- Source-linked extraction reaches trustable accuracy quickly.
- Customers retain because the evidence library and workflow create switching costs.
- You avoid becoming a custom service business in disguise.

**Risks and failure modes.**

| Risk | Probability | Impact | Early warning sign | Mitigation | Block development |
| --- | --- | --- | --- | --- | --- |
| Existing Swiss competitors already own the wedge | High | High | Prospects say "we already use TenderLift or TenderClaw" | Narrow segment harder, differentiate on evidence workflow, not generic AI | No, but it raises the bar |
| Problem is too infrequent for small firms | Medium | High | Interest from firms that bid once a year, but no retention | Target repeat bidders only | No |
| Tool becomes a generic proposal drafter | Medium | High | Feedback converges on "can it write everything?" | Hold line on qualification-first MVP | No |
| Extraction errors break trust | High | High | Users manually re-check every output and stop relying on it | Source citations, confidence scores, human correction layer | No, but major |
| SIMAP terms or API conditions tighten | Medium | Medium | Access friction, fee changes, or legal concerns | Use official access path, legal review, source abstraction | No |
| Privacy failure on uploaded evidence | Medium | Very high | Security questionnaires fail, pilots stall | CH/EU hosting, DPA, data minimization | Potentially yes |
| Sales cycle is longer than expected | Medium | Medium | Lots of demos, few paid pilots | Use paid concierge pilots, sharper ROI messaging | No |
| Founder lacks procurement credibility | Medium | Medium | Prospects ask for domain proof you do not have | Focus on IT-service wedge and partner with advisors | No |
| Market expects very low pricing due to cheap competitors | Medium | Medium | Strong interest but only at CHF 39 or below | Price on saved senior hours, offer team value | No |
| Antitrust or collusion-adjacent misuse concerns | Low to medium | High | Requests for price benchmarking against competitors | Refuse risky features, document policy | Potentially yes for specific features |

**Recommended roadmap.**

| Phase | Goal | Scope | Exit criteria | What not to build yet | Key metrics |
| --- | --- | --- | --- | --- | --- |
| Phase 0, validation and research | Prove wedge pain and willingness to pay | Interviews, concierge qualification, landing page, pilot offers | 3 paid pilots, 15 strong interviews | Full app, multi-country support, drafting | Interview insight quality, pilot conversion |
| Phase 1, MVP | Deliver SIMAP qualification workflow | Matching, blocker extraction, deadlines, evidence checklist, team notes | 5 to 10 pilot users with repeated use | Proposal drafting, CRM integrations, mobile | Activation, time-to-decision, error reports |
| Phase 2, paid launch | Convert pilots into self-serve revenue | Billing, trial flow, onboarding, security basics, simple exports | 5 paying logos, 70% week-4 retention | International expansion, consultant marketplace | Trial to paid, weekly active workspaces |
| Phase 3, growth and retention | Strengthen stickiness | Evidence library, addenda monitoring, team workflow, analytics | Churn under 3.5% monthly, referral signs | Broad platform ambitions | Net revenue retention, tender decisions per account |
| Phase 4, expansion | Add second wedge or second geography | Vertical templates, partner channel, then one new source such as TED or FTS | Clear repeatable acquisition channel | SAM.gov or buyer-side tools too early | CAC payback, channel mix, margin |

**Open questions and limitations.**

- I did **not** find a current official public SIMAP annual notice count in accessible sources during this research.
- A Swiss competitor claims **3,000+ annual tenders** and **CHF 20B+** contract value on SIMAP, but I would treat that only as directional competitor marketing, not as a neutral market statistic. citeturn41search15
- Swiss customer-count estimates for active bidder firms are therefore reasoned estimates, not official counts.
- Some procurement-law detail differs across procedure type, contracting authority, and federal versus cantonal practice. This plan is for strategy, not formal legal advice.

**Final recommendation.**

**Recommendation chosen:** **Validate first.**

That is the honest answer. The opportunity is real, but the generic version is late. The winning version is narrower: **Bidroom as a Swiss SIMAP qualification and evidence workflow tool for one repeat-bidder vertical, starting with IT and digital consultancies.** That version aligns with the official procurement workflow, avoids the riskiest legal promises, and gives you a plausible bootstrapped path to early revenue. The broad version, "AI tenders for everyone," is too exposed to existing competitors and too fuzzy to trust.

**The strongest version of the idea.**  
A Switzerland-first, source-linked qualification product that helps small supplier teams decide Bid or Pass, detect blockers, track changes, and reuse evidence across public-sector tenders.

**The weakest assumption.**  
That enough Swiss firms in your chosen wedge bid often enough, and feel enough pain, to pay recurring subscription revenue for qualification workflow without demanding full proposal drafting.

**The first thing you should do next.**  
Run a paid concierge validation with 10 to 15 live SIMAP tenders for 5 target firms in one vertical, and measure whether your qualification brief changes decisions or saves time.

**The first thing you should not do.**  
Do not build a broad multi-sector, multi-country proposal generator before proving that one Swiss wedge will pay for qualification and evidence workflow.

**Founder brief.**  
Bidroom helps Swiss suppliers qualify public tenders before they waste time writing bids. It reads SIMAP notices and tender documents, flags blockers and deadlines, extracts evaluation criteria and evidence needs, and links every finding back to the source. The initial customer is a small Swiss IT or digital consultancy that wants public-sector revenue but does not have a formal bid team. The business model is subscription software with optional onboarding, and the product wins only if it is more trustworthy and more operationally useful than SIMAP plus spreadsheets plus a generic LLM.