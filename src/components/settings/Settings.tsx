import { useGameStore } from '../../store/gameStore';
import { Settings as SettingsIcon, Save, Bell, Volume2, RotateCcw, HelpCircle } from 'lucide-react';

export default function Settings() {
  const {
    settings,
    updateSettings,
    resetSettings,
    resetTutorial,
    startTutorial,
  } = useGameStore();

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

  const handleResetSettings = () => {
    if (window.confirm('설정을 초기화하시겠습니까?')) {
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
      </div>

      {/* 버전 정보 */}
      <div className="text-center text-sm text-gray-500">
        <p>Shipyard Tycoon v1.0.0</p>
        <p>© 2025 Shipyard Tycoon. All rights reserved.</p>
      </div>
    </div>
  );
}
