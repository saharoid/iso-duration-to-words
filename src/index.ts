import numWords from 'num-words';

/**
 * Converts an ISO-8601 duration string to a human-readable sentence.
 * Example: 'P3Y6D' => 'Three years and six days'
 */
export function isoDurationToWords(duration: string): string {
  const regex = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)W)?(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const match = duration.match(regex);

  // ISO 8601 requires at least one component, and a 'T' must be followed by one.
  if (!match || duration === 'P' || duration.endsWith('T')) {
    throw new Error('Invalid ISO 8601 duration format');
  }

  const [ , years, months, weeks, days, hours, minutes, seconds ] = match;

  const units = [
    { value: years, singular: 'year' },
    { value: months, singular: 'month' },
    { value: weeks, singular: 'week' },
    { value: days, singular: 'day' },
    { value: hours, singular: 'hour' },
    { value: minutes, singular: 'minute' },
    { value: seconds, singular: 'second' },
  ];

  const parts = units
    .filter(unit => unit.value !== undefined && parseInt(unit.value, 10) !== 0)
    .map(unit => {
      const n = parseInt(unit.value!, 10);
      const word = numWords(n); // keep it lowercase
      return `${word} ${unit.singular}${n === 1 ? '' : 's'}`;
    });

  if (parts.length === 0) return 'Zero duration';
  if (parts.length === 1) return capitalize(parts[0]);

  const last = parts.pop();
  const result = parts.join(', ') + ' and ' + last;
  return capitalize(result);
}

// Helper to capitalize only the first letter
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
