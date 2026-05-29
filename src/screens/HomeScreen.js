import React, { useState, useCallback } from "react";
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar
} from "react-native";
import { SafeAreaView }        from "react-native-safe-area-context";
import { useFocusEffect }      from "@react-navigation/native";
import { COLORS, CATEGORIES }  from "../constants";
import { useProducts }         from "../hooks/useProducts";
import { useAuth }             from "../hooks/useAuth";
import { getDaysLeft }         from "../utils/dates";
import ProductCard             from "../components/ProductCard";

export default function HomeScreen({ navigation, route, userId }) {
  const { products, loading, deleteProduct, fetchProducts } = useProducts(userId);
  const { signOut }   = useAuth();
  const [filter, setFilter] = useState("all");

 useFocusEffect(
  useCallback(() => {
    fetchProducts();
  }, [fetchProducts]) // ← dépend de fetchProducts et non de userId
);



  const alerts = products.filter(p => {
    const d = getDaysLeft(p.expDate);
    return d >= 0 && d <= 30;
  });

  const filtered = products
    .filter(p => filter === "all" || p.category === filter)
    .sort((a, b) => new Date(a.expDate) - new Date(b.expDate));

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>ExpiTrack</Text>
          <Text style={styles.subtitle}>
            {products.length} produit{products.length > 1 ? "s" : ""}
          </Text>
        </View>
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("Add", { userId })}
          >
            <Text style={styles.addBtnText}>+ Ajouter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
            <Text style={styles.signOutText}>↩</Text>
          </TouchableOpacity>
        </View>
      </View>

      {alerts.length > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>
            ⚠️ {alerts.length} produit{alerts.length > 1 ? "s expirent" : " expire"} bientôt
          </Text>
        </View>
      )}

      <View style={styles.filters}>
        <TouchableOpacity
          style={[styles.filterBtn, filter === "all" && styles.filterActive]}
          onPress={() => setFilter("all")}
        >
          <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
            Tous
          </Text>
        </TouchableOpacity>
        {Object.entries(CATEGORIES).map(([key, cat]) => (
          <TouchableOpacity
            key={key}
            style={[styles.filterBtn, filter === key && styles.filterActive]}
            onPress={() => setFilter(key)}
          >
            <Text style={[styles.filterText, filter === key && styles.filterTextActive]}>
              {cat.emoji}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onDelete={deleteProduct} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>Aucun produit</Text>
            <Text style={styles.emptySubText}>Appuie sur + Ajouter pour commencer</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:             { flex: 1, backgroundColor: COLORS.bg },
  header:           { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 24 },
  title:            { color: COLORS.text, fontSize: 28, fontWeight: "800", letterSpacing: -0.5 },
  subtitle:         { color: COLORS.muted, fontSize: 13, marginTop: 2 },
  headerBtns:       { flexDirection: "row", alignItems: "center", gap: 10 },
  addBtn:           { backgroundColor: COLORS.primary + "22", borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  addBtnText:       { color: COLORS.primary, fontWeight: "700", fontSize: 13 },
  signOutBtn:       { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9 },
  signOutText:      { color: COLORS.muted, fontSize: 16 },
  alertBanner:      { marginHorizontal: 24, marginBottom: 12, backgroundColor: "#2d2008", borderWidth: 1, borderColor: "#8b6820", borderRadius: 12, padding: 14 },
  alertText:        { color: "#ffd43b", fontWeight: "700", fontSize: 13 },
  filters:          { flexDirection: "row", paddingHorizontal: 24, gap: 8, marginBottom: 16 },
  filterBtn:        { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  filterActive:     { backgroundColor: COLORS.text, borderColor: COLORS.text },
  filterText:       { color: COLORS.muted, fontSize: 13, fontWeight: "600" },
  filterTextActive: { color: COLORS.bg },
  list:             { paddingHorizontal: 24, paddingBottom: 40 },
  empty:            { alignItems: "center", marginTop: 80 },
  emptyIcon:        { fontSize: 48, marginBottom: 12 },
  emptyText:        { color: COLORS.muted, fontSize: 16, fontWeight: "700" },
  emptySubText:     { color: COLORS.border, fontSize: 13, marginTop: 6 },
});