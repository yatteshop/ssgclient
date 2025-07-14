import {useRouter} from "next/router"
import { useCategoryStore } from "../stores/Store"

export default function Offre(){
  
  const router= useRouter()
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  
  const diriger = ()=>{
    setSelectedCategory(null)
    router.push( "/produits")
  }
  
  return(
    <div style={{
      marginBottom:"5px",
    }}>
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
    </div>
  )
}