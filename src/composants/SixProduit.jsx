import { useRouter } from 'next/router';


function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function SixProduit({ produits = [] }) {
  const router = useRouter();

  // Les 4 derniers produits (du bas de la liste)
  const derniersProduits = produits.slice(-6);

  const detailRoot = (id) => {
    router.push(`detail/${id}`);
  };

  return (
    <div className="SixProduit">
      {derniersProduits.map((item) => (
        <div key={item.id} className="sixItem">
          <div className="sixWrapper" onClick={() => detailRoot(item.id)}>
            <p>{item.name}</p>
            <img src={item.image} alt={item.name} />
            <div className="sixPrice">
              <p>{lepoint(item.price)}f</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
