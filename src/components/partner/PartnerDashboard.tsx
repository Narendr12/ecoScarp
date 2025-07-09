import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickups } from '@/contexts/PickupContext';
import { Calendar, Clock, MapPin, Phone, User, Package, LogOut, ExternalLink } from 'lucide-react';

interface PartnerDashboardProps {
  onManagePickup: (pickupId: string) => void;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({ onManagePickup }) => {
  const { user, logout } = useAuth();
  const { pickups, acceptPickup } = usePickups();

  // Get pickups that are either pending or assigned to this partner
  const availablePickups = pickups.filter(pickup => 
    pickup.status === 'pending' || pickup.partnerId === user?.id
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-process': return 'bg-purple-100 text-purple-800';
      case 'pending-approval': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const handleAcceptPickup = (pickupId: string) => {
    acceptPickup(pickupId, user!.id, user!.name || 'Partner');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Partner Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name || user?.phone}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Available Pickups</CardDescription>
            <CardTitle className="text-2xl">
              {pickups.filter(p => p.status === 'pending').length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl">
              {pickups.filter(p => p.partnerId === user?.id && ['accepted', 'in-process', 'pending-approval'].includes(p.status)).length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">
              {pickups.filter(p => p.partnerId === user?.id && p.status === 'completed').length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Pickups List */}
      <Card>
        <CardHeader>
          <CardTitle>Pickup Requests</CardTitle>
          <CardDescription>Available and assigned pickup requests</CardDescription>
        </CardHeader>
        <CardContent>
          {availablePickups.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No pickup requests available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availablePickups.map((pickup) => (
                <div key={pickup.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Pickup #{pickup.id.slice(-6)}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span>{pickup.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{pickup.customerPhone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{pickup.pickupDate}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span>{pickup.timeSlot}</span>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2 mt-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm">{pickup.address}</span>
                      </div>
                      {pickup.mapLink && (
                        <div className="mt-2">
                          <a 
                            href={pickup.mapLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary text-sm hover:underline flex items-center space-x-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>View on Google Maps</span>
                          </a>
                        </div>
                      )}
                    </div>
                    <Badge className={getStatusColor(pickup.status)}>
                      {getStatusText(pickup.status)}
                    </Badge>
                  </div>

                  <div className="flex justify-end space-x-2">
                    {pickup.status === 'pending' ? (
                      <Button 
                        onClick={() => handleAcceptPickup(pickup.id)}
                        size="sm"
                      >
                        Accept Pickup
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => onManagePickup(pickup.id)}
                        variant="outline"
                        size="sm"
                      >
                        Manage Pickup
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};