export const placeOrder=()=>{
      document.getElementById("placeOrderButton").addEventListener("click",(event)=>{
        // alert("Order Placed")
        const token = localStorage.getItem("token")
        const cartProduct=localStorage.getItem("cartProductMine")
        if(!cartProduct){
          alert("Cart is empty")
          window.location.href="./products.html"
        
        }
        else if(token){
          window.location.href="./continuetopayment.html"
        }
        else{
          window.location.href="./login.html"
        }
      })
}