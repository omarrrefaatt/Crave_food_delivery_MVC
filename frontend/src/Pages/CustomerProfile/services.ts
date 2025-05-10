import { Order } from "./types";

const profileAPI = import.meta.env.VITE_PROFILE_API;
const orderAPI = import.meta.env.VITE_USER_ORDERS_API;

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
    console.log(data);
    return data;
  } catch (e) {
    throw e;
  }
};

export const get_customer_orders = async (token: string): Promise<Order[]> => {
  const response = await fetch(`${orderAPI}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch orders");
  const data = await response.json();

  return data.$values;
};
