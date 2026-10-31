/**
 * ECHO Customer Retention Intelligence Engine
 * Configurable algorithmic classification and return-cadence analysis.
 */

export type IndustryType = 'cafe' | 'restaurant' | 'hotel' | 'safari_lodge' | 'retail';

export type RetentionClassification =
  | 'NEW'
  | 'ACTIVE'
  | 'LOYAL'
  | 'RETURNING'
  | 'COOLING'
  | 'AT_RISK'
  | 'INACTIVE'
  | 'POTENTIALLY_LOST';

export interface RetentionThresholds {
  expectedReturnDays: number;
  coolingDays: number;
  atRiskDays: number;
  inactiveDays: number;
  potentiallyLostDays: number;
  loyalVisitCountMin: number;
}

export const INDUSTRY_DEFAULTS: Record<IndustryType, RetentionThresholds> = {
  cafe: {
    expectedReturnDays: 4,
    coolingDays: 7,
    atRiskDays: 14,
    inactiveDays: 30,
    potentiallyLostDays: 60,
    loyalVisitCountMin: 5,
  },
  restaurant: {
    expectedReturnDays: 14,
    coolingDays: 28,
    atRiskDays: 45,
    inactiveDays: 90,
    potentiallyLostDays: 180,
    loyalVisitCountMin: 4,
  },
  hotel: {
    expectedReturnDays: 90,
    coolingDays: 180,
    atRiskDays: 270,
    inactiveDays: 365,
    potentiallyLostDays: 540,
    loyalVisitCountMin: 3,
  },
  safari_lodge: {
    expectedReturnDays: 365,
    coolingDays: 450,
    atRiskDays: 600,
    inactiveDays: 730,
    potentiallyLostDays: 1095,
    loyalVisitCountMin: 2,
  },
  retail: {
    expectedReturnDays: 10,
    coolingDays: 20,
    atRiskDays: 35,
    inactiveDays: 60,
    potentiallyLostDays: 120,
    loyalVisitCountMin: 4,
  },
};

export interface CustomerVisitData {
  totalVisits: number;
  daysSinceLastVisit: number;
  daysBetweenVisits?: number[]; // historical intervals
  firstVisitDaysAgo: number;
  previousClassification?: RetentionClassification;
}

export interface ClassificationResult {
  classification: RetentionClassification;
  reason: string;
  recommendedAction: string;
  retentionScore: number; // 0-100
  daysUntilNextThreshold: number;
}

