// mockData.ts
import { ApiResponse } from "./types";

export const mockFoodItems: ApiResponse = {
  $id: "1",
  $values: [
    {
      id: 1,
      name: "Margherita Pizza",
      description:
        "Classic pizza with tomato sauce, mozzarella cheese, and fresh basil",
      price: 12.99,
      rating: 4.5,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
    {
      id: 2,
      name: "Spaghetti Bolognese",
      description:
        "Traditional Italian pasta with rich meat sauce and parmesan cheese",
      price: 10.99,
      rating: 4.8,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
    {
      id: 3,
      name: "Caprese Salad",
      description:
        "Fresh tomatoes, mozzarella cheese, and basil drizzled with balsamic glaze",
      price: 8.99,
      rating: 4.3,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
    {
      id: 4,
      name: "Tiramisu",
      description:
        "Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream",
      price: 6.99,
      rating: 4.7,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
    {
      id: 5,
      name: "Bruschetta",
      description:
        "Grilled bread rubbed with garlic and topped with diced tomatoes, fresh basil, and olive oil",
      price: 7.99,
      rating: 4.2,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
    {
      id: 6,
      name: "Risotto ai Funghi",
      description:
        "Creamy arborio rice with sautéed mushrooms, white wine, and parmesan cheese",
      price: 14.99,
      rating: 4.6,
      imageUrl:
        "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png",
      restaurantId: 1,
      restaurantName: "Italian Delights",
    },
  ],
};
