Role Summary

- Recipe ingestion & input handling owner

What You Are Building

- Recipe input UI (URL, text, photo)
- Input validation & preprocessing
- Camera/photo library access

Step-by-Step Tasks (Execution-Level)

- Create branch feature/recipe-input from latest main
- Install expo-image-picker
- Create src/screens/RecipeInputScreen.tsx
- Add large text input + paste button + camera icon
- Use ImagePicker.launchCameraAsync / launchImageLibraryAsync
- On submit: validate URL (starts with http or youtube/tiktok pattern) or text length > 20 or image exists
- Store raw input temporarily in Zustand recipeStore: { rawInput: string | { uri: string, type: 'image' } }
- Create src/store/recipeStore.ts with current raw input + parsed result placeholder
- Navigate to processing screen on submit (placeholder for now)
- Commit & create PR

Files & Directories You Own

- src/screens/RecipeInputScreen.tsx
- src/store/recipeStore.ts (raw input part)

Interfaces With Other Work

- Expects: navigation from Eyitayo, auth guard from Daniel
- Provides: rawInput value in recipeStore for AI consumer

Validation Checklist

- Can paste URL and submit
- Can type multiline text and submit
- Can take photo or pick from library
- Input appears in recipeStore
- Navigation to next screen works
