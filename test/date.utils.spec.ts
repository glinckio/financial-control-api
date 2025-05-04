import {
  formatDate,
  parseDate,
  isValidDate,
  addDays,
  addMonths,
  addYears,
} from '../src/common/utils/date.utils';

describe('Date Utils', () => {
  describe('formatDate', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      expect(formatDate(date)).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle different dates', () => {
      const date = new Date('2024-12-31T23:59:59Z');
      expect(formatDate(date)).toBe('2024-12-31T23:59:59.000Z');
    });

    it('should handle dates with milliseconds', () => {
      const date = new Date('2024-01-01T12:00:00.123Z');
      expect(formatDate(date)).toBe('2024-01-01T12:00:00.123Z');
    });

    it('should handle dates in different timezones', () => {
      const date = new Date('2024-01-01T12:00:00+02:00');
      expect(formatDate(date)).toBe(date.toISOString());
    });

    it('should throw error for invalid date', () => {
      const date = new Date('invalid-date');
      expect(() => formatDate(date)).toThrow();
    });
  });

  describe('parseDate', () => {
    it('should parse valid date string', () => {
      const dateString = '2024-01-01T12:00:00Z';
      const result = parseDate(dateString);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle different date formats', () => {
      const dateString = '2024-12-31T23:59:59Z';
      const result = parseDate(dateString);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString()).toBe('2024-12-31T23:59:59.000Z');
    });

    it('should handle date strings with milliseconds', () => {
      const dateString = '2024-01-01T12:00:00.123Z';
      const result = parseDate(dateString);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString()).toBe('2024-01-01T12:00:00.123Z');
    });

    it('should handle date strings in different timezones', () => {
      const dateString = '2024-01-01T12:00:00+02:00';
      const result = parseDate(dateString);
      expect(result instanceof Date).toBe(true);
      expect(result.toISOString()).toBe(new Date(dateString).toISOString());
    });

    it('should throw error for invalid date string', () => {
      expect(() => parseDate('invalid-date')).toThrow();
    });

    it('should throw error for empty string', () => {
      expect(() => parseDate('')).toThrow();
    });

    it('should throw error for null or undefined', () => {
      expect(() => parseDate(null as any)).toThrow();
      expect(() => parseDate(undefined as any)).toThrow();
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      expect(isValidDate(date)).toBe(true);
    });

    it('should return false for invalid date', () => {
      const date = new Date('invalid-date');
      expect(isValidDate(date)).toBe(false);
    });

    it('should return false for non-date object', () => {
      expect(isValidDate(null as any)).toBe(false);
      expect(isValidDate(undefined as any)).toBe(false);
      expect(isValidDate('2024-01-01' as any)).toBe(false);
      expect(isValidDate(123 as any)).toBe(false);
      expect(isValidDate({} as any)).toBe(false);
      expect(isValidDate([] as any)).toBe(false);
    });

    it('should handle dates with different formats', () => {
      expect(isValidDate(new Date('2024-01-01'))).toBe(true);
      expect(isValidDate(new Date('2024/01/01'))).toBe(true);
      expect(isValidDate(new Date('01/01/2024'))).toBe(true);
    });
  });

  describe('addDays', () => {
    it('should add positive number of days', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addDays(date, 5);
      expect(result.toISOString()).toBe('2024-01-06T12:00:00.000Z');
    });

    it('should add negative number of days', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addDays(date, -5);
      expect(result.toISOString()).toBe('2023-12-27T12:00:00.000Z');
    });

    it('should handle month/year boundaries', () => {
      const date = new Date('2024-01-31T12:00:00Z');
      const result = addDays(date, 1);
      expect(result.toISOString()).toBe('2024-02-01T12:00:00.000Z');
    });

    it('should handle leap years', () => {
      const date = new Date('2024-02-28T12:00:00Z');
      const result = addDays(date, 1);
      expect(result.toISOString()).toBe('2024-02-29T12:00:00.000Z');
    });

    it('should handle large number of days', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addDays(date, 365);
      expect(result.toISOString()).toBe('2024-12-31T12:00:00.000Z');
    });

    it('should preserve time when adding days', () => {
      const date = new Date('2024-01-01T12:34:56.789Z');
      const result = addDays(date, 1);
      expect(result.toISOString()).toBe('2024-01-02T12:34:56.789Z');
    });
  });

  describe('addMonths', () => {
    it('should add positive number of months', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addMonths(date, 2);
      expect(result.toISOString()).toBe('2024-03-01T12:00:00.000Z');
    });

    it('should add negative number of months', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addMonths(date, -2);
      expect(result.toISOString()).toBe('2023-11-01T12:00:00.000Z');
    });

    it('should handle year boundaries', () => {
      const date = new Date('2024-12-01T12:00:00Z');
      const result = addMonths(date, 1);
      expect(result.toISOString()).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should handle months with different number of days', () => {
      const date = new Date('2024-01-31T12:00:00Z');
      const result = addMonths(date, 1);
      expect(result.toISOString()).toBe('2024-02-29T12:00:00.000Z');
    });

    it('should handle large number of months', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addMonths(date, 24);
      expect(result.toISOString()).toBe('2026-01-01T12:00:00.000Z');
    });

    it('should preserve time when adding months', () => {
      const date = new Date('2024-01-01T12:34:56.789Z');
      const result = addMonths(date, 1);
      expect(result.toISOString()).toBe('2024-02-01T12:34:56.789Z');
    });
  });

  describe('addYears', () => {
    it('should add positive number of years', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addYears(date, 2);
      expect(result.toISOString()).toBe('2026-01-01T12:00:00.000Z');
    });

    it('should add negative number of years', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addYears(date, -2);
      expect(result.toISOString()).toBe('2022-01-01T12:00:00.000Z');
    });

    it('should handle leap years', () => {
      const date = new Date('2024-02-29T12:00:00Z');
      const result = addYears(date, 1);
      expect(result.toISOString()).toBe('2025-02-28T12:00:00.000Z');
    });

    it('should handle large number of years', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const result = addYears(date, 100);
      expect(result.toISOString()).toBe('2124-01-01T12:00:00.000Z');
    });

    it('should preserve time when adding years', () => {
      const date = new Date('2024-01-01T12:34:56.789Z');
      const result = addYears(date, 1);
      expect(result.toISOString()).toBe('2025-01-01T12:34:56.789Z');
    });

    it('should handle century boundaries', () => {
      const date = new Date('2099-12-31T12:00:00Z');
      const result = addYears(date, 1);
      expect(result.toISOString()).toBe('2100-12-31T12:00:00.000Z');
    });
  });
});
