import { User, ShoppingCart, Search, ShoppingBasket } from 'lucide-react';

export default BigMenu (){
  return(
    <div className="BigMenu">
      <div className ="BigMenuNom">
        YATTE
      </div>
      <form>
        <input type="search" placeholder="Cherchez un produit, une marque ou une categorie" />
        <button>Rechercher</button>
      </form>
      <div className="bigConnect">
        <User />
        <div>Se connecter</div>
      </div>
      
    </div>
  )
}