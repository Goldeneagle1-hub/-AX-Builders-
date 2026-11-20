import { describe, it, expect } from 'vitest';
import { detectPII, maskPII } from '../src/client/utils/pii.js';

describe('PII Detection & Masking Utility', () => {
  it('detects Korean phone numbers, RRN, emails, and vehicle license plates', () => {
    const sample =
      '신청인 연락처는 010-1234-5678이고 이메일은 test@jeju.kr입니다. 차량 12가3456이 주차되어 있으며 번호 900101-1234567은 비공개입니다.';
    const matches = detectPII(sample);

    const types = matches.map((m) => m.type);
    expect(types).toContain('전화번호');
    expect(types).toContain('이메일');
    expect(types).toContain('차량번호');
    expect(types).toContain('주민등록번호');
  });

  it('masks all detected PII cleanly without altering surrounding text', () => {
    const sample = '연락처 010-9876-5432, 차량 123나4567 불법주차';
    const masked = maskPII(sample);

    expect(masked).toContain('[연락처 비공개]');
    expect(masked).toContain('[차량번호 비공개]');
    expect(masked).not.toContain('010-9876-5432');
    expect(masked).not.toContain('123나4567');
  });
});
