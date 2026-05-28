import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

// Comment afficher la notif quand l'app est ouverte
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge:  true,
  }),
});

// ─── 1. Demander la permission ───────────────────────────────────────────────
export async function requestPermissions() {
  if (!Device.isDevice) {
    alert("Les notifications nécessitent un vrai téléphone.");
    return false;
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Permission refusée. Active les notifications dans les réglages.");
    return false;
  }

  // Obligatoire sur Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("expiry-alerts", {
      name:             "Alertes d'expiration",
      importance:       Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor:       "#e8825a",
    });
  }

  return true;
}

// ─── 2. Planifier les 2 rappels pour un produit ──────────────────────────────
export async function scheduleProductNotifications(product) {
  const expDate = new Date(product.expDate);

  // Rappel 1 mois avant
  const oneMonthBefore = new Date(expDate);
  oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
  oneMonthBefore.setHours(9, 0, 0, 0); // 9h du matin

  // Rappel 1 semaine avant
  const oneWeekBefore = new Date(expDate);
  oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
  oneWeekBefore.setHours(9, 0, 0, 0);

  const ids = [];
  const now = new Date();

  // Planifie seulement si la date est dans le futur
  if (oneMonthBefore > now) {
    const id1 = await Notifications.scheduleNotificationAsync({
      content: {
        title: "📅 Expiration dans 1 mois",
        body:  `${product.name} expire le ${new Date(product.expDate).toLocaleDateString("fr-FR")}`,
        data:  { productId: product.id },
        sound: true,
      },
      trigger: {
        date:      oneMonthBefore,
        channelId: "expiry-alerts",
      },
    });
    ids.push(id1);
  }

  if (oneWeekBefore > now) {
    const id2 = await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Expiration dans 1 semaine !",
        body:  `${product.name} expire bientôt. Pense à l'utiliser !`,
        data:  { productId: product.id },
        sound: true,
      },
      trigger: {
        date:      oneWeekBefore,
        channelId: "expiry-alerts",
      },
    });
    ids.push(id2);
  }

  return ids; // on sauvegarde ces IDs pour pouvoir annuler plus tard
}

// ─── 3. Annuler les notifs d'un produit supprimé ─────────────────────────────
export async function cancelProductNotifications(notifIds = []) {
  for (const id of notifIds) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}

// ─── 4. Lister toutes les notifs planifiées (debug) ──────────────────────────
export async function listScheduledNotifications() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  console.log("Notifs planifiées:", all.length);
  return all;
}