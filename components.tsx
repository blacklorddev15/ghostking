import React from "react";

export const Button = ({ children, className, ...props }: any) => (
  <button className={`px-4 py-2 rounded font-bold transition ${className}`} {...props}>
    {children}
  </button>
);

export const Card = ({ children, className, ...props }: any) => (
  <div className={`rounded-xl border p-4 ${className}`} {...props}>
    {children}
  </div>
);

export const Input = ({ className, ...props }: any) => (
  <input className={`w-full px-4 py-2 rounded border bg-transparent text-white ${className}`} {...props} />
);
