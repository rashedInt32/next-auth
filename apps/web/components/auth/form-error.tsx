import { FaExclamationTriangle } from "react-icons/fa";

interface FormErrorProps {
  message?: string;
}
export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center  gap-x-2 text-sm text-destructive">
      <div className="h-5 w-5">
        <FaExclamationTriangle className="h-4 w-4" />
      </div>
      <p>{message}</p>
    </div>
  );
};
