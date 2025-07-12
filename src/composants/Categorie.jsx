import { useCategoryStore } from "../stores/Store"
import {useRouter} from "next/router"

export default function Categorie({ categories=[] }) {
  
  const router = useRouter();
  
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
 const choixCategorie = (nom)=>{
    setSelectedCategory(nom)
    router.push("/produits")
  } 
  
  return (
    <div className="Categorie">
      {categories.map((item) => (
        <div key={item.id} className="CategorieItem" onClick={()=>choixCategorie(item)}>
          <img src={item.image} alt={item.name} />
          <div className="CategorieNom">{item.name}</div>
        </div>
      ))}
    </div>
  );
}
