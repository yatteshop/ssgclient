import Categorie from "@/composants/Categorie";
import SixOffre from "@/composants/SixOffre";
import SixProduit from "@/composants/SixProduit";
import LastOffre from "@/composants/LastOffre";
import Feu from "@/composants/Feu";
import Menu from "@/composants/Menu";
import ForProduits from "@/pages/Produits"


export async function getStaticProps() {
  const [resProduits, resCategories] = await Promise.all([
    fetch("https://yatteshop.pythonanywhere.com/api/shop/produit/"),
    fetch("https://yatteshop.pythonanywhere.com/api/shop/categorie/"),
  ]);

  const [produits, categories] = await Promise.all([
    resProduits.json(),
    resCategories.json(),
  ]);

  return {
    props: {
      produits,
      categories,
    },
    //revalidate: 3600, 
  };
}

export default function Donnees({ produits, categories }) {
  return (
    <>
      <SixOffre produits={produits} />
      <SixProduit produits={produits} />
      <LastOffre produits={produits} />
      <Categorie categories={categories} />
      <Feu produits={produits} />
      <Menu categories={categories} />
    </>
  );
}
