import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useStudentLocation } from '../../../src/hooks/useLocation';

export default function StudentScreen() {
  const { user } = useAuth();
  const [studentLocation, setStudentLocation] = useState<Location.LocationObject | null>(null);
  const { busLocation, isNearby } = useStudentLocation('bus-1'); // El ID del bus debería ser dinámico

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setStudentLocation(location);
      }
    })();
  }, []);

  if (!busLocation) {
    return (
      <View style={styles.container}>
        <Text>Esperando ubicación del autobús...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: busLocation.latitude,
          longitude: busLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Marcador del autobús */}
        <Marker
          coordinate={{
            latitude: busLocation.latitude,
            longitude: busLocation.longitude,
          }}
          title="Tu Autobús"
          description={busLocation.route}
          pinColor="blue"
        />

        {/* Marcador del estudiante */}
        {studentLocation && (
          <Marker
            coordinate={{
              latitude: studentLocation.coords.latitude,
              longitude: studentLocation.coords.longitude,
            }}
            title="Tu ubicación"
            pinColor="green"
          />
        )}
      </MapView>

      {isNearby && (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>
            🚌 ¡El autobús está cerca!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  notification: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});