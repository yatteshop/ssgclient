import { useRouter } from "next/router";
import { useState } from "react";
import Cookies from "js-cookie";

import Menu from "@/composants/Menu";
import Burger from "@/composants/Burger";
import SearchBar from "@/composants/SearchBar";
import Modal from "@/composants/Modal";

import { ShoppingBasket, ShoppingCart, User, Search } from "lucide-react";
import { useCart } from "@/contextes/CartContext";
import { useAuth } from "@/contextes/AuthContext";
import { useCategoryStore } from "@/stores/Store";
import { useModal } from "@/contextes/ModalContext";


function formatAmountWithSeparators(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function Detail({ produitId, produit, categories }) {
  const { autentifier } = useAuth();
  const { showModal, setShowModal } = useModal();
  const [notifications, setNotifications] = useState([]);
  const [cat, setCat] = useState(categories);
  const [showMenu, setShowMenu] = useState(false);
  const [show, setShow] = useState(false);

  const router = useRouter();
  const { selectedCategory, setSelectedCategory } = useCategoryStore();
  const { panier, dispatch } = useCart();

  const ajouterNotification = () => {
    const newNotif = {
      id: Date.now(),
      message: "✓ un article a été ajouté au panier",
    };
    setNotifications((prev) => [...prev, newNotif]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
    }, 4000);
  };

  const choixCategorie = (nom) => {
    setSelectedCategory(nom);
    router.push("/produits");
  };

  const handleBuy = async (item) => {
    dispatch({ type: "ADD", payload: item });

    if (!autentifier) {
      let panierLocal = [];
      try {
        const cookie = Cookies.get("guest_cart");
        panierLocal = cookie ? JSON.parse(cookie) : [];
      } catch {
        panierLocal = [];
      }

      const exist = panierLocal.find((p) => p.id === item.id);
      if (exist) {
        panierLocal = panierLocal.map((p) =>
          p.id === item.id ? { ...p, quantiter: p.quantiter + 1 } : p
        );
      } else {
        panierLocal.push({ ...item, quantiter: 1 });
      }

      Cookies.set("guest_cart", JSON.stringify(panierLocal));
    } else {
      const token = Cookies.get("token");
      if (token) {
        try {
          const response = await fetch("https://yatteshop.pythonanywhere.com/api/shop/cart-items/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
            body: JSON.stringify({
              product: item.id,
              quantity: item.quantiter || 1,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            console.error("Erreur API panier :", errorData);
          }
        } catch (error) {
          console.error("Erreur réseau panier :", error.message);
        }
      }
    }

    ajouterNotification();
  };

  const displaySearch = () => setShow(!show);
  const gohome = () => router.push("/");
  const goClient = () => router.push("/client");

  return (
    <>
      <div className="detailMenu">
        <div className="DetailTitle">
          <Burger displayMenu={() => setShowMenu(!showMenu)} />
          <p onClick={gohome}>YATTE</p>
          <div className="Basket">
            <ShoppingBasket style={{ width: "20px", height: "20px", color: "white" }} />
          </div>
        </div>

        <div className="DetailRightTitle">
          <div className="DetailSearch">
            <Search onClick={displaySearch} />
          </div>
          <div className="user">
            {autentifier ? (
              <div className="authUser">
                <User onClick={goClient} />
              </div>
            ) : (
              <User onClick={() => setShowModal(!showModal)} />
            )}
          </div>
          <div className="cart">
            <ShoppingCart onClick={() => router.push("/panier")} />
            <p className={panier.length > 0 ? "cartP" : ""}>{panier.length || ""}</p>
          </div>

          <div className={showMenu ? "MenuVisible" : "MenuHide"}>
            <div className="MenuVisibleTitle" onClick={() => setSelectedCategory(null)}>
              Nos Catégories
            </div>
            <div className="visiblewcat">
              {cat.map((item) => (
                <div key={item.id} className="itemvisible" onClick={() => choixCategorie(item)}>
                  <p>{item.name}</p>
                </div>
              ))}
            </div>
          </div>
          {showModal && <Modal />}
        </div>
      </div>

      <div className="detailWrapper">
        {show && <SearchBar />}
        <br />
        <div>
          {produit ? (
            <div key={produit.id}>
              <div className="DetailH">
                <img src={produit.logo} alt={produit.name} />
                <p>
                  {Math.floor(((produit.price - produit.pribarrer) / produit.pribarrer) * 100)}%
                </p>
              </div>
              <div className="conImg">
                <div className="imgDetailWrapper">
                  <img src={produit.image} alt={produit.name} />
                  <img src={produit.image2} alt={produit.name} />
                  <img src={produit.image3} alt={produit.name} />
                </div>
              </div>
              <p className="DetailPrice">{formatAmountWithSeparators(produit.price)} FCFA</p>
              <p className="Detailprix">{formatAmountWithSeparators(produit.pribarrer)} FCFA</p>
              <p className="detaildes">{produit.description}</p>
              <div className="btnDetail" onClick={() => handleBuy(produit)}>
                ajouter au panier
              </div>
            </div>
          ) : (
            <p>Produit introuvable</p>
          )}
        </div>
      </div>
    </>
  );
}

// 🔽 Génération statique des routes
export async function getStaticPaths() {
  const res = await fetch("https://yatteshop.pythonanywhere.com/api/shop/produit/");
  const produits = await res.json();

  const paths = produits.map((prod) => ({
    params: { id: String(prod.id) },
  }));

  return {
    paths,
    fallback: false,
  };
}

// 🔽 Chargement des données produit + catégories
export async function getStaticProps({ params }) {
  const [resProduit, resCategories] = await Promise.all([
    fetch(`https://yatteshop.pythonanywhere.com/api/shop/produit/${params.id}/`),
    fetch("https://yatteshop.pythonanywhere.com/api/shop/categorie/")
  ]);

  const produit = await resProduit.json();
  const categories = await resCategories.json();

  return {
    props: {
      produitId: params.id,
      produit,
      categories,
    },
  };
}
