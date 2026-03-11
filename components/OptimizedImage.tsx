import type { ImgHTMLAttributes } from "react";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type OptimizedImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export const OptimizedImage = ({
  src,
  alt,
  className,
  loading,
  decoding,
  fetchPriority,
  ...props
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      className={twMerge(clsx(className))}
      {...(fetchPriority
        ? ({ fetchpriority: fetchPriority } as Record<string, string>)
        : {})}
      {...props}
    />
  );
};
