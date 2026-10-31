export interface ArchitectureSection {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'Requirements' | 'Architecture' | 'Security & Privacy' | 'Product & UI' | 'Commercial';
  content: string;
}

export const ARCHITECTURE_SPECIFICATIONS: ArchitectureSection[] = [
  {
    id: 'srs',
    number: 1,
    title: 'Software Requirements Specification (SRS)',
    subtitle: 'Functional and non-functional requirements for the ECHO multi-tenant platform',
    category: 'Requirements',
    content: `### 1.1 Purpose and System Scope
ECHO is an enterprise-grade Customer Intelligence, Guest Wi-Fi Authentication, Customer Relationship Management (CRM), and Retention Automation Software-as-a-Service (SaaS) platform. The system operates as a bridge between physical hospitality establishments (hotels, safari lodges, restaurants, cafés) and returning digital customer relationships.

### 1.2 Functional Requirements (FR)
- **FR-1: Dual Identity Management**: Distinct segregation between Universal ECHO Identity (\`ECHO-XXXXX\`) and Business-Specific Customer Profiles (\`GH-001\`, \`JC-018\`).
- **FR-2: Dynamic Captive Portal**: Multi-tenant captive portal supporting co-branded authentication, SMS OTP, Email verification, existing ECHO SSO, and network bypass controls.
- **FR-3: Network AAA Handshake**: Support for RADIUS (Remote Authentication Dial-In User Service) RFC 2865/2866 with MikroTik RouterOS API, Ubiquiti UniFi Controller, and TP-Link Omada SDN.
- **FR-4: Retention Intelligence Classifier**: Real-time algorithmic categorization into 8 distinct customer stages: NEW, ACTIVE, LOYAL, RETURNING, COOLING, AT-RISK, INACTIVE, POTENTIALLY LOST with industry-calibrated intervals.
- **FR-5: Reconnection Engine**: Automated multi-channel outreach (SMS, WhatsApp Business API, Email) gated by explicit consent, quiet hours (21:00-08:00), frequency caps, and managerial approval queues.
- **FR-6: Privileged Super Admin Console**: Independent administrative platform for tenant provisioning, infrastructure telemetry, billing, and time-bound break-glass audit logging.

### 1.3 Non-Functional Requirements (NFR)
- **NFR-1 Performance & Latency**: Captive portal initial render < 800ms; RADIUS Access-Accept response < 150ms under 5,000 concurrent sessions.
- **NFR-2 Security & Isolation**: Strict multi-tenant row-level database segregation. PII encryption at rest (AES-256-GCM) and TLS 1.3 in transit.
- **NFR-3 Accessibility & UX**: 100% WCAG 2.2 AA compliance, keyboard navigation, dual-cue status indicators (color + icon + text), dark/light visual comfort.
- **NFR-4 Data Protection**: Adherence to Kenya Data Protection Act 2019 and GDPR. Zero cross-business data leakage without explicit user consent.`
  },
  {
    id: 'prd',
    number: 2,
    title: 'Product Requirements Document (PRD)',
    subtitle: 'Core product objectives, personas, use cases, and success metrics',
    category: 'Requirements',
    content: `### 2.1 Problem Statement
Physical hospitality and retail venues spend substantial budgets attracting visitors but suffer from the "black hole of physical visits": when a guest walks out the door, the business has zero verified identity, zero insight into return cadence, and no automated mechanism to identify cooling interest or encourage a repeat visit.

### 2.2 Target Personas
1. **The Physical Business Owner / GM** (e.g., General Manager of Grand Horizon Hotel): Needs to protect brand reputation, boost repeat stays, and track retention ROI without manual spreadsheet work.
2. **The Front Desk / F&B Manager** (e.g., Head of Guest Relations): Needs to know when high-value VIPs arrive, recognize preferences, and approve tailored win-back campaigns.
3. **The Guest / Customer** (e.g., James): Wants fast, secure Wi-Fi without intrusive spam; desires control over who can contact him and easy one-tap access at other ECHO-powered venues.
4. **The ECHO Platform Super Admin**: Responsible for uptime, network controllers, tenant billing, and platform security.

### 2.3 Key Performance Indicators (KPIs)
- **Repeat Visit Rate (RVR)**: % of first-time Wi-Fi signups who return within 30/90 days.
- **Retention Reactivation Rate**: % of Cooling/At-Risk customers who return within 14 days of an automated reconnection message.
- **Portal Conversion Rate**: > 88% of captive portal impressions converting to verified internet sessions.
- **Opt-In Integrity**: 0 unverified marketing dispatches; 100% compliance with opt-out requests.`
  },
  {
    id: 'system-arch',
    number: 3,
    title: 'System Architecture Document',
    subtitle: 'High-level distributed architecture, service boundaries, and data flow',
    category: 'Architecture',
    content: `### 3.1 Distributed Component Architecture
The ECHO architecture consists of five decoupled subsystems:
1. **Edge Network & AAA Tier**:
   - Hardware abstraction layer interfacing with MikroTik RouterOS API (Port 8728/TLS 8729), UniFi Controller (REST API), TP-Link Omada SDN, and FreeRADIUS servers.
   - Captive Portal Gateway resolving DNS redirects (RFC 8952 / Captive-Portal API) and issuing RADIUS Access-Request packets.
2. **API & Business Logic Monolith / Micro-Services**:
   - Multi-tenant application backend handling tenant resolution, authentication tokens, CRM relationship logic, and retention classification.
3. **Asynchronous Automation & Event Workers**:
   - Worker queues (powered by n8n and Redis BullMQ) running scheduled retention interval jobs, quiet-hour rate limiting, and webhook dispatches.
4. **Communication Gateway Integration**:
   - Dispatch adapter connecting to Twilio / Africa's Talking (SMS), Meta WhatsApp Cloud API, and transactional email providers (SendGrid/Resend).
5. **Universal & Tenant Database Layer**:
   - PostgreSQL with physical schema separation or Row-Level Security (RLS) enforcing strict tenant boundaries.`
  },
  {
    id: 'customer-journey',
    number: 4,
    title: 'Customer Journey Diagram',
    subtitle: 'End-to-end guest lifecycle from physical entrance to verified return',
    category: 'Product & UI',
    content: `### 4.1 Step-by-Step Guest Lifecycle
\`\`\`text
[Guest Enters Venue]
       │
       ▼
[Connects to SSID: "Grand Horizon Guest Wi-Fi"]
       │
       ▼
[Captive Network Assistant (CNA) launches ECHO Captive Portal]
       │
       ├─► Option A: Existing ECHO User? ──► Enter Phone/Email ──► Biometric/OTP Verify
       │                                                                  │
       └─► Option B: First-time Guest ──► Branded Reg Form ──► SMS OTP ───┘
                                                                          │
                                                                          ▼
                                                         [Privacy & Marketing Consent]
                                                         - Mandatory: Wi-Fi Terms & Privacy Notice
                                                         - Optional: Business-Specific Marketing (SMS/WA)
                                                                          │
                                                                          ▼
                                                    [RADIUS Access-Accept Generated]
                                                    - MikroTik / UniFi grants session (MAC authorized)
                                                    - Bandwidth & duration policy applied
                                                                          │
                                                                          ▼
                                                    [Physical Visit Session Recorded]
                                                    - Dual Identity mapped: ECHO-10001 <-> GH-001
                                                    - Customer profile updated to ACTIVE
                                                                          │
                                            ┌─────────────────────────────┴─────────────────────────────┐
                                            ▼                                                           ▼
                             [Cadence Maintained]                                       [Cadence Exceeded: Cooling/At-Risk]
                             - Customer returns on schedule                             - System detects elapsed threshold
                             - Status upgrades to LOYAL                                 - Checks consent & quiet hours
                             - VIP recognition on portal                                - Reconnection message dispatched
                                                                                        - Win-back visit measured & logged!
\`\`\``
  },
  {
    id: 'network-auth',
    number: 5,
    title: 'Network Authentication Architecture',
    subtitle: 'Captive portal redirection, RADIUS AAA protocols, and hardware abstraction',
    category: 'Architecture',
    content: `### 5.1 RADIUS AAA Protocol Implementation
ECHO implements standard RFC 2865 (RADIUS Authentication) and RFC 2866 (RADIUS Accounting):
- **Access-Request**: Triggered when client attempts connection. Transmits:
  - \`User-Name\`: Device MAC address or generated token.
  - \`Calling-Station-Id\`: Client MAC address (\`AA-BB-CC-DD-EE-FF\`).
  - \`Called-Station-Id\`: AP MAC address + SSID.
  - \`NAS-Identifier\` / \`NAS-IP-Address\`: Router/Gateway identity.
- **Access-Accept**: Issued upon successful OTP or ECHO session verification. Returns attributes:
  - \`Session-Timeout\`: Configured duration (e.g., 14,400 seconds).
  - \`WISPr-Bandwidth-Max-Down\`: Bandwidth rate limiter (e.g., 10240 kbps).
  - \`WISPr-Bandwidth-Max-Up\`: Upload rate limiter (e.g., 5120 kbps).

### 5.2 Multi-Vendor Hardware Abstraction Layer
1. **MikroTik RouterOS**: RouterOS v6/v7 Hotspot API integration via REST or RouterOS API socket; walled-garden rule provisioning.
2. **Ubiquiti UniFi**: External Portal Server integration via UniFi Controller API (\`/api/s/{site}/cmd/stamgr\`).
3. **TP-Link Omada**: Omada Controller External Portal protocol with HMAC-SHA256 URL token validation.
4. **Proprietary ECHO Hardware Roadmap**: Cloud-managed micro-gateway running OpenWrt with embedded WireGuard tunnel to ECHO Core.`
  },
  {
    id: 'dual-identity',
    number: 6,
    title: 'Universal and Business Identity Architecture',
    subtitle: 'Mathematical and architectural segregation of cross-tenant customer profiles',
    category: 'Architecture',
    content: `### 6.1 The Non-Surveillance Dual Identity Rule
A fundamental tenet of ECHO is that a universal customer account must **never** create a universal surveillance state for businesses.

### 6.2 Data Schema Segregation
- **UniversalCustomerAccount**:
  - \`echoId\` (UUID / \`ECHO-XXXXX\`): Sovereign customer anchor.
  - \`verifiedPhone\`, \`verifiedEmail\`: Encrypted cryptographic hashes + KMS encrypted ciphertext.
  - \`globalPreferences\`: Language, biometric auth preferences, global opt-out flag.
  - *No business visit logs or purchase records exist in this table.*

- **BusinessCustomerProfile**:
  - \`businessCustomerId\` (\`GH-001\`, \`JC-018\`): Organization-scoped ID.
  - \`organizationId\`: Foreign key to subscribed tenant.
  - \`echoId\`: Foreign key reference for cross-business recognition.
  - \`visitCount\`, \`firstVisitAt\`, \`lastVisitAt\`.
  - \`marketingConsent\`: Timestamped, IP-logged explicit consent granted *solely* to this organization.
  - \`retentionClassification\`: Independent status (e.g., Customer may be LOYAL at Grand Horizon Hotel but INACTIVE at Safari Restaurant).`
  },
  {
    id: 'database-erd',
    number: 7,
    title: 'Database Entity Relationship Diagram (ERD)',
    subtitle: 'PostgreSQL schema entities, foreign keys, multi-tenant isolation, and indexes',
    category: 'Architecture',
    content: `### 7.1 Relational Entity Schema
The schema enforces strict tenant boundaries and foreign key constraints:

\`\`\`sql
-- Universal Tier
CREATE TABLE universal_customers (
    echo_id VARCHAR(32) PRIMARY KEY, -- 'ECHO-10001'
    phone_hash VARCHAR(64) UNIQUE NOT NULL,
    email_hash VARCHAR(64) UNIQUE,
    phone_encrypted TEXT NOT NULL,
    email_encrypted TEXT,
    full_name TEXT NOT NULL,
    preferred_lang VARCHAR(5) DEFAULT 'en',
    global_opt_out BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organization / Tenant Tier
CREATE TABLE organizations (
    org_id VARCHAR(32) PRIMARY KEY, -- 'ORG-GRAND-HORIZON'
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(50) NOT NULL, -- 'hotel', 'cafe', 'restaurant'
    subscription_tier VARCHAR(50) DEFAULT 'GROWTH',
    status VARCHAR(30) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE business_branches (
    branch_id VARCHAR(32) PRIMARY KEY,
    org_id VARCHAR(32) REFERENCES organizations(org_id) ON DELETE CASCADE,
    branch_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    timezone VARCHAR(50) DEFAULT 'Africa/Nairobi'
);

-- Business-Specific Customer Tier
CREATE TABLE business_customer_profiles (
    profile_id VARCHAR(32) PRIMARY KEY,
    org_id VARCHAR(32) REFERENCES organizations(org_id) ON DELETE CASCADE,
    echo_id VARCHAR(32) REFERENCES universal_customers(echo_id),
    business_customer_id VARCHAR(32) NOT NULL, -- 'GH-001'
    total_visits INT DEFAULT 1,
    last_visit_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    retention_classification VARCHAR(30) DEFAULT 'NEW',
    loyalty_points INT DEFAULT 0,
    UNIQUE(org_id, echo_id)
);

CREATE TABLE consent_records (
    consent_id VARCHAR(32) PRIMARY KEY,
    profile_id VARCHAR(32) REFERENCES business_customer_profiles(profile_id),
    channel VARCHAR(20) NOT NULL, -- 'SMS', 'WHATSAPP', 'EMAIL'
    is_granted BOOLEAN NOT NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_ip VARCHAR(45) NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE visit_sessions (
    session_id VARCHAR(32) PRIMARY KEY,
    org_id VARCHAR(32) REFERENCES organizations(org_id),
    branch_id VARCHAR(32) REFERENCES business_branches(branch_id),
    profile_id VARCHAR(32) REFERENCES business_customer_profiles(profile_id),
    device_mac VARCHAR(17) NOT NULL,
    nas_ip VARCHAR(45),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    bytes_downloaded BIGINT DEFAULT 0
);
\`\`\``
  },
  {
    id: 'api-architecture',
    number: 8,
    title: 'API Architecture & Specifications',
    subtitle: 'RESTful endpoints, captive redirection contracts, and webhooks',
    category: 'Architecture',
    content: `### 8.1 Core API Endpoints
- **POST \`/api/v1/captive/handshake\`**: Resolves tenant branding from NAS IP/SSID and returns portal config.
- **POST \`/api/v1/captive/authenticate\`**: Verifies OTP or ECHO token, logs consent, and signals RADIUS backend.
- **GET \`/api/v1/tenant/analytics/retention\`**: Retrieves 8-stage retention distribution and cohort trends.
- **POST \`/api/v1/tenant/reconnection/campaigns\`**: Creates outreach campaign with filter rules and approval gating.
- **POST \`/api/v1/webhooks/mpesa/c2b\`**: Daraja M-Pesa instant payment confirmation with signature check.
- **POST \`/api/v1/super-admin/break-glass\`**: Privileged time-bound incident investigation requiring audited justification.`
  },
  {
    id: 'rbac-matrix',
    number: 9,
    title: 'Role and Permission Matrix (RBAC)',
    subtitle: 'Hierarchical permission enforcement across Super Admin, Tenant, and Customer tiers',
    category: 'Security & Privacy',
    content: `### 9.1 Privileged Access Matrix

| Role | Tenant Analytics | Edit Branding | Send Campaigns | Modify Subscriptions | Network Hardware Config | View Raw Customer PII | Platform Infrastructure |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Super Admin** | Aggregated | ❌ | ❌ | ✅ All Orgs | View Status Only | 🔒 Masked (Break-Glass) | ✅ Full |
| **Org Owner** | ✅ Org Only | ✅ Org Only | ✅ Approved | ✅ Own Org | ✅ Own Org | ✅ Own Customers | ❌ |
| **Branch Manager** | ✅ Branch Only | ❌ | Review/Submit | ❌ | View AP Status | ✅ Branch Customers | ❌ |
| **Front Desk Staff** | View VIPs | ❌ | ❌ | ❌ | View Online Count | 🔒 Partial Masked | ❌ |
| **Customer** | ❌ | ❌ | ❌ | ❌ | ❌ | Self Only | ❌ |`
  },
  {
    id: 'super-admin-spec',
    number: 10,
    title: 'Super Admin Console Specification',
    subtitle: 'Platform metrics, tenant lifecycle, infrastructure telemetry, and break-glass auditing',
    category: 'Architecture',
    content: `### 10.1 Functional Modules
1. **Executive Platform Metrics**: Real-time MRR, ARR, active organizations, churn rate, total authenticated sessions, global API latency.
2. **Tenant Lifecycle Management**: Provision, verify, suspend, or upgrade tenant accounts; branch quotas; enterprise SLAs.
3. **Infrastructure Monitoring**:
   - FreeRADIUS cluster health & authorization rate.
   - MikroTik/UniFi webhook listener status.
   - n8n background worker queues and retention computation jobs.
4. **Privileged Break-Glass & Audit Trail**:
   - Zero-backdoor architecture: customer PII is masked by default (\`+254 ••• ••78\`).
   - Break-glass unmasking requires: Target Ticket ID, Explicit Justification, 15-minute time lease, and produces an immutable, tamper-evident audit record.`
  },
  {
    id: 'business-dashboard-spec',
    number: 11,
    title: 'Business Dashboard Specification',
    subtitle: 'Tenant workspace for customer retention analytics, Wi-Fi metrics, and campaigns',
    category: 'Product & UI',
    content: `### 11.1 Tenant Control Center
- **Customer Intelligence Hub**: Real-time distribution across NEW, ACTIVE, LOYAL, RETURNING, COOLING, AT-RISK, INACTIVE, POTENTIALLY LOST.
- **Cadence Analyzer**: Average days between visits per customer tier; industry archetype selector (Café vs Hotel vs Safari Lodge).
- **Wi-Fi Network Telemetry**: Active connected devices, peak hours heatmap, bandwidth consumption, captive portal completion rate.
- **Reconnection Automation**: Campaign preview with brand voice adaptation, multi-channel template builder (SMS, WhatsApp, Email), manager approval gates.`
  },
  {
    id: 'customer-portal-spec',
    number: 12,
    title: 'Customer Portal Specification',
    subtitle: 'Self-sovereign customer identity management, privacy controls, and connected devices',
    category: 'Product & UI',
    content: `### 12.1 Customer Control Features
- **Identity Hub**: Manage universal phone, email, and preferred language.
- **Connected Businesses**: Transparent list of all venues where the customer holds a profile (e.g., Grand Horizon Hotel, Java Coffee House).
- **Granular Consent Center**: Toggle marketing communication permissions independently per venue and per channel (SMS/WhatsApp).
- **Data Subject Rights**: Download personal data export (JSON/CSV) and trigger Right-to-be-Forgotten erasure requests with 1-click confirmation.`
  },
  {
    id: 'threat-model',
    number: 13,
    title: 'Security Threat Model (STRIDE)',
    subtitle: 'Threat identification, attack vectors, and defense-in-depth mitigations',
    category: 'Security & Privacy',
    content: `### 13.1 STRIDE Threat Assessment
- **Spoofing (MAC Address)**: Attackers spoofing known MACs to steal Wi-Fi. *Mitigation: MAC re-authentication paired with dynamic cryptographically signed session tokens and captive re-challenge.*
- **Tampering (RADIUS Payloads)**: Interception of AAA packets. *Mitigation: RADIUS over TLS (RadSec - RFC 6614) with shared secrets and IP-restricted firewalls.*
- **Repudiation (Campaign Dispatches)**: Disputed customer outreach. *Mitigation: Cryptographic consent audit logs with client IP, timestamp, and terms version hash.*
- **Information Disclosure (Cross-Tenant Leakage)**: Organization B reading Organization A data. *Mitigation: Row-Level Security (RLS) in PostgreSQL and automated multi-tenant regression unit tests.*
- **Denial of Service (Captive Portal Flooding)**: Bot flooding registration forms. *Mitigation: Cloudflare turnstile integration, IP rate limiting, and SMS OTP velocity throttling.*
- **Elevation of Privilege (Super Admin Abuse)**: Rogues viewing sensitive VIP stays. *Mitigation: Hardware MFA, dual-authorization break-glass workflows, and immutable audit logs.*`
  },
  {
    id: 'consent-architecture',
    number: 14,
    title: 'Data Protection & Consent Architecture',
    subtitle: 'Kenya DPA 2019, GDPR compliance, quiet hours, and unbundling mandates',
    category: 'Security & Privacy',
    content: `### 14.1 Key Legal & Privacy Principles
1. **Unbundled Consent**: Access to ordinary guest Wi-Fi must NEVER be conditioned upon consenting to marketing communications.
2. **Quiet Hours Enforcement**: Reconnection engine strictly suppresses dispatches between 21:00 and 08:00 local venue time.
3. **Right to Revoke**: Every message includes a 1-tap opt-out link / "STOP" keyword handler that updates the database instantaneously.
4. **Data Minimization**: Do not collect national IDs or invasive tracking markers. Passive Wi-Fi sniffing is strictly forbidden.`
  },
  {
    id: 'design-system',
    number: 15,
    title: 'UI/UX Design System Specification',
    subtitle: 'Typography hierarchy, component spacing, responsive grids, and design tokens',
    category: 'Product & UI',
    content: `### 15.1 Design Tokens & Hierarchy
- **Typography Scale**: Plus Jakarta Sans for interface clarity and JetBrains Mono for technical IDs and telemetry.
- **Elevation System**: Flat base with subtle borders (\`border-slate-200 dark:border-slate-800\`) and soft ambient shadows.
- **Component Geometry**: 10px-12px rounded borders (\`rounded-xl\`), 44px minimum interactive touch targets for mobile accessibility.`
  },
  {
    id: 'roadmap',
    number: 16,
    title: 'MVP Development Roadmap',
    subtitle: '12-Phase engineering execution timeline from prototype to pilot deployment',
    category: 'Commercial',
    content: `### 16.1 Engineering Phases
- **Phase 1-2**: Foundation, System SRS, Database Schema, and Dual-Identity Engine.
- **Phase 3-4**: Dynamic Captive Portal, RADIUS AAA Handshake, and Retention Intelligence Engine.
- **Phase 5-7**: Business Dashboard, Multi-Channel Reconnection Engine, and Super Admin Console.
- **Phase 8-9**: MikroTik/UniFi Network Integration and Commercial Billing (M-Pesa Daraja + Stripe).
- **Phase 10-12**: AI Retention Forecaster, Penetration Testing, and Live Pilot Deployment at first partner hotel.`
  },
  {
    id: 'commercial-arch',
    number: 17,
    title: 'Commercial & Subscription Architecture',
    subtitle: 'Pricing tiers, M-Pesa Daraja integration, billing reconciliation, and hardware models',
    category: 'Commercial',
    content: `### 17.1 Tier Pricing Hypotheses
- **STARTER (KSh 2,500/mo)**: Single location, up to 500 active monthly guests, basic Wi-Fi captive portal, automated retention classification.
- **GROWTH (KSh 5,000/mo)**: Up to 2 branches, 2,500 monthly guests, multi-channel reconnection (SMS & Email), loyalty point tracker.
- **PROFESSIONAL (KSh 10,000/mo)**: Up to 5 branches, 10,000 monthly guests, WhatsApp Business API integration, AI retention assistant, full POS/PMS connector.
- **ENTERPRISE (Custom)**: Unlimited branches, custom SLA, dedicated RADIUS clustering, on-premise hardware appliances, dedicated account manager.`
  },
  {
    id: 'color-psychology',
    number: 18,
    title: 'Advanced Colour Psychology Specification',
    subtitle: 'Intentional palette design, visual comfort, and light sensitivity considerations',
    category: 'Product & UI',
    content: `### 18.1 Psychological Foundations
- **Deep Navy (#0F172A / #080D1A)**: Conveys security, enterprise stability, and architectural maturity without harsh pure-black eye fatigue.
- **Subtle Teal (#0D9488 / #14B8A6)**: Represents intelligence, fresh connections, and organic growth.
- **Warm Neutrals (#F8FAFC / #162036)**: Soft backgrounds that drastically reduce glare and optical tension during prolonged dashboard sessions.
- **Dual Visual Encoding**: Every critical alert or status pairs its color with an explicit textual label and distinct SVG icon to guarantee 100% usability for color-blind individuals.`
  },
  {
    id: 'design-tokens-spec',
    number: 19,
    title: 'Light and Dark Mode Design Tokens',
    subtitle: 'Complete semantic token mapping across CSS custom properties and Tailwind themes',
    category: 'Product & UI',
    content: `### 19.1 Semantic Token Architecture
\`\`\`css
/* Light Mode */
--surface-page: #F8FAFC;
--surface-card: #FFFFFF;
--text-primary: #0F172A;
--text-secondary: #475569;
--brand-teal: #0D9488;
--status-active: #059669;
--status-cooling: #D97706;
--status-atrisk: #EA580C;
--status-lost: #DC2626;

/* Dark Mode */
--surface-page: #080D1A;
--surface-card: #0F172A;
--text-primary: #F8FAFC;
--text-secondary: #CBD5E1;
--brand-teal: #14B8A6;
--status-active: #34D399;
--status-cooling: #FBBF24;
--status-atrisk: #FB923C;
--status-lost: #F87171;
\`\`\``
  },
  {
    id: 'accessibility-plan',
    number: 20,
    title: 'WCAG 2.2 AA Accessibility Testing Plan',
    subtitle: 'Automated Axe-core rules, keyboard focus management, contrast benchmarks, and ARIA audits',
    category: 'Security & Privacy',
    content: `### 20.1 Rigorous Accessibility Protocol
1. **Contrast Ratio Auditing**: All body text maintains minimum 4.5:1 ratio against surface background; large headings exceed 3:1.
2. **Keyboard Traversal**: Skip links, logical tab order (\`tabindex=0\`), visible focus indicator (\`outline: 2px solid #0D9488\`).
3. **Screen Reader Verification**: Semantic landmark elements (\`<main>\`, \`<nav>\`, \`<section>\`, \`<header>\`), \`aria-live\` announcements for Wi-Fi auth and campaign triggers.
4. **Reduced Motion Adaptation**: CSS \`@media (prefers-reduced-motion: reduce)\` automatically suspends decorative transitions and animations.`
  }
];
