export const parsePrice = (value: string | number): number => {
    if (typeof value === 'number') return value;
    return parseFloat(value.replace(/,/g, ''));
  };