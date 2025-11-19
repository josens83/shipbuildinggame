import { useEffect, useCallback } from 'react';
import { create } from 'zustand';
import { CheckCircle, AlertCircle, Info, Award, X } from 'lucide-react';

// Toast 타입 정의
export type ToastType = 'success' | 'error' | 'info' | 'achievement';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

// Toast 스토어
interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }].slice(-5), // 최대 5개 유지
    }));
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },
  clearAll: () => {
    set({ toasts: [] });
  },
}));

// 토스트 훅
export const useToast = () => {
  const { addToast } = useToastStore();

  const toast = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    addToast({ type, title, message, duration });
  }, [addToast]);

  const success = useCallback((title: string, message?: string) => {
    toast('success', title, message, 3000);
  }, [toast]);

  const error = useCallback((title: string, message?: string) => {
    toast('error', title, message, 5000);
  }, [toast]);

  const info = useCallback((title: string, message?: string) => {
    toast('info', title, message, 4000);
  }, [toast]);

  const achievement = useCallback((title: string, message?: string) => {
    toast('achievement', title, message, 5000);
  }, [toast]);

  return { toast, success, error, info, achievement };
};

// 개별 토스트 아이템 컴포넌트
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  useEffect(() => {
    const duration = toast.duration || 4000;
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    achievement: <Award className="w-5 h-5 text-yellow-400" />,
  };

  const backgrounds = {
    success: 'bg-green-900/90 border-green-700',
    error: 'bg-red-900/90 border-red-700',
    info: 'bg-blue-900/90 border-blue-700',
    achievement: 'bg-yellow-900/90 border-yellow-700',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-slide-in ${backgrounds[toast.type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{toast.title}</p>
        {toast.message && (
          <p className="text-xs text-gray-300 mt-1">{toast.message}</p>
        )}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

// 토스트 컨테이너 컴포넌트
export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
