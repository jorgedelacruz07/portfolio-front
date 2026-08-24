import type { ImgHTMLAttributes } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "fetchPriority"
> & {
  src: string;
  alt: string;
  fetchPriority?: "high" | "low" | "auto";
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
      fetchpriority={fetchPriority}
      className={twMerge(clsx(className))}
      {...props}
    />
  );
};
