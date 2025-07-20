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
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';



export default function App({ Component, pageProps }) {
  return (
    <>
    <Head>
  <title>YATTE - CÔTE D'IVOIRE</title>
  <meta name="description" content="Découvrez nos articles chez YATTE. Qualité, style et livraison rapide." />
  <meta name="keywords" content="YATTE, boutique en ligne, Abidjan, Côte d'Ivoire" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta charSet="utf-8" />

  {/* Favicon/logo dans l’onglet */}
  <link rel="icon" href="/monlogo.png" type="image/png" />

  {/* Image pour les aperçus réseaux sociaux / Google */}
  <meta property="og:image" content="https://yatteshop.netlify.app/monlogo.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />

  {/* Déclaration du logo dans schema.org */}
  <script type="application/ld+json">
    {`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "YATTE",
        "url": "https://yatteshop.netlify.app",
        "logo": "https://yatteshop.netlify.app/monlogo.png"
      }
    `}
  </script>
</Head>



    <CartProvider>
    <ModalProvider>
    <AuthProvider>
    <OrderModalProvider>
      <Component {...pageProps} />
      <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{ zIndex: 999999999 }}
              />
    </OrderModalProvider>
    </AuthProvider>
    </ModalProvider>
    </CartProvider>
    </>
  )
  
}
