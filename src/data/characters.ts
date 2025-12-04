// 게임 캐릭터 데이터

import type { Character, CharacterRole } from '../types/dialog';

// ============================================
// 메인 캐릭터들
// ============================================

export const CHARACTERS: Record<string, Character> = {
  // 비서 - 튜토리얼 및 알림 담당
  secretary_kim: {
    id: 'secretary_kim',
    name: 'Secretary Kim',
    nameKo: '김서연',
    role: 'secretary',
    title: '비서실장',
    company: '플레이어 회사',
    avatar: '👩‍💼',
    color: '#3B82F6', // blue-500
    personality: '친절하고 유능한 비서. 모든 상황을 차분하게 설명해준다.',
  },

  // 부사장 - 주요 결정 조언
  vp_park: {
    id: 'vp_park',
    name: 'Vice President Park',
    nameKo: '박진우',
    role: 'secretary',
    title: '부사장',
    company: '플레이어 회사',
    avatar: '👨‍💼',
    color: '#6366F1', // indigo-500
    personality: '노련한 경영 전문가. 전략적 조언을 제공한다.',
  },

  // 노조 대표
  union_leader: {
    id: 'union_leader',
    name: 'Union Leader Lee',
    nameKo: '이철수',
    role: 'worker',
    title: '노조위원장',
    company: '플레이어 회사',
    avatar: '👷',
    color: '#EF4444', // red-500
    personality: '근로자 권익을 위해 싸우는 강직한 인물.',
  },

  // ============================================
  // 경쟁사 CEO들
  // ============================================

  ceo_hyundai: {
    id: 'ceo_hyundai',
    name: 'CEO Chung',
    nameKo: '정명석',
    role: 'competitor',
    title: 'CEO',
    company: 'Hyundai Heavy Industries',
    avatar: '🏭',
    color: '#0EA5E9', // sky-500
    personality: '공격적이고 야심찬 업계 1위의 CEO.',
  },

  ceo_samsung: {
    id: 'ceo_samsung',
    name: 'CEO Nam',
    nameKo: '남기홍',
    role: 'competitor',
    title: 'CEO',
    company: 'Samsung Heavy Industries',
    avatar: '🚢',
    color: '#1D4ED8', // blue-700
    personality: '기술 혁신을 중시하는 전략가.',
  },

  ceo_daewoo: {
    id: 'ceo_daewoo',
    name: 'CEO Jung',
    nameKo: '정성립',
    role: 'competitor',
    title: 'CEO',
    company: 'Daewoo Shipbuilding',
    avatar: '⚓',
    color: '#7C3AED', // violet-600
    personality: '위기 극복 전문가. 협력적인 태도를 보이기도 한다.',
  },

  ceo_cssc: {
    id: 'ceo_cssc',
    name: 'CEO Wang',
    nameKo: '왕젠',
    role: 'competitor',
    title: 'CEO',
    company: 'CSSC Holdings',
    avatar: '🐉',
    color: '#DC2626', // red-600
    personality: '중국 조선업의 거인. 가격 경쟁을 즐긴다.',
  },

  ceo_fincantieri: {
    id: 'ceo_fincantieri',
    name: 'CEO Bono',
    nameKo: '주세페 보노',
    role: 'competitor',
    title: 'CEO',
    company: 'Fincantieri',
    avatar: '🇮🇹',
    color: '#059669', // emerald-600
    personality: '크루즈선 전문가. 품질과 디자인을 중시한다.',
  },

  ceo_imabari: {
    id: 'ceo_imabari',
    name: 'CEO Higaki',
    nameKo: '히가키 유키토',
    role: 'competitor',
    title: 'CEO',
    company: 'Imabari Shipbuilding',
    avatar: '🇯🇵',
    color: '#E11D48', // rose-600
    personality: '일본 장인 정신의 대표. 꼼꼼하고 신중하다.',
  },

  // ============================================
  // 고객사 담당자들
  // ============================================

  customer_maersk: {
    id: 'customer_maersk',
    name: 'Director Jensen',
    nameKo: '클라우스 옌센',
    role: 'customer',
    title: '선박구매이사',
    company: 'Maersk Line',
    avatar: '🚛',
    color: '#0369A1', // sky-700
    personality: '세계 최대 해운사의 까다로운 구매 담당자.',
  },

  customer_msc: {
    id: 'customer_msc',
    name: 'Director Aponte',
    nameKo: '지안루이지 아폰테',
    role: 'customer',
    title: '함대관리이사',
    company: 'MSC',
    avatar: '🌊',
    color: '#0F766E', // teal-700
    personality: '빠른 결정을 선호하는 실용주의자.',
  },

  customer_cosco: {
    id: 'customer_cosco',
    name: 'Director Xu',
    nameKo: '쉬리룽',
    role: 'customer',
    title: '신조선부장',
    company: 'COSCO Shipping',
    avatar: '🇨🇳',
    color: '#B91C1C', // red-700
    personality: '대량 발주를 좋아하지만 가격 협상이 치열하다.',
  },

  customer_evergreen: {
    id: 'customer_evergreen',
    name: 'Director Chang',
    nameKo: '장롱밍',
    role: 'customer',
    title: '기술총괄',
    company: 'Evergreen Marine',
    avatar: '🌲',
    color: '#15803D', // green-700
    personality: '환경 친화적 선박에 관심이 많다.',
  },

  customer_hmm: {
    id: 'customer_hmm',
    name: 'Director Bae',
    nameKo: '배재훈',
    role: 'customer',
    title: '선박사업본부장',
    company: 'HMM',
    avatar: '🇰🇷',
    color: '#1E40AF', // blue-800
    personality: '국내 선사로서 좋은 관계를 유지하려 한다.',
  },

  customer_carnival: {
    id: 'customer_carnival',
    name: 'Director Arnold',
    nameKo: '아놀드 도널드',
    role: 'customer',
    title: '신조선담당',
    company: 'Carnival Corporation',
    avatar: '🎪',
    color: '#9333EA', // purple-600
    personality: '크루즈선 전문. 고급스러운 품질을 요구한다.',
  },

  // ============================================
  // 정부 및 기관
  // ============================================

  gov_minister: {
    id: 'gov_minister',
    name: 'Minister Kang',
    nameKo: '강정호',
    role: 'government',
    title: '산업통상자원부 장관',
    avatar: '🏛️',
    color: '#475569', // slate-600
    personality: '조선업 지원 정책을 담당하는 정부 관계자.',
  },

  gov_banker: {
    id: 'gov_banker',
    name: 'President Yoon',
    nameKo: '윤석훈',
    role: 'government',
    title: '한국산업은행 총재',
    company: 'KDB',
    avatar: '🏦',
    color: '#1E3A8A', // blue-900
    personality: '조선업 금융 지원을 결정하는 핵심 인물.',
  },

  // ============================================
  // 투자자
  // ============================================

  investor_fund: {
    id: 'investor_fund',
    name: 'Director Black',
    nameKo: '래리 블랙',
    role: 'investor',
    title: '운용본부장',
    company: 'Global Maritime Fund',
    avatar: '💰',
    color: '#CA8A04', // yellow-600
    personality: '해운/조선 투자 전문 펀드매니저.',
  },

  investor_vc: {
    id: 'investor_vc',
    name: 'Partner Lee',
    nameKo: '이민재',
    role: 'investor',
    title: '파트너',
    company: 'Horizon Ventures',
    avatar: '📈',
    color: '#16A34A', // green-600
    personality: '기술 혁신에 관심이 많은 VC 파트너.',
  },
};

// 역할별 캐릭터 조회
export const getCharactersByRole = (role: CharacterRole): Character[] => {
  return Object.values(CHARACTERS).filter((char) => char.role === role);
};

// ID로 캐릭터 조회
export const getCharacterById = (id: string): Character | undefined => {
  return CHARACTERS[id];
};

// 회사명으로 캐릭터 조회
export const getCharacterByCompany = (company: string): Character | undefined => {
  return Object.values(CHARACTERS).find((char) => char.company === company);
};

// 경쟁사 CEO 목록
export const COMPETITOR_CEOS = [
  'ceo_hyundai',
  'ceo_samsung',
  'ceo_daewoo',
  'ceo_cssc',
  'ceo_fincantieri',
  'ceo_imabari',
];

// 고객사 담당자 목록
export const CUSTOMER_CONTACTS = [
  'customer_maersk',
  'customer_msc',
  'customer_cosco',
  'customer_evergreen',
  'customer_hmm',
  'customer_carnival',
];

// 캐릭터 표정 이모지 매핑
export const EMOTION_EMOJIS: Record<string, Record<string, string>> = {
  secretary_kim: {
    neutral: '👩‍💼',
    happy: '😊',
    excited: '🤩',
    worried: '😟',
    angry: '😠',
    sad: '😢',
    surprised: '😲',
    thinking: '🤔',
  },
  vp_park: {
    neutral: '👨‍💼',
    happy: '😄',
    excited: '💪',
    worried: '😰',
    angry: '😤',
    sad: '😔',
    surprised: '😮',
    thinking: '🧐',
  },
  union_leader: {
    neutral: '👷',
    happy: '😊',
    excited: '✊',
    worried: '😥',
    angry: '😡',
    sad: '😞',
    surprised: '😯',
    thinking: '🤨',
  },
  // 기본 이모지 (다른 캐릭터용)
  default: {
    neutral: '😐',
    happy: '😊',
    excited: '🤩',
    worried: '😟',
    angry: '😠',
    sad: '😢',
    surprised: '😲',
    thinking: '🤔',
  },
};

// 캐릭터 표정 가져오기
export const getCharacterEmoji = (characterId: string, emotion: string): string => {
  const characterEmojis = EMOTION_EMOJIS[characterId] || EMOTION_EMOJIS.default;
  return characterEmojis[emotion] || characterEmojis.neutral || CHARACTERS[characterId]?.avatar || '👤';
};
