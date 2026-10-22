import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Registra a escala tipografica do DS (`text-h1`, `text-body`...) como tamanho de fonte,
// para o twMerge nao confundir com cor de texto (`text-gp-*`) e descartar uma das classes.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "h1",
            "h2",
            "h3",
            "body",
            "body-sm",
            "caption",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
