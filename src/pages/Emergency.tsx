'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Hospital, Phone, ShieldAlert, Video, Loader2, PhoneOff, Mic, MicOff, Share2 } from 'lucide-react';
import { HospitalMap } from '@/components/Healthcare/HospitalMap';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const VideoCallSimulation = ({setOpen}: {setOpen: (open: boolean) => void}) => {
    const [status, setStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState(true);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (status === 'connecting') {
            timer = setTimeout(() => {
                setStatus('connected');
            }, 3000);
        }

        return () => clearTimeout(timer);
    }, [status]);
    
    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, []);

      const handleEndCall = () => {
        setStatus('ended');
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
        setTimeout(() => setOpen(false), 1500);
    }

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-[400px]">
            {status === 'connecting' && (
                <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    <h3 className="text-lg font-medium">Connecting you to a doctor...</h3>
                    <p className="text-sm text-muted-foreground">Please wait a moment.</p>
                </div>
            )}
            {status === 'connected' && (
                 <div className="w-full">
                    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                        {/* Doctor's Video */}
                         <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-800">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src="https://picsum.photos/seed/doc/200/200" />
                                <AvatarFallback>DR</AvatarFallback>
                             </Avatar>
                            <p className="font-semibold mt-2">Dr. Anya Sharma</p>
                            <p className="text-sm text-gray-300">OB/GYN Specialist</p>
                            <span className="text-xs text-green-400 mt-2 animate-pulse">● Live</span>
                         </div>

                        {/* User's Video */}
                         <div className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-md overflow-hidden border-2 border-white/50">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted />
                            {!hasCameraPermission && <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs text-center p-1">Enable camera</div>}
                         </div>
                    </div>
                     {!hasCameraPermission && (
                        <Alert variant="destructive" className="mt-4">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access in your browser settings to use video features.
                          </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex justify-center gap-4 mt-6">
                        <Button variant="outline" size="icon" className="rounded-full h-12 w-12"><Mic className="h-6 w-6" /></Button>
                        <Button onClick={handleEndCall} variant="destructive" size="icon" className="rounded-full h-12 w-12"><PhoneOff className="h-6 w-6" /></Button>
                    </div>
                </div>
            )}
            {status === 'ended' && (
                 <div className="text-center space-y-4">
                    <h3 className="text-lg font-medium">Call Ended</h3>
                    <p className="text-sm text-muted-foreground">If you have further questions, please consult a healthcare provider.</p>
                </div>
            )}
        </div>
    )
}

export default function EmergencySupportPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const handleShareLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                    const message = `I'm at this location and may need help: ${mapsUrl}`;
                    
                    if(navigator.share) {
                        navigator.share({
                            title: 'My Emergency Location',
                            text: message
                        }).catch(err => console.error("Could not share location", err));
                    } else {
                        // Fallback for browsers that don't support navigator.share
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
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Emergency Support</h1>
        <p className="text-muted-foreground">Find immediate help and locate nearby healthcare providers.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-destructive/10 border-destructive/30">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert /> Urgent Actions</CardTitle>
             </CardHeader>
             <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button variant="destructive" className="w-full justify-center text-base p-6 gap-2"><Phone className="h-5 w-5"/>Call Emergency</Button>
                <Button onClick={handleShareLocation} variant="secondary" className="w-full justify-center text-base p-6 gap-2"><Share2 className="h-5 w-5"/>Share My Location</Button>
             </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Virtual Consultation</CardTitle>
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
                        <VideoCallSimulation setOpen={setIsDialogOpen} />
                    </DialogContent>
                 </Dialog>
            </CardContent>
        </Card>

      </div>

      <div className="grid gap-6">
          <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Hospital className="h-5 w-5" /> Find Nearby Hospitals</CardTitle>
                <CardDescription>Locate healthcare providers in your area based on your current location.</CardDescription>
            </CardHeader>
            <CardContent>
                <HospitalMap />
            </CardContent>
          </Card>
      </div>
    </div>
 );
}
