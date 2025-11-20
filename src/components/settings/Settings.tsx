import { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { Settings as SettingsIcon, Save, Bell, Volume2, RotateCcw, HelpCircle, Trash2, Database, Download, Upload, Keyboard } from 'lucide-react';
import { SaveManager } from '../../utils/saveManager';
import type { SaveSlotInfo } from '../../utils/saveManager';
import { format } from 'date-fns';
import { getShortcutDescriptions } from '../../hooks/useKeyboardShortcuts';
import { useDialog } from '../common/ConfirmDialog';

export default function Settings() {
  const {
    settings,
    updateSettings,
    resetSettings,
    resetTutorial,
    startTutorial,
    saveToSlot,
  } = useGameStore();

  const { success: successDialog, alert: alertDialog, confirm } = useDialog();

  const [slots, setSlots] = useState<SaveSlotInfo[]>([]);
  const [savingSlot, setSavingSlot] = useState<number | null>(null);

  useEffect(() => {
    refreshSlots();
  }, []);

  const refreshSlots = () => {
    const savedSlots = SaveManager.getAllSlots();
    setSlots(savedSlots.sort((a, b) => a.slotId - b.slotId));
  };

  const handleSaveToSlot = async (slotId: number) => {
    setSavingSlot(slotId);
    const success = saveToSlot(slotId);
    setTimeout(async () => {
      setSavingSlot(null);
      if (success) {
        refreshSlots();
        await successDialog('저장 완료', `슬롯 ${slotId + 1}에 저장되었습니다.`);
      } else {
        await alertDialog('저장 실패', '저장에 실패했습니다.');
      }
    }, 500);
  };

  const handleDeleteSlot = async (slotId: number) => {
    const confirmed = await confirm('슬롯 삭제', `슬롯 ${slotId + 1}의 저장 데이터를 삭제하시겠습니까?`);
    if (confirmed) {
      SaveManager.deleteSlot(slotId);
      refreshSlots();
    }
  };

  const getSlotInfo = (slotId: number): SaveSlotInfo | undefined => {
    return slots.find(s => s.slotId === slotId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount * 1_000_000);
  };

  const handleExportData = async () => {
    try {
      const allSlots = SaveManager.getAllSlots();
      const exportData: Record<string, unknown> = {
        version: '1.0.0',
        exportDate: new Date().toISOString(),
        slots: allSlots,
        slotData: {} as Record<string, unknown>,
      };

      // 각 슬롯의 데이터도 내보내기
      allSlots.forEach(slot => {
        const slotData = SaveManager.loadFromSlot(slot.slotId);
        if (slotData) {
          (exportData.slotData as Record<string, unknown>)[`slot_${slot.slotId}`] = slotData;
        }
      });

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `shipyard-tycoon-backup-${format(new Date(), 'yyyyMMdd-HHmmss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await successDialog('내보내기 완료', '저장 데이터를 내보냈습니다.');
    } catch (error) {
      console.error('Export failed:', error);
      await alertDialog('내보내기 실패', '데이터 내보내기에 실패했습니다.');
    }
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        const importData = JSON.parse(content);

        if (!importData.version || !importData.slotData) {
          await alertDialog('오류', '유효하지 않은 백업 파일입니다.');
          return;
        }

        const confirmed = await confirm(
          '데이터 가져오기',
          '기존 저장 데이터를 덮어쓰시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
        );
        if (!confirmed) {
          return;
        }

        // 각 슬롯 데이터 가져오기
        Object.entries(importData.slotData).forEach(([key, data]) => {
          const slotId = parseInt(key.replace('slot_', ''));
          if (!isNaN(slotId) && data) {
            SaveManager.saveToSlot(data as Partial<import('../../types').GameState>, slotId);
          }
        });

        refreshSlots();
        await successDialog('가져오기 완료', '저장 데이터를 가져왔습니다.\n시작 화면에서 불러오기를 선택하세요.');
      } catch (error) {
        console.error('Import failed:', error);
        await alertDialog('가져오기 실패', '데이터 가져오기에 실패했습니다.\n파일 형식을 확인하세요.');
      }
    };

    reader.readAsText(file);
    // Reset the input
    event.target.value = '';
  };

  const handleAutoSaveToggle = () => {
    updateSettings({ autoSaveEnabled: !settings.autoSaveEnabled });
  };

  const handleAutoSaveIntervalChange = (interval: number) => {
    updateSettings({ autoSaveInterval: interval });
  };

  const handleEventNotificationsToggle = () => {
    updateSettings({ showEventNotifications: !settings.showEventNotifications });
  };

  const handleAchievementNotificationsToggle = () => {
    updateSettings({ showAchievementNotifications: !settings.showAchievementNotifications });
  };

  const handleSoundToggle = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleMusicVolumeChange = (volume: number) => {
    updateSettings({ musicVolume: volume });
  };

  const handleSfxVolumeChange = (volume: number) => {
    updateSettings({ sfxVolume: volume });
  };

  const handleResetTutorial = () => {
    resetTutorial();
    startTutorial();
  };

  const handleResetSettings = async () => {
    const confirmed = await confirm('설정 초기화', '설정을 초기화하시겠습니까?');
    if (confirmed) {
      resetSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-gray-400" />
        <h1 className="text-2xl font-bold text-white">설정</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 저장 설정 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Save className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-semibold text-white">저장 설정</h2>
          </div>

          <div className="space-y-4">
            {/* 자동 저장 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">자동 저장</p>
                <p className="text-sm text-gray-400">주기적으로 게임을 자동 저장합니다</p>
              </div>
              <button
                onClick={handleAutoSaveToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.autoSaveEnabled ? 'bg-green-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.autoSaveEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 자동 저장 간격 */}
            {settings.autoSaveEnabled && (
              <div>
                <p className="text-white font-medium mb-2">저장 간격</p>
                <div className="flex gap-2">
                  {[30000, 60000, 120000, 300000].map((interval) => (
                    <button
                      key={interval}
                      onClick={() => handleAutoSaveIntervalChange(interval)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        settings.autoSaveInterval === interval
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {interval === 30000 && '30초'}
                      {interval === 60000 && '1분'}
                      {interval === 120000 && '2분'}
                      {interval === 300000 && '5분'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 알림 설정 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-yellow-400" />
            <h2 className="text-lg font-semibold text-white">알림 설정</h2>
          </div>

          <div className="space-y-4">
            {/* 이벤트 알림 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">이벤트 알림</p>
                <p className="text-sm text-gray-400">게임 이벤트 발생 시 알림 표시</p>
              </div>
              <button
                onClick={handleEventNotificationsToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.showEventNotifications ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.showEventNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 업적 알림 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">업적 알림</p>
                <p className="text-sm text-gray-400">업적 달성 시 알림 표시</p>
              </div>
              <button
                onClick={handleAchievementNotificationsToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.showAchievementNotifications ? 'bg-yellow-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.showAchievementNotifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* 소리 설정 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-white">소리 설정</h2>
          </div>

          <div className="space-y-4">
            {/* 소리 활성화 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">소리 활성화</p>
                <p className="text-sm text-gray-400">게임 사운드를 활성화합니다</p>
              </div>
              <button
                onClick={handleSoundToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 음악 볼륨 */}
            {settings.soundEnabled && (
              <>
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-white font-medium">음악 볼륨</p>
                    <span className="text-sm text-gray-400">{settings.musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume}
                    onChange={(e) => handleMusicVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* 효과음 볼륨 */}
                <div>
                  <div className="flex justify-between mb-2">
                    <p className="text-white font-medium">효과음 볼륨</p>
                    <span className="text-sm text-gray-400">{settings.sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sfxVolume}
                    onChange={(e) => handleSfxVolumeChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </>
            )}

            {!settings.soundEnabled && (
              <p className="text-sm text-gray-500 italic">
                * 사운드 기능은 추후 업데이트에서 지원될 예정입니다
              </p>
            )}
          </div>
        </div>

        {/* 기타 설정 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <RotateCcw className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">기타</h2>
          </div>

          <div className="space-y-4">
            {/* 튜토리얼 다시 보기 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">튜토리얼 다시 보기</p>
                <p className="text-sm text-gray-400">게임 튜토리얼을 다시 시작합니다</p>
              </div>
              <button
                onClick={handleResetTutorial}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                시작
              </button>
            </div>

            {/* 설정 초기화 */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">설정 초기화</p>
                <p className="text-sm text-gray-400">모든 설정을 기본값으로 복원합니다</p>
              </div>
              <button
                onClick={handleResetSettings}
                className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                초기화
              </button>
            </div>
          </div>
        </div>

        {/* 키보드 단축키 */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-semibold text-white">키보드 단축키</h2>
          </div>

          <div className="space-y-2">
            {getShortcutDescriptions().map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between py-1">
                <span className="text-gray-300">{shortcut.description}</span>
                <kbd className="px-2 py-1 bg-gray-700 text-gray-200 text-sm rounded border border-gray-600 font-mono">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 데이터 관리 */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg font-semibold text-white">데이터 관리</h2>
        </div>

        <div className="space-y-4">
          {/* 데이터 내보내기 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">데이터 내보내기</p>
              <p className="text-sm text-gray-400">모든 저장 슬롯을 JSON 파일로 백업</p>
            </div>
            <button
              onClick={handleExportData}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-sm rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              내보내기
            </button>
          </div>

          {/* 데이터 가져오기 */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">데이터 가져오기</p>
              <p className="text-sm text-gray-400">백업 파일에서 저장 데이터 복원</p>
            </div>
            <label className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-sm rounded-lg transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              가져오기
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* 저장 슬롯 관리 */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Save className="w-5 h-5 text-green-400" />
          <h2 className="text-lg font-semibold text-white">저장 슬롯 관리</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Array.from({ length: SaveManager.getMaxSlots() }, (_, i) => i).map((slotId) => {
            const slotInfo = getSlotInfo(slotId);
            const isSaving = savingSlot === slotId;

            return (
              <div
                key={slotId}
                className={`p-3 rounded-lg border transition-all ${
                  slotInfo
                    ? 'border-cyan-700 bg-cyan-900/20'
                    : 'border-gray-700 bg-gray-700/30'
                }`}
              >
                <div className="text-center mb-2">
                  <span className="text-xs font-semibold text-gray-400">슬롯 {slotId + 1}</span>
                </div>

                {slotInfo ? (
                  <div className="text-center">
                    <p className="text-sm font-medium text-white truncate" title={slotInfo.companyName}>
                      {slotInfo.companyName}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {format(new Date(slotInfo.currentDate), 'yy.MM.dd')}
                    </p>
                    <p className="text-xs text-green-400">
                      {formatCurrency(slotInfo.cash)}
                    </p>
                    <div className="flex gap-1 mt-2">
                      <button
                        onClick={() => handleSaveToSlot(slotId)}
                        disabled={isSaving}
                        className="flex-1 px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                      >
                        {isSaving ? '...' : '덮어쓰기'}
                      </button>
                      <button
                        onClick={() => handleDeleteSlot(slotId)}
                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-2">비어있음</p>
                    <button
                      onClick={() => handleSaveToSlot(slotId)}
                      disabled={isSaving}
                      className="w-full px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-xs rounded transition-colors disabled:opacity-50"
                    >
                      {isSaving ? '저장 중...' : '저장하기'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 버전 정보 */}
      <div className="text-center text-sm text-gray-500">
        <p>Shipyard Tycoon v1.0.0</p>
        <p>© 2025 Shipyard Tycoon. All rights reserved.</p>
      </div>
    </div>
  );
}
