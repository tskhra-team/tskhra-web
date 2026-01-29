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
    <div className="w-[520px] max-w-full rounded-[28px] bg-gradient-to-br from-[#EEF0FF] via-white to-[#FFECEC] px-10 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
      <h1 className="text-3xl font-extrabold tracking-tight text-black">
        Registration Successful 🎉
      </h1>

      <p className="mx-auto mt-4 max-w-md text-sm text-gray-500">
        Your account has been created successfully.
        <br />
        You can now sign in and start using the platform.
      </p>

      <button
        onClick={handleContinue}
        className="mx-auto mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Continue to Login
      </button>
    </div>
  );
};

export default RegistrationSuccess;
