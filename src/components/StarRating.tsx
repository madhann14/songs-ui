"use client";

interface Props {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

/** Renders 5 clickable stars. Calls onChange with the clicked star number (1–5). */
export default function StarRating({
  value,
  onChange,
  readOnly = false,
}: Props) {
  return (
    <div className="flex gap-0.5" role="group" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => {
            if (!readOnly) onChange?.(star);
          }}
          disabled={readOnly}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className={[
            "text-xl leading-none",
            star <= value ? "text-yellow-400" : "text-gray-300",
            readOnly
              ? "cursor-default opacity-50"
              : "cursor-pointer hover:text-yellow-300",
          ].join(" ")}
        >
          ★
        </button>
      ))}
    </div>
  );
}
