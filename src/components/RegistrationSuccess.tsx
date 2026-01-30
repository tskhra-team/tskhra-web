import { useNavigate } from "react-router-dom";

type RegistrationSuccessProps = {
  onClose: () => void;
  redirectTo?: string;
};

const RegistrationSuccess = ({ onClose, redirectTo = "/login" }: RegistrationSuccessProps) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose();
    navigate(redirectTo);
  };

  return (
    <div className="w-[520px] max-w-full rounded-2xl bg-white/95 backdrop-blur-xl px-10 py-14 text-center shadow-lg border border-slate-200/60">
      <div className="mb-6">
        <div className="mx-auto w-20 h-20 bg-linear-to-br from-blue-400/20 via-orange-400/20 to-red-400/20 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Registration Successful!
        </h1>
      </div>

      <p className="mx-auto max-w-md text-sm text-slate-600 leading-relaxed">
        Your account has been created successfully.
        <br />
        You can now sign in and start using the platform.
      </p>

      <button
        onClick={handleContinue}
        className="mx-auto mt-8 inline-flex items-center justify-center rounded-lg bg-[#1E1E1E] border-2 border-[#1E1E1E] text-white px-8 py-3 text-sm font-semibold transition-all duration-300 hover:bg-[#2E2E2E] hover:border-[#2E2E2E] shadow-md hover:shadow-lg"
      >
        Continue to Login
      </button>
    </div>
  );
};

export default RegistrationSuccess;
