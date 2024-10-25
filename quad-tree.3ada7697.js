let t,i;function e(t,i,e,s){Object.defineProperty(t,i,{get:e,set:s,enumerable:!0,configurable:!0})}var s=globalThis,r={},n={},o=s.parcelRequirebf15;null==o&&((o=function(t){if(t in r)return r[t].exports;if(t in n){var i=n[t];delete n[t];var e={id:t,exports:{}};return r[t]=e,i.call(e.exports,e,e.exports),e.exports}var s=Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(t,i){n[t]=i},s.parcelRequirebf15=o),(0,o.register)("fK5g3",function(t,i){var s,r,n,o;e(t.exports,"defaultEntityConfig",()=>h),e(t.exports,"defaultEdgeConfig",()=>a),e(t.exports,"MOUSE_BTN",()=>s),e(t.exports,"Gamer",()=>r);let h={r:5},a={top:!0,right:!0,bottom:!0,left:!0};(n=s||(s={}))[n.LEFT=0]="LEFT",n[n.MIDDLE=1]="MIDDLE",n[n.RIGHT=2]="RIGHT",(o=r||(r={}))[o.PLAYER=0]="PLAYER",o[o.AI=1]="AI"});var h=o("e93rA"),a=o("7Pz0b");class d{constructor(t,i){this.p5=t,this.items=[],this.quad=this.generateQuad(i.pos,i.width,i.height),this.subdivisions=[],this.capacity=i.capacity}generateQuad(t,i,e){return new p(this.p5,t,i,e)}subdivide(){let t=this.quad,i=t.width/4,e=t.height/4,s=new d(this.p5,{capacity:this.capacity,height:2*e,width:2*i,pos:{x:t.pos.x+i,y:t.pos.y+e}}),r=new d(this.p5,{capacity:this.capacity,height:2*e,width:2*i,pos:{x:t.pos.x-i,y:t.pos.y+e}}),n=new d(this.p5,{capacity:this.capacity,height:2*e,width:2*i,pos:{x:t.pos.x+i,y:t.pos.y-e}}),o=new d(this.p5,{capacity:this.capacity,height:2*e,width:2*i,pos:{x:t.pos.x-i,y:t.pos.y-e}});this.subdivisions=[s,r,n,o]}insert(t){if(!this.quad.isWithinBounds(t))return!1;if(this.items.length<this.capacity)return this.items.push(t),!0;this.subdivisions.length||this.subdivide();for(let i=0;i<this.subdivisions.length;i++)if(this.subdivisions[i].insert(t))return!0;return!1}query(t,i=[]){if(d.count++,!this.quad.isIntersects(t))return[];for(let e of this.items)t.isWithinBounds(e)&&i.push(e);for(let e of this.subdivisions)e.query(t,i);return i}draw(){for(let t of(this.quad.draw(),this.subdivisions))t.draw();for(let t of this.items)this.p5.stroke(255,1),this.p5.circle(t.x,t.y,2);return this}}class p{constructor(t,i,e,s){this.p5=t,this.pos=i,this.width=e,this.height=s}isWithinBounds(t){let{x:i,y:e}=this.pos,s=this.width/2,r=this.height/2;return t.y<=e+r&&t.x<=i+s&&t.y>e-r&&t.x>i-s}isIntersects(t){let{x:i,y:e}=this.pos,s=this.width/2,r=this.height/2;return!(t.pos.y-t.height/2>e+r||t.pos.x-t.width/2>i+s||t.pos.y+t.height/2<e-r||t.pos.x+t.width/2<i-s)}draw(){return this.p5.rectMode(this.p5.CENTER),this.p5.stroke(255),this.p5.noFill(),this.p5.rect(this.pos.x,this.pos.y,this.width,this.height),this}}var u=o("fK5g3");new(a&&a.__esModule?a.default:a)(e=>{let s=new h.GUI({autoPlace:!1});s.domElement.id="gui",document.getElementById("gui")?.appendChild(s.domElement),e.setup=()=>{e.createCanvas(window.innerWidth,window.innerHeight).parent("app"),e.background("white"),e.pixelDensity(1),e.colorMode(e.HSB),window.addEventListener("resize",()=>(function(t){t.resizeCanvas(window.innerWidth,window.innerHeight)})(e)),function(e){let{innerWidth:s,innerHeight:r}=window;e.background(200,60,10);let n=e.createVector(s/2,r/2);t=new d(e,{pos:n,capacity:4,width:500,height:500}),i=new p(e,{x:0,y:0},100,100);for(let i=0;i<1e3;i++){let i={x:e.randomGaussian(s/2,100),y:e.randomGaussian(r/2,100)};t.insert(i)}}(e)},e.draw=()=>{e.background(200,60,10),t.draw(),i.pos={x:e.mouseX,y:e.mouseY},e.rectMode(e.CENTER),e.stroke(128,255,255),e.rect(i.pos.x,i.pos.y,i.width,i.height),d.count=0;let s=t.query(i);for(let t of(e.textSize(20),e.noStroke(),e.fill(255),e.textAlign(e.RIGHT),e.text(`Iterations/total: ${d.count}/1000`,window.innerWidth-20,50),s))e.stroke(0,255,255),e.circle(t.x,t.y,2)},e.mouseReleased=i=>{i.button===u.MOUSE_BTN.LEFT&&t.insert({x:i.clientX,y:i.clientY})}});
//# sourceMappingURL=quad-tree.3ada7697.js.map
