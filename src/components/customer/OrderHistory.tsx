import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickups } from '@/contexts/PickupContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, MapPin, User, DollarSign, Package, Check, X } from 'lucide-react';
import { PickupRequest } from '@/types/pickup';

interface OrderHistoryProps {
  onBack: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack }) => {
  const { user } = useAuth();
  const { pickups, approvePickup } = usePickups();
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState<string | null>(null);

  const userPickups = pickups
    .filter(pickup => pickup.customerId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

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

  const handleApprove = async (pickupId: string) => {
    setIsApproving(pickupId);
    try {
      approvePickup(pickupId);
      toast({
        title: "Pickup Approved!",
        description: "The pickup has been completed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve pickup. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApproving(null);
    }
  };

  const renderPickupDetails = (pickup: PickupRequest) => (
    <Card key={pickup.id} className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">Pickup #{pickup.id.slice(-6)}</CardTitle>
            <CardDescription>
              Scheduled for {pickup.pickupDate} at {pickup.timeSlot}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(pickup.status)}>
            {getStatusText(pickup.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{pickup.pickupDate}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">{pickup.timeSlot}</span>
          </div>
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
            <span className="text-sm">{pickup.address}</span>
          </div>
        </div>

        {/* Partner Info */}
        {pickup.partnerName && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Partner: {pickup.partnerName}</span>
            </div>
          </div>
        )}

        {/* Pickup Code */}
        {pickup.pickupCode && (
          <div className="border-t pt-4">
            <p className="text-sm text-muted-foreground mb-1">Pickup Code:</p>
            <p className="font-mono font-bold text-lg">{pickup.pickupCode}</p>
            <p className="text-xs text-muted-foreground">Share this code with the partner</p>
          </div>
        )}

        {/* Items and Total (for pending approval or completed) */}
        {pickup.items && pickup.items.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2 flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Items Collected</span>
            </h4>
            <div className="space-y-2 mb-3">
              {pickup.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center font-medium border-t pt-2">
              <span className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4" />
                <span>Total Amount:</span>
              </span>
              <span>${pickup.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Approval Actions */}
        {pickup.status === 'pending-approval' && (
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Review the items and total amount above, then approve to complete the pickup.
            </p>
            <div className="flex space-x-2">
              <Button 
                onClick={() => handleApprove(pickup.id)}
                disabled={isApproving === pickup.id}
                className="flex-1"
              >
                <Check className="w-4 h-4 mr-2" />
                {isApproving === pickup.id ? 'Approving...' : 'Approve Pickup'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-muted-foreground">All your pickup requests</p>
          </div>
        </div>

        {/* Orders List */}
        {userPickups.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't scheduled any pickups yet.
              </p>
              <Button onClick={onBack}>
                Schedule Your First Pickup
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div>
            {userPickups.map(renderPickupDetails)}
          </div>
        )}
      </div>
    </div>
  );
};