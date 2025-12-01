import React, { useState } from 'react';
import ReactDOM from 'react-dom';

export const usePopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  return { isOpen, openPopup, closePopup };
};

export const ConfirmationPopup = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel" }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] backdrop-blur-sm">
      <div className="bg-white dark:bg-[var(--color-bg-secondary)] p-6 rounded-[20px] shadow-xl text-center max-w-sm w-full mx-4 transform transition-all scale-100 animate-in fade-in zoom-in duration-200">
        <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">{title}</h3>
        <p className="mb-6 text-[var(--color-text-secondary)]">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-[10px] hover:bg-[var(--color-accent-hover)] transition-colors duration-300 font-medium"
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-[10px] hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 font-medium"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationPopup;