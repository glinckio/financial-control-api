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
  });

  describe('parseDate', () => {
    it('should parse ISO string to Date', () => {
      const dateString = '2024-01-01T12:00:00Z';
      const parsedDate = parseDate(dateString);
      expect(parsedDate).toBeInstanceOf(Date);
      expect(parsedDate.toISOString()).toBe('2024-01-01T12:00:00.000Z');
    });
  });

  describe('isValidDate', () => {
    it('should return true for valid date', () => {
      expect(isValidDate(testDate)).toBe(true);
    });

    it('should return false for invalid date', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
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
  });
});
