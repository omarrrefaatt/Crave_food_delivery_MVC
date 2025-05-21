import { Order, ReviewData } from "./types";

const profileAPI = import.meta.env.VITE_PROFILE_API;
const orderAPI = import.meta.env.VITE_USER_ORDERS_API;
const reviewAPI = import.meta.env.VITE_reviews_API;

export const get_current_customer = async (token: string) => {
  console.log(token);
  try {
    const response = await fetch(`${profileAPI}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Customer fail");
    }

    const data = await response.json();
    return data;
  } catch (e) {
    throw e;
  }
};

export const get_customer_orders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${orderAPI}/user`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();

  return data.$values;
};

export const submit_restaurant_review = async (
  token: string,
  ReviewData: ReviewData
): Promise<any> => {
  const response = await fetch(`${reviewAPI}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },

    body: JSON.stringify(ReviewData),
  });
  console.log("ReviewData:", ReviewData);
  console.log("Response from submit_restaurant_review:", response);
  if (!response.ok) {
    throw new Error("Failed to submit review");
  }
};
export const cancel_order = async (
  token: string,
  orderId: number
): Promise<any> => {
  const response = await fetch(`${orderAPI}/status/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ orderStatus: "cancelled" }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Failed to cancel order: " + errorText);
  }
};
