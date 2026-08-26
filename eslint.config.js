import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const responsive = {
  rules: {
    'no-fixed-layout-units': {
      meta: {
        type: 'problem',
        schema: [],
        messages: {
          fixedUnit: 'Use rem-based sizing; px/vw/vh and non-scaling SVG strokes bypass viewport scaling.',
        },
      },
      create(context) {
        return {
          Program() {
            const source = context.sourceCode
            const pattern = /\d+(?:\.\d+)?(?:px|vw|vh)\b|non-scaling-stroke|\b(?:width|height)\s*:\s*\d+/g

            for (const match of source.text.matchAll(pattern)) {
              context.report({
                loc: {
                  start: source.getLocFromIndex(match.index),
                  end: source.getLocFromIndex(match.index + match[0].length),
                },
                messageId: 'fixedUnit',
              })
            }
          },
        }
      },
    },
  },
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.tsx'],
    plugins: { responsive },
    rules: {
      'responsive/no-fixed-layout-units': 'error',
      'no-restricted-syntax': ['error', {
        selector: 'JSXAttribute[name.name=/^on(Drag|DragStart|DragEnd|DragEnter|DragOver|DragLeave|Drop)$/]',
        message: 'Native HTML5 drag-and-drop lets the OS paint the cursor, losing the stall cursor. Use usePointerDrag from src/pointerDrag.ts.',
      }],
    },
  },
])
