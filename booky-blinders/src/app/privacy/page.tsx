import styles from "@/app/legal.module.scss";

export const metadata = {
  title: "Privacy Policy | Booky Blinders",
  description: "Privacy policy for Booky Blinders personal library application",
};

export default function PrivacyPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Privacy Policy</h1>
      <p className={styles.lastUpdated}>Last updated: May 2026</p>

      <section className={styles.section}>
        <h2>1. Introduction</h2>
        <p>
          Booky Blinders ("we," "us," "our," or "Company") is committed to
          protecting your privacy. This Privacy Policy explains how we collect,
          use, disclose, and safeguard your information when you use our web
          application.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Information We Collect</h2>

        <h3>2.1 Information You Provide Directly</h3>
        <p>
          When you create an account and use our service, we collect:
        </p>
        <ul>
          <li>
            <strong>Account Information:</strong> Name, email address, and
            password (hashed and encrypted)
          </li>
          <li>
            <strong>Library Data:</strong> Books you add, reading status,
            personal notes, and custom categories
          </li>
          <li>
            <strong>Profile Information:</strong> Any personal details you
            choose to share in your account settings
          </li>
        </ul>

        <h3>2.2 Information Collected Automatically</h3>
        <p>
          We automatically collect certain information about your device and
          usage:
        </p>
        <ul>
          <li>
            <strong>Session Data:</strong> Authentication tokens and session
            information (managed by Better Auth)
          </li>
          <li>
            <strong>Usage Analytics:</strong> Pages visited, features used, and
            interaction patterns
          </li>
          <li>
            <strong>Device Information:</strong> Browser type, IP address, and
            operating system
          </li>
        </ul>

        <h3>2.3 Third-Party Services</h3>
        <p>
          To provide book information and search functionality, we integrate
          with:
        </p>
        <ul>
          <li>
            <strong>Google Books API:</strong> We query Google Books to retrieve
            book metadata, covers, and descriptions. Searches are cached
            locally to minimize API calls.
          </li>
          <li>
            <strong>Supabase:</strong> Our database provider that stores your
            account information and library data with enterprise-grade security
          </li>
          <li>
            <strong>Better Auth:</strong> Authentication service that manages
            user sessions and password security using industry-standard
            encryption
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. How We Use Your Information</h2>
        <p>We use collected information to:</p>
        <ul>
          <li>Create and maintain your personal library</li>
          <li>Authenticate your account and maintain session security</li>
          <li>
            Search for and display book information from Google Books API
          </li>
          <li>Store your reading preferences and custom categories</li>
          <li>Improve our application and user experience</li>
          <li>Comply with legal obligations</li>
          <li>Detect and prevent fraud or security issues</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>4. Data Storage and Security</h2>

        <h3>4.1 Where We Store Data</h3>
        <p>
          Your personal data is stored on secure servers provided by Supabase
          with geographically distributed backups to ensure availability and
          disaster recovery.
        </p>

        <h3>4.2 Security Measures</h3>
        <p>We implement multiple layers of security:</p>
        <ul>
          <li>
            <strong>Encryption in Transit:</strong> All data is transmitted over
            HTTPS with TLS encryption
          </li>
          <li>
            <strong>Encryption at Rest:</strong> Sensitive data is encrypted in
            our database
          </li>
          <li>
            <strong>Password Security:</strong> Passwords are hashed using
            industry-standard algorithms (handled by Better Auth)
          </li>
          <li>
            <strong>Access Controls:</strong> Strict authentication and
            authorization mechanisms protect your data
          </li>
          <li>
            <strong>Regular Audits:</strong> We regularly review our security
            practices
          </li>
        </ul>

        <div className={styles.highlight}>
          <p>
            <strong>Note:</strong> While we implement robust security measures,
            no system is completely secure. We cannot guarantee absolute
            security of your information.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>5. Data Retention and Deletion</h2>
        <p>
          We retain your data as long as your account is active. When you
          request account deletion:
        </p>
        <ul>
          <li>
            Your account information, library data, and personal notes are
            permanently deleted
          </li>
          <li>
            Associated session records and authentication data are removed
          </li>
          <li>
            You may retain backup copies for limited periods as per our backup
            retention policy
          </li>
          <li>
            Anonymized analytics data may be retained for service improvement
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>6. Third-Party Data Sharing</h2>
        <p>
          <strong>We do not sell your personal data.</strong> We only share
          information with:
        </p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Supabase, Better Auth, and
            Google Books (only search queries, not personal data)
          </li>
          <li>
            <strong>Legal Compliance:</strong> When required by law, court
            order, or government authority
          </li>
          <li>
            <strong>Business Transfers:</strong> In the event of merger or
            acquisition (you would be notified)
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>7. Cookies and Tracking</h2>
        <p>
          We use cookies and similar technologies to:
        </p>
        <ul>
          <li>Maintain your authentication session</li>
          <li>Remember your preferences</li>
          <li>Analyze application usage (analytics)</li>
          <li>Improve performance and security</li>
        </ul>
        <p>
          You can control cookies through your browser settings, though this
          may affect functionality.
        </p>
      </section>

      <section className={styles.section}>
        <h2>8. Your Privacy Rights</h2>
        <p>
          Depending on your location, you may have the right to:
        </p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Delete your data (right to be forgotten)</li>
          <li>Export your data in a portable format</li>
          <li>Opt-out of non-essential data collection</li>
        </ul>
        <p>
          To exercise these rights, please contact us at the email provided in
          the Contact section below.
        </p>
      </section>

      <section className={styles.section}>
        <h2>9. Children's Privacy</h2>
        <p>
          Booky Blinders is not intended for users under 13 years of age. We do
          not knowingly collect data from children. If we discover we have
          collected data from a child, we will delete it immediately.
        </p>
      </section>

      <section className={styles.section}>
        <h2>10. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy periodically. We will notify you of
          significant changes by posting the updated policy on our website and
          updating the "Last updated" date.
        </p>
      </section>

      <section className={styles.section}>
        <h2>11. Contact Us</h2>
        <div className={styles.contact}>
          <strong>For questions about this Privacy Policy, please contact:</strong>
          <p>Email: privacy@bookybinders.app</p>
          <p>
            We will respond to your inquiry within 30 days of receipt.
          </p>
        </div>
      </section>
    </div>
  );
}
