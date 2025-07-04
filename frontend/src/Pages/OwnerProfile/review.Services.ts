import axios from "axios";
import { Review, ReviewApiResponse, ReviewStats } from "./types";

const reviewAPI = import.meta.env.VITE_REVIEWS_API;

export class ReviewService {
  static async getRestaurantReviews(): Promise<Review[]> {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token not found");
    }

    try {
      const response = await axios.get<ReviewApiResponse>(
        `${reviewAPI}/restaurant`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(token)}`,
            "Content-Type": "application/json",
          },
        }
      );
      // Axios response data is already parsed as JSON
      return response.data.$values || [];
    } catch (error) {
      console.error("Error fetching restaurant reviews:", error);
      throw error;
    }
  }

  static calculateReviewStats(reviews: Review[]): ReviewStats {
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      totalReviews: reviews.length,
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    };
  }

  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  static categorizeReview(rating: number): {
    label: string;
    color: string;
  } {
    if (rating >= 4) {
      return { label: "Positive", color: "bg-green-100 text-green-700" };
    } else if (rating >= 3) {
      return { label: "Neutral", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { label: "Negative", color: "bg-red-100 text-red-700" };
    }
  }

  static getInitials(name: string): string {
    if (!name) return "U";

    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}
