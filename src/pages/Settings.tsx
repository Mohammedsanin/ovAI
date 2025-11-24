'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Bell, Moon, Sun, Palette, Volume2, Smartphone, Mail, Heart, Brain, Droplets, MessageSquare, HelpCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [preferences, setPreferences] = useState({
    theme: 'light',
    notifications: true,
    soundEnabled: true,
    emailReminders: true,
    reminderFrequency: [30], // minutes
    hydrationGoal: 8, // glasses
    exerciseGoal: 30, // minutes
    sleepGoal: 8, // hours
    wellnessFocus: 'balanced',
    email: '',
    customReminders: [
      { id: 1, text: "Take deep breaths", enabled: true },
      { id: 2, text: "Check posture", enabled: true },
      { id: 3, text: "Smile practice", enabled: false },
    ]
  });

  const handleSave = () => {
    // Save to localStorage for demo
    localStorage.setItem('ovaipreferences', JSON.stringify(preferences));
    toast({
      title: "Settings Saved!",
      description: "Your wellness preferences have been updated successfully.",
    });
  };

  const contactAdmin = (subject: string) => {
    const adminEmail = 'saninmophammed03@gmail.com';
    const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Hello OVAI Admin,\n\nI need help with: ${subject}\n\nUser Details:\nEmail: ${preferences.email}\nTime: ${new Date().toLocaleString()}\n\nThank you!`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: "Your email client should open to contact the admin.",
    });
  };

  const addCustomReminder = () => {
    const newReminder = {
      id: Date.now(),
      text: "",
      enabled: true
    };
    setPreferences(prev => ({
      ...prev,
      customReminders: [...prev.customReminders, newReminder]
    }));
  };

  const updateCustomReminder = (id: number, text: string) => {
    setPreferences(prev => ({
      ...prev,
      customReminders: prev.customReminders.map(r => 
        r.id === id ? { ...r, text } : r
      )
    }));
  };

  const toggleCustomReminder = (id: number) => {
    setPreferences(prev => ({
      ...prev,
      customReminders: prev.customReminders.map(r => 
        r.id === id ? { ...r, enabled: !r.enabled } : r
      )
    }));
  };

  const deleteCustomReminder = (id: number) => {
    setPreferences(prev => ({
      ...prev,
      customReminders: prev.customReminders.filter(r => r.id !== id)
    }));
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          ← Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your OVAI wellness experience</p>
        </div>
      </div>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance
          </CardTitle>
          <CardDescription>Personalize your app look and feel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    Light
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    Dark
                  </div>
                </SelectItem>
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Auto
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
          <CardDescription>Manage your wellness reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive wellness reminders</p>
            </div>
            <Switch 
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Sound Effects</Label>
              <p className="text-sm text-muted-foreground">Play sounds with reminders</p>
            </div>
            <Switch 
              checked={preferences.soundEnabled}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, soundEnabled: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Email Reminders</Label>
              <p className="text-sm text-muted-foreground">Get daily wellness summaries</p>
            </div>
            <Switch 
              checked={preferences.emailReminders}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailReminders: checked }))}
            />
          </div>

          <div>
            <Label>Reminder Frequency</Label>
            <p className="text-sm text-muted-foreground mb-2">Minutes between wellness checks</p>
            <Slider
              value={preferences.reminderFrequency}
              onValueChange={(value) => setPreferences(prev => ({ ...prev, reminderFrequency: value }))}
              max={120}
              min={15}
              step={15}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>15 min</span>
              <span>{preferences.reminderFrequency[0]} min</span>
              <span>2 hours</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wellness Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Wellness Goals
          </CardTitle>
          <CardDescription>Set your daily wellness targets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <Label>Hydration Goal</Label>
                <p className="text-sm text-muted-foreground">Glasses per day</p>
                <Input
                  type="number"
                  value={preferences.hydrationGoal}
                  onChange={(e) => setPreferences(prev => ({ ...prev, hydrationGoal: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-purple-500" />
              <div className="flex-1">
                <Label>Exercise Goal</Label>
                <p className="text-sm text-muted-foreground">Minutes per day</p>
                <Input
                  type="number"
                  value={preferences.exerciseGoal}
                  onChange={(e) => setPreferences(prev => ({ ...prev, exerciseGoal: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Moon className="w-5 h-5 text-indigo-500" />
              <div className="flex-1">
                <Label>Sleep Goal</Label>
                <p className="text-sm text-muted-foreground">Hours per night</p>
                <Input
                  type="number"
                  value={preferences.sleepGoal}
                  onChange={(e) => setPreferences(prev => ({ ...prev, sleepGoal: parseInt(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Wellness Focus</Label>
            <p className="text-sm text-muted-foreground mb-2">Choose your primary wellness area</p>
            <Select value={preferences.wellnessFocus} onValueChange={(value) => setPreferences(prev => ({ ...prev, wellnessFocus: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="balanced">🌟 Balanced Wellness</SelectItem>
                <SelectItem value="mental">🧘 Mental Health Focus</SelectItem>
                <SelectItem value="physical">💪 Physical Fitness</SelectItem>
                <SelectItem value="nutrition">🥗 Nutrition & Diet</SelectItem>
                <SelectItem value="sleep">😴 Sleep Quality</SelectItem>
                <SelectItem value="stress">🌸 Stress Management</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Custom Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Custom Reminders
          </CardTitle>
          <CardDescription>Create personalized wellness reminders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {preferences.customReminders.map((reminder) => (
            <div key={reminder.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <Switch
                checked={reminder.enabled}
                onCheckedChange={() => toggleCustomReminder(reminder.id)}
              />
              <Input
                value={reminder.text}
                onChange={(e) => updateCustomReminder(reminder.id, e.target.value)}
                placeholder="Enter reminder text..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteCustomReminder(reminder.id)}
              >
                Delete
              </Button>
            </div>
          ))}
          
          <Button onClick={addCustomReminder} variant="outline" className="w-full">
            + Add Custom Reminder
          </Button>
        </CardContent>
      </Card>

      {/* Support & Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Support & Help
          </CardTitle>
          <CardDescription>Get help and contact the OVAI admin team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={() => contactAdmin("Technical Support - OVAI App Issue")}
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <MessageSquare className="w-4 h-4" />
              Technical Support
            </Button>
            
            <Button 
              onClick={() => contactAdmin("Account Help - OVAI App")}
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <Mail className="w-4 h-4" />
              Account Help
            </Button>
            
            <Button 
              onClick={() => contactAdmin("Wellness Feature Request - OVAI")}
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <Heart className="w-4 h-4" />
              Feature Request
            </Button>
            
            <Button 
              onClick={() => contactAdmin("Report Bug - OVAI App")}
              variant="outline" 
              className="flex items-center gap-2 h-12"
            >
              <MessageSquare className="w-4 h-4" />
              Report Bug
            </Button>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📧 Direct Email Support</h3>
            <p className="text-sm text-blue-700 mb-2">
              For immediate assistance, email us directly at:
            </p>
            <p className="text-sm font-mono bg-blue-100 p-2 rounded">
              saninmophammed03@gmail.com
            </p>
            <p className="text-xs text-blue-600 mt-2">
              We typically respond within 24 hours during business days.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};
