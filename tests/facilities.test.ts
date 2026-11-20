import { describe, it, expect } from 'vitest';
import { haversineMeters, matchFacilities } from '../src/shared/facilities.js';

describe('GPS Haversine Distance & Jeju Facility Matching', () => {
  it('computes accurate Haversine distance in meters', () => {
    // Same point -> 0m
    expect(haversineMeters(33.5132, 126.5269, 33.5132, 126.5269)).toBe(0);
    // Approx 111m per 0.001 degree latitude
    const dist = haversineMeters(33.5132, 126.5269, 33.5142, 126.5269);
    expect(dist).toBeGreaterThan(100);
    expect(dist).toBeLessThan(125);
  });

  it('matches facilities dynamically by GPS coordinates for Yeondong', () => {
    const matches = matchFacilities('연동', { lat: 33.4895, lng: 126.4908 });
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].name).toContain('연동');
    expect(matches[0].distanceMeter).toBeLessThan(500);
  });

  it('falls back to district name matching when GPS is absent', () => {
    const matches = matchFacilities('성산읍');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].name).toContain('성산');
  });

  it('includes public parking lots (공영주차장) in Ildo1-dong matches', () => {
    const matches = matchFacilities('일도1동', { lat: 33.5132, lng: 126.5269 });
    const hasParkingLot = matches.some((m) => m.category === '공영주차장');
    expect(hasParkingLot).toBe(true);
  });
});
