import Head from 'next/head';
import dynamic from 'next/dynamic';
const ForProduits = dynamic(() => import('@/composants/ForProduits'), {
  ssr: false,
});

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
  };
}

export default function Produits({ produits, categories }) {
  return (
    <div>
      <Head>
        <title>Produits – YATTE</title>
        <meta name="description" content="Parcourez tous nos produits électroménagers, TV, accessoires et bien plus chez YATTE. Livraison rapide à Abidjan." />
        <link rel="canonical" href="https://yatteshop.netlify.app/produits" />
      </Head>

      <ForProduits produits={produits} categories={categories} />
    </div>
  );
}
