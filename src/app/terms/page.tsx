"use client";

import styles from "@/app/legal.module.scss";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";

export default function TermsPage() {
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("terms.title")}</h1>
      <p className={styles.lastUpdated}>{t("terms.lastUpdated")}: May 2026</p>

      <section className={styles.section}>
        <h2>1. {t("terms.acceptance")}</h2>
        <p>
          By accessing and using Booky Blinders ("Service"), you accept and
          agree to be bound by the terms and provision of this agreement. If you
          do not agree to abide by the above, please do not use this service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. {t("terms.license")}</h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials (information or software) on Booky Blinders for personal,
          non-commercial transitory viewing only. This is the grant of a
          license, not a transfer of title, and under this license you may not:
        </p>
        <ul>
          <li>Modifying or copying the materials</li>
          <li>
            Using the materials for any commercial purpose or for any public
            display
          </li>
          <li>Attempting to decompile or reverse engineer any software</li>
          <li>Removing any copyright or other proprietary notations</li>
          <li>
            Transferring the materials to another person or "mirroring" the
            materials on any other server
          </li>
          <li>
            Violating any applicable laws or regulations related to access to or
            use of the Service
          </li>
          <li>Harassing or causing distress or inconvenience to any person</li>
          <li>
            Disrupting the normal flow of dialogue within our web application
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. {t("terms.disclaimer")}</h2>
        <p>
          The materials on Booky Blinders are provided "as is". Booky Blinders
          makes no warranties, expressed or implied, and hereby disclaims and
          negates all other warranties including, without limitation, implied
          warranties or conditions of merchantability, fitness for a particular
          purpose, or non-infringement of intellectual property or other
          violation of rights.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. {t("terms.limitations")}</h2>
        <p>
          In no event shall Booky Blinders or its suppliers be liable for any
          damages (including, without limitation, damages for loss of data or
          profit, or due to business interruption) arising out of the use or
          inability to use the materials on Booky Blinders, even if Booky
          Blinders or a Booky Blinders authorized representative has been
          notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. {t("terms.accuracy")}</h2>
        <p>
          The materials appearing on Booky Blinders could include technical,
          typographical, or photographic errors. Booky Blinders does not warrant
          that any of the materials on its website are accurate, complete, or
          current. Booky Blinders may make changes to the materials contained on
          its website at any time without notice.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. {t("terms.materials")}</h2>
        <p>
          All materials on Booky Blinders (including book covers and metadata)
          are subject to copyright and other intellectual property laws. User
          Content (your library, notes, and categories) is owned by you, but you
          grant Booky Blinders a license to store, display, and process your
          User Content as necessary to provide the Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Third-Party Material Attribution</h2>
        <p>Booky Blinders uses the following third-party services:</p>
        <ul>
          <li>
            <strong>Google Books API:</strong> Book metadata and cover images
            provided by Google Books. These materials remain the property of
            Google and are used in accordance with Google's terms.
          </li>
          <li>
            <strong>Supabase:</strong> Database and hosting infrastructure
          </li>
          <li>
            <strong>Better Auth:</strong> Authentication and session management
          </li>
        </ul>
        <p>
          Your use of these third-party services is governed by their respective
          terms of service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Limitations of Liability</h2>
        <p>
          Except where such exclusions are prohibited by law, Booky Blinders
          excludes liability for incidental or consequential damages. Some
          jurisdictions do not allow limitations of liability, so this may not
          apply to you.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Revisions and Errata</h2>
        <p>
          The materials appearing on Booky Blinders may include inaccuracies or
          typographical errors. Not all products, services or information
          described in the materials is available or applicable in all
          locations. The information on the website may be updated at any time
          without notice.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. {t("terms.links")}</h2>
        <p>
          Booky Blinders has not reviewed all of the sites linked to its website
          and is not responsible for the contents of any such linked site. The
          inclusion of any link does not imply endorsement by Booky Blinders of
          the site. Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. User Accounts</h2>

        <h3>11.1 Account Responsibility</h3>
        <p>
          You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your
          account. You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information during registration</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
          <li>
            Not share your password with anyone or use another person's account
          </li>
        </ul>

        <h3>11.2 Account Termination</h3>
        <p>
          We reserve the right to terminate accounts that violate these Terms of
          Service or engage in abusive behavior. Upon termination, your access
          to the Service will be immediately revoked.
        </p>
      </section>

      <section className={styles.section}>
        <h2>12. User-Generated Content</h2>
        <p>
          You retain ownership of any content you create in your personal
          library (notes, categories, reading status). By using the Service, you
          grant Booky Blinders a non-exclusive license to use, store, transmit,
          and display your content solely for the purpose of providing the
          Service.
        </p>

        <div className={styles.highlight}>
          <p>
            You agree not to upload or share content that is illegal,
            defamatory, obscene, or violates intellectual property rights.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>13. Restrictions on Use</h2>
        <p>You agree not to use Booky Blinders to:</p>
        <ul>
          <li>Violate any applicable law or regulation</li>
          <li>Infringe on anyone's intellectual property rights</li>
          <li>
            Harass, threaten, embarrass, or cause distress to any other user
          </li>
          <li>Post spam, malware, or any malicious content</li>
          <li>Attempt to gain unauthorized access to the Service</li>
          <li>Scrape or automate data collection without permission</li>
          <li>Interfere with the normal operation of the Service</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>14. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Booky Blinders and its
          officers, directors, employees, and agents from and against any and
          all claims, liabilities, damages, costs, and expenses arising from
          your use of the Service or violation of these Terms of Service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>15. {t("terms.modifications")}</h2>
        <p>
          Booky Blinders may revise these terms of service at any time without
          notice. By using this website, you are agreeing to be bound by the
          then current version of these terms of service.
        </p>
      </section>

      <section className={styles.section}>
        <h2>16. {t("terms.governing")}</h2>
        <p>
          These terms and conditions are governed by and construed in accordance
          with applicable law, and you irrevocably submit to the exclusive
          jurisdiction of the courts in that location.
        </p>
      </section>

      <section className={styles.section}>
        <h2>17. Service Availability</h2>
        <p>
          Booky Blinders strives to maintain uninterrupted service, but we do
          not guarantee that the Service will be available at all times. We may
          perform scheduled maintenance or other work without notice.
        </p>
      </section>

      <section className={styles.section}>
        <h2>18. {t("terms.contact")}</h2>
        <div className={styles.contact}>
          <strong>
            If you have questions about these Terms of Service, please contact:
          </strong>
          <p>Email: support@bookybinders.app</p>
          <p>We will respond to your inquiry within 30 days of receipt.</p>
        </div>
      </section>
    </div>
  );
}
