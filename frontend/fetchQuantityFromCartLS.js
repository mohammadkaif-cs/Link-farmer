import { getCartProductFromLS } from "./getCartProducts"

export const fetchQuantityFromLs=(id,price) => {

    let localStorageData = getCartProductFromLS();

   let myNewData = localStorageData.find((curProd)=>curProd.id === id);
   let quantity=1;

   if(myNewData){
    quantity=myNewData.quantity;
    price=myNewData.price 
   }
       return {quantity,price}
}
