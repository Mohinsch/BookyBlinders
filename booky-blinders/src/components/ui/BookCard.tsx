"use client";

import styles from "./BookCard.module.scss";

interface BookCardProps {
  title: string;
  authors?: string[];
  thumbnail?: string;
  onClick?: () => void;
}

export function BookCard({ title, authors, thumbnail, onClick }: BookCardProps) {
  return (
    <article 
      className={styles.bookCard} 
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className={styles.coverWrapper}>
        {thumbnail ? (
          <img 
            src={thumbnail} 
            alt={`Cover of ${title}`} 
            loading="lazy" 
          />
        ) : (
          <div className={styles.placeholder}>
            <span>Missing Cover</span>
          </div>
        )}
      </div>
      
      <div className={styles.info}>
        <h3 className={styles.title} title={title}>
          {title}
        </h3>
        <p className={styles.author} title={authors?.join(", ")}>
          {authors?.join(", ") || "Unknown Author"}
        </p>
      </div>
    </article>
  );
}