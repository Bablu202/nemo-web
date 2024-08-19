"use client";

import { useState, useEffect } from "react";
import { useReviews } from "@/context/ReviewsContext";
import { useUserSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { ReviewType } from "@/types/custom";
import Image from "next/image";
import { HiOutlineUser } from "react-icons/hi2";

const RatingReview = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [visibleReviews, setVisibleReviews] = useState<number>(2); // Initially show 2 reviews
  const [showMore, setShowMore] = useState<boolean>(true); // State to track if more reviews are available

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

  useEffect(() => {
    // Check if more reviews are available to show
    if (reviews.length <= visibleReviews) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }
  }, [visibleReviews, reviews]);

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
        const reviewData: Omit<ReviewType, "id"> = {
          rating,
          review_text: review,
          user_id: user.id,
          user_name: user.name || "",
          user_email: user.email || "", // Adjust if user_email is not used
          created_at: new Date().toISOString(),
          picture: user.picture || "", // Adjust this line based on how you handle user picture
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

  const handleShowMore = () => {
    setVisibleReviews((prev) => prev + 10);
  };

  const handleShowLess = () => {
    setVisibleReviews(2); // Reset to show initial reviews
  };

  if (userLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return (
      <section className="px-4 py-8 max-w-6xl m-auto text-center mt-8">
        <h2
          className="text-2xl font-bold mb-4 bg-gradient-to-r
         from-color-purple via-color-yellow to-color-green text-transparent bg-clip-text"
        >
          Rate and Review your experience..
        </h2>
        <p className="mb-4">
          You need to{" "}
          <a
            href="/user"
            className="text-custom-pri dark:text-color-orange p-0.5 underline"
          >
            login
          </a>{" "}
          to submit or manage your review.
        </p>
      </section>
    );
  }

  return (
    <section id="review" className="px-4 py-8 max-w-6xl m-auto mt-8">
      <h2
        className="text-2xl font-bold mb-4 bg-gradient-to-r
         from-color-purple via-color-yellow to-color-green text-transparent bg-clip-text"
      >
        Rate and Review your experience..
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg mx-auto bg-white dark:bg-color-gray shadow-md rounded-lg p-6"
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
          <div className="mb-4 p-2 bg-red-100 text-color-red border border-red-300 rounded-md">
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
            className="w-full px-3 py-2   form-input"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn-dark-light py-2 px-4 ">
          {editingReviewId ? "Update" : "Submit"}
        </button>
        {/* {editingReviewId && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ml-4"
          >
            Delete
          </button>
        )} */}
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <ul>
            {reviews.slice(0, visibleReviews).map((review) => (
              <li key={review.id} className="border-b py-4">
                <div className="flex items-center mb-2">
                  {review.picture ? (
                    <Image
                      alt="Profile Picture"
                      src={review.picture}
                      width={64}
                      height={64}
                      className="flex items-center justify-center border rounded-full p-0.5 
                        h-16 w-16 bg-gray-200"
                    />
                  ) : (
                    <div
                      className="flex items-center justify-center border rounded-full 
                        h-16 w-16 p-2 bg-gray-200"
                    >
                      <HiOutlineUser className="text-3xl text-gray-600" />
                    </div>
                  )}
                  <span className="font-semibold ml-4">{review.user_name}</span>{" "}
                  -{" "}
                  <span className="text-yellow-400">
                    {"★".repeat(review.rating)} {"☆".repeat(5 - review.rating)}
                  </span>
                </div>
                <p>{review.review_text}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {new Date(review.created_at).toLocaleDateString()}
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
        )}
        <div className="mt-4 flex justify-center">
          {visibleReviews < reviews.length && showMore ? (
            <button
              onClick={handleShowMore}
              className="btn-dark-light py-2 px-4 "
            >
              Show More
            </button>
          ) : visibleReviews > 2 ? (
            <button
              onClick={handleShowLess}
              className="btn-dark-light py-2 px-4 "
            >
              Show Less
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default RatingReview;
