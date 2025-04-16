var t=globalThis,e={},s={},i=t.parcelRequire326b;null==i&&((i=function(t){if(t in e)return e[t].exports;if(t in s){var i=s[t];delete s[t];var a={id:t,exports:{}};return e[t]=a,i.call(a.exports,a,a.exports),a.exports}var r=Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(t,e){s[t]=e},t.parcelRequire326b=i),i.register;var a=i("e93rA"),r=i("7Pz0b");let n=0;class o{constructor(t=[]){this.id=`rgraph__${n++}`,this.vertices=t,this.isGrid=!1}addVertex(t){if(t instanceof Array){this.vertices=this.vertices.concat(t);return}this.vertices.push(t)}buildGrid(t,e,s,i){this.isGrid=!0,this.vertices=[];for(let i=0;i<e;i++)for(let e=0;e<t;e++){let t=new d({data:s(e,i)});this.vertices.push(t)}for(let s=0;s<e;s++)for(let a=0;a<t;a++){let r=this.vertices[s*t+a];if(s>0){let e=(s-1)*t+a,n=this.vertices[e];r.setEdge(n,!0,i(r,n))}if(s<t-1){let e=(s+1)*t+a,n=this.vertices[e];r.setEdge(n,!0,i(r,n))}if(a>0){let e=s*t+(a-1),n=this.vertices[e];r.setEdge(n,!0,i(r,n))}if(a<e-1){let e=s*t+(a+1),n=this.vertices[e];r.setEdge(n,!0,i(r,n))}}}}class d{constructor(t){let e={edges:[],data:void 0,...t};this.id=`rvertex__${n++}`,this.edges=e.edges,this.data=e.data}setEdge(t,e=!1,s){let i=new c(t,this,e,s);this.edges.push(i)}}class c{constructor(t,e,s,i){this.id=`redge__${n++}`,this.start=e,this.end=t,this.directed=s,this.data=i}}class l extends o{constructor(t,e=[]){super(e),this.p5=t}draw(){let{mouseX:t,mouseY:e}=this.p5;for(let s of(this.p5.push(),this.p5.translate(10,10),this.vertices))if(s.data){let i=s.data,a=this.p5.dist(t-10,e-10,i.pos[0],i.pos[1]),r=i.isWall?[0,0,15]:[0,0,50];for(let t of(r=a<10?[200,95,100]:r,this.p5.fill(r),this.p5.noStroke(),this.p5.circle(i.pos[0],i.pos[1],20),this.p5.text(i.num,i.pos[0]-5,i.pos[1]+5),this.p5.stroke(30),s.edges))if(t.data){let e=t.data;this.p5.line(e.start[0],e.start[1],e.end[0],e.end[1])}}this.p5.pop()}selectVertex([t,e]){for(let s of this.vertices)if(s.data){let i=s.data;10>this.p5.dist(t-10,e-10,i.pos[0],i.pos[1])&&(i.isWall=!i.isWall)}}}new(r&&r.__esModule?r.default:r)(t=>{let e=function(t){let e;let s={state:"START",actions:{draw:function(){e&&e.draw()},changeToDraw:function(){console.log("start - changing to draw..."),s.changeState("DRAWGRID")},toggleWalls:function(t){e&&e.selectVertex(t)},changeToStart:function(){console.log("start - changing to start..."),s.changeState("START")}},transition:{},dispatch:function(t,e){let s=this.transition[this.state][t];s?s.call(this,e):console.log(`no method ${t}() in ${this.state}`)},changeState:function(t){this.transition.hasOwnProperty(t)&&(this.state=t)}};return s.transition={START:{draw:s.actions.draw.bind(s),changeToDraw:s.actions.changeToDraw.bind(s)},DRAWGRID:{draw:s.actions.draw.bind(s),toggleWalls:s.actions.toggleWalls.bind(s),changeToStart:s.actions.changeToStart.bind(s)}},{createGraph:function(s=!0){console.log(`creating graph... ${s}`),(!e||s)&&(e=new l(t)).buildGrid(10,10,(t,e)=>({num:10*e+t,x:t,y:e,pos:[50*t,50*e],isWall:!1}),(t,e)=>({start:[t.data.pos[0],t.data.pos[1]],end:[e.data.pos[0],e.data.pos[1]]}))},dispatch:function(t,e){return s.dispatch.call(s,t,e)},get state(){return s.state}}}(t),s={mode:"view",populate:()=>{n(t)},selectionSize:100,algo:"dfs"},i=new a.GUI({autoPlace:!1});function r(t,a){let r;switch(t){case"view":(r=i.addFolder("Search Algos")).open(),r.add(s,"algo",["dfs","bfs"]),e.dispatch("changeToStart"),e.createGraph(a);break;case"draw":r=i.__folders["Search Algos"],i.removeFolder(r),e.dispatch("changeToDraw")}}function n(t){t.background(200,60,10)}i.domElement.id="gui",document.getElementById("gui")?.appendChild(i.domElement),i.add(s,"mode",["view","draw"]).onChange(t=>r(t,!1)),r("view",!0),t.setup=()=>{t.createCanvas(window.innerWidth,window.innerHeight).parent("app"),t.background("white"),t.pixelDensity(1),t.colorMode(t.HSB),window.addEventListener("resize",()=>(function(t){t.resizeCanvas(window.innerWidth,window.innerHeight)})(t)),n(t)},t.draw=()=>{t.background(200,60,10),e.dispatch("draw")},t.mouseClicked=t=>{e.dispatch("toggleWalls",[t.clientX,t.clientY])}});
//# sourceMappingURL=path-finding.03a0d66c.js.map
