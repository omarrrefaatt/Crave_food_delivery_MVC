import { useEffect, useState } from "react";
import Navbar from "../../Common/Components/Navbar/navbar";
import Footer from "../../Common/Components/Footer/footer";
import ReusableCard from "../../Common/Components/Reusable-Card/reusableCard";
import { Restaurant } from "./constants";
import Button from "../../Common/Components/Button/button";
import ReactPaginate from "react-paginate";
import Loading from "../../Common/Components/Loading/loading";
import { getRestaurantsCardsInfo } from "./services";

import { useNavigate } from "react-router-dom";

const RestaurantPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>(
    []
  );
  const navigate = useNavigate();
  const [isRestaurantCardsLoading, setIsRestaurantCardsLoading] =
    useState(true);
  const itemsPerPage = 6;

  const paginatedRestaurants =
    filteredRestaurants.length > 0
      ? filteredRestaurants.slice(
          currentPage * itemsPerPage,
          (currentPage + 1) * itemsPerPage
        )
      : [];

  useEffect(() => {
    setIsRestaurantCardsLoading(true);
    getRestaurantsCardsInfo().then((restaurants) => {
      if (restaurants) {
        setRestaurants(restaurants);
        setFilteredRestaurants(restaurants);
      }
      setIsRestaurantCardsLoading(false);
    });
  }, []);

  useEffect(() => {
    let updatedRestaurants = [...restaurants];

    if (selectedFilter === "rating") {
      updatedRestaurants.sort((a, b) => b.rating - a.rating);
    } else if (selectedFilter === "deliveryTime") {
      updatedRestaurants.sort((a, b) => a.avgDeliveryTime - b.avgDeliveryTime);
    } else if (selectedFilter === "category") {
      // When category filter is selected, we just keep the current list
      // and let the search term handle filtering by category
    }

    if (searchTerm) {
      updatedRestaurants = updatedRestaurants.filter((restaurant) => {
        const nameMatch = restaurant.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const categoryMatch =
          selectedFilter === "category"
            ? restaurant.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            : false;
        return nameMatch || categoryMatch;
      });
    }

    setFilteredRestaurants(updatedRestaurants);
    setCurrentPage(0); // Reset to the first page
  }, [selectedFilter, searchTerm, restaurants]);

  const handleViewMenu = (restaurantId: string) => {
    // Navigate to restaurant menu page
    navigate("/restaurant", { state: { id: restaurantId } });
  };

  return (
    <div>
      <Navbar />

      <div className="flex flex-col justify-start items-center relative max-w-full min-h-screen font-serif">
        <hr className="bg-gray-100 -translate-y-[14px] w-full mb-10" />
        <div className="flex flex-row justify-between items-start w-full px-8">
          {/* Left sidebar with filters - this stays fixed */}
          <div className="w-96 sticky top-0">
          <ReusableCard backgroundColor="white">
              <div className="flex flex-col justify-start items-center shadow-lg p-4 w-full">
              <div className="flex flex-row justify-between py-2 font-serif items-center text-gray-400 w-full space-x-2">
                <input
                  type="text"
                  id="searchBar"
                  placeholder={
                    selectedFilter === "category"
                      ? "Search by category"
                      : "Restaurant Name"
                  }
                  className="w-full rounded-md border-2 p-2"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(0);
                  }}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <p className="text-xl text-crimson my-4 font-bold">Filters</p>
              <hr className="bg-gray-500 mb-4 w-full" />

              <div className="flex flex-col justify-start items-start w-full">
                <div className="flex flex-row justify-between p-2 font-serif items-center w-full rounded-md border-2 mb-4">
                  <p
                    className={`${
                      selectedFilter === "rating" ? "text-crimson" : ""
                    } text-md font-serif`}
                  >
                    Rating (Highest First)
                  </p>
                  <input
                    type="radio"
                    name="filterOption"
                    value="rating"
                    onChange={() => setSelectedFilter("rating")}
                    checked={selectedFilter === "rating"}
                  />
                </div>
                <hr className="bg-gray-500 mb-4 w-full" />
                <div className="flex flex-row justify-between p-2 font-serif items-center w-full rounded-md border-2 mb-4">
                  <p
                    className={`${
                      selectedFilter === "deliveryTime" ? "text-crimson" : ""
                    } text-md font-serif`}
                  >
                    Delivery Time (Fastest First)
                  </p>
                  <input
                    type="radio"
                    name="filterOption"
                    value="deliveryTime"
                    onChange={() => setSelectedFilter("deliveryTime")}
                    checked={selectedFilter === "deliveryTime"}
                  />
                </div>
                <hr className="bg-gray-500 mb-4 w-full" />
                <div className="flex flex-row justify-between p-2 font-serif items-center w-full rounded-md border-2 mb-4">
                  <p
                    className={`${
                      selectedFilter === "category" ? "text-crimson" : ""
                    } text-md font-serif`}
                  >
                    Search by Category
                  </p>
                  <input
                    type="radio"
                    name="filterOption"
                    value="category"
                    onChange={() => setSelectedFilter("category")}
                    checked={selectedFilter === "category"}
                  />
                </div>
                <hr className="bg-gray-500 mb-4 w-full" />
                <div className="flex flex-row justify-center items-center w-full">
                  <Button
                    text="Reset Filters"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("");
                      setFilteredRestaurants(restaurants);
                    }}
                    width="w-3/5"
                  />
                </div>
              </div>
            </div>
          </ReusableCard>
          </div>

          {/* Right content area - this is where restaurants or "no results" will show */}
          <div className="w-[calc(100%-26rem)] bg-white rounded-lg shadow-lg min-h-[600px]">
          {/* Restaurants Container */}
            <div className="p-6">
              {isRestaurantCardsLoading && (
                <div className="flex justify-center items-center min-h-[500px]">
                  <Loading />
                </div>
              )}
              
              {!isRestaurantCardsLoading && paginatedRestaurants.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 text-gray-400 mb-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                    />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No restaurants found</h3>
                  <p className="text-gray-600 text-center">
                    We couldn't find any restaurants matching your search criteria.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("");
                      setFilteredRestaurants(restaurants);
                    }}
                    className="mt-4 px-4 py-2 bg-crimson text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
              
              {paginatedRestaurants.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedRestaurants.map((restaurant, index) => (
                <div
                  key={index}
                      className="max-w-[450px] min-w-[300px] max-h-[300px] min-h-[250px]"
                >
                  <ReusableCard backgroundColor="white">
                    <div className="p-4 w-full">
                      {/* Top Section: Restaurant Image, Name, and Rating */}
                      <div className="flex items-center gap-4 mb-4">
                        {/* Restaurant Image */}
                        <img
                          src={
                            restaurant.imageUrl &&
                            restaurant.imageUrl !== "" &&
                            restaurant.imageUrl.length > 10
                              ? restaurant.imageUrl
                              : "https://cwdaust.com.au/wpress/wp-content/uploads/2015/04/placeholder-restaurant.png"
                          }
                          alt="restaurant-image"
                          className="size-20 rounded-md object-cover"
                        />

                        <div>
                          {/* Name and Category */}
                          <div className="flex flex-row justify-between items-center space-x-10 mb-1">
                            <h2 className="text-lg font-semibold text-gray-800">
                              {restaurant.name}
                            </h2>
                            <p className="bg-crimson text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md font-sans">
                              {restaurant.category}
                            </p>
                          </div>

                          {/* Delivery Time */}
                          <p className="text-crimson text-sm font-medium mb-2">
                            <span className="font-sans">
                              {restaurant.avgDeliveryTime}
                            </span>{" "}
                            min delivery time
                          </p>

                          {/* Rating */}
                          <div className="flex items-center space-x-2 text-yellow-500">
                            <p className="text-sm font-sans">
                              {restaurant.rating <= 1
                                ? "⭐"
                                : restaurant.rating <= 2
                                ? "⭐⭐"
                                : restaurant.rating <= 3
                                ? "⭐⭐⭐"
                                : restaurant.rating <= 4
                                ? "⭐⭐⭐⭐"
                                : "⭐⭐⭐⭐⭐"}{" "}
                              {restaurant.rating.toFixed(1)} (
                              {restaurant.reviews || 0} Reviews)
                            </p>
                            {restaurant.rating >= 4.5 && (
                              <span className="text-xs font-semibold">
                                🏆 Top Rated
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {restaurant.description}
                        </p>
                      </div>

                      {/* Operating Hours */}
                      <div className="text-sm text-gray-700 mb-4 font-sans">
                        <p>🕒 Hours: {restaurant.operatingHours}</p>
                        <p>📍 {restaurant.location}</p>
                      </div>

                      <div className="flex flex-row justify-center w-full">
                        <Button
                          text="View Menu"
                          width="w-3/5"
                          onClick={() => handleViewMenu(restaurant.id)}
                        />
                      </div>
                    </div>
                  </ReusableCard>
                </div>
              ))}
          </div>
              )}
        </div>
            
        {/* Pagination Controls */}
            {filteredRestaurants.length > 0 && (
              <div className="py-4">
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          }
          nextLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          }
          pageCount={Math.ceil(filteredRestaurants.length / itemsPerPage)}
          onPageChange={(selectedPage: { selected: number }) => {
            setCurrentPage(selectedPage.selected);
          }}
                  containerClassName="flex justify-center flex-row space-x-2 my-4"
          pageClassName="cursor-pointer px-4 py-2 bg-gray-100 rounded-full"
          activeClassName="bg-gray-900 text-white"
          previousClassName="cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white"
          nextClassName="cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-black hover:text-white"
        />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default RestaurantPage;
