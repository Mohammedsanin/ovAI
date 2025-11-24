import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import bodyMapImage from "@/assets/body-map-cramps.png";

interface CrampsBodyMapProps {
  onAreaSelect: (area: string) => void;
  isLoading?: boolean;
}

const painAreas = [
  { id: "upper-abdomen", label: "Upper Abdomen", top: "35%", left: "50%" },
  { id: "lower-abdomen", label: "Lower Abdomen", top: "45%", left: "50%" },
  { id: "lower-back", label: "Lower Back", top: "45%", left: "50%" },
  { id: "upper-thighs", label: "Upper Thighs", top: "55%", left: "50%" },
  { id: "lower-thighs", label: "Lower Thighs", top: "65%", left: "50%" },
  { id: "calves", label: "Calves", top: "75%", left: "50%" },
];

export const CrampsBodyMap = ({ onAreaSelect, isLoading }: CrampsBodyMapProps) => {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  const handleAreaClick = (areaId: string, label: string) => {
    setSelectedArea(areaId);
    onAreaSelect(label);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle>Body Map for Cramps</CardTitle>
        <CardDescription>
          Select any area where you're experiencing discomfort to get targeted relief routines
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full max-w-md mx-auto">
          <img 
            src={bodyMapImage} 
            alt="Body map showing common cramp areas"
            className="w-full h-auto"
          />
          
          {/* Invisible clickable areas positioned on body map */}
          <button
            onClick={() => handleAreaClick("head", "Head/Neck")}
            disabled={isLoading}
            className={`absolute top-[8%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-full transition-all duration-300 ${
              selectedArea === "head" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Head/Neck"
          />

          <button
            onClick={() => handleAreaClick("breasts", "Breasts")}
            disabled={isLoading}
            className={`absolute top-[22%] left-1/2 -translate-x-1/2 w-24 h-16 rounded-full transition-all duration-300 ${
              selectedArea === "breasts" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Breasts"
          />

          <button
            onClick={() => handleAreaClick("upper-abdomen", "Upper Abdomen")}
            disabled={isLoading}
            className={`absolute top-[35%] left-1/2 -translate-x-1/2 w-28 h-12 rounded-full transition-all duration-300 ${
              selectedArea === "upper-abdomen" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Upper Abdomen"
          />
          
          <button
            onClick={() => handleAreaClick("lower-abdomen", "Lower Abdomen")}
            disabled={isLoading}
            className={`absolute top-[45%] left-1/2 -translate-x-1/2 w-28 h-14 rounded-full transition-all duration-300 ${
              selectedArea === "lower-abdomen" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Lower Abdomen"
          />
          
          <button
            onClick={() => handleAreaClick("lower-back", "Lower Back")}
            disabled={isLoading}
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 w-32 h-16 rounded-lg transition-all duration-300 ${
              selectedArea === "lower-back" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Lower Back"
          />

          <button
            onClick={() => handleAreaClick("hips", "Hips")}
            disabled={isLoading}
            className={`absolute top-[56%] left-1/2 -translate-x-1/2 w-36 h-12 rounded-full transition-all duration-300 ${
              selectedArea === "hips" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Hips"
          />
          
          <button
            onClick={() => handleAreaClick("upper-thighs", "Thighs")}
            disabled={isLoading}
            className={`absolute top-[66%] left-1/2 -translate-x-1/2 w-32 h-16 rounded-full transition-all duration-300 ${
              selectedArea === "upper-thighs" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Thighs"
          />

          <button
            onClick={() => handleAreaClick("legs", "Legs/Calves")}
            disabled={isLoading}
            className={`absolute top-[80%] left-1/2 -translate-x-1/2 w-28 h-20 rounded-full transition-all duration-300 ${
              selectedArea === "legs" 
                ? "bg-primary/60 backdrop-blur-sm ring-2 ring-primary" 
                : "bg-transparent hover:bg-primary/20 hover:backdrop-blur-sm"
            }`}
            aria-label="Legs/Calves"
          />
        </div>
      </CardContent>
    </Card>
  );
};
