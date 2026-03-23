# UI/UX 단위 테스트 작성 스킬

## 개요
Vue 컴포넌트/뷰 파일을 분석하여 UI/UX 단위 테스트 케이스를 작성하고 CSV 파일에 추가하는 방법

---

## 1. TC ID 명명 규칙

```
TC-[ROLE]-[FEATURE]-[번호]-[서브번호]
```

| 구분 | 설명 | 예시 |
|---|---|---|
| ROLE | 역할 구분 | WK(Worker), HRM(HR Manager), TL(Team Leader), GL(Dept Leader), CM(공통) |
| FEATURE | 기능 약어 | DB(대시보드), NB(공지사항), AP(승인), EC(평가기준), KPI, ORG(조직), PR(승급심사) |
| 번호 | 주요 기능 순번 | 01, 02, 03... |
| 서브번호 | 세부 동작 순번 | 01-01, 01-02... |

---

## 2. CSV 컬럼 구조

```
TC ID, 컴포넌트/기능, 테스트 항목(목적), 사전 조건, 입력 및 조작(Action), 기대 결과(Expected), 실제 결과(Actual), 결과(Pass/Fail), 비고
```

---

## 3. Vue 파일 분석 → 테스트 케이스 추출 방법

### Step 1. 뷰 파일 읽기
```
Read: src/views/[role]/[ViewName].vue
```

### Step 2. 분석 포인트

| 코드 패턴 | 테스트 항목 |
|---|---|
| `onMounted` + `fetch` | 화면 로드 → 데이터 정상 출력 검증 |
| `ref(activeTab)` + 탭 배열 | 탭 필터 동작 검증 |
| `computed(filteredList)` | 필터링 결과 정상 출력 검증 |
| `selectedId` + 클릭 이벤트 | 항목 선택 → 상세 패널 출력 검증 |
| `showModal = true` 버튼 | 모달 팝업 정상 출력 검증 |
| `handleSave/Submit` 함수 | 저장/등록 정상 반영 검증 |
| `handleDelete/Remove` 함수 | 삭제/제거 정상 반영 검증 |
| `v-model` + 검색 input | 검색/필터 정상 동작 검증 |
| 유효성 검증 로직 (if 조건) | 유효성 검증 (오류 케이스) |

### Step 3. 테스트 항목 작성 패턴

```
- 화면 로드       → "정상 출력 검증" / "없음" / "화면 로드"
- 버튼 클릭       → "정상 클릭 검증" / "[사전조건]" / "버튼 마우스 클릭"
- 탭/필터         → "필터 정상 동작 검증" / "[리스트 출력]" / "탭 버튼 마우스 클릭"
- 폼 저장         → "[내용] 정상 반영 검증" / "[모달 출력]" / "폼 입력 후 저장 버튼 클릭"
- 유효성 오류     → "유효성 검증" / "[조작 후]" / "[잘못된 값 입력 후 버튼 클릭]"
```

---

## 4. CSV 파일 추가 방법

파일 경로: `프론트엔드 UI_UX 단위 테스트 - 프론트엔드 UI_UX 테스트 도구 및 양식 1.csv`

- 구분자: `,` (쉼표)
- 빈 행으로 기능 그룹 구분: `,,,,,,,,`
- 테스트 완료 항목: `기대 결과와 동일,PASS,`
- 미완료 항목: `,，` (실제결과/결과 비움)

### 예시
```csv
TC-HRM-NB-01,HRM 공지 리스트 화면,정상 출력 검증,없음,화면 로드,공지사항 목록이 카드 형태로 출력됨,기대 결과와 동일,PASS,
TC-HRM-NB-01-01,HRM 공지 카드 선택,정상 클릭 검증,공지 리스트 출력,컴포넌트 마우스 클릭,우측 상세 패널에 내용 표시됨,기대 결과와 동일,PASS,
```

---

## 5. 구글 시트 붙여넣기

CSV 파일을 구글 시트에 import:
1. 구글 시트 → **파일 → 가져오기**
2. CSV 파일 업로드
3. 구분자 **쉼표** 선택 → 가져오기

또는 Apps Script로 직접 삽입 (데이터가 A열에 몰릴 때 사용):
```javascript
function insertData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = [["TC ID", "컴포넌트/기능", ...]];
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
}
```
