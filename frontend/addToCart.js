import { getCartProductFromLS } from "./getCartProducts";
import { updateCartValue } from "./updateCartValue";


getCartProductFromLS()

export const addToCart=(event,id,stock)=>{
    let arrLocalStorageProduct=getCartProductFromLS();
    let curCardElem=document.querySelector(`#card${id}`)
    // console.log(curCardElem);
    let quantity=curCardElem.querySelector(".productQuantity").textContent;
    let price=curCardElem.querySelector(".productPrice").textContent;
    price=price.replace("₹","")

   let existingProduct=arrLocalStorageProduct.find((curProd)=>curProd.id === id)
    
    if(existingProduct && quantity > 1){
        quantity=Number(existingProduct.quantity) + Number(quantity)
        price=Math.floor(Number(price*quantity))
        let updatedCart={id,quantity,price};

        updatedCart= arrLocalStorageProduct.map((curProd)=>{
            return curProd.id === id ? updatedCart : curProd;
        });
        localStorage.setItem("cartProductMine",JSON.stringify(updatedCart));

        
    }

    if(existingProduct){
        // alert("the product is already available")
        return false
    }
    price=Math.floor(Number(price*quantity));
    quantity=Number(quantity);



    arrLocalStorageProduct.push({id,quantity,price})
    localStorage.setItem("cartProductMine",JSON.stringify(arrLocalStorageProduct));

    updateCartValue(arrLocalStorageProduct)



    price=price*quantity;
    // console.log(quantity,price)
}
