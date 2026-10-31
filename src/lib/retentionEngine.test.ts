import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyCustomerRetention } from './retentionEngine';

test('classifies brand new customer as NEW', () => {
  const result = classifyCustomerRetention(
    {
      totalVisits: 1,
      daysSinceLastVisit: 2,
      firstVisitDaysAgo: 2,
    },
    'cafe'
  );
  assert.equal(result.classification, 'NEW');
  assert.equal(result.retentionScore, 70);
});

test('classifies high-frequency recent visitor as LOYAL', () => {
  const result = classifyCustomerRetention(
    {
      totalVisits: 8,
      daysSinceLastVisit: 2,
      firstVisitDaysAgo: 60,
    },
    'cafe'
  );
  assert.equal(result.classification, 'LOYAL');
  assert.equal(result.retentionScore, 95);
});

test('classifies cooling customer correctly when past return cadence', () => {
  const result = classifyCustomerRetention(
    {
      totalVisits: 4,
      daysSinceLastVisit: 6,
      firstVisitDaysAgo: 45,
    },
    'cafe'
  );
  assert.equal(result.classification, 'COOLING');
});

test('classifies at-risk customer in cafe context (10 days since visit)', () => {
  const result = classifyCustomerRetention(
    {
      totalVisits: 4,
      daysSinceLastVisit: 10,
      firstVisitDaysAgo: 45,
    },
    'cafe'
  );
  assert.equal(result.classification, 'AT_RISK');
});

test('adjusts thresholds dynamically for hotel vs cafe', () => {
  // 60 days in a cafe is POTENTIALLY_LOST, but in a hotel it is ACTIVE (normal cadence)
  const cafeResult = classifyCustomerRetention(
    {
      totalVisits: 2,
      daysSinceLastVisit: 60,
      firstVisitDaysAgo: 100,
    },
    'cafe'
  );
  const hotelResult = classifyCustomerRetention(
    {
      totalVisits: 2,
      daysSinceLastVisit: 60,
      firstVisitDaysAgo: 100,
    },
    'hotel'
  );

  assert.equal(cafeResult.classification, 'POTENTIALLY_LOST');
  assert.equal(hotelResult.classification, 'ACTIVE');
});

test('handles returning customer after previous dormancy', () => {
  const result = classifyCustomerRetention(
    {
      totalVisits: 5,
      daysSinceLastVisit: 1,
      firstVisitDaysAgo: 120,
      previousClassification: 'INACTIVE',
    },
    'restaurant'
  );
  assert.equal(result.classification, 'RETURNING');
  assert.equal(result.retentionScore, 82);
});
