// ConfirmationModal.tsx
import React from "react";

interface ConfirmationModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white dark:bg-custom-sec/50 backdrop-blur-lg text-color-white p-6 rounded-lg shadow-lg">
        <p className="text-lg mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-color-red shadow-sm hover:shadow-xl hover:bg-color-red text-white px-4 py-2 rounded-lg mr-2"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="btn-dark-light-cancel px-2 py-1 lg:px-4 lg:py-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
