import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { usePickups } from '@/contexts/PickupContext';
import { Calendar, Clock, MapPin, Plus, History, LogOut } from 'lucide-react';

interface CustomerDashboardProps {
  onSchedulePickup: () => void;
  onViewHistory: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  onSchedulePickup,
  onViewHistory
}) => {
  const { user, logout } = useAuth();
  const { pickups } = usePickups();

  const userPickups = pickups.filter(pickup => pickup.customerId === user?.id);
  const recentPickups = userPickups.slice(-3).reverse();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-blue-600 bg-blue-100';
      case 'in-process': return 'text-purple-600 bg-purple-100';
      case 'pending-approval': return 'text-orange-600 bg-orange-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Pending Approval';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back!</h1>
          <p className="text-muted-foreground">{user?.phone}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSchedulePickup}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Schedule Pickup</CardTitle>
                <CardDescription>Book a new scrap pickup</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onViewHistory}>
          <CardHeader className="pb-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                <History className="w-5 h-5 text-secondary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">Order History</CardTitle>
                <CardDescription>View all your pickups</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Recent Pickups */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Pickups</CardTitle>
          <CardDescription>Your latest pickup requests</CardDescription>
        </CardHeader>
        <CardContent>
          {recentPickups.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pickups scheduled yet</p>
              <Button className="mt-4" onClick={onSchedulePickup}>
                Schedule Your First Pickup
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPickups.map((pickup) => (
                <div key={pickup.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{pickup.pickupDate}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{pickup.timeSlot}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{pickup.address}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pickup.status)}`}>
                      {getStatusText(pickup.status)}
                    </span>
                  </div>
                  {pickup.pickupCode && (
                    <div className="mt-2 p-2 bg-muted rounded">
                      <p className="text-sm text-muted-foreground">Pickup Code:</p>
                      <p className="font-mono font-bold">{pickup.pickupCode}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};