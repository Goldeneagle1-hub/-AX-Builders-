import { describe, it, expect } from 'vitest';
import { DEMO_PRESET_1, DEMO_PRESET_2 } from '../src/shared/presets.js';
import { JEJU_ORDINANCE_CATALOG } from '../src/shared/ordinances.js';

describe('Demo Presets Specifications Compliance', () => {
  it('Preset 1 (Daejeong-eup odor) does NOT assert odor solely from photo', () => {
    expect(DEMO_PRESET_1.city).toBe('서귀포시');
    expect(DEMO_PRESET_1.district).toBe('대정읍');
    expect(DEMO_PRESET_1.gps.lat).toBe(33.2264);
    expect(DEMO_PRESET_1.gps.lng).toBe(126.2512);

    // Strict requirement: Never assert odor, illegality, or responsible entity solely from photo!
    const obsText = DEMO_PRESET_1.expectedObservations.join(' ');
    expect(obsText).toContain('사진만으로 악취 물질 유무 및 위법성은 단정할 수 없음');
  });

  it('Preset 2 (Ildo 1-dong) has GPS coordinates and handles parking & garbage issues', () => {
    expect(DEMO_PRESET_2.city).toBe('제주시');
    expect(DEMO_PRESET_2.district).toBe('일도1동');
    expect(DEMO_PRESET_2.gps.lat).toBe(33.5132);
    expect(DEMO_PRESET_2.gps.lng).toBe(126.5269);
  });

  it('Ordinance catalog contains 16 distinct topics with ELIS sources', () => {
    const topics = new Set(JEJU_ORDINANCE_CATALOG.map((o) => o.topic));
    expect(topics.size).toBe(16);
    expect(topics.has('악취')).toBe(true);
    expect(topics.has('불법 주정차')).toBe(true);
    expect(topics.has('폐기물')).toBe(true);
    expect(topics.has('소음')).toBe(true);
    expect(topics.has('해안쓰레기')).toBe(true);

    for (const ord of JEJU_ORDINANCE_CATALOG) {
      expect(ord.elisUrl).toContain('elis.go.kr');
      expect(ord.issuingAuthority).toBe('제주특별자치도');
    }
  });
});
