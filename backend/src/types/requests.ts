// types for request bodies

export type ProductRequestBody = {
  name: string;
  capacity: number;
  price: number;
  currency: string;
};

export type AvailabilityRequestBody = {
  productId: string;
  localDate?: string;
  localDateStart?: string;
  localDateEnd?: string;
};

export type BookingRequestBody = {
  productId: string;
  availabilityId: string;
  units: {
    id: string;
    ticket?: string | null;
  }[];
};

export type BookingUnit = {
  id: string;
  ticket: string | null;
};
