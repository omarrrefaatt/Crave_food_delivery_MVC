import React, { useState, useEffect } from "react";
import { FoodItemFormData, FoodItemError } from "./foodItemTypes";
import { FiAlertCircle, FiStar, FiDollarSign, FiImage } from "react-icons/fi";

interface FoodItemFormProps {
  initialData?: FoodItemFormData & { id?: number };
  onSubmit: (data: FoodItemFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const defaultFormData: FoodItemFormData = {
  name: "",
  description: "",
  rating: 5,
  restaurantId: 0,
  imageUrl: "",
  price: 0,
};

const EnhancedFoodItemForm: React.FC<FoodItemFormProps> = ({
  initialData = defaultFormData,
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<FoodItemFormData>(initialData);
  const [errors, setErrors] = useState<FoodItemError>({});
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData.imageUrl || null
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Update form data if initialData changes (for edit mode)
    setFormData(initialData);
    setImagePreview(initialData.imageUrl || null);
    setTouched({});
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FoodItemError = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    if (formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = "Rating must be buusonedetween 1 and 5";
      isValid = false;
    }

    if (formData.restaurantId <= 0) {
      newErrors.restaurantId = "Valid restaurant ID is required";
      isValid = false;
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "Image URL is required";
      isValid = false;
    } else {
      try {
        new URL(formData.imageUrl);
      } catch (err) {
        newErrors.imageUrl = "Please enter a valid URL";
        isValid = false;
      }
    }

    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateField = (
    name: keyof FoodItemFormData,
    value: string | number
  ): string | undefined => {
    switch (name) {
      case "name":
        return !String(value).trim() ? "Name is required" : undefined;
      case "description":
        return !String(value).trim() ? "Description is required" : undefined;
      case "rating":
        return Number(value) < 1 || Number(value) > 5
          ? "Rating must be between 1 and 5"
          : undefined;
      case "restaurantId":
        return Number(value) <= 0
          ? "Valid restaurant ID is required"
          : undefined;
      case "imageUrl":
        if (!String(value).trim()) return "Image URL is required";
        try {
          new URL(String(value));
          return undefined;
        } catch (err) {
          return "Please enter a valid URL";
        }
      case "price":
        return Number(value) <= 0 ? "Price must be greater than 0" : undefined;
      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const newValue =
      name === "rating" || name === "price" || name === "restaurantId"
        ? parseFloat(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // If the field has been touched, validate it
    if (touched[name]) {
      const error = validateField(name as keyof FoodItemFormData, newValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    // If it's an image URL field that's valid, update the preview
    if (name === "imageUrl" && value) {
      try {
        new URL(value);
        setImagePreview(value);
      } catch (err) {
        // Invalid URL, don't update preview
      }
    }
  };

  const handleBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name as keyof FoodItemFormData, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {initialData.name ? "Edit Food Item" : "Create New Food Item"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Form fields */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.name
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="Enter item name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                rows={4}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.description
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="Describe the food item"
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating (1-5) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiStar className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                      errors.rating
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                  />
                </div>
                {errors.rating && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.rating}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Price ($) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                      errors.price
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:ring-blue-200"
                    }`}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.price}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="restaurantId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Restaurant ID *
              </label>
              <input
                type="number"
                id="restaurantId"
                name="restaurantId"
                min="1"
                value={formData.restaurantId}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                  errors.restaurantId
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              />
              {errors.restaurantId && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.restaurantId}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image URL *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiImage className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:outline-none ${
                    errors.imageUrl
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                />
              </div>
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-500 flex items-center">
                  <FiAlertCircle className="mr-1" /> {errors.imageUrl}
                </p>
              )}
            </div>
          </div>

          {/* Right column - Image preview */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-4 text-center border-b">
              <h3 className="font-medium text-gray-700">Image Preview</h3>
            </div>
            <div className="h-64 flex items-center justify-center p-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                  onError={() => setImagePreview(null)}
                />
              ) : (
                <div className="text-center text-gray-500">
                  <FiImage className="mx-auto text-4xl mb-2" />
                  <p>Enter a valid image URL to see a preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-200"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {initialData.name ? "Updating..." : "Creating..."}
              </span>
            ) : initialData.name ? (
              "Update Item"
            ) : (
              "Create Item"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EnhancedFoodItemForm;
