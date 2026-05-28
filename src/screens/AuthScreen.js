import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator,
  KeyboardAvoidingView, Platform           // ← SafeAreaView retiré d'ici
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ← ajouté ici
import { COLORS } from "../constants";
import { useAuth } from "../hooks/useAuth";

export default function AuthScreen() {
  const { signIn, signUp }      = useAuth();
  const [mode, setMode]         = useState("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handle = async () => {
    if (!email || !password) { setError("Remplis tous les champs."); return; }
    setLoading(true);
    setError("");
    try {
      if (mode === "login") await signIn(email, password);
      else {
        await signUp(email, password);
        setError("Vérifie ton email pour confirmer ton compte !");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.logoWrap}>
          <Text style={styles.logo}>ExpiTrack</Text>
          <Text style={styles.tagline}>Gérez vos dates d'expiration</Text>
        </View>

        <View style={styles.tabs}>
          {[
            { key: "login",    label: "Connexion"   },
            { key: "register", label: "Inscription" },
          ].map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tab, mode === t.key && styles.tabActive]}
              onPress={() => { setMode(t.key); setError(""); }}
            >
              <Text style={[styles.tabText, mode === t.key && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>EMAIL</Text>
          <TextInput
            value={email} onChangeText={setEmail}
            placeholder="ton@email.com"
            placeholderTextColor={COLORS.muted}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          <Text style={[styles.label, { marginTop: 16 }]}>MOT DE PASSE</Text>
          <TextInput
            value={password} onChangeText={setPassword}
            placeholder="••••••••"
            placeholderTextColor={COLORS.muted}
            secureTextEntry
            style={styles.input}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity style={styles.btn} onPress={handle} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.btnText}>
                  {mode === "login" ? "Se connecter" : "Créer un compte"}
                </Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.bg },
  container:     { flex: 1, justifyContent: "center", padding: 32 },
  logoWrap:      { alignItems: "center", marginBottom: 40 },
  logo:          { color: COLORS.text, fontSize: 36, fontWeight: "800", letterSpacing: -1 },
  tagline:       { color: COLORS.muted, fontSize: 14, marginTop: 6 },
  tabs:          { flexDirection: "row", backgroundColor: COLORS.surface, borderRadius: 12, padding: 4, marginBottom: 28 },
  tab:           { flex: 1, padding: 10, borderRadius: 10, alignItems: "center" },
  tabActive:     { backgroundColor: COLORS.primary },
  tabText:       { color: COLORS.muted, fontWeight: "700", fontSize: 14 },
  tabTextActive: { color: "white" },
  form:          { backgroundColor: COLORS.surface, borderRadius: 16, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  label:         { color: COLORS.muted, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8 },
  input:         { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, color: COLORS.text, fontSize: 14 },
  error:         { color: "#ff6b6b", fontSize: 12, marginTop: 12, textAlign: "center" },
  btn:           { backgroundColor: COLORS.primary, borderRadius: 10, padding: 14, alignItems: "center", marginTop: 20 },
  btnText:       { color: "white", fontWeight: "800", fontSize: 15 },
});