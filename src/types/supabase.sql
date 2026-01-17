-- profiles: add more usage tracking if needed
ALTER TABLE profiles
  ADD COLUMN last_active_at timestamptz DEFAULT now(),
  ADD COLUMN preferences jsonb DEFAULT '{}';  -- dietary flags, units preference (metric/imperial)

-- recipes
ALTER TABLE recipes
  ADD COLUMN normalized_ingredients jsonb GENERATED ALWAYS AS (jsonb_path_query_array(json_data, '$.ingredients')) STORED,
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english', coalesce(title, '') || ' ' || coalesce(json_data->>'description', ''))
    ) STORED;

CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);
CREATE INDEX idx_recipes_ingredients_gin ON recipes USING GIN(normalized_ingredients);

-- pantries: add versioned history if needed later, but for now add index
CREATE INDEX idx_pantries_items_gin ON pantries USING GIN(items_json);





CREATE TABLE global_ingredients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL UNIQUE,
  category    text,               -- produce, dairy, etc.
  default_unit text,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE recipe_ingredients (
  recipe_id     uuid REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id uuid REFERENCES global_ingredients(id),
  quantity      numeric NOT NULL,
  unit          text NOT NULL,
  note          text,
  PRIMARY KEY (recipe_id, ingredient_id)
);

-- Then migrate: for each recipe, extract from json_data → insert into global_ingredients (upsert on name), then into recipe_ingredients
-- After migration: drop or archive json_data->'ingredients'











-- Add preferences to profiles (for future dietary stuff)
ALTER TABLE profiles
  ADD COLUMN preferences jsonb DEFAULT '{}'::jsonb;

-- Add generated/search indexes to recipes for better querying
ALTER TABLE recipes
  ADD COLUMN normalized_ingredients jsonb GENERATED ALWAYS AS (jsonb_path_query_array(json_data, '$.ingredients')) STORED,
  ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (
      to_tsvector('english', coalesce(title, '') || ' ' || coalesce(json_data->>'description', ''))
    ) STORED;

CREATE INDEX idx_recipes_search ON recipes USING GIN(search_vector);
CREATE INDEX idx_recipes_ingredients_gin ON recipes USING GIN(normalized_ingredients);

-- Add index to pantries for faster jsonb lookups
CREATE INDEX idx_pantries_items_gin ON pantries USING GIN(items_json);

-- Optional: Split profiles policy for finer control (no functional change)
DROP POLICY "Users own their profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);