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
    <article className={styles.bookCard} onClick={onClick}>
      <div className={styles.coverWrapper}>
        {thumbnail ? (
          <img src={thumbnail} alt={title} />
        ) : (
          <div className={styles.placeholder}>No Cover</div>
        )}
      </div>
      <h3>{title}</h3>
      <p className={styles.author}>
        {authors?.join(", ") || "Unknown Author"}
      </p>
    </article>
  );
}