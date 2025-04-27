import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../context/Auth/AuthContext";
import toast from "react-hot-toast";

const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { token } = useAuthContext();

  const submitReview = async (productId, rating, feedback) => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        toast.error("Please log in to add review to this product.");
        setLoading(false);
        return;
      }

      if (!productId || isNaN(productId) || productId <= 0) {
        throw new Error("Invalid product ID.");
      }

      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
      }
      if (!feedback || feedback.trim() === "") {
        throw new Error("Feedback cannot be empty.");
      }

      const response = await axios.post(
        "https://ecommerce.ershaad.net/api/reviews",
        { product_id: Number(productId), rating, feedback },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review submitted successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to submit review";
      console.error("Submit Review Error:", err.response?.data || err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const editReview = async (productId, reviewId, rating, feedback) => {
    setLoading(true);
    setError(null);

    try {
      if (!token) {
        toast.error("Please log in to add review to this product.");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        `https://ecommerce.ershaad.net/api/reviews/${reviewId}`,
        { _method: "PUT", product_id: productId, rating, feedback },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review updated successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update review";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      if (!token) {
        toast.error("Please log in to add review to this product.");
        setDeleteLoading(false);
        return;
      }

      const response = await axios.delete(
        `https://ecommerce.ershaad.net/api/reviews/${reviewId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Review deleted successfully!");
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to delete review";
      setDeleteError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setDeleteLoading(false);
    }
  };

  return {
    submitReview,
    editReview,
    deleteReview,
    loading,
    error,
    deleteLoading,
    deleteError,
  };
};

export default useReviews;
