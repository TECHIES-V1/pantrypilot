Role Summary

- Pantry & inventory management owner

What You Are Building

- Pantry CRUD UI
- Barcode & OCR photo scanning stub
- Pantry-recipe cross-reference logic

Step-by-Step Tasks (Execution-Level)

- Create branch feature/pantry from main
- Create src/screens/PantryScreen.tsx with FlatList of items
- Use Zustand pantryStore: items: Array<{ name: string, quantity: number, unit: string, expiry?: string }>
- Persist to Supabase: supabase.from('pantries').upsert({ user_id: auth.user.id, items_json: items })
- Add manual add form: name, qty, unit dropdown
- Add camera button → ImagePicker → placeholder OCR text "OCR coming soon"
- Create util matchPantryToRecipe(pantry, recipeIngredients): returns { available: [], missing: [] }
- Commit & PR

Files & Directories You Own

- src/screens/PantryScreen.tsx
- src/store/pantryStore.ts
- src/utils/pantryUtils.ts

Interfaces With Other Work

- Expects: auth from Daniel
- Provides: pantry items to grocery list generator

Validation Checklist

- Can add/remove pantry items
- Items saved to Supabase
- matchPantryToRecipe returns correct split
- UI shows available/missing after recipe parsed
