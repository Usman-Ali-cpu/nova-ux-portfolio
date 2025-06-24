
import { useState } from 'react';

type GeocodeResult = {
  latitude: number | undefined;
  longitude: number | undefined;
  isLoading: boolean;
  error: string | null;
};

export const useGeocoding = () => {
  const [result, setResult] = useState<GeocodeResult>({
    latitude: undefined,
    longitude: undefined,
    isLoading: false,
    error: null,
  });

  const geocodeAddress = async (address: string) => {
    if (!address.trim()) {
      setResult({
        latitude: undefined,
        longitude: undefined,
        isLoading: false,
        error: null,
      });
      return;
    }

    setResult(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      console.log('Starting real geocoding for address:', address);
      
      // Use Nominatim (OpenStreetMap) free geocoding service
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'RunningApp/1.0'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Nominatim geocoding response:', data);

      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);
        
        console.log(`Successfully geocoded "${address}" to:`, { latitude, longitude });
        
        setResult({
          latitude,
          longitude,
          isLoading: false,
          error: null,
        });
      } else {
        console.warn('No geocoding results found for:', address);
        setResult({
          latitude: undefined,
          longitude: undefined,
          isLoading: false,
          error: 'Address not found',
        });
      }
      
    } catch (error) {
      console.error('Geocoding error:', error);
      setResult({
        latitude: undefined,
        longitude: undefined,
        isLoading: false,
        error: 'Failed to geocode address',
      });
    }
  };

  return {
    ...result,
    geocodeAddress,
  };
};
