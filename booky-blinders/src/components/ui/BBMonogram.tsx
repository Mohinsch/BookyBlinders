interface BBMonogramProps {
  className?: string;
}

export function BBMonogram({ className = "" }: BBMonogramProps) {
  return (
    <img 
      src="/logo.svg" 
      alt="Booky Blinders Logo" 
      className={className} 
    />
  );
}