import type { GameState } from '../types';

const STORAGE_KEY = 'shipyard-tycoon-save';
const SLOTS_KEY = 'shipyard-tycoon-slots';
const MAX_SLOTS = 5;

let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

export interface SaveSlotInfo {
  slotId: number;
  companyName: string;
  savedAt: string;
  currentDate: string;
  difficulty: string;
  totalShipsBuilt: number;
  cash: number;
  reputation: number;
}

export class SaveManager {
  /**
   * 게임 상태 저장 (기본 슬롯)
   */
  static saveGame(state: Partial<GameState>): boolean {
    return SaveManager.saveToSlot(state, 0);
  }

  /**
   * 특정 슬롯에 게임 저장
   */
  static saveToSlot(state: Partial<GameState>, slotId: number): boolean {
    try {
      if (slotId < 0 || slotId >= MAX_SLOTS) return false;

      // 저장할 데이터 선택 (함수는 제외)
      const saveData = {
        companyName: state.companyName,
        difficulty: state.difficulty,
        currentDate: state.currentDate,
        gameSpeed: state.gameSpeed,
        financials: state.financials,
        creditLine: state.creditLine,
        creditUsed: state.creditUsed,
        docks: state.docks,
        workforce: state.workforce,
        contracts: state.contracts,
        customers: state.customers,
        availableBids: state.availableBids,
        totalShipsBuilt: state.totalShipsBuilt,
        totalRevenue: state.totalRevenue,
        reputation: state.reputation,
        marketShare: state.marketShare,
        events: state.events,
        researchProjects: state.researchProjects,
        activeResearchCount: state.activeResearchCount,
        competitors: state.competitors,
        achievements: state.achievements,
        statistics: state.statistics,
        tutorial: state.tutorial,
        settings: state.settings,
        gameEnd: state.gameEnd,
        savedAt: new Date().toISOString(),
      };

      const slotKey = `${STORAGE_KEY}-slot-${slotId}`;
      localStorage.setItem(slotKey, JSON.stringify(saveData));

      // 슬롯 인덱스 업데이트
      SaveManager.updateSlotIndex(slotId, state);

      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * 슬롯 인덱스 업데이트
   */
  private static updateSlotIndex(slotId: number, state: Partial<GameState>): void {
    const slots = SaveManager.getAllSlots();
    const slotInfo: SaveSlotInfo = {
      slotId,
      companyName: state.companyName || 'Unknown',
      savedAt: new Date().toISOString(),
      currentDate: state.currentDate ? new Date(state.currentDate).toISOString() : new Date().toISOString(),
      difficulty: state.difficulty || 'NORMAL',
      totalShipsBuilt: state.totalShipsBuilt || 0,
      cash: state.financials?.cash || 0,
      reputation: state.reputation || 0,
    };

    const existingIndex = slots.findIndex(s => s.slotId === slotId);
    if (existingIndex >= 0) {
      slots[existingIndex] = slotInfo;
    } else {
      slots.push(slotInfo);
    }

    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  }

  /**
   * 모든 저장 슬롯 정보 가져오기
   */
  static getAllSlots(): SaveSlotInfo[] {
    try {
      const slotsData = localStorage.getItem(SLOTS_KEY);
      if (!slotsData) return [];
      return JSON.parse(slotsData);
    } catch {
      return [];
    }
  }

  /**
   * 특정 슬롯에서 게임 불러오기
   */
  static loadFromSlot(slotId: number): Partial<GameState> | null {
    try {
      const slotKey = `${STORAGE_KEY}-slot-${slotId}`;
      const savedData = localStorage.getItem(slotKey);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData);

      // 날짜를 Date 객체로 변환
      if (parsed.currentDate) {
        parsed.currentDate = new Date(parsed.currentDate);
      }

      // 계약의 날짜들도 변환
      if (parsed.contracts) {
        parsed.contracts = parsed.contracts.map((contract: any) => ({
          ...contract,
          contractDate: contract.contractDate
            ? new Date(contract.contractDate)
            : undefined,
          deliveryDate: contract.deliveryDate
            ? new Date(contract.deliveryDate)
            : undefined,
        }));
      }

      // availableBids의 날짜들도 변환
      if (parsed.availableBids) {
        parsed.availableBids = parsed.availableBids.map((bid: any) => ({
          ...bid,
          contractDate: bid.contractDate ? new Date(bid.contractDate) : undefined,
          deliveryDate: bid.deliveryDate ? new Date(bid.deliveryDate) : undefined,
        }));
      }

      // 도크의 날짜들도 변환
      if (parsed.docks) {
        parsed.docks = parsed.docks.map((dock: any) => ({
          ...dock,
          lastMaintenance: dock.lastMaintenance
            ? new Date(dock.lastMaintenance)
            : undefined,
        }));
      }

      // 연구 프로젝트 날짜 변환
      if (parsed.researchProjects) {
        parsed.researchProjects = parsed.researchProjects.map((project: any) => ({
          ...project,
          startDate: project.startDate ? new Date(project.startDate) : undefined,
          completionDate: project.completionDate ? new Date(project.completionDate) : undefined,
        }));
      }

      // 통계 날짜 변환
      if (parsed.statistics) {
        parsed.statistics = parsed.statistics.map((stat: any) => ({
          ...stat,
          date: stat.date ? new Date(stat.date) : undefined,
        }));
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * 게임 상태 불러오기 (기본 슬롯 - 하위 호환성)
   */
  static loadGame(): Partial<GameState> | null {
    // 먼저 새로운 슬롯 시스템에서 시도
    const fromSlot = SaveManager.loadFromSlot(0);
    if (fromSlot) return fromSlot;

    // 레거시 저장 데이터 확인
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData);

      // 날짜를 Date 객체로 변환
      if (parsed.currentDate) {
        parsed.currentDate = new Date(parsed.currentDate);
      }

      // 계약의 날짜들도 변환
      if (parsed.contracts) {
        parsed.contracts = parsed.contracts.map((contract: any) => ({
          ...contract,
          contractDate: contract.contractDate
            ? new Date(contract.contractDate)
            : undefined,
          deliveryDate: contract.deliveryDate
            ? new Date(contract.deliveryDate)
            : undefined,
        }));
      }

      // availableBids의 날짜들도 변환
      if (parsed.availableBids) {
        parsed.availableBids = parsed.availableBids.map((bid: any) => ({
          ...bid,
          contractDate: bid.contractDate ? new Date(bid.contractDate) : undefined,
          deliveryDate: bid.deliveryDate ? new Date(bid.deliveryDate) : undefined,
        }));
      }

      // 도크의 날짜들도 변환
      if (parsed.docks) {
        parsed.docks = parsed.docks.map((dock: any) => ({
          ...dock,
          lastMaintenance: dock.lastMaintenance
            ? new Date(dock.lastMaintenance)
            : undefined,
        }));
      }

      return parsed;
    } catch (error) {
      console.error('Failed to load game:', error);
      return null;
    }
  }

  /**
   * 특정 슬롯 삭제
   */
  static deleteSlot(slotId: number): boolean {
    try {
      const slotKey = `${STORAGE_KEY}-slot-${slotId}`;
      localStorage.removeItem(slotKey);

      // 슬롯 인덱스에서도 제거
      const slots = SaveManager.getAllSlots();
      const filteredSlots = slots.filter(s => s.slotId !== slotId);
      localStorage.setItem(SLOTS_KEY, JSON.stringify(filteredSlots));

      return true;
    } catch {
      return false;
    }
  }

  /**
   * 저장된 게임 삭제 (레거시)
   */
  static deleteSave(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 저장된 게임 존재 여부 확인
   */
  static hasSavedGame(): boolean {
    const slots = SaveManager.getAllSlots();
    if (slots.length > 0) return true;
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /**
   * 특정 슬롯에 저장된 게임이 있는지 확인
   */
  static hasSlotData(slotId: number): boolean {
    const slotKey = `${STORAGE_KEY}-slot-${slotId}`;
    return localStorage.getItem(slotKey) !== null;
  }

  /**
   * 저장된 게임 정보 가져오기 (미리보기용)
   */
  static getSaveInfo(): { companyName: string; savedAt: string } | null {
    try {
      const slots = SaveManager.getAllSlots();
      if (slots.length > 0) {
        const mostRecent = slots.sort((a, b) =>
          new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()
        )[0];
        return {
          companyName: mostRecent.companyName,
          savedAt: mostRecent.savedAt,
        };
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) return null;

      const parsed = JSON.parse(savedData);
      return {
        companyName: parsed.companyName || 'Unknown',
        savedAt: parsed.savedAt || 'Unknown',
      };
    } catch {
      return null;
    }
  }

  /**
   * 최대 슬롯 수 반환
   */
  static getMaxSlots(): number {
    return MAX_SLOTS;
  }

  /**
   * 자동 저장 활성화
   */
  static enableAutoSave(getState: () => Partial<GameState>, interval: number = 60000): () => void {
    // 기존 타이머가 있으면 제거
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }

    autoSaveTimer = setInterval(() => {
      const state = getState();
      if (state.companyName) { // 게임이 시작된 경우에만 저장
        SaveManager.saveGame(state);
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      }
    }, interval);

    return () => {
      if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
      }
    };
  }

  /**
   * 자동 저장 비활성화
   */
  static disableAutoSave(): void {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
      autoSaveTimer = null;
      console.log('Auto-save disabled');
    }
  }
}
