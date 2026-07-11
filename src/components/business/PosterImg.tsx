import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK =
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  fallback?: string;
}

/**
 * Poster / cover image that gracefully falls back to a branded stage photo
 * if the source URL fails to load. Reuse for any production/show thumbnail.
 */
export function PosterImg({ src, fallback = FALLBACK, className, alt = "", ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  const resolved = !src || errored ? fallback : src;
  return (
    <img
      {...rest}
      alt={alt}
      src={resolved}
      onError={() => setErrored(true)}
      className={cn("bg-muted", className)}
      loading={rest.loading ?? "lazy"}
    />
  );
}
