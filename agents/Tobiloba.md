Role Summary

- Multi-recipe planning & merging owner

What You Are Building

- Recipe selection & merge UI
- Deduplication & quantity summing

Step-by-Step Tasks (Execution-Level)

- Create branch feature/multi-recipe from main
- Create src/screens/PlanningScreen.tsx
- FlatList of saved recipes (from Ishola library later)
- Multi-select → merge button
- Merge logic: sum quantities of same normalized item
- Use Moh’s normalization as key
- Generate combined grocery list
- Save plan to Supabase plans table
- Commit & PR

Files & Directories You Own

- src/screens/PlanningScreen.tsx
- src/store/planStore.ts

Interfaces With Other Work

- Expects: parsed recipes, grocery list base, normalization
- Provides: merged list to grocery UI

Validation Checklist

- Can select 2+ recipes
- Merged list shows summed quantities
- Duplicates removed
- Plan saved to Supabase
