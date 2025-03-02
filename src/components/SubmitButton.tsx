import { Loader } from "lucide-react";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface SubmitButtonProp extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  children?: ReactNode;
}

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProp>(
  ({ isLoading, children = "Save", ...prop }, ref) => {
    return (
      <button
        disabled={isLoading} 
        {...prop}
        className="sticky bottom-2 right-4 rounded-md bg-primary p-2 px-8 text-white transition-all hover:opacity-70"
        ref={ref}
      >
        {!isLoading ? (
          children
        ) : (
          <div>
            <Loader className="animate-spin" />
          </div>
        )}
      </button>
    );
  },
);

export default SubmitButton;
