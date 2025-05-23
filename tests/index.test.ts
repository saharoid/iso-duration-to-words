import { isoDurationToWords } from '../src';

describe('isoDurationToWords', () => {
  it('converts years and days', () => {
    expect(isoDurationToWords('P3Y6D')).toBe('Three years and six days');
  });

  it('handles full durations', () => {
    expect(isoDurationToWords('P1Y2M3DT4H5M6S')).toBe(
      'One year, two months, three days, four hours, five minutes and six seconds'
    );
  });

  it('handles zero duration', () => {
    expect(isoDurationToWords('P')).toBe('Zero duration');
  });

  it('throws on invalid format', () => {
    expect(() => isoDurationToWords('INVALID')).toThrow();
  });
});
