export type UserType = 'GUEST' | 'FRONT_DESK' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber?: string;
  userType: UserType;
  isActive: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export type RoomType = 'SINGLE' | 'DOUBLE' | 'SUITE';
export type PriceType = 'PER_NIGHT' | 'PER_DAY';
export type RoomStatus = 'AVAILABLE' | 'BOOKED' | 'OCCUPIED';

export interface RoomFeature {
  id: number;
  roomFeature: string;
  description?: string;
  imageUrl?: string;
}

export interface Room {
  id: number;
  roomNumber: string;
  roomType: RoomType;
  price: number;
  priceType: PriceType;
  status: RoomStatus;
  description?: string;
  createdAt: string;
  features: RoomFeature[];
  imageUrls: string[];
}

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CHECKED_OUT' | 'CANCELLED' | 'NO_SHOW';

export interface Booking {
  id: number;
  bookingCode: string;
  guest: User;
  room: Room;
  checkInDate: string;
  checkOutDate: string;
  numberOfUnits: number;
  numberOfNights: number;
  totalPrice: number;
  status: BookingStatus;
}

export interface BookingRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  numberOfUnits: number;
}

export interface MessageResponse {
  message: string;
}
