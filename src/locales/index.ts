import type { Locale } from '../types.js';
import { en } from './en.js';
import { sr } from './sr.js';
import { de } from './de.js';
import { es } from './es.js';
import { it } from './it.js';
import { fr } from './fr.js';

export { en, sr, de, es, it, fr };

/** Built-in locales by language code. */
export const locales: Record<string, Locale> = { en, sr, de, es, it, fr };
