import { Bell, User, LogOut, Droplets, Heart, Brain, Apple, Moon, Settings, Edit3, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [greeting, setGreeting] = useState("Good morning!");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    phone: "",
  });
  const [tempProfile, setTempProfile] = useState(userProfile);
  const [reminders, setReminders] = useState([
    { id: 1, text: "Time to hydrate! Drink a glass of water 💧", icon: Droplets, color: "text-blue-500", hour: 10, minute: 0 },
    { id: 2, text: "Take a moment to breathe deeply 🌸", icon: Brain, color: "text-purple-500", hour: 14, minute: 0 },
    { id: 3, text: "Stand up and stretch for 2 minutes 🧘‍♀️", icon: Heart, color: "text-red-500", hour: 11, minute: 30 },
    { id: 4, text: "Have a healthy snack! 🍎", icon: Apple, color: "text-green-500", hour: 15, minute: 30 },
    { id: 5, text: "Remember to rest your eyes 👀", icon: Brain, color: "text-indigo-500", hour: 16, minute: 0 },
    { id: 6, text: "Time for your wellness check! ✨", icon: Heart, color: "text-pink-500", hour: 18, minute: 0 },
  ]);
  const [lastNotifiedReminders, setLastNotifiedReminders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserProfile({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
            email: user.email || "",
            dateOfBirth: user.user_metadata?.date_of_birth || "",
            phone: user.user_metadata?.phone || "",
          });
          setTempProfile({
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || "User",
            email: user.email || "",
            dateOfBirth: user.user_metadata?.date_of_birth || "",
            phone: user.user_metadata?.phone || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        return "Good morning!";
      } else if (hour < 17) {
        return "Good afternoon!";
      } else if (hour < 21) {
        return "Good evening!";
      } else {
        return "Good night!";
      }
    };

    setGreeting(getGreeting());

    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      reminders.forEach((reminder) => {
        const reminderTime = `${reminder.hour.toString().padStart(2, '0')}:${reminder.minute.toString().padStart(2, '0')}`;
        const currentTime = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
        
        // Check if it's time for the reminder and hasn't been notified today
        if (currentTime === reminderTime && !lastNotifiedReminders.has(reminder.id)) {
          toast({
            title: "⏰ Wellness Reminder",
            description: reminder.text,
            duration: 5000, // Show for 5 seconds
          });
          
          // Add to notified set
          setLastNotifiedReminders(prev => new Set(prev).add(reminder.id));
        }
      });
    };

    // Check every minute
    const reminderInterval = setInterval(checkReminders, 60000);

    // Reset notified reminders at midnight
    const midnightReset = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setLastNotifiedReminders(new Set());
      }
    }, 60000);

    // Check immediately on mount
    checkReminders();

    return () => {
      clearInterval(reminderInterval);
      clearInterval(midnightReset);
    };
  }, [reminders, lastNotifiedReminders, toast]);

  const handleReminderClick = (reminder: any) => {
    toast({
      title: "Wellness Reminder",
      description: reminder.text,
    });
  };

  const handleProfileOpen = () => {
    setTempProfile(userProfile);
    setIsProfileDialogOpen(true);
  };

  const handleProfileSave = async () => {
    try {
      // Update local state
      setUserProfile(tempProfile);
      setIsProfileDialogOpen(false);
      
      // Update Supabase user metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.auth.updateUser({
          data: {
            full_name: tempProfile.name,
            date_of_birth: tempProfile.dateOfBirth,
            phone: tempProfile.phone,
          }
        });
      }
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  const handleProfileCancel = () => {
    setTempProfile(userProfile);
    setIsProfileDialogOpen(false);
  };

  const handleSettings = () => {
    toast({
      title: "Settings",
      description: "Customize your wellness preferences, notification schedules, and app appearance.",
    });
  };

  const handleWellnessHistory = () => {
    toast({
      title: "Wellness History", 
      description: "View your complete wellness journey including reminders, activities, and health insights.",
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: 'Signed out successfully' });
    navigate('/');
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">{greeting}</h2>
      </div>
      
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Wellness Reminders
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {reminders.map((reminder) => (
              <DropdownMenuItem 
                key={reminder.id} 
                onClick={() => handleReminderClick(reminder)}
                className="flex items-center gap-3 p-3 cursor-pointer"
              >
                <reminder.icon className={`w-5 h-5 ${reminder.color}`} />
                <div className="flex-1">
                  <span className="text-sm block">{reminder.text}</span>
                  <span className="text-xs text-muted-foreground">
                    {reminder.hour.toString().padStart(2, '0')}:{reminder.minute.toString().padStart(2, '0')}
                  </span>
                </div>
                {lastNotifiedReminders.has(reminder.id) && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">✓</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground">
              Click any reminder to set a notification
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {userProfile.name}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileOpen} className="cursor-pointer">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleWellnessHistory} className="cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              Wellness History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profile Edit Dialog */}
        <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={tempProfile.name}
                  onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={tempProfile.email}
                  onChange={(e) => setTempProfile({ ...tempProfile, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={tempProfile.phone}
                  onChange={(e) => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={tempProfile.dateOfBirth}
                  onChange={(e) => setTempProfile({ ...tempProfile, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleProfileCancel}>
                Cancel
              </Button>
              <Button onClick={handleProfileSave}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};
