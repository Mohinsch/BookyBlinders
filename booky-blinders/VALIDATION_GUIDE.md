# Validation Zod - Backend & Client

Ce document explique comment utiliser la validation Zod côté backend (Server Actions) et consommer les erreurs côté client.

## Architecture

### Fichiers clés

- **`src/lib/schemas.ts`** - Schémas Zod réutilisables (définition unique de la vérité)
- **`src/lib/validation.ts`** - Utilitaire de validation et formatage d'erreurs
- **`src/actions/library.ts`** - Server Actions avec validation Zod intégrée
- **`src/types/library.ts`** - Types TypeScript incluant `ActionResponse` avec erreurs

### Flux de validation

```
Client Form Input
    ↓
Server Action (avec validation Zod)
    ↓
ValidationResult<T> {
  success: boolean,
  data?: T,
  errors?: ValidationError[]
}
    ↓
Client Error Handling (errorsToFieldMap, getFieldError, etc.)
```

## Utilisation côté Backend (Server Actions)

### 1. Importer le schéma et les types

```typescript
import { createLibrarySchema, type CreateLibraryInput } from "@/lib/schemas";
import { validateWithZod } from "@/lib/validation";
```

### 2. Valider les données dans l'action

```typescript
export async function createLibrary(name: string): Promise<ActionResponse> {
  try {
    // Valider avec Zod
    const validationResult = validateWithZod<CreateLibraryInput>(
      createLibrarySchema,
      { name }
    );

    // Si validation échoue, retourner les erreurs structurées
    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    // Continuer avec les données validées
    const user = await requireAuth();
    await db.insert(library).values({
      userId: user.id,
      name: validationResult.data!.name, // data est typé et non-null
      isPublic: false,
    });

    return { success: true, message: "Library created" };
  } catch (error) {
    console.error("[Action Error] createLibrary:", error);
    const message = error instanceof Error ? error.message : "Failed to create library";
    return { success: false, message };
  }
}
```

## Utilisation côté Client

### 1. Format des erreurs retournées

```typescript
// Si validation échoue:
{
  success: false,
  errors: [
    { field: "name", message: "Library name is required" },
    { field: "libraryId", message: "Invalid library ID" }
  ]
}

// Si succès:
{
  success: true,
  message: "Library created"
}

// Si erreur serveur:
{
  success: false,
  message: "Failed to create library"
}
```

### 2. Utilitaires pour consommer les erreurs

#### `errorsToFieldMap(errors)`
Convertit un tableau d'erreurs en objet pour le rendu de formulaire.

```typescript
const result = await createLibrary("very long name...");
if (!result.success && result.errors) {
  const fieldErrors = errorsToFieldMap(result.errors);
  // { "name": "Library name must be less than 100 characters" }
  
  // Utiliser dans un formulaire React
  setFormErrors(fieldErrors);
}
```

#### `getFieldError(errors, field)`
Obtient le message d'erreur pour un champ spécifique.

```typescript
const result = await renameLibrary(1, "");
if (!result.success && result.errors) {
  const nameError = getFieldError(result.errors, "name");
  if (nameError) {
    console.error(nameError); // "Library name is required"
  }
}
```

#### `formatErrors(errors)`
Formate toutes les erreurs en une chaîne lisible.

```typescript
const result = await createLibrary("x");
if (!result.success && result.errors) {
  const message = formatErrors(result.errors);
  // "name: Library name must be at least 2 characters"
  
  showToast(message, "error");
}
```

## Exemple complet : Formulaire React

```typescript
"use client";

import { useState } from "react";
import { createLibrary } from "@/actions/library";
import { errorsToFieldMap, formatErrors } from "@/lib/validation";

export function CreateLibraryForm() {
  const [name, setName] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError("");

    const result = await createLibrary(name);

    if (!result.success) {
      if (result.errors) {
        // Erreurs de validation structurées
        setFieldErrors(errorsToFieldMap(result.errors));
      } else if (result.message) {
        // Erreur serveur générale
        setGlobalError(result.message);
      }
    } else {
      // Succès
      setName("");
      console.log("Library created successfully!");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {globalError && (
        <div className="error-alert">{globalError}</div>
      )}

      <div className="form-group">
        <label htmlFor="name">Library Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldErrors.name ? "input-error" : ""}
        />
        {fieldErrors.name && (
          <em className="field-error">{fieldErrors.name}</em>
        )}
      </div>

      <button type="submit">Create Library</button>
    </form>
  );
}
```

## Schémas disponibles

### Auth
- `loginSchema` - Email + Password
- `registerSchema` - Name + Email + Password

### Library
- `createLibrarySchema` - Name
- `renameLibrarySchema` - LibraryId + Name
- `deleteLibrarySchema` - LibraryId

### Book
- `addBookToLibrarySchema` - GoogleId + optional LibraryId
- `updateReadingStatusSchema` - BookId + Status + optional LibraryId
- `removeBookFromLibrarySchema` - BookId + optional LibraryId
- `getUserLibrarySchema` - optional LibraryId

## Ajouter un nouveau schéma

### 1. Définir le schéma dans `src/lib/schemas.ts`

```typescript
export const myNewActionSchema = z.object({
  field1: z.string().min(1, "Field 1 is required"),
  field2: z.number().positive("Field 2 must be positive"),
});

export type MyNewActionInput = z.infer<typeof myNewActionSchema>;
```

### 2. Utiliser dans la Server Action

```typescript
import { myNewActionSchema, type MyNewActionInput } from "@/lib/schemas";

export async function myNewAction(field1: string, field2: number): Promise<ActionResponse> {
  try {
    const validationResult = validateWithZod<MyNewActionInput>(
      myNewActionSchema,
      { field1, field2 }
    );

    if (!validationResult.success) {
      return { success: false, errors: validationResult.errors };
    }

    // ... rest of the action
  } catch (error) {
    // ... error handling
  }
}
```

## Bonnes pratiques

1. **Définis chaque schéma une seule fois** dans `src/lib/schemas.ts`
2. **Génère les types avec `z.infer`** plutôt que de les écrire manuellement
3. **Toujours vérifier `success` d'abord** avant d'accéder à `data` ou `errors`
4. **Utilise `errorsToFieldMap()` pour les formulaires** (plus facile à lier aux champs)
5. **Repose sur la validation serveur** - n'ajoute pas de duplication côté client
6. **Affiche les erreurs de validation inline** sur les champs de formulaire
7. **Utilise `result.message` comme fallback** pour les erreurs serveur non-validées
8. **Log les erreurs côté serveur** pour le débogage (`console.error`)

## Notes de développement

- Les schémas Zod peuvent être partagés entre client (validation UI) et serveur (validation critique)
- La validation serveur est **toujours de confiance** - jamais ne contourner
- Les types TypeScript sont inférés automatiquement de Zod pour la sécurité du type
- Les erreurs sont structurées par champ pour faciliter le rendu formulaire
