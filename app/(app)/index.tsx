import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useAuth } from '../../src/contexts/AuthContext';
import { useStudentLocation } from '../../src/hooks/useLocation';

export default function StudentScreen() {
  const { user } = useAuth();
  const [studentLocation, setStudentLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const { busLocation, loading, error } = useStudentLocation('bus-1'); // Temporal

  useEffect(() => {
    (async () => {
      try {
        console.log('Solicitando ubicación del estudiante...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setLocationError('Permiso de ubicación denegado');
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        console.log('Ubicación del estudiante:', location.coords);
        setStudentLocation(location);
      } catch (err) {
        console.error('Error obteniendo ubicación:', err);
        setLocationError('Error al obtener tu ubicación');
      }
    })();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', `Error de conexión: ${error}`);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Esperando ubicación del autobús...</Text>
      </View>
    );
  }

  if (!busLocation) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noBusText}>🚌</Text>
        <Text style={styles.noBusTitle}>Autobús no disponible</Text>
        <Text style={styles.noBusSubtitle}>
          El conductor aún no ha comenzado a compartir su ubicación
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Marcador del autobús */}
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title="Tu Autobús"
          description={`Ruta: ${busLocation.route || 'No especificada'}`}
        >
          <View style={styles.busMarker}>
            <Text style={styles.busMarkerText}>🚌</Text>
          </View>
        </Marker>
      </MapView>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>Estado del Autobús</Text>
        <Text style={styles.infoText}>
          {busLocation.speed && busLocation.speed > 0 
            ? `En movimiento - ${Math.round(busLocation.speed * 3.6)} km/h` 
            : 'Detenido'}
        </Text>
        <Text style={styles.infoText}>
          Última actualización: {new Date(busLocation.timestamp).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  noBusContainer: {
    alignItems: 'center',
  },
  noBusText: {
    fontSize: 60,
    marginBottom: 20,
  },
  noBusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  noBusSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  busMarker: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  busMarkerText: {
    fontSize: 20,
  },
});