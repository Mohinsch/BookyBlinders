"use client";

import { Button } from "@/components/ui/Button";
import styles from "./CtaSection.module.scss";

export function CtaSection() {
  return (
    <section className={styles.cta}>
      <h2>Begin your literary journey</h2>
      <p>
        Join the discerning readers who have chosen Booky Blinders as their
        personal library companion.
      </p>
      <Button variant="primary">
        Start your collection
      </Button>
    </section>
  );
}