Role Summary

- Grocery list generation owner

What You Are Building

- Grocery list display & edit
- Categorization & export

Step-by-Step Tasks (Execution-Level)

- Create branch feature/grocery-list from main
- Create src/screens/GroceryListScreen.tsx
- Pull parsed recipe from recipeStore
- Apply pantry filter using Amram’s util
- Group items by category (hardcode: produce, dairy, meat, pantry, other)
- Render FlatList with checkboxes, qty adjuster
- Add export button: Share.share({ message: formatList(items) })
- Commit & PR

Files & Directories You Own

- src/screens/GroceryListScreen.tsx
- src/utils/listFormatter.ts (optional)

Interfaces With Other Work

- Expects: parsed ingredients + pantry filter from Moh & Amram
- Provides: final list UI used by multi-recipe & export

Validation Checklist

- List renders ingredients correctly
- Checked items persist locally
- Missing items shown after pantry applied
- Export produces readable text
