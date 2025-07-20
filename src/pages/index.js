import dynamic from "next/dynamic"
const Menu = dynamic(() => import('@/composants/Menu'), { ssr: false })

import DecathlonBanner from "@/composants/DecathlonBanner";
import AccueilSlide from "@/composants/AccueilSlide";
import Categorie from "@/composants/Categorie";
import BanArticle from "@/composants/BanArticle";
import SixProduit from "@/composants/SixProduit";
import Offre from "@/composants/Offre";
import SixOffre from "@/composants/SixOffre";
import Feu from "@/composants/Feu";
import BanArt from "@/composants/BanArt";
import LastOffre from "@/composants/LastOffre";
import Footer from "@/composants/Footer";
import Modal from "@/composants/Modal";

import { useModal } from "@/contextes/ModalContext";
import { useEffect } from "react";
import Head from 'next/head';

export async function getStaticProps() {
  try {
    const [resProduits, resCategories] = await Promise.all([
      fetch("https://yatteshop.pythonanywhere.com/api/shop/produit/"),
      fetch("https://yatteshop.pythonanywhere.com/api/shop/categorie/")
    ]);

    const [produits, categories] = await Promise.all([
      resProduits.json(),
      resCategories.json()
    ]);

    return {
      props: {
        produits,
        categories,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    return {
      props: {
        produits: [],
        categories: [],
      },
    };
  }
}

export default function Accueil({ produits, categories }) {
  const { showModal } = useModal();

  return (
    <div className="Accueil">
      <Head>
       <title>YATTE – Électroménagers à prix imbattables</title>
        <meta
           name="description"
           content="Qualité et prix imbattables sur nos électroménagers. Super Deals jusqu’à -40%. Large choix de TV dernière génération et plus encore."
        />
       <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://yatteshop.netlify.app/" />
      </Head>
      
      
      
      <DecathlonBanner />
      <Menu categories={categories} />
      {showModal ? <Modal /> : null}
      <AccueilSlide />
      <Categorie categories={categories} />
      <BanArticle />
      <SixProduit produits={produits} />
      <Offre />
      <SixOffre produits={produits} />
      <Feu produits={produits} />
      <BanArt />
      <LastOffre produits={produits} />
      <Footer />
    </div>
  );
}
