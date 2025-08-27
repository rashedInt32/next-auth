import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
  message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
  if (!message) return null;
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md gap-x-2 flex text-sm text-emerald-500 items-center">
      <div className="h-5 w-5">
        <FaCheckCircle className="w-5 h-5" />
      </div>
      <p>{message}</p>
    </div>
  );
};
