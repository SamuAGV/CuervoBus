import * as Location from 'expo-location';
import { off, onValue, ref, set } from 'firebase/database';
import { useEffect, useRef, useState } from 'react';
import { rtdb } from '../config/firebase';
import { BusLocation } from '../types';

export const useDriverLocation = (driverId: string, busId: string) => {
  const [location, setLocation] = useState<BusLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const startSharing = async () => {
    try {
      console.log('Solicitando permiso de ubicación...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permiso de ubicación denegado');
        return;
      }

      console.log('Permiso concedido, iniciando seguimiento...');
      setIsSharing(true);
      
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (newLocation) => {
          console.log('Nueva ubicación:', newLocation.coords);
          const busLocation: BusLocation = {
            busId,
            driverId,
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            heading: newLocation.coords.heading || 0,
            speed: newLocation.coords.speed || 0,
            timestamp: newLocation.timestamp,
            route: 'Ruta Norte'
          };

          setLocation(busLocation);
          
          // Guardar en Firebase Realtime Database
          const locationRef = ref(rtdb, `locations/${busId}`);
          set(locationRef, busLocation)
            .then(() => console.log('Ubicación guardada en Firebase'))
            .catch((err) => console.error('Error guardando en Firebase:', err));
        }
      );
    } catch (err) {
      console.error('Error en startSharing:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  const stopSharing = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
    }
    
    const locationRef = ref(rtdb, `locations/${busId}`);
    set(locationRef, null);
    
    setIsSharing(false);
  };

  useEffect(() => {
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  return { location, error, isSharing, startSharing, stopSharing };
};

export const useStudentLocation = (busId: string) => {
  const [busLocation, setBusLocation] = useState<BusLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Escuchando ubicación del bus:', busId);
    const locationRef = ref(rtdb, `locations/${busId}`);
    
    const unsubscribe = onValue(locationRef, 
      (snapshot) => {
        const data = snapshot.val();
        console.log('Datos recibidos de Firebase:', data);
        if (data) {
          setBusLocation(data);
          setLoading(false);
        } else {
          console.log('No hay datos de ubicación disponibles');
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error escuchando ubicación:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('Limpiando suscripción de ubicación');
      off(locationRef);
    };
  }, [busId]);

  // Calcular si está cerca (ejemplo simple)
  const isNearby = busLocation !== null; // Por ahora solo verifica que existe

  return { busLocation, loading, error, isNearby };
};