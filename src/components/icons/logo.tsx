import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M10.65 17.9a3.5 3.5 0 1 1-5.3-5.3" />
      <path d="M15.36 12H7.5" />
      <path d="m15.36 12 2.55-2.55" />
      <path d="m15.36 12 2.55 2.55" />
      <path d="M4.64 12h2.82" />
      <path d="M12 4.64v2.82" />
      <path d="M12 16.54v2.82" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
