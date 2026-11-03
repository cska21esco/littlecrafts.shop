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
const $=s=>document.querySelector(s);
function subtotal(){return cart.reduce((a,id)=>a+products[id].price,0)}
function packedWeight(){return cart.reduce((a,id)=>a+products[id].weight,0)}
function regionForZip(zip){const n=Number(zip);if(n>=90000&&n<=96199)return 1;if((n>=97000&&n<=99499)||(n>=89000&&n<=89899)||(n>=85000&&n<=86999))return 2;if((n>=80000&&n<=84999)||(n>=87000&&n<=88999)||(n>=59000&&n<=59999))return 3;if((n>=50000&&n<=79999))return 4;return 5}
function estimateShipping(zip){const region=regionForZip(zip),w=packedWeight();if(!w)return 0;const base=[0,6.75,7.75,8.75,9.75,10.75][region],perLb=[0,.85,1.05,1.25,1.45,1.65][region];return Math.round((base+Math.max(0,w-1)*perLb)*100)/100}
function render(){
 $('#cartCount').textContent=cart.length;
 $('#items').innerHTML=cart.length?cart.map((id,i)=>'<p><strong>'+products[id].name+'</strong> — $'+products[id].price.toFixed(2)+' <button type="button" data-remove="'+i+'">remove</button></p>').join(''):'<p>Your cart is empty.</p>';
 $('#subtotal').textContent=subtotal().toFixed(2);
 $('#shippingDisplay').textContent=shipping===null?'—':'$'+shipping.toFixed(2);
 $('#suppliesDisplay').textContent=shipping===null?'—':'$'+SUPPLIES_FEE.toFixed(2);
 $('#total').textContent=(subtotal()+(shipping===null?0:shipping+SUPPLIES_FEE)).toFixed(2);
 $('#paypal').disabled=!cart.length||shipping===null;
 document.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>{cart.splice(Number(b.dataset.remove),1);shipping=null;render()}));
}
document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{
 const id=button.dataset.add;
 if(cart.includes(id)){alert('This is a one-of-a-kind piece and is already in your cart.');return}
 cart.push(id);shipping=null;render();$('#cart').classList.add('open');
}));
$('#calcShipping').addEventListener('click',()=>{const zip=$('#shipZip').value.trim(),msg=$('#shippingMsg');if(!/^\d{5}$/.test(zip)){shipping=null;msg.textContent='Please enter a valid 5-digit U.S. ZIP code.';render();return}shippingZip=zip;shipping=estimateShipping(zip);msg.textContent='Estimated shipping from 95926 to '+zip+' for '+packedWeight().toFixed(1)+' lb packed weight.';render()});
$('#shipZip').addEventListener('input',()=>{shipping=null;render()});
$('#cartBtn').addEventListener('click',()=>$('#cart').classList.add('open'));
$('#close').addEventListener('click',()=>$('#cart').classList.remove('open'));
$('#paypal').addEventListener('click',async()=>{
 const button=$('#paypal');
 const original=button.textContent;
 try{
  button.disabled=true;button.textContent='Opening PayPal…';
  const response=await fetch('https://littlecrafts-paypal.cska2121.workers.dev/api/orders',{
   method:'POST',headers:{'Content-Type':'application/json'},
   body:JSON.stringify({items:cart,zip:shippingZip})
  });
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||'Unable to start PayPal checkout');
  if(data.order){
   shipping=data.order.shipping;
   $('#shippingDisplay').textContent='
render();
+data.order.shipping.toFixed(2);
   $('#suppliesDisplay').textContent='
render();
+data.order.supplies.toFixed(2);
   $('#total').textContent=data.order.total.toFixed(2);
  }
  const approve=(data.links||[]).find(link=>link.rel==='approve');
  if(!approve||!approve.href)throw new Error('PayPal approval link was not returned');
  window.location.href=approve.href;
 }catch(error){
  alert('PayPal test checkout could not start: '+error.message);
  button.disabled=false;button.textContent=original;
 }
});
render();
