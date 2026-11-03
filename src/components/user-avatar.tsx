"use client";

import { useState } from "react";

type UserAvatarProps = {
  /** Photo URL stored on the Better Auth user (absent for most readers). */
  src?: string | null;
  name: string;
  /** Fallback initials, e.g. the profile's two-letter short form. */
  initials?: string;
  /** Container classes, e.g. "size-9". */
  className?: string;
  /** Initials text classes, e.g. "text-sm". */
  textClassName?: string;
  /** Defaults to "" because the avatar usually sits next to the name. */
  alt?: string;
};

/**
 * Round reader avatar: shows the profile photo when one exists and falls
 * back to the reader's initial otherwise (including when the URL 404s).
 */
export default function UserAvatar({
  src,
  name,
  initials,
  className = "size-9",
  textClassName = "text-sm",
  alt = "",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  const fallback = initials ?? name.trim().charAt(0).toUpperCase();

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand font-sans font-bold text-cream ${className}`}
    >
      {src && !failed ? (
        // Photo URLs can be data URLs or arbitrary hosts, so next/image cannot
        // optimise them without extra configuration.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className={textClassName}>{fallback || "?"}</span>
      )}
    </span>
  );
}
