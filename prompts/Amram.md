Prompt 0  
You are a senior React Native + Supabase engineer building the PantryPilot app.  
Your sole ownership is the pantry/fridge context management feature.  
You must not touch authentication, recipe input, AI/Groq calls, grocery list generation, multi-recipe merging, cooking mode, library, or monetization.  
You start today (Day 2). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth, Manuel’s recipe input screen, and the basic Zustand + Supabase client already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/pantry`
- Create folder `src/screens/PantryScreen/`
- Inside it, create `PantryScreen.tsx`
- Create `src/store/pantryStore.ts`
- Create `src/utils/pantryUtils.ts`
- Create `src/types/pantry.ts` with these exact types:

  ```ts
  export interface PantryItem {
    id: string; // uuid or nanoid
    name: string;
    quantity: number;
    unit: string; // e.g. "kg", "cup", "piece"
    expiry?: string; // ISO date string or null
    created_at: string;
  }

  export type PantryState = {
    items: PantryItem[];
    loading: boolean;
    error: string | null;
  };
  ```

- In `pantryStore.ts` create a Zustand store with:
  - state: items: [], loading: false, error: null
  - actions: fetchPantry, addItem, updateItem, removeItem, clearError
  - Use supabase from `src/services/supabase.ts`
  - Table name: `pantries`
  - Row structure: { user_id: uuid, items_json: PantryItem[] }
  - On fetch: select items_json where user_id = current user.id
  - Persist changes with upsert (single row per user)
- In `PantryScreen.tsx`:
  - Use `useAuthStore` to get current user
  - Use `usePantryStore` to get items, loading, fetchPantry
  - Render a SafeAreaView with:
    - Header title "My Pantry"
    - FlatList of items (name, quantity unit, expiry if present)
    - Floating action button (+) to add new item
    - Each item row: editable quantity, delete swipe or button
- Add manual add form as a modal:
  - Fields: name (text), quantity (number), unit (picker: common units like g, kg, ml, cup, piece, pack), expiry (date picker optional)
  - On submit: generate id with uuid or nanoid, add to store + supabase upsert
- Run `npm run lint` and fix any issues
- Commit: `git commit -m "Implement pantry store, types, and basic PantryScreen UI"`
- Push and create PR: `gh pr create --base main --title "Feature/pantry core" --body "Pantry CRUD skeleton"`

Prompt 1  
You are continuing work on the pantry feature in branch feature/pantry.  
Previous work (Prompt 0) is merged or ready.  
Do NOT modify auth, recipe input, AI, grocery, cooking, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/pantry
- In `src/utils/pantryUtils.ts` add this exact function:

  ```ts
  export function matchPantryToRecipe(
    pantryItems: PantryItem[],
    recipeIngredients: Array<{
      item: string;
      quantity: number;
      unit: string;
      original: string;
    }>,
  ): {
    available: Array<{
      item: string;
      availableQty: number;
      requiredQty: number;
      unit: string;
    }>;
    missing: Array<{ item: string; requiredQty: number; unit: string }>;
  } {
    const result = { available: [], missing: [] };
    const pantryMap = new Map(
      pantryItems.map((i) => [i.name.toLowerCase(), i]),
    );

    for (const ing of recipeIngredients) {
      const key = ing.item.toLowerCase();
      const pantry = pantryMap.get(key);
      if (pantry && pantry.quantity >= ing.quantity) {
        result.available.push({
          item: ing.item,
          availableQty: pantry.quantity,
          requiredQty: ing.quantity,
          unit: ing.unit,
        });
      } else {
        result.missing.push({
          item: ing.item,
          requiredQty: ing.quantity,
          unit: ing.unit,
        });
      }
    }
    return result;
  }
  ```

- Update `PantryScreen.tsx`:
  - Add refresh control to FlatList that calls fetchPantry
  - Show loading indicator when loading=true
  - Show error toast if error !== null
  - Add camera button in header: use expo-image-picker to launch camera or library
  - On image picked: log placeholder message "OCR processing coming in future iteration – saving image URI for now"
  - Store image URIs temporarily in a separate array in pantryStore (images: string[])
- Add expiry date picker using @react-native-community/datetimepicker
- Commit: `git commit -m "Add pantry-recipe matching util, camera stub, refresh, error handling"`
- Push and update existing PR

Prompt 2  
You are finalizing the pantry feature in branch feature/pantry.  
Focus only on integration readiness and polish.  
Do NOT touch any other feature areas.

Execute these steps:

- Ensure `matchPantryToRecipe` is exported and typed correctly
- Create `src/components/PantryItemRow.tsx`:
  - Props: item: PantryItem, onUpdate, onDelete
  - Render: name, editable quantity input, unit, expiry badge if present, delete icon
  - Swipe to delete gesture using react-native-gesture-handler
- Update PantryScreen FlatList to use PantryItemRow component
- In pantryStore:
  - Add action `syncPantry()` that fetches and sets items
  - Call syncPantry on app focus (useAppState or similar)
- Add basic offline note: if !navigator.onLine show toast "Pantry shown from cache – connect to sync"
- Test flow locally:
  - Login → navigate to Pantry tab/screen
  - Add 3 items
  - Verify they appear in Supabase pantries table (items_json)
  - Delete one → confirm removal
  - Run matchPantryToRecipe with sample recipe ingredients → verify output in console
- Run full lint + format: `npm run lint -- --fix`
- Commit: `git commit -m "Polish pantry UI, add item row component, offline note, sync on focus"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/pantry should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in pantry-related files
- Test end-to-end in local app:
  - After a recipe is parsed (use a dummy parsed object if needed), call matchPantryToRecipe with pantry items and recipe ingredients
  - Confirm missing/available arrays are correct
- If any bug found in matching logic, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for pantry-related adjustments during final smoke test
- Final commit if needed: `git commit -m "Final pantry integration fixes and validation"`
