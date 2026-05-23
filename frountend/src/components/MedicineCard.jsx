import React, { useState, useEffect, useCallback } from "react";

function MedicineCard({ medicine }) {
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [showReviews, setShowReviews] = useState(false);

  // ✅ Fetch Reviews (Fixed with useCallback)
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/reviews/${medicine.name}`
      );

      const data = await res.json();
      setReviews(data);

      if (data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        const avg = total / data.length;
        setAvgRating(avg.toFixed(1));
      } else {
        setAvgRating(0);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, [medicine.name]);

  // ✅ useEffect with dependency
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Add Review
  const addReview = async () => {
    if (review === "" || rating === 0) {
      alert("Please add rating and review");
      return;
    }

    try {
      await fetch("http://localhost:5000/add-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          medicine_name: medicine.name,
          review_text: review,
          rating: rating,
        }),
      });

      setReview("");
      setRating(0);
      fetchReviews();
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  return (
    <>
      {/* CARD */}
      <div
        className="card shadow border-0 h-100"
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.transform = "translateY(-5px)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.transform = "translateY(0)")
        }
      >
        {/* Image */}
        <img
          src={medicine.image_url}
          className="card-img-top"
          alt={medicine.name}
          style={{ height: "180px", objectFit: "cover" }}
        />

        {/* Body */}
        <div className="card-body px-3 py-3 text-center">
          <h5 className="fw-bold">{medicine.name}</h5>

          <p className="text-warning mb-1 fw-semibold">
            ⭐ {avgRating} / 5
          </p>

          <small className="text-muted d-block mb-2">
            ({reviews.length} Reviews)
          </small>

          <hr />

          <p className="mb-1">
            <strong>Company:</strong> {medicine.company}
          </p>

          <p className="mb-2">
            <strong>Price:</strong>{" "}
            <span className="text-success fw-bold">
              ₹{medicine.average_price_inr}
            </span>
          </p>

          {/* Star Rating */}
          <div className="mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: "pointer",
                  color: star <= rating ? "#ffc107" : "#ddd",
                  fontSize: "22px",
                }}
              >
                ★
              </span>
            ))}
          </div>

          {/* Input */}
          <input
            type="text"
            className="form-control mb-2 rounded-pill"
            placeholder="Write review..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
          />

          {/* Buttons */}
          <button
            className="btn btn-primary w-100 mb-2 rounded-pill"
            onClick={addReview}
          >
            Submit Review
          </button>

          <button
            className="btn btn-outline-dark w-100 rounded-pill"
            onClick={() => {
              setShowReviews(true);
              fetchReviews();
            }}
          >
            View Reviews
          </button>
        </div>
      </div>

      {/* MODAL */}
      {showReviews && (
        <div
          className="modal d-flex justify-content-center align-items-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content rounded-4 shadow">
              <div className="modal-header border-0">
                <h5 className="fw-bold">
                  Reviews - {medicine.name}
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setShowReviews(false)}
                ></button>
              </div>

              <div className="modal-body">
                {reviews.length === 0 ? (
                  <p className="text-muted">No Reviews Yet</p>
                ) : (
                  reviews.map((r, i) => (
                    <div
                      key={i}
                      className="mb-2 p-2 rounded"
                      style={{ background: "#f8f9fa" }}
                    >
                      ⭐ {r.rating} - {r.review_text}
                    </div>
                  ))
                )}
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowReviews(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MedicineCard;