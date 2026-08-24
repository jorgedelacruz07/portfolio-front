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
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  ...props
}: OptimizedImageProps) => {
  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={twMerge(clsx(className))}
      {...props}
    />
  );
};
