"use client";

import { AuthCTA } from "@/components/ui/AuthCTA";
import styles from "./CtaSection.module.scss";

export function CtaSection() {
  return (
    <section className={styles.cta}>
      <h2>Begin your literary journey</h2>
      <p>
        Join the discerning readers who have chosen Booky Blinders as their
        personal library companion.
      </p>
      <AuthCTA variant="primary">Start your collection</AuthCTA>
    </section>
  );
}
