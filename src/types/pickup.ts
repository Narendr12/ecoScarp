export interface PickupRequest {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  mapLink?: string;
  pickupDate: string;
  timeSlot: string;
  status: PickupStatus;
  pickupCode?: string;
  partnerId?: string;
  partnerName?: string;
  items?: PickupItem[];
  totalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PickupItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type PickupStatus = 
  | 'pending' 
  | 'accepted' 
  | 'in-process' 
  | 'pending-approval' 
  | 'completed';

export interface User {
  id: string;
  phone: string;
  name?: string;
  type: 'customer' | 'partner';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}