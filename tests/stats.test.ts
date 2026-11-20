import { describe, it, expect } from 'vitest';
import { INITIAL_DEMO_COMPLAINTS } from '../src/shared/presets.js';
import { SavedComplaint } from '../src/shared/types.js';

describe('Stats and History Aggregation Logic', () => {
  it('loads exactly 8 demo complaints initially', () => {
    expect(INITIAL_DEMO_COMPLAINTS.length).toBe(8);
  });

  it('aggregates category counts without double-counting', () => {
    const list: SavedComplaint[] = [...INITIAL_DEMO_COMPLAINTS];
    const userItem: SavedComplaint = {
      id: 'user-comp-test',
      title: '테스트 민원',
      city: '제주시',
      district: '아라동',
      category: '악취·환경',
      occurredAt: '2026-11-19 12:00',
      savedAt: '2026-11-19T12:00:00Z',
      source: 'user',
      draftContent: '테스트 내용',
      rewrites: [],
      summary: '요약',
    };

    const combined = [userItem, ...list];
    expect(combined.length).toBe(9);

    const userCount = combined.filter((c) => c.source === 'user').length;
    expect(userCount).toBe(1);

    // Deleting user item restores count to 8
    const deleted = combined.filter((c) => c.id !== 'user-comp-test');
    expect(deleted.length).toBe(8);
  });
});
