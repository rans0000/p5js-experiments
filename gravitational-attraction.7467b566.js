function t(t,e,i,s){Object.defineProperty(t,e,{get:i,set:s,enumerable:!0,configurable:!0})}function e(t){return t&&t.__esModule?t.default:t}var i=globalThis,s={},r={},o=i.parcelRequirebf15;null==o&&((o=function(t){if(t in s)return s[t].exports;if(t in r){var e=r[t];delete r[t];var i={id:t,exports:{}};return s[t]=i,e.call(i.exports,i,i.exports),i.exports}var o=Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}).register=function(t,e){r[t]=e},i.parcelRequirebf15=o),(0,o.register)("fK5g3",function(e,i){var s,r;t(e.exports,"defaultEntityConfig",()=>o),t(e.exports,"defaultEdgeConfig",()=>n),t(e.exports,"MOUSE_BTN",()=>s);let o={r:5},n={top:!0,right:!0,bottom:!0,left:!0};(r=s||(s={}))[r.LEFT=0]="LEFT",r[r.MIDDLE=1]="MIDDLE",r[r.RIGHT=2]="RIGHT"});var n=o("e93rA"),a=o("7Pz0b"),h=o("fK5g3");let l=[],c=[];class p{constructor(t,i,s,r,o=e(a).Vector.random2D()){this.p5=t,this.pos=this.p5.createVector(i,s),this.velocity=o,this.mass=r,this.accelaration=this.p5.createVector(0,0),this.r=2*this.p5.sqrt(this.mass)}show(){this.p5.stroke(255),this.p5.strokeWeight(2),this.p5.fill(255,100),this.p5.ellipse(this.pos.x,this.pos.y,2*this.r)}applyForces(t){e(a).Vector.div(t,this.mass),this.accelaration.add(t)}update(){this.velocity.add(this.accelaration),this.pos.add(this.velocity),this.accelaration.set(0,0)}}class d{constructor(t,e,i,s,r=!0){this.p5=t,this.pos=this.p5.createVector(e,i),this.mass=s,this.isAttractor=r}show(){this.p5.noStroke(),this.p5.fill(this.isAttractor?"#00ff00":"#ff0000"),this.p5.ellipse(this.pos.x,this.pos.y,5*this.p5.sqrt(this.mass))}attract(t){let i=e(a).Vector.sub(this.pos,t.pos),s=this.p5.constrain(i.magSq(),25,2500),r=this.mass*t.mass/s*.5*(this.isAttractor?1:-1);i.setMag(r),t.applyForces(i)}}new(e(a))(t=>{let e={moverCount:10,clear:()=>{s(t);let{innerWidth:e,innerHeight:i}=window;c.push(new d(t,e/2,i/2,20))}},i=new n.GUI({autoPlace:!1});function s(t){t.background(200,60,10);let{innerWidth:i,innerHeight:s}=window;l=[],c=[];for(let r=0;r<e.moverCount;r++){let e=new p(t,t.random(i),t.random(s),20);l.push(e)}c.push(new d(t,i/2,s/2,10))}i.domElement.id="gui",document.getElementById("gui")?.appendChild(i.domElement),i.add(e,"clear").name("Clear Attractors"),i.add(e,"moverCount",1,30,1).name("Mover Count").onChange(()=>{s(t)}),t.setup=()=>{let e=t.createCanvas(window.innerWidth,window.innerHeight);document.oncontextmenu=function(){return!1},e.parent("app"),t.background("white"),t.pixelDensity(1),t.colorMode(t.HSB),window.addEventListener("resize",()=>(function(t){t.resizeCanvas(window.innerWidth,window.innerHeight)})(t)),s(t)},t.draw=()=>{t.background(200,60,10,.2);for(let t=0;t<l.length;t++)l[t].update(),l[t].show();for(let t=0;t<c.length;t++)for(let e=0;e<l.length;e++)c[t].attract(l[e]),c[t].show()},t.mouseReleased=e=>{let{clientX:i,clientY:s,button:r}=e;return c.push(new d(t,i,s,20,r===h.MOUSE_BTN.LEFT)),!1}});
//# sourceMappingURL=gravitational-attraction.7467b566.js.map