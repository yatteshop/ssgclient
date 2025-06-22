import { useCart } from "@/contextes/CartContext";
import { useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

import Burger from "@/composants/Burger";
import Modal from "@/composants/Modal";
import OrderModal from "@/composants/OrderModal";

import {
  Plus, Trash2, Minus, Search, User,
  ShoppingBasket, Phone, Check, ShoppingCart
} from "lucide-react";

import { useModal } from "@/contextes/ModalContext";
import { useAuth } from "@/contextes/AuthContext";
import { useOrderModal } from "@/contextes/OrderModalContext";
import { useCategoryStore } from "@/stores/Store";


function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function tronquerSansCouperMot(texte, maxLongueur = 25) {
  if (texte.length <= maxLongueur) return texte;
  const mots = texte.split(" ");
  let resultat = "";
  for (let mot of mots) {
    if ((resultat + " " + mot).trim().length > maxLongueur) break;
    resultat += (resultat ? " " : "") + mot;
  }
  return resultat.trim();
}

export default function Cart({ categories, suggestions }) {
  const { panier, handlePlus, handleMoins, removeItem, fetchPanier } = useCart();
  const { autentifier } = useAuth();
  const { showModal, setShowModal } = useModal();
  const { showOrderModal, setShowOrderModal } = useOrderModal();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();

  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const somme = panier.reduce((total, item) => total + item.price * item.quantiter, 0);

  const choixCategorie = (nom) => {
    setSelectedCategory(nom);
    router.push("/produits");
  };

  const order = () => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/commande");
    } else {
      setShowOrderModal(true);
    }
  };

  const handleUser = () => {
    const token = Cookies.get("token");
    if (token) {
      router.push("/client");
    } else {
      setShowModal(true);
    }
  };

  const detailDirect = (id) => {
    router.push(`/${id}`);
  };

  return (
    <div>
      <div className="cartWrapp">
        <div className="detailMenu">
          <div className="DetailTitle">
            <Burger displayMenu={() => setShowMenu(!showMenu)} />
            <p onClick={() => router.push("/")}>YATTE</p>
            <div className="Basket">
              <ShoppingBasket style={{ width: "20px", height: "20px", color: "white" }} />
            </div>
          </div>

          <div className="DetailRightTitle">
            <div className="DetailSearch Cartperso">
              <Search className="SearchCart" />
            </div>
            <div className="user">
              <User onClick={handleUser} />
            </div>
            <div className="cart">
              <ShoppingCart />
              <p className={panier.length > 0 ? "cartP" : ""}>{panier.length || ""}</p>
            </div>

            <div className={showMenu ? "MenuVisible" : "MenuHide"}>
              <div className="MenuVisibleTitle" onClick={() => setSelectedCategory(null)}>
                Nos Catégories
              </div>
              <div className="visiblewcat">
                {categories.map((item) => (
                  <div key={item.id} className="itemvisible" onClick={() => choixCategorie(item)}>
                    <p>{item.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="Cart">
          <p className="CartTitlea">Résumé du panier</p>
          <div className="totalCart">
            <p>Montant total</p>
            <p className="Cartprix"><strong>{lepoint(somme)}</strong> FCFA</p>
          </div>
          <div className="subtotalCart">
            <Check className="Check" />
            <p>Expédition rapide et sécurisée – service client dédié à chaque commande</p>
          </div>

          <div className="CartBody">
            <p className="CartTitlea">panier ({panier.length})</p>
            {panier.length > 0 ? (
              <div>
                {panier.map((item) => (
                  <div key={item.id} className="WrapTenu">
                    <div className="CARTIMG">
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className="CartDes">
                      <p>{item.description.split(" ").slice(0, 16).join(" ")}</p>
                      <div className="CartCount">
                        <div className="wraTrash" onClick={() => removeItem(item.id)}>
                          <Trash2 className="Trash" />
                          <span style={{ fontSize: "0.82rem", color: "rgb(255,100,0)", fontFamily: "Times New Roman" }}>
                            Supprimer
                          </span>
                        </div>
                        <div className="countSite">
                          <Plus className="Plus" onClick={() => handlePlus(item.id)} />
                          {item.quantiter}
                          <Minus className="Minus" onClick={() => handleMoins(item.id)} />
                        </div>
                      </div>
                      <div><strong>{lepoint(item.quantiter * item.price)}</strong> FCFA</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty">
                <img src="anew.png" alt="anew" />
                <p>votre panier est vide</p>
              </div>
            )}
          </div>
        </div>

        <div className="CartOrder">
          {panier.length > 0 ? (
            <div className="wrapperCartOrder">
              <Phone className="CartPhone" />
              <div className="btnCartOrder" onClick={order}>
                Commander ({lepoint(somme)} FCFA)
              </div>
            </div>
          ) : (
            <div className="shopsuite">
              <p onClick={() => router.push("/produits")}>continuer votre shopping</p>
            </div>
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="suggestions-section">
            <p className="CartTitlea" style={{ color: "#0d0d82" }}>Vous aimerez aussi :</p>
            <div className="suggestions-list">
              {suggestions.map((prod) => (
                <div key={prod.id} className="suggestion-item">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{ maxWidth: "128px", maxHeight: "128px" }}
                    onClick={() => detailDirect(prod.id)}
                  />
                  <p>{tronquerSansCouperMot(prod.description)}</p>
                  <p>{lepoint(prod.price)} FCFA</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && <Modal />}
      {showOrderModal && <OrderModal />}
    </div>
  );
}

// ✅ Chargement des catégories et suggestions à la build
export async function getStaticProps() {
  const [catRes, prodRes] = await Promise.all([
    fetch("https://yatteshop.pythonanywhere.com/api/shop/categorie/"),
    fetch("https://yatteshop.pythonanywhere.com/api/shop/produit/"),
  ]);

  const categories = await catRes.json();
  const produits = await prodRes.json();

  const suggestions = produits.sort(() => 0.5 - Math.random()).slice(0, 12);

  return {
    props: {
      categories,
      suggestions,
    },
  };
}
