import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useUserData = () => {
  const [cycleDay, setCycleDay] = useState(14);
  const [mood, setMood] = useState({ mood: 'Happy', energy: 'High' });
  const [water, setWater] = useState({ consumed: 6, target: 8 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      // Load cycle data
      const { data: cycleData } = await supabase
        .from('cycle_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (cycleData) setCycleDay(cycleData.cycle_day);

      // Load mood data
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (moodData) {
        setMood({ mood: moodData.mood, energy: moodData.energy_level || 'Medium' });
      }

      // Load water intake
      const { data: waterData } = await supabase
        .from('water_intake')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (waterData) {
        setWater({ consumed: waterData.cups_consumed, target: waterData.target_cups });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateWater = async (cups: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      await supabase
        .from('water_intake')
        .upsert({
          user_id: user.id,
          date: today,
          cups_consumed: cups,
          target_cups: water.target
        });

      setWater({ ...water, consumed: cups });
    } catch (error) {
      console.error('Error updating water:', error);
    }
  };

  const saveMood = async (newMood: string, energy: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split('T')[0];

      await supabase
        .from('mood_entries')
        .upsert({
          user_id: user.id,
          date: today,
          mood: newMood,
          energy_level: energy
        });

      setMood({ mood: newMood, energy });
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const saveCycleDay = async (day: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('cycle_entries')
        .insert({
          user_id: user.id,
          cycle_day: day
        });

      setCycleDay(day);
    } catch (error) {
      console.error('Error saving cycle day:', error);
    }
  };

  return { cycleDay, mood, water, loading, updateWater, saveMood, saveCycleDay };
};
