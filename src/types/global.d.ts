/**
 * Global Type Declarations for PantryPilot
 * Based on Supabase schema in types/supabase.sql
 */

// Database row types matching Supabase schema
declare namespace DB {
  // profiles table
  interface Profile {
    id: string;
    email: string;
    tier: "free" | "plus" | "pro";
    monthly_recipe_count: number;
    last_active_at: string;
    preferences: UserPreferences;
    created_at: string;
  }

  interface UserPreferences {
    dietary?: (
      | "vegan"
      | "vegetarian"
      | "gluten-free"
      | "dairy-free"
      | "nut-free"
    )[];
    units?: "metric" | "imperial";
    defaultServings?: number;
  }

  // recipes table
  interface Recipe {
    id: string;
    user_id: string;
    title: string | null;
    json_data: RecipeData;
    tags: string[];
    rating: number;
    notes: string | null;
    completed_at: string | null;
    created_at: string;
    // Generated columns (read-only)
    normalized_ingredients?: object;
    search_vector?: string;
  }

  interface RecipeData {
    ingredients: Ingredient[];
    steps: Step[];
    description?: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    sourceUrl?: string;
    imageUrl?: string;
  }

  interface Ingredient {
    item: string;
    quantity: number;
    unit: string;
    notes?: string;
  }

  interface Step {
    order: number;
    instruction: string;
    duration?: number;
    timerRequired?: boolean;
  }

  // global_ingredients table
  interface GlobalIngredient {
    id: string;
    name: string;
    category: string | null;
    default_unit: string | null;
    created_at: string;
  }

  // recipe_ingredients junction table
  interface RecipeIngredient {
    recipe_id: string;
    ingredient_id: string;
    quantity: number;
    unit: string;
    note: string | null;
  }

  // pantries table
  interface Pantry {
    user_id: string;
    items_json: PantryItem[];
    created_at: string;
  }

  interface PantryItem {
    id: string;
    name: string;
    quantity?: number;
    unit?: string;
    category?: string;
    expires_at?: string;
    added_at: string;
  }

  // plans table
  interface Plan {
    id: string;
    user_id: string;
    name: string | null;
    recipe_ids: string[];
    created_at: string;
  }

  // Grocery list (not persisted in DB, but used in app)
  interface GroceryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    checked: boolean;
    recipe_id?: string;
  }
}

// App-level types
declare namespace App {
  type ThemeName = "rainforest" | "desert" | "cyberpunk" | "deepSea";

  type InputType = "url" | "text" | "photo";

  interface RecipeInput {
    type: InputType;
    content: string;
    timestamp: string;
  }

  interface ExtractionResult {
    ingredients: DB.Ingredient[];
    steps: DB.Step[];
    title?: string;
    servings?: number;
    prepTime?: number;
    cookTime?: number;
    confidence: number;
  }

  interface ExtractionError {
    message: string;
    code: "PARSE_FAILED" | "NETWORK_ERROR" | "TIMEOUT" | "INVALID_INPUT";
  }

  interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    success: boolean;
  }

  // Tier limits from PRD
  interface TierLimits {
    recipesPerMonth: number;
    multiRecipeMerge: boolean;
    substitutions: boolean;
    nutritionalAnalysis: boolean;
    weeklyAiPlans: boolean;
  }
}
