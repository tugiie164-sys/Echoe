import { IndustryType, RetentionClassification } from '../lib/retentionEngine';

export interface BusinessTenant {
  id: string;
  name: string;
  industry: IndustryType;
  industryLabel: string;
  tier: 'STARTER' | 'GROWTH' | 'PROFESSIONAL' | 'ENTERPRISE';
  branchesCount: number;
  activeGuestsCount: number;
  monthlyRevenueKsh: number;
  logo: string;
  brandColor: string;
  branches: { id: string; name: string; city: string; activeDevices: number }[];
  wifiConfig: {
    ssid: string;
    gatewayType: 'MikroTik RouterOS' | 'Ubiquiti UniFi' | 'TP-Link Omada' | 'FreeRADIUS Cluster';
    nasIp: string;
    sessionTimeoutMins: number;
    downloadSpeedMbps: number;
    uploadSpeedMbps: number;
  };
}

export interface CustomerRecord {
  id: string; // e.g. "GH-001"
  echoId: string; // "ECHO-10001"
  name: string;
  phone: string;
  email: string;
  industry: IndustryType;
  businessId: string;
  businessName: string;
  firstVisitDaysAgo: number;
  lastVisitDaysAgo: number;
  totalVisits: number;
  loyaltyPoints: number;
  marketingConsent: {
    smsOptIn: boolean;
    whatsAppOptIn: boolean;
    emailOptIn: boolean;
    timestamp: string;
  };
  customNotes: string;
  preferredRoomOrTable?: string;
}

export const MOCK_TENANTS: BusinessTenant[] = [
  {
    id: 'ORG-GRAND-HORIZON',
    name: 'Grand Horizon Resort & Spa',
    industry: 'hotel',
    industryLabel: 'Luxury Hotel & Resort',
    tier: 'PROFESSIONAL',
    branchesCount: 2,
    activeGuestsCount: 1420,
    monthlyRevenueKsh: 10000,
    logo: '🏨',
    brandColor: '#0D9488',
    branches: [
      { id: 'BR-GH-COAST', name: 'Coastal Diani Beach Wing', city: 'Mombasa', activeDevices: 84 },
      { id: 'BR-GH-HIGHLAND', name: 'Mount Kenya Safari Wing', city: 'Nanyuki', activeDevices: 38 },
    ],
    wifiConfig: {
      ssid: 'Grand Horizon Guest Wi-Fi',
      gatewayType: 'MikroTik RouterOS',
      nasIp: '192.168.88.1',
      sessionTimeoutMins: 240,
      downloadSpeedMbps: 25,
      uploadSpeedMbps: 10,
    },
  },
  {
    id: 'ORG-JAVA-COFFEE',
    name: 'Java House Artisan Roastery',
    industry: 'cafe',
    industryLabel: 'Specialty Café & Roasters',
    tier: 'GROWTH',
    branchesCount: 4,
    activeGuestsCount: 3840,
    monthlyRevenueKsh: 5000,
    logo: '☕',
    brandColor: '#B45309',
    branches: [
      { id: 'BR-JH-WESTLANDS', name: 'Westlands Flagship', city: 'Nairobi', activeDevices: 62 },
      { id: 'BR-JH-KILIMANI', name: 'Kilimani Gardens', city: 'Nairobi', activeDevices: 45 },
      { id: 'BR-JH-CBD', name: 'Kenyatta Ave Express', city: 'Nairobi', activeDevices: 31 },
    ],
    wifiConfig: {
      ssid: 'JavaHouse_Guest_FreeWiFi',
      gatewayType: 'Ubiquiti UniFi',
      nasIp: '10.0.10.1',
      sessionTimeoutMins: 90,
      downloadSpeedMbps: 15,
      uploadSpeedMbps: 5,
    },
  },
  {
    id: 'ORG-MARA-SAFARI',
    name: 'Mara River Luxury Tented Camp',
    industry: 'safari_lodge',
    industryLabel: 'Safari Lodge & Conservancy',
    tier: 'ENTERPRISE',
    branchesCount: 1,
    activeGuestsCount: 410,
    monthlyRevenueKsh: 25000,
    logo: '🦁',
    brandColor: '#059669',
    branches: [
      { id: 'BR-MR-SERENGETI', name: 'Mara Triangle Riverside', city: 'Maasai Mara', activeDevices: 29 },
    ],
    wifiConfig: {
      ssid: 'Mara_Wilderness_GuestWiFi',
      gatewayType: 'FreeRADIUS Cluster',
      nasIp: '172.16.1.1',
      sessionTimeoutMins: 480,
      downloadSpeedMbps: 30,
      uploadSpeedMbps: 15,
    },
  },
];

