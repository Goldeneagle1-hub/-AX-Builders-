import { describe, it, expect } from 'vitest';
import { resolveWeatherQueryMode, findClosestHourlyIndex } from '../src/server/weather.js';

describe('Immediate (Realtime) vs Post-Incident (Historical) Weather Mode', () => {
  it('selects realtime mode when occurredAt is within 1 hour of now', () => {
    const now = Date.parse('2026-11-20T11:00:00');
    const res = resolveWeatherQueryMode('2026-11-20T10:30:00', now);
    expect(res.mode).toBe('realtime');
    expect(res.pastDays).toBe(0);
  });

  it('selects historical mode when occurredAt is several hours or days in the past', () => {
    const now = Date.parse('2026-11-20T15:00:00');
    // 8 hours ago
    const res8h = resolveWeatherQueryMode('2026-11-20T07:00:00', now);
    expect(res8h.mode).toBe('historical');
    expect(res8h.pastDays).toBe(1);

    // 3 days + 7 hours ago -> ceil = 4 past_days
    const res3d = resolveWeatherQueryMode('2026-11-17T08:00:00', now);
    expect(res3d.mode).toBe('historical');
    expect(res3d.pastDays).toBe(4);
  });

  it('finds closest hourly slot for post-incident timestamp', () => {
    const times = [
      '2026-11-20T06:00',
      '2026-11-20T07:00',
      '2026-11-20T08:00',
      '2026-11-20T09:00',
    ];
    expect(findClosestHourlyIndex(times, '2026-11-20T07:20')).toBe(1);
    expect(findClosestHourlyIndex(times, '2026-11-20T07:45')).toBe(2);
  });
});
