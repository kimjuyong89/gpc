// 퓨처스에서 그랜드슬램까지 — 테니스 커리어 시뮬레이션 엔진
// 브라우저(<script type="module">)와 Node 양쪽에서 동작하는 순수 ES 모듈입니다.
// 모든 규칙은 docs/kickru-analysis.md 의 관찰을 테니스에 맞게 새로 설계한 것입니다.

export const ENGINE_VERSION = 1;

// ───────────────────────── 기본 데이터 ─────────────────────────
export const ATTRS = ['serve', 'forehand', 'backhand', 'net', 'movement', 'mental'];
export const ATTR_LABELS = { serve: '서브', forehand: '포핸드', backhand: '백핸드', net: '네트', movement: '풋워크', mental: '멘탈' };

export const STYLES = {
  bigserver: { label: '빅 서버', desc: '서브 한 방으로 포인트를 끝내는 유형', w: { serve: .30, forehand: .22, backhand: .12, net: .14, movement: .08, mental: .14 } },
  baseliner: { label: '베이스라이너', desc: '베이스라인에서 양쪽 스트로크로 밀어붙이는 유형', w: { serve: .14, forehand: .26, backhand: .24, net: .06, movement: .16, mental: .14 } },
  allcourt: { label: '올코트', desc: '모든 구역에서 고르게 싸우는 유형', w: { serve: .18, forehand: .20, backhand: .17, net: .15, movement: .15, mental: .15 } },
  servevolley: { label: '서브 앤 발리', desc: '서브 직후 네트로 달려드는 유형', w: { serve: .26, forehand: .14, backhand: .10, net: .28, movement: .12, mental: .10 } },
  counter: { label: '카운터펀처', desc: '끈질긴 수비와 역습으로 상대를 지치게 하는 유형', w: { serve: .10, forehand: .18, backhand: .20, net: .06, movement: .26, mental: .20 } },
};

export const SURFACES = {
  hard: { label: '하드', w: { serve: .20, forehand: .22, backhand: .18, net: .10, movement: .15, mental: .15 } },
  clay: { label: '클레이', w: { serve: .08, forehand: .20, backhand: .20, net: .05, movement: .27, mental: .20 } },
  grass: { label: '잔디', w: { serve: .30, forehand: .18, backhand: .12, net: .22, movement: .10, mental: .08 } },
};

export const COUNTRIES = [
  { id: 'KR', name: '대한민국', region: 'asia', strength: 58, names: 'kr' },
  { id: 'JP', name: '일본', region: 'asia', strength: 66, names: 'jp' },
  { id: 'CN', name: '중국', region: 'asia', strength: 64, names: 'cn' },
  { id: 'IN', name: '인도', region: 'asia', strength: 56, names: 'in' },
  { id: 'TH', name: '태국', region: 'asia', strength: 52, names: 'th' },
  { id: 'KZ', name: '카자흐스탄', region: 'asia', strength: 62, names: 'ru' },
  { id: 'US', name: '미국', region: 'americas', strength: 84, names: 'en' },
  { id: 'CA', name: '캐나다', region: 'americas', strength: 78, names: 'en' },
  { id: 'AR', name: '아르헨티나', region: 'americas', strength: 76, names: 'es' },
  { id: 'BR', name: '브라질', region: 'americas', strength: 68, names: 'pt' },
  { id: 'CL', name: '칠레', region: 'americas', strength: 66, names: 'es' },
  { id: 'ES', name: '스페인', region: 'europe', strength: 86, names: 'es' },
  { id: 'FR', name: '프랑스', region: 'europe', strength: 82, names: 'fr' },
  { id: 'IT', name: '이탈리아', region: 'europe', strength: 85, names: 'it' },
  { id: 'DE', name: '독일', region: 'europe', strength: 80, names: 'de' },
  { id: 'GB', name: '영국', region: 'europe', strength: 76, names: 'en' },
  { id: 'RS', name: '세르비아', region: 'europe', strength: 78, names: 'sl' },
  { id: 'RU', name: '러시아', region: 'europe', strength: 82, names: 'ru' },
  { id: 'CH', name: '스위스', region: 'europe', strength: 70, names: 'de' },
  { id: 'CZ', name: '체코', region: 'europe', strength: 76, names: 'sl' },
  { id: 'PL', name: '폴란드', region: 'europe', strength: 72, names: 'sl' },
  { id: 'GR', name: '그리스', region: 'europe', strength: 66, names: 'gr' },
  { id: 'NO', name: '노르웨이', region: 'europe', strength: 66, names: 'de' },
  { id: 'DK', name: '덴마크', region: 'europe', strength: 66, names: 'de' },
  { id: 'NL', name: '네덜란드', region: 'europe', strength: 70, names: 'de' },
  { id: 'AU', name: '호주', region: 'oceania', strength: 80, names: 'en' },
  { id: 'ZA', name: '남아공', region: 'africa', strength: 56, names: 'en' },
  { id: 'TN', name: '튀니지', region: 'africa', strength: 52, names: 'ar' },
];
export const COUNTRY_MAP = Object.fromEntries(COUNTRIES.map(c => [c.id, c]));

export const START_PATHS = {
  kr_school: { label: '한국 · 학교 테니스부', country: 'KR', coachMult: .95, cost: 6000, desc: '고등학교 테니스부에서 전국대회를 뛰며 시작합니다. 비용이 적고 아시안게임 병역 혜택 서사가 열립니다.' },
  jp_school: { label: '일본 · 고교 테니스부', country: 'JP', coachMult: .97, cost: 8000, desc: '인터하이를 목표로 하는 고교 테니스부 루트입니다.' },
  es_academy: { label: '스페인 · 클레이 아카데미', country: 'ES', coachMult: 1.06, cost: 42000, desc: '마요르카의 클레이 코트 아카데미. 풋워크와 끈기를 키우는 훈련이 강합니다.' },
  us_academy: { label: '미국 · 플로리다 아카데미', country: 'US', coachMult: 1.05, cost: 48000, desc: '하드코트 중심의 대형 아카데미. 서브와 파워를 중시합니다.' },
  fr_academy: { label: '프랑스 · 국립 훈련센터', country: 'FR', coachMult: 1.04, cost: 30000, desc: '파리 근교 국립 센터에서 올코트 기술을 배웁니다.' },
};

const NAME_POOLS = {
  kr: { last: ['김', '이', '박', '최', '정', '강', '조', '윤', '장', '임', '한', '오', '서', '신', '권', '황', '안', '송', '류', '홍'], m: ['민재', '도현', '서준', '지호', '하준', '시우', '준서', '예준', '현우', '지훈', '태윤', '승민', '우진', '재원', '동현', '유찬', '건우', '선우', '수현', '지안'], f: ['서연', '지우', '하은', '수아', '지민', '예린', '채원', '다은', '소율', '민서', '유나', '가은', '지원', '나은', '시은', '하린'], join: '' },
  jp: { last: ['사토', '스즈키', '다카하시', '다나카', '와타나베', '이토', '나카무라', '고바야시', '야마모토', '가토', '요시다', '마쓰모토', '이노우에', '기무라', '하야시'], m: ['하루토', '유토', '소타', '렌', '리쿠', '아오토', '유마', '고키', '쇼타', '다이키'], f: ['유이', '히나', '아오이', '사쿠라', '미오', '리오', '유나', '이치카', '메이', '하나'], join: ' ' },
  cn: { last: ['왕', '리', '장', '류', '천', '양', '황', '자오', '우', '저우'], m: ['웨이', '하오', '레이', '쥔', '밍', '쯔한', '위안', '하오란'], f: ['링', '팅', '멍', '쉬에', '칭', '야오'], join: ' ' },
  en: { last: ['밀러', '하퍼', '벤슨', '콜린스', '리드', '파커', '브룩스', '헤이즈', '워드', '프리먼', '칼슨', '휴즈', '설리번', '스톤', '베넷', '포스터', '그랜트'], m: ['제이크', '이선', '리암', '노아', '카터', '오웬', '메이슨', '로건', '헨리', '루카스', '딜런', '코너', '엘리', '잭', '벤'], f: ['에바', '밀라', '클로이', '그레이스', '릴리', '조이', '해나', '엘라', '아리아', '노라'], join: ' ', order: 'first' },
  es: { last: ['가르시아', '페르난데스', '로페스', '마르틴', '고메스', '디아스', '루이스', '모레노', '알론소', '나바로', '카스트로', '오르테가', '비달', '세라노'], m: ['마테오', '파블로', '알바로', '다니', '이반', '호르헤', '니코', '하비', '라울', '마르코스'], f: ['루시아', '마르타', '파울라', '카를라', '누리아', '사라', '알바', '엘레나'], join: ' ', order: 'first' },
  pt: { last: ['실바', '산투스', '올리베이라', '소자', '코스타', '페레이라'], m: ['티아구', '주앙', '마테우스', '브루누', '펠리피'], f: ['베아트리스', '아나', '주', '카밀라'], join: ' ', order: 'first' },
  fr: { last: ['뒤퐁', '마르탱', '르루아', '모로', '가르니에', '루소', '블랑', '페랭', '쿠르투아', '보네'], m: ['루카', '테오', '위고', '아르튀르', '쥘', '가브리엘', '마티스', '노에'], f: ['레아', '쥘리에트', '마농', '클로에', '루이즈'], join: ' ', order: 'first' },
  it: { last: ['로시', '비앙키', '리치', '콘티', '갈로', '페라리', '마리노', '그레코', '브루노', '코스타'], m: ['마테오', '로렌초', '루카', '리카르도', '니콜로', '다비데', '시모네'], f: ['줄리아', '소피아', '키아라', '마르티나'], join: ' ', order: 'first' },
  de: { last: ['뮐러', '슈미트', '피셔', '베버', '바그너', '베커', '호프만', '슐츠', '랑게', '크라우제', '한센', '닐센', '베르그'], m: ['루카스', '요나스', '레온', '핀', '파울', '막스', '닐스', '얀'], f: ['레나', '미아', '한나', '라우라', '안나'], join: ' ', order: 'first' },
  sl: { last: ['요바노비치', '페트로비치', '노바크', '드보르자크', '코발스키', '호르바트', '밀로셰비치', '바르토시', '마르코비치', '제만'], m: ['니콜라', '밀로시', '루카', '마르코', '야쿠프', '토마시', '필립', '보얀'], f: ['안나', '이바나', '밀리차', '카롤리나'], join: ' ', order: 'first' },
  ru: { last: ['이바노프', '스미르노프', '쿠즈네초프', '포포프', '볼코프', '소콜로프', '레베데프', '노비코프', '바실리예프', '모로조프'], m: ['이반', '드미트리', '알렉세이', '니키타', '아르툠', '다닐', '키릴'], f: ['안나', '마리야', '다리야', '폴리나', '알리나'], join: ' ', order: 'first' },
  gr: { last: ['파파도풀로스', '니콜라이디스', '안토니우', '요안니디스'], m: ['니코스', '디미트리스', '야니스', '코스타스'], f: ['마리아', '엘레니', '소피아'], join: ' ', order: 'first' },
  in: { last: ['샤르마', '파텔', '싱', '쿠마르', '메타'], m: ['아르준', '로한', '비크람', '아디티야', '카란'], f: ['프리야', '아니카', '리야'], join: ' ', order: 'first' },
  th: { last: ['수완', '차이야', '프라섯'], m: ['타논', '나타폰', '키티'], f: ['나파', '마린'], join: ' ', order: 'first' },
  ar: { last: ['벤 살라', '하다드', '야신'], m: ['유세프', '아민', '말레크'], f: ['아미라', '살마'], join: ' ', order: 'first' },
};

