/prompts/Tobilola.md

Prompt 0  
You are a senior React Native engineer building the PantryPilot app.  
Your sole ownership is the multi-recipe planning and merging feature.  
You must not touch authentication, recipe ingestion/input, AI/Groq parsing, pantry management, single grocery list generation, cooking mode, recipe library, nutritional insights, or monetization/paywalls.  
You start today (Day 3). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth, Manuel’s recipe input, Moh’s Groq integration (parsed recipe JSON), Amram’s pantry utils (matchPantryToRecipe), Collins’ grocery list generation (GroceryListScreen, groceryStore, GroceryItem type), and Ishola’s library basics (saved recipes list) already present or in PR.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/multi-recipe`
- Create folder `src/screens/PlanningScreen/`
- Inside it, create `PlanningScreen.tsx`
- Create `src/store/planStore.ts`
- Create `src/types/plan.ts` with these exact types:

  ```ts
  export interface Plan {
    id: string;
    name: string; // e.g. "Weeknight Meals"
    recipeIds: string[]; // IDs from recipes table
    created_at: string;
  }

  export type PlanState = {
    plans: Plan[];
    currentPlan: Plan | null;
    loading: boolean;
    error: string | null;
  };
  ```

- In `planStore.ts` create a Zustand store with:
  - state: plans: [], currentPlan: null, loading: false, error: null
  - actions: fetchPlans, createPlan, addRecipesToPlan, generateMergedList, savePlan
  - fetchPlans: select from supabase 'plans' where user_id = current user.id
  - createPlan: insert new plan row { user_id, name, recipeIds: [], created_at: now() }
  - addRecipesToPlan: update plan row with new recipeIds array
  - generateMergedList: take selected recipeIds → fetch full recipes from supabase 'recipes' → merge ingredients
- In `PlanningScreen.tsx`:
  - Use `useAuthStore` to get current user
  - Use `usePlanStore` to get plans, currentPlan, fetchPlans, createPlan
  - Use `useLibraryStore` (from Ishola) to get saved recipes list for selection
  - Render SafeAreaView with:
    - Header title "Meal Planner"
    - Button "Create New Plan" → modal with name input → call createPlan
    - FlatList of existing plans (name + recipe count)
    - On plan press: set as currentPlan, show multi-select list of saved recipes
    - Multi-select checkboxes to add/remove recipes to currentPlan
    - "Generate Merged Grocery List" button → call generateMergedList → navigate to GroceryListScreen with merged items
- Commit: `git commit -m "Implement plan store, types, basic PlanningScreen UI with plan creation and recipe selection"`
- Push and create PR: `gh pr create --base main --title "Feature/multi-recipe planning core" --body "Multi-recipe selection and plan management"`

Prompt 1  
You are continuing work on the multi-recipe planning feature in branch feature/multi-recipe.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth, recipe input, AI parsing, pantry, single grocery list UI, cooking mode, library, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/multi-recipe
- In `planStore.ts` implement generateMergedList action:
  - Input: array of full parsed recipes (from supabase 'recipes' table, json_data column)
  - For each recipe: extract ingredients array
  - Normalize item names (lowercase, trim)
  - Merge: use Map<string, {quantity: number, unit: string, originals: string[]}>
  - Sum quantities when units match (simple add, assume same unit after normalization)
  - If units differ: keep separate entries with note
  - Output: array of merged GroceryItem objects (use GroceryItem type from Collins)
  - Set mergedItems in groceryStore (use set from Collins' store) or return for navigation
- Update `PlanningScreen.tsx`:
  - After selecting recipes and clicking "Generate Merged Grocery List":
    - Call generateMergedList(selectedRecipeIds)
    - On success: navigate to GroceryListScreen
    - Pass merged items via navigation params or set in groceryStore
  - Add plan name edit in plan detail view
  - Add delete plan button (soft delete or remove row)
- Create `src/components/PlanItemRow.tsx`:
  - Props: plan: Plan, onSelect, onDelete
  - Render: plan name, recipe count badge, chevron
- Use PlanItemRow in FlatList of plans
- Commit: `git commit -m "Implement merged ingredient logic, plan detail view, navigation to merged grocery list"`
- Push and update existing PR

Prompt 2  
You are finalizing the multi-recipe planning feature in branch feature/multi-recipe.  
Focus on polish, deduplication accuracy, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- Enhance merging logic in generateMergedList:
  - Use Moh’s normalization output if available (original field for fuzzy matching)
  - Deduplicate with similarity threshold (simple string includes or Levenshtein if you add tiny util)
  - When merging: preserve most common unit, add note if conflict (e.g. "2 cups + 500 ml flour")
  - Apply pantry filter post-merge: call matchPantryToRecipe(pantryItems, mergedIngredients)
  - Mark available/missing in the final GroceryItem array
- Update `PlanningScreen.tsx`:
  - Show preview count: "Will merge X ingredients from Y recipes"
  - Add loading state during merge calculation
  - After generate: show toast "Merged list ready – opening grocery view"
  - Persist currentPlan selection in AsyncStorage for app restart
- Test flow locally:
  - Save 2–3 recipes via input flow
  - Create plan, add recipes
  - Generate merged list → verify navigation to GroceryListScreen
  - Check items are summed correctly, pantry applied
  - Export merged list → confirm format includes merged quantities
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Improve merge deduplication, add pantry filter in merge, polish UI and persistence"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/multi-recipe should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in plan-related files
- Test end-to-end in local app:
  - Parse multiple recipes → save to library
  - Create plan → add recipes → generate merged list
  - In GroceryListScreen: confirm items are merged + pantry-filtered
  - Export merged list → verify text shows combined quantities
  - Regenerate after pantry update → list reflects changes
- If any bug found in merging, deduplication, or navigation, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for multi-recipe-related adjustments during final smoke test
- Final commit if needed: `git commit -m "Final multi-recipe planning integration fixes and validation"`

End of prompts for Tobilola.
