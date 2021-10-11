import { buildComputeIsDateAvailable } from './buildComputeIsDateAvailable';

describe('buildComputeIsDateAvailable', () => {
  it('should return true if date is within range', () => {
    const min = new Date(2021, 9, 1, 12, 0, 0).getTime();
    const max = new Date(2021, 9, 5, 12, 0, 0).getTime();
    const extremumAvailableDates = { min, max };

    const computeIsDateAvailable = buildComputeIsDateAvailable(extremumAvailableDates);

    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 1 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 3 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 5 })).toBe(true);
  });

  it('should return true if date is within range with no max value', () => {
    const min = new Date(2021, 9, 1, 12, 0, 0).getTime();
    const max = undefined;
    const extremumAvailableDates = { min, max };

    const computeIsDateAvailable = buildComputeIsDateAvailable(extremumAvailableDates);

    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 1 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 3 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 8, dayOfMonth: 30 })).toBe(false);
  });

  it('should return true if date is within range with no min value', () => {
    const min = undefined;
    const max = new Date(2021, 9, 5, 12, 0, 0).getTime();
    const extremumAvailableDates = { min, max };

    const computeIsDateAvailable = buildComputeIsDateAvailable(extremumAvailableDates);

    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 3 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 5 })).toBe(true);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 6 })).toBe(false);
  });

  it('should return false if no extreme values', () => {
    const extremumAvailableDates = { min: undefined, max: undefined };

    const computeIsDateAvailable = buildComputeIsDateAvailable(extremumAvailableDates);

    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 3 })).toBe(false);
  });

  it('should return false if date is not within range', () => {
    const min = new Date(2021, 9, 1, 12, 0, 0).getTime();
    const max = new Date(2021, 9, 5, 12, 0, 0).getTime();
    const extremumAvailableDates = { min, max };

    const computeIsDateAvailable = buildComputeIsDateAvailable(extremumAvailableDates);

    expect(computeIsDateAvailable({ year: 2021, month: 8, dayOfMonth: 30 })).toBe(false);
    expect(computeIsDateAvailable({ year: 2021, month: 9, dayOfMonth: 6 })).toBe(false);
  });
});
