import { create } from 'zustand';
import { AlertTriangle, Info, CheckCircle, HelpCircle, X } from 'lucide-react';

type DialogType = 'info' | 'warning' | 'success' | 'confirm';

interface DialogState {
  isOpen: boolean;
  type: DialogType;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
}

interface DialogActions {
  showDialog: (options: {
    type?: DialogType;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  closeDialog: () => void;
}

const initialState: DialogState = {
  isOpen: false,
  type: 'info',
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  onConfirm: null,
  onCancel: null,
};

export const useDialogStore = create<DialogState & DialogActions>((set) => ({
  ...initialState,
  showDialog: (options) => {
    set({
      isOpen: true,
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      confirmText: options.confirmText || '확인',
      cancelText: options.cancelText || '취소',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || null,
    });
  },
  closeDialog: () => {
    set(initialState);
  },
}));

// Hook for easy dialog usage
export const useDialog = () => {
  const { showDialog, closeDialog } = useDialogStore();

  const alert = (title: string, message: string) => {
    return new Promise<void>((resolve) => {
      showDialog({
        type: 'info',
        title,
        message,
        onConfirm: () => {
          closeDialog();
          resolve();
        },
      });
    });
  };

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      showDialog({
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          closeDialog();
          resolve(true);
        },
        onCancel: () => {
          closeDialog();
          resolve(false);
        },
      });
    });
  };

  const success = (title: string, message: string) => {
    return new Promise<void>((resolve) => {
      showDialog({
        type: 'success',
        title,
        message,
        onConfirm: () => {
          closeDialog();
          resolve();
        },
      });
    });
  };

  const warning = (title: string, message: string) => {
    return new Promise<void>((resolve) => {
      showDialog({
        type: 'warning',
        title,
        message,
        onConfirm: () => {
          closeDialog();
          resolve();
        },
      });
    });
  };

  return { alert, confirm, success, warning };
};

export default function ConfirmDialog() {
  const {
    isOpen,
    type,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    closeDialog,
  } = useDialogStore();

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      closeDialog();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      closeDialog();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'confirm':
        return <HelpCircle className="w-6 h-6 text-blue-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700 animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6 whitespace-pre-line">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          {type === 'confirm' && (
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${getConfirmButtonStyle()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
