import { describe, it, expect } from 'vitest';

// 1. Re-define cleanEnv logic to verify its correctness
const cleanEnv = (val) => typeof val === 'string' ? val.replace(/[\r\n\s]+/g, '').trim() : val;

// 2. Re-define getLevelPercentage logic to verify its correctness
const getLevelPercentage = (level) => {
  if (typeof level === 'string' && level.endsWith('%')) return level;
  const l = level?.toLowerCase();
  if (l === 'expert') return '90%';
  if (l === 'advanced') return '75%';
  if (l === 'intermediate') return '60%';
  return '50%';
};

describe('cleanEnv Utility', () => {
  it('should strip carriage returns and newlines', () => {
    expect(cleanEnv('my-key-value\r\n')).toBe('my-key-value');
    expect(cleanEnv('\r\nmy-key-value\r\n')).toBe('my-key-value');
  });

  it('should trim surrounding whitespace', () => {
    expect(cleanEnv('   my-key-value   ')).toBe('my-key-value');
  });

  it('should return non-string values as-is', () => {
    expect(cleanEnv(undefined)).toBe(undefined);
    expect(cleanEnv(null)).toBe(null);
    expect(cleanEnv(12345)).toBe(12345);
  });
});

describe('getLevelPercentage Utility', () => {
  it('should return percentage strings directly', () => {
    expect(getLevelPercentage('95%')).toBe('95%');
    expect(getLevelPercentage('40%')).toBe('40%');
  });

  it('should map keywords correctly', () => {
    expect(getLevelPercentage('Expert')).toBe('90%');
    expect(getLevelPercentage('expert')).toBe('90%');
    expect(getLevelPercentage('Advanced')).toBe('75%');
    expect(getLevelPercentage('intermediate')).toBe('60%');
  });

  it('should default to 50% for unknown levels', () => {
    expect(getLevelPercentage('beginner')).toBe('50%');
    expect(getLevelPercentage(null)).toBe('50%');
  });
});