export function classifyCustomerRetention(
  visit: CustomerVisitData,
  industry: IndustryType = 'cafe',
  customThresholds?: Partial<RetentionThresholds>
): ClassificationResult {
  const thresholds: RetentionThresholds = {
    ...INDUSTRY_DEFAULTS[industry],
    ...(customThresholds || {}),
  };

  const { totalVisits, daysSinceLastVisit, firstVisitDaysAgo, previousClassification } = visit;

  // 1. NEW: Single visit within expected initial onboarding window
  if (totalVisits === 1 && firstVisitDaysAgo <= thresholds.coolingDays) {
    return {
      classification: 'NEW',
      reason: `First visit recorded ${daysSinceLastVisit} day(s) ago. Still within initial onboarding window of ${thresholds.coolingDays} days.`,
      recommendedAction: 'Send warm welcome & introductory brand benefits before cooling threshold.',
      retentionScore: 70,
      daysUntilNextThreshold: Math.max(0, thresholds.coolingDays - daysSinceLastVisit),
    };
  }

  // Check if returning from previous dormancy
  if (
    daysSinceLastVisit <= thresholds.expectedReturnDays &&
    (previousClassification === 'INACTIVE' || previousClassification === 'POTENTIALLY_LOST' || previousClassification === 'AT_RISK')
  ) {
    return {
      classification: 'RETURNING',
      reason: `Customer re-authenticated after a period of dormancy (${daysSinceLastVisit} days since latest visit).`,
      recommendedAction: 'Acknowledge return, deliver personalized reconnect gratitude perk.',
      retentionScore: 82,
      daysUntilNextThreshold: Math.max(0, thresholds.coolingDays - daysSinceLastVisit),
    };
  }

  // 2. LOYAL: High visit frequency exceeding threshold and actively visiting
  if (totalVisits >= thresholds.loyalVisitCountMin && daysSinceLastVisit <= thresholds.expectedReturnDays) {
    return {
      classification: 'LOYAL',
      reason: `Recorded ${totalVisits} visits (min threshold: ${thresholds.loyalVisitCountMin}) and returned within ${daysSinceLastVisit} days (cadence: ${thresholds.expectedReturnDays}d).`,
      recommendedAction: 'Recognize status with VIP loyalty perks, surprise recognition on Wi-Fi portal.',
      retentionScore: 95,
      daysUntilNextThreshold: Math.max(0, thresholds.coolingDays - daysSinceLastVisit),
    };
  }

  // 3. ACTIVE: Multiple visits, within expected return interval
  if (daysSinceLastVisit <= thresholds.expectedReturnDays) {
    return {
      classification: 'ACTIVE',
      reason: `Visited ${daysSinceLastVisit} day(s) ago, safely inside the expected return cadence of ${thresholds.expectedReturnDays} days.`,
      recommendedAction: 'Maintain current cadence, standard hospitality service.',
      retentionScore: 88,
      daysUntilNextThreshold: Math.max(0, thresholds.coolingDays - daysSinceLastVisit),
    };
  }

  // 4. COOLING: Past expected return days but below atRiskDays
  if (daysSinceLastVisit <= thresholds.coolingDays) {
    return {
      classification: 'COOLING',
      reason: `Last visit was ${daysSinceLastVisit} days ago; exceeding normal interval of ${thresholds.expectedReturnDays}d, entering cooling stage.`,
      recommendedAction: 'Queue gentle nudge campaign or new menu/amenity update.',
      retentionScore: 65,
      daysUntilNextThreshold: Math.max(0, thresholds.atRiskDays - daysSinceLastVisit),
    };
  }

  // 5. AT_RISK: Exceeded coolingDays, nearing inactive threshold
  if (daysSinceLastVisit <= thresholds.atRiskDays) {
    return {
      classification: 'AT_RISK',
      reason: `Last visit was ${daysSinceLastVisit} days ago (exceeds cooling limit of ${thresholds.coolingDays}d). Engagement sharply dropping.`,
      recommendedAction: 'Trigger high-priority retention message or tailored incentive before dormancy.',
      retentionScore: 45,
      daysUntilNextThreshold: Math.max(0, thresholds.inactiveDays - daysSinceLastVisit),
    };
  }

  // 6. INACTIVE: Exceeded atRiskDays but within long-term lost threshold
  if (daysSinceLastVisit < thresholds.potentiallyLostDays) {
    return {
      classification: 'INACTIVE',
      reason: `Dormant for ${daysSinceLastVisit} days (inactive threshold: ${thresholds.inactiveDays}d). No authenticated Wi-Fi sessions.`,
      recommendedAction: 'Scheduled reactivation campaign with manager approval via preferred channel.',
      retentionScore: 25,
      daysUntilNextThreshold: Math.max(0, thresholds.potentiallyLostDays - daysSinceLastVisit),
    };
  }

  // 7. POTENTIALLY_LOST: Exceeded long-term threshold
  return {
    classification: 'POTENTIALLY_LOST',
    reason: `Inactive for ${daysSinceLastVisit} days, exceeding the ${thresholds.potentiallyLostDays}-day long-term inactivity threshold.`,
    recommendedAction: 'Special win-back campaign with high-value offer or respect customer disengagement.',
    retentionScore: 10,
    daysUntilNextThreshold: 0,
  };
}
