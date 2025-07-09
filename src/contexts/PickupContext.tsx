import React, { createContext, useContext, useState, useEffect } from 'react';
import { PickupRequest, PickupItem } from '@/types/pickup';

interface PickupContextType {
  pickups: PickupRequest[];
  createPickup: (pickup: Omit<PickupRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updatePickupStatus: (id: string, status: PickupRequest['status']) => void;
  acceptPickup: (id: string, partnerId: string, partnerName: string) => void;
  startPickup: (id: string, pickupCode: string) => boolean;
  addPickupItems: (id: string, items: PickupItem[], totalAmount: number) => void;
  approvePickup: (id: string) => void;
  generatePickupCode: () => string;
}

const PickupContext = createContext<PickupContextType | undefined>(undefined);

export const usePickups = () => {
  const context = useContext(PickupContext);
  if (!context) {
    throw new Error('usePickups must be used within a PickupProvider');
  }
  return context;
};

export const PickupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pickups, setPickups] = useState<PickupRequest[]>([]);

  useEffect(() => {
    // Load pickups from localStorage on app start
    const storedPickups = localStorage.getItem('pickups');
    if (storedPickups) {
      setPickups(JSON.parse(storedPickups));
    }
  }, []);

  const savePickups = (updatedPickups: PickupRequest[]) => {
    setPickups(updatedPickups);
    localStorage.setItem('pickups', JSON.stringify(updatedPickups));
  };

  const generatePickupCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const createPickup = (pickupData: Omit<PickupRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newPickup: PickupRequest = {
      ...pickupData,
      id: `pickup_${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedPickups = [...pickups, newPickup];
    savePickups(updatedPickups);
  };

  const updatePickupStatus = (id: string, status: PickupRequest['status']) => {
    const updatedPickups = pickups.map(pickup =>
      pickup.id === id
        ? { ...pickup, status, updatedAt: new Date().toISOString() }
        : pickup
    );
    savePickups(updatedPickups);
  };

  const acceptPickup = (id: string, partnerId: string, partnerName: string) => {
    const pickupCode = generatePickupCode();
    const updatedPickups = pickups.map(pickup =>
      pickup.id === id
        ? {
            ...pickup,
            status: 'accepted' as const,
            partnerId,
            partnerName,
            pickupCode,
            updatedAt: new Date().toISOString()
          }
        : pickup
    );
    savePickups(updatedPickups);
  };

  const startPickup = (id: string, enteredCode: string): boolean => {
    const pickup = pickups.find(p => p.id === id);
    if (pickup && pickup.pickupCode === enteredCode) {
      updatePickupStatus(id, 'in-process');
      return true;
    }
    return false;
  };

  const addPickupItems = (id: string, items: PickupItem[], totalAmount: number) => {
    const updatedPickups = pickups.map(pickup =>
      pickup.id === id
        ? {
            ...pickup,
            items,
            totalAmount,
            status: 'pending-approval' as const,
            updatedAt: new Date().toISOString()
          }
        : pickup
    );
    savePickups(updatedPickups);
  };

  const approvePickup = (id: string) => {
    updatePickupStatus(id, 'completed');
  };

  return (
    <PickupContext.Provider value={{
      pickups,
      createPickup,
      updatePickupStatus,
      acceptPickup,
      startPickup,
      addPickupItems,
      approvePickup,
      generatePickupCode,
    }}>
      {children}
    </PickupContext.Provider>
  );
};