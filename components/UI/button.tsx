import React, { MouseEventHandler } from "react";

interface btnProps {
  className: string;
  children: React.ReactNode;
  varient?: "bgFill" | "bgBlank";
  onclick?:MouseEventHandler<HTMLButtonElement>
}

const Button = ({ className, children, varient = "bgBlank" , onclick}: btnProps) => {
  const variants = {
    bgFill: "bg-gray-900 hover:bg-gray-800 text-white px-3 py-1 rounded-2xl font-semibold text-base shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-400 cursor-pointer overflow-hidden border border-gray-800",
    bgBlank: "bg-white text-gray-800 border border-gray-400 hover:border-gray-600 px-7 py-4.5 rounded-2xl font-medium shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-400 cursor-pointer backdrop-blur-sm",
  };

  return (
    <div>
      <button onClick={onclick} className={`${className} ${variants[varient]}`}>{children}</button>
    </div>
  );
};

export default Button;
