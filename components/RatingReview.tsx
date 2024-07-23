"use client";

import { useState, useEffect } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useUserSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { ReviewType } from "@/types/custom";
const RatingReview = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { reviews, addReview, editReview, deleteReview } = useReviews();
  const { user, loading: userLoading } = useUserSession();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      const existingReview = reviews.find((r) => r.user_id === user.id);
      if (existingReview) {
        setEditingReviewId(existingReview.id);
        setRating(existingReview.rating);
        setReview(existingReview.review_text);
      } else {
        setEditingReviewId(null);
        setRating(0);
        setReview("");
      }
    }
  }, [reviews, user]);

  const handleRatingChange = (value: number) => {
    setRating(value);
    if (error) setError(null);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
    if (error) setError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rating === 0) {
      setError("Please select at least one star.");
      return;
    }
    try {
      if (user) {
        // Ensure user_name and user_email are not undefined
        const reviewData: Omit<ReviewType, "id"> = {
          rating,
          review_text: review,
          user_id: user.id,
          user_name: user.name || "", // Provide default value if user.name is undefined
          user_email: user.email || "", // Provide default value if user.email is undefined
          created_at: new Date().toISOString(),
        };

        if (editingReviewId) {
          await editReview(editingReviewId, reviewData);
        } else {
          await addReview(reviewData);
        }

        setRating(0);
        setReview("");
        setEditingReviewId(null);
      } else {
        router.push("/user"); // Redirect to login page
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  const handleDelete = async () => {
    if (editingReviewId) {
      try {
        await deleteReview(editingReviewId);
        setRating(0);
        setReview("");
        setEditingReviewId(null);
      } catch (error) {
        console.error("Failed to delete review:", error);
      }
    }
  };

  if (userLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <section className="px-4 py-8 max-w-6xl m-auto text-center">
        <h2 className="text-2xl font-bold mb-4">
          Rate and Review your experience..
        </h2>
        <p className="mb-4">
          You need to{" "}
          <a href="/users" className="text-blue-500 underline">
            login
          </a>{" "}
          to submit or manage your review.
        </p>
      </section>
    );
  }

  return (
    <section id="review" className="px-4 py-8 max-w-6xl m-auto">
      <h2 className="text-2xl font-bold mb-4">
        Rate and Review your experience..
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6"
      >
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
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 border border-red-300 rounded-md">
            {error}
          </div>
        )}
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
          {editingReviewId ? "Update" : "Submit"}
        </button>
        {editingReviewId && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-4"
          >
            Delete
          </button>
        )}
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">All Reviews:</h3>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review) => (
              <li
                key={review.id}
                className="border p-4 mb-4 rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <span className="text-lg font-semibold mr-4">
                      {review.user_name}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({review.user_email})
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={`text-sm ${
                          index + 1 <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mb-2">{review.review_text}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(review.created_at).toLocaleString()}
                </p>
                {user?.id === review.user_id && (
                  <div className="mt-4 flex space-x-4">
                    <button
                      onClick={handleDelete}
                      className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
    </section>
  );
};

export default RatingReview;
