import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet                   // ← SafeAreaView retiré d'ici
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ← ajouté ici
import { COLORS, CATEGORIES, DURATIONS } from "../constants";
import { useProducts }                   from "../hooks/useProducts";
import { addMonths }                     from "../utils/dates";

export default function AddScreen({ navigation, route }) {
  const userId            = route.params?.userId;
  const { addProduct }    = useProducts(userId);
  const [name, setName]           = useState("");
  const [category, setCategory]   = useState("alimentaire");
  const [inputMode, setInputMode] = useState("date");
  const [expDate, setExpDate]     = useState("");
  const [openDate, setOpenDate]   = useState("");
  const [duration, setDuration]   = useState(6);

  const handleAdd = () => {
    if (!name) return;
    let finalDate = expDate;
    if (inputMode === "duration") {
      if (!openDate) return;
      finalDate = addMonths(openDate, duration).toISOString().split("T")[0];
    }
    if (!finalDate) return;
    addProduct({ name, category, expDate: finalDate });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Nouveau produit</Text>

        <Text style={styles.label}>NOM DU PRODUIT</Text>
        <TextInput
          value={name} onChangeText={setName}
          placeholder="Ex: Crème solaire, Yaourt..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <Text style={styles.label}>CATÉGORIE</Text>
        <View style={styles.row}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <TouchableOpacity
              key={key}
              style={[styles.catBtn, category === key && { borderColor: cat.color, backgroundColor: cat.color + "22" }]}
              onPress={() => setCategory(key)}
            >
              <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
              <Text style={[styles.catLabel, { color: category === key ? cat.color : COLORS.muted }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>MODE DE SAISIE</Text>
        <View style={styles.row}>
          {[
            { key: "date",     label: "📅 Date exacte"            },
            { key: "duration", label: "⏳ Durée après ouverture"  },
          ].map(m => (
            <TouchableOpacity
              key={m.key}
              style={[styles.modeBtn, inputMode === m.key && styles.modeBtnActive]}
              onPress={() => setInputMode(m.key)}
            >
              <Text style={[styles.modeBtnText, inputMode === m.key && { color: COLORS.primary }]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {inputMode === "date" ? (
          <>
            <Text style={styles.label}>DATE D'EXPIRATION (AAAA-MM-JJ)</Text>
            <TextInput
              value={expDate} onChangeText={setExpDate}
              placeholder="2025-12-31"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              keyboardType="numeric"
            />
          </>
        ) : (
          <>
            <Text style={styles.label}>DATE D'OUVERTURE (AAAA-MM-JJ)</Text>
            <TextInput
              value={openDate} onChangeText={setOpenDate}
              placeholder="2025-06-01"
              placeholderTextColor={COLORS.muted}
              style={styles.input}
              keyboardType="numeric"
            />
            <Text style={styles.label}>DURÉE D'UTILISATION</Text>
            <View style={styles.row}>
              {DURATIONS.map(d => (
                <TouchableOpacity
                  key={d.months}
                  style={[styles.durBtn, duration === d.months && styles.durBtnActive]}
                  onPress={() => setDuration(d.months)}
                >
                  <Text style={[styles.durBtnText, duration === d.months && { color: COLORS.secondary }]}>
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
          <Text style={styles.submitText}>Ajouter le produit ✓</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.bg },
  container:     { padding: 24 },
  title:         { color: COLORS.text, fontSize: 22, fontWeight: "800", marginBottom: 24 },
  label:         { color: COLORS.muted, fontSize: 11, fontWeight: "700", letterSpacing: 0.8, marginBottom: 8, marginTop: 16 },
  input:         { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 12, color: COLORS.text, fontSize: 14 },
  row:           { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  catBtn:        { flex: 1, alignItems: "center", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  catLabel:      { fontSize: 10, marginTop: 4, fontWeight: "600" },
  modeBtn:       { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  modeBtnActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + "22" },
  modeBtnText:   { color: COLORS.muted, fontSize: 12, fontWeight: "600", textAlign: "center" },
  durBtn:        { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface },
  durBtnActive:  { borderColor: COLORS.secondary, backgroundColor: COLORS.secondary + "22" },
  durBtnText:    { color: COLORS.muted, fontWeight: "700", textAlign: "center" },
  submitBtn:     { marginTop: 32, backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  submitText:    { color: "white", fontWeight: "800", fontSize: 15 },
});