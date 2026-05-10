import { useEffect, useState } from "react";

export function useLocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message),
      { enableHighAccuracy: false, maximumAge: 60_000 },
    );
  }, []);

  // Mock: default to central Kumasi.
  return { coords: coords || { lat: 6.6885, lng: -1.6244 }, error };
}
