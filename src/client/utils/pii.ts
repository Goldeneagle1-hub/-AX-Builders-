export interface PiiMatch {
  type: '전화번호' | '주민등록번호' | '이메일' | '차량번호';
  value: string;
}

const PHONE_REGEX = /01[016789][-\s]?\d{3,4}[-\s]?\d{4}|0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}/g;
const RRN_REGEX = /\d{6}[-\s]?[1-4]\d{6}/g;
const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PLATE_REGEX = /\b\d{2,3}[가-힣]\s?\d{4}\b/g;

export function detectPII(text: string): PiiMatch[] {
  if (!text) return [];
  const matches: PiiMatch[] = [];
  const seen = new Set<string>();

  const collect = (regex: RegExp, type: PiiMatch['type']) => {
    const found = text.match(regex);
    if (found) {
      for (const item of found) {
        const key = `${type}:${item}`;
        if (!seen.has(key)) {
          seen.add(key);
          matches.push({ type, value: item });
        }
      }
    }
  };

  collect(PHONE_REGEX, '전화번호');
  collect(RRN_REGEX, '주민등록번호');
  collect(EMAIL_REGEX, '이메일');
  collect(PLATE_REGEX, '차량번호');

  return matches;
}

export function maskPII(text: string): string {
  if (!text) return text;
  return text
    .replace(RRN_REGEX, '[주민번호 비공개]')
    .replace(PHONE_REGEX, '[연락처 비공개]')
    .replace(EMAIL_REGEX, '[이메일 비공개]')
    .replace(PLATE_REGEX, '[차량번호 비공개]');
}
