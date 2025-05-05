import { getCartProductFromLS } from "./getCartProducts"

export const cartProductTotal=()=>{

    let localCartProduct=getCartProductFromLS();

    let prodSubTotal= document.querySelector(".productSubTotal");
    let prodFinalTotal=document.querySelector(".productFinalTotal")

    let initalValue=0;
    let totalCartPrice=localCartProduct.reduce((accum,curProd)=>{

        let productPrice=parseInt(curProd.price) || 0;
        return accum + productPrice

    },initalValue)
    // console.log(totalCartPrice);

    prodSubTotal.textContent=`₹${totalCartPrice}`;
    prodFinalTotal.textContent=`₹${totalCartPrice+30}`
}