# ERD

Légende :

- Bleu - table entité
- Orange - table pivot
- Rouge - evolution future

```mermaid
erDiagram
    %% Legend: Blue = MVP Entities | Orange = Pivot Tables | Red = Evolutions
    
    user ||--o{ library : manages
    library ||--o{ library_book : includes
    book ||--o{ library_book : listed_in
    user ||--o{ review: gives_review
    book ||--o{ review: is_reviewed_by
    book ||--|{ book_category : is_classified_as
    category ||--o{ book_category : categorizes
    category ||--o{ user_category : interests
    user ||--o{ user_category : interested_in

    user {
        int id PK
        string email "auth credential"
        string password "hashed"
        string username
        string image "profile picture URL"
        string role "permissions"
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    library {
        int id PK
        string name
        boolean is_public "visibility toggle"
        datetime created_at
        datetime updated_at
        datetime deleted_at
        int user_id FK
    }

    library_book {
        int id PK
        string comment "personal note"
        date read_start
        date read_end
        datetime added_at
        datetime updated_at
        int book_id FK
        int library_id FK
    }

    book {
        int id PK
        string google_id "Google Books API reference"
        string title
        string cover "image URL/ID"
        string author
        string description
        string isbn
        string publisher
        date published_at
    }

    review {
        int id PK
        string content
        number rating "0 to 10"
        datetime created_at
        datetime updated_at
        datetime deleted_at
        int book_id FK
        int user_id FK
    }

    category {
        int id PK
        string name
        boolean is_active
    }

    book_category {
        int id PK
        int category_id FK
        int book_id FK
    }

    user_category {
        int id PK
        int category_id FK
        int user_id FK
    }

    classDef entity fill:#A8D8FF,stroke:#333,stroke-width:2px
    classDef pivot fill:#fff4db,stroke:#e67e22,stroke-width:1px
    classDef evolution fill:#ffe5e5,stroke:#c0392b,stroke-width:1px

    class review evolution
    class user,library,book,category entity
    class user_category,book_category,library_book pivot

```
