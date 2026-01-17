Prompt 0  
You are a senior React Native engineer building the PantryPilot app.  
Your sole ownership is the grocery list generation feature.  
You must not touch authentication, recipe ingestion/input, AI/Groq parsing, pantry management, multi-recipe merging, cooking mode, recipe library, nutritional insights, or monetization/paywalls.  
You start today (Day 2). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth, Manuel’s recipe input, Moh’s Groq integration (parsed recipe JSON shape available), and Amram’s pantry matching util (matchPantryToRecipe) already present or in PR.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/grocery-list`
- Create folder `src/screens/GroceryListScreen/`
- Inside it, create `GroceryListScreen.tsx`
- Create `src/types/grocery.ts` with these exact types:

  ```ts
  export interface GroceryItem {
    item: string;
    quantity: number;
    unit: string;
    original: string;
    category?: string; // e.g. "produce", "dairy", "meat", "pantry", "other"
    checked: boolean;
  }

  export type GroceryListState = {
    items: GroceryItem[];
    loading: boolean;
    error: string | null;
  };
  ```

- In `src/store/groceryStore.ts` create a Zustand store with:
  - state: items: [], loading: false, error: null
  - actions: generateFromRecipe, toggleItem, updateQuantity, clearList, setError
  - generateFromRecipe: take parsed recipe ingredients + optional pantry match result
  - Apply pantry filter if provided: use matchPantryToRecipe to mark available items (do not remove them, just add category or flag if needed)
  - Categorize items using this simple rule-based function (add to store or util):
    - produce: fruit, vegetable, herb names
    - dairy: milk, cheese, butter, yogurt, egg
    - meat: chicken, beef, fish, pork
    - pantry: flour, sugar, oil, spice, rice, pasta
    - other: default
- In `GroceryListScreen.tsx`:
  - Use `useAuthStore` to guard (redirect if not logged in)
  - Use `useGroceryStore` to get items, loading, generateFromRecipe
  - Use `useRecipeStore` (from Moh/Manuel) to get current parsed recipe
  - Use `usePantryStore` (from Amram) to get items for filtering
  - On mount: if parsed recipe exists and no list yet, call generateFromRecipe(parsed.ingredients, matchPantryToRecipe(pantry.items, parsed.ingredients))
  - Render SafeAreaView with:
    - Header title "Grocery List"
    - SectionList grouped by category (title = category, data = items in that category)
    - Each item: checkbox (toggle checked), name, quantity unit, swipe to delete or edit qty
    - Floating action: "Export List" button
- Implement export: use Share.share({ message: formatListAsText(items) }) where formatListAsText groups by category and lists checked/unchecked separately
- Create `src/utils/listUtils.ts` with formatListAsText function
- Commit: `git commit -m "Implement grocery list store, types, basic screen with categorization and export"`
- Push and create PR: `gh pr create --base main --title "Feature/grocery-list core" --body "Single recipe grocery list generation and UI"`

Prompt 1  
You are continuing work on the grocery list feature in branch feature/grocery-list.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth, recipe input, AI parsing, pantry, multi-recipe, cooking, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/grocery-list
- Enhance categorization in groceryStore:
  - Improve category assignment with a more robust matcher (array of keywords per category)
  - Example: produceKeywords = ['apple', 'banana', 'carrot', 'tomato', 'onion', 'lettuce', ...] – add at least 20 common items
- Update `GroceryListScreen.tsx`:
  - Add quantity stepper (+/- buttons) on each item row
  - Persist checked state locally in Zustand (no Supabase for now)
  - Add "Clear Checked" button to remove checked items from list
  - Add refresh control that regenerates list from current parsed recipe + pantry
  - Show toast "List updated with current pantry" after regeneration
- Create `src/components/GroceryItemRow.tsx`:
  - Props: item: GroceryItem, onToggle, onQuantityChange, onDelete
  - Render: checkbox, name + quantity unit, stepper, delete icon
  - Use Gesture Handler for swipe-to-delete
- Replace FlatList/SectionList items with GroceryItemRow
- Add loading spinner when generating list
- Commit: `git commit -m "Enhance grocery categorization, add item row component, quantity editing, clear checked"`
- Push and update existing PR

Prompt 2  
You are finalizing the grocery list feature in branch feature/grocery-list.  
Focus on polish, export quality, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- In `listUtils.ts` improve formatListAsText:
  - Output markdown-style list grouped by category
  - Show checked items with [x], unchecked with [ ]
  - Include total estimated items count
  - Example output:
    Produce
    - [ ] 2 kg tomatoes
    - [x] 1 bunch spinach
- Update export button to use the improved formatter
- Add "Copy to Clipboard" button alongside Share
- In groceryStore:
  - Add action `resetFromRecipe()` to force regeneration
  - Persist current list to AsyncStorage on change (use zustand persist middleware if installed, else manual)
- Test flow locally:
  - Parse a sample recipe (navigate from input)
  - Go to GroceryListScreen
  - Verify categories applied correctly
  - Check/uncheck items
  - Adjust quantity
  - Export and verify text format
  - Regenerate after adding pantry items (simulate)
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Polish grocery export format, add clipboard copy, local persistence, final UI tweaks"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/grocery-list should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in grocery-related files
- Test end-to-end in local app:
  - After recipe parsed → navigate to grocery list
  - Confirm list generates with pantry filtering (missing only or flagged)
  - Check export text is clean and grouped
  - Toggle items and regenerate → state preserved where possible
- If any bug found in list generation or categorization, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for grocery-related adjustments during final smoke test
- Final commit if needed: `git commit -m "Final grocery list integration fixes and validation"`
