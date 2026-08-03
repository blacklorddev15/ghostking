import React from "react";

export const Button = ({ children, className = "", variant = "primary", ...props }: any) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants: any = {
    primary: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]",
    outline: "border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10",
    ghost: "hover:bg-white/5 text-gray-300",
    danger: "bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant] || variants.primary} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className = "", ...props }: any) => (
  <div 
    className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ className = "", ...props }: any) => (
  <input 
    className={`w-full px-4 py-3 rounded-xl border border-white/20 bg-black/60 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all ${className}`} 
    {...props} 
  />
);
