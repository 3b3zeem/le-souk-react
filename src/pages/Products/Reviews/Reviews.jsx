import React, { useState } from "react";
import Slider from "react-slick";
import useReviews from "../../../hooks/Reviews/useReviews";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, MessageSquare, Star } from "lucide-react";
import { useAuthContext } from "../../../context/Auth/AuthContext";
import { useLanguage } from "../../../context/Language/LanguageContext";
import { useTranslation } from "react-i18next";

const colors = {
  primary: "#333e2c",
  lightText: "#ffffff",
  productTitle: "#4b5563",
  productDesc: "#374149 ",
  productName: "#6b7280",
  borderLight: "#e5e7eb",
  lineBg: "#d1d5db",
  delete: "#ef4444",
};

const Reviews = ({ reviews, productId, fetchProductDetails }) => {
  const { submitReview, editReview, deleteReview, loading, deleteLoading } =
    useReviews();
  const { user } = useAuthContext();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [hover, setHover] = useState(0);
  const { t } = useTranslation();
  const { language } = useLanguage();

  const currentUserId = user?.user?.id;

  const canEditReview = (review) => {
    return currentUserId && review?.user?.id === currentUserId;
  };

  const handleSubmit = async () => {
    try {
      if (!productId || isNaN(productId) || productId <= 0) {
        toast.error("Invalid product ID.");
        return;
      }

      if (rating < 1) {
        toast.error("Please select a rating.");
        return;
      }
      if (!feedback || feedback.trim() === "") {
        toast.error("Please write a review.");
        return;
      }

      if (editingReviewId) {
        await editReview(productId, editingReviewId, rating, feedback);
        setEditingReviewId(null);
      } else {
        await submitReview(productId, rating, feedback);
      }
      setRating(0);
      setFeedback("");
      setHover(0);
      fetchProductDetails(productId);
    } catch (error) {
      toast.error(error.message);
      setRating(0);
      setFeedback("");
      setHover(0);
    }
  };

  const handleEditClick = (review) => {
    setEditingReviewId(review.id);
    setRating(review.rating);
    setFeedback(review.feedback);
    setHover(review.rating);
  };

  const handleDeleteClick = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchProductDetails(productId);
    } catch (error) {
      toast.error(error);
    }
  };

  const NextArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -right-2 md:-right-5 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronRight size={20} />
    </button>
  );

  const PrevArrow = ({ onClick }) => (
    <button
      onClick={onClick}
      className="absolute top-1/2 -left-2 md:-left-5 -translate-y-1/2 bg-[#333e2c] hover:opacity-90 transition-all duration-200 text-white rounded p-2 shadow-lg z-10 cursor-pointer"
    >
      <ChevronLeft size={20} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: reviews.length > 1,
    speed: 500,
    slidesToShow: Math.min(reviews.length, 4),
    slidesToScroll: 1,
    nextArrow: reviews.length > 1 ? <NextArrow /> : null,
    prevArrow: reviews.length > 1 ? <PrevArrow /> : null,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="mt-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <h2 className="text-xl font-bold mb-4">{t("customerReviews")}</h2>
      {reviews.length > 0 ? (
        <Slider {...settings}>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 border border-gray-200 mx-2 flex flex-col justify-between min-h-[150px]"
              style={{ backgroundColor: colors.lightText }}
            >
              <div>
                <div className="flex items-center mb-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={20}
                        className={`${
                          star <= review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill={star <= review.rating ? "#facc15" : "none"}
                      />
                    ))}
                  </div>
                  <span
                    className="ml-3 text-base font-semibold"
                    style={{ color: colors.productTitle }}
                  >
                    {review.rating}.0
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed mb-4"
                  style={{ color: colors.productTitle }}
                >
                  "{review.feedback}"
                </p>
              </div>
              <div className="flex justify-between items-center">
                {canEditReview(review) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(review)}
                      className="py-1 px-3 rounded font-semibold cursor-pointer customEffect"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                    >
                      <span>{t("edit")}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(review.id)}
                      className={`py-1 px-3 rounded font-semibold cursor-pointer ${
                        deleteLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "customEffect"
                      }`}
                      style={{
                        backgroundColor: colors.delete,
                        color: colors.lightText,
                      }}
                      disabled={deleteLoading}
                    >
                      <span>{deleteLoading ? t("deleting") : t("delete")}</span>
                    </button>
                  </div>
                )}
                <p className="text-xs" style={{ color: colors.productName }}>
                  {t("byUser")} {review.user.name} {t("OnDate")}{" "}
                  {review.created_at}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      ) : (
        <div
          className="flex flex-col items-center justify-center p-6 border border-gray-200"
          style={{ backgroundColor: colors.lightText }}
        >
          <MessageSquare
            size={48}
            className="mb-4"
            style={{ color: colors.productName }}
          />
          <p
            className="text-lg text-gray-600 font-semibold"
            style={{ color: colors.productTitle }}
          >
            {t("noReviewsAvailable")}
          </p>
        </div>
      )}

      <h3 className="text-lg font-semibold mt-6 mb-4">
        {editingReviewId ? t("editYourReview") : t("addAReview")}
      </h3>
      <form
        className="space-y-6 p-6 border border-gray-200"
        style={{ backgroundColor: colors.lightText }}
      >
        <div>
          <label
            className="block font-semibold mb-2 text-lg"
            style={{ color: colors.productDesc }}
          >
            {t("rating")}:
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                size={20}
                className={`cursor-pointer transition-colors duration-200 ${
                  (hover || rating) >= star
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill={(hover || rating) >= star ? "#facc15" : "none"}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            className="block font-semibold mb-2 text-lg"
            style={{ color: colors.productDesc }}
          >
            {t("yourReview")}:
          </label>
          <textarea
            placeholder={t("writeYourReview")}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="mt-1 p-3 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition-all duration-200"
            rows="4"
            required
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className={`py-2 px-6 rounded font-semibold cursor-pointer ${
            loading ? "opacity-50 cursor-not-allowed" : "customEffect"
          }`}
          style={{ backgroundColor: colors.primary, color: colors.lightText }}
        >
          <span>
            {loading
              ? t("submitting")
              : editingReviewId
              ? t("saveChanges")
              : t("submitReview")}
          </span>
        </button>
        {editingReviewId && (
          <button
            type="button"
            onClick={() => {
              setEditingReviewId(null);
              setRating(1);
              setFeedback("");
              setHover(0);
            }}
            className="ml-3 py-2 px-6 rounded border border-gray-300 hover:bg-gray-200 transition-all duration-200 font-semibold cursor-pointer"
            style={{ color: colors.productTitle }}
          >
            {loading ? t("cancel") + "..." : t("cancel")}
          </button>
        )}
      </form>
    </div>
  );
};

export default Reviews;
