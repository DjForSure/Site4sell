/* ===== EDIT ME: your WhatsApp Business number — country code first, digits only (e.g. 919876543210) ===== */
const CONFIG={whatsapp:"917571062508",studio:"A Little Love Studio"};
const PRODUCTS=[
{id:1,cat:"Sorry",name:"Simple Sorry",price:49,file:"sorry-basic.html",d:"A sweet, minimal apology with a playful yes/no forgiveness moment.",c:"#f7d9e0,#fff8f0"},
{id:2,cat:"Sorry",name:"Effortful Sorry",price:99,file:"sorry-premium.html",d:"Cinematic opening, animated envelope, a heartfelt letter and a hold-to-forgive finale.",c:"#c9a7d8,#f7d9e0"},
{id:3,cat:"Special Day",name:"Classic Special Day",price:199,file:"special-day-basic.html",d:"Gallery, a memory, personal notes and a final surprise for any occasion.",c:"#e6dcf5,#fff8f0"},
{id:4,cat:"Special Day",name:"Premium Special Day",price:299,file:"special-day-premium.html",d:"Cinematic intro, lightbox gallery, story timeline, letter and a curtain-reveal surprise.",c:"#3a2a3a,#c9617f"},
{id:5,cat:"Birthday",name:"Birthday Classic",price:199,file:"birthday-basic.html",d:"Animated wishes, a cake with candles to blow out, gallery and confetti.",c:"#ffe3a3,#ffd6e0"},
{id:6,cat:"Birthday",name:"Birthday Premium",price:299,file:"birthday-premium.html",d:"Cinematic intro, timeline, notes, animated cake and a surprise-by-surprise reveal.",c:"#e6dcf5,#ffd6e0"},
{id:7,cat:"Birthday",name:"Birthday Ultimate",price:499,file:"birthday-ultimate.html",d:"Flagship: loading intro, starry stage, gift box, typed letter, confetti and a grand finale.",c:"#2b1d3a,#d4a5c0"}];
const $=s=>document.querySelector(s);
let cart=[],cat="All";
try{cart=JSON.parse(localStorage.getItem("alls_cart")||"[]").filter(i=>i.q>0&&PRODUCTS.some(p=>p.id==i.id))}catch(e){}
const save=()=>{try{localStorage.setItem("alls_cart",JSON.stringify(cart))}catch(e){}drawCart()};
const show=(s,v=true)=>$(s).classList.toggle("show",v);
function drawGrid(){
 $("#tabs").innerHTML=["All","Sorry","Special Day","Birthday"].map(t=>`<button class="tab ${t==cat?"on":""}" data-t="${t}">${t=="All"?"All":t+" Websites"}</button>`).join("");
 $("#grid").innerHTML=PRODUCTS.filter(p=>cat=="All"||p.cat==cat).map(p=>`<div class="card"><div class="sw" style="background:linear-gradient(135deg,${p.c})"></div><small>${p.cat} Websites</small><h3>${p.name}</h3><div class="price">₹${p.price}</div><details><summary>Details</summary><p>${p.d}</p></details><div class="row"><a class="btn o" href="products/${p.file}" target="_blank">Live Demo</a><button class="btn" data-o="${p.id}">Order Now</button></div></div>`).join("")}
function drawCart(){
 const rows=cart.map(i=>({...PRODUCTS.find(p=>p.id==i.id),q:i.q})),tot=rows.reduce((s,r)=>s+r.price*r.q,0);
 $("#cnt").textContent=rows.reduce((s,r)=>s+r.q,0);$("#total").textContent=tot;
 $("#items").innerHTML=rows.length?rows.map(r=>`<div class="item"><span>${r.name}<br>₹${r.price} each</span><span><button data-m="${r.id}">−</button> ${r.q} <button data-p="${r.id}">+</button> <button data-x="${r.id}">✕</button></span></div>`).join(""):"<p>Your cart is empty.</p>";
 return{rows,tot}}
function change(id,d){const i=cart.find(x=>x.id==id);if(!i)return;i.q+=d;if(i.q<1)cart=cart.filter(x=>x.id!=id);save()}
function openForm(){const{rows,tot}=drawCart();if(!rows.length)return;
 $("#sum").innerHTML="<b>Selected package:</b> "+rows.map(r=>`${r.name} ×${r.q} (₹${r.price*r.q})`).join(", ")+`<br><b>Total: ₹${tot}</b>`;show("#cartOv",false);show("#formOv")}
document.addEventListener("click",e=>{const t=e.target,d=t.dataset;
 if(d.t){cat=d.t;drawGrid()}
 if(d.o){if(!cart.find(x=>x.id==d.o))cart.push({id:+d.o,q:1});save();openForm()}
 if(d.p)change(d.p,1);if(d.m)change(d.m,-1);if(d.x){cart=cart.filter(x=>x.id!=d.x);save()}
 if(t.closest("#cartBtn")){e.preventDefault();show("#cartOv")}
 if(t.id=="closeCart")show("#cartOv",false);if(t.id=="checkout")openForm();if(t.id=="closeForm")show("#formOv",false);
 if(t.classList.contains("ov"))t.classList.remove("show")});
$("#photos").onchange=e=>{$("#prev").innerHTML="";[...e.target.files].forEach(f=>{const im=new Image();im.src=URL.createObjectURL(f);$("#prev").append(im)})};
/* Payment hook: call your gateway (Razorpay, Stripe...) here before the WhatsApp message opens. */
function startPayment(order){return Promise.resolve(order)}
$("#form").onsubmit=e=>{e.preventDefault();
 const f=Object.fromEntries(new FormData(e.target)),{rows,tot}=drawCart(),er=[];
 if(!f.cname.trim())er.push("Enter your name");
 if(!/^\+?\d[\d\s-]{8,14}$/.test(f.phone.trim()))er.push("Enter a valid WhatsApp number");
 if(f.email&&!/^\S+@\S+\.\S+$/.test(f.email))er.push("Email looks invalid");
 if(!f.rname.trim())er.push("Enter the recipient's name");
 if(!rows.length)er.push("Your cart is empty");
 $("#err").textContent=er.join(". ");if(er.length)return;
 const n=$("#photos").files.length,
 msg=`Hi ${CONFIG.studio}! I'd like to place an order.\n\n*Customer:* ${f.cname}\n*WhatsApp:* ${f.phone}\n*Email:* ${f.email||"-"}\n*Recipient:* ${f.rname}\n*Occasion:* ${f.occ}\n\n*Package(s):*\n${rows.map(r=>`• ${r.name} ×${r.q} — ₹${r.price*r.q}`).join("\n")}\n*Total:* ₹${tot}\n\n*Message:* ${f.msg||"-"}\n*Instructions:* ${f.extra||"-"}\n*Photos:* ${n} selected (I'll send them here)`;
 startPayment({rows,tot,f}).then(()=>window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`,"_blank"))};
$("#menu").onclick=()=>$("#links").classList.toggle("open");
$("#links").onclick=()=>$("#links").classList.remove("open");
$("#top").onclick=()=>scrollTo({top:0,behavior:"smooth"});
onscroll=()=>{$("#top").style.display=scrollY>400?"block":"none"};
$("#waLink").href=`https://wa.me/${CONFIG.whatsapp}`;
const io=new IntersectionObserver(es=>es.forEach(x=>x.isIntersecting&&x.target.classList.add("in")));
document.querySelectorAll(".fade").forEach(el=>io.observe(el));
drawGrid();drawCart();
