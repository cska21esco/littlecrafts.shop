const products={
'white-daisy':{name:'White Daisy Jar',price:15,type:'jar',weight:3},
'pink-floral':{name:'Pink Floral Jar',price:15,type:'jar',weight:3},
'blue-painted':{name:'Blue Painted Jar',price:15,type:'jar',weight:3},
'lemon-slice':{name:'Lemon Slice',price:12,type:'art',weight:1.5},
'galaxy':{name:'Galaxy',price:12,type:'art',weight:1.5},
'hand-painted-candle':{name:'Hand-Painted Candle',price:18,type:'candle',weight:4}
};
const SUPPLIES_FEE=3;
let cart=[],shipping=null,shippingZip='';
function subtotal(){return cart.reduce((a,id)=>a+products[id].price,0)}
function packedWeight(){return cart.reduce((a,id)=>a+products[id].weight,0)}
function regionForZip(zip){
 const n=Number(zip);
 if(n>=90000&&n<=96199)return 1;
 if((n>=97000&&n<=97999)||(n>=98000&&n<=99499)||(n>=89000&&n<=89899)||(n>=85000&&n<=86999))return 2;
 if((n>=80000&&n<=84999)||(n>=87000&&n<=88999)||(n>=59000&&n<=59999)||(n>=83000&&n<=83899)||(n>=84000&&n<=84799))return 3;
 if((n>=50000&&n<=58999)||(n>=60000&&n<=69999)||(n>=70000&&n<=79999))return 4;
 return 5;
}
function estimateShipping(zip){
 const region=regionForZip(zip),w=packedWeight();
 if(!w)return 0;
 const base=[0,6.75,7.75,8.75,9.75,10.75][region];
 const perLb=[0,0.85,1.05,1.25,1.45,1.65][region];
 return Math.round((base+Math.max(0,w-1)*perLb)*100)/100;
}
window.add=(id)=>{
 if(cart.includes(id)){alert('This is a one-of-a-kind piece and is already in your cart.');return}
 cart.push(id);shipping=null;render();document.querySelector('#cart').classList.add('open');
};
window.removeItem=(i)=>{cart.splice(i,1);shipping=null;render()};
function render(){
 document.querySelector('#cartCount').textContent=cart.length;
 document.querySelector('#items').innerHTML=cart.length
  ?cart.map((id,i)=>`<p><strong>${products[id].name}</strong> — $${products[id].price.toFixed(2)} <button onclick="removeItem(${i})">remove</button></p>`).join('')
  :'<p>Your cart is empty.</p>';
 const sub=subtotal();
 document.querySelector('#subtotal').textContent=sub.toFixed(2);
 document.querySelector('#shippingDisplay').textContent=shipping===null?'—':'$'+shipping.toFixed(2);
 document.querySelector('#suppliesDisplay').textContent=shipping===null?'—':'$'+SUPPLIES_FEE.toFixed(2);
 document.querySelector('#total').textContent=(sub+(shipping===null?0:shipping+SUPPLIES_FEE)).toFixed(2);
 document.querySelector('#paypal').disabled=!cart.length||shipping===null;
}
document.querySelector('#calcShipping').onclick=()=>{
 const zip=document.querySelector('#shipZip').value.trim();
 const msg=document.querySelector('#shippingMsg');
 if(!/^\d{5}$/.test(zip)){shipping=null;msg.textContent='Please enter a valid 5-digit U.S. ZIP code.';render();return}
 shippingZip=zip;shipping=estimateShipping(zip);
 msg.textContent=`Estimated shipping from 95926 to ${zip} for ${packedWeight().toFixed(1)} lb packed weight.`;
 render();
};
document.querySelector('#shipZip').addEventListener('input',()=>{shipping=null;render()});
document.querySelector('#cartBtn').onclick=()=>document.querySelector('#cart').classList.add('open');
document.querySelector('#close').onclick=()=>document.querySelector('#cart').classList.remove('open');
document.querySelector('#paypal').onclick=()=>alert(`Checkout total: $${(subtotal()+shipping+SUPPLIES_FEE).toFixed(2)} including $${shipping.toFixed(2)} estimated shipping plus $3.00 shipping supplies to ZIP ${shippingZip}. PayPal will be connected next.`);
render();
