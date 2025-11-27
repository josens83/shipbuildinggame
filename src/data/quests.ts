// 퀘스트 데이터

import type { Quest, QuestCategory, StoryChapter } from '../types/dialog';

// ============================================
// 메인 스토리 퀘스트
// ============================================

export const MAIN_QUESTS: Quest[] = [
  // 챕터 1: 새로운 시작
  {
    id: 'quest_first_contract',
    title: '첫 번째 계약',
    description: '조선소의 첫 번째 선박 건조 계약을 수주하세요.',
    category: 'story',
    type: 'main',
    objectives: [
      {
        id: 'obj_bid',
        description: '입찰에 참여하기',
        target: 1,
        current: 0,
        completed: false,
      },
      {
        id: 'obj_contract',
        description: '계약 체결하기',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'cash', amount: 5000000, description: '+$5M 보너스' },
      { type: 'reputation', amount: 5, description: '+5 평판' },
    ],
    startDialogId: 'story_intro_3',
    completeDialogId: 'story_first_contract_1',
    character: undefined, // secretary_kim을 런타임에 할당
  },
  {
    id: 'quest_first_ship',
    title: '첫 선박 건조',
    description: '첫 번째 선박을 성공적으로 건조하여 인도하세요.',
    category: 'story',
    type: 'main',
    objectives: [
      {
        id: 'obj_assign_dock',
        description: '도크에 계약 배정하기',
        target: 1,
        current: 0,
        completed: false,
      },
      {
        id: 'obj_complete_ship',
        description: '선박 건조 완료하기',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_first_contract'],
    rewards: [
      { type: 'cash', amount: 10000000, description: '+$10M 보너스' },
      { type: 'reputation', amount: 10, description: '+10 평판' },
      { type: 'achievement', itemId: 'ach_first_ship', description: '업적: 첫 번째 배' },
    ],
    completeDialogId: 'dialog_milestone_10ships',
  },
  {
    id: 'quest_reputation_50',
    title: '신뢰 구축',
    description: '평판을 50 이상으로 유지하세요.',
    category: 'reputation',
    type: 'main',
    objectives: [
      {
        id: 'obj_reputation',
        description: '평판 50 달성',
        target: 50,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_first_ship'],
    rewards: [
      { type: 'unlock', itemId: 'feature_large_dock', description: '대형 도크 건설 해금' },
      { type: 'reputation', amount: 5, description: '+5 평판 보너스' },
    ],
  },

  // 챕터 2: 성장
  {
    id: 'quest_10_ships',
    title: '본격적인 조선소',
    description: '총 10척의 선박을 건조하세요.',
    category: 'production',
    type: 'main',
    objectives: [
      {
        id: 'obj_ships',
        description: '선박 10척 건조',
        target: 10,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_reputation_50'],
    rewards: [
      { type: 'cash', amount: 50000000, description: '+$50M 보너스' },
      { type: 'reputation', amount: 15, description: '+15 평판' },
    ],
    completeDialogId: 'dialog_milestone_10ships',
  },
  {
    id: 'quest_first_research',
    title: '기술 혁신의 시작',
    description: '첫 번째 연구를 완료하세요.',
    category: 'research',
    type: 'main',
    objectives: [
      {
        id: 'obj_research',
        description: '연구 1개 완료',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_first_ship'],
    rewards: [
      { type: 'research', itemId: 'bonus_research_speed', description: '연구 속도 +10%' },
    ],
  },
  {
    id: 'quest_market_share_10',
    title: '시장 진출',
    description: '글로벌 시장 점유율 10%를 달성하세요.',
    category: 'market',
    type: 'main',
    objectives: [
      {
        id: 'obj_market',
        description: '시장 점유율 10% 달성',
        target: 10,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_10_ships'],
    rewards: [
      { type: 'unlock', itemId: 'feature_premium_customers', description: '프리미엄 고객 해금' },
      { type: 'cash', amount: 100000000, description: '+$100M 보너스' },
    ],
  },

  // 챕터 3: 도전
  {
    id: 'quest_compete_hyundai',
    title: '강자와의 대결',
    description: '현대중공업과 같은 계약에서 경쟁하여 승리하세요.',
    category: 'market',
    type: 'main',
    objectives: [
      {
        id: 'obj_compete',
        description: '경쟁 입찰에서 승리',
        target: 3,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_market_share_10'],
    requiredReputation: 60,
    rewards: [
      { type: 'reputation', amount: 20, description: '+20 평판' },
    ],
    startDialogId: 'story_competitor_warning_1',
  },
  {
    id: 'quest_reputation_80',
    title: '업계의 리더',
    description: '평판 80을 달성하세요.',
    category: 'reputation',
    type: 'main',
    objectives: [
      {
        id: 'obj_rep_80',
        description: '평판 80 달성',
        target: 80,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_compete_hyundai'],
    rewards: [
      { type: 'unlock', itemId: 'feature_mega_dock', description: '초대형 도크 건설 해금' },
      { type: 'cash', amount: 200000000, description: '+$200M 보너스' },
    ],
    completeDialogId: 'dialog_milestone_reputation_80',
  },

  // 챕터 4: 정상
  {
    id: 'quest_market_share_30',
    title: '글로벌 리더',
    description: '글로벌 시장 점유율 30%를 달성하세요.',
    category: 'market',
    type: 'main',
    objectives: [
      {
        id: 'obj_market_30',
        description: '시장 점유율 30% 달성',
        target: 30,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_reputation_80'],
    rewards: [
      { type: 'achievement', itemId: 'ach_global_leader', description: '업적: 글로벌 리더' },
      { type: 'cash', amount: 500000000, description: '+$500M 보너스' },
    ],
    completeDialogId: 'dialog_milestone_marketshare_20',
  },
  {
    id: 'quest_final_victory',
    title: '세계 1위',
    description: '시장 점유율 40%를 달성하고 업계 1위가 되세요.',
    category: 'story',
    type: 'main',
    objectives: [
      {
        id: 'obj_market_40',
        description: '시장 점유율 40% 달성',
        target: 40,
        current: 0,
        completed: false,
      },
      {
        id: 'obj_reputation_95',
        description: '평판 95 달성',
        target: 95,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    prerequisites: ['quest_market_share_30'],
    rewards: [
      { type: 'achievement', itemId: 'ach_world_champion', description: '업적: 세계 챔피언' },
    ],
  },
];

// ============================================
// 사이드 퀘스트
// ============================================

export const SIDE_QUESTS: Quest[] = [
  {
    id: 'quest_hire_workers',
    title: '인력 확충',
    description: '직원을 50명 이상 고용하세요.',
    category: 'production',
    type: 'side',
    objectives: [
      {
        id: 'obj_hire',
        description: '직원 50명 고용',
        target: 50,
        current: 0,
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'reputation', amount: 3, description: '+3 평판' },
    ],
  },
  {
    id: 'quest_build_dock',
    title: '시설 확장',
    description: '새로운 도크를 건설하세요.',
    category: 'expansion',
    type: 'side',
    objectives: [
      {
        id: 'obj_dock',
        description: '도크 1개 건설',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'cash', amount: 10000000, description: '+$10M 보너스' },
    ],
  },
  {
    id: 'quest_profit_month',
    title: '흑자 달성',
    description: '월 순이익 $10M 이상을 달성하세요.',
    category: 'finance',
    type: 'side',
    objectives: [
      {
        id: 'obj_profit',
        description: '월 순이익 $10M 달성',
        target: 10000000,
        current: 0,
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'reputation', amount: 5, description: '+5 평판' },
    ],
  },
  {
    id: 'quest_complete_research_3',
    title: '기술 선도',
    description: '연구를 3개 이상 완료하세요.',
    category: 'research',
    type: 'side',
    objectives: [
      {
        id: 'obj_research_3',
        description: '연구 3개 완료',
        target: 3,
        current: 0,
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'research', itemId: 'bonus_research_cost', description: '연구 비용 -10%' },
    ],
  },
  {
    id: 'quest_lng_ship',
    title: 'LNG선 건조',
    description: 'LNG 운반선을 건조하세요.',
    category: 'production',
    type: 'side',
    objectives: [
      {
        id: 'obj_lng',
        description: 'LNG선 1척 건조',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    requiredReputation: 60,
    rewards: [
      { type: 'reputation', amount: 10, description: '+10 평판' },
      { type: 'cash', amount: 30000000, description: '+$30M 보너스' },
    ],
  },
  {
    id: 'quest_cruise_ship',
    title: '크루즈선 건조',
    description: '고급 크루즈선을 건조하세요.',
    category: 'production',
    type: 'side',
    objectives: [
      {
        id: 'obj_cruise',
        description: '크루즈선 1척 건조',
        target: 1,
        current: 0,
        completed: false,
      },
    ],
    status: 'locked',
    requiredReputation: 75,
    rewards: [
      { type: 'reputation', amount: 15, description: '+15 평판' },
      { type: 'cash', amount: 50000000, description: '+$50M 보너스' },
    ],
  },
  {
    id: 'quest_no_debt',
    title: '무부채 경영',
    description: '부채를 완전히 상환하세요.',
    category: 'finance',
    type: 'side',
    objectives: [
      {
        id: 'obj_debt',
        description: '부채 0 달성',
        target: 0,
        current: 50000000, // 초기 부채
        completed: false,
      },
    ],
    status: 'available',
    rewards: [
      { type: 'reputation', amount: 10, description: '+10 평판' },
      { type: 'achievement', itemId: 'ach_debt_free', description: '업적: 무부채 경영' },
    ],
  },
];

// ============================================
// 일일 퀘스트
// ============================================

export const generateDailyQuests = (): Quest[] => {
  const dailyQuests: Quest[] = [
    {
      id: `daily_production_${Date.now()}`,
      title: '오늘의 생산 목표',
      description: '오늘 생산 진행률을 10% 이상 올리세요.',
      category: 'production',
      type: 'daily',
      objectives: [
        {
          id: 'obj_daily_prod',
          description: '생산 진행률 10% 증가',
          target: 10,
          current: 0,
          completed: false,
        },
      ],
      status: 'available',
      timeLimit: 1, // 1일
      rewards: [
        { type: 'cash', amount: 1000000, description: '+$1M' },
      ],
    },
    {
      id: `daily_minigame_${Date.now()}`,
      title: '미니게임 도전',
      description: '미니게임을 1회 플레이하세요.',
      category: 'production',
      type: 'daily',
      objectives: [
        {
          id: 'obj_daily_minigame',
          description: '미니게임 1회 플레이',
          target: 1,
          current: 0,
          completed: false,
        },
      ],
      status: 'available',
      timeLimit: 1,
      rewards: [
        { type: 'cash', amount: 500000, description: '+$500K' },
      ],
    },
  ];

  return dailyQuests;
};

// ============================================
// 스토리 챕터
// ============================================

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter_1',
    title: '새로운 시작',
    description: '조선소의 새로운 CEO로 취임하여 첫 발을 내딛습니다.',
    order: 1,
    status: 'available',
    quests: ['quest_first_contract', 'quest_first_ship', 'quest_reputation_50'],
    completionRewards: [
      { type: 'achievement', itemId: 'ach_chapter_1', description: '업적: 새로운 시작 완료' },
    ],
  },
  {
    id: 'chapter_2',
    title: '성장',
    description: '조선소를 확장하고 기술력을 높여갑니다.',
    order: 2,
    status: 'locked',
    quests: ['quest_10_ships', 'quest_first_research', 'quest_market_share_10'],
    prerequisites: ['chapter_1'],
    completionRewards: [
      { type: 'achievement', itemId: 'ach_chapter_2', description: '업적: 성장 완료' },
      { type: 'cash', amount: 100000000, description: '+$100M 보너스' },
    ],
  },
  {
    id: 'chapter_3',
    title: '도전',
    description: '강력한 경쟁사들과 맞서 싸웁니다.',
    order: 3,
    status: 'locked',
    quests: ['quest_compete_hyundai', 'quest_reputation_80'],
    prerequisites: ['chapter_2'],
    completionRewards: [
      { type: 'achievement', itemId: 'ach_chapter_3', description: '업적: 도전 완료' },
      { type: 'cash', amount: 200000000, description: '+$200M 보너스' },
    ],
  },
  {
    id: 'chapter_4',
    title: '정상',
    description: '세계 최고의 조선소를 향해 마지막 도전을 시작합니다.',
    order: 4,
    status: 'locked',
    quests: ['quest_market_share_30', 'quest_final_victory'],
    prerequisites: ['chapter_3'],
    completionRewards: [
      { type: 'achievement', itemId: 'ach_game_complete', description: '업적: 게임 클리어!' },
    ],
  },
];

// ============================================
// 헬퍼 함수
// ============================================

// 모든 퀘스트 가져오기
export const getAllQuests = (): Quest[] => {
  return [...MAIN_QUESTS, ...SIDE_QUESTS];
};

// ID로 퀘스트 찾기
export const getQuestById = (id: string): Quest | undefined => {
  return getAllQuests().find((quest) => quest.id === id);
};

// 카테고리별 퀘스트 가져오기
export const getQuestsByCategory = (category: QuestCategory): Quest[] => {
  return getAllQuests().filter((quest) => quest.category === category);
};

// 사용 가능한 퀘스트 가져오기
export const getAvailableQuests = (completedQuests: string[], reputation: number): Quest[] => {
  return getAllQuests().filter((quest) => {
    if (quest.status !== 'available' && quest.status !== 'locked') return false;

    // 선행 퀘스트 체크
    if (quest.prerequisites) {
      const hasAllPrerequisites = quest.prerequisites.every((preId) =>
        completedQuests.includes(preId)
      );
      if (!hasAllPrerequisites) return false;
    }

    // 평판 요구사항 체크
    if (quest.requiredReputation && reputation < quest.requiredReputation) {
      return false;
    }

    return true;
  });
};

// 챕터 찾기
export const getChapterById = (id: string): StoryChapter | undefined => {
  return STORY_CHAPTERS.find((chapter) => chapter.id === id);
};

// 현재 챕터 가져오기
export const getCurrentChapter = (completedChapters: string[]): StoryChapter | undefined => {
  return STORY_CHAPTERS.find((chapter) => {
    if (completedChapters.includes(chapter.id)) return false;
    if (chapter.prerequisites) {
      return chapter.prerequisites.every((preId) => completedChapters.includes(preId));
    }
    return chapter.status === 'available';
  });
};
