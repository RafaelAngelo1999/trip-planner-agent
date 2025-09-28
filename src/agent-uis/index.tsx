import AccommodationsList from "./trip-planner/accommodations-list";
import RestaurantsList from "./trip-planner/restaurants-list";
import FlightsList from "./flights/flights-list";
import FlightBookingConfirmation from "./flights/flight-booking-confirmation";
import FlightCancellationConfirmation from "./flights/flight-cancellation-confirmation";
import FlightCancellationSuccess from "./flights/flight-cancellation-success";
import HotelsList from "./hotels/hotels-list";

const ComponentMap = {
  "accommodations-list": AccommodationsList,
  "restaurants-list": RestaurantsList,
  "flights-list": FlightsList,
  "flight-booking-confirmation": FlightBookingConfirmation,
  "flight-cancellation-confirmation": FlightCancellationConfirmation,
  "flight-cancellation-success": FlightCancellationSuccess,
  "hotels-list": HotelsList,
} as const;

export default ComponentMap;
