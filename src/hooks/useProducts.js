import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import {
  scheduleProductNotifications,
  cancelProductNotifications,
} from "../utils/notifications";

export function useProducts(userId) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchProducts();
  }, [userId]);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("exp_date", { ascending: true });

    if (error) console.error("Fetch error:", error);
    else setProducts(data.map(formatFromDB));
    setLoading(false);
  };

  const addProduct = async (product) => {
    // Récupère le user directement depuis Supabase — plus fiable
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;

    console.log("userId prop:", userId);
    console.log("userId Supabase:", currentUserId);

    if (!currentUserId) {
      console.error("Pas d'utilisateur connecté");
      return;
    }

    const newProduct = {
      ...product,
      addedAt: new Date().toISOString(),
      notifIds: [],
    };

    const notifIds = await scheduleProductNotifications({
      ...newProduct,
      expDate: product.expDate,
    });
    newProduct.notifIds = notifIds;

    const { data, error } = await supabase
      .from("products")
      .insert(formatToDB(newProduct, currentUserId))
      .select()
      .single();

    if (error) { console.error("Insert error:", error); return; }
    setProducts(prev => [...prev, formatFromDB(data)]);
    return formatFromDB(data);
  };

  const deleteProduct = async (id) => {
    const product = products.find(p => p.id === id);
    if (product?.notifIds?.length) {
      await cancelProductNotifications(product.notifIds);
    }
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) { console.error("Delete error:", error); return; }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return { products, loading, addProduct, deleteProduct, fetchProducts };
}

function formatToDB(p, userId) {
  return {
    user_id:  userId,
    name:     p.name,
    category: p.category,
    exp_date: p.expDate,
    notif_ids: p.notifIds,
    added_at: p.addedAt,
  };
}

function formatFromDB(p) {
  return {
    id:       p.id,
    name:     p.name,
    category: p.category,
    expDate:  p.exp_date,
    notifIds: p.notif_ids || [],
    addedAt:  p.added_at,
  };
}