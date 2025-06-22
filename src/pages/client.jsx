"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  Search,
  BookOpen,
  MoveLeft,
  AlignJustify,
} from "lucide-react";
import { useRouter } from "next/router";
import { useCart } from "@/contextes/CartContext";
import { useAuth } from "@/contextes/AuthContext";


// Fonction pour tronquer le texte après "garantie 12 mois"
const truncateAfterGarantie = (text) => {
  const keyword = "garantie 12 mois";
  const idx = text.toLowerCase().indexOf(keyword);
  if (idx === -1) return text;
  return text.slice(0, idx + keyword.length) + "...";
};

// Fonction pour obtenir le label du statut
const getStatusLabel = (status) => {
  switch (status) {
    case "P":
      return "En cours de livraison";
    case "C":
      return "Livré";
    case "F":
      return "Échoué";
    default:
      return "Inconnu";
  }
};

export default function Client() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const { dispatch } = useCart();
  const { setAutentifier } = useAuth();

  // Chargement initial du token et redirection
  useEffect(() => {
    const t = Cookies.get("token");
    setToken(t || null);
    setMounted(true);
    if (!t) {
      router.replace("/produits");
    }
  }, []);

  // Récupération des données utilisateur, commandes et articles
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Token ${token}` };

        // Récupération utilisateur
        const userRes = await fetch("https://yatteshop.pythonanywhere.com/api/auth/user/", { headers });
        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        }

        // Récupération commandes
        const orderRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/orders/", { headers });
        const orderData = orderRes.ok ? await orderRes.json() : [];
        setOrders(orderData);

        // Récupération items
        const itemsRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/order-items/", { headers });
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          const grouped = {};
          itemsData.forEach((item) => {
            const orderId = item.order;
            if (!grouped[orderId]) grouped[orderId] = [];
            grouped[orderId].push(item);
          });
          setItemsByOrder(grouped);
        }
      } catch (error) {
        console.error("Erreur de récupération :", error);
      }
    };

    fetchData();
  }, [token]);

  // Déconnexion utilisateur
  const deconnexion = () => {
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
    router.push("/");
  };

  // Attendre que ce soit monté côté client
  if (!mounted) return null;

  return (
    <div className="ClientOrder">
      {/* Menu */}
      <div className="detailMenu">
        <div className="DetailTitle">
          <AlignJustify className="AlignJustify" />
          <p onClick={() => router.push("/")}>YATTE</p>
          <div className="Basket">
            <ShoppingBasket style={{ width: 20, height: 20, color: "white" }} />
          </div>
        </div>
        <div className="DetailRightTitle">
          <div className="DetailSearch cltSearch"><Search /></div>
          <div className="user cltUser"><User /></div>
          <div className="cart cltCart"><ShoppingCart /></div>
        </div>
      </div>

      {/* Infos utilisateur */}
      {user && (
        <div className="idClient">
          Bonjour, <span>{user.last_name}</span>&nbsp;
          <span>{user.first_name}</span><br />
          <p>{user.email}</p>
        </div>
      )}

      {/* Historique */}
      <div className="compteYatte">
        <span>votre compte yatte</span>
        <label htmlFor="toggle-orders" className="toggleHistorique">Historique</label>
      </div>

      <input type="checkbox" id="toggle-orders" hidden />
      <div className="contentCompte2">
        {orders.length === 0 ? (
          <div className="clientWrapper">
            <div className="clientTitle">Vos commandes</div>
            <div className="clientNotif">
              <BookOpen className="BookOpen" />
              <p>vous n'avez pas encore de commande</p>
            </div>
          </div>
        ) : (
          <>
            <div className="clientTitle">Vos commandes</div>
            {orders.map((order) => (
              <div key={order.id} className="orderCard">
                <div className="clientHeader" style={{ fontSize: "0.75rem" }}>
                  <p>Commande n°{order.id}</p>
                  <p><span>Total :</span> {order.total_price.toLocaleString()} FCFA</p>
                </div>
                <OrderItems items={itemsByOrder[order.id] || []} />
                <p className="clientLabel">
                  <span>Statut de la commande :</span> {getStatusLabel(order.status)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Boutons */}
      <div className="wrapperclientBTN">
        <div className="clientBTN" onClick={() => router.push("/produits")}>
          <MoveLeft className="MoveLeft" />
          <p>continuer votre shopping</p>
        </div>
      </div>

      <div className="btnlogout" onClick={deconnexion}>se déconnecter</div>
    </div>
  );
}

// --- Composant enfant ---
function OrderItems({ items }) {
  return (
    <div className="itemsList">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="itemCard"
          style={{
            borderBottom: index !== items.length - 1 ? "1px solid #e0e0e0" : "none",
            paddingBottom: "10px",
            marginBottom: "10px",
          }}
        >
          {item.image ? (
            <img src={item.image} alt={item.description || item.name} />
          ) : (
            <div className="placeholder-img">Pas d’image</div>
          )}
          <div className="itemInfo">
            {item.description ? (
              <p>{truncateAfterGarantie(item.description)}</p>
            ) : (
              <p className="no-description">Pas de description disponible</p>
            )}
            <p>Quantité : {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
