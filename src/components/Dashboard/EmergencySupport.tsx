'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Phone, Share2, Video, Hospital, ArrowLeft } from 'lucide-react';
import { HospitalMap } from '@/components/Healthcare/HospitalMap';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EmergencySupportProps {
  onBack?: () => void;
}

export const EmergencySupport = ({ onBack }: EmergencySupportProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
          const message = `I'm at this location and may need help: ${mapsUrl}`;
          
          if (navigator.share) {
            navigator.share({
              title: 'My Emergency Location',
              text: message
            }).catch(err => console.error("Could not share location", err));
          } else {
            navigator.clipboard.writeText(message);
            toast({
              title: "Location Copied!",
              description: "Your location has been copied to the clipboard. Paste it to share."
            });
          }
        },
        () => {
          toast({
            variant: 'destructive',
            title: 'Location Error',
            description: 'Could not get your location. Please enable location services.',
          });
        }
      );
    } else {
      toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Geolocation is not supported by your browser.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      )}
      
      <div>
        <h1 className="text-3xl font-bold">Emergency Support</h1>
        <p className="text-muted-foreground">Find immediate help and locate nearby healthcare providers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="w-5 h-5" />
              Urgent Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button variant="destructive" className="w-full justify-center text-base p-6 gap-2">
              <Phone className="h-5 w-5" />
              Call Emergency
            </Button>
            <Button onClick={handleShareLocation} variant="secondary" className="w-full justify-center text-base p-6 gap-2">
              <Share2 className="h-5 w-5" />
              Share My Location
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5 text-primary" />
              Virtual Consultation
            </CardTitle>
            <CardDescription>Connect with a doctor for an urgent video consultation. This is a simulation.</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Connect with a Doctor Now</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Virtual Doctor Visit</DialogTitle>
                  <DialogDescription>
                    You are being connected to a certified professional. For severe emergencies, please call your local emergency number.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center p-4 min-h-[200px]">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-lg font-medium mt-4">Connecting...</h3>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="w-5 w-5" />
              Find Nearby Hospitals
            </CardTitle>
            <CardDescription>Locate healthcare providers in your area based on your current location.</CardDescription>
          </CardHeader>
          <CardContent>
            <HospitalMap />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};