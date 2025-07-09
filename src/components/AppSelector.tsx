import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Truck } from 'lucide-react';

interface AppSelectorProps {
  onSelectApp: (type: 'customer' | 'partner') => void;
}

export const AppSelector: React.FC<AppSelectorProps> = ({ onSelectApp }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">ecoScrap</h1>
          <p className="text-muted-foreground">Choose your mode to continue</p>
        </div>
        
        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectApp('customer')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Customer App</CardTitle>
              <CardDescription>
                Schedule scrap pickups and track your orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg">
                Continue as Customer
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onSelectApp('partner')}>
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                <Truck className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle>Partner App</CardTitle>
              <CardDescription>
                Manage pickup requests and complete orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary" size="lg">
                Continue as Partner
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};