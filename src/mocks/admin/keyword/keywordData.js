// ── 카테고리 배지 스타일 ────────────────────────────
export const CATEGORY_STYLE = {
  공정제어: { bg: '#E8F4FF', border: '#93C5FD', color: '#1A6DB5' },
  설비유지: { bg: '#F0FFF4', border: '#86EFAC', color: '#166534' },
  문제해결: { bg: '#FFF7ED', border: '#FDB07A', color: '#9A3412' },
  표준준수: { bg: '#F5F3FF', border: '#C4B5FD', color: '#5B21B6' },
  기술전파: { bg: '#FFF0FB', border: '#F0ABFC', color: '#86198F' },
}

export const CATEGORY_OPTIONS = ['전체 카테고리', ...Object.keys(CATEGORY_STYLE)]

// ── 더미 키워드 24개 ────────────────────────────────
export const DUMMY_KEYWORDS = [
  { id: 1,  keyword: '티칭',      category: '공정제어', description: '작업자가 설비 동작을 직접 교시하는 능력',           weight: 1.5 },
  { id: 2,  keyword: '오버홀',    category: '설비유지', description: '설비 전체를 분해·점검·재조립하는 능력',             weight: 1.3 },
  { id: 3,  keyword: '예방보전',  category: '설비유지', description: '고장 발생 전 계획적 점검·교체 수행 능력',           weight: 1.5 },
  { id: 4,  keyword: '돌발대응',  category: '문제해결', description: '예기치 못한 설비 이상 즉각 처리 능력',             weight: 2.0 },
  { id: 5,  keyword: '안전준수',  category: '표준준수', description: '안전 규정 및 작업 표준을 철저히 이행하는 태도',     weight: 1.2 },
  { id: 6,  keyword: '기술전파',  category: '기술전파', description: '보유 기술을 팀원에게 체계적으로 교육·전달하는 능력', weight: 1.4 },
  { id: 7,  keyword: '공차관리',  category: '공정제어', description: '가공 치수 공차를 정밀하게 관리하는 능력',           weight: 1.6 },
  { id: 8,  keyword: '윤활관리',  category: '설비유지', description: '설비 윤활 주기 및 유종을 적절히 관리하는 능력',     weight: 1.2 },
  { id: 9,  keyword: '진동분석',  category: '문제해결', description: '설비 진동 데이터를 분석해 이상 징후를 파악하는 능력', weight: 1.8 },
  { id: 10, keyword: '작업표준화', category: '표준준수', description: '반복 작업을 표준화하여 품질 편차를 줄이는 능력',   weight: 1.3 },
  { id: 11, keyword: '트러블슈팅', category: '문제해결', description: '설비 트러블 원인을 체계적으로 분석·해결하는 능력', weight: 1.9 },
  { id: 12, keyword: 'OEE분석',   category: '공정제어', description: '설비 종합효율(OEE)을 측정·개선하는 능력',          weight: 1.7 },
  { id: 13, keyword: '멘토링',    category: '기술전파', description: '신입 작업자를 체계적으로 지도·육성하는 능력',       weight: 1.4 },
  { id: 14, keyword: '5S활동',    category: '표준준수', description: '정리·정돈·청소·청결·습관화를 생활화하는 태도',     weight: 1.1 },
  { id: 15, keyword: '절삭조건',  category: '공정제어', description: '재료·공구에 따라 최적 절삭 조건을 설정하는 능력',   weight: 1.6 },
  { id: 16, keyword: '냉각수관리', category: '설비유지', description: '절삭유 농도·온도·교체 주기를 관리하는 능력',       weight: 1.1 },
  { id: 17, keyword: '리드타임단축', category: '공정제어', description: '공정 흐름을 개선해 생산 리드타임을 단축하는 능력', weight: 1.5 },
  { id: 18, keyword: '이상감지',  category: '문제해결', description: '설비 이상음·이상열 등 감각으로 이상을 감지하는 능력', weight: 1.7 },
  { id: 19, keyword: '개선제안',  category: '기술전파', description: '공정·설비 개선 아이디어를 발굴·공유하는 능력',     weight: 1.3 },
  { id: 20, keyword: '측정기활용', category: '공정제어', description: '버니어캘리퍼스·마이크로미터 등 정밀 측정 능력',   weight: 1.4 },
  { id: 21, keyword: '스핀들교체', category: '설비유지', description: 'CNC 스핀들 유닛 교체·정렬 작업 능력',              weight: 1.6 },
  { id: 22, keyword: '품질기록',  category: '표준준수', description: '검사 데이터를 정확히 기록·보관하는 능력',           weight: 1.0 },
  { id: 23, keyword: '원인분석',  category: '문제해결', description: '불량·고장의 근본 원인을 5-Why로 분석하는 능력',    weight: 1.8 },
  { id: 24, keyword: '지식문서화', category: '기술전파', description: '현장 노하우를 체계적으로 문서화하는 능력',          weight: 1.5 },
]

export const PAGE_SIZE = 8
