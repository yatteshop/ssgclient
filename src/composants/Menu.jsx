"use client"

import Cookies from "js-cookie"
import Burger from "./Burger"
import {useRouter} from "next/router"
import { User, ShoppingCart, Search, ShoppingBasket } from 'lucide-react';

import {useState, useEffect} from "react"
import SearchBar from "./SearchBar"
import { useCategoryStore } from "../stores/Store"
import { useCart} from "@/contextes/CartContext"
import { useModal } from "@/contextes/ModalContext"
import { useAuth } from "@/contextes/AuthContext"
import client from "@/pages/client"


export default function Menu({categories = []}){
  
  const router = useRouter();
  
  const [commande, setCommande] = useState()
  
  
  const { fetchPanier } = useCart();
  
  const { dispatch } = useCart();
  
  const {autentifier, setAutentifier} = useAuth()
  
  
  const { showModal, setShowModal } = useModal()
  
  const {panier} = useCart()
  
  const [cat, setCat] = useState([])
  
  const [showMenu, setShowMenu] = useState(false)
  
  
  const displayMenu = ()=>{
    setShowMenu(!showMenu)
  }
  
  const {selectedCategory, setSelectedCategory} = useCategoryStore()
  

  const choixCategorie = (nom)=>{
    setSelectedCategory(nom)
    router.push("/produits")
  }
  
  const displayModal = ()=>{
    setShowModal(!showModal)
  }
  
  const goCart = ()=>{
    router.push("/panier")
  }
  
  const deconnexion = ()=>{
    Cookies.remove("token");
    Cookies.remove("autentifier");
    setAutentifier(false);
    dispatch({ type: "CLEAR" });
  }
  
 
 const goClient = ()=>{
   router.push('/client')
 }

  
  
  useEffect(() => {
    if (autentifier) {
      fetchPanier();
    }
  }, [autentifier]);
  
  
  return(
    <div className="MenuContainer">
    <div className="MenuWrapper">
    <div className="Menu">
      <div className="MenuLeft">
        <Burger displayMenu={displayMenu} />
        <div className="title" onClick={()=>router.push("/")}>
          yatte<div className="Basket"><ShoppingBasket style={{
            width:"20px",
            height:"20px",
            color:"white",
            display:"flex",
          }} /></div>
        </div>
      </div>
      <div className="MenuRight">
        <div className="user">
          {autentifier ? <div className="authUser"><User onClick={goClient} /></div> : <User onClick={displayModal} />}
        </div>
        <div className="cart" onClick={goCart}>
          <ShoppingCart className="AnimShop" />
          <p className={panier.length >0 ? "cartP" : ""}>{panier.length >0 ? panier.length : ""}</p>
        </div>
      </div>
      <div className={showMenu ? "MenuVidible" : "MenuHide"}>
        <div className="MenuVisibleTitle" onClick={()=>setSelectedCategory(null)}>
          Nos Catégories
        </div>
        <div className="visiblewcat">
          {categories.map(item=>{
            return(
              <div key={item.id} className="itemvisible" onClick={()=>choixCategorie(item)}>
                <p>{item.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
      <SearchBar />
    </div>
    <div className="fmenu">
      <span className="phoneSms">Commandez par appel au : </span>  <span className="phoneNumber" >07-67-74-37-32</span>
    </div>
    </div>
  )
}