import { User, ShoppingCart, Search, ShoppingBasket } from 'lucide-react';

export default function BigMenu (){
  return(
    <div className="BigMenu">
      <div className ="BigMenuNom">
        YATTE
        <ShoppingBasket />
      </div>
      <div className="bigSearch">
        <form>
        <input type="search" placeholder="Cherchez un produit, une marque ou une categorie" />
        <button>Rechercher</button>
        </form>
      </div>
      
      <div className="bigConnect">
        <User />
        <div>Se connecter</div>
      </div>
      <div className="bigCart">
        <ShoppingCart />
        <div>Panier</div>
      </div>
      
    </div>
  )
}