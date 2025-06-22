import { useRouter } from 'next/router';


function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function LastOffre({ produits=[] }) {
  const router = useRouter();

  const data = produits.slice(2, 14); // prends 12 articles

  const detailDir = (id) => {
    router.push(`detail/${id}`);
  };

  return (
    <div style={{ margin: "5px 0" }}>
      <div className="SixOffre">
        {data.map((item) => (
          <div key={item.id} className="SixOffreItem" onClick={() => detailDir(item.id)}>
            <p>{item.name}</p>
            <img src={item.image} alt={item.name} />
            <p className="sixPrice">{lepoint(item.price)}f</p>
          </div>
        ))}
      </div>
    </div>
  );
}
