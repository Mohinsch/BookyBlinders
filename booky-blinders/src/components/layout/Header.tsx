"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { LogOut } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type MouseEvent, useState } from "react";
import { BBMonogram } from "@/components/ui/BBMonogram";
import { ANIMATIONS, ROUTES, SIZES } from "@/constants";
import { authClient } from "@/lib/auth-client";
import { useI18n } from "@/lib/i18n";
import { useLocaleContext } from "@/lib/locale-context";
import styles from "./Header.module.scss";

// Dynamic import for UserDropdown - only loaded when user is authenticated (header is always rendered)
const UserDropdown = dynamic(
  () =>
    import("@/components/header/UserDropdown").then((mod) => ({
      default: mod.UserDropdown,
    })),
  { ssr: false }, // CSR only - contains auth state and dropdown interactions
);

const NAV_LINKS = [
  { id: "home", key: "header.home", href: "/" },
  { id: "discover", key: "header.discover", href: "/#discover" },
  { id: "about-us", key: "header.aboutUs", href: "/about-us" },
] as const;

const isNavLinkActive = (pathname: string, href: string) =>
  pathname === href || (href !== "/" && pathname.startsWith(href));

interface NavLinksProps {
  pathname: string;
  linkClassName: string;
  activeClassName: string;
  onLinkClick: (event: MouseEvent<HTMLAnchorElement>, id: string) => void;
  translate: (key: string) => string;
}

function NavLinks({
  pathname,
  linkClassName,
  activeClassName,
  onLinkClick,
  translate,
}: NavLinksProps) {
  return (
    <>
      {NAV_LINKS.map(({ id, key, href }) => {
        const isActive = isNavLinkActive(pathname, href);
        return (
          <Link
            key={id}
            href={href}
            className={`${linkClassName} ${isActive ? activeClassName : ""}`}
            onClick={(event) => onLinkClick(event, id)}
          >
            {translate(key)}
          </Link>
        );
      })}
    </>
  );
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { locale } = useLocaleContext();
  const { t } = useI18n(locale);

  const { data: session, isPending } = authClient.useSession();
  const isAuthenticated = !!session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsMobileMenuOpen(false);
          router.push(ROUTES.LOGIN);
        },
      },
    });
  };

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement>,
    linkId: string,
  ) => {
    if (linkId === "discover") {
      if (pathname === "/") {
        e.preventDefault();
        const element = document.getElementById("discover");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          window.history.pushState(null, "", "#discover");
        }
      }
    }
    setIsMobileMenuOpen(false);
  };

  const menuVariants: Variants = {
    closed: ANIMATIONS.HEADER.MOBILE_MENU.CLOSED,
    open: ANIMATIONS.HEADER.MOBILE_MENU.OPEN,
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          href={ROUTES.HOME}
          className={styles.brand}
          onClick={(e) => handleLinkClick(e, "home")}
        >
          <BBMonogram className={styles.logo} />
          <div className={styles.brandText}>
            <span className={styles.title}>{t("footer.brand")}</span>
            <span className={styles.subtitle}>{t("footer.tagline")}</span>
          </div>
        </Link>

        <div className={styles.desktopActions}>
          <nav className={styles.nav} aria-label="Main navigation">
            <NavLinks
              pathname={pathname}
              linkClassName={styles.navLink}
              activeClassName={styles.active}
              onLinkClick={handleLinkClick}
              translate={t}
            />
          </nav>

          {isPending ? (
            <span className={styles.enterBtn} style={{ opacity: 0.5 }}>
              {t("common.loading")}
            </span>
          ) : isAuthenticated ? (
            <div className={styles.authActions}>
              <Link href={ROUTES.LIBRARY} className={styles.enterBtn}>
                {t("header.myLibrary")}
              </Link>
              <UserDropdown />
            </div>
          ) : (
            <Link href={ROUTES.LOGIN} className={styles.enterBtn}>
              {t("header.openTheLedger")}
            </Link>
          )}
        </div>

        <button
          type="button"
          className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.menuOpen : ""}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className={styles.mobileNav}
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <NavLinks
              pathname={pathname}
              linkClassName={styles.mobileNavLink}
              activeClassName={styles.active}
              onLinkClick={handleLinkClick}
              translate={t}
            />
            {isAuthenticated && (
              <>
                <Link href={ROUTES.ACCOUNT} className={styles.mobileNavLink}>
                  {t("accountSettings.title")}
                </Link>
                <button
                  type="button"
                  className={styles.mobileLogoutBtn}
                  onClick={handleLogout}
                >
                  <LogOut size={SIZES.ICONS.SMALL} />
                  {t("accountSettings.logout")}
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
