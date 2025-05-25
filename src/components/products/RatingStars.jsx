import React from "react";

const RatingStars = ({ averageRating }) => {
  // لو مفيش rating نخليها 0 عشان ما تكسرش الكومبوننت
  const rating = averageRating || 0;

  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        // تحديد نوع النجمة: كاملة، نصفية أو فارغة
        if (rating >= star) {
          // نجمة كاملة
          return (
            <svg
              key={star}
              width="20"
              height="20"
              fill="#fbbf24"
              viewBox="0 0 24 24"
              stroke="#fbbf24"
              strokeWidth="1.5"
            >
              <path d="M11.48 3.5l2.12 5.11 5.52.44-4.2 3.6 1.28 5.39-4.73-2.88-4.72 2.88 1.28-5.39-4.2-3.6 5.52-.44 2.12-5.11z" />
            </svg>
          );
        } else if (rating >= star - 0.5) {
          // نجمة نصفية
          return (
            <svg
              key={star}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              stroke="#fbbf24"
              strokeWidth="1.5"
            >
              <defs>
                <linearGradient id={`halfGradient${star}`}>
                  <stop offset="50%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#d1d5db" />
                </linearGradient>
              </defs>
              <path
                fill={`url(#halfGradient${star})`}
                d="M11.48 3.5l2.12 5.11 5.52.44-4.2 3.6 1.28 5.39-4.73-2.88-4.72 2.88 1.28-5.39-4.2-3.6 5.52-.44 2.12-5.11z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          );
        } else {
          // نجمة فارغة
          return (
            <svg
              key={star}
              width="20"
              height="20"
              fill="#d1d5db"
              viewBox="0 0 24 24"
              stroke="#d1d5db"
              strokeWidth="1.5"
            >
              <path d="M11.48 3.5l2.12 5.11 5.52.44-4.2 3.6 1.28 5.39-4.73-2.88-4.72 2.88 1.28-5.39-4.2-3.6 5.52-.44 2.12-5.11z" />
            </svg>
          );
        }
      })}
    </div>
  );
};

export default RatingStars;
