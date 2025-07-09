import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PickupProvider } from "@/contexts/PickupContext";
import { AppSelector } from "@/components/AppSelector";
import { LoginForm } from "@/components/auth/LoginForm";
import { CustomerDashboard } from "@/components/customer/CustomerDashboard";
import { SchedulePickup } from "@/components/customer/SchedulePickup";
import { OrderHistory } from "@/components/customer/OrderHistory";
import { PartnerDashboard } from "@/components/partner/PartnerDashboard";
import { ManagePickup } from "@/components/partner/ManagePickup";

const queryClient = new QueryClient();

type AppState = 
  | 'app-selection'
  | 'customer-login'
  | 'partner-login'
  | 'customer-dashboard'
  | 'customer-schedule'
  | 'customer-history'
  | 'partner-dashboard'
  | 'partner-manage';

const AppContent = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [appState, setAppState] = useState<AppState>('app-selection');
  const [selectedPickupId, setSelectedPickupId] = useState<string>('');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated, determine the appropriate dashboard
  if (isAuthenticated && user) {
    if (user.type === 'customer') {
      switch (appState) {
        case 'customer-schedule':
          return <SchedulePickup onBack={() => setAppState('customer-dashboard')} />;
        case 'customer-history':
          return <OrderHistory onBack={() => setAppState('customer-dashboard')} />;
        default:
          return (
            <CustomerDashboard
              onSchedulePickup={() => setAppState('customer-schedule')}
              onViewHistory={() => setAppState('customer-history')}
            />
          );
      }
    } else {
      switch (appState) {
        case 'partner-manage':
          return (
            <ManagePickup
              pickupId={selectedPickupId}
              onBack={() => setAppState('partner-dashboard')}
            />
          );
        default:
          return (
            <PartnerDashboard
              onManagePickup={(pickupId) => {
                setSelectedPickupId(pickupId);
                setAppState('partner-manage');
              }}
            />
          );
      }
    }
  }

  // Authentication flow
  switch (appState) {
    case 'customer-login':
      return (
        <LoginForm
          userType="customer"
          onBack={() => setAppState('app-selection')}
        />
      );
    case 'partner-login':
      return (
        <LoginForm
          userType="partner"
          onBack={() => setAppState('app-selection')}
        />
      );
    default:
      return (
        <AppSelector
          onSelectApp={(type) => {
            if (type === 'customer') {
              setAppState('customer-login');
            } else {
              setAppState('partner-login');
            }
          }}
        />
      );
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <PickupProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </PickupProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
