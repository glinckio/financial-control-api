import {
  formatDate,
  parseDate,
  isValidDate,
  addDays,
  addMonths,
  addYears,
} from './date.utils';

describe('Date Utils', () => {
  const testDate = new Date('2024-01-01T12:00:00Z');

  describe('formatDate', () => {
    it('should format date to ISO string', () => {
      expect(formatDate(testDate)).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle dates with milliseconds', () => {
      const dateWithMs = new Date('2024-01-01T12:00:00.123Z');
      expect(formatDate(dateWithMs)).toBe('2024-01-01T12:00:00.123Z');
    });

    it('should handle dates with timezone offset', () => {
      const dateWithOffset = new Date('2024-01-01T12:00:00-05:00');
      expect(formatDate(dateWithOffset)).toBe('2024-01-01T17:00:00.000Z');
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate(new Date('invalid'))).toThrow();
    });
  });

  describe('parseDate', () => {
    it('should parse ISO string to Date', () => {
      const dateString = '2024-01-01T12:00:00Z';
      const parsedDate = parseDate(dateString);
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should parse date string with milliseconds', () => {
      const dateString = '2024-01-01T12:00:00.123Z';
      const parsedDate = parseDate(dateString);
      expect(parsedDate.toISOString()).toBe('2024-01-01T12:00:00.123Z');
    });

    it('should parse date string with timezone offset', () => {
      const dateString = '2024-01-01T12:00:00-05:00';
      const parsedDate = parseDate(dateString);
      expect(parsedDate.toISOString()).toBe('2024-01-01T17:00:00.000Z');
    });

    it('should handle invalid date string', () => {
      const parsedDate = parseDate('invalid');
      expect(isValidDate(parsedDate)).toBe(false);
    });

    it('should handle empty string', () => {
      const parsedDate = parseDate('');
      expect(isValidDate(parsedDate)).toBe(false);
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      expect(isValidDate(testDate)).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });

    it('should return false for non-Date objects', () => {
      expect(isValidDate({} as Date)).toBe(false);
      expect(isValidDate(null as unknown as Date)).toBe(false);
      expect(isValidDate(undefined as unknown as Date)).toBe(false);
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const result = addDays(testDate, 5);
      expect(result.toISOString()).toBe('2024-01-06T12:00:00.000Z');
    });

    it('should subtract days when negative', () => {
      const result = addDays(testDate, -5);
      expect(result.toISOString()).toBe('2023-12-27T12:00:00.000Z');
    });

    it('should handle zero days', () => {
      const result = addDays(testDate, 0);
      expect(result.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle month rollover', () => {
      const result = addDays(new Date('2024-01-31T12:00:00Z'), 1);
      expect(result.toISOString()).toBe('2024-02-01T12:00:00.000Z');
    });

    it('should handle year rollover', () => {
      const result = addDays(new Date('2024-12-31T12:00:00Z'), 1);
      expect(result.toISOString()).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should handle leap year', () => {
      const result = addDays(new Date('2024-02-28T12:00:00Z'), 1);
      expect(result.toISOString()).toBe('2024-02-29T12:00:00.000Z');
    });

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(() => addDays(invalidDate, 1)).toThrow('Invalid date');
    });
  });

  describe('addMonths', () => {
    it('should add months to date', () => {
      const result = addMonths(testDate, 2);
      expect(result.toISOString()).toBe('2024-03-01T12:00:00.000Z');
    });

    it('should subtract months when negative', () => {
      const result = addMonths(testDate, -2);
      expect(result.toISOString()).toBe('2023-11-01T12:00:00.000Z');
    });

    it('should handle zero months', () => {
      const result = addMonths(testDate, 0);
      expect(result.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle year rollover', () => {
      const result = addMonths(new Date('2024-12-01T12:00:00Z'), 1);
      expect(result.toISOString()).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should handle month with fewer days', () => {
      const result = addMonths(new Date('2024-01-31T12:00:00Z'), 1);
      expect(result.toISOString()).toBe('2024-03-02T12:00:00.000Z');
    });

    it('should handle multiple year rollover', () => {
      const result = addMonths(testDate, 24);
      expect(result.toISOString()).toBe('2026-01-01T12:00:00.000Z');
    });

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(() => addMonths(invalidDate, 1)).toThrow('Invalid date');
    });
  });

  describe('addYears', () => {
    it('should add years to date', () => {
      const result = addYears(testDate, 1);
      expect(result.toISOString()).toBe('2025-01-01T12:00:00.000Z');
    });

    it('should subtract years when negative', () => {
      const result = addYears(testDate, -1);
      expect(result.toISOString()).toBe('2023-01-01T12:00:00.000Z');
    });

    it('should handle zero years', () => {
      const result = addYears(testDate, 0);
      expect(result.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should handle leap year date', () => {
      const leapDate = new Date('2024-02-29T12:00:00Z');
      const result = addYears(leapDate, 1);
      expect(result.toISOString()).toBe('2025-03-01T12:00:00.000Z');
    });

    it('should handle multiple years', () => {
      const result = addYears(testDate, 10);
      expect(result.toISOString()).toBe('2034-01-01T12:00:00.000Z');
    });

    it('should throw error for invalid date', () => {
      const invalidDate = new Date('invalid');
      expect(() => addYears(invalidDate, 1)).toThrow('Invalid date');
    });
  });
});
