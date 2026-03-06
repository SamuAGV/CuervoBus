import React, { useEffect } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../../src/contexts/AuthContext';
import { useDriverLocation } from '../../../src/hooks/useLocation';

export default function DriverScreen() {
  const { user } = useAuth();
  const { isSharing, error, startSharing, stopSharing, location } = useDriverLocation(
    user?.uid || '',
    'bus-1' // Temporal - luego vendrá de la base de datos
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Panel del Conductor</Text>
        <Text style={styles.subtitle}>Bienvenido, {user?.name}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, isSharing ? styles.activeDot : styles.inactiveDot]} />
          <Text style={styles.statusText}>
            {isSharing ? 'Compartiendo ubicación' : 'No compartiendo'}
          </Text>
        </View>

        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.infoLabel}>Ubicación actual:</Text>
            <Text style={styles.infoText}>Lat: {location.latitude.toFixed(6)}</Text>
            <Text style={styles.infoText}>Lng: {location.longitude.toFixed(6)}</Text>
            {location.speed ? (
              <Text style={styles.infoText}>
                Velocidad: {Math.round(location.speed * 3.6)} km/h
              </Text>
            ) : null}
          </View>
        )}

        <TouchableOpacity
          style={[styles.button, isSharing ? styles.stopButton : styles.startButton]}
          onPress={isSharing ? stopSharing : startSharing}
        >
          <Text style={styles.buttonText}>
            {isSharing ? '🛑 Detener Compartir' : '🚌 Comenzar a Compartir'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          {isSharing 
            ? 'Los estudiantes pueden ver tu ubicación en tiempo real'
            : 'Activa el botón para que los estudiantes vean tu ubicación'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  activeDot: {
    backgroundColor: '#34C759',
  },
  inactiveDot: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    fontSize: 18,
    color: '#333',
  },
  locationInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  button: {
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  startButton: {
    backgroundColor: '#34C759',
  },
  stopButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  note: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
});