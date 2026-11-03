"use client";

import { ReactNode } from "react";

interface SaveButtonProps {
  children?: ReactNode;
  onSave: () => void;
  disabled?: boolean;
}

export default function SaveButton({ children, onSave, disabled = false }: SaveButtonProps) {
  return (
    <button
      type="button"
      onClick={onSave}
      disabled={disabled}
      className="flex-1 rounded-lg bg-brand px-5 py-2.5 font-sans text-sm font-medium text-cream transition-colors hover:bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:outline-brand-light"
    >
      {disabled ? (
        <>
          <span className="size-4 animate-spin" />
          Saving…
        </>
      ) : (
        children
      )}
    </button>
  );
}