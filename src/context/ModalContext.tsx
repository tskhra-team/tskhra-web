import { Button } from "@/components/ui/button";
import { AlertCircle, Check, TriangleAlert } from "lucide-react";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useTranslation } from "react-i18next";

// 1. Описываем возможные статусы модалки
export type ModalStatus = "pending" | "success" | "error" | "warning" | "idle";

// 2. Описываем данные, которые хранит модалка
interface ModalData {
  status: ModalStatus;
  title: string;
  text: string;
  buttonText?: string;
  onButtonClick?: () => void;
  secondButtonText?: string;
  onSecondButtonClick?: () => void;
}

// 3. Описываем всё, что будет доступно через контекст
interface ModalContextProps extends ModalData {
  isOpen: boolean;
  showModal: (
    status: ModalStatus,
    title: string,
    text: string,
    buttonText?: string,
    onButtonClick?: () => void,
    secondButtonText?: string,
    onSecondButtonClick?: () => void,
  ) => void;
  closeModal: () => void;
}

// Создаем контекст, по умолчанию он null
const ModalContext = createContext<ModalContextProps | null>(null);

// Пропсы для Провайдера
interface ModalProviderProps {
  children: ReactNode;
}

// 4. Провайдер
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalData, setModalData] = useState<ModalData>({
    status: "idle",
    title: "",
    text: "",
    buttonText: undefined,
    onButtonClick: undefined,
    secondButtonText: undefined,
    onSecondButtonClick: undefined,
  });

  const showModal = (
    status: ModalStatus,
    title: string,
    text: string,
    buttonText?: string,
    onButtonClick?: () => void,
    secondButtonText?: string,
    onSecondButtonClick?: () => void,
  ) => {
    setModalData({
      status,
      title,
      text,
      buttonText,
      onButtonClick,
      secondButtonText,
      onSecondButtonClick,
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider
      value={{ isOpen, ...modalData, showModal, closeModal }}
    >
      {children}
      <GlobalModal />
    </ModalContext.Provider>
  );
};

// 5. Компонент модального окна
const GlobalModal: React.FC = () => {
  const { t } = useTranslation("modal");
  const context = useModal();
  const {
    isOpen,
    status,
    title,
    text,
    buttonText,
    onButtonClick,
    secondButtonText,
    onSecondButtonClick,
    closeModal,
  } = context;

  // Block scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Типизированный объект стилей для статусов
  const statusStyles: Record<ModalStatus, string> = {
    idle: "text-gray-800 border-gray-800",
    pending: "text-gray-500 border-gray-500",
    success: "text-green-800 border-green-800",
    error: "text-red-900 border-red-500",
    warning: "text-yellow-800 border-yellow-800",
  };

  const shortenedText = title.length > 30 ? title.slice(0, 30) + "..." : title;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-105 max-w-[90vw] flex flex-col items-center animate-in zoom-in-95 duration-200 border border-gray-100">
        {status === "pending" && (
          <div className="w-14 h-14 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-5" />
        )}

        {status === "error" && (
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-5">
            <TriangleAlert className="w-8 h-8 text-red-700" />
          </div>
        )}

        {status === "warning" && (
          <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mb-5">
            <AlertCircle className="w-8 h-8 text-yellow-700" />
          </div>
        )}

        {status === "success" && (
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-5">
            <Check className="w-8 h-8 text-green-700" />
          </div>
        )}

        {/* Извлекаем нужный цвет текста из объекта statusStyles */}
        <h2
          className={`text-2xl text-center font-bold mb-3 ${statusStyles[status].split(" ")[0]}`}
        >
          {shortenedText}
        </h2>

        <p className="text-gray-600 text-base text-center mb-8 leading-relaxed max-w-sm">
          {text}
        </p>

        {status !== "pending" && (
          <div className="flex gap-3">
            {secondButtonText && (
              <Button
                onClick={() => {
                  if (onSecondButtonClick) {
                    onSecondButtonClick();
                  }
                  closeModal();
                }}
                variant="outline"
                className="px-8 py-2.5 rounded-lg cursor-pointer font-medium relative overflow-hidden"
                style={{
                  transition: "all 0.5s ease-out",
                  boxShadow: "0 2px 8px -2px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1.05) translateY(-4px) rotate(0.5deg)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 50px -10px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    "scale(1) translateY(0) rotate(0deg)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px -2px rgba(0, 0, 0, 0.1)";
                }}
              >
                {/* Decorative shine effect */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.05) 50%, transparent 100%)",
                  }}
                />
                <span className="relative z-10">{secondButtonText}</span>
              </Button>
            )}
            <Button
              onClick={() => {
                if (onButtonClick) {
                  onButtonClick();
                }
                closeModal();
              }}
              className="px-8 py-2.5 bg-gray-900 text-white rounded-lg cursor-pointer font-medium relative overflow-hidden"
              style={{
                transition: "all 0.5s ease-out",
                boxShadow: "0 4px 14px -2px rgba(0, 0, 0, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "scale(1.05) translateY(-4px) rotate(0.5deg)";
                e.currentTarget.style.boxShadow =
                  "0 20px 50px -10px rgba(0, 0, 0, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "scale(1) translateY(0) rotate(0deg)";
                e.currentTarget.style.boxShadow =
                  "0 4px 14px -2px rgba(0, 0, 0, 0.3)";
              }}
            >
              {/* Decorative shine effect */}
              <div
                className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.15) 50%, transparent 100%)",
                }}
              />
              <span className="relative z-10">
                {buttonText || t("buttons.close")}
              </span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal should be inside ModalProvider");
  }
  return context;
};
