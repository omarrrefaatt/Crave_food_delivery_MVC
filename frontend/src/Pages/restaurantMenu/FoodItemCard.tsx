// FoodItemCard.tsx
import React, { useState } from "react";
import { FoodItem } from "./types";

interface FoodItemWithQuantity extends FoodItem {
  quantity: number;
  notes?: string;
}

interface FoodItemCardProps {
  foodItem: FoodItem;
  onAddToCart: (item: FoodItemWithQuantity) => void;
}

const FoodItemCard: React.FC<FoodItemCardProps> = ({
  foodItem,
  onAddToCart,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");

  const handleAddClick = (): void => {
    setIsExpanded(!isExpanded);
  };

  const handleAddToCart = (): void => {
    onAddToCart({
      ...foodItem,
      quantity,
      notes: notes.trim() || undefined,
    });
    setIsExpanded(false);
    setQuantity(1);
    setNotes("");
  };

  return (
    <div className="border rounded-lg shadow-md overflow-hidden mb-4 flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold">{foodItem.name}</h3>
            <p className="text-gray-600 mt-1">{foodItem.description}</p>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < foodItem.rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="ml-1 text-sm text-gray-500">
                {foodItem.rating}/5
              </span>
            </div>
            <div className="mt-2 font-medium text-green-600">
              ${foodItem.price}
            </div>
          </div>

          <div className="ml-4">
            <img
              src={
                foodItem.imageUrl &&
                foodItem.imageUrl !== "" &&
                foodItem.imageUrl.length > 5
                  ? foodItem.imageUrl
                  : "https://theme-assets.getbento.com/sensei/72358a3.sensei/assets/images/catering-item-placeholder-704x520.png"
              }
              alt={foodItem.name}
              className="w-24 h-24 object-cover rounded"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/api/placeholder/80/80";
              }}
            />
          </div>
        </div>
      </div>

      <div className="p-4 mt-auto">
        <button
          onClick={handleAddClick}
          className="bg-crimson hover:bg-gray-800 text-white py-2 px-4 rounded-md w-full transition-colors"
        >
          {isExpanded ? "Cancel" : "Add"}
        </button>
      </div>

      {isExpanded && (
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex items-center mb-3">
            <label className="block text-gray-700 mr-3">Quantity:</label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 px-3 py-1 rounded-l"
                type="button"
              >
                -
              </button>
              <span className="bg-white px-4 py-1 border-y">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 px-3 py-1 rounded-r"
                type="button"
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-gray-700 mb-1">
              Special instructions:
            </label>
            <textarea
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
              className="w-full border rounded p-2 resize-none"
              rows={2}
              placeholder="Any special requests or notes..."
            />
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-crimson hover:bg-gray-800 text-white py-2 px-4 rounded-md w-full transition-colors"
            type="button"
          >
            Add to Order
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodItemCard;
