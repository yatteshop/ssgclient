import { useCategoryStore } from "../stores/Store"
import {useRouter} from "next/router"

export default function BanArticle() {
  
  const router = useRouter()
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
  const diriger = ()=>{
    setSelectedCategory(null)
    router.push("/produits")
  }
  
  return(
    <div className="BanArticle">
      <div className="BanArticleA">
        <p>Promo <span>-40%</span></p>
        <img src="infinix.png" alt="nix" className="BanArticleAphoneA" />
        <img src="phones.png" alt="phonse" className="BanArticleAphone" />
        <img src="rmb.png" alt="toto" className="totos"/>
      </div>
      <div className="BanArticleB" onClick={diriger}>
        <a href="#">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <p>voir plus...</p>
        </a>
      </div>
    </div>
  )
}