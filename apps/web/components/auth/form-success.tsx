import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md gap-x-4 flex text-sm text-emerald-500 text-left">
      <FaCheckCircle className="w-4 h-4" />
      <p>{message}</p>
    </div>
  );
};
