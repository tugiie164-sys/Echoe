import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canBusinessAccessCustomerProfile,
  validateReconnectionCommunication,
  maskPII,
  BusinessProfile,
} from './identityPrivacy';

const mockProfileA: BusinessProfile = {
  businessId: 'ORG-HOTEL-HORIZON',
  businessName: 'Grand Horizon Hotel',
  businessCustomerId: 'GH-001',
  echoId: 'ECHO-10001',
  visitCount: 6,
  lastVisitDate: '2026-10-15',
  marketingConsent: {
    smsOptIn: true,
    whatsAppOptIn: false,
    emailOptIn: true,
    consentTimestamp: '2026-09-01T10:00:00Z',
    consentIp: '197.232.1.10',
  },
  customPreferences: { roomType: 'Sea Facing' },
  loyaltyPoints: 450,
};

test('strictly forbids Business B from accessing Business A profile', () => {
  const allowed = canBusinessAccessCustomerProfile('ORG-JAVA-COFFEE', mockProfileA);
  assert.equal(allowed, false);
});

test('permits Business A to access its own customer profile', () => {
  const allowed = canBusinessAccessCustomerProfile('ORG-HOTEL-HORIZON', mockProfileA);
  assert.equal(allowed, true);
});

test('blocks outreach when quiet hours are active (e.g. 22:00 at night)', () => {
  const result = validateReconnectionCommunication({
    universalOptOut: false,
    channel: 'sms',
    businessConsent: mockProfileA.marketingConsent,
    currentLocalHour: 22,
    daysSinceLastOutreach: 20,
    frequencyCapDays: 14,
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /quiet hours/i);
});

test('blocks outreach when channel consent is false (WhatsApp)', () => {
  const result = validateReconnectionCommunication({
    universalOptOut: false,
    channel: 'whatsapp',
    businessConsent: mockProfileA.marketingConsent, // whatsAppOptIn is false
    currentLocalHour: 14,
    daysSinceLastOutreach: 20,
    frequencyCapDays: 14,
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /WhatsApp marketing consent/i);
});

test('blocks outreach when frequency cap is not satisfied', () => {
  const result = validateReconnectionCommunication({
    universalOptOut: false,
    channel: 'sms',
    businessConsent: mockProfileA.marketingConsent,
    currentLocalHour: 14,
    daysSinceLastOutreach: 5,
    frequencyCapDays: 14,
  });
  assert.equal(result.allowed, false);
  assert.match(result.reason, /Frequency cap exceeded/i);
});

test('permits outreach when all regulatory and policy conditions are met', () => {
  const result = validateReconnectionCommunication({
    universalOptOut: false,
    channel: 'sms',
    businessConsent: mockProfileA.marketingConsent,
    currentLocalHour: 11,
    daysSinceLastOutreach: 16,
    frequencyCapDays: 14,
  });
  assert.equal(result.allowed, true);
});

test('masks PII by default and unmasks only during privileged break-glass', () => {
  const phone = '+254712345678';
  const email = 'james.ndungu@example.com';
  
  const maskedPhone = maskPII(phone, 'phone', false);
  const maskedEmail = maskPII(email, 'email', false);

  assert.equal(maskedPhone, '+254 ••• ••78');
  assert.equal(maskedEmail, 'j•••@e••••.com');

  // Privileged break glass audit access
  const unmaskedPhone = maskPII(phone, 'phone', true);
  assert.equal(unmaskedPhone, phone);
});
