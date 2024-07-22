"use client";

import RatingReview from "@/components/RatingReview";
import { useReviews } from "@/context/ReviewsContext";
import { useUserSession } from "@/context/SessionContext";

const ReviewsPage = () => {
  const { reviews, deleteReview } = useReviews();
  const { user, loading: userLoading } = useUserSession();

  if (userLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <section className="flex flex-col items-center mt-12 text-center">
        <RatingReview />
        <p>You must be logged in to view or manage reviews.</p>
        <a
          href="/user"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 mt-4"
        >
          Login
        </a>
      </section>
    );
  }

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteReview(reviewId);
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <section className="flex flex-col items-center mt-12">
      <RatingReview />
      <div className="max-w-md w-full mt-8 bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4">
          <h1 className="font-bold text-xl mb-4">All Reviews</h1>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="mb-4">
                <div className="font-bold">
                  {review.rating} Star{review.rating > 1 && "s"}
                </div>
                <p>{review.review_text}</p>
                <p className="text-gray-600 text-sm">
                  {new Date(review.created_at).toLocaleString()}
                </p>
                {review.user_id === user.id && (
                  <div className="mt-2">
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReviewsPage;
