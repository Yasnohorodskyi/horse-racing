import { formatRoundLabel } from '@/utils/format';

describe('formatRoundLabel', () => {
  it('formats round label with ordinal suffix', () => {
    expect(formatRoundLabel(0, 1200)).toBe('1st Lap - 1200m');
    expect(formatRoundLabel(1, 1400)).toBe('2nd Lap - 1400m');
    expect(formatRoundLabel(2, 1600)).toBe('3rd Lap - 1600m');
    expect(formatRoundLabel(3, 1800)).toBe('4th Lap - 1800m');
  });
});
