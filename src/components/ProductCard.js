import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS, CATEGORIES } from "../constants";
import { getDaysLeft, getStatus, formatDate } from "../utils/dates";

const STATUS_CONFIG = {
  expired:  { bg: "#2d1010", border: "#8b2020", text: "#ff6b6b", label: "Expiré"       },
  critical: { bg: "#2d1a10", border: "#8b4820", text: "#ff9f43", label: "j restants"   },
  warning:  { bg: "#2d2a10", border: "#8b7820", text: "#ffd43b", label: "j restants"   },
  ok:       { bg: "#102d18", border: "#208b38", text: "#69db7c", label: "j restants"   },
};

export default function ProductCard({ product, onDelete }) {
  const days   = getDaysLeft(product.expDate);
  const status = getStatus(days);
  const cat    = CATEGORIES[product.category];
  const sc     = STATUS_CONFIG[status];

  return (
    <View style={[styles.card, { borderColor: sc.border }]}>
      {/* Icône catégorie */}
      <View style={[styles.icon, { backgroundColor: cat.color + "22" }]}>
        <Text style={{ fontSize: 20 }}>{cat.emoji}</Text>
      </View>

      {/* Infos */}
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.date}>Expire le {formatDate(product.expDate)}</Text>
      </View>

      {/* Badge statut */}
      <View style={[styles.badge, { backgroundColor: sc.bg, borderColor: sc.border }]}>
        <Text style={[styles.badgeText, { color: sc.text }]}>
          {status === "expired" ? "Expiré" : `${days}j`}
        </Text>
      </View>

      {/* Supprimer */}
      <TouchableOpacity onPress={() => onDelete(product.id)} style={styles.del}>
        <Text style={{ color: COLORS.muted, fontSize: 16 }}>✕</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderRadius: 12,
    padding: 14, marginBottom: 10, gap: 12,
  },
  icon: {
    width: 42, height: 42, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  info:      { flex: 1 },
  name:      { color: COLORS.text, fontWeight: "700", fontSize: 14, marginBottom: 3 },
  date:      { color: COLORS.muted, fontSize: 11 },
  badge: {
    borderWidth: 1, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  del:       { padding: 4 },
});