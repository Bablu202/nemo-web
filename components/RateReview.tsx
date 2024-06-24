"use client";
import { useEffect, useState } from "react";
// import { getRegisteredDetails } from "@/services/apiRegistration";

const RatingReview = () => {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>("");

  //   useEffect(() => {
  //     getRegisteredDetails().then((data) => console.log(data));
  //   }, []);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleReviewChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you can implement logic to submit the rating and review data
    console.log("Rating:", rating);
    console.log("Review:", review);
    // Reset state after submitting
    setRating(0);
    setReview("");
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
                index + 1 <= rating ? "text-color-yellow" : "text-gray-300"
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
          className="bg-custom-pri text-white py-2 px-4 rounded-md hover:bg-custom-pri"
        >
          Submit
        </button>
      </form>
    </section>
  );
};

export default RatingReview;
