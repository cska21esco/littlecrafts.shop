const products={
"white-daisy":{name:"White Daisy Jar",price:15,weight:3},
"pink-floral":{name:"Pink Floral Jar",price:15,weight:3},
"blue-painted":{name:"Blue Painted Jar",price:15,weight:3},
"lemon-slice":{name:"Lemon Slice",price:12,weight:1.5},
"galaxy":{name:"Galaxy",price:12,weight:1.5},
"hand-painted-candle":{name:"Hand-Painted Candle",price:18,weight:4}
};
const SUPPLIES_FEE=3;
const WORKER_URL="https://littlecrafts-paypal.cska2121.workers.dev";
let cart=[],shipping=null,shippingZip="";
const qs=s=>document.querySelector(s);
function subtotal(){return cart.reduce((sum,id)=>sum+products[id].price,0)}
function packedWeight(){return cart.reduce((sum,id)=>sum+products[id].weight,0)}
function regionForZip(zip){const n=Number(zip);if(n>=90000&&n<=96199)return 1;if((n>=97000&&n<=99499)||(n>=89000&&n<=89899)||(n>=85000&&n<=86999))return 2;if((n>=80000&&n<=84999)||(n>=87000&&n<=88999)||(n>=59000&&n<=59999))return 3;if(n>=50000&&n<=79999)return 4;return 5}
function estimateShipping(zip){const r=regionForZip(zip),w=packedWeight();if(!w)return 0;const base=[0,6.75,7.75,8.75,9.75,10.75][r];const per=[0,.85,1.05,1.25,1.45,1.65][r];return Math.round((base+Math.max(0,w-1)*per)*100)/100}
function money(n){return "$"+Number(n).toFixed(2)}
function render(){
 qs("#cartCount").textContent=cart.length;
 qs("#items").innerHTML=cart.length?cart.map((id,i)=>'<p><strong>'+products[id].name+'</strong> — '+money(products[id].price)+' <button type="button" data-remove="'+i+'">remove</button></p>').join(""):"<p>Your cart is empty.</p>";
 qs("#subtotal").textContent=subtotal().toFixed(2);
 qs("#shippingDisplay").textContent=shipping===null?"—":money(shipping);
 qs("#suppliesDisplay").textContent=shipping===null?"—":money(SUPPLIES_FEE);
 qs("#total").textContent=(subtotal()+(shipping===null?0:shipping+SUPPLIES_FEE)).toFixed(2);
 qs("#paypal").disabled=!cart.length||shipping===null;
 document.querySelectorAll("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{cart.splice(Number(btn.dataset.remove),1);shipping=null;render()}));
}
document.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>{
 const id=btn.dataset.add;
 if(cart.includes(id)){alert("This is a one-of-a-kind piece and is already in your cart.");return}
 cart.push(id);shipping=null;render();qs("#cart").classList.add("open");
}));
qs("#calcShipping").addEventListener("click",()=>{
 const zip=qs("#shipZip").value.trim(),msg=qs("#shippingMsg");
 if(!/^\d{5}$/.test(zip)){shipping=null;msg.textContent="Please enter a valid 5-digit U.S. ZIP code.";render();return}
 shippingZip=zip;shipping=estimateShipping(zip);
 msg.textContent="Estimated shipping from 95926 to "+zip+" for "+packedWeight().toFixed(1)+" lb packed weight.";
 render();
});
qs("#shipZip").addEventListener("input",()=>{shipping=null;render()});
qs("#cartBtn").addEventListener("click",()=>qs("#cart").classList.add("open"));
qs("#close").addEventListener("click",()=>qs("#cart").classList.remove("open"));
qs("#paypal").addEventListener("click",async()=>{
 const button=qs("#paypal"),original=button.textContent;
 try{
  button.disabled=true;button.textContent="Opening PayPal...";
  const response=await fetch(WORKER_URL+"/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart,zip:shippingZip})});
  const data=await response.json();
  if(!response.ok)throw new Error(data.error||"Unable to start PayPal checkout");
  if(data.order){shipping=data.order.shipping;qs("#shippingDisplay").textContent=money(data.order.shipping);qs("#suppliesDisplay").textContent=money(data.order.supplies);qs("#total").textContent=Number(data.order.total).toFixed(2)}
  const approve=(data.links||[]).find(link=>link.rel==="approve");
  if(!approve||!approve.href)throw new Error("PayPal approval link was not returned");
  window.location.assign(approve.href);
 }catch(error){alert("PayPal test checkout could not start: "+error.message);button.disabled=false;button.textContent=original}
});
render();
