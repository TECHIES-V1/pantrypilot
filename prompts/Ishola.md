Prompt 0  
You are a senior React Native engineer building the PantryPilot app.  
Your sole ownership is the recipe library feature (saved recipes list, search, tagging, ratings, history persistence) and basic nutritional insights (approximate calorie/protein estimates from hardcoded data).  
You must not touch authentication (except reading user id), recipe ingestion/input UI, AI/Groq parsing (only consume parsed result), pantry management, grocery list generation, multi-recipe planning/merging, cooking mode execution, monetization/paywalls, or any core processing logic.  
You start today (Day 3). The repo is on the latest main branch with Eyitayo’s scaffold, Daniel’s auth (useAuthStore), Manuel’s recipe input (rawInput), Moh’s Groq integration (parsed ExtractionResult in recipeStore), and basic Zustand + Supabase client already present.

Execute these steps in order:

- Create a new branch: `git checkout -b feature/library`
- Create folder `src/screens/LibraryScreen/`
- Inside it, create `LibraryScreen.tsx`
- Create `src/store/libraryStore.ts`
- Create `src/types/library.ts` with these exact types:

  ```ts
  export interface SavedRecipe {
    id: string; // Supabase uuid
    title: string;
    ingredients: Array<{
      item: string;
      quantity: number;
      unit: string;
      original: string;
    }>;
    steps: string[];
    servings?: number;
    time?: string;
    tags: string[]; // e.g. ["quick", "vegan", "dinner"]
    rating: number; // 1–5
    notes?: string;
    completed_at?: string | null;
    created_at: string;
  }

  export type LibraryState = {
    recipes: SavedRecipe[];
    searchQuery: string;
    selectedTags: string[];
    loading: boolean;
    error: string | null;
  };
  ```

- In `libraryStore.ts` create a Zustand store with:
  - state: recipes: [], searchQuery: '', selectedTags: [], loading: false, error: null
  - actions: fetchRecipes, saveRecipe(parsed: ExtractionResult), updateRecipe(id: string, updates: Partial<SavedRecipe>), deleteRecipe(id: string), setSearchQuery, addTag, removeTag
  - fetchRecipes: supabase.from('recipes').select('\*').eq('user_id', user.id).order('created_at', { ascending: false })
  - saveRecipe: supabase.from('recipes').insert({ user_id, title: parsed.title || 'Untitled', ...parsed, tags: [], rating: 0, created_at: now() }).select().single()
  - update: .update(updates).eq('id', id)
  - delete: .delete().eq('id', id)
- In `LibraryScreen.tsx`:
  - Use useAuthStore to get user
  - Use useLibraryStore for recipes, fetchRecipes, setSearchQuery
  - Render SafeAreaView with:
    - Header: "My Recipes" title
    - Search bar: TextInput for searchQuery (onChangeText → setSearchQuery)
    - Tag filter chips (hardcode common tags: quick, vegetarian, breakfast, dinner – toggle selectedTags)
    - FlatList of recipes (filtered by searchQuery on title/ingredients and selectedTags)
    - Each item: title, tag badges, rating stars (readonly), date
- Commit: `git commit -m "Implement library store, types, LibraryScreen with fetch and basic list"`
- Push and create PR: `gh pr create --base main --title "Feature/library core" --body "Saved recipes list, search, tags skeleton"`

Prompt 1  
You are continuing work on the library feature in branch feature/library.  
Previous work (Prompt 0) is complete or merged.  
Do NOT modify auth, recipe input, AI parsing, pantry, grocery, multi-recipe, cooking mode, or monetization code.

Execute these steps:

- Pull latest main if needed, then rebase or merge main into feature/library
- In `libraryStore.ts`:
  - Add action saveCurrentParsed: if recipeStore.parsed exists → call saveRecipe(parsed) → add returned row to recipes state → clear recipeStore.rawInput
  - Add action rateRecipe(id: string, rating: number): updateRecipe(id, { rating })
  - Add action addNote(id: string, note: string): updateRecipe(id, { notes: note })
  - Add action markCompleted(id: string): updateRecipe(id, { completed_at: new Date().toISOString() })
