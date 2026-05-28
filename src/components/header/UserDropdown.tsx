"use client";

import { AnimatePresence, motion } from "framer-motion";
import { DoorOpen, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import styles from "./UserDropdown.module.scss";

export function UserDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  const handleLogout = async () => {
    setIsOpen(false);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div
      className={styles.container}
      ref={dropdownRef}
      role="menubar"
      onClick={(e) => {
        if (isOpen) handleClickOutside(e);
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        role="tooltip"
        className={styles.triggerWrap}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open user menu"
          aria-expanded={isOpen}
        >
          <DoorOpen size={18} />
        </button>
        <AnimatePresence>
          {showTooltip && (
            <motion.span
              className={styles.tooltip}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              Close the Ledger
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            <div className={styles.header}>
              <div className={styles.userInfo}>
                <p className={styles.userName}>{user.name}</p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>
            </div>

            <div className={styles.divider} />

            <Link
              href="/account"
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} />
              <span>Account Settings</span>
            </Link>

            <button
              type="button"
              className={styles.menuItem}
              onClick={handleLogout}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
