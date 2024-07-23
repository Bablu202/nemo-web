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
    </section>
  );
};

export default ReviewsPage;
