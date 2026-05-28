import { createClient }  from "@supabase/supabase-js";
import * as SecureStore  from "expo-secure-store";

const SUPABASE_URL  = "https://sb_publishable_efp6K5TzV2TOxgYsae86Vg_8Ih3moLw.supabase.co"; // ← remplace
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2aGdsbG9pdHVhaW54eGdjanVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDQ2MTMsImV4cCI6MjA5NTQ4MDYxM30.QWm6559NaoN0Xuo-L9vZaUuGP6s6ZyEEzthakNlvrQY"; // ← remplace

// Stockage sécurisé des tokens sur le téléphone
const ExpoSecureStoreAdapter = {
  getItem:    (key)        => SecureStore.getItemAsync(key),
  setItem:    (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key)        => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    storage:          ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: false,
  },
});