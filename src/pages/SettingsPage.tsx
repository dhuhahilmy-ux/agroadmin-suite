import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Shield, Palette, Building } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    orders: true,
    inventory: true,
    marketing: false,
  });

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'Your settings have been updated successfully.',
    });
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="business" className="gap-2">
            <Building className="h-4 w-4" />
            Business
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and profile picture</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Change Photo</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="Admin" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="User" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@agrodwipa.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+62 812 3456 7890" />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about new orders and status changes
                  </p>
                </div>
                <Switch
                  checked={notifications.orders}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, orders: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for low stock and out of stock items
                  </p>
                </div>
                <Switch
                  checked={notifications.inventory}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, inventory: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Marketing Emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about new features and promotions
                  </p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, marketing: checked }))
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Business Tab */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Update your business details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input id="businessName" defaultValue="AgroDwipa Store" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type</Label>
                  <Input id="businessType" defaultValue="Agriculture E-commerce" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="businessAddress">Business Address</Label>
                  <Input
                    id="businessAddress"
                    defaultValue="Jl. Pertanian No. 123, Bogor, West Java"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">Tax ID (NPWP)</Label>
                  <Input id="taxId" defaultValue="12.345.678.9-012.345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Input id="currency" defaultValue="IDR - Indonesian Rupiah" disabled />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Business Info</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
