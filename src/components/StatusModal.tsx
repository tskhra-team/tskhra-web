import { CheckCircle2, Loader2, XCircle } from "lucide-react";

type StatusModalProps = {
  isOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  loadingText?: string;
  errorText?: string;
  successText?: string;
  isAllowClose?: boolean;
  onClose?: () => void;
};

export default function StatusModal({
  isOpen,
  isLoading,
  isError,
  isSuccess,
  loadingText = "",
  errorText = "",
  successText = "",
  isAllowClose = false,
  onClose,
}: StatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center justify-center space-y-6">
          {/* Loading State */}
          {isLoading && (
            <>
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Please Wait
                </h3>
                <p className="text-gray-600">{loadingText}</p>
              </div>
            </>
          )}

          {/* Error State */}
          {isError && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-700" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Verification Failed
                </h3>
                <p className="text-gray-600">{errorText}</p>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </>
          )}

          {/* Success State */}
          {isSuccess && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-700" />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Success!
                </h3>
                <p className="text-gray-600">{successText}</p>
              </div>
              {isAllowClose && (
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Awesome
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
