import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Apple } from 'lucide-react';

export const MealLogger = () => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [mealType, setMealType] = useState('');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');

  const saveMeal = async () => {
    if (!mealType || !mealName) {
      toast({ title: 'Error', description: 'Please fill required fields', variant: 'destructive' });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({ title: 'Error', description: 'Please sign in', variant: 'destructive' });
        return;
      }

      await supabase.from('meals').insert({
        user_id: user.id,
        meal_type: mealType,
        meal_name: mealName,
        calories: calories ? parseInt(calories) : null,
        protein: protein ? parseInt(protein) : null
      });

      toast({ title: 'Success', description: 'Meal logged!' });
      setOpen(false);
      setMealType('');
      setMealName('');
      setCalories('');
      setProtein('');
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Apple className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log a Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Breakfast">Breakfast</SelectItem>
                <SelectItem value="Lunch">Lunch</SelectItem>
                <SelectItem value="Dinner">Dinner</SelectItem>
                <SelectItem value="Snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Meal Name</Label>
            <Input
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              placeholder="e.g., Grilled Chicken Salad"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Calories (optional)</Label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="450"
              />
            </div>
            <div>
              <Label>Protein (g) (optional)</Label>
              <Input
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="35"
              />
            </div>
          </div>
          <Button onClick={saveMeal} className="w-full">Save Meal</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
