export type UserRole = 'driver' | 'student';

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  busId?: string; // Solo para conductores
}

export interface BusLocation {
  busId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  heading?: number; // Dirección del bus
  speed?: number; // Velocidad
  timestamp: number;
  route?: string; // Ruta del bus
}

export interface Bus {
  id: string;
  driverId: string;
  name: string;
  plate: string;
  route: string;
  capacity: number;
  isActive: boolean;
}