// 토스트 컨테이너 컴포넌트

import { CheckCircle, AlertCircle, Info, Award, X } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { ToastDialog } from '../../types/dialog';

interface ToastContainerProps {
  toasts: ToastDialog[];
}

export default function ToastContainerComponent({ toasts }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

// 개별 토스트 아이템
function ToastItem({ toast }: { toast: ToastDialog }) {
  const { removeToast } = useDialogStore();

  const handleRemove = () => {
    removeToast(toast.id);
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    achievement: <Award className="w-5 h-5 text-yellow-400" />,
  };

  const backgrounds = {
    success: 'bg-green-900/90 border-green-600',
    error: 'bg-red-900/90 border-red-600',
    info: 'bg-blue-900/90 border-blue-600',
    achievement: 'bg-gradient-to-r from-yellow-900/90 to-amber-900/90 border-yellow-500',
  };

  const toastType = toast.toastType || 'info';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-xl backdrop-blur-sm animate-slide-in ${backgrounds[toastType]}`}
    >
      <div className="flex-shrink-0 mt-0.5">
        {toast.icon || icons[toastType]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400 hover:text-white" />
      </button>
    </div>
  );
}
