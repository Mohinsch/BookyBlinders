"use client";

import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  const buttonClass = `${styles.btn} ${styles[variant]} ${className}`;

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
}