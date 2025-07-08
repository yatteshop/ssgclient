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
      <ForProduits produits={produits} categories={categories} />
    </div>
  );
}
