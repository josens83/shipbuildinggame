// 스토리 대화 데이터

import type { Emotion, DialogChoice } from '../types/dialog';

export interface StoryDialogData {
  id: string;
  characterId: string;
  emotion?: Emotion;
  title: string;
  message: string;
  choices?: DialogChoice[];
  nextDialogId?: string;
}

// 스토리 대화 데이터베이스
export const STORY_DIALOGS: Record<string, StoryDialogData> = {
  // ============================================
  // 챕터 1: 새로운 시작
  // ============================================

  // 게임 시작 대화
  story_intro_1: {
    id: 'story_intro_1',
    characterId: 'secretary_kim',
    emotion: 'happy',
    title: '새로운 CEO의 첫 출근',
    message: '사장님, 좋은 아침입니다! 오늘부터 이 조선소의 새로운 CEO로 취임하셨습니다.\n\n저는 비서실장 김서연입니다. 앞으로 사장님을 보좌하겠습니다.',
    nextDialogId: 'story_intro_2',
  },

  story_intro_2: {
    id: 'story_intro_2',
    characterId: 'secretary_kim',
    emotion: 'neutral',
    title: '현재 상황 브리핑',
    message: '현재 우리 조선소의 상황을 말씀드리겠습니다.\n\n• 현금: $50M\n• 부채: $50M\n• 도크: 2개 (중형 1, 소형 1)\n• 직원: 약 330명\n\n어려운 상황이지만, 잠재력은 충분합니다!',
    nextDialogId: 'story_intro_3',
  },

  story_intro_3: {
    id: 'story_intro_3',
    characterId: 'secretary_kim',
    emotion: 'thinking',
    title: '첫 번째 목표',
    message: '먼저 첫 번째 계약을 수주하는 것이 목표입니다.\n\n영업 탭에서 현재 입찰 가능한 계약들을 확인해보시겠습니까?',
    choices: [
      {
        id: 'choice_yes',
        text: '네, 바로 확인하겠습니다',
        consequence: '영업 탭으로 이동합니다.',
      },
      {
        id: 'choice_later',
        text: '나중에 확인할게요',
        consequence: '자유롭게 탐색합니다.',
      },
    ],
  },

  // ============================================
  // 첫 계약 관련
  // ============================================

  story_first_contract_1: {
    id: 'story_first_contract_1',
    characterId: 'secretary_kim',
    emotion: 'excited',
    title: '첫 계약 수주!',
    message: '축하합니다, 사장님! 첫 번째 계약을 수주했습니다!\n\n이제 본격적으로 선박 건조를 시작할 수 있습니다. 도크에 계약을 배정해주세요.',
    nextDialogId: 'story_first_contract_2',
  },

  story_first_contract_2: {
    id: 'story_first_contract_2',
    characterId: 'secretary_kim',
    emotion: 'neutral',
    title: '도크 배정 안내',
    message: '생산 탭에서 계약을 도크에 배정하면 건조가 시작됩니다.\n\n선박 크기에 맞는 도크를 선택하는 것이 중요합니다!',
  },

  // ============================================
  // 경쟁사 이벤트
  // ============================================

  story_competitor_warning_1: {
    id: 'story_competitor_warning_1',
    characterId: 'vp_park',
    emotion: 'worried',
    title: '경쟁사 동향 보고',
    message: '사장님, 현대중공업이 공격적으로 시장 점유율을 확대하고 있습니다.\n\n최근 대형 컨테이너선 수주를 연달아 성공시켰습니다.',
    nextDialogId: 'story_competitor_warning_2',
  },

  story_competitor_warning_2: {
    id: 'story_competitor_warning_2',
    characterId: 'vp_park',
    emotion: 'thinking',
    title: '대응 전략 제안',
    message: '어떻게 대응하시겠습니까?',
    choices: [
      {
        id: 'choice_aggressive',
        text: '가격 경쟁으로 맞서겠습니다',
        consequence: '입찰 경쟁력 +10%, 수익성 -5%',
      },
      {
        id: 'choice_quality',
        text: '품질로 차별화하겠습니다',
        consequence: '평판 +5, 연구 속도 +10%',
      },
      {
        id: 'choice_niche',
        text: '틈새 시장을 공략하겠습니다',
        consequence: '특수선 수주 확률 +20%',
      },
    ],
  },

  // ============================================
  // 현대중공업 CEO 대화
  // ============================================

  dialog_hyundai_ceo_1: {
    id: 'dialog_hyundai_ceo_1',
    characterId: 'ceo_hyundai',
    emotion: 'neutral',
    title: '업계 행사에서의 만남',
    message: '안녕하십니까, 새로 부임하신 CEO시군요.\n\n저는 현대중공업의 정명석입니다. 업계에 오신 것을 환영합니다.',
    nextDialogId: 'dialog_hyundai_ceo_2',
  },

  dialog_hyundai_ceo_2: {
    id: 'dialog_hyundai_ceo_2',
    characterId: 'ceo_hyundai',
    emotion: 'thinking',
    title: '경고의 메시지',
    message: '조선업은 치열한 경쟁의 세계입니다. 적자생존이죠.\n\n살아남으려면... 최선을 다하셔야 할 겁니다.',
    choices: [
      {
        id: 'choice_confident',
        text: '도전을 기대하고 있습니다',
        consequence: '현대중공업 CEO와의 관계: 라이벌',
      },
      {
        id: 'choice_humble',
        text: '많이 배우겠습니다',
        consequence: '현대중공업 CEO와의 관계: 우호적',
      },
      {
        id: 'choice_aggressive',
        text: '조만간 추월하겠습니다',
        consequence: '현대중공업 CEO와의 관계: 적대적, 경쟁 심화',
      },
    ],
  },

  // ============================================
  // 삼성중공업 협력 제안
  // ============================================

  dialog_samsung_coop_1: {
    id: 'dialog_samsung_coop_1',
    characterId: 'ceo_samsung',
    emotion: 'happy',
    title: '삼성중공업의 제안',
    message: '안녕하세요, 삼성중공업의 남기홍입니다.\n\n귀사와 기술 협력을 제안드리고 싶습니다.',
    nextDialogId: 'dialog_samsung_coop_2',
  },

  dialog_samsung_coop_2: {
    id: 'dialog_samsung_coop_2',
    characterId: 'ceo_samsung',
    emotion: 'neutral',
    title: '협력 조건',
    message: 'LNG 추진 기술 공동 개발을 제안합니다.\n\n• 연구 비용 50% 분담\n• 기술 공유\n• 3년간 비경쟁 조항',
    choices: [
      {
        id: 'choice_accept',
        text: '좋은 제안입니다. 수락하겠습니다.',
        consequence: 'LNG 연구 비용 -50%, 삼성과 협력 관계',
      },
      {
        id: 'choice_negotiate',
        text: '조건을 조정하고 싶습니다.',
        consequence: '협상 진행',
      },
      {
        id: 'choice_reject',
        text: '독자 기술 개발을 하겠습니다.',
        consequence: '독립성 유지, 연구 비용 100%',
      },
    ],
  },

  // ============================================
  // 고객사 대화
  // ============================================

  dialog_maersk_inquiry_1: {
    id: 'dialog_maersk_inquiry_1',
    characterId: 'customer_maersk',
    emotion: 'neutral',
    title: 'Maersk의 문의',
    message: '안녕하세요, Maersk의 클라우스 옌센입니다.\n\n대형 컨테이너선 시리즈 발주를 검토 중입니다. 귀사의 역량에 대해 듣고 싶습니다.',
    choices: [
      {
        id: 'choice_pitch',
        text: '최신 기술과 품질을 자랑합니다',
        consequence: 'PT 기회 획득',
      },
      {
        id: 'choice_price',
        text: '경쟁력 있는 가격을 제시하겠습니다',
        consequence: '가격 협상 시작',
      },
      {
        id: 'choice_reference',
        text: '기존 고객 만족도를 보여드리겠습니다',
        consequence: '신뢰도 검증',
      },
    ],
  },

  // ============================================
  // 노조 이벤트
  // ============================================

  dialog_union_demand_1: {
    id: 'dialog_union_demand_1',
    characterId: 'union_leader',
    emotion: 'angry',
    title: '노조의 요구',
    message: '사장님, 노조위원장 이철수입니다.\n\n직원들의 처우 개선을 요구합니다. 임금 5% 인상과 복지 확대가 필요합니다.',
    choices: [
      {
        id: 'choice_accept_all',
        text: '요구를 전부 수용하겠습니다',
        consequence: '인건비 +5%, 사기 +20',
      },
      {
        id: 'choice_negotiate',
        text: '협상을 통해 절충안을 찾읍시다',
        consequence: '협상 진행',
      },
      {
        id: 'choice_reject',
        text: '현재 상황에서는 어렵습니다',
        consequence: '사기 -15, 파업 위험',
      },
    ],
  },

  dialog_union_strike_warning: {
    id: 'dialog_union_strike_warning',
    characterId: 'union_leader',
    emotion: 'angry',
    title: '파업 경고',
    message: '사장님, 이대로는 협상이 안 됩니다.\n\n24시간 내에 답변이 없으면 파업을 시작하겠습니다!',
    choices: [
      {
        id: 'choice_emergency_meeting',
        text: '긴급 협상 회의를 열겠습니다',
        consequence: '긴급 협상 시작',
      },
      {
        id: 'choice_final_offer',
        text: '최종 제안을 하겠습니다',
        consequence: '최종 협상',
      },
    ],
  },

  // ============================================
  // 정부 이벤트
  // ============================================

  dialog_gov_support_1: {
    id: 'dialog_gov_support_1',
    characterId: 'gov_minister',
    emotion: 'happy',
    title: '정부 지원 발표',
    message: '안녕하세요, 산업통상자원부 장관 강정호입니다.\n\n조선업 활성화를 위한 정부 지원 정책을 발표합니다.',
    nextDialogId: 'dialog_gov_support_2',
  },

  dialog_gov_support_2: {
    id: 'dialog_gov_support_2',
    characterId: 'gov_minister',
    emotion: 'neutral',
    title: '지원 내용',
    message: '다음 지원 프로그램 중 하나를 선택하실 수 있습니다:\n\n1. R&D 보조금 ($10M)\n2. 저금리 대출 (금리 2%)\n3. 고용 보조금 (인건비 10% 지원)',
    choices: [
      {
        id: 'choice_rd',
        text: 'R&D 보조금을 신청합니다',
        consequence: '연구 자금 +$10M',
      },
      {
        id: 'choice_loan',
        text: '저금리 대출을 신청합니다',
        consequence: '대출 이자율 2%로 감소',
      },
      {
        id: 'choice_employment',
        text: '고용 보조금을 신청합니다',
        consequence: '인건비 10% 절감',
      },
    ],
  },

  // ============================================
  // 투자자 이벤트
  // ============================================

  dialog_investor_offer_1: {
    id: 'dialog_investor_offer_1',
    characterId: 'investor_fund',
    emotion: 'neutral',
    title: '투자 제안',
    message: '안녕하세요, Global Maritime Fund의 래리 블랙입니다.\n\n귀사에 대한 투자를 검토하고 있습니다. 관심 있으시면 미팅을 잡으시죠.',
    choices: [
      {
        id: 'choice_interested',
        text: '관심 있습니다. 미팅을 잡죠.',
        consequence: '투자 협상 시작',
      },
      {
        id: 'choice_not_now',
        text: '지금은 시기가 아닌 것 같습니다.',
        consequence: '기회 보류',
      },
    ],
  },

  // ============================================
  // 마일스톤 대화
  // ============================================

  dialog_milestone_10ships: {
    id: 'dialog_milestone_10ships',
    characterId: 'secretary_kim',
    emotion: 'excited',
    title: '10척 건조 달성!',
    message: '사장님, 축하드립니다!\n\n드디어 10척 건조를 달성했습니다! 우리 조선소가 인정받기 시작했습니다.',
  },

  dialog_milestone_reputation_80: {
    id: 'dialog_milestone_reputation_80',
    characterId: 'secretary_kim',
    emotion: 'happy',
    title: '평판 80 달성!',
    message: '사장님, 우리 조선소의 평판이 80점을 넘었습니다!\n\n이제 대형 선사들도 우리를 주목하고 있습니다.',
  },

  dialog_milestone_marketshare_20: {
    id: 'dialog_milestone_marketshare_20',
    characterId: 'vp_park',
    emotion: 'excited',
    title: '시장 점유율 20% 돌파!',
    message: '사장님, 놀라운 성과입니다!\n\n글로벌 시장 점유율이 20%를 돌파했습니다. 이제 진정한 강자로 부상했습니다!',
  },

  // ============================================
  // 위기 이벤트
  // ============================================

  dialog_crisis_cashflow: {
    id: 'dialog_crisis_cashflow',
    characterId: 'vp_park',
    emotion: 'worried',
    title: '긴급: 현금 위기',
    message: '사장님, 심각한 상황입니다.\n\n현금이 바닥나고 있습니다. 긴급 조치가 필요합니다!',
    choices: [
      {
        id: 'choice_loan',
        text: '긴급 대출을 받겠습니다',
        consequence: '대출 +$20M, 이자 부담 증가',
      },
      {
        id: 'choice_cost_cut',
        text: '비용 절감을 단행합니다',
        consequence: '운영비 -20%, 사기 -10',
      },
      {
        id: 'choice_asset_sale',
        text: '자산을 매각합니다',
        consequence: '도크 1개 매각, 현금 +$30M',
      },
    ],
  },

  dialog_crisis_reputation: {
    id: 'dialog_crisis_reputation',
    characterId: 'secretary_kim',
    emotion: 'worried',
    title: '평판 위기',
    message: '사장님, 품질 문제로 인해 평판이 급락하고 있습니다.\n\n긴급 대응이 필요합니다.',
    choices: [
      {
        id: 'choice_recall',
        text: '전면 리콜을 실시합니다',
        consequence: '비용 +$10M, 평판 회복 +15',
      },
      {
        id: 'choice_pr',
        text: 'PR 캠페인을 진행합니다',
        consequence: '비용 +$5M, 평판 회복 +8',
      },
      {
        id: 'choice_ignore',
        text: '시간이 해결해줄 것입니다',
        consequence: '평판 계속 하락 위험',
      },
    ],
  },
};

// ID로 스토리 대화 조회
export const getStoryDialogById = (id: string): StoryDialogData | undefined => {
  return STORY_DIALOGS[id];
};

// 캐릭터별 대화 조회
export const getDialogsByCharacter = (characterId: string): StoryDialogData[] => {
  return Object.values(STORY_DIALOGS).filter(
    (dialog) => dialog.characterId === characterId
  );
};
