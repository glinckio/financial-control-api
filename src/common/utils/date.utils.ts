export const formatDate = (date: Date): string => {
  return date.toISOString();
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};

export function addDays(date: Date, days: number): Date {
  if (!isValidDate(date)) {
    throw new Error('Invalid date');
  }
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  if (!isValidDate(date)) {
    throw new Error('Invalid date');
  }
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function addYears(date: Date, years: number): Date {
  if (!isValidDate(date)) {
    throw new Error('Invalid date');
  }
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}
