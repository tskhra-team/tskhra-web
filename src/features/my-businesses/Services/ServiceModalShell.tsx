import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";

interface ServiceModalShellProps {
  onClose: () => void;
  children: ReactNode;
}

export default function ServiceModalShell({
  onClose,
  children,
}: ServiceModalShellProps) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white relative rounded-2xl shadow-2xl p-8 w-150 max-w-[90vw] flex flex-col animate-in zoom-in-95 duration-200 border border-gray-100 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <X
          onClick={onClose}
          className="cursor-pointer top-0 right-0 h-5 w-5 absolute m-5"
        />
        {children}
      </div>
    </div>
  );
}
