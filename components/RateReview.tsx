// components/RatingReview.tsx
"use client";

import { useState } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useUserSession } from "@/context/SessionContext";

const RatingReview = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const { addOrUpdateReview } = useReviews();
  const { user } = useUserSession();

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user) {
      try {
        await addOrUpdateReview({ rating, review_text: review });
        setRating(0);
        setReview("");
      } catch (error) {
        console.error("Failed to submit review:", error);
      }
    }
  };

  return (
    <section id="review" className="px-4 py-8 max-w-6xl m-auto">
      <h2 className="text-2xl font-bold mb-4">
        Rate and Review your experience..
      </h2>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="flex items-center mb-4">
          <span className="text-lg mr-4">Rating:</span>
          {[...Array(5)].map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleRatingChange(index + 1)}
              className={`text-4xl focus:outline-none ${
                index + 1 <= rating ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              &#9733;
            </button>
          ))}
        </div>
        <div className="mb-4">
          <label htmlFor="review" className="block mb-2 text-lg">
            Review:
          </label>
          <textarea
            id="review"
            name="review"
            value={review}
            onChange={handleReviewChange}
            rows={4}
            className="w-full px-3 py-2 border rounded-md"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default RatingReview;
