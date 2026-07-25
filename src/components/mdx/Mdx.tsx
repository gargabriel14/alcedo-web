import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

/**
 * Renderiza MDX en el servidor, en tiempo de build.
 *
 * - `remark-gfm`: tablas, tachado y listas de tareas en el Markdown.
 * - `rehype-slug`: pone `id` a los titulares para que el índice del artículo
 *   pueda enlazarlos. Usa el mismo algoritmo que `extraerIndice`.
 *
 * El aspecto lo pone la clase `.prosa` de globals.css, así que quien escribe el
 * contenido no necesita saber una sola clase de Tailwind.
 */
interface PropsMdx {
  fuente: string;
  /** Componentes propios disponibles dentro del MDX, p. ej. `<Captura />`. */
  componentes?: MDXComponents;
  className?: string;
}

export function Mdx({ fuente, componentes, className }: PropsMdx) {
  return (
    <div className={cn("prosa", className)}>
      <MDXRemote
        source={fuente}
        components={componentes}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug],
          },
        }}
      />
    </div>
  );
}
