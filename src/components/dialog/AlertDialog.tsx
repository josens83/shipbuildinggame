// Alert 다이얼로그 컴포넌트

import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { AlertDialog } from '../../types/dialog';

interface AlertDialogProps {
  dialog: AlertDialog;
}

export default function AlertDialogComponent({ dialog }: AlertDialogProps) {
  const { closeDialog } = useDialogStore();

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    closeDialog(dialog.id);
  };

  const handleClose = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog(dialog.id);
  };

  const getIcon = () => {
    switch (dialog.type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Info className="w-6 h-6 text-blue-400" />;
    }
  };

  const getButtonStyle = () => {
    switch (dialog.type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700';
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700';
      case 'error':
        return 'bg-red-600 hover:bg-red-700';
      default:
        return 'bg-blue-600 hover:bg-blue-700';
    }
  };

  const getBorderStyle = () => {
    switch (dialog.type) {
      case 'success':
        return 'border-green-500/50';
      case 'warning':
        return 'border-yellow-500/50';
      case 'error':
        return 'border-red-500/50';
      default:
        return 'border-blue-500/50';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 ${getBorderStyle()} shadow-2xl animate-scale-in`}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {getIcon()}
            <h2 className="text-lg font-bold text-white">{dialog.title}</h2>
          </div>
          {dialog.dismissible !== false && (
            <button
              onClick={handleClose}
              className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Message */}
        <p className="text-gray-300 mb-6 whitespace-pre-line leading-relaxed">
          {dialog.message}
        </p>

        {/* Button */}
        <div className="flex justify-end">
          <button
            onClick={handleConfirm}
            className={`px-6 py-2.5 text-white font-semibold rounded-lg transition-colors ${getButtonStyle()}`}
          >
            {dialog.confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
