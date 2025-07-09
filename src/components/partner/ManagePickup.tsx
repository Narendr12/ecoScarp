import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { usePickups } from '@/contexts/PickupContext';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, User, KeyRound, Package, Plus, Trash2, DollarSign } from 'lucide-react';
import { PickupItem } from '@/types/pickup';

interface ManagePickupProps {
  pickupId: string;
  onBack: () => void;
}

export const ManagePickup: React.FC<ManagePickupProps> = ({ pickupId, onBack }) => {
  const { user } = useAuth();
  const { pickups, startPickup, addPickupItems } = usePickups();
  const { toast } = useToast();
  
  const pickup = pickups.find(p => p.id === pickupId);
  
  const [pickupCode, setPickupCode] = useState('');
  const [items, setItems] = useState<PickupItem[]>([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: 1, price: 0 });
  const [isLoading, setIsLoading] = useState(false);

  if (!pickup) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <p>Pickup not found</p>
            <Button className="mt-4" onClick={onBack}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in-process': return 'bg-purple-100 text-purple-800';
      case 'pending-approval': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'in-process': return 'In Process';
      case 'pending-approval': return 'Pending Approval';
      case 'completed': return 'Completed';
      default: return 'Unknown';
    }
  };

  const handleStartPickup = () => {
    if (!pickupCode) {
      toast({
        title: "Pickup Code Required",
        description: "Please enter the pickup code provided by the customer",
        variant: "destructive"
      });
      return;
    }

    const success = startPickup(pickupId, pickupCode);
    if (success) {
      toast({
        title: "Pickup Started!",
        description: "You can now add item details",
      });
      setPickupCode('');
    } else {
      toast({
        title: "Invalid Pickup Code",
        description: "The pickup code is incorrect. Please check with the customer.",
        variant: "destructive"
      });
    }
  };

  const addItem = () => {
    if (!newItem.name || newItem.quantity <= 0 || newItem.price <= 0) {
      toast({
        title: "Invalid Item",
        description: "Please fill in all item details with valid values",
        variant: "destructive"
      });
      return;
    }

    const item: PickupItem = {
      id: `item_${Date.now()}`,
      name: newItem.name,
      quantity: newItem.quantity,
      price: newItem.price,
    };

    setItems([...items, item]);
    setNewItem({ name: '', quantity: 1, price: 0 });
  };

  const removeItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const getTotalAmount = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleSubmitForApproval = async () => {
    if (items.length === 0) {
      toast({
        title: "No Items Added",
        description: "Please add at least one item before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      addPickupItems(pickupId, items, getTotalAmount());
      toast({
        title: "Submitted for Approval!",
        description: "The pickup details have been sent to the customer for approval",
      });
      onBack();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit pickup details. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Manage Pickup</h1>
            <p className="text-muted-foreground">Pickup #{pickup.id.slice(-6)}</p>
          </div>
          <Badge className={getStatusColor(pickup.status)}>
            {getStatusText(pickup.status)}
          </Badge>
        </div>

        {/* Pickup Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Pickup Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{pickup.customerName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{pickup.customerPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{pickup.pickupDate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{pickup.timeSlot}</span>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
              <span className="text-sm">{pickup.address}</span>
            </div>
            {pickup.pickupCode && (
              <div className="border-t pt-3">
                <p className="text-sm text-muted-foreground mb-1">Pickup Code:</p>
                <p className="font-mono font-bold">{pickup.pickupCode}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Start Pickup */}
        {pickup.status === 'accepted' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5" />
                <span>Start Pickup</span>
              </CardTitle>
              <CardDescription>
                Enter the pickup code provided by the customer to start the pickup process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pickupCode">Pickup Code</Label>
                <Input
                  id="pickupCode"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={pickupCode}
                  onChange={(e) => setPickupCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
              <Button onClick={handleStartPickup} className="w-full">
                Start Pickup
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Add Items */}
        {pickup.status === 'in-process' && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Add Items</span>
              </CardTitle>
              <CardDescription>
                Add the scrap items collected from this pickup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Item Form */}
              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add New Item</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="itemName">Item Name</Label>
                    <Input
                      id="itemName"
                      placeholder="e.g., Copper Wire"
                      value={newItem.name}
                      onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <Button onClick={addItem} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Items List */}
              {items.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Added Items</h4>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} × ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium flex items-center space-x-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Total Amount:</span>
                      </span>
                      <span className="font-bold text-lg">${getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitForApproval} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit for Customer Approval'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Completed Status */}
        {(pickup.status === 'pending-approval' || pickup.status === 'completed') && pickup.items && (
          <Card>
            <CardHeader>
              <CardTitle>Pickup Details</CardTitle>
              <CardDescription>
                {pickup.status === 'pending-approval' 
                  ? 'Waiting for customer approval' 
                  : 'Pickup completed successfully'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pickup.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center font-medium">
                  <span>Total Amount:</span>
                  <span>${pickup.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};