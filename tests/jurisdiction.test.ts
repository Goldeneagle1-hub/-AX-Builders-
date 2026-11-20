import { describe, it, expect } from 'vitest';
import { resolveJurisdiction } from '../src/shared/jurisdictions.js';

describe('Jeju 3-Tier Jurisdiction Routing & Compound Complaint Handling', () => {
  it('correctly maps single issue odor complaint in Seogwipo Daejeong-eup', () => {
    const result = resolveJurisdiction(
      '서귀포시',
      '대정읍',
      '양돈 축사에서 악취와 가축분뇨 냄새가 유입됩니다'
    );

    expect(result.isCompound).toBe(false);
    expect(result.issues.length).toBe(1);
    expect(result.issues[0].recommendedDepartment).toContain('서귀포시 기후환경과');
    expect(result.issues[0].practicalTeam).toContain('환경지도팀');
    expect(result.issues[0].hierarchy.province).toContain('제주특별자치도');
    expect(result.issues[0].hierarchy.city).toContain('서귀포시');
    expect(result.issues[0].hierarchy.community).toContain('대정읍 주민센터');
  });

  it('correctly detects compound complaint in Jeju City Ildo1-dong and splits into 2 issues', () => {
    const compoundText =
      '상가 앞 황색실선 불법 주정차 차량 때문에 통행이 불가능하고 쓰레기 무단 투기 박스가 방치되어 있습니다';
    const result = resolveJurisdiction('제주시', '일도1동', compoundText);

    expect(result.isCompound).toBe(true);
    expect(result.issues.length).toBe(2);

    // Issue 1: Parking
    const parkingIssue = result.issues.find((i) => i.category.includes('주정차'));
    expect(parkingIssue).toBeDefined();
    expect(parkingIssue?.recommendedDepartment).toContain('제주시 교통행정과');
    expect(parkingIssue?.practicalTeam).toContain('교통지도팀');

    // Issue 2: Waste
    const wasteIssue = result.issues.find((i) => i.category.includes('폐기물'));
    expect(wasteIssue).toBeDefined();
    expect(wasteIssue?.recommendedDepartment).toContain('제주시 생활환경과');
  });

  it('never outputs final deterministic decision without recommendation disclaimer', () => {
    const result = resolveJurisdiction('제주시', '연동', '가로등 파손');
    expect(result.disclaimer).toContain('보조 안내');
  });

  it('routes water/sewer and coastal waste accurately', () => {
    const sewer = resolveJurisdiction('제주시', '노형동', '맨홀 오수 역류 및 상수도 누수 발생');
    expect(sewer.issues[0].recommendedDepartment).toContain('상하수도본부');

    const coastal = resolveJurisdiction('제주시', '한림읍', '해안변 폐그물 및 해안쓰레기 방치');
    expect(coastal.issues[0].recommendedDepartment).toContain('해양수산과');
  });

  it('returns honest isNeedsReview fallback when no jurisdiction rule matches', () => {
    const unknown = resolveJurisdiction('제주시', '아라동', '알 수 없는 일반적인 행정 질의 사항입니다');
    expect(unknown.issues[0].isNeedsReview).toBe(true);
    expect(unknown.issues[0].recommendedDepartment).toContain('관할 확인 필요');
  });
});
