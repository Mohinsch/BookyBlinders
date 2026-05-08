/**
 * Central constants file for all application-wide magic strings and values
 * Prevents typos, improves maintainability, and enables easy configuration changes
 */

// ============================================================================
// API & Search Constants
// ============================================================================

export const GOOGLE_BOOKS_API = {
  BASE_URL: "https://www.googleapis.com/books/v1/volumes",
  CACHE_TTL_MS: 24 * 60 * 60 * 1000, // 24 hours
  CACHE_MAX_SIZE: 1000,
  DEFAULT_MAX_RESULTS: 12,
  LANGUAGE_RESTRICT: "en,fr",
} as const;

export const SEARCH_CONFIG = {
  INITIAL_QUERY: "random",
  INITIAL_MAX_RESULTS: 12,
  DEFAULT_MAX_RESULTS: 12,
} as const;

// ============================================================================
// Route Paths
// ============================================================================

export const ROUTES = {
  HOME: "/",
  BOOKS: {
    DETAIL: (id: string) => `/books/${id}`,
    DETAIL_PATTERN: "/books/[id]",
  },
  LIBRARY: "/library",
  LOGIN: "/login",
  REGISTER: "/register",
  ABOUT: "/about-us",
  API: {
    AUTH_GET_SESSION: "/api/auth/get-session",
    AUTH: (path: string) => `/api/auth/${path}`,
  },
} as const;

// ============================================================================
// Database & Data Models
// ============================================================================

export const READING_STATUS = {
  TO_READ: "TO_READ",
  IN_PROGRESS: "IN_PROGRESS",
  READ: "READ",
} as const;

export const BOOK_SOURCES = {
  INTERNAL: "internal",
  EXTERNAL: "external",
} as const;

export const ISBN_TYPES = {
  ISBN_13: "ISBN_13",
  ISBN_10: "ISBN_10",
} as const;

// ============================================================================
// UI Text & Labels
// ============================================================================

export const UI_TEXT = {
  AUTHOR: {
    UNKNOWN: "Unknown Author",
  },
  BOOK: {
    NO_COVER: "No Cover",
    NO_DESCRIPTION: "No description available.",
    DEFAULT_LIBRARY: "My Collection",
  },
  BUTTON: {
    ADD_TO_LIBRARY: "Add to Library",
    ALREADY_OWNED: "Already in your Ledger",
    LOGIN_TO_ADD: "Login to add",
    SELECT_LIBRARY: "Select Library",
    DEFAULT_LIBRARY: "My Collection (Default)",
  },
  MODAL: {
    PUBLISHER_LABEL: "Publisher:",
    PUBLISHED_LABEL: "Published:",
    PAGES_LABEL: "Pages:",
    ISBN_LABEL: "ISBN:",
    CATEGORIES_LABEL: "Categories",
    ABOUT_SECTION: "About",
    CLOSE_TITLE: "Close book details",
  },
} as const;

// ============================================================================
// Rate Limiting & Performance
// ============================================================================

export const RATE_LIMITS = {
  AUTH_LOGIN: {
    MAX_ATTEMPTS: 5,
    WINDOW_MINUTES: 15,
  },
  GOOGLE_BOOKS_SEARCH: {
    MAX_REQUESTS: 30,
    WINDOW_MINUTES: 1,
  },
  LIBRARY_OPERATIONS: {
    MAX_OPERATIONS: 100,
    WINDOW_MINUTES: 1,
  },
} as const;

// ============================================================================
// Cache Keys
// ============================================================================

export const CACHE_KEYS = {
  SEARCH: (query: string) => `search:${query.toLowerCase()}`,
  BOOK: (id: string) => `book:${id}`,
  USER_LIBRARIES: (userId: string) => `libraries:${userId}`,
  OWNED_BOOKS: (userId: string) => `owned:${userId}`,
} as const;

// ============================================================================
// Validation & Constraints
// ============================================================================

export const CONSTRAINTS = {
  BOOK: {
    TITLE: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 255,
    },
    DESCRIPTION: {
      MAX_LENGTH: 10000,
    },
  },
  LIBRARY: {
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
    DESCRIPTION: {
      MAX_LENGTH: 500,
    },
  },
  CATEGORIES: {
    MAX_DISPLAYED: 2,
  },
} as const;

// ============================================================================
// Log Messages
// ============================================================================

export const LOG_MESSAGES = {
  GOOGLE_BOOKS: {
    CACHE_HIT: (query: string) =>
      `[Google Books] Cache hit for query: "${query}"`,
    CACHE_STORED: (count: number, query: string) =>
      `[Google Books] Cached ${count} results for query: "${query}"`,
    CACHE_HIT_BOOK: (id: string) =>
      `[Google Books] Cache hit for book ID: "${id}"`,
    CACHE_STORED_BOOK: (id: string) =>
      `[Google Books] Cached book details for ID: "${id}"`,
    API_ERROR: (status: number, statusText: string) =>
      `[Google Books API] Error: ${status} - ${statusText}`,
    NETWORK_ERROR: "[Google Books API] Network or Parsing Error:",
  },
  BOOK_DETAILS: {
    DB_FALLBACK:
      "[BookDetails] Database query failed, falling back to Google Books API:",
  },
  ACTION: {
    ERROR: (action: string) => `[Action Error] ${action}:`,
    VALIDATION_ERROR: (action: string) => `[Validation Error] ${action}:`,
  },
} as const;

// ============================================================================
// Animation & Styling Constants
// ============================================================================

export const ANIMATIONS = {
  MODAL: {
    OVERLAY_INITIAL: { opacity: 0 },
    OVERLAY_ANIMATE: { opacity: 1 },
    OVERLAY_EXIT: { opacity: 0 },
    CONTAINER_INITIAL: { opacity: 0, scale: 0.95 },
    CONTAINER_ANIMATE: { opacity: 1, scale: 1 },
    CONTAINER_EXIT: { opacity: 0, scale: 0.95 },
    CONTAINER_TRANSITION: { type: "spring", stiffness: 260, damping: 20 },
  },
} as const;

// ============================================================================
// Size Constants
// ============================================================================

export const SIZES = {
  BOOK_COVER: {
    MODAL_HEIGHT: 280,
    MODAL_MAX_WIDTH: 200,
    CARD_HEIGHT_MOBILE: 220,
    CARD_HEIGHT_DESKTOP: 280,
  },
  BREAKPOINTS: {
    MOBILE: 375,
    TABLET: 768,
    DESKTOP: 1024,
  },
  ICONS: {
    SMALL: 18,
    MEDIUM: 20,
    LARGE: 24,
  },
} as const;

// ============================================================================
// Action Schema Validation
// ============================================================================

export const SCHEMA_DEFAULTS = {
  LIBRARY_ID: 0, // Default/primary library
} as const;

// ============================================================================
// Error Messages
// ============================================================================

export const ERROR_MESSAGES = {
  BOOK_NOT_FOUND: "Book not found",
  LIBRARY_NOT_FOUND: "Library not found",
  INVALID_INPUT: "Invalid input provided",
  DATABASE_ERROR: "Database operation failed",
  UNAUTHORIZED: "User not authenticated",
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  BOOK_ADDED: "Book added to library",
  BOOK_REMOVED: "Book removed from library",
  STATUS_UPDATED: "Reading status updated",
  LIBRARY_CREATED: "Library created successfully",
} as const;
