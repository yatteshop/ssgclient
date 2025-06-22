

export default function Categorie({ categories=[] }) {
  return (
    <div className="Categorie">
      {categories.map((item) => (
        <div key={item.id} className="CategorieItem">
          <img src={item.image} alt={item.name} />
          <div className="CategorieNom">{item.name}</div>
        </div>
      ))}
    </div>
  );
}
