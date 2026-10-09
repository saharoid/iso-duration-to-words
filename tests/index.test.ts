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

  it('handles weeks', () => {
    expect(isoDurationToWords('P2W3D')).toBe('Two weeks and three days');
  });

  it('uses the singular only for one', () => {
    expect(isoDurationToWords('PT1H')).toBe('One hour');
    expect(isoDurationToWords('PT2H')).toBe('Two hours');
  });

  it('tells months and minutes apart', () => {
    expect(isoDurationToWords('P1M')).toBe('One month');
    expect(isoDurationToWords('PT1M')).toBe('One minute');
  });

  it('skips zero-valued units', () => {
    expect(isoDurationToWords('P1Y0M2D')).toBe('One year and two days');
    expect(isoDurationToWords('PT0H30M')).toBe('Thirty minutes');
  });

  it('returns zero duration when every unit is zero', () => {
    expect(isoDurationToWords('P0D')).toBe('Zero duration');
    expect(isoDurationToWords('PT0S')).toBe('Zero duration');
    expect(isoDurationToWords('P0Y0M0DT0H0M0S')).toBe('Zero duration');
  });

  it.each(['P', 'PT', 'P1DT', 'INVALID', '', 'P1.5D', '-P1D', 'p1d'])(
    'throws on invalid input %p',
    input => {
      expect(() => isoDurationToWords(input)).toThrow('Invalid ISO 8601 duration format');
    }
  );
});
