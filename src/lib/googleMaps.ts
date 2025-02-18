let googleMapsPromise: Promise<void> | null = null;

export function loadGoogleMapsApi(): Promise<void> {
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      reject(new Error('Google Maps API key is missing'));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => resolve();
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps'));
      googleMapsPromise = null;
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}