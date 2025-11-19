import type { TutorialStep } from '../types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'WELCOME',
    title: '조선소 타이쿤에 오신 것을 환영합니다!',
    content: '이 게임에서 당신은 조선소의 CEO가 되어 세계적인 조선 기업을 키워나가게 됩니다. 영업, 재무, 생산을 관리하며 경쟁사들과 치열한 경쟁을 펼치세요.',
    action: '다음 버튼을 클릭하여 계속하세요',
  },
  {
    id: 'DASHBOARD',
    title: '대시보드 - 회사 현황 한눈에 보기',
    content: '대시보드에서는 회사의 주요 지표를 한눈에 확인할 수 있습니다. 현금, 평판, 부채비율, 진행 중인 계약 등 경영에 필요한 핵심 정보가 표시됩니다.',
    target: 'dashboard',
    action: '대시보드의 각 카드를 살펴보세요',
  },
  {
    id: 'TIME_CONTROL',
    title: '시간 조절',
    content: '화면 상단의 시간 컨트롤로 게임 속도를 조절할 수 있습니다. ▶ 버튼으로 재생/일시정지, 속도 버튼(1x, 2x, 3x)으로 빠르게 진행할 수 있습니다.',
    target: 'time-control',
    action: '시간을 일시정지하거나 속도를 변경해보세요',
  },
  {
    id: 'SALES',
    title: '영업 - 수주 확보하기',
    content: '영업 메뉴에서는 새로운 선박 건조 계약을 확보할 수 있습니다. 다양한 선사들의 입찰에 참여하여 계약을 따내세요.',
    target: 'nav-sales',
    action: '좌측 메뉴에서 "영업"을 클릭하세요',
  },
  {
    id: 'BIDDING',
    title: '입찰 참여하기',
    content: '입찰 기회 탭에서 현재 공개된 입찰들을 확인할 수 있습니다. 선박 사양, 고객사 정보, 예상 비용을 분석하고 경쟁력 있는 가격으로 입찰하세요.',
    target: 'bid-opportunities',
    action: '입찰 기회를 선택하고 "입찰 참여" 버튼을 클릭하세요',
  },
  {
    id: 'CONTRACTS',
    title: '계약 관리',
    content: '낙찰된 계약은 "진행중 계약" 탭에서 관리됩니다. 계약금, 중도금, 잔금 일정을 확인하고 납기를 준수하세요. 납기 지연 시 페널티가 발생합니다.',
    target: 'active-contracts',
    action: '계약 목록에서 계약 상세 정보를 확인하세요',
  },
  {
    id: 'FINANCE',
    title: '재무 관리',
    content: '재무 메뉴에서는 회사의 재무 상태를 분석할 수 있습니다. 손익계산서, 재무상태표, 현금흐름표를 통해 수익성과 안정성을 모니터링하세요.',
    target: 'nav-finance',
    action: '"재무" 메뉴를 클릭하세요',
  },
  {
    id: 'LOANS',
    title: '대출 관리',
    content: '자금이 부족할 때는 대출을 활용하세요. 하지만 이자 비용에 주의하고, 부채비율이 너무 높아지지 않도록 관리해야 합니다.',
    target: 'loan-section',
    action: '필요시 대출을 실행하거나 상환하세요',
  },
  {
    id: 'PRODUCTION',
    title: '생산 관리 - 도크 운영',
    content: '생산 메뉴에서는 도크와 인력을 관리합니다. 계약된 선박을 도크에 배정하여 건조를 시작하세요. 도크 크기와 효율이 생산성에 영향을 미칩니다.',
    target: 'nav-production',
    action: '"생산" 메뉴를 클릭하세요',
  },
  {
    id: 'DOCK_ASSIGNMENT',
    title: '도크 배정',
    content: '계약된 선박을 적합한 크기의 도크에 배정해야 건조가 시작됩니다. 도크에 선박이 배정되면 자동으로 건조가 진행됩니다.',
    target: 'dock-list',
    action: '빈 도크를 선택하고 대기 중인 계약을 배정하세요',
  },
  {
    id: 'WORKERS',
    title: '인력 관리',
    content: '작업자 탭에서 용접공, 조립공, 도장공, 전기공, 엔지니어를 채용하고 관리합니다. 숙련된 인력은 생산 효율을 높이고 품질을 향상시킵니다.',
    target: 'workers-tab',
    action: '인력 현황을 확인하고 필요시 채용하세요',
  },
  {
    id: 'RESEARCH',
    title: '연구 개발',
    content: '연구개발 메뉴에서는 새로운 기술을 연구할 수 있습니다. 연구 완료 시 생산 효율, 품질, 원가 절감 등 다양한 보너스를 얻을 수 있습니다.',
    target: 'nav-research',
    action: '"연구개발" 메뉴를 클릭하세요',
  },
  {
    id: 'MARKET',
    title: '시장 분석',
    content: '시장분석 메뉴에서는 경쟁사 현황과 시장 점유율을 확인할 수 있습니다. 경쟁사의 강점과 약점을 분석하여 전략을 수립하세요.',
    target: 'nav-market',
    action: '"시장분석" 메뉴를 클릭하세요',
  },
  {
    id: 'ACHIEVEMENTS',
    title: '업적',
    content: '업적 메뉴에서는 다양한 목표와 달성 현황을 확인할 수 있습니다. 업적을 달성하면 현금과 평판 보상을 받을 수 있습니다.',
    target: 'nav-achievements',
    action: '"업적" 메뉴를 클릭하세요',
  },
  {
    id: 'STATISTICS',
    title: '통계',
    content: '통계 메뉴에서는 시간에 따른 회사의 성장을 차트로 확인할 수 있습니다. 재무, 생산, 인력, 시장 점유율 등 다양한 지표를 분석하세요.',
    target: 'nav-statistics',
    action: '"통계" 메뉴를 클릭하세요',
  },
  {
    id: 'COMPLETE',
    title: '튜토리얼 완료!',
    content: '축하합니다! 기본적인 게임 플레이를 배웠습니다. 이제 본격적으로 조선소를 운영해보세요. 화면 우측 상단의 ? 버튼을 클릭하면 언제든 튜토리얼을 다시 볼 수 있습니다.',
    action: '게임을 시작하세요!',
  },
];

export const getTutorialStepById = (id: string): TutorialStep | undefined => {
  return TUTORIAL_STEPS.find(step => step.id === id);
};

export const getNextTutorialStep = (currentIndex: number): TutorialStep | undefined => {
  if (currentIndex < TUTORIAL_STEPS.length - 1) {
    return TUTORIAL_STEPS[currentIndex + 1];
  }
  return undefined;
};
