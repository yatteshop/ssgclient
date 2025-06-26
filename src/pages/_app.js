import "@/styles/globals.css";
import "@/auth/Connexion.css";
import "@/auth/Inscription.css";
import "@/composants/AccueilSlide.css";
import "@/composants/BanArticle.css";
import "@/composants/BannerA.css";
import "@/composants/BannerB.css";
import "@/composants/BannerC.css";
import "@/composants/BannerD.css";
import "@/composants/BannerE.css";
import "@/composants/Burger.css";
import "@/composants/Categorie.css"
import "@/composants/DecathlonBanner.css";
import "@/composants/Feu.css";
import "@/composants/Footer.css";
import "@/composants/Menu.css";
import "@/composants/Modal.css";
import "@/composants/SearchBar.css";
import "@/composants/SixOffre.css";
import "@/composants/SixProduit.css";
import "@/composants/Produit.css"
import "@/composants/Produits.css";
import "@/composants/Detail.css"
import "@/composants/Cart.css"
import '@/composants/Client.css'
import '@/composants/Order.css'
import '@/composants/Notif.css'

import { ModalProvider } from "@/contextes/ModalContext";
import { AuthProvider } from "@/contextes/AuthContext"
import { CartProvider } from "@/contextes/CartContext"
import { OrderModalProvider } from "@/contextes/OrderModalContext"
import Head from 'next/head'


export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
      <link rel="icon" href="/monlogo.png" type="image/png" />
    </Head>

    <CartProvider>
    <ModalProvider>
    <AuthProvider>
    <OrderModalProvider>
      <Component {...pageProps} />
    </OrderModalProvider>
    </AuthProvider>
    </ModalProvider>
    </CartProvider>
    </>
  )
  
}
