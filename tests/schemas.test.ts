import { describe, it, expect } from 'vitest';
import {
  TranscribeRequestSchema,
  ChatIntakeRequestSchema,
  ChatSummarizeRequestSchema,
  IntakeRequestSchema,
  GroundAndRouteRequestSchema,
  DraftRequestSchema,
} from '../src/shared/schemas.js';

describe('Zod API Schema Contracts', () => {
  it('validates TranscribeRequestSchema correctly', () => {
    const valid = { audioBase64: 'UklGRi...', mimeType: 'audio/webm' };
    expect(TranscribeRequestSchema.safeParse(valid).success).toBe(true);

    const empty = { audioBase64: '', mimeType: 'audio/webm' };
    expect(TranscribeRequestSchema.safeParse(empty).success).toBe(false);
  });

  it('validates ChatIntakeRequestSchema correctly', () => {
    const valid = {
      messages: [{ role: 'user', content: '축사 악취가 너무 심합니다' }],
    };
    expect(ChatIntakeRequestSchema.safeParse(valid).success).toBe(true);

    const empty = { messages: [] };
    expect(ChatIntakeRequestSchema.safeParse(empty).success).toBe(false);
  });

  it('validates IntakeRequestSchema correctly', () => {
    const valid = {
      text: '대정읍 하모리 악취 민원',
      city: '서귀포시',
      district: '대정읍',
      occurredAt: '2026-11-19T07:30',
    };
    expect(IntakeRequestSchema.safeParse(valid).success).toBe(true);

    const tooShort = { text: 'A' };
    expect(IntakeRequestSchema.safeParse(tooShort).success).toBe(false);
  });

  it('validates GroundAndRouteRequestSchema correctly', () => {
    const valid = {
      sixW: {
        who: '게스트하우스 운영자',
        when: '오전 7시',
        where: '서귀포시 대정읍',
        what: '악취 유입',
        how: '바람타고 유입',
        why: '축사 배출',
      },
      district: '대정읍',
      city: '서귀포시',
      gps: { lat: 33.2264, lng: 126.2512 },
    };
    expect(GroundAndRouteRequestSchema.safeParse(valid).success).toBe(true);
  });
});
