"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  ShoppingBasket,
  ShoppingCart,
  User,
  Search,
  MoveLeft,
  AlignJustify,
} from "lucide-react";
import { useRouter } from "next/router";
import { useCart } from "@/contextes/CartContext";
import { useAuth } from "@/contextes/AuthContext";


function lepoint(amount) {
  if (amount == null || isNaN(Number(amount))) {
    return "0";
  }
  return Number(amount).toFixed(0);
}



function formatDate(dateString) {
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function datelivraison() {
  const today = new Date();
  const livraison = new Date(today);
  livraison.setDate(today.getDate() + 1);
  while (livraison.getDay() === 6 || livraison.getDay() === 0) {
    livraison.setDate(livraison.getDate() + 1);
  }
  return livraison.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

const truncateAfterGarantie = (text) => {
  const keyword = "garantie 12 mois";
  const idx = text.toLowerCase().indexOf(keyword);
  if (idx === -1) return text;
  return text.slice(0, idx + keyword.length) + "...";
};

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
  const [showHistory, setShowHistory] = useState(false);

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [itemsByOrder, setItemsByOrder] = useState({});
  const { dispatch } = useCart();
  const { setAutentifier } = useAuth();

  useEffect(() => {
    const t = Cookies.get("token");
    setToken(t || null);
    setMounted(true);
    if (!t) router.replace("/produits");
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        const headers = { Authorization: `Token ${token}` };

        const userRes = await fetch("https://yatteshop.pythonanywhere.com/api/auth/user/", { headers  });
        if (userRes.ok) setUser(await userRes.json());

        const orderRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/orders/", { headers });
        const orderData = orderRes.ok ? await orderRes.json() : [];
        setOrders(orderData);

        const itemsRes = await fetch("https://yatteshop.pythonanywhere.com/api/shop/order-items/", { headers });
        if (itemsRes.ok) {
          const itemsData = await itemsRes.json();
          const grouped = {};
          itemsData.forEach(item => {
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

  const deconnexion = () => {
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
    router.push("/");
  };

  if (!mounted) return null;

  const currentOrder = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

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
          <button onClick={deconnexion}>
            se déconnecter
          </button>
        </div>
      )}

      {/* Dernière commande */}
      { orders.length > 0 ?  <div>
      <div className="compteYatte">
        <span>votre compte yatte</span>

      </div>

      <div className="HeaderOrderEm">
        <MoveLeft className="MoveClEma" onClick={()=>router.push("/produits")} />
        <p>Détails de la commande</p>
      </div>

      <div className="InfoEm">
        {!currentOrder ? (
          <p>Vous n'avez pas de commande en cours.</p>
        ) : (
          <div>
            <div className="orderEma">
              <div><strong>Commande n° {currentOrder.id}</strong></div>
              <p> {itemsByOrder[currentOrder.id]?.length || 0} article</p>
            <p>Effectuée le {formatDate(currentOrder.created_at)}</p>

            <p>Total : {lepoint(currentOrder.total_price)} FCFA</p>
            </div>
            
            <div className="articleEma">Articles dans votre commande</div>
            <div className="produitsCommande">
              <div className="orderEmaT">
              <strong className="statusEma"> {getStatusLabel(currentOrder.status)}</strong>
              <p>Livraison prévue : {datelivraison()}</p>
              </div>
              {itemsByOrder[currentOrder.id]?.map((item) => (
                <div key={item.id} className="produitCommandema">
                  <img src={item.product_image || "/placeholder.jpg"} alt={item.product?.name || "Produit"} className="imgCommandeEma" />
                  <div className="texteProduit">
                    <p>{truncateAfterGarantie(item.product_description || "Pas de description")}</p>
                    <p>Quantité : {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="buyTema">
                paiement
              </div>
              {itemsByOrder[currentOrder.id]?.map((item, index) => (
                <div key={index} className="buyEm">
                  <div className="buyEmA">
                  <div>Mode de paiement</div>
                  <p>Payer cash à la livraison</p>
                  </div>
                  <div className="buyEmb">
                  <div>Détails du paiement</div>
                  <p>Sous-total: {lepoint(item.product_price)} FCFA</p>
                  <p>Frais de livraison: {lepoint(item.product_prix_livraison)} FCFA</p>
                  <p className="cmdEMA">Total : {lepoint(currentOrder.total_price)} FCFA</p>
                </div>
                </div>
              ))}
            </div>
            <div className="buyTema">
              livraison
            </div>
            <div className="buyEm">
              <div className="buyEmA">
              <div>Méthode de livraison</div>
              <p>Livraison à domicile</p>
              </div>
              <div className="buyEmb">
              <div>Détails d'expédition</div>
              <p>Livraison à domicile. Expédié par YATTE</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historique commandes */}
      <div className="HistoriqueCommandes">
        {orders.length > 1 ? <div className="hysto">
          <MoveLeft className="MoveClEma" onClick={()=>router.push("/produits")} />
          <p className="toggleHistorique" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Masquer l'historique" : "Voir l'historique complet"}
          </p>
        </div> : ""}
        
        {showHistory && (<div className="historiqueBloc">
          {orders.length > 1 ? (
            [...orders]
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .slice(1)
              .map((order) => (
                <div key={order.id} className="orderEma">
                  <p><strong>Commande n°{order.id}</strong></p>
                  <p>Date : {new Date(order.created_at).toLocaleDateString("fr-FR", {
                    weekday: "long", day: "numeric", month: "long", year: "numeric"
                  })}</p>
                  <p>Statut : {getStatusLabel(order.status)}</p>
                  <p>Articles : {itemsByOrder[order.id]?.length || 0}</p>
                  <p>Total : {order.total_price} FCFA</p>

                  <div className="produitsCommande">
                    {itemsByOrder[order.id]?.map((item) => (
                      <div key={item.id} className="produitCommande">
                        <img src={item.product_image || "/placeholder.jpg"} alt={item.product?.name || "Produit"} className="imgCommandeEma" />
                        <div className="texteProduit">
                          <p>{truncateAfterGarantie(item.product_description || "Pas de description")}</p>
                          <p>Quantité : {item.quantity}</p>
                          <p>Montant : {item.product_price} FCFA</p>
                          <p>Frais de livraison : {item.product_prix_livraison} FCFA</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
          ) : (
            <p>Aucune commande précédente.</p>
          )}
        </div>
        )}
      </div>
    </div> : ""}
    </div>
  );
}
