import { useRouter } from 'next/router'


function lepoint(amount) {
  return amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function SixOffre({ produits = [] }) {
  const router = useRouter()

  const data = produits.slice(4, 10) // prend 6 éléments (indices 4 à 9)

  const detailDirect = (id) => {
    router.push(`detail/${id}`) // navigation vers la page du produit (ex: /123)
  }

  return (
    <div className="SixOffre">
      {data.map(item => (
        <div key={item.id} className="SixOffreItem" onClick={() => detailDirect(item.id)}>
          <p>{item.name}</p>
          <img src={item.image} alt={item.name} />
          <p className="sixPrice">{lepoint(item.price)}f</p>
        </div>
      ))}
    </div>
  )
}
