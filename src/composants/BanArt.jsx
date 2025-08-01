import { useRouter } from "next/router"
import { useCategoryStore } from "../stores/Store"

export default function BanArt() {
  
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
  const router = useRouter()
  
  const diriger = ()=>{
    setSelectedCategory(null)
    router.push("/produits")
  }
  
  return(
    <div className="BanArticle">
      <div className="BanArticleA">
        <p>Promo <span>-60%</span></p>
        <img src="redmi.png" alt="nix" className="BanArticleAphoneA" />
        <img src="tyl.png" alt="phonse" className="BanArticleAphone" />
        <img src="mika3.png" alt="toto" className="totos"/>
      </div>
      <div className="BanArticleB" onClick={diriger}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <p>voir plus</p>
        </a>
      </div>
    </div>
  )
}