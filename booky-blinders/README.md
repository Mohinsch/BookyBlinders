## 🧪 Test Plan

The project follows a testing strategy to ensure data integrity and API reliability.


### 🔹 Authentication & Security

| Test Case | Expected Result | Status |
| :--- | :--- | :--- |
| **Action call with valid session** | 200: Returns user object and proceeds | 🟢 |
| **Action call without session** | 401: Throws "Unauthorized" (Caught: success: false) | 🔴 |
| **Route protection (Proxy)** | 302: Redirects `/library` to `/login` | 🔴 |

### 📚 Library Server Actions (`src/actions/library.ts`)

| Test Case | Expected Result | Status |
| :--- | :--- | :--- |
| **Add book (Success)** | Inserts book into DB and revalidates UI | 🟢 |
| **Get library (Success)** | Returns formatted list of user's saved books | 🟢 |
| **Update status (Success)** | Updates reading status and revalidates UI | 🟢 |
| **Remove book (Success)** | Removes book and revalidates UI | 🟢 |
| **Add book (Not Found)** | Throws "Book not found" -> Returns `success: false` | 🔴 |
| **Get library (DB Error)** | Exception caught safely -> Returns empty array `[]` | 🔴 |
| **Update status (Library not found)** | Throws "Library not found" -> Returns `success: false` | 🔴 |
| **Remove book (Library not found)** | Throws "Library not found" -> Returns `success: false` | 🔴 |

### 🌐 Google Books API Service (`src/services/google-books.ts`)

| Test Case | Expected Result | Status |
| :--- | :--- | :--- |
| **Search books (Valid query)** | URL constructed properly, returns array of books | 🟢 |
| **Get book by ID (Valid ID)** | Returns detailed book object | 🟢 |
| **Search books (Empty query)** | Returns empty array `[]` without calling API | 🔴 |
| **Get book by ID (Empty ID)** | Returns `null` without calling API | 🔴 |
| **Fetch (HTTP Error)** | Detects 404/500, logs error, returns `null` | 🔴 |
| **Fetch (Network Failure)** | Exception caught, logs error, returns `null` | 🔴 |

### 🔍 Books Server Actions (`src/actions/books.ts`)

| Test Case | Expected Result | Status |
| :--- | :--- | :--- |
| **Search Books (Success)** | Fetches and returns search results to the client | 🟢 |
| **Get Book Details (Success)** | Fetches and returns specific book data | 🟢 |
| **Search Books (API Down)** | Catches error, returns empty array to prevent UI crash | 🔴 |
| **Get Book Details (API Down)** | Catches error, returns `null` to prevent UI crash | 🔴 |