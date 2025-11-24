import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    google: any;
  }
}

export const HospitalMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    loadGoogleMapsScript();
  }, []);

  const loadGoogleMapsScript = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      toast.error("Google Maps API key not configured. Please add it in the secrets.");
      return;
    }

    if (window.google) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => initializeMap();
    document.head.appendChild(script);
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const initializeMap = () => {
    if (!mapRef.current) return;

    const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York as default
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 13,
      styles: [
        {
          featureType: "poi.medical",
          elementType: "geometry",
          stylers: [{ color: "#ffd4d4" }]
        }
      ]
    });

    setMap(mapInstance);
  };

  const findNearbyHospitals = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        setUserLocation(location);
        
        if (map) {
          map.setCenter(location);
          
          // Add user location marker
          new window.google.maps.Marker({
            position: location,
            map: map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2
            },
            title: "Your Location"
          });

          // Search for hospitals
          const service = new window.google.maps.places.PlacesService(map);
          const request = {
            location: location,
            radius: 5000, // 5km radius
            type: 'hospital'
          };

          service.nearbySearch(request, (results: any[], status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              // Clear previous markers
              markersRef.current.forEach(marker => marker.setMap(null));
              markersRef.current = [];

              // Limit to 10 hospitals and calculate distances
              const limitedResults = results.slice(0, 10);
              const hospitalsWithDistance = limitedResults.map((place: any) => {
                const distance = calculateDistance(
                  location.lat, 
                  location.lng, 
                  place.geometry.location.lat(), 
                  place.geometry.location.lng()
                );
                return {
                  ...place,
                  distance: distance
                };
              });

              // Sort by distance
              hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
              setHospitals(hospitalsWithDistance);

              // Add hospital markers
              hospitalsWithDistance.forEach((place: any) => {
                const marker = new window.google.maps.Marker({
                  position: place.geometry.location,
                  map: map,
                  title: place.name,
                  icon: {
                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  }
                });

                markersRef.current.push(marker);

                const infoWindow = new window.google.maps.InfoWindow({
                  content: `
                    <div style="padding: 8px;">
                      <h3 style="font-weight: bold; margin-bottom: 4px;">${place.name}</h3>
                      <p style="margin: 4px 0;">${place.vicinity}</p>
                      <p style="margin: 4px 0;">Distance: ${place.distance.toFixed(1)} km</p>
                      ${place.rating ? `<p style="margin: 4px 0;">Rating: ${place.rating} ⭐</p>` : ''}
                    </div>
                  `
                });

                marker.addListener('click', () => {
                  infoWindow.open(map, marker);
                });
              });

              toast.success(`Found ${limitedResults.length} hospitals nearby`);
            } else {
              toast.error("Failed to find hospitals nearby");
            }
            setLoading(false);
          });
        }
      },
      (error) => {
        console.error('Error getting location:', error);
        toast.error("Failed to get your location. Please enable location access.");
        setLoading(false);
      }
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Nearby Hospitals</span>
          <Button 
            onClick={findNearbyHospitals} 
            disabled={loading || !map}
            size="sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Finding...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Find Hospitals
              </>
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={mapRef} 
          className="w-full h-[500px] rounded-lg"
          style={{ minHeight: '500px' }}
        />
        
        {hospitals.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Nearby Hospitals (10 closest)</h3>
            <div className="space-y-3">
              {hospitals.map((hospital, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium">{hospital.name}</h4>
                    <p className="text-sm text-muted-foreground">{hospital.vicinity}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-medium text-blue-600">
                        {hospital.distance.toFixed(1)} km away
                      </span>
                      {hospital.rating && (
                        <span className="text-sm text-yellow-600">
                          ⭐ {hospital.rating} rating
                        </span>
                      )}
                      {hospital.user_ratings_total && (
                        <span className="text-sm text-gray-500">
                          ({hospital.user_ratings_total} reviews)
                        </span>
                      )}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${hospital.geometry.location.lat()},${hospital.geometry.location.lng()}`;
                      window.open(url, '_blank');
                    }}
                  >
                    Directions
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mt-4">
          Click "Find Hospitals" to locate nearby medical facilities based on your current location.
        </p>
      </CardContent>
    </Card>
  );
};
