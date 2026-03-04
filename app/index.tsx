import React from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={styles.safe.backgroundColor} />
      <View style={styles.hero}>
        <View style={styles.card}>
          <Text style={styles.title}>CuervoBus</Text>
          <Text style={styles.subtitle}>
            Planifica tus viajes, consulta horarios y reserva con facilidad.
          </Text>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
            <Text style={styles.primaryButtonText}>Comenzar</Text>
          </TouchableOpacity>

          <Text style={styles.smallText}>Edita app/index.tsx para personalizar esta pantalla.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0b1220", // fondo oscuro elegante
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    backgroundColor: "#0f1724",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    // sombra (iOS) y elevación (Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#b9c0d6",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2563eb", // azul primario
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 160,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  smallText: {
    marginTop: 14,
    fontSize: 12,
    color: "#9aa5c7",
  },
});
