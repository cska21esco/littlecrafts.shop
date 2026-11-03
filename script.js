const products={
'white-daisy':{name:'White Daisy Jar',price:15},
'pink-floral':{name:'Pink Floral Jar',price:15},
'blue-painted':{name:'Blue Painted Jar',price:15},
'lemon-slice':{name:'Lemon Slice',price:12},
'galaxy':{name:'Galaxy',price:12},
'hand-painted-candle':{name:'Hand-Painted Candle',price:18}
};let cart=[];window.add=(id)=>{if(cart.includes(id)){alert('This is a one-of-a-kind piece and is already in your cart.');return}cart.push(id);render();document.querySelector('#cart').classList.add('open')};function render(){document.querySelector('#cartCount').textContent=cart.length;document.querySelector('#items').innerHTML=cart.length?cart.map((id,i)=>`<p><strong>${products[id].name}</strong> — $${products[id].price.toFixed(2)} <button onclick="removeItem(${i})">remove</button></p>`).join(''):'<p>Your cart is empty.</p>';document.querySelector('#total').textContent=cart.reduce((a,id)=>a+products[id].price,0).toFixed(2)}window.removeItem=i=>{cart.splice(i,1);render()};document.querySelector('#cartBtn').onclick=()=>document.querySelector('#cart').classList.add('open');document.querySelector('#close').onclick=()=>document.querySelector('#cart').classList.remove('open');document.querySelector('#paypal').onclick=()=>alert('PayPal checkout is staged but not live yet. We will connect your PayPal account before publishing the store for sales.');render();
