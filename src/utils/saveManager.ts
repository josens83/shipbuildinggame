import type { GameState } from '../types';

const STORAGE_KEY = 'shipyard-tycoon-save';

let autoSaveTimer: ReturnType<typeof setInterval> | null = null;

export class SaveManager {
  /**
   * 게임 상태 저장
   */
  static saveGame(state: Partial<GameState>): boolean {
    try {
      // 저장할 데이터 선택 (함수는 제외)
      const saveData = {
        companyName: state.companyName,
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
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      return false;
    }
  }

  /**
   * 게임 상태 불러오기
   */
  static loadGame(): Partial<GameState> | null {
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
   * 저장된 게임 삭제
   */
  static deleteSave(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  /**
   * 저장된 게임 존재 여부 확인
   */
  static hasSavedGame(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  }

  /**
   * 저장된 게임 정보 가져오기 (미리보기용)
   */
  static getSaveInfo(): { companyName: string; savedAt: string } | null {
    try {
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
