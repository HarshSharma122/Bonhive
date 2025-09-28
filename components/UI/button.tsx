import React, { MouseEventHandler } from "react";

interface btnProps {
  className: string;
  children: React.ReactNode;
  varient?: "bgFill" | "bgBlank";
  onclick?:MouseEventHandler<HTMLButtonElement>
}

const Button = ({ className, children, varient = "bgBlank" , onclick}: btnProps) => {
  const variants = {
    bgFill: "bg-[#0096c7] hover:bg-blue-500 text-white px-3 py-1 rounded-md text-white hover:scale-105 transition duration-300 cursor-pointer",
    bgBlank: "bg-white text-black border-1 rounded-md px-3 py-1 hover:scale-105  transition duration-300 cursor-pointer",
  };

  return (
    <div>
      <button onClick={onclick} className={`${className} ${variants[varient]}`}>{children}</button>
    </div>
  );
};

export default Button;
