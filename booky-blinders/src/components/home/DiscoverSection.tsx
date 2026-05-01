"use client";

import { Search } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { BookCard } from "@/components/ui/BookCard";
import { Button } from "@/components/ui/Button";
import type { GoogleBookItem } from "@/types/google-books";
import { useSearchStore } from "@/store/useSearchStore";
import styles from "./DiscoverSection.module.scss";

interface DiscoverSectionProps {
  initialBooks: GoogleBookItem[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 260, 
      damping: 20 
    } 
  },
};

export function DiscoverSection({ initialBooks = [] }: DiscoverSectionProps) {
  const { openSearch } = useSearchStore();

  return (
    <section id="discover" className={styles.discover}>
      <div className={styles.discoverHeader}>
        <h2 className={styles.sectionTitle}>Discover & Search</h2>
        <div className={styles.actionWrapper}>
          <Button variant="outline" onClick={openSearch}>
            Explore Books <Search size={16} />
          </Button>
        </div>
      </div>
      
      {!initialBooks || initialBooks.length === 0 ? (
        <p className={styles.emptyMessage}>The archives are empty.</p>
      ) : (
        <motion.div 
          className={styles.bookGrid}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {initialBooks.map((book) => (
            <motion.div key={book.id} variants={itemVariants}>
              <BookCard 
                title={book.volumeInfo.title}
                authors={book.volumeInfo.authors}
                thumbnail={book.volumeInfo.imageLinks?.thumbnail}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}