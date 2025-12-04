// 튜토리얼 대화 데이터

import type { Emotion } from '../types/dialog';

export interface TutorialDialogData {
  id: string;
  title: string;
  content: string;
  action?: string;
  characterId?: string;
  emotion?: Emotion;
  highlightElement?: string;
}

export const TUTORIAL_DIALOGS: TutorialDialogData[] = [
  {
    id: 'welcome',
    title: '🚢 조선소에 오신 것을 환영합니다!',
    content: '안녕하세요, 사장님! 저는 비서실장 김서연입니다.\n\n이 튜토리얼에서는 조선소 경영의 기본을 알려드리겠습니다. 세계 최고의 조선소를 만들어보세요!',
    characterId: 'secretary_kim',
    emotion: 'happy',
  },
  {
    id: 'dashboard',
    title: '📊 대시보드 소개',
    content: '대시보드에서는 조선소의 전체 현황을 한눈에 볼 수 있습니다.\n\n• 현금 및 재무 상태\n• 진행 중인 계약\n• 도크 현황\n• 평판과 시장 점유율',
    action: '대시보드 화면을 살펴보세요.',
    highlightElement: '[data-tutorial="dashboard"]',
  },
  {
    id: 'time_control',
    title: '⏰ 시간 조절',
    content: '게임 시간을 조절할 수 있습니다.\n\n• ⏸️ 일시정지: 전략을 세울 때\n• ▶️ 1x: 기본 속도\n• ⏩ 2x/3x: 빠른 진행\n\n스페이스바로 일시정지를 토글하고, 1/2/3 키로 속도를 변경할 수 있습니다.',
    action: '상단의 시간 조절 버튼을 눌러보세요.',
    highlightElement: '[data-tutorial="time-control"]',
  },
  {
    id: 'sales',
    title: '💼 영업 시스템',
    content: '영업 탭에서 새로운 선박 건조 계약을 수주할 수 있습니다.\n\n세계 각국의 선사들이 다양한 선박을 발주합니다. 적절한 가격으로 입찰하여 계약을 따내세요!',
    action: '좌측 메뉴에서 "영업"을 클릭하세요.',
    characterId: 'secretary_kim',
    emotion: 'neutral',
  },
  {
    id: 'bidding',
    title: '📝 입찰 방법',
    content: '입찰 시 고려할 사항:\n\n• 선박 건조 비용 (원가)\n• 경쟁사 입찰 현황\n• 고객사 관계도\n• 납기 일정\n\n너무 높으면 탈락하고, 너무 낮으면 손해를 볼 수 있습니다!',
    action: '입찰 기회를 확인하고 입찰 버튼을 눌러보세요.',
  },
  {
    id: 'contracts',
    title: '📋 계약 관리',
    content: '체결된 계약은 협상을 거쳐 최종 서명됩니다.\n\n• 계약금: 서명 시 받는 선수금\n• 중도금: 건조 진행에 따라 수령\n• 잔금: 인도 시 수령\n\n계약 조건을 잘 확인하세요!',
    characterId: 'secretary_kim',
    emotion: 'thinking',
  },
  {
    id: 'finance',
    title: '💰 재무 관리',
    content: '재무 탭에서 회사의 재무 상태를 관리합니다.\n\n• 현금 흐름 모니터링\n• 대출 및 상환\n• 재무제표 분석\n\n건전한 재무 상태를 유지하는 것이 중요합니다!',
    action: '좌측 메뉴에서 "재무"를 클릭하세요.',
  },
  {
    id: 'loans',
    title: '🏦 대출 시스템',
    content: '자금이 부족할 때는 대출을 받을 수 있습니다.\n\n• 신용한도: $100M\n• 이자율: 연 5%\n• 월별 이자 지급\n\n과도한 부채는 부도 위험을 높입니다!',
    characterId: 'secretary_kim',
    emotion: 'worried',
  },
  {
    id: 'production',
    title: '🏭 생산 관리',
    content: '생산 탭에서 선박 건조를 관리합니다.\n\n• 계약을 도크에 배정\n• 건조 진행률 모니터링\n• 인력 관리\n• 도크 확장',
    action: '좌측 메뉴에서 "생산"을 클릭하세요.',
  },
  {
    id: 'dock_assignment',
    title: '⚓ 도크 배정',
    content: '서명된 계약은 도크에 배정해야 건조가 시작됩니다.\n\n• 도크 크기와 선박 크기 확인\n• 도크 효율성 고려\n• 납기 일정 관리\n\n적절한 도크에 배정하여 효율을 높이세요!',
    action: '빈 도크에 계약을 배정해보세요.',
  },
  {
    id: 'workers',
    title: '👷 인력 관리',
    content: '숙련된 인력은 조선소의 핵심입니다.\n\n• 용접공, 조립공, 도장공 등\n• 숙련도가 높을수록 효율 증가\n• 사기가 낮으면 파업 위험\n\n적절한 인력 규모를 유지하세요!',
  },
  {
    id: 'research',
    title: '🔬 연구 개발',
    content: '연구 탭에서 새로운 기술을 개발합니다.\n\n• 생산 효율 향상\n• 품질 개선\n• 원가 절감\n• 건조 속도 증가\n\n기술 투자로 경쟁력을 높이세요!',
    action: '좌측 메뉴에서 "연구개발"을 클릭하세요.',
    characterId: 'secretary_kim',
    emotion: 'excited',
  },
  {
    id: 'market',
    title: '🌍 시장 분석',
    content: '시장 탭에서 경쟁 현황을 분석합니다.\n\n• 경쟁사 동향\n• 시장 점유율\n• 업계 트렌드\n\n경쟁사를 분석하고 전략을 세우세요!',
    action: '좌측 메뉴에서 "시장분석"을 클릭하세요.',
  },
  {
    id: 'achievements',
    title: '🏆 업적',
    content: '업적 탭에서 달성한 목표를 확인합니다.\n\n• 30개 이상의 업적\n• 달성 시 보상 획득\n• 희귀 업적 도전\n\n다양한 업적을 달성해보세요!',
  },
  {
    id: 'statistics',
    title: '📈 통계',
    content: '통계 탭에서 회사의 성과를 분석합니다.\n\n• 매출 추이\n• 생산량 변화\n• 시장 점유율 변화\n\n데이터를 분석하여 전략을 개선하세요!',
  },
  {
    id: 'complete',
    title: '🎉 튜토리얼 완료!',
    content: '축하합니다! 기본적인 조선소 경영 방법을 배웠습니다.\n\n이제 본격적으로 세계 최고의 조선소를 향해 도전하세요!\n\n도움이 필요하면 언제든 "도움말" 버튼을 눌러주세요.',
    characterId: 'secretary_kim',
    emotion: 'excited',
    action: '게임을 시작하세요!',
  },
];

// 특정 ID로 튜토리얼 대화 찾기
export const getTutorialDialogById = (id: string): TutorialDialogData | undefined => {
  return TUTORIAL_DIALOGS.find((dialog) => dialog.id === id);
};

// 튜토리얼 단계 수
export const TOTAL_TUTORIAL_STEPS = TUTORIAL_DIALOGS.length;
