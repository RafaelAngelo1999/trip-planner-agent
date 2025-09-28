import { Hotel, ListHotelsParams } from "../../../agent/types";

export const mockHotel: Hotel = {
  hotelId: "HTL001",
  name: "Hotel Excellence Plaza",
  nightly: 250.0,
  total: 750.0,
  rating: 4.5,
  policy: "FREE_CANCELLATION",
  currency: "BRL",
  city: "São Paulo",
  image: "https://example.com/hotel-image.jpg",
};

export const mockHotelsParams: ListHotelsParams = {
  city: "São Paulo",
  checkin: "2024-12-25",
  checkout: "2024-12-28",
  rooms: 1,
  withBreakfast: true,
  refundableOnly: false,
};

export const mockHotelsList: Hotel[] = [
  mockHotel,
  {
    hotelId: "HTL002",
    name: "Luxury Business Inn",
    nightly: 180.0,
    total: 540.0,
    rating: 4.2,
    policy: "NON_REFUNDABLE",
    currency: "BRL",
    city: "São Paulo",
    image: "https://example.com/hotel2-image.jpg",
  },
  {
    hotelId: "HTL003",
    name: "Economic Stay Hotel",
    nightly: 120.0,
    total: 360.0,
    rating: 3.8,
    policy: "FREE_CANCELLATION",
    currency: "BRL",
    city: "São Paulo",
  },
];
