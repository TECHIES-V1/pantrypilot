Role Summary

- Recipe library & nutritional insights owner

What You Are Building

- Saved recipes list
- Search, tags, ratings
- Basic nutrition stub

Step-by-Step Tasks (Execution-Level)

- Create branch feature/library from main
- Create src/screens/LibraryScreen.tsx
- FlatList of saved parsed recipes
- Add tag input & search bar
- Save to Supabase recipes table on parse success
- Add basic nutrition: calories ≈ qty \* std values (hardcode map)
- Commit & PR

Files & Directories You Own

- src/screens/LibraryScreen.tsx
- src/store/libraryStore.ts

Interfaces With Other Work

- Expects: parsed recipe JSON
- Provides: library data to multi-recipe selector

Validation Checklist

- Parsed recipes appear after processing
- Can search by title/ingredient
- Tags saved
- Nutrition shows approximate values
