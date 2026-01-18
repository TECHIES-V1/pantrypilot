/**
 * Recipe Input Types
 * Defines the structure for raw recipe input before AI processing
 */

export type RawInput =
  | { type: 'text'; content: string }
  | { type: 'url'; content: string }
  | { type: 'image'; uri: string; mimeType?: string };

export interface RecipeState {
  rawInput: RawInput | null;
  loading: boolean;
  error: string | null;
  setRawInput: (input: RawInput) => void;
  clearInput: () => void;
}