export const MOCK_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'GH-001',
    echoId: 'ECHO-10001',
    name: 'James Ndung’u',
    phone: '+254712345678',
    email: 'james.ndungu@example.ke',
    industry: 'hotel',
    businessId: 'ORG-GRAND-HORIZON',
    businessName: 'Grand Horizon Resort & Spa',
    firstVisitDaysAgo: 180,
    lastVisitDaysAgo: 4,
    totalVisits: 8,
    loyaltyPoints: 1250,
    marketingConsent: {
      smsOptIn: true,
      whatsAppOptIn: false,
      emailOptIn: true,
      timestamp: '2026-05-14T08:30:00Z',
    },
    customNotes: 'Prefers ocean-view suites and early check-in. Vegetarian breakfast.',
    preferredRoomOrTable: 'Suite 402',
  },
  {
    id: 'GH-002',
    echoId: 'ECHO-10042',
    name: 'Amina Mohammed',
    phone: '+254722987654',
    email: 'amina.m@example.ke',
    industry: 'hotel',
    businessId: 'ORG-GRAND-HORIZON',
    businessName: 'Grand Horizon Resort & Spa',
    firstVisitDaysAgo: 95,
    lastVisitDaysAgo: 210,
    totalVisits: 2,
    loyaltyPoints: 320,
    marketingConsent: {
      smsOptIn: true,
      whatsAppOptIn: true,
      emailOptIn: true,
      timestamp: '2026-07-20T14:15:00Z',
    },
    customNotes: 'Conference delegate for East Africa Tourism Summit.',
    preferredRoomOrTable: 'Deluxe Room 218',
  },
  {
    id: 'GH-003',
    echoId: 'ECHO-10115',
    name: 'David Ochieng',
    phone: '+254733456789',
    email: 'david.o@example.ke',
    industry: 'hotel',
    businessId: 'ORG-GRAND-HORIZON',
    businessName: 'Grand Horizon Resort & Spa',
    firstVisitDaysAgo: 12,
    lastVisitDaysAgo: 2,
    totalVisits: 1,
    loyaltyPoints: 100,
    marketingConsent: {
      smsOptIn: false,
      whatsAppOptIn: false,
      emailOptIn: false,
      timestamp: '2026-10-29T11:00:00Z',
    },
    customNotes: 'Weekend staycation guest. Zero marketing consent requested.',
    preferredRoomOrTable: 'Garden Cottage 08',
  },
  {
    id: 'GH-004',
    echoId: 'ECHO-10204',
    name: 'Sarah Van Der Merwe',
    phone: '+254799887766',
    email: 'sarah.vdm@example.com',
    industry: 'hotel',
    businessId: 'ORG-GRAND-HORIZON',
    businessName: 'Grand Horizon Resort & Spa',
    firstVisitDaysAgo: 300,
    lastVisitDaysAgo: 140,
    totalVisits: 4,
    loyaltyPoints: 680,
    marketingConsent: {
      smsOptIn: true,
      whatsAppOptIn: true,
      emailOptIn: true,
      timestamp: '2026-01-10T16:45:00Z',
    },
    customNotes: 'Frequent spa visitor. Enjoys deep tissue massage packages.',
    preferredRoomOrTable: 'Villa 12',
  },
  {
    id: 'JC-018',
    echoId: 'ECHO-10001', // Notice: James also visits Java House! Dual Identity demonstration!
    name: 'James Ndung’u',
    phone: '+254712345678',
    email: 'james.ndungu@example.ke',
    industry: 'cafe',
    businessId: 'ORG-JAVA-COFFEE',
    businessName: 'Java House Artisan Roastery',
    firstVisitDaysAgo: 45,
    lastVisitDaysAgo: 1,
    totalVisits: 14,
    loyaltyPoints: 210,
    marketingConsent: {
      smsOptIn: false,
      whatsAppOptIn: true,
      emailOptIn: true,
      timestamp: '2026-09-12T07:15:00Z',
    },
    customNotes: 'Orders Oat Flat White. Prefers quiet terrace table for laptop work.',
    preferredRoomOrTable: 'Terrace Table 4',
  },
  {
    id: 'JC-019',
    echoId: 'ECHO-10332',
    name: 'Wanjiku Kamau',
    phone: '+254701234567',
    email: 'wanjiku.k@example.ke',
    industry: 'cafe',
    businessId: 'ORG-JAVA-COFFEE',
    businessName: 'Java House Artisan Roastery',
    firstVisitDaysAgo: 30,
    lastVisitDaysAgo: 12,
    totalVisits: 3,
    loyaltyPoints: 45,
    marketingConsent: {
      smsOptIn: true,
      whatsAppOptIn: true,
      emailOptIn: true,
      timestamp: '2026-10-01T08:00:00Z',
    },
    customNotes: 'Usually visits during morning coffee rush.',
    preferredRoomOrTable: 'Booth 2',
  },
];

