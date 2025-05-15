import sliderImage1 from "../../../../Assets/slider1.jpg";
import sliderImage2 from "../../../../Assets/slider2.jpg";
import sliderImage3 from "../../../../Assets/slider3.jpg";

export const cards = [
  {
    image: sliderImage1,
    text: "The <span class='text-crimson'>Easiest</span> Way To Order From Your <span class='text-crimson'>Favorite Restaurants</span>",
    subText:
      "Explore a wide range of cuisines and get your favorite meals delivered to your doorstep with just a few clicks.",
    buttonText: "Order Now",
    id: 1,
    cardRedirectPath: "/restaurants",
  },
  {
    image: sliderImage2,
    text: "Satisfy Your <span class='text-crimson'>Cravings</span> With The Best <span class='text-crimson'>Local Eats</span>",
    subText:
      "From fast food to fine dining, discover top-rated restaurants and exclusive deals near you.",
    buttonText: "Explore More",
    id: 2,
    cardRedirectPath: "#topRestaurants",
  },
  {
    image: sliderImage3,
    text: "We <span class='text-crimson'>Deliver</span> Food That You’ll <span class='text-crimson'>Love!</span>",
    subText:
      "Browse delicious cuisines like Italian, Indian, Chinese, and more – all available for delivery in your area.",
    buttonText: "View Cuisines",
    id: 3,
    cardRedirectPath: "#cuisines",
  },
];
