import React from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "bottom";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  position = "center",
}) => {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] ${
        position === "center" ? "flex items-center justify-center" : ""
      } transition-all duration-300 ${
        isOpen
          ? "opacity-100 backdrop-blur-sm"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        className={`absolute inset-0 bg-black/50 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleBackdropClick}
      />
      <div
        className={`${
          position === "center"
            ? "relative  w-80 py-2 mx-4 rounded-32"
            : "fixed bottom-0 left-0 right-0 rounded-t-32"
        } bg-white shadow-xl transition-all duration-300 transform max-w-[700px] mx-auto ${
          isOpen
            ? position === "center"
              ? "translate-y-0 opacity-100 scale-100"
              : "translate-y-0 opacity-100"
            : position === "center"
              ? "translate-y-4 opacity-0 scale-95"
              : "translate-y-full opacity-0"
        } overflow-y-auto max-h-[90vh]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