// 대회 등급. points/prize 는 [우승, 결승, 4강, 8강, 16강, 32강, 64강, 128강, 예선탈락] 순서.
export const TIERS = {
  junior: { label: 'ITF 주니어', short: 'JR', draw: 32, strength: 50, points: [100, 60, 35, 20, 10, 5, 0, 0, 0], prize: [0, 0, 0, 0, 0, 0, 0, 0, 0], travel: 1500, main: Infinity, qual: Infinity },
  f15: { label: 'ITF 퓨처스 15', short: 'F15', draw: 32, strength: 61, points: [15, 8, 4, 2, 1, 0, 0, 0, 0], prize: [2200, 1300, 760, 440, 260, 150, 0, 0, 60], travel: 1400, main: Infinity, qual: Infinity },
  f25: { label: 'ITF 퓨처스 25', short: 'F25', draw: 32, strength: 64, points: [25, 16, 8, 3, 1, 0, 0, 0, 0], prize: [3600, 2100, 1250, 720, 420, 250, 0, 0, 100], travel: 1600, main: 900, qual: Infinity },
  ch75: { label: '챌린저 75', short: 'CH75', draw: 32, strength: 67, points: [75, 44, 22, 11, 5, 0, 0, 0, 0], prize: [12000, 7000, 4000, 2300, 1300, 800, 0, 0, 300], travel: 2500, main: 420, qual: 800 },
  ch125: { label: '챌린저 125', short: 'CH125', draw: 32, strength: 70, points: [125, 75, 45, 25, 12, 0, 0, 0, 0], prize: [25000, 14000, 8000, 4600, 2700, 1600, 0, 0, 600], travel: 2800, main: 260, qual: 520 },
  t250: { label: '투어 250', short: '250', draw: 32, strength: 74, points: [250, 165, 100, 50, 25, 0, 0, 0, 10], prize: [150000, 85000, 45000, 25000, 14000, 8000, 0, 0, 3500], travel: 4000, main: 85, qual: 260 },
  t500: { label: '투어 500', short: '500', draw: 32, strength: 77, points: [500, 330, 200, 100, 50, 0, 0, 0, 20], prize: [450000, 240000, 120000, 60000, 32000, 18000, 0, 0, 7000], travel: 4500, main: 48, qual: 130 },
  m1000: { label: '마스터스 1000', short: 'M1000', draw: 64, strength: 79, points: [1000, 650, 400, 200, 100, 50, 10, 0, 25], prize: [1100000, 600000, 320000, 170000, 90000, 48000, 28000, 0, 14000], travel: 5000, main: 62, qual: 160 },
  gs: { label: '그랜드슬램', short: 'GS', draw: 128, strength: 80, points: [2000, 1300, 800, 400, 200, 100, 50, 10, 30], prize: [3000000, 1500000, 800000, 450000, 250000, 150000, 90000, 60000, 40000], travel: 6000, main: 104, qual: 250 },
  finals: { label: '투어 파이널스', short: 'FIN', draw: 8, strength: 88, points: [0, 0, 0, 0, 0, 0, 0, 0, 0], prize: [0, 0, 0, 0, 0, 0, 0, 0, 0], travel: 5000, main: 8, qual: 8 },
  olympics: { label: '올림픽', short: 'OLY', draw: 64, strength: 81, points: [0, 0, 0, 0, 0, 0, 0, 0, 0], prize: [0, 0, 0, 0, 0, 0, 0, 0, 0], travel: 5000, main: 64, qual: 64 },
  asianGames: { label: '아시안게임', short: 'AG', draw: 32, strength: 66, points: [0, 0, 0, 0, 0, 0, 0, 0, 0], prize: [0, 0, 0, 0, 0, 0, 0, 0, 0], travel: 3000, main: Infinity, qual: Infinity },
};
export const ROUND_LABELS = ['우승', '준우승', '4강', '8강', '16강', '32강', '64강', '128강', '예선 탈락'];

// 라운드별 상대의 랭킹 범위 [결승, 4강, 8강, 16강, 32강, 64강, 128강] — 결승부터 역순
const OPP_WINDOWS = {
  gs: [[1, 4], [1, 8], [2, 16], [4, 40], [8, 70], [15, 110], [25, 220]],
  m1000: [[1, 5], [1, 10], [2, 20], [4, 40], [8, 65], [15, 100]],
  t500: [[1, 15], [2, 25], [4, 40], [8, 60], [12, 90]],
  t250: [[5, 40], [8, 60], [12, 80], [20, 110], [30, 160]],
  ch125: [[50, 150], [60, 200], [70, 260], [90, 330], [110, 420]],
  ch75: [[90, 250], [110, 320], [130, 400], [160, 500], [200, 650]],
  f25: [[250, 500], [300, 650], [350, 800], [400, 1000], [450, 1300]],
  f15: [[400, 800], [500, 1000], [600, 1300], [700, 1700], [800, 2200]],
  olympics: [[1, 10], [1, 16], [2, 30], [4, 45], [8, 70], [15, 120]],
  finals: [[1, 4], [1, 8]],
};

const CALENDAR = {
  gs: [{ week: 3, name: '멜버른 그랜드슬램', surface: 'hard' }, { week: 21, name: '파리 그랜드슬램', surface: 'clay' }, { week: 27, name: '런던 그랜드슬램', surface: 'grass' }, { week: 35, name: '뉴욕 그랜드슬램', surface: 'hard' }],
  m1000: [{ week: 10, name: '인디언웰스 마스터스', surface: 'hard' }, { week: 12, name: '마이애미 마스터스', surface: 'hard' }, { week: 15, name: '몬테카를로 마스터스', surface: 'clay' }, { week: 17, name: '마드리드 마스터스', surface: 'clay' }, { week: 19, name: '로마 마스터스', surface: 'clay' }, { week: 31, name: '캐나다 마스터스', surface: 'hard' }, { week: 33, name: '신시내티 마스터스', surface: 'hard' }, { week: 40, name: '상하이 마스터스', surface: 'hard' }, { week: 44, name: '파리 실내 마스터스', surface: 'hard' }],
  t500: [{ week: 6, name: '로테르담 500', surface: 'hard' }, { week: 8, name: '두바이 500', surface: 'hard' }, { week: 9, name: '아카풀코 500', surface: 'hard' }, { week: 16, name: '바르셀로나 500', surface: 'clay' }, { week: 24, name: '할레 500', surface: 'grass' }, { week: 30, name: '워싱턴 500', surface: 'hard' }, { week: 38, name: '도쿄 500', surface: 'hard' }, { week: 42, name: '빈 500', surface: 'hard' }],
  t250: [{ week: 1, name: '브리즈번 250', surface: 'hard' }, { week: 2, name: '애들레이드 250', surface: 'hard' }, { week: 5, name: '몽펠리에 250', surface: 'hard' }, { week: 7, name: '마르세유 250', surface: 'hard' }, { week: 14, name: '휴스턴 250', surface: 'clay' }, { week: 18, name: '뮌헨 250', surface: 'clay' }, { week: 20, name: '제네바 250', surface: 'clay' }, { week: 23, name: '슈투트가르트 250', surface: 'grass' }, { week: 25, name: '마요르카 250', surface: 'grass' }, { week: 29, name: '애틀랜타 250', surface: 'hard' }, { week: 37, name: '청두 250', surface: 'hard' }, { week: 39, name: '항저우 250', surface: 'hard' }, { week: 43, name: '스톡홀름 250', surface: 'hard' }, { week: 45, name: '메스 250', surface: 'hard' }],
  ch: [{ week: 2, name: '서울 챌린저', surface: 'hard' }, { week: 4, name: '고베 챌린저', surface: 'hard' }, { week: 6, name: '부산 챌린저', surface: 'hard' }, { week: 9, name: '피닉스 챌린저', surface: 'hard' }, { week: 11, name: '멕시코시티 챌린저', surface: 'clay' }, { week: 13, name: '타이베이 챌린저', surface: 'hard' }, { week: 15, name: '바르셀로나 챌린저', surface: 'clay' }, { week: 17, name: '프라하 챌린저', surface: 'clay' }, { week: 19, name: '보르도 챌린저', surface: 'clay' }, { week: 22, name: '브라티슬라바 챌린저', surface: 'clay' }, { week: 24, name: '노팅엄 챌린저', surface: 'grass' }, { week: 26, name: '일클리 챌린저', surface: 'grass' }, { week: 29, name: '몬테비데오 챌린저', surface: 'clay' }, { week: 31, name: '포르투 챌린저', surface: 'clay' }, { week: 33, name: '야마가타 챌린저', surface: 'hard' }, { week: 36, name: '푸네 챌린저', surface: 'hard' }, { week: 38, name: '베르가모 챌린저', surface: 'hard' }, { week: 40, name: '상하이 챌린저', surface: 'hard' }, { week: 42, name: '브르노 챌린저', surface: 'hard' }, { week: 44, name: '요코하마 챌린저', surface: 'hard' }, { week: 46, name: '마우이 챌린저', surface: 'hard' }],
  f: [{ week: 2, name: '안성 퓨처스', surface: 'hard' }, { week: 4, name: '김천 퓨처스', surface: 'hard' }, { week: 6, name: '가와사키 퓨처스', surface: 'hard' }, { week: 8, name: '방콕 퓨처스', surface: 'hard' }, { week: 10, name: '모나스티르 퓨처스', surface: 'hard' }, { week: 12, name: '샤름엘셰이크 퓨처스', surface: 'hard' }, { week: 14, name: '안탈리아 퓨처스', surface: 'clay' }, { week: 16, name: '창원 퓨처스', surface: 'hard' }, { week: 18, name: '쿠알라룸푸르 퓨처스', surface: 'hard' }, { week: 20, name: '리마 퓨처스', surface: 'clay' }, { week: 22, name: '칸쿤 퓨처스', surface: 'hard' }, { week: 24, name: '카이로 퓨처스', surface: 'clay' }, { week: 26, name: '나콘시탐마랏 퓨처스', surface: 'hard' }, { week: 28, name: '사카이 퓨처스', surface: 'hard' }, { week: 30, name: '호치민 퓨처스', surface: 'hard' }, { week: 32, name: '구이양 퓨처스', surface: 'hard' }, { week: 34, name: '춘천 퓨처스', surface: 'hard' }, { week: 36, name: '타이베이 퓨처스', surface: 'hard' }, { week: 38, name: '고양 퓨처스', surface: 'hard' }, { week: 40, name: '하마마쓰 퓨처스', surface: 'hard' }, { week: 42, name: '도하 퓨처스', surface: 'hard' }, { week: 44, name: '산타크루스 퓨처스', surface: 'clay' }, { week: 46, name: '마니사 퓨처스', surface: 'hard' }],
  junior: [{ week: 3, name: '주니어 멜버른', surface: 'hard' }, { week: 8, name: '오사카 주니어', surface: 'hard' }, { week: 13, name: '서울 주니어 오픈', surface: 'hard' }, { week: 21, name: '주니어 파리', surface: 'clay' }, { week: 27, name: '주니어 런던', surface: 'grass' }, { week: 31, name: '타이베이 주니어', surface: 'hard' }, { week: 35, name: '주니어 뉴욕', surface: 'hard' }, { week: 41, name: '오렌지볼 주니어', surface: 'clay' }],
  school: [{ week: 14, name: '춘계 전국 학생 대회', surface: 'hard' }, { week: 22, name: '전국 소년체전', surface: 'hard' }, { week: 32, name: '추계 전국 학생 대회', surface: 'hard' }, { week: 41, name: '전국체전 고등부', surface: 'hard' }],
};

export const PLANS = {
  junior: { label: '주니어 투어', desc: '주니어 대회로 경험을 쌓습니다. 16세부터 퓨처스 2개에 와일드카드로 나갑니다.' },
  futures: { label: '퓨처스 집중', desc: 'ITF 퓨처스 15·25 대회를 돌며 첫 랭킹 포인트를 모읍니다.' },
  futuresCh: { label: '퓨처스 · 챌린저', desc: '퓨처스 25와 챌린저를 섞어 한 단계 위 무대를 노립니다.' },
  challenger: { label: '챌린저 집중', desc: '챌린저 투어를 중심으로 투어 250 예선에 도전합니다.' },
  tourEntry: { label: '투어 진입', desc: '투어 250·500과 그랜드슬램 예선을 포함한 일정입니다.' },
  fullTour: { label: '풀 투어', desc: '그랜드슬램 4개와 마스터스 전 대회를 포함한 풀 시즌입니다.' },
  elite: { label: '정상급 선별 일정', desc: '큰 대회에 집중하고 경기 수를 줄여 몸을 아낍니다.' },
  veteran: { label: '베테랑 일정', desc: '그랜드슬램과 몇몇 큰 대회만 골라 뛰는 짧은 시즌입니다.' },
  military: { label: '군 복무 중 국내 대회', desc: '상무 소속으로 국내 퓨처스 일부만 출전합니다.' },
};

export const COACH_TIERS = [
  { tier: 1, label: '아카데미 코치', mult: .95, fee: 15000 },
  { tier: 2, label: '투어 경력 코치', mult: 1.0, fee: 60000 },
  { tier: 3, label: '전 톱100 선수 출신 코치', mult: 1.06, fee: 160000 },
  { tier: 4, label: '그랜드슬램 결승 경험 코치', mult: 1.12, fee: 420000 },
  { tier: 5, label: '세계 1위를 키운 코치', mult: 1.18, fee: 950000 },
];
const COACH_NAMES = ['안토니오 빌라', '마르쿠스 린드', '요시다 켄', '디에고 라모스', '카렐 슈바르츠', '한승호', '피에르 뒤발', '엘레나 코스타', '토마스 브렌트', '이반 페트로프', '사라 윌킨스', '루이스 파리아'];
const SPONSOR_BRANDS = ['에이스라인 라켓', '코트마스터 어패럴', '그립텍', '서브원 스포츠음료', '베이스라인 뱅크', '플라이업 항공', '토파즈 시계', '넷러시 신발'];

export const SHOP_ITEMS = [
  { id: 'string', name: '프리미엄 스트링 세트', price: 1200, stat: 'serve', value: .3 },
  { id: 'shoes', name: '맞춤 테니스화', price: 3000, stat: 'movement', value: .4 },
  { id: 'cap', name: '스냅백 모자', price: 2500, stat: 'mental', value: .2 },
  { id: 'earphones', name: '노이즈캔슬링 이어폰', price: 4000, stat: 'mental', value: .3 },
  { id: 'racket', name: '커스텀 라켓 5자루', price: 9000, stat: 'forehand', value: .5 },
  { id: 'gym', name: '홈 트레이닝 세트', price: 15000, stat: 'movement', value: .6 },
  { id: 'scooter', name: '전동 킥보드', price: 12000, stat: 'mental', value: .4 },
  { id: 'massage', name: '안마의자', price: 25000, stat: 'backhand', value: .7 },
  { id: 'watch', name: '금 손목시계', price: 60000, stat: 'mental', value: .8 },
  { id: 'suit', name: '맞춤 정장', price: 40000, stat: 'net', value: .8 },
  { id: 'bed', name: '프리미엄 침대', price: 80000, stat: 'movement', value: 1.0 },
  { id: 'oxygen', name: '산소 캡슐', price: 150000, stat: 'serve', value: 1.1 },
  { id: 'suv', name: '대형 SUV', price: 180000, stat: 'forehand', value: 1.2 },
  { id: 'convertible', name: '오픈카', price: 260000, stat: 'backhand', value: 1.3 },
  { id: 'court', name: '개인 코트', price: 600000, stat: 'serve', value: 1.6 },
  { id: 'supercar', name: '슈퍼카', price: 900000, stat: 'forehand', value: 1.8 },
  { id: 'apartment', name: '한강뷰 아파트', price: 2500000, stat: 'mental', value: 2.0 },
  { id: 'villa', name: '해변 빌라', price: 6000000, stat: 'net', value: 2.2 },
  { id: 'yacht', name: '슈퍼 요트', price: 15000000, stat: 'movement', value: 2.4 },
  { id: 'jet', name: '전용기', price: 40000000, stat: 'backhand', value: 2.5 },
  { id: 'cryo', name: '냉동 치료 챔버', price: 8000000, aging: .08 },
  { id: 'regen', name: '재생 치료 포드', price: 20000000, aging: .12 },
  { id: 'gene', name: '유전자 분석 연구실', price: 45000000, aging: .16 },
  { id: 'clinic', name: '개인 장수 클리닉', price: 90000000, aging: .2 },
];
export const SHOP_MAP = Object.fromEntries(SHOP_ITEMS.map(i => [i.id, i]));

const AGE_SHARE = { 14: .12, 15: .13, 16: .15, 17: .17, 18: .19, 19: .20, 20: .20, 21: .19, 22: .19, 23: .18, 24: .18, 25: .17, 26: .16, 27: .08, 28: .05, 29: .03 };
const CURVES = ['early', 'normal', 'late', 'long', 'step', 'burst', 'bloom'];
const CURVE_BOUNDS = [.202, .664, .731, .764, .882, .949];
export const CURVE_LABELS = { early: '조숙형', normal: '일반형', late: '대기만성형', long: '꾸준형', step: '계단형', burst: '폭발형', bloom: '늦게 피는 꽃' };
export const POTENTIAL_GRADES = [
  { grade: '유망', min: 60, max: 72, p: .35 },
  { grade: '스타', min: 73, max: 80, p: .30 },
  { grade: '엘리트', min: 81, max: 87, p: .20 },
  { grade: '월드클래스', min: 88, max: 93, p: .105 },
  { grade: '레전드', min: 94, max: 98, p: .04 },
  { grade: '세대급', min: 99, max: 99, p: .005 },
];

// ───────────────────────── 난수 ─────────────────────────
export function rand(state) {
  let s = (state.rng.s + 0x6D2B79F5) >>> 0;
  state.rng.s = s;
  let t = s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rint = (st, a, b) => a + Math.floor(rand(st) * (b - a + 1));
const pick = (st, arr) => arr[Math.floor(rand(st) * arr.length)];
function gauss(st) { let u = 0, v = 0; while (u === 0) u = rand(st); while (v === 0) v = rand(st); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
const round1 = x => Math.round(x * 10) / 10;

// ───────────────────────── 능력치 ─────────────────────────
export function overallExact(p) { const w = STYLES[p.style].w; return ATTRS.reduce((s, a) => s + w[a] * p.attributes[a], 0); }
export function overall(p) { return Math.round(overallExact(p)); }
export function surfaceEff(p, surface) {
  const w = SURFACES[surface].w;
  const sv = ATTRS.reduce((s, a) => s + w[a] * p.attributes[a], 0);
  return .88 * overallExact(p) + .12 * sv;
}
export function potentialGrade(pot) { return POTENTIAL_GRADES.find(g => pot <= g.max)?.grade ?? '세대급'; }

function genName(st, countryId, gender) {
  const pool = NAME_POOLS[COUNTRY_MAP[countryId]?.names ?? 'en'];
  const first = pick(st, gender === 'f' ? pool.f : pool.m), last = pick(st, pool.last);
  return pool.order === 'first' ? `${first} ${last}` : `${last}${pool.join}${first}`;
}

function sampleCountry(st, exclude) {
  const total = COUNTRIES.reduce((s, c) => s + c.strength ** 2, 0);
  let r = rand(st) * total;
  for (const c of COUNTRIES) { r -= c.strength ** 2; if (r <= 0) return c.id; }
  return COUNTRIES[0].id;
}

// ───────────────────────── 월드(NPC) ─────────────────────────
const NPC_COUNT = 400;
const rankToOvr = rank => 91 - 9.5 * Math.log10(Math.max(1, rank));

function makeNpc(st, gender, rank, age) {
  const nat = sampleCountry(st);
  const ovr = rankToOvr(rank) + gauss(st) * 1.1;
  const pot = Math.max(ovr, ovr + Math.max(0, 25 - age) * (0.6 + 1.4 * rand(st)));
  return { id: `n${st.rng.s.toString(36)}${rank}`, name: genName(st, nat, gender), nat, age, ovr: clamp(ovr, 40, 95), pot: clamp(pot, ovr, 97), pts: 0, titles: 0, gs: 0, no1: 0, curve: pick(st, CURVES) };
}
function makeWorld(st, gender, year) {
  const npcs = [];
  for (let r = 1; r <= NPC_COUNT; r++) npcs.push(makeNpc(st, gender, r, rint(st, 18, 33)));
  const world = { year, npcs, gsWinners: [], no1History: [] };
  seasonPointsNpc(st, world);
  rankNpcs(world);
  return world;
}
function npcSeasonPts(st, ovr) {
  // 실제 투어 포인트 규모에 맞춘 곡선: 72→400, 80→1,560, 88→6,100, 92→8,500, 96→10,900
  const base = ovr <= 88 ? 400 * Math.exp(.17 * (ovr - 72)) : 6100 + (ovr - 88) * 600;
  const noise = ovr >= 86 ? .12 : .28;
  return base * Math.exp(gauss(st) * noise);
}
// 시즌 포인트 → 세계 랭킹. NPC 풀(400명) 아래는 포인트 곡선으로 외삽한다.
export function rankFromPts(world, pts) {
  if (!pts || pts <= 0) return null;
  const above = world.npcs.filter(n => n.pts > pts).length;
  if (above < world.npcs.length) return 1 + above;
  const floorPts = Math.max(1, world.npcs[world.npcs.length - 1].pts);
  return Math.min(2500, Math.max(world.npcs.length + 1, Math.round(world.npcs.length * Math.pow(floorPts / pts, .7))));
}
function seasonPointsNpc(st, world) { for (const n of world.npcs) n.pts = Math.round(npcSeasonPts(st, n.ovr)); }
function rankNpcs(world) { world.npcs.sort((a, b) => b.pts - a.pts || b.ovr - a.ovr); world.npcs.forEach((n, i) => n.rank = i + 1); }
function evolveNpcs(st, world, gender, playerOvr = 0) {
  // 선수가 월드를 압도하면 젊은 상위권 NPC의 잠재력이 따라 올라온다(라이벌 세대)
  if (playerOvr > world.npcs[0].ovr - 1) for (const n of world.npcs.slice(0, 20).filter(n => n.age <= 28).slice(0, 3)) n.pot = Math.max(n.pot, playerOvr - 1 + 3 * rand(st) + (playerOvr > 94 ? 1 : 0));
  for (const n of world.npcs) {
    n.age += 1;
    if (n.age < 25 || (n.age < 29 && n.pot >= 88)) n.ovr += Math.min(n.pot - n.ovr, (n.pot >= 88 ? 2.4 : 1.2) + 2.2 * rand(st)) * (n.curve === 'early' ? 1.2 : n.curve === 'late' ? .7 : 1);
    else if (n.age < 30) n.ovr += (rand(st) - .5) * 1.2 + (n.curve === 'late' && n.age < 28 ? .8 : 0);
    else n.ovr -= (0.8 + 1.6 * rand(st)) * (1 + (n.age - 30) * .18);
  }
  // 은퇴와 신인 보충
  world.npcs = world.npcs.filter(n => !(n.age >= 36 || (n.age >= 32 && n.ovr < 66) || (n.age >= 34 && rand(st) < .35)));
  while (world.npcs.length < NPC_COUNT) {
    const young = makeNpc(st, gender, rint(st, 180, 900), rint(st, 17, 19));
    young.ovr = 56 + rand(st) * 14; young.pot = young.ovr + 8 + rand(st) * 22 + (rand(st) < .06 ? 10 : 0);
    if (rand(st) < .03) young.pot = 90 + rand(st) * 7;
    world.npcs.push(young);
  }
  // 세대교체로 풀의 분포가 기준 곡선에서 떠내려가지 않도록, 순위별 기준값 쪽으로 절반쯤 되돌린다(개인차는 유지).
  world.npcs.sort((a, b) => b.ovr - a.ovr);
  world.npcs.forEach((n, i) => { if (i < 8) return; const target = rankToOvr(i + 1); const adj = (n.ovr - target) * .4; n.ovr -= adj; n.pot -= adj; });
  seasonPointsNpc(st, world); rankNpcs(world);
}
function opponentFor(st, state, tier, roundsFromEnd, qualifying) {
  const win = (OPP_WINDOWS[tier] ?? OPP_WINDOWS.t250);
  let [lo, hi] = win[Math.min(roundsFromEnd, win.length - 1)];
  if (qualifying) { lo = Math.round(lo * 1.8 + 20); hi = Math.round(hi * 1.8 + 40); }
  const rank = rint(st, lo, hi);
  const npc = state.world.npcs[rank - 1];
  const p = state.player;
  if (npc) return { id: npc.id, name: npc.name, nat: npc.nat, rank: npc.rank, ovr: npc.ovr + gauss(st) * .6, age: npc.age };
  return { id: null, name: genName(st, sampleCountry(st), p.gender), nat: null, rank, ovr: rankToOvr(rank) + gauss(st) * 1.3, age: rint(st, 18, 31) };
}
function juniorOpponent(st, state, roundsFromEnd) {
  const base = 38 + (state.player.age - 15) * 2.5;
  const bands = [[9, 17], [6, 14], [3, 11], [0, 8], [-4, 6]];
  const [lo, hi] = bands[Math.min(roundsFromEnd, 4)];
  const nat = sampleCountry(st);
  return { id: null, name: genName(st, nat, state.player.gender), nat, rank: null, ovr: base + lo + rand(st) * (hi - lo), age: rint(st, 14, 18) };
}

// ───────────────────────── 선수 생성 ─────────────────────────
export function makeCandidates({ seed, style, gender }) {
  const st = { rng: { s: (seed ?? Date.now()) >>> 0 } };
  const variants = [
    { id: 'attack', label: '공격형', bias: { serve: 3, forehand: 3, backhand: 0, net: 1, movement: -4, mental: -3 } },
    { id: 'defense', label: '수비형', bias: { serve: -3, forehand: -2, backhand: 1, net: -3, movement: 4, mental: 3 } },
    { id: 'balanced', label: '균형형', bias: { serve: 0, forehand: 0, backhand: 0, net: 0, movement: 0, mental: 0 } },
  ];
  return variants.map(v => {
    const w = STYLES[style].w;
    const attrs = {};
    for (const a of ATTRS) attrs[a] = 42 + 60 * (w[a] - 1 / 6) + v.bias[a] + gauss(st) * 2.2;
    normalizeAttrs(attrs, style, 45);
    const g = rand(st);
    let acc = 0, pot = 65;
    for (const grade of POTENTIAL_GRADES) { acc += grade.p; if (g < acc) { pot = rint(st, grade.min, grade.max); break; } }
    if (g >= acc) pot = 99;
    const c = rand(st);
    let ci = CURVE_BOUNDS.findIndex(b => c < b); if (ci < 0) ci = CURVES.length - 1;
    const hidden = { potential: pot, curve: CURVES[ci], durability: round1(.65 + .9 * rand(st)), speed: pot >= 99 ? 1.35 + .2 * rand(st) : .75 + .5 * rand(st), agingSeed: rand(st), bloomAge: null, breakoutAge: null, lifts: 0 };
    return { id: v.id, label: v.label, attributes: Object.fromEntries(ATTRS.map(a => [a, Math.round(attrs[a])])), hidden, seedState: st.rng.s };
  });
}
function normalizeAttrs(attrs, style, targetOvr) {
  const w = STYLES[style].w;
  for (let i = 0; i < 3; i++) {
    const ovr = ATTRS.reduce((s, a) => s + w[a] * attrs[a], 0);
    for (const a of ATTRS) attrs[a] = clamp(attrs[a] + (targetOvr - ovr), 28, 62);
  }
}

export function newCareer({ name, gender, nationality, path, style, focus, candidate, seed, startYear }) {
  const st = { rng: { s: (seed ?? Date.now()) >>> 0 } };
  const year = startYear ?? 2026;
  const pathInfo = START_PATHS[path];
  const player = {
    name: (name || '이름 없음').slice(0, 20), gender, nationality, path, style, focus: focus.slice(0, 2),
    age: 15, pro: false, attributes: { ...candidate.attributes }, hidden: { ...candidate.hidden },
    rank: null, prevRank: null, peakRank: null, juniorRank: null, juniorPts: 0, seasonPts: 0,
    morale: 0, fame: 2, balance: 0, earnings: 0, spent: 0,
    coach: { name: '아카데미 코치', tier: 1, mult: pathInfo.coachMult, fee: pathInfo.cost, years: 99, academy: true },
    sponsor: null, injuries: [], acl: 0, shop: { owned: [], season: -1, bought: false, stock: [] },
    military: nationality === 'KR' && gender === 'm' ? 'pending' : 'none', militaryYears: 0,
    career: { wins: 0, losses: 0, titles: 0, gs: 0, m1000: 0, t500: 0, t250: 0, ch: 0, f: 0, no1Years: 0, weeksTop10: 0, prize: 0, matches: 0, finals: 0, olympic: null, asianGold: false, davis: 0 },
    titles: [], awards: [], records: [], story: [], rival: null, styleChanges: 0, retired: false, nationalizedFrom: null,
  };
  const state = { version: ENGINE_VERSION, rng: st.rng, year, season: 0, stage: 'ready', player, world: null, history: [], pending: [], eventCooldown: {}, message: `${year}년, ${player.age}세. ${pathInfo.label}에서 첫 시즌을 준비합니다.`, lastSeason: null, event: null, offers: [], advice: null };
  state.world = makeWorld(state, gender, year);
  player.shop.stock = restock(state);
  return state;
}

// ───────────────────────── 시즌 계획 ─────────────────────────
export function entryType(tierId, rank, age, pro) {
  const t = TIERS[tierId];
  if (tierId === 'junior') return age <= 18 ? 'main' : 'none';
  if (!pro) return tierId === 'f15' && age >= 16 ? 'main' : 'none';
  const r = rank ?? 99999;
  if (r <= t.main) return 'main';
  if (r <= t.qual) return 'qual';
  return 'none';
}
function pickSpread(st, pool, n, used) {
  const avail = pool.filter(e => !used.has(e.week));
  const out = [];
  const step = Math.max(1, Math.floor(avail.length / Math.max(1, n)));
  for (let i = 0; i < avail.length && out.length < n; i += step) out.push(avail[i]);
  for (const e of out) used.add(e.week);
  return out;
}
export function buildSchedule(state, planId) {
  const st = state, p = state.player, used = new Set();
  const ev = [];
  const add = (tier, list) => list.forEach(e => ev.push({ ...e, tier }));
  if (planId === 'junior') {
    const isSchool = p.path === 'kr_school' || p.path === 'jp_school';
    add('junior', pickSpread(st, isSchool ? [...CALENDAR.school, ...CALENDAR.junior.slice(0, 4)] : CALENDAR.junior, 8, used));
    if (p.age >= 16) add('f15', pickSpread(st, CALENDAR.f, 2, used));
  } else if (planId === 'futures') { add('f15', pickSpread(st, CALENDAR.f, 12, used)); add('f25', pickSpread(st, CALENDAR.f, 8, used)); }
  else if (planId === 'futuresCh') { add('f25', pickSpread(st, CALENDAR.f, 6, used)); add('ch75', pickSpread(st, CALENDAR.ch, 8, used)); add('ch125', pickSpread(st, CALENDAR.ch, 6, used)); }
  else if (planId === 'challenger') { add('ch75', pickSpread(st, CALENDAR.ch, 6, used)); add('ch125', pickSpread(st, CALENDAR.ch, 10, used)); add('t250', pickSpread(st, CALENDAR.t250, 4, used)); }
  else if (planId === 'tourEntry') { add('gs', CALENDAR.gs); CALENDAR.gs.forEach(e => used.add(e.week)); add('m1000', pickSpread(st, CALENDAR.m1000, 2, used)); add('t500', pickSpread(st, CALENDAR.t500, 4, used)); add('t250', pickSpread(st, CALENDAR.t250, 8, used)); add('ch125', pickSpread(st, CALENDAR.ch, 4, used)); }
  else if (planId === 'fullTour') { add('gs', CALENDAR.gs); CALENDAR.gs.forEach(e => used.add(e.week)); add('m1000', CALENDAR.m1000); CALENDAR.m1000.forEach(e => used.add(e.week)); add('t500', pickSpread(st, CALENDAR.t500, 5, used)); add('t250', pickSpread(st, CALENDAR.t250, 3, used)); }
  else if (planId === 'elite') { add('gs', CALENDAR.gs); CALENDAR.gs.forEach(e => used.add(e.week)); add('m1000', pickSpread(st, CALENDAR.m1000, 8, used)); add('t500', pickSpread(st, CALENDAR.t500, 4, used)); add('t250', pickSpread(st, CALENDAR.t250, 1, used)); }
  else if (planId === 'veteran') { add('gs', CALENDAR.gs); CALENDAR.gs.forEach(e => used.add(e.week)); add('m1000', pickSpread(st, CALENDAR.m1000, 5, used)); add('t500', pickSpread(st, CALENDAR.t500, 3, used)); add('t250', pickSpread(st, CALENDAR.t250, 2, used)); }
  else if (planId === 'military') { add('f15', pickSpread(st, CALENDAR.f.filter(e => /안성|김천|창원|춘천|고양/.test(e.name)), 5, used)); add('f25', pickSpread(st, CALENDAR.f, 3, used)); }
  ev.sort((a, b) => a.week - b.week);
  return ev.map(e => ({ ...e, entry: entryType(e.tier, p.rank, p.age, p.pro) }));
}
export function availablePlans(state) {
  const p = state.player, r = p.rank ?? 99999;
  if (p.military === 'serving') return ['military'];
  if (!p.pro) return ['junior'];
  const out = ['futures'];
  if (r <= 900) out.push('futuresCh');
  if (r <= 450) out.push('challenger');
  if (r <= 200) out.push('tourEntry');
  if (r <= 90) out.push('fullTour');
  if (r <= 30) out.push('elite');
  if (p.age >= 31 && r <= 120) out.push('veteran');
  return out;
}
export function planSummary(state, planId) {
  const sched = buildSchedule(state, planId);
  const main = sched.filter(e => e.entry === 'main').length, qual = sched.filter(e => e.entry === 'qual').length, none = sched.length - main - qual;
  const playable = sched.filter(e => e.entry !== 'none');
  const strength = planId === 'junior' ? 42 + (state.player.age - 15) * 2.5 : playable.length ? playable.reduce((s, e) => s + TIERS[e.tier].strength, 0) / playable.length : 0;
  const travel = playable.reduce((s, e) => s + TIERS[e.tier].travel, 0);
  const ovr = overall(state.player);
  const diff = ovr - strength;
  const difficulty = diff > 6 ? '쉬움 · 성장 제한' : diff > 2 ? '적당함' : diff > -3 ? '도전적' : diff > -7 ? '버거움' : '무리';
  return { id: planId, ...PLANS[planId], events: sched.length, main, qual, none, strength: Math.round(strength), travel, difficulty };
}

// ───────────────────────── 경기 ─────────────────────────
function matchEff(state, surface, fatigue) {
  const p = state.player;
  const inj = p.injuries.find(i => i.remaining > 0 && i.playingThrough) ? -2 : 0;
  return surfaceEff(p, surface) + gauss(state) * 2.6 + p.morale * .3 - fatigue + inj + (p.coach?.tier ?? 1) * .1;
}
function simulateMatch(state, myEff, opp, setsToWin) {
  const oppEff = opp.ovr + gauss(state) * 2.6;
  const pSet = 1 / (1 + Math.exp(-(myEff - oppEff) / 5));
  let a = 0, b = 0; const sets = [];
  while (a < setsToWin && b < setsToWin) {
    const win = rand(state) < pSet;
    const close = Math.abs(pSet - .5) < .18 ? rand(state) < .45 : rand(state) < .25;
    let loserGames;
    if (close) loserGames = rand(state) < .5 ? 5 : 6; else loserGames = Math.floor(rand(state) * (pSet > .5 === win ? 4 : 5));
    const winnerGames = loserGames === 6 ? 7 : loserGames === 5 ? 7 : 6;
    sets.push(win ? `${winnerGames}-${loserGames}` : `${loserGames}-${winnerGames}`);
    if (win) a++; else b++;
  }
  return { won: a > b, score: sets.join(' '), pSet };
}
function roundsForDraw(draw) { return Math.round(Math.log2(draw)); }
function playTournament(state, ev, ctx) {
  const p = state.player, tier = TIERS[ev.tier];
  const res = { name: ev.name, tier: ev.tier, surface: ev.surface, week: ev.week, entry: ev.entry, matches: [], result: null, resultIdx: null, points: 0, prize: 0, title: false, skipped: null };
  const setsToWin = ev.tier === 'gs' && p.gender === 'm' ? 3 : 2;
  const fatigue = Math.max(0, ctx.matches - 50) * .05 * (p.age >= 30 ? 1.6 : 1);
  let alive = true;
  if (ev.entry === 'qual') {
    const qRounds = ev.tier === 'gs' ? 3 : 2;
    for (let q = 0; q < qRounds && alive; q++) {
      const opp = opponentFor(state, state, ev.tier, 4, true);
      const m = simulateMatch(state, matchEff(state, ev.surface, fatigue), opp, 2);
      res.matches.push({ round: `예선 ${q + 1}R`, opp: opp.name, oppRank: opp.rank, score: m.score, won: m.won });
      ctx.matches++; if (m.won) ctx.wins++; else ctx.losses++;
      if (!m.won) { alive = false; res.result = '예선 탈락'; res.resultIdx = 8; }
    }
  }
  if (alive) {
    const totalRounds = roundsForDraw(tier.draw);
    let startRound = 0;
    if ((ev.tier === 'm1000' && (p.rank ?? 9999) <= 32) || (ev.tier === 't250' && (p.rank ?? 9999) <= 8) || (ev.tier === 't500' && (p.rank ?? 9999) <= 4)) startRound = 1; // 부전승
    for (let r = startRound; r < totalRounds && alive; r++) {
      const fromEnd = totalRounds - 1 - r;
      const opp = ev.tier === 'junior' ? juniorOpponent(state, state, fromEnd) : opponentFor(state, state, ev.tier, fromEnd, false);
      const m = simulateMatch(state, matchEff(state, ev.surface, fatigue + r * .08), opp, setsToWin);
      res.matches.push({ round: ROUND_LABELS[fromEnd + 1 - (fromEnd === 0 ? 0 : 0)] === undefined ? '' : (fromEnd === 0 ? '결승' : ROUND_LABELS[fromEnd + 1]), opp: opp.name, oppRank: opp.rank, oppId: opp.id, score: m.score, won: m.won });
      ctx.matches++; if (m.won) { ctx.wins++; if (fromEnd === 0) { res.title = true; res.result = '우승'; res.resultIdx = 0; } }
      else { ctx.losses++; alive = false; res.resultIdx = fromEnd + 1; res.result = ROUND_LABELS[fromEnd + 1]; }
    }
  }
  res.points = tier.points[res.resultIdx] ?? 0;
  res.prize = tier.prize[res.resultIdx] ?? 0;
  if (ev.tier === 'junior') { p.juniorPts += res.points; res.points = 0; }
  return res;
}

// ───────────────────────── 시즌 진행 ─────────────────────────
function injuryRoll(state, weeks, ctx) {
  const p = state.player, d = p.hidden.durability;
  const ageF = p.age < 19 ? .85 : p.age >= 34 ? 1.1 : 1;
  const big = 1.8e-4 * clamp(1.4 - d, .75, 1.25) * (p.age >= 30 ? 1.3 : 1) * (ctx.doublesLoad ? 1.3 : 1);
  const minor = .0065 * ageF * clamp(1.5 - d, .6, 1.4) * (ctx.doublesLoad ? 1.3 : 1);
  for (let w = 0; w < weeks; w++) {
    if (p.injuries.some(i => i.remaining > 0)) return;
    const r = rand(state);
    if (r < big) { const out = rint(state, 40, 50); p.injuries.push({ name: pick(state, ['무릎 수술', '손목 인대 수술', '고관절 수술']), weeks: out, remaining: out, severity: 3, year: state.year }); p.acl++; ctx.bigInjury = true; return; }
    if (r < big + minor) { const sev = rand(state); const out = sev < .7 ? rint(state, 1, 3) : sev < .95 ? rint(state, 4, 9) : rint(state, 12, 24); p.injuries.push({ name: pick(state, ['발목 염좌', '복근 부상', '어깨 염증', '허리 통증', '종아리 근육 부상', '팔꿈치 통증']), weeks: out, remaining: out, severity: out >= 12 ? 2 : 1, year: state.year }); return; }
  }
}
function advanceInjuries(p, weeks) { for (const i of p.injuries) i.remaining = Math.max(0, i.remaining - weeks); p.injuries = p.injuries.filter(i => i.remaining > 0); }

export function playSeason(state, planId) {
  const p = state.player;
  if (p.serveRebuild && state.year >= p.serveRebuild.year) { p.attributes.serve = Math.min(99, p.attributes.serve + p.serveRebuild.amount); state.message = '개조한 서브가 드디어 자리를 잡았습니다.'; p.story.push({ year: state.year, text: '서브 폼 개조 완성' }); p.serveRebuild = null; }
  const plan = planId ?? (availablePlans(state)[0]);
  const schedule = buildSchedule(state, plan);
  const ctx = { matches: 0, wins: 0, losses: 0, bigInjury: false, missed: 0, doublesLoad: !!p.doubles };
  const season = { year: state.year, age: p.age, plan, planLabel: PLANS[plan].label, entries: [], titles: [], pts: 0, prize: 0, travel: 0, sponsor: 0, coachFee: 0, awards: [], notes: [], injuries: [], startOvr: overall(p), startAttrs: { ...p.attributes }, prevRank: p.rank };
  let week = 0;
  for (const ev of schedule) {
    injuryRoll(state, Math.max(0, ev.week - week), ctx);
    advanceInjuries(p, Math.max(0, ev.week - week));
    week = ev.week;
    if (ev.entry === 'none') { season.entries.push({ name: ev.name, tier: ev.tier, surface: ev.surface, week: ev.week, entry: ev.entry, skipped: '출전 자격 없음', matches: [], points: 0, prize: 0 }); continue; }
    const inj = p.injuries.find(i => i.remaining > 0);
    if (inj) { season.entries.push({ name: ev.name, tier: ev.tier, surface: ev.surface, week: ev.week, entry: ev.entry, skipped: `${inj.name}으로 결장`, matches: [], points: 0, prize: 0 }); ctx.missed++; if (!season.injuries.includes(inj.name)) season.injuries.push(inj.name); continue; }
    const r = playTournament(state, ev, ctx);
    season.entries.push(r); season.pts += r.points; season.prize += r.prize; season.travel += TIERS[ev.tier].travel;
    if (r.title) { season.titles.push({ name: ev.name, tier: ev.tier }); countTitle(p, ev.tier, ev.name, state.year); }
    p.morale = clamp(p.morale + (r.title ? 1.2 : r.resultIdx <= 2 ? .5 : r.resultIdx >= 5 ? -.4 : 0), -5, 5);
  }
  injuryRoll(state, Math.max(0, 47 - week), ctx); advanceInjuries(p, Math.max(0, 47 - week));
  // 국가대항전·올림픽·아시안게임
  nationalEvents(state, season, ctx);
  // 투어 파이널스
  if (p.pro && season.pts > 0) {
    const provisional = rankFromPts(state.world, season.pts) ?? 9999;
    if (provisional <= 8 && p.injuries.every(i => i.remaining <= 0)) playFinals(state, season, ctx);
  }
  p.career.matches += ctx.matches; p.career.wins += ctx.wins; p.career.losses += ctx.losses; p.career.prize += season.prize;
  season.wins = ctx.wins; season.losses = ctx.losses; season.missed = ctx.missed;
  // 수입과 지출
  season.sponsor = p.sponsor ? p.sponsor.fee : 0;
  season.coachFee = p.coach.fee;
  p.earnings += season.prize + season.sponsor;
  p.balance = Math.max(0, p.balance + season.prize + season.sponsor - season.travel - season.coachFee);
  // 랭킹
  if (p.pro) {
    p.seasonPts = season.pts;
    p.prevRank = p.rank;
    p.rank = rankFromPts(state.world, season.pts);
    if (p.rank === 1 && season.pts < 5000) p.rank = 2; // 포인트가 적으면 1위가 될 수 없음
    p.peakRank = p.peakRank == null ? p.rank : Math.min(p.peakRank, p.rank);
    if (p.rank === 1) p.career.no1Years++;
    if (p.rank <= 10) p.career.weeksTop10 += 52;
  } else {
    p.juniorRank = Math.max(1, Math.round(600 * Math.exp(-p.juniorPts / 250)));
  }
  season.rank = p.rank; season.juniorRank = p.juniorRank;
  // 성장과 노화
  const dev = applyDevelopment(state, season, ctx, plan);
  season.growth = dev;
  // 시상
  awards(state, season);
  // NPC 월드 진행(그랜드슬램 우승자 기록 등)
  worldSeasonRecord(state, season);
  evolveNpcs(state, state.world, p.gender, overallExact(p));
  p.fame = clamp(p.fame * .92 + (p.rank ? Math.max(0, 40 - Math.log2(p.rank) * 5) : 0) * .15 + season.titles.length * 1.5 + season.titles.filter(t => t.tier === 'gs').length * 10, 0, 100);
  state.history.push(season);
  state.lastSeason = season;
  state.season++;
  // 다음 해로
  state.year++; p.age++;
  p.juniorPts = Math.round(p.juniorPts * .5);
  if (!p.pro && p.age >= 18) { p.pro = true; p.rank = null; season.notes.push('18세가 되어 프로로 전향합니다. 랭킹 포인트 없이 퓨처스부터 시작합니다.'); p.story.push({ year: state.year, text: '프로 전향' }); }
  if (p.military === 'serving') { p.militaryYears++; if (p.militaryYears >= 2) { p.military = 'done'; season.notes.push('군 복무를 마치고 투어에 복귀합니다.'); p.story.push({ year: state.year, text: '군 복무를 마치고 복귀' }); } }
  p.shop.bought = false; p.shop.stock = restock(state);
  queueOffseason(state, season);
  state.stage = 'result';
  return season;
}

function countTitle(p, tier, name, year) {
  p.career.titles++;
  if (tier === 'gs') p.career.gs++; else if (tier === 'm1000') p.career.m1000++; else if (tier === 't500') p.career.t500++; else if (tier === 't250') p.career.t250++; else if (tier.startsWith('ch')) p.career.ch++; else if (tier.startsWith('f')) p.career.f++;
  p.titles.push({ year, tier, name });
}

function playFinals(state, season, ctx) {
  const p = state.player;
  const top = state.world.npcs.slice(0, 7);
  const r = { name: '투어 파이널스', tier: 'finals', surface: 'hard', week: 47, entry: 'main', matches: [], result: null, points: 0, prize: 0, title: false };
  let rrWins = 0;
  for (let i = 0; i < 3; i++) {
    const opp = { ...top[i * 2 % 7], ovr: top[i * 2 % 7].ovr + gauss(state) * .5 };
    const m = simulateMatch(state, matchEff(state, 'hard', 1), opp, 2);
    r.matches.push({ round: `조별 ${i + 1}차전`, opp: opp.name, oppRank: opp.rank, score: m.score, won: m.won });
    ctx.matches++; if (m.won) { ctx.wins++; rrWins++; r.points += 200; r.prize += 390000; } else ctx.losses++;
  }
  if (rrWins >= 2) {
    const sf = { ...top[1], ovr: top[1].ovr + gauss(state) * .5 };
    const m = simulateMatch(state, matchEff(state, 'hard', 1), sf, 2);
    r.matches.push({ round: '4강', opp: sf.name, oppRank: sf.rank, score: m.score, won: m.won }); ctx.matches++;
    if (m.won) {
      ctx.wins++; r.points += 400; r.prize += 1100000;
      const f = { ...top[0], ovr: top[0].ovr + gauss(state) * .5 };
      const fm = simulateMatch(state, matchEff(state, 'hard', 1), f, 2);
      r.matches.push({ round: '결승', opp: f.name, oppRank: f.rank, score: fm.score, won: fm.won }); ctx.matches++;
      if (fm.won) { ctx.wins++; r.points += 500; r.prize += 2200000; r.title = true; r.result = '우승'; p.career.finals++; season.titles.push({ name: '투어 파이널스', tier: 'finals' }); p.career.titles++; p.titles.push({ year: state.year, tier: 'finals', name: '투어 파이널스' }); }
      else { ctx.losses++; r.result = '준우승'; }
    } else { ctx.losses++; r.result = '4강'; }
  } else r.result = '조별리그 탈락';
  season.entries.push(r); season.pts += r.points; season.prize += r.prize;
}

function nationalEvents(state, season, ctx) {
  const p = state.player, c = COUNTRY_MAP[p.nationality];
  if (!p.pro) return;
  const injured = p.injuries.some(i => i.remaining > 0);
  // 데이비스컵 / 빌리진킹컵
  if ((p.rank ?? 9999) <= 300 && !injured && p.military !== 'serving') {
    const teamStrength = c.strength + Math.max(0, overall(p) - 70) * .8;
    const roll = rand(state) * 100;
    const stage = roll < teamStrength - 70 ? '우승' : roll < teamStrength - 55 ? '4강' : roll < teamStrength - 35 ? '8강' : roll < teamStrength ? '본선 조별리그' : '예선 라운드';
    const label = p.gender === 'm' ? '데이비스컵' : '빌리진킹컵';
    season.national = season.national ?? [];
    season.national.push({ name: label, result: stage });
    p.career.davis++;
    if (stage === '우승') { p.awards.push({ year: state.year, name: `${label} 우승` }); season.awards.push(`${label} 우승`); p.fame += 6; }
  }
  // 아시안게임 (2026, 2030, …)
  if (c.region === 'asia' && (state.year - 2026) % 4 === 0 && !injured && overall(p) >= 56 && p.military !== 'serving') {
    const r = { name: '아시안게임', tier: 'asianGames', surface: 'hard', week: 38, entry: 'main', matches: [], result: null, points: 0, prize: 0, title: false };
    let alive = true;
    for (let round = 0; round < 5 && alive; round++) {
      const fromEnd = 4 - round;
      const band = [[80, 86], [76, 83], [72, 80], [66, 76], [58, 72]][fromEnd];
      const opp = { name: genName(state, pick(state, ['JP', 'CN', 'KZ', 'IN', 'TH', 'KR']), p.gender), ovr: band[0] + rand(state) * (band[1] - band[0]), rank: null };
      const m = simulateMatch(state, matchEff(state, 'hard', 1), opp, 2);
      r.matches.push({ round: fromEnd === 0 ? '결승' : ROUND_LABELS[fromEnd + 1], opp: opp.name, score: m.score, won: m.won });
      ctx.matches++; if (m.won) { ctx.wins++; if (fromEnd === 0) { r.title = true; r.result = '금메달'; } } else { ctx.losses++; alive = false; r.result = fromEnd === 0 ? '은메달' : fromEnd === 1 ? '동메달' : ROUND_LABELS[fromEnd + 1]; }
    }
    season.entries.push(r);
    if (r.title) { p.career.asianGold = true; season.awards.push('아시안게임 금메달'); p.awards.push({ year: state.year, name: '아시안게임 금메달' }); p.fame += 8; if (p.military === 'pending') { p.military = 'exempt'; season.notes.push('아시안게임 금메달로 병역 혜택을 받습니다.'); p.story.push({ year: state.year, text: '아시안게임 금메달, 병역 혜택' }); } }
  }
  // 올림픽 (2028, 2032, …)
  if ((state.year - 2028) % 4 === 0 && (p.rank ?? 9999) <= 60 && !injured && p.military !== 'serving') {
    const r = { name: '올림픽', tier: 'olympics', surface: 'hard', week: 30, entry: 'main', matches: [], result: null, points: 0, prize: 0, title: false };
    let alive = true;
    for (let round = 0; round < 6 && alive; round++) {
      const fromEnd = 5 - round;
      const opp = opponentFor(state, state, 'olympics', fromEnd, false);
      const m = simulateMatch(state, matchEff(state, 'hard', 1), opp, 2);
      r.matches.push({ round: fromEnd === 0 ? '결승' : ROUND_LABELS[fromEnd + 1], opp: opp.name, oppRank: opp.rank, score: m.score, won: m.won });
      ctx.matches++; if (m.won) { ctx.wins++; if (fromEnd === 0) { r.title = true; r.result = '금메달'; } } else {
        ctx.losses++; alive = false;
        if (fromEnd === 0) r.result = '은메달';
        else if (fromEnd === 1) { const bm = simulateMatch(state, matchEff(state, 'hard', 1), opponentFor(state, state, 'olympics', 1, false), 2); ctx.matches++; if (bm.won) { ctx.wins++; r.result = '동메달'; } else { ctx.losses++; r.result = '4위'; } }
        else r.result = ROUND_LABELS[fromEnd + 1];
      }
    }
    season.entries.push(r);
    if (['금메달', '은메달', '동메달'].includes(r.result)) {
      p.career.olympic = r.result; season.awards.push(`올림픽 ${r.result}`); p.awards.push({ year: state.year, name: `올림픽 ${r.result}` }); p.fame += r.result === '금메달' ? 12 : 6;
      if (p.military === 'pending') { p.military = 'exempt'; season.notes.push('올림픽 메달로 병역 혜택을 받습니다.'); p.story.push({ year: state.year, text: `올림픽 ${r.result}, 병역 혜택` }); }
    }
  }
}

// ───────────────────────── 성장 / 노화 ─────────────────────────
function curveShare(state, age) {
  const h = state.player.hidden;
  const t = AGE_SHARE[Math.max(14, age)] ?? 0;
  let s = t, surge = false;
  const seedA = Math.floor(h.agingSeed * 1000);
  if (h.curve === 'early') s = age <= 20 ? 1.45 * t : age <= 23 ? 1.15 * t : age <= 26 ? .8 * t : .5 * t;
  else if (h.curve === 'late') s = age <= 20 ? .6 * t : age <= 23 ? .85 * t : age <= 26 ? 1.3 * t : ({ 27: .22, 28: .18, 29: .13, 30: .08 })[age] ?? 0;
  else if (h.curve === 'long') s = age <= 20 ? .8 * t : age <= 26 ? .9 * t : age <= 29 ? .12 : 0;
  else if (h.curve === 'step') { surge = [17 + seedA % 2, 21 + seedA % 3, 26].includes(age); s = surge ? 2.5 * t : .7 * t; }
  else if (h.curve === 'burst') { surge = age === 18 + (seedA % 7); s = surge ? .55 : .8 * t; }
  else if (h.curve === 'bloom') { const inBloom = h.bloomAge != null && age >= h.bloomAge && age < h.bloomAge + 3; surge = inBloom; s = inBloom ? .33 + .12 * (seedA % 100) / 100 : age <= 25 ? .5 * t : age < 30 ? .6 * t : 0; }
  const speedMod = clamp(.85 + (h.speed - .75) / .5 * .3, .75, 1.3);
  return { share: clamp(s * speedMod * (.9 + .2 * rand(state)), 0, .6), surge };
}
export function agingProfile(p) {
  const h = p.hidden;
  const n = clamp(h.agingSeed + (h.durability - 1.1) * .1, 0, .999999);
  const type = n < .15 ? 'fast' : n < .7 ? 'normal' : n < .92 ? 'late' : 'iron';
  const shift = (type === 'fast' ? -2 : type === 'late' ? 2 : type === 'iron' ? 3 : 0) - Math.min(2, p.acl);
  const slope = ({ fast: 1.3, normal: 1, late: .85, iron: .7 })[type] * (1 + .15 * p.acl);
  return { type, shift, slope };
}
function applyDevelopment(state, season, ctx, plan) {
  const p = state.player, h = p.hidden;
  const before = overallExact(p);
  const notes = [];
  // 참여도와 활약도
  const expectedMatches = p.pro ? (plan === 'military' ? 16 : plan === 'veteran' || plan === 'elite' ? 36 : 45) : 18;
  const participation = clamp(ctx.matches / expectedMatches, 0, 1);
  const played = season.entries.filter(e => e.matches && e.matches.length);
  const tierStrength = played.length ? played.reduce((s, e) => s + TIERS[e.tier].strength, 0) / played.length : TIERS.junior.strength;
  const expWins = played.reduce((s, e) => s + e.matches.reduce((ss, m) => ss + (1 / (1 + Math.exp(-(before - (TIERS[e.tier].strength + 3)) / 5))), 0), 0);
  let q = ctx.matches ? clamp(.5 + (ctx.wins - expWins) / Math.max(4, ctx.matches * .5), 0, 1) : .3;
  const excess = Math.max(0, before - tierStrength);
  const ea = clamp(1 - .06 * Math.max(0, excess - 3), .3, 1);
  if (q > .5) q = .5 + (q - .5) * ea;
  if (excess > 6 && p.pro) notes.push('지금 무대는 너무 쉬워 성장이 제한됐습니다. 한 단계 위 대회로 올라갈 때입니다.');
  // 개화·브레이크아웃
  if (h.curve === 'bloom' && h.bloomAge == null && p.pro && p.age >= 27 + Math.floor(5 * h.agingSeed) && p.age <= 32 && participation >= .5) { h.bloomAge = p.age; notes.push('늦은 나이에 마침내 잠재력이 터지기 시작합니다.'); p.story.push({ year: state.year, text: '늦게 핀 꽃, 뒤늦은 개화' }); }
  let { share, surge } = curveShare(state, p.age);
  if (p.pro && p.age >= 19 && p.age <= 25 && h.breakoutAge == null && rand(state) < .12 && participation >= .6) { h.breakoutAge = p.age; share = Math.min(.6, share * 1.8); surge = true; notes.push('브레이크아웃 시즌. 코트 위의 모든 것이 한 단계 빨라졌습니다.'); p.story.push({ year: state.year, text: '브레이크아웃 시즌' }); }
  // 지난 시즌 수상 보정
  const prev = state.history[state.history.length - 1];
  const prevBoost = prev ? Math.min(.4, prev.titles.length * .05 + (prev.awards?.length ?? 0) * .08) : 0;
  if (prev && (prev.titles.some(t => t.tier === 'gs') || prev.awards?.includes('올해의 선수')) && h.lifts < 3) { h.lifts++; h.potential = Math.min(99, h.potential + 1); }
  // 군 복무 페널티
  const militaryMult = p.military === 'serving' ? .6 : 1;
  const gap = Math.max(0, h.potential + bloomBonus(h, p.age) - before);
  let gain = share * gap * (.5 + .5 * participation) * (.7 + .6 * q) * (1 + prevBoost) * p.coach.mult * militaryMult;
  if (p.injuries.some(i => i.severity >= 3) || ctx.bigInjury) gain *= .5;
  gain = Math.min(gain, gap);
  // 분배
  const w = STYLES[p.style].w;
  const weights = {};
  for (const a of ATTRS) weights[a] = (w[a] + .35) * (p.focus.includes(a) ? 1.35 : 1) * (.75 + .5 * rand(state)) * (p.attributes[a] >= 96 ? .15 : p.attributes[a] >= 90 ? .5 : 1);
  const wsum = ATTRS.reduce((s, a) => s + weights[a], 0);
  const w2 = STYLES[p.style].w;
  // 오버롤 기준 gain 을 능력치 분배(가중평균)로 환산
  const ovrPerUnit = ATTRS.reduce((s, a) => s + w2[a] * weights[a] / wsum, 0);
  const unit = ovrPerUnit > 0 ? gain / ovrPerUnit : 0;
  for (const a of ATTRS) p.attributes[a] = Math.min(99, p.attributes[a] + unit * weights[a] / wsum);
  // 큰 부상 영구 손실
  if (ctx.bigInjury) { p.attributes.movement = Math.max(20, p.attributes.movement - 2.5); p.attributes.serve = Math.max(20, p.attributes.serve - 1); notes.push('큰 부상으로 풋워크와 서브가 영구적으로 떨어졌습니다.'); p.story.push({ year: state.year, text: `큰 부상(${season.injuries[0] ?? '수술'})` }); }
  // 노화
  const prof = agingProfile(p);
  const startAge = 31 + prof.shift;
  let decline = 0;
  if (p.age >= startAge - 1 && p.age >= 28) {
    const s = Math.max(0, p.age - startAge);
    const anti = Math.min(.4, p.shop.owned.reduce((acc, id) => acc + (SHOP_MAP[id]?.aging ?? 0), 0));
    const yearFactor = (.7 + .6 * rand(state)) * (p.age >= 31 && rand(state) < .1 ? 2 : 1);
    const lateBloomHold = h.curve === 'bloom' && h.bloomAge != null && p.age < h.bloomAge + 6 ? .3 : 1;
    decline = Math.max(p.age >= startAge ? .8 : .3, ((p.age < 31 ? 1 : 2) + 1.1 * s + s * s * .16) * .85 * prof.slope * yearFactor * (1 - anti)) * lateBloomHold * (p.age >= startAge ? 1 : .4);
    if (ctx.bigInjury) decline = Math.max(decline, 2);
    const dw = { serve: .14, forehand: .16, backhand: .16, net: .1, movement: .34, mental: .1 };
    const ovrPerUnitD = ATTRS.reduce((s2, a) => s2 + w2[a] * dw[a], 0);
    const unitD = decline / ovrPerUnitD;
    for (const a of ATTRS) p.attributes[a] = Math.max(20, p.attributes[a] - unitD * dw[a]);
    if (p.age <= 33) p.attributes.mental = Math.min(99, p.attributes.mental + .6);
    if (yearFactor >= 2) notes.push('올해는 몸이 한꺼번에 무거워졌습니다. 노화가 크게 왔습니다.');
  }
  const after = overallExact(p);
  const result = { before: Math.round(before), after: Math.round(after), delta: round1(after - before), participation: round1(participation), performance: round1(q), surge, decline: round1(decline), notes, attrs: { ...p.attributes } };
  if (after - before >= 4) notes.unshift(surge ? '성장 도약. 한 해 만에 몰라보게 좋아졌습니다.' : '올해의 성장이 뚜렷합니다.');
  else if (after - before < .8 && p.age < 27 && participation < .5) notes.unshift('출전 경기가 적어 성장이 더뎠습니다. 더 많이 뛰어야 큽니다.');
  return result;
}
function bloomBonus(h, age) { return h.curve === 'bloom' && h.bloomAge != null && age >= h.bloomAge ? 9 + 6 * h.agingSeed : 0; }

// ───────────────────────── 시상·기록·월드 ─────────────────────────
function awards(state, season) {
  const p = state.player;
  if (!p.pro) return;
  const give = (name) => { season.awards.push(name); p.awards.push({ year: state.year, name }); };
  if (p.rank === 1) { give('올해의 선수'); give('연말 세계 1위'); p.story.push({ year: state.year, text: '연말 세계 1위' }); }
  const prevRank = season.prevRank ?? 9999;
  if (p.age <= 21 && p.rank <= 100 && prevRank > 100) give('올해의 신인');
  if (prevRank > 150 && p.rank <= 50) give('올해의 컴백');
  if (season.titles.filter(t => ['gs', 'm1000', 't500', 't250', 'finals'].includes(t.tier)).length >= 5) give('올해의 최다 우승');
  const gsCount = season.titles.filter(t => t.tier === 'gs').length;
  if (gsCount === 4) { give('캘린더 그랜드슬램'); p.story.push({ year: state.year, text: '한 해 4개 그랜드슬램 석권' }); }
  if (gsCount >= 1 && !p.story.some(s => s.text === '첫 그랜드슬램 우승')) p.story.push({ year: state.year, text: '첫 그랜드슬램 우승' });
  if (season.titles.length && !p.story.some(s => s.text === '첫 투어 우승') && season.titles.some(t => ['t250', 't500', 'm1000', 'gs'].includes(t.tier))) p.story.push({ year: state.year, text: '첫 투어 우승' });
  if (p.rank <= 100 && prevRank > 100) p.story.push({ year: state.year, text: '첫 톱100 진입' });
  if (p.rank <= 10 && prevRank > 10) p.story.push({ year: state.year, text: '첫 톱10 진입' });
  // 시즌 기록
  const recs = [['titles', season.titles.length, '한 시즌 최다 우승', '회'], ['wins', season.wins, '한 시즌 최다 승', '승'], ['pts', season.pts, '한 시즌 최다 포인트', '점']];
  for (const [key, val, label, unit] of recs) {
    const cur = p.records.find(r => r.key === key);
    if (val > 0 && (!cur || val > cur.value)) { if (cur) { cur.value = val; cur.year = state.year; } else p.records.push({ key, label, unit, value: val, year: state.year }); }
  }
}
function worldSeasonRecord(state, season) {
  const w = state.world, p = state.player;
  const myGs = new Set(season.titles.filter(t => t.tier === 'gs').map(t => t.name));
  const winners = [];
  for (const gs of CALENDAR.gs) {
    if (myGs.has(gs.name)) { winners.push({ year: state.year, name: gs.name, winner: p.name, me: true }); continue; }
    const top = w.npcs.slice(0, 10);
    const weights = top.map((n, i) => Math.exp(-i * .45));
    let r = rand(state) * weights.reduce((a, b) => a + b, 0), idx = 0;
    for (; idx < top.length; idx++) { r -= weights[idx]; if (r <= 0) break; }
    const n = top[Math.min(idx, top.length - 1)]; n.gs++; n.titles++;
    winners.push({ year: state.year, name: gs.name, winner: n.name, me: false });
  }
  w.gsWinners.push(...winners);
  season.gsWinners = winners;
  if (p.rank === 1) w.no1History.push({ year: state.year, name: p.name, me: true });
  else { const n = w.npcs[0]; n.no1++; w.no1History.push({ year: state.year, name: n.name, me: false }); }
}

// ───────────────────────── 비시즌: 이벤트·제안·은퇴 ─────────────────────────
function restock(state) {
  const p = state.player;
  const avail = SHOP_ITEMS.filter(i => !p.shop.owned.includes(i.id));
  const affordable = avail.filter(i => i.price <= Math.max(5000, p.balance * 3));
  const pool = affordable.length >= 3 ? affordable : avail;
  const out = [];
  const copy = [...pool];
  while (out.length < 3 && copy.length) out.push(copy.splice(Math.floor(rand(state) * copy.length), 1)[0].id);
  return out;
}

const EVENTS = [
  { id: 'serveRebuild', title: '서브 폼 개조 제안', minAge: 16, maxAge: 29, cooldown: 4, text: '코치가 서브 동작을 처음부터 다시 만들자고 제안합니다. 올해는 서브가 흔들리겠지만 2년 뒤에는 더 강한 서브를 가질 수 있습니다.', options: [
    { id: 'adapt', label: '새로운 폼을 익힌다', effect: { serve: -3, laterServe: 6 }, result: '서브 폼을 뜯어고치기 시작했습니다. 올해는 더블폴트가 늘어나겠지만, 코치는 확신하고 있습니다.' },
    { id: 'steady', label: '익숙한 서브를 지킨다', effect: {}, result: '지금의 서브를 다듬기로 했습니다.' }] },
  { id: 'mentalCoach', title: '멘탈 코치와의 상담', minAge: 17, maxAge: 34, cooldown: 3, text: '중요한 포인트마다 손이 굳습니다. 스포츠 심리 전문가와 정기 상담을 시작할 수 있습니다.', options: [
    { id: 'open', label: '속마음을 털어놓는다', effect: { mental: 2.5, morale: 2, money: -20000 }, result: '매주 상담을 이어갑니다. 타이브레이크에서 숨이 고르게 쉬어집니다.' },
    { id: 'alone', label: '혼자 이겨낸다', effect: { mentalRisk: true }, result: '스스로 답을 찾기로 했습니다.' }] },
  { id: 'diet', title: '영양사의 식단 관리', minAge: 17, maxAge: 35, cooldown: 4, text: '전담 영양사가 경기 전후 식단과 수분 섭취 계획을 짜 주겠다고 합니다.', options: [
    { id: 'strict', label: '철저하게 지킨다', effect: { movement: 1.5, durability: .06, money: -15000 }, result: '몸이 가벼워졌습니다. 3세트 후반에도 다리가 남아 있습니다.' },
    { id: 'loose', label: '적당히 먹고 즐긴다', effect: { morale: 1.5 }, result: '가끔은 치킨도 먹습니다. 기분은 좋아졌습니다.' }] },
  { id: 'doubles', title: '복식 병행 제안', minAge: 18, maxAge: 32, cooldown: 5, text: '복식 파트너 제안이 왔습니다. 네트 플레이가 늘고 상금도 생기지만 경기 수가 늘어 몸이 피곤해집니다.', options: [
    { id: 'take', label: '복식도 함께 뛴다', effect: { net: 2.5, doubles: true, money: 40000 }, result: '복식 투어를 병행합니다. 네트 앞 반응이 빨라졌습니다.' },
    { id: 'pass', label: '단식에 집중한다', effect: {}, result: '단식에만 집중하기로 했습니다.' }] },
  { id: 'styleChange', title: '플레이 스타일 변경 실험', minAge: 18, maxAge: 27, cooldown: 99, text: '코치가 지금의 능력치에 더 맞는 플레이 스타일을 제안합니다. 오버롤 계산 방식이 바뀌고 적응기가 필요합니다.', dynamic: true },
  { id: 'press', title: '기자회견', minAge: 19, maxAge: 36, cooldown: 3, text: '이번 시즌 가장 큰 이야기에 대해 기자들이 질문합니다. 답변마다 성공 확률과 결과가 다릅니다.', options: [
    { id: 'humble', label: '겸손하게 팀을 앞세운다', chance: .9, success: { fame: 3 }, fail: { fame: -1 }, result: '담담한 답변이 좋은 반응을 얻었습니다.', failResult: '너무 무난하다는 평이 나왔습니다.' },
    { id: 'joke', label: '농담으로 받아친다', chance: .65, success: { fame: 5, morale: 1 }, fail: { fame: -3 }, result: '기자실이 웃음바다가 됐습니다. 밈이 됐습니다.', failResult: '농담이 썰렁했습니다. 댓글이 차갑습니다.' },
    { id: 'confident', label: '자신감을 드러낸다', chance: .5, success: { fame: 7, mental: 1 }, fail: { fame: -4, morale: -1 }, result: '"다음은 우승입니다." 헤드라인이 됐습니다.', failResult: '"건방지다"는 반응이 쏟아졌습니다.' },
    { id: 'complain', label: '불만을 표출한다', chance: .3, success: { fame: 8, mental: 1.5 }, fail: { fame: -7, morale: -2 }, result: '거친 발언이 오히려 팬덤을 키웠습니다.', failResult: '대회 조직위와 팬들 모두 등을 돌렸습니다.' }] },
  { id: 'naturalize', title: '귀화 제안', minAge: 19, maxAge: 28, cooldown: 99, text: '테니스 강국 협회에서 귀화를 제안합니다. 국가대항전 기회는 늘지만 고향 팬들의 여론은 크게 나빠집니다.', dynamic: true },
  { id: 'legendAdvice', title: '전설의 조언', minAge: 17, maxAge: 30, cooldown: 5, text: '은퇴한 그랜드슬램 챔피언이 훈련장을 찾아와 백핸드 그립을 봐 주겠다고 합니다.', options: [
    { id: 'listen', label: '조언을 새겨듣는다', effect: { backhand: 2, mental: 1 }, result: '그립을 조금 바꾸자 백핸드가 깊어졌습니다.' },
    { id: 'own', label: '내 방식대로 간다', effect: { morale: 1 }, result: '내 스윙은 내가 제일 잘 압니다.' }] },
  { id: 'coachSplit', title: '코치와의 결별', minAge: 19, maxAge: 34, cooldown: 4, text: '코치와 훈련 방향을 두고 자주 부딪힙니다. 결별하고 새 코치를 찾을 수 있습니다.', options: [
    { id: 'split', label: '결별하고 새 코치를 찾는다', effect: { newCoach: true, morale: -1 }, result: '코치와 헤어졌습니다. 새 제안이 들어옵니다.' },
    { id: 'stay', label: '대화로 풀어 본다', effect: { morale: 1 }, result: '긴 대화 끝에 서로를 이해했습니다.' }] },
  { id: 'comebackChoice', title: '복귀 시점 결정', minAge: 17, maxAge: 36, cooldown: 2, requireBigInjury: true, text: '재활이 거의 끝났습니다. 의료진은 한 달 더 쉬라고 하지만 큰 대회가 코앞입니다.', options: [
    { id: 'early', label: '조기 복귀한다', effect: { durability: -.08, morale: 1 }, result: '예정보다 빨리 코트로 돌아왔습니다. 무릎은 아직 완전하지 않습니다.' },
    { id: 'wait', label: '충분히 재활한다', effect: { durability: .03, movement: .5 }, result: '충분히 쉬었습니다. 복귀 후 몸 상태가 안정적입니다.' }] },
  { id: 'rival', title: '라이벌의 등장', minAge: 17, maxAge: 30, cooldown: 99, text: '또래의 강한 선수가 매번 토너먼트에서 길을 막습니다. 언론은 둘을 라이벌로 묶기 시작했습니다.', dynamic: true },
  { id: 'focusChange', title: '집중 훈련 변경 제안', minAge: 16, maxAge: 30, cooldown: 4, text: '코치가 집중 훈련 종목을 바꾸자고 합니다. 약점을 메우거나 강점을 더 날카롭게 할 수 있습니다.', dynamic: true },
];

function pickEvent(state, season) {
  const p = state.player;
  if (rand(state) > .62) return null;
  const elig = EVENTS.filter(e => p.age >= e.minAge && p.age <= e.maxAge && (state.eventCooldown[e.id] ?? -99) + e.cooldown <= state.season && (!e.requireBigInjury || season.injuries.length && p.acl > 0 && season.injuries.some(n => /수술/.test(n))) && !(e.id === 'naturalize' && (p.nationalizedFrom || COUNTRY_MAP[p.nationality].strength >= 80 || p.career.davis > 2)) && !(e.id === 'rival' && p.rival) && !(e.id === 'styleChange' && p.styleChanges > 0) && !(e.id === 'doubles' && p.doubles));
  if (!elig.length) return null;
  const e = pick(state, elig);
  state.eventCooldown[e.id] = state.season;
  const ev = { id: e.id, title: e.title, text: e.text, options: e.options ? e.options.map(o => ({ ...o })) : [] };
  if (e.id === 'styleChange') {
    const cur = p.style;
    const best = Object.keys(STYLES).filter(s => s !== cur).map(s => ({ s, v: ATTRS.reduce((acc, a) => acc + STYLES[s].w[a] * p.attributes[a], 0) })).sort((a, b) => b.v - a.v)[0];
    ev.options = [{ id: 'switch', label: `${STYLES[best.s].label}(으)로 바꾼다 · 오버롤 ${Math.round(best.v)}`, effect: { style: best.s, morale: -1 }, result: `${STYLES[best.s].label} 스타일로 전환했습니다. 새 패턴에 적응하는 중입니다.` }, { id: 'keep', label: '지금 스타일을 유지한다', effect: {}, result: '지금의 방식을 믿기로 했습니다.' }];
  } else if (e.id === 'naturalize') {
    const cands = COUNTRIES.filter(c => c.strength > COUNTRY_MAP[p.nationality].strength + 8);
    const c = pick(state, cands);
    ev.options = [{ id: 'accept', label: `${c.name} 국적을 받아들인다`, effect: { nationality: c.id, fame: -12, morale: -2 }, result: `${c.name} 대표로 뛰게 됐습니다. 고향에서는 배신이라는 말이 나왔습니다.` }, { id: 'refuse', label: '정중히 거절한다', effect: { fame: 3 }, result: '조국의 유니폼을 지키기로 했습니다.' }];
  } else if (e.id === 'rival') {
    const pool = state.world.npcs.filter(n => Math.abs(n.age - p.age) <= 2 && Math.abs(n.ovr - overallExact(p)) <= 4);
    const r = pool.length ? pick(state, pool) : state.world.npcs[Math.min(50, state.world.npcs.length - 1)];
    ev.options = [{ id: 'embrace', label: '라이벌 구도를 받아들인다', effect: { rival: r.id, rivalName: r.name, mental: 1, fame: 3 }, result: `${r.name}과(와)의 맞대결이 투어의 볼거리가 됐습니다.` }, { id: 'ignore', label: '신경 쓰지 않는다', effect: { morale: .5 }, result: '라이벌은 언론이 만드는 것입니다. 내 경기만 합니다.' }];
  } else if (e.id === 'focusChange') {
    const weakest = [...ATTRS].sort((a, b) => p.attributes[a] - p.attributes[b])[0];
    const strongest = [...ATTRS].sort((a, b) => p.attributes[b] - p.attributes[a])[0];
    ev.options = [{ id: 'weak', label: `약점 보강: ${ATTR_LABELS[weakest]} 집중`, effect: { focus: [weakest, p.focus[0] ?? strongest] }, result: `${ATTR_LABELS[weakest]} 훈련 비중을 크게 늘렸습니다.` }, { id: 'strong', label: `강점 강화: ${ATTR_LABELS[strongest]} 집중`, effect: { focus: [strongest, p.focus[1] ?? weakest] }, result: `${ATTR_LABELS[strongest]}을(를) 더 날카롭게 다듬습니다.` }, { id: 'keep', label: '지금 훈련을 유지한다', effect: {}, result: '지금 방향을 유지합니다.' }];
  }
  return ev;
}

function makeOffers(state, season, forceCoach) {
  const p = state.player, offers = [];
  if (!p.pro) return offers;
  const r = p.rank ?? 2000;
  // 코치 제안
  const coachTier = r <= 10 ? 5 : r <= 40 ? 4 : r <= 150 ? 3 : r <= 600 ? 2 : 1;
  const chance = forceCoach ? 1 : (p.coach.academy ? .9 : .35 + (coachTier > p.coach.tier ? .25 : 0));
  if (rand(state) < chance) {
    const tiers = [coachTier, Math.max(1, coachTier - 1)];
    for (const t of new Set(tiers)) {
      if (t === p.coach.tier && !forceCoach && !p.coach.academy) continue;
      const ct = COACH_TIERS[t - 1];
      offers.push({ id: `coach-${t}-${offers.length}`, kind: 'coach', name: pick(state, COACH_NAMES), tier: t, label: ct.label, mult: ct.mult, fee: Math.round(ct.fee * (.85 + .3 * rand(state))), years: rint(state, 1, 3), pitch: t >= 4 ? '"당신 서브면 결승까지 갑니다. 나머지는 내가 만들죠."' : t === 3 ? '"톱100은 재능이 아니라 루틴으로 갑니다."' : t === 2 ? '"투어에서 20년 굴렀습니다. 길은 압니다."' : '"기본기부터 다시 봅시다."' });
    }
  }
  // 스폰서 제안
  const fameBase = p.fame + Math.max(0, 60 - Math.log2(r) * 7);
  const sponsorChance = (!p.sponsor || p.sponsor.years <= 0) ? .8 : .3;
  if (rand(state) < sponsorChance && r <= 800) {
    const fee = Math.round((r <= 5 ? 6000000 : r <= 20 ? 2000000 : r <= 50 ? 600000 : r <= 100 ? 200000 : r <= 250 ? 60000 : 15000) * (.7 + .6 * rand(state)) * (1 + fameBase / 150));
    offers.push({ id: `sponsor-${offers.length}`, kind: 'sponsor', brand: pick(state, SPONSOR_BRANDS), fee, years: rint(state, 1, 3), pitch: `연 ${fmtMoney(fee)} · ${r <= 50 ? '메인 스폰서' : '용품 지원 + 보너스'}` });
  }
  return offers;
}
export function fmtMoney(n) { if (n >= 1e8) return `${(n / 1e8).toFixed(1)}억 달러`; if (n >= 1e4) return `${Math.round(n / 1e4).toLocaleString()}만 달러`; return `${Math.round(n).toLocaleString()} 달러`; }

function queueOffseason(state, season) {
  const p = state.player;
  state.pending = [];
  // 군 입대 통보
  if (p.military === 'pending' && p.age >= 28) { p.military = 'serving'; p.militaryYears = 0; season.notes.push('병역 의무로 상무에 입대합니다. 2년간 국내 대회만 출전합니다.'); p.story.push({ year: state.year, text: '상무 입대' }); }
  // 계약 기간 차감
  if (p.sponsor) { p.sponsor.years--; if (p.sponsor.years <= 0) { season.notes.push(`${p.sponsor.brand} 후원 계약이 끝났습니다.`); p.sponsor = null; } }
  if (p.coach && !p.coach.academy) { p.coach.years--; if (p.coach.years <= 0) { season.notes.push(`${p.coach.name} 코치와의 계약이 끝났습니다.`); p.coach = { name: '임시 코치', tier: 1, mult: .95, fee: 15000, years: 99, academy: true }; } }
  // 이벤트
  const ev = pickEvent(state, season);
  if (ev) { state.event = ev; state.pending.push('event'); }
  // 제안
  const offers = makeOffers(state, season, false);
  if (offers.length) { state.offers = offers; state.pending.push('offers'); }
  // 은퇴 권고
  const adv = retirementAdvice(state);
  if (adv) { state.advice = adv; state.pending.push('advice'); }
  if (p.age >= 39 && p.pro) { state.advice = { reason: '39세. 몸이 더는 투어 일정을 버티지 못합니다.', forced: true }; if (!state.pending.includes('advice')) state.pending.push('advice'); }
}
function retirementAdvice(state) {
  const p = state.player; if (!p.pro) return null;
  const r = p.rank ?? 9999, o = overall(p);
  if (p.age >= 30 && (r > 300 || o < 68)) return { reason: `${p.age}세, 랭킹 ${r}위. 코치가 이제 다음 인생을 생각해 보자고 말합니다.`, forced: false };
  if (p.age >= 35 && r > 150) return { reason: `${p.age}세. 몸이 예전 같지 않고 후원 계약도 줄어듭니다.`, forced: false };
  return null;
}

// ───────────────────────── 액션 ─────────────────────────
export function nextStage(state) {
  if (state.stage === 'retired') return state;
  const next = state.pending.shift();
  if (!next) { state.stage = 'ready'; state.message = readyMessage(state); return state; }
  state.stage = next;
  return state;
}
function readyMessage(state) {
  const p = state.player;
  if (!p.pro) return `${state.year}년, ${p.age}세. 주니어 ${p.juniorRank ? `${p.juniorRank}위` : '무랭킹'}. 시즌 일정을 고르세요.`;
  return `${state.year}년, ${p.age}세. 세계 랭킹 ${p.rank ? `${p.rank}위` : '없음'} · 오버롤 ${overall(p)}. 시즌 일정을 고르세요.`;
}
export function applyAction(state, action) {
  const p = state.player;
  switch (action.type) {
    case 'playSeason': {
      if (state.stage !== 'ready') return state;
      const plans = availablePlans(state);
      const plan = plans.includes(action.plan) ? action.plan : plans[0];
      playSeason(state, plan);
      return state;
    }
    case 'continue': {
      if (state.stage === 'result') return nextStage(state);
      return state;
    }
    case 'resolveEvent': {
      if (state.stage !== 'event' || !state.event) return state;
      const opt = state.event.options.find(o => o.id === action.option) ?? state.event.options[0];
      let text = opt.result;
      let effect = opt.effect ?? {};
      if (opt.chance != null) { const ok = rand(state) < opt.chance; effect = ok ? opt.success : opt.fail; text = ok ? opt.result : opt.failResult; }
      applyEffect(state, effect);
      state.event.resolved = { label: opt.label, text };
      p.story.push({ year: state.year, text: `${state.event.title}: ${opt.label}` });
      state.lastSeason?.notes.push(`${state.event.title} → ${opt.label}. ${text}`);
      if (effect.newCoach) { state.offers = makeOffers(state, state.lastSeason, true); if (state.offers.length && !state.pending.includes('offers')) state.pending.unshift('offers'); }
      return nextStage(state);
    }
    case 'acceptOffer': {
      if (state.stage !== 'offers') return state;
      const o = state.offers.find(x => x.id === action.offer); if (!o) return state;
      if (o.kind === 'coach') {
        if (p.balance < o.fee * .5 && !p.coach.academy) { o.rejected = '선금을 낼 자금이 부족합니다.'; return state; }
        p.coach = { name: o.name, tier: o.tier, mult: o.mult, fee: o.fee, years: o.years, academy: false };
        state.lastSeason?.notes.push(`${o.name} 코치(${o.label})와 ${o.years}년 계약.`);
        p.story.push({ year: state.year, text: `${o.name} 코치 영입` });
        state.offers = state.offers.filter(x => x.kind !== 'coach');
      } else {
        p.sponsor = { brand: o.brand, fee: o.fee, years: o.years };
        state.lastSeason?.notes.push(`${o.brand}와 ${o.years}년 후원 계약(연 ${fmtMoney(o.fee)}).`);
        state.offers = state.offers.filter(x => x.kind !== 'sponsor');
      }
      if (!state.offers.length) return nextStage(state);
      return state;
    }
    case 'declineOffers': { if (state.stage !== 'offers') return state; state.offers = []; return nextStage(state); }
    case 'advice': {
      if (state.stage !== 'advice') return state;
      if (action.retire || state.advice?.forced) return retire(state);
      state.lastSeason?.notes.push('은퇴 권고를 거절하고 한 시즌 더 뜁니다.');
      return nextStage(state);
    }
    case 'retire': { if (!p.pro || p.age < 24) return state; return retire(state); }
    case 'buy': {
      const item = SHOP_MAP[action.item]; if (!item) return state;
      if (!p.shop.stock.includes(item.id) || p.shop.bought || p.balance < item.price) return state;
      p.balance -= item.price; p.spent += item.price; p.shop.owned.push(item.id); p.shop.bought = true;
      if (item.stat) p.attributes[item.stat] = Math.min(99, p.attributes[item.stat] + item.value);
      state.message = item.aging ? `${item.name}을(를) 샀어요. 나이가 들어도 기량이 덜 떨어져요.` : `${item.name}을(를) 샀어요. ${ATTR_LABELS[item.stat]}이(가) 올랐어요.`;
      return state;
    }
    case 'setFocus': { if (Array.isArray(action.focus)) p.focus = action.focus.filter(a => ATTRS.includes(a)).slice(0, 2); return state; }
    default: return state;
  }
}
function applyEffect(state, e) {
  const p = state.player;
  for (const a of ATTRS) if (e[a]) p.attributes[a] = clamp(p.attributes[a] + e[a], 20, 99);
  if (e.laterServe) p.serveRebuild = { year: state.year + 2, amount: e.laterServe };
  if (e.morale) p.morale = clamp(p.morale + e.morale, -5, 5);
  if (e.fame) p.fame = clamp(p.fame + e.fame, 0, 100);
  if (e.money) p.balance = Math.max(0, p.balance + e.money);
  if (e.durability) p.hidden.durability = clamp(p.hidden.durability + e.durability, .5, 1.6);
  if (e.doubles) p.doubles = true;
  if (e.style) { p.style = e.style; p.styleChanges++; }
  if (e.nationality) { p.nationalizedFrom = p.nationality; p.nationality = e.nationality; p.military = 'none'; }
  if (e.rival) { p.rival = { id: e.rival, name: e.rivalName }; }
  if (e.focus) p.focus = e.focus.slice(0, 2);
  if (e.mentalRisk) { if (rand(state) < .5) p.attributes.mental = Math.min(99, p.attributes.mental + 1); else p.morale = clamp(p.morale - 1, -5, 5); }
}
function retire(state) {
  const p = state.player;
  p.retired = true; state.stage = 'retired'; state.pending = [];
  p.story.push({ year: state.year, text: '은퇴' });
  state.summary = careerSummary(state);
  return state;
}
export function careerSummary(state) {
  const p = state.player, c = p.career;
  const seasons = state.history.filter(h => h.plan !== 'junior');
  const no1 = c.no1Years, gs = c.gs;
  const titleLabel = gs >= 10 ? '역대 최고의 선수 중 한 명' : gs >= 3 ? '그랜드슬램 챔피언' : no1 ? '세계 1위' : (p.peakRank ?? 9999) <= 10 ? '톱10 선수' : (p.peakRank ?? 9999) <= 100 ? '투어 프로' : (p.peakRank ?? 9999) <= 500 ? '챌린저 레벨 프로' : '퓨처스 프로';
  const tags = [];
  if (no1) tags.push('세계 1위'); if (gs) tags.push('그랜드슬램 챔피언'); if (c.olympic === '금메달') tags.push('올림픽 금메달'); if (c.asianGold) tags.push('아시안게임 금메달');
  if (p.hidden.curve === 'bloom' && p.hidden.bloomAge) tags.push('늦게 핀 꽃'); if (p.acl) tags.push('부상을 이겨낸 선수'); if (p.rival) tags.push(`${p.rival.name}의 라이벌`); if (p.nationalizedFrom) tags.push('귀화 선수');
  const story = p.story.map(s => `${s.year}년 · ${s.text}`);
  return { title: titleLabel, tags, story, seasons: seasons.length, gs, no1, peakRank: p.peakRank, titles: c.titles, m1000: c.m1000, wins: c.wins, losses: c.losses, prize: c.prize, earnings: p.earnings, retireAge: p.age, hiddenCurve: CURVE_LABELS[p.hidden.curve], potential: p.hidden.potential, potentialGrade: potentialGrade(p.hidden.potential), aging: agingProfile(p).type, records: p.records, awards: p.awards, allTime: compareAllTime(c) };
}
function compareAllTime(c) {
  return [
    { label: '그랜드슬램 단식 우승', mine: c.gs, record: 24, note: '역대 최다 24회' },
    { label: '연말 세계 1위', mine: c.no1Years, record: 8, note: '역대 최다 8회' },
    { label: '마스터스 1000 우승', mine: c.m1000, record: 40, note: '역대 최다 40회' },
    { label: '통산 단식 우승', mine: c.titles, record: 109, note: '역대 최다 109회' },
    { label: '통산 승수', mine: c.wins, record: 1274, note: '역대 최다 1,274승' },
  ];
}

// 명예의 전당 비교 키
export function hallOfFameEntry(state) {
  const p = state.player, s = state.summary ?? careerSummary(state);
  return { name: p.name, nationality: p.nationality, style: p.style, gs: s.gs, no1: s.no1, peakRank: s.peakRank ?? 9999, titles: s.titles, wins: s.wins, retireAge: s.retireAge, title: s.title, year: state.year };
}
export function compareHof(a, b) { return b.gs - a.gs || b.no1 - a.no1 || a.peakRank - b.peakRank || b.titles - a.titles || b.wins - a.wins; }

// 저장 파일 검증(가져오기용)
export function validState(s) {
  return !!(s && typeof s === 'object' && s.version === ENGINE_VERSION && s.player && s.player.attributes && ATTRS.every(a => Number.isFinite(s.player.attributes[a])) && s.world && Array.isArray(s.world.npcs) && Array.isArray(s.history) && s.rng && Number.isFinite(s.rng.s));
}
