// Confirm 다이얼로그 컴포넌트

import { HelpCircle, X } from 'lucide-react';
import { useDialogStore } from '../../store/dialogStore';
import type { ConfirmDialog } from '../../types/dialog';

interface ConfirmDialogProps {
  dialog: ConfirmDialog;
}

export default function ConfirmDialogComponent({ dialog }: ConfirmDialogProps) {
  const { closeDialog } = useDialogStore();

  const handleConfirm = () => {
    if (dialog.onConfirm) {
      dialog.onConfirm();
    }
    closeDialog(dialog.id);
  };

  const handleCancel = () => {
    if (dialog.onCancel) {
      dialog.onCancel();
    }
    closeDialog(dialog.id);
  };

  const handleClose = () => {
    if (dialog.onClose) {
      dialog.onClose();
    }
    closeDialog(dialog.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border-2 border-blue-500/50 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-6 h-6 text-blue-400" />
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

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            {dialog.cancelText || '취소'}
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            {dialog.confirmText || '확인'}
          </button>
        </div>
      </div>
    </div>
  );
}
