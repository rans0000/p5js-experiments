let t;function e(t){return t&&t.__esModule?t.default:t}function i(t,e,i,s){Object.defineProperty(t,e,{get:i,set:s,enumerable:!0,configurable:!0})}var s=globalThis,n={},o={},r=s.parcelRequirebf15;null==r&&((r=function(t){if(t in n)return n[t].exports;if(t in o){var e=o[t];delete o[t];var i={id:t,exports:{}};return n[t]=i,e.call(i.exports,i,i.exports),i.exports}var s=Error("Cannot find module '"+t+"'");throw s.code="MODULE_NOT_FOUND",s}).register=function(t,e){o[t]=e},s.parcelRequirebf15=r);var a=r.register;a("7wO5S",function(t,s){i(t.exports,"default",()=>a);var n=r("7Pz0b");let o={radius:2,color:100,isClosed:!1};var a=class{constructor(t,e){let i={...o,...e};this.p5=t,this.mode="view",this.points=[],this.paintRef=this.paint.bind(this),this.radius=i.radius,this.color=i.color,this.isClosed=i.isClosed}setPoints(t){return this.points=t,this.stopPainting()}getPoints(){return this.points}getClosestSegment(t,i,s=!1){let o,r;let a=this.p5.createVector(t,i),h=this.getPoints(),l=h.length;this.p5.angleMode(this.p5.RADIANS),this.p5.colorMode(this.p5.HSB);for(let t=0;t<l;t++){let i=h[t].length,l=0;for(let d=1;!this.isClosed&&d<i||this.isClosed&&d<=i;d++){let p=d%i,c=e(n).Vector.sub(h[t][p],h[t][l]),u=e(n).Vector.sub(a,h[t][l]).dot(c)/c.magSq(),g=c.copy().normalize(),m=s?g.setMag(u*c.mag()):g.setMag(this.p5.constrain(u,0,1)*c.mag());if(s&&(u<0||u>1)){l=p;continue}let f=m.copy().add(h[t][l]),w=f.copy().sub(a).magSq();(void 0===r||w<r)&&(r=w,o=f),l=p}}return{length:r,intersectionPosition:o}}addPoint(t){let e=this.points.length;return this.points[e].push(t.copy()),this}deletePoint(){let t=this.points.length;return this.points[t].pop(),this}startPainting(){return"draw"===this.mode||(this.mode="draw",this.points.push([]),this.p5.canvas.addEventListener("click",this.paintRef)),this}stopPainting(){return"view"===this.mode||(this.mode="view",this.p5.canvas.removeEventListener("click",this.paintRef)),this}togglePainting(){return"view"===this.mode?this.startPainting():this.stopPainting(),this}paint(t){let e=this.p5.createVector(t.x,t.y),i=this.points.length;return this.points[i-1].push(e),this}update(t){return this}draw(){let t=this.points.length;this.p5.stroke(this.color),this.p5.strokeWeight(2*this.radius);for(let e=0;e<t;e++){let i=this.points[e].length;this.p5.noFill(),this.p5.beginShape();for(let t=0;t<i;t++)this.p5.circle(this.points[e][t].x,this.points[e][t].y,10),this.p5.vertex(this.points[e][t].x,this.points[e][t].y);let s=this.isClosed&&"draw"==this.mode&&t>1&&e!==t-1||this.isClosed&&"view"==this.mode;this.p5.endShape(s?"close":void 0),e==t-1&&i>0&&"draw"==this.mode&&this.p5.line(this.points[e][i-1].x,this.points[e][i-1].y,this.p5.mouseX,this.p5.mouseY)}return this}}}),a("fK5g3",function(t,e){var s,n,o,r;i(t.exports,"defaultEntityConfig",()=>a),i(t.exports,"defaultEdgeConfig",()=>h),i(t.exports,"MOUSE_BTN",()=>s),i(t.exports,"Gamer",()=>n);let a={r:5},h={top:!0,right:!0,bottom:!0,left:!0};(o=s||(s={}))[o.LEFT=0]="LEFT",o[o.MIDDLE=1]="MIDDLE",o[o.RIGHT=2]="RIGHT",(r=n||(n={}))[r.PLAYER=0]="PLAYER",r[r.AI=1]="AI"});var h=r("e93rA"),l=r("7Pz0b"),d=r("7wO5S"),p=r("fK5g3");let c=[];new(e(l))(e=>{let i={mode:"view",findOnlyWithinSegment:!1,clear:function(){t.setPoints([])}},s=new h.GUI({autoPlace:!1});s.domElement.id="gui",document.getElementById("gui")?.appendChild(s.domElement),s.add(i,"mode",["view","draw"]).onChange(function(e){switch(e){case"view":t?.stopPainting();break;case"draw":t?.startPainting()}}),s.add(i,"findOnlyWithinSegment").name("Find Within Segment"),s.add(i,"clear").name("Clear Canvas"),e.setup=()=>{e.createCanvas(window.innerWidth,window.innerHeight).parent("app"),e.background("white"),e.pixelDensity(1),e.colorMode(e.HSB),window.addEventListener("resize",()=>(function(t){t.resizeCanvas(window.innerWidth,window.innerHeight)})(e)),document.oncontextmenu=function(){return!1},t=new d.default(e,{isClosed:!1});let i=[[e.createVector(200,300),e.createVector(250,150),e.createVector(550,250),e.createVector(730,100)]];t.setPoints(i),c.push(t)},e.mouseReleased=e=>{switch(e.button){case p.MOUSE_BTN.LEFT:"draw"===i.mode&&t?.startPainting();break;case p.MOUSE_BTN.RIGHT:"draw"===i.mode&&t?.stopPainting()}},e.keyPressed=t=>{t.keyCode===e.ESCAPE&&(e.isLooping()?e.noLoop():e.loop())},e.draw=()=>{e.clear(),c.forEach(t=>{if(t.update(e.deltaTime).draw(),t instanceof d.default&&t.getPoints().length&&"view"===i.mode){let s=t.getClosestSegment(e.mouseX,e.mouseY,i.findOnlyWithinSegment);s.intersectionPosition&&function(t,e){let i=t.mouseX,s=t.mouseY;t.stroke(0,200,128),t.strokeWeight(2),t.line(i,s,e.x,e.y),t.strokeWeight(0),t.fill(255),t.circle(i,s,5)}(e,s.intersectionPosition)}})}});
//# sourceMappingURL=closest-path.05caadc4.js.map