import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Platform
} from "react-native";
import { SafeAreaView }          from "react-native-safe-area-context";
import DateTimePickerModal       from "react-native-modal-datetime-picker";
import { COLORS, CATEGORIES, DURATIONS } from "../constants";
import { addMonths, formatDate } from "../utils/dates";

export default function AddScreen({ navigation, route, userId }) {
  // ← addProduct vient directement de HomeScreen
  const addProduct = route.params?.addProduct;

  const [name, setName]           = useState("");
  const [category, setCategory]   = useState("alimentaire");
  const [inputMode, setInputMode] = useState("date");
  const [expDate, setExpDate]     = useState(null);
  const [openDate, setOpenDate]   = useState(null);
  const [duration, setDuration]   = useState(6);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerTarget, setPickerTarget]   = useState("exp");

  const openPicker = (target) => {
    setPickerTarget(target);
    setPickerVisible(true);
  };

  const handleDateConfirm = (date) => {
    setPickerVisible(false);
    if (pickerTarget === "exp") setExpDate(date);
    else setOpenDate(date);
  };

  const handleAdd = async () => {
    if (!name) return;
    let finalDate;
    if (inputMode === "date") {
      if (!expDate) return;
      finalDate = expDate.toISOString().split("T")[0];
    } else {
      if (!openDate) return;
      finalDate = addMonths(openDate, duration).toISOString().split("T")[0];
    }
    // ← appelle addProduct de HomeScreen directement
    await addProduct({ name, category, expDate: finalDate });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Nouveau produit</Text>
        </View>

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
            { key: "date",     label: "📅 Date exacte"           },
            { key: "duration", label: "⏳ Durée après ouverture" },
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
            <Text style={styles.label}>DATE D'EXPIRATION</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => openPicker("exp")}>
              <Text style={styles.dateBtnIcon}>📅</Text>
              <Text style={[styles.dateBtnText, !expDate && { color: COLORS.muted }]}>
                {expDate ? formatDate(expDate.toISOString()) : "Sélectionner une date"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.label}>DATE D'OUVERTURE</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={() => openPicker("open")}>
              <Text style={styles.dateBtnIcon}>📅</Text>
              <Text style={[styles.dateBtnText, !openDate && { color: COLORS.muted }]}>
                {openDate ? formatDate(openDate.toISOString()) : "Sélectionner une date"}
              </Text>
            </TouchableOpacity>

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

            {openDate && (
              <View style={styles.previewBox}>
                <Text style={styles.previewText}>
                  📆 Expire le {formatDate(addMonths(openDate, duration).toISOString())}
                </Text>
              </View>
            )}
          </>
        )}

        <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
          <Text style={styles.submitText}>Ajouter le produit ✓</Text>
        </TouchableOpacity>

      </ScrollView>

      <DateTimePickerModal
        isVisible={pickerVisible}
        mode="date"
        minimumDate={new Date()}
        onConfirm={handleDateConfirm}
        onCancel={() => setPickerVisible(false)}
        locale="fr_FR"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: COLORS.bg },
  container:     { padding: 24 },
  header:        { marginBottom: 24 },
  backBtn:       { marginBottom: 12 },
  backText:      { color: COLORS.muted, fontSize: 14 },
  title:         { color: COLORS.text, fontSize: 22, fontWeight: "800" },
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
  dateBtn:       { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, padding: 14 },
  dateBtnIcon:   { fontSize: 18 },
  dateBtnText:   { color: COLORS.text, fontSize: 14, fontWeight: "600" },
  previewBox:    { marginTop: 12, backgroundColor: "#102d18", borderWidth: 1, borderColor: "#208b38", borderRadius: 10, padding: 12 },
  previewText:   { color: "#69db7c", fontSize: 13, fontWeight: "600" },
  submitBtn:     { marginTop: 32, backgroundColor: COLORS.primary, borderRadius: 12, padding: 16, alignItems: "center" },
  submitText:    { color: "white", fontWeight: "800", fontSize: 15 },
});