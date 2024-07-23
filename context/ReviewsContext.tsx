"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getAllReviews,
  addReview,
  updateReview,
  deleteReview,
} from "@/lib/supabaseActions";
import { ReviewType } from "@/types/custom";
import { useUserSession } from "./SessionContext";

type ReviewsContextType = {
  reviews: ReviewType[];
  loading: boolean;
  addReview: (review: Omit<ReviewType, "id">) => Promise<void>;
  editReview: (
    id: string,
    updatedReview: Partial<Omit<ReviewType, "id">>
  ) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
};

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider = ({ children }: { children: ReactNode }) => {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUserSession();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const fetchedReviews = await getAllReviews();
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleAddReview = async (review: Omit<ReviewType, "id">) => {
    try {
      // Check if the user already has a review
      const existingReview = reviews.find((r) => r.user_id === review.user_id);
      if (existingReview) {
        await updateReview(existingReview.id, review);
        setReviews((prevReviews) =>
          prevReviews.map((r) =>
            r.id === existingReview.id ? { ...r, ...review } : r
          )
        );
      } else {
        await addReview(review);
        setReviews((prevReviews) => [
          { ...review, id: crypto.randomUUID() },
          ...prevReviews,
        ]); // UUID generation
      }
    } catch (error) {
      console.error("Failed to add or update review:", error);
    }
  };

  const handleEditReview = async (
    id: string,
    updatedReview: Partial<Omit<ReviewType, "id">>
  ) => {
    try {
      await updateReview(id, updatedReview);
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === id ? { ...review, ...updatedReview } : review
        )
      );
    } catch (error) {
      console.error("Failed to edit review:", error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        loading,
        addReview: handleAddReview,
        editReview: handleEditReview,
        deleteReview: handleDeleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
};
