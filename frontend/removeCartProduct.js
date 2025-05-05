import { getCartProductFromLS } from "./getCartProducts"
import { updateCartValue } from "./updateCartValue";

export const removeCartProduct =(id)=>{

    let cartProduct=getCartProductFromLS();
    let newCartProduct = cartProduct.filter((curProd)=> curProd.id !== id )

    // removeCartProduct()

    localStorage.setItem("cartProductMine",JSON.stringify(newCartProduct));

    let removeDiv = document.getElementById(`card${id}`)

    if(removeDiv){
        removeDiv.remove();

    }
    updateCartValue(newCartProduct)

   

}
