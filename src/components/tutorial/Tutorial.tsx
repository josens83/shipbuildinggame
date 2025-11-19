import { useGameStore } from '../../store/gameStore';
import { TUTORIAL_STEPS } from '../../data/tutorial';
import { ChevronLeft, ChevronRight, X, HelpCircle, CheckCircle } from 'lucide-react';

export default function Tutorial() {
  const {
    showTutorial,
    tutorial,
    nextTutorialStep,
    prevTutorialStep,
    skipTutorial,
    completeTutorial,
  } = useGameStore();

  if (!showTutorial) return null;

  const currentStep = TUTORIAL_STEPS[tutorial.currentStep];
  const totalSteps = TUTORIAL_STEPS.length;
  const isFirstStep = tutorial.currentStep === 0;
  const isLastStep = tutorial.currentStep === totalSteps - 1;
  const progress = ((tutorial.currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      nextTutorialStep();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5" />
              <span className="text-sm font-medium">튜토리얼</span>
            </div>
            <button
              onClick={skipTutorial}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              title="튜토리얼 건너뛰기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 진행 바 */}
          <div className="w-full bg-white/30 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/80">
            <span>단계 {tutorial.currentStep + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* 내용 */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            {isLastStep ? (
              <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
            ) : (
              <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                {tutorial.currentStep + 1}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {currentStep.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {currentStep.content}
              </p>
            </div>
          </div>

          {/* 액션 힌트 */}
          {currentStep.action && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-700 font-medium">
                {currentStep.action}
              </p>
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <button
            onClick={skipTutorial}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            건너뛰기
          </button>

          <div className="flex items-center gap-2">
            {!isFirstStep && (
              <button
                onClick={prevTutorialStep}
                className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLastStep
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLastStep ? (
                <>
                  완료
                  <CheckCircle className="w-4 h-4" />
                </>
              ) : (
                <>
                  다음
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