export interface ReconnectionCampaign {
  id: string;
  name: string;
  targetStage: RetentionClassification;
  channel: 'sms' | 'whatsapp' | 'email';
  subject?: string;
  messageTemplate: string;
  sentCount: number;
  reactivatedCount: number;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
  lastRunDate: string;
}

export const MOCK_CAMPAIGNS: ReconnectionCampaign[] = [
  {
    id: 'CAMP-001',
    name: 'Gentle Cooling VIP Check-in',
    targetStage: 'COOLING',
    channel: 'whatsapp',
    messageTemplate: 'Hello {{name}}, we missed seeing you at {{business_name}}! Next time you drop by, your favorite beverage is on us. Show this message at the front desk.',
    sentCount: 42,
    reactivatedCount: 16,
    status: 'ACTIVE',
    lastRunDate: '2026-10-24',
  },
  {
    id: 'CAMP-002',
    name: 'Seasonal Win-Back Safari Offer',
    targetStage: 'AT_RISK',
    channel: 'email',
    subject: 'We would love to welcome you back to Grand Horizon',
    messageTemplate: 'Dear {{name}}, it has been a while since your stay at Grand Horizon Resort & Spa. We have completed renovations on our coastal wing and would be thrilled to host you with a 20% loyalty guest privilege.',
    sentCount: 18,
    reactivatedCount: 5,
    status: 'ACTIVE',
    lastRunDate: '2026-10-18',
  },
  {
    id: 'CAMP-003',
    name: 'Inactive Customer Re-engagement',
    targetStage: 'INACTIVE',
    channel: 'sms',
    messageTemplate: 'Hi {{name}}, it’s been a while! Grand Horizon welcomes you back with complimentary spa access during your next visit. Reply STOP to opt out.',
    sentCount: 35,
    reactivatedCount: 4,
    status: 'PENDING_APPROVAL',
    lastRunDate: '2026-10-28',
  },
];

export interface BreakGlassAuditEntry {
  id: string;
  timestamp: string;
  operatorEmail: string;
  targetCustomerEchoId: string;
  justification: string;
  ticketId: string;
  status: 'ACTIVE_LEASE' | 'EXPIRED' | 'REVOKED';
  expiresInMinutes: number;
}

export const MOCK_AUDIT_LOGS: BreakGlassAuditEntry[] = [
  {
    id: 'AUD-8821',
    timestamp: '2026-10-31T04:12:00Z',
    operatorEmail: 'superadmin.sec@echo-platform.io',
    targetCustomerEchoId: 'ECHO-10042',
    justification: 'Customer dispute regarding unrecognized SMS verification charge on hotel Wi-Fi gateway.',
    ticketId: 'INC-90412',
    status: 'ACTIVE_LEASE',
    expiresInMinutes: 11,
  },
  {
    id: 'AUD-8819',
    timestamp: '2026-10-30T14:45:00Z',
    operatorEmail: 'tech.lead@echo-platform.io',
    targetCustomerEchoId: 'ECHO-10115',
    justification: 'Captive portal redirection loop investigation on MikroTik firmware v7.14.',
    ticketId: 'INC-90388',
    status: 'EXPIRED',
    expiresInMinutes: 0,
  },
];
