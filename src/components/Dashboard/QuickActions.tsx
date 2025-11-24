import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoodDialog, SymptomDialog, NoteDialog } from "./TrackingDialogs";

export const QuickActions = () => {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MoodDialog />
        <SymptomDialog />
        <NoteDialog />
      </CardContent>
    </Card>
  );
};
