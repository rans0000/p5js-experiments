let e;function t(e,t,s,i){Object.defineProperty(e,t,{get:s,set:i,enumerable:!0,configurable:!0})}function s(e){return e&&e.__esModule?e.default:e}var i,l,n=globalThis,o={},r={},a=n.parcelRequirebf15;null==a&&((a=function(e){if(e in o)return o[e].exports;if(e in r){var t=r[e];delete r[e];var s={id:e,exports:{}};return o[e]=s,t.call(s.exports,s,s.exports),s.exports}var i=Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){r[e]=t},n.parcelRequirebf15=a),(0,a.register)("fK5g3",function(e,s){var i,l,n,o;t(e.exports,"defaultEntityConfig",()=>r),t(e.exports,"defaultEdgeConfig",()=>a),t(e.exports,"MOUSE_BTN",()=>i),t(e.exports,"Gamer",()=>l);let r={r:5},a={top:!0,right:!0,bottom:!0,left:!0};(n=i||(i={}))[n.LEFT=0]="LEFT",n[n.MIDDLE=1]="MIDDLE",n[n.RIGHT=2]="RIGHT",(o=l||(l={}))[o.PLAYER=0]="PLAYER",o[o.AI=1]="AI"});var c=a("e93rA"),d=(a("7Pz0b"),a("7Pz0b")),p=a("fK5g3");let h=0;(i=l||(l={}))[i.NORMAL=0]="NORMAL",i[i.ANIMATION=1]="ANIMATION",i[i.DRAG=2]="DRAG",i[i.PAUSED=3]="PAUSED";class w{constructor(e,t){this.p5=e,this.id=t.id,this.board=t.board,this.owner=t.owner,this.cellIndex=t.cellIndex,this.pos=e.createVector(0,0),this.state=0}update(e,t,s){let i=this.board,l=this.board.cells,n=this.p5.createVector(t+l[this.cellIndex].pos.x*i.size,s+l[this.cellIndex].pos.y*i.size),o=this.p5.createVector(this.p5.mouseX,this.p5.mouseY);if(0===this.state&&0===i.state&&!this.p5.mouseIsPressed)return this.pos.set(n.x,n.y),this;if(this.owner===p.Gamer.PLAYER&&this.p5.mouseIsPressed&&0===i.state&&0===this.state&&30>n.copy().sub(o).mag())return i.state=this.state=2,this;if(this.owner===p.Gamer.PLAYER&&2===this.state&&this.p5.mouseIsPressed&&this.pos.set(o.x,o.y),this.owner===p.Gamer.PLAYER&&2===this.state&&!this.p5.mouseIsPressed){i.state=this.state=1;let e=i.cells.length;for(let n=0;n<e;n++){if(this.cellIndex===n||l[n].pawn)continue;let e=l[n];if(30>this.p5.createVector(t+e.pos.x*i.size,s+e.pos.y*i.size).copy().sub(this.pos).mag()){let{isLegal:e}=this.getLegalMove(i,this.cellIndex,n);if(!e)continue;return this.targetCell=n,this}}return this.targetCell=this.cellIndex,this}if(1===this.state){let e=this.p5.createVector(t+l[this.targetCell].pos.x*i.size,s+l[this.targetCell].pos.y*i.size);if(30>e.copy().sub(this.pos).mag()){if(i.state=this.state=0,this.pos.set(e.x,e.y),this.targetCell!==this.cellIndex){let{capturedPawnId:e,isLegal:t}=this.getLegalMove(i,this.cellIndex,this.targetCell);if(!t)return this;let s={pawnId:this.id,targetCellIndex:this.targetCell,capturedPawnId:e,bestScore:0};if(i.movePawn(i,s),i.currentPlayer===p.Gamer.PLAYER){let e=i.checkGameStatus(i);if(void 0!==e)return i.state=this.state=3,i.onResolve&&i.onResolve(e),this;i.currentPlayer=p.Gamer.AI,i.nextMove()}if(i.currentPlayer===p.Gamer.AI){i.movePawn(i,i.cachedMove);let e=i.checkGameStatus(i);if(void 0!==e)return i.state=this.state=3,i.onResolve&&i.onResolve(e),this;i.state=this.state=0,i.currentPlayer=p.Gamer.PLAYER}}return this}this.pos.add(e).div(2)}return this}draw(){let{mouseX:e,mouseY:t}=this.p5;this.p5.noStroke(),this.owner===p.Gamer.AI?this.p5.fill(10,80,70):this.p5.fill(200,80,70),this.p5.ellipseMode(this.p5.CENTER),this.p5.circle(this.pos.x,this.pos.y,30),this.owner===p.Gamer.PLAYER&&30>this.p5.createVector(e,t).dist(this.pos)&&this.p5.cursor(this.p5.HAND),this.board.showHelpers&&(this.p5.stroke(255),this.p5.strokeWeight(1),this.p5.noFill(),this.p5.textAlign(this.p5.CENTER,this.p5.CENTER),this.p5.text(`${this.id} (${this.cellIndex})`,this.pos.x,this.pos.y))}getLegalMove(e,t,s){let i,l=!1,n=e.cells[t];for(let t=0;t<n.connectingIndices.length;t++){let o=n.connectingIndices[t];if(o[0]===s&&(l=!0),o[1]===s&&e.cells[o[0]].pawn?.owner!==this.owner&&e.cells[o[0]].pawn?.owner!==void 0){let t=e.pawns.find(e=>e.cellIndex===o[0]);i=t?.id,l=!0}}return{isLegal:l,capturedPawnId:i}}}function f(e,t){return[new w(e,{id:0,board:t,owner:p.Gamer.AI,cellIndex:0}),new w(e,{id:1,board:t,owner:p.Gamer.AI,cellIndex:1}),new w(e,{id:2,board:t,owner:p.Gamer.AI,cellIndex:2}),new w(e,{id:3,board:t,owner:p.Gamer.AI,cellIndex:3}),new w(e,{id:4,board:t,owner:p.Gamer.AI,cellIndex:4}),new w(e,{id:5,board:t,owner:p.Gamer.PLAYER,cellIndex:8}),new w(e,{id:6,board:t,owner:p.Gamer.PLAYER,cellIndex:9}),new w(e,{id:7,board:t,owner:p.Gamer.PLAYER,cellIndex:10}),new w(e,{id:8,board:t,owner:p.Gamer.PLAYER,cellIndex:11}),new w(e,{id:9,board:t,owner:p.Gamer.PLAYER,cellIndex:12})]}function u(e,t){return[{id:0,pos:e.createVector(0,0),connectingIndices:[[1,2],[3,6],[5,10]],pawn:t[0]},{id:1,pos:e.createVector(2,0),connectingIndices:[[0,void 0],[2,void 0],[3,5],[4,7],[6,11]],pawn:t[1]},{id:2,pos:e.createVector(4,0),connectingIndices:[[1,0],[4,6],[7,12]],pawn:t[2]},{id:3,pos:e.createVector(1,1),connectingIndices:[[0,void 0],[1,void 0],[6,9],[5,void 0]],pawn:t[3]},{id:4,pos:e.createVector(3,1),connectingIndices:[[1,void 0],[2,void 0],[7,void 0],[6,8]],pawn:t[4]},{id:5,pos:e.createVector(0,2),connectingIndices:[[0,void 0],[3,1],[6,7],[8,11],[10,void 0]],pawn:null},{id:6,pos:e.createVector(2,2),connectingIndices:[[3,0],[1,void 0],[4,2],[7,void 0],[9,12],[11,void 0],[8,10],[5,void 0]],pawn:null},{id:7,pos:e.createVector(4,2),connectingIndices:[[4,1],[2,void 0],[12,void 0],[9,11],[6,5]],pawn:null},{id:8,pos:e.createVector(1,3),connectingIndices:[[5,void 0],[6,4],[11,void 0],[10,void 0]],pawn:t[5]},{id:9,pos:e.createVector(3,3),connectingIndices:[[6,3],[7,void 0],[12,void 0],[11,void 0]],pawn:t[6]},{id:10,pos:e.createVector(0,4),connectingIndices:[[5,0],[8,6],[11,12]],pawn:t[7]},{id:11,pos:e.createVector(2,4),connectingIndices:[[8,5],[6,1],[9,7],[12,void 0],[10,void 0]],pawn:t[8]},{id:12,pos:e.createVector(4,4),connectingIndices:[[9,6],[7,2],[11,10]],pawn:t[9]}]}var I=class{constructor(e,t){let s={showHelpers:!1,currentPlayer:p.Gamer.PLAYER,offset:e.createVector(150,150),size:100,...t};this.p5=e,this.currentPlayer=s.currentPlayer,this.pawns=f(e,this),this.cells=u(e,this.pawns),this.state=0,this.showHelpers=s.showHelpers,this.offset=s.offset,this.size=s.size,this.onResolve=s.onResolve}checkGameStatus(e){let t=0,s=0;return e.pawns.forEach(e=>e.owner===p.Gamer.AI?++t:++s),0===t?p.Gamer.PLAYER:0===s?p.Gamer.AI:void 0}checkScore(e,t){let s=0,i=!1;for(let i of e.pawns)s+=i.owner===t?-1:1;return e.pawns.some(e=>e.owner===p.Gamer.AI)?e.pawns.some(e=>e.owner===p.Gamer.PLAYER)||(s*=-1e3,i=!0):(s*=1e3,i=!0),{score:s,hasWon:i}}nextMove(){h=0;let e=this.currentPlayer,t=-1/0,s=null,i=-1/0,l=1/0;for(let n of this.pawns)if(n.owner===e)for(let o of this.cells[n.cellIndex].connectingIndices){let r=o[0],a=o[1],c=this.cells[r].pawn;if(void 0!==a&&!this.cells[a].pawn&&c&&c.owner!==e){let o=n.cellIndex;n.cellIndex=a,this.cells[a].pawn=n,this.cells[o].pawn=null;let d=this.pawns.findIndex(e=>e.id===c.id);d>-1&&(this.cells[r].pawn=null,this.pawns.splice(d,1));let p=this.minimax(this,5,!1,e,i,l,`cap// pawn(${n.id}) ${o}-${a}`);this.pawns.splice(d,0,c),this.cells[c.cellIndex].pawn=c,n.cellIndex=o,this.cells[o].pawn=n,this.cells[r].pawn=c,this.cells[a].pawn=null,p>t&&(t=p,s={pawnId:n.id,targetCellIndex:a,capturedPawnId:c.id,bestScore:t})}else if(!c){let o=n.cellIndex;n.cellIndex=r,this.cells[r].pawn=n,this.cells[o].pawn=null;let a=this.minimax(this,5,!1,e,i,l,`mov// pawn(${n.id}) ${o}-${r}`);n.cellIndex=o,this.cells[o].pawn=n,this.cells[r].pawn=null,a>t&&(t=a,s={pawnId:n.id,targetCellIndex:r,bestScore:t})}}let n=this.pawns.find(e=>e.id===s?.pawnId);n&&s?.targetCellIndex!==void 0&&(this.cachedMove=s,this.state=n.state=1,n.targetCell=s.targetCellIndex)}minimax(e,t,s,i,l,n,o){++h;let{score:r,hasWon:a}=this.checkScore(e,i),c=i===p.Gamer.AI?p.Gamer.PLAYER:p.Gamer.AI;if(t<=0||a)return r*(t+1);if(s){let s=-1/0;for(let i of e.pawns)if(i.owner===c)for(let o of e.cells[i.cellIndex].connectingIndices){let r=o[0],a=o[1],d=e.cells[r].pawn;if(void 0!==a&&!e.cells[a].pawn&&d&&d.owner!==c){let o=i.cellIndex;i.cellIndex=a,e.cells[a].pawn=i,e.cells[o].pawn=null;let p=e.pawns.findIndex(e=>e.id===d.id);p>-1&&(e.cells[r].pawn=null,e.pawns.splice(p,1));let h=this.minimax(e,t-1,!1,c,l,n,`cap++ pawn(${i.id}) ${o}-${a}`);if(s=Math.max(h,s),e.pawns.splice(p,0,d),e.cells[d.cellIndex].pawn=d,i.cellIndex=o,e.cells[o].pawn=i,e.cells[r].pawn=d,e.cells[a].pawn=null,n<=(l=Math.max(l,h)))break}else if(!d){let o=i.cellIndex;i.cellIndex=r,e.cells[r].pawn=i,e.cells[o].pawn=null;let a=this.minimax(e,t-1,!1,c,l,n,`mov++ pawn(${i.id}) ${o}-${r}`);if(s=Math.max(a,s),i.cellIndex=o,e.cells[o].pawn=i,e.cells[r].pawn=null,n<=(l=Math.max(l,a)))break}}return s}{let s=1/0;for(let i of e.pawns)if(i.owner===c)for(let o of e.cells[i.cellIndex].connectingIndices){let r=o[0],a=o[1],d=e.cells[r].pawn;if(void 0!==a&&!e.cells[a].pawn&&d&&d.owner!==c){let o=i.cellIndex;i.cellIndex=a,e.cells[a].pawn=i,e.cells[o].pawn=null;let p=e.pawns.findIndex(e=>e.id===d.id);p>-1&&(e.cells[r].pawn=null,e.pawns.splice(p,1));let h=this.minimax(e,t-1,!0,c,l,n,`cap-- pawn(${i.id}) ${o}-${a}`);if(s=Math.min(h,s),e.pawns.splice(p,0,d),e.cells[d.cellIndex].pawn=d,i.cellIndex=o,e.cells[o].pawn=i,e.cells[r].pawn=d,e.cells[a].pawn=null,(n=Math.min(n,h))<=l)break}else if(!d){let o=i.cellIndex;i.cellIndex=r,e.cells[r].pawn=i,e.cells[o].pawn=null;let a=this.minimax(e,t-1,!0,c,l,n,`mov-- pawn(${i.id}) ${o}-${r}`);if(s=Math.min(a,s),i.cellIndex=o,e.cells[o].pawn=i,e.cells[r].pawn=null,(n=Math.min(n,a))<=l)break}}return s}}movePawn(e,t){if(!t)return e;let{pawnId:s,targetCellIndex:i,capturedPawnId:l}=t,n=e.pawns.find(e=>e.id===s);if(void 0!==n){let t=n.cellIndex;if(n.cellIndex=i,e.cells[i].pawn=n,e.cells[t].pawn=null,void 0!==l){let t=e.pawns.find(e=>e.id===l);if(!t)return e;let s=e.pawns.findIndex(e=>e.id===t?.id);s>-1&&(e.cells[t.cellIndex].pawn=null,e.pawns.splice(s,1))}}return e}update(e){for(let t=0;t<this.pawns.length;t++){let s=this.pawns[t];this.cells[s.cellIndex],s.update(e,this.offset.x,this.offset.y)}return this}draw(){this.p5.cursor(this.p5.ARROW);for(let e=0;e<this.cells.length;e++){let{x:t,y:s}=this.cells[e].pos,i=this.offset.x+t*this.size,l=this.offset.y+s*this.size,n=this.p5.createVector(i,l);if(this.cells[e].connectingIndices.forEach(e=>{let t=e[0],{x:s,y:n}=this.cells[t].pos;this.p5.strokeWeight(2),this.p5.stroke(255,.1),this.p5.line(i,l,this.offset.x+s*this.size,this.offset.y+n*this.size)}),this.showHelpers&&(this.p5.stroke(255),this.p5.strokeWeight(1),this.p5.noFill(),this.p5.text(`${this.cells[e].id}/  ${null!==this.cells[e].pawn?this.cells[e].pawn?.id:""}`,i+25,l-5)),(0===this.state||2===this.state)&&this.cells[e].pawn?.owner!==p.Gamer.AI){let e=this.p5.createVector(this.p5.mouseX,this.p5.mouseY).sub(n).mag();e<30&&(this.p5.cursor(this.p5.HAND),this.p5.noStroke(),this.p5.fill(255),this.p5.circle(n.x,n.y,this.p5.constrain(30-e,0,15)))}}for(let e of this.pawns)e.draw()}setValues(e,t){if("boolean"==typeof t){if("showHelpers"===e)this.showHelpers=t;else throw"Unsupported key passed to setValues()"}else if("number"==typeof t){if("size"===e)this.size=t;else throw"Unsupported key passed to setValues()"}else if(t instanceof s(d).Vector){if("offset"===e)this.offset=t;else throw"Unsupported key passed to setValues()"}}resetGame(e){let t={showHelpers:!1,currentPlayer:p.Gamer.PLAYER,offset:this.p5.createVector(150,150),size:100,...e};this.currentPlayer=t.currentPlayer,this.pawns=f(this.p5,this),this.cells=u(this.p5,this.pawns),this.state=0,this.showHelpers=t.showHelpers,this.offset=t.offset,this.size=t.size,this.onResolve=t.onResolve}},p=a("fK5g3");const x=document.getElementById("score-card"),m=document.getElementById("status");new(s(d))(t=>{let s={showHelpers:!1},i=new c.GUI({autoPlace:!1});function l(){let{innerWidth:e,innerHeight:s}=window,i=Math.min((e<s?e:s)-20,400)/5,l=t.createVector(e/2-2*i,s/2-2*i);return{cellSize:i,offset:l}}function n(e){let t=e===p.Gamer.PLAYER?"You Win!!":"You Loose!!";x&&(x.style.display="flex"),m&&(m.innerText=t)}i.domElement.id="gui",document.getElementById("gui")?.appendChild(i.domElement),i.add(s,"showHelpers").onChange(t=>{e.setValues("showHelpers",t)}),t.setup=()=>{t.createCanvas(window.innerWidth,window.innerHeight).parent("app"),t.background("white"),t.pixelDensity(1),t.colorMode(t.HSB),window.addEventListener("resize",()=>(function(t){t.resizeCanvas(window.innerWidth,window.innerHeight);let{cellSize:s,offset:i}=l();e.setValues("size",s),e.setValues("offset",i)})(t)),x&&(x.style.top=`${(window.innerHeight+400)/2+30}px`),x?.addEventListener("submit",i=>{i.preventDefault(),x.style.display="none";let{cellSize:o,offset:r}=l();e.resetGame({currentPlayer:p.Gamer.PLAYER,showHelpers:s.showHelpers,size:o,offset:r,onResolve:n}),t.loop()}),function(t){t.background(200,60,10);let{cellSize:i,offset:o}=l();(e=new I(t,{currentPlayer:p.Gamer.PLAYER,showHelpers:s.showHelpers,size:i,offset:o,onResolve:n})).currentPlayer===p.Gamer.PLAYER?t.loop():t.noLoop()}(t)},t.draw=()=>{t.background(200,60,10),e?.update(t.deltaTime).draw()}});
//# sourceMappingURL=board-game.edefa935.js.map
