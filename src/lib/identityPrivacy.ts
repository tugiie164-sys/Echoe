/**
 * ECHO Dual-Identity & Privacy Isolation Engine
 * Enforces strict boundary between Universal Identity and Business-Specific Profiles.
 * Implements consent verification, quiet hours, and PII masking.
 */

export interface UniversalIdentity {
  echoId: string; // e.g. "ECHO-10001"
  email: string;
  phone: string;
  fullName: string;
  accountCreatedAt: string;
  isVerified: boolean;
  globalOptOut: boolean;
}

export interface BusinessProfile {
  businessId: string; // e.g. "ORG-GRAND-HORIZON"
  businessName: string;
  businessCustomerId: string; // e.g. "GH-001"
  echoId: string; // mapped reference
  visitCount: number;
  lastVisitDate: string;
  marketingConsent: {
    smsOptIn: boolean;
    whatsAppOptIn: boolean;
    emailOptIn: boolean;
    consentTimestamp: string;
    consentIp: string;
  };
  customPreferences: Record<string, string>;
  loyaltyPoints: number;
}

/**
 * Validates cross-tenant data isolation:
 * Business A must never access Business B records, even if sharing the same universal echoId.
 */
export function canBusinessAccessCustomerProfile(
  requestingBusinessId: string,
  targetProfile: BusinessProfile
): boolean {
  return requestingBusinessId === targetProfile.businessId;
}

/**
 * Validates whether a reconnection communication can be sent:
 * 1. Must not have universal opt-out.
 * 2. Must have explicit business-specific consent for channel.
 * 3. Must not violate quiet hours (21:00 to 08:00 local time).
 * 4. Must satisfy frequency cap (e.g., minimum days between messages).
 */
export interface CommunicationCheckParams {
  universalOptOut: boolean;
  channel: 'sms' | 'whatsapp' | 'email';
  businessConsent: BusinessProfile['marketingConsent'];
  currentLocalHour: number; // 0 to 23
  daysSinceLastOutreach: number;
  frequencyCapDays: number;
}

export interface CommunicationCheckResult {
  allowed: boolean;
  reason: string;
}

export function validateReconnectionCommunication(
  params: CommunicationCheckParams
): CommunicationCheckResult {
  const { universalOptOut, channel, businessConsent, currentLocalHour, daysSinceLastOutreach, frequencyCapDays } = params;

  if (universalOptOut) {
    return {
      allowed: false,
      reason: 'Blocked by Universal Account global communication opt-out preference.',
    };
  }

  // Check channel consent
  if (channel === 'sms' && !businessConsent.smsOptIn) {
    return { allowed: false, reason: 'Customer has not granted SMS marketing consent for this business.' };
  }
  if (channel === 'whatsapp' && !businessConsent.whatsAppOptIn) {
    return { allowed: false, reason: 'Customer has not granted WhatsApp marketing consent for this business.' };
  }
  if (channel === 'email' && !businessConsent.emailOptIn) {
    return { allowed: false, reason: 'Customer has not granted Email marketing consent for this business.' };
  }

  // Check quiet hours (21:00 / 9 PM to 08:00 / 8 AM)
  if (currentLocalHour >= 21 || currentLocalHour < 8) {
    return {
      allowed: false,
      reason: `Blocked by quiet hours policy (Current hour: ${currentLocalHour}:00. Allowed window: 08:00 - 20:59).`,
    };
  }

  // Check frequency cap
  if (daysSinceLastOutreach < frequencyCapDays) {
    return {
      allowed: false,
      reason: `Frequency cap exceeded. Last message sent ${daysSinceLastOutreach} days ago (minimum required interval: ${frequencyCapDays} days).`,
    };
  }

  return {
    allowed: true,
    reason: 'Compliant with Kenya DPA 2019, quiet hours, channel consent, and frequency cap.',
  };
}

/**
 * Masks Personally Identifiable Information (PII) for privileged Super Admin infrastructure view
 * unless an authorized break-glass reason is explicitly validated.
 */
export function maskPII(
  value: string,
  type: 'phone' | 'email' | 'name',
  isPrivilegedBreakGlass: boolean = false
): string {
  if (isPrivilegedBreakGlass) {
    return value;
  }

  if (type === 'phone') {
    // e.g. "+254712345678" -> "+254 ••• ••78"
    if (value.length < 6) return '••••••';
    const start = value.slice(0, 4);
    const end = value.slice(-2);
    return `${start} ••• ••${end}`;
  }

  if (type === 'email') {
    // e.g. "james.ndungu@example.com" -> "j•••@e••••.com"
    const parts = value.split('@');
    if (parts.length !== 2) return '••••@••••.com';
    const user = parts[0];
    const domain = parts[1];
    const maskedUser = user[0] + '•••';
    const domainParts = domain.split('.');
    const maskedDomain = domainParts[0][0] + '••••.' + domainParts.slice(1).join('.');
    return `${maskedUser}@${maskedDomain}`;
  }

  if (type === 'name') {
    const names = value.trim().split(' ');
    return names.map(n => n[0] + '••••').join(' ');
  }

  return '••••••';
}