- Create `src/screens/RecipeDetailScreen.tsx`:
  - Receives recipe via route.params or from store
  - Render: title, servings/time, ingredients list (FlatList), steps (numbered), tags (editable chips), rating stars (interactive 1–5), notes TextInput
  - Buttons: Edit tags (modal with add/remove), Mark as Completed, Delete
  - On mount: if from cooking completion → auto markCompleted
- Update `LibraryScreen.tsx`:
  - Make list items tappable → navigate to RecipeDetailScreen
  - Add filter chips for completed/not completed
  - Show empty state: "No recipes yet – add your first!"
- In recipeStore (minimal change – coordinate with Moh):
  - After successful parse (in Moh’s parse action success): call libraryStore.saveCurrentParsed()
- Commit: `git commit -m "Add save after parse, RecipeDetailScreen with rating/notes/completion, tag editing"`
- Push and update existing PR

Prompt 2  
You are finalizing the library feature in branch feature/library.  
Focus on nutritional insights stub, search/tag filtering accuracy, and integration readiness.  
Do NOT touch any other feature areas.

Execute these steps:

- In `libraryStore.ts`:
  - Add basic nutrition stub to saveRecipe:
    - Hardcode simple map in constants/nutrition.ts:
      ```ts
      const CALORIES_PER: Record<string, number> = {
        egg: 70,
        chicken: 165,
        rice: 130,
        tomato: 18 /* per 100g */,
      };
      ```
    - On save: estimate totalCalories = sum over ingredients (quantity _ factor _ CALORIES_PER[item] || 100)
    - Save as nutrition: { calories: number, protein?: number }
  - In SavedRecipe type: add nutrition?: { calories: number; protein?: number }
- In `RecipeDetailScreen.tsx`:
  - Show nutrition card: "Approx. ${nutrition?.calories || 'N/A'} calories"
  - Add tag editor modal: TextInput + add button, FlatList of current tags with remove
  - Implement search filtering: useMemo to filter recipes by title/ingredients.includes(searchQuery.toLowerCase()) AND all selectedTags present
- In `LibraryScreen.tsx`:
  - Add sort options: newest/oldest, rating high-low (dropdown)
  - Persist searchQuery and selectedTags in AsyncStorage (zustand persist)
  - Add refresh control → call fetchRecipes
- Test flow locally:
  - Parse/save recipe → appears in library
  - Search by ingredient → filters correctly
  - Add tag "vegan" → filter by tag
  - Rate 4 stars → shows in list
  - Mark completed → badge or filter works
  - Nutrition estimate displays (even approximate)
- Run `npm run lint -- --fix`
- Commit: `git commit -m "Add basic nutrition stub, advanced filtering/sort, tag editor, persistence, polish"`
- Push and mark PR as ready for review

Prompt 3 (Integration Day – Day 4)  
You are supporting final integration on Day 4.  
Branch feature/library should already be merged or ready.

Execute these steps:

- Checkout main and pull latest
- If your PR is not yet merged, rebase on latest main and resolve conflicts only in library-related files
- Test end-to-end in local app:
  - Parse recipe → auto-save to library → appears in list
  - From cooking completion → mark completed
  - Search + tag filter → accurate results
  - View detail → edit tags/notes/rating → saves to Supabase
  - Nutrition shows approximate value
  - Multi-recipe plan (Tobilola) can pull from this list
- If any bug found in save after parse, filtering, Supabase sync, nutrition calc, or detail editing, fix and commit small patch
- Do NOT open new PRs unless critical bug
- Assist Eyitayo if asked for library-related adjustments during final smoke test (e.g. recipe handoff, search performance, detail navigation)
- Final commit if needed: `git commit -m "Final library integration fixes, filter accuracy, nutrition display, sync validation"`

End of prompts for Ishola.
