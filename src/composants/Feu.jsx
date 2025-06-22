
import { useRouter } from "next/router";

function lepoint(amount) {
  const safeAmount = Number(amount);
  if (isNaN(safeAmount)) return "0";
  return safeAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export default function Feu({ produits = [] }) {
  const router = useRouter();

  const data = produits.slice(6, 19);

  const directDetail = (id) => {
    router.push(`detail/${id}`);
  };

  return (
    <div className="Categoriels">
      {data.map((item) => (
        <div key={item.id} className="CategorieItemls" onClick={() => directDetail(item.id)}>
          <div className="CategoriePricels">{item.name}</div>
          <img src={item.image} alt={item.name} />
          <div className="CategorieNomls">{lepoint(item.price)}f</div>
        </div>
      ))}
    </div>
  );
}
