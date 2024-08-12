function e(e){return e&&e.__esModule?e.default:e}var t=globalThis,i={},s={},r=t.parcelRequirebf15;null==r&&((r=function(e){if(e in i)return i[e].exports;if(e in s){var t=s[e];delete s[e];var r={id:e,exports:{}};return i[e]=r,t.call(r.exports,r,r.exports),r.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){s[e]=t},t.parcelRequirebf15=r),(0,r.register)("hMArn",function(t,i){Object.defineProperty(t.exports,"default",{get:()=>o,set:void 0,enumerable:!0,configurable:!0});var s=r("7Pz0b");let a=-1;var o=class{constructor(e,t){let i={pos:e.createVector(0,0),mass:1,velocity:e.createVector(0,0),acceleration:e.createVector(0,0),maxSpeed:15,maxForce:.25,wanderTheta:0,breakingThreshold:100,r:20,material:e.color("#00ffff"),perceptionRadius:30,repelRadius:20,visibilityAngle:Math.PI/3,wrapOnScreenEdge:!1,showHelpers:!1,...t};this.id=++a,this.p5=e,this.pos=i.pos,this.mass=i.mass,this.velocity=i.velocity,this.acceleration=i.acceleration,this.maxSpeed=i.maxSpeed,this.maxForce=i.maxForce,this.wanderTheta=i.wanderTheta,this.breakingThreshold=i.breakingThreshold,this.r=i.r,this.material=i.material,this.perceptionRadius=i.perceptionRadius,this.repelRadius=i.repelRadius,this.visibilityAngle=i.visibilityAngle,this.wrapOnScreenEdge=i.wrapOnScreenEdge,this.showHelpers=i.showHelpers,this.wanderTheta=0}setValues(e,t){if("number"==typeof t)switch(e){case"maxSpeed":this.maxSpeed=t;break;case"maxForce":this.maxForce=t;break;case"perceptionRadius":this.perceptionRadius=t;break;case"repelRadius":this.repelRadius=t;break;case"visibilityAngle":this.visibilityAngle=t;break;default:throw"Unsupported key passed to setValues()"}if("boolean"==typeof t){if("showHelpers"===e)this.showHelpers=t;else throw"Unsupported key passed to setValues()"}}draw(){return this.p5.push(),this.p5.translate(this.pos.x,this.pos.y),this.p5.rotate(this.velocity.heading()),this.showHelpers&&this.drawHelpers(),this.drawSprite(),this.p5.pop(),this}update(){return this.velocity.add(this.acceleration.limit(this.maxForce)),this.velocity.limit(this.maxSpeed),this.pos.add(this.velocity),this.wrapOnScreenEdge&&this.constraintWithinWindow(this.pos.x,this.pos.y),this.acceleration.set(0,0),this}applyForces(e){return e&&this.acceleration.add(e),this}drawSprite(){let e=this.r;return this.p5.stroke(this.material),this.p5.strokeWeight(1),this.p5.noFill(),this.p5.triangle(e,0,-e,e/2,-e,-e/2),this.p5.stroke(50),this}drawHelpers(){this.p5.noStroke(),this.p5.fill(255),this.p5.textSize(15),this.p5.text(this.id,0,0),this.p5.noFill(),this.velocity.mag()<this.maxSpeed?this.p5.stroke(0,80,50):this.p5.stroke(50),this.p5.strokeWeight(1),this.p5.circle(0,0,this.perceptionRadius),this.p5.fill(255,255,255,.3),this.p5.arc(0,0,this.perceptionRadius,this.perceptionRadius,-this.visibilityAngle,this.visibilityAngle);let e=this.p5.createVector(1,0).setMag(this.velocity.mag()).mult(20);return this.p5.line(0,0,e.x,e.y),this}seek(t,i=!1){if(!t)return this.p5.createVector();let r=e(s).Vector.sub(t,this.pos),a=this.maxSpeed;if(i){let e=r.mag();e<this.breakingThreshold&&(a=this.p5.map(e,0,this.breakingThreshold,0,this.maxSpeed))}return r.setMag(a),r.sub(this.velocity),r.limit(this.maxForce),r}flee(e){return null===e?null:this.seek(e).mult(-1)}pursue(e){let t=e.pos.copy(),i=e.velocity.copy();return i.mult(40),t.add(i),this.seek(t)}evade(e){let t=this.pursue(e);return t.mult(-1),t}arrive(e){return this.seek(e,!0)}wander(){let e=this.p5.PI/6,t=50*this.p5.cos(this.wanderTheta),i=50*this.p5.sin(this.wanderTheta),s=this.velocity.copy().setMag(100);return s.add(this.p5.createVector(t,i)),s.add(this.pos),this.constraintWithinWindow(this.pos.x,this.pos.y),this.wanderTheta+=this.p5.random(-e,e),this.seek(s)}pathFollow(e,t=!1){let i=this.velocity.copy().normalize().mult(50).add(this.pos);this.p5.strokeWeight(1),this.p5.stroke(255);let s=e.getClosestSegment(i.x,i.y,t);return s.length&&s.length>e.radius&&s.intersectionPosition?this.seek(s.intersectionPosition):this.velocity.copy()}groupBehaviour(t){let i=this.p5.createVector(),r=this.p5.createVector(),a=this.p5.createVector(),o=t.length;for(let h=0;h<o;h++){if(t[h]===this)continue;let n=this.velocity.copy().normalize().dot(t[h].velocity.copy().normalize()),p=e(s).Vector.dist(t[h].pos,this.pos);if(p>this.perceptionRadius||n>this.visibilityAngle)continue;i.add(t[h].velocity);let l=(this.perceptionRadius-p)/this.perceptionRadius;p>this.repelRadius&&r.add(t[h].pos);let d=this.pos.copy().sub(t[h].pos).div(l);a.add(d),this.p5.stroke(20),this.p5.strokeWeight(2),this.showHelpers&&this.p5.line(t[h].pos.x,t[h].pos.y,this.pos.x,this.pos.y),o-1>0&&(i.div(o-1).sub(this.velocity).setMag(this.maxSpeed),r.div(o-1).sub(this.pos).setMag(this.maxSpeed),a.div(o-1).sub(this.velocity).setMag(this.maxSpeed))}return{alignment:i,cohesion:r,separation:a}}constraintWithinWindow(e,t){let{innerWidth:i,innerHeight:s}=window;e<0&&(this.pos.x=i),e>i&&(this.pos.x=0),t<0&&(this.pos.y=s),t>s&&(this.pos.y=0)}}});var a=r("e93rA"),o=r("7Pz0b"),h=r("hMArn");let n=[];new(e(o))(t=>{let i={showHelpers:!1,alignmentWeight:1,cohesionWeight:1,separationWeight:1,maxSpeed:2,maxForce:.03,perceptionRadius:70,visibilityAngle:Math.PI/3,repelRadius:40},s=new a.GUI({autoPlace:!1});s.domElement.id="gui",document.getElementById("gui")?.appendChild(s.domElement),s.add(i,"showHelpers").onChange(e=>n.forEach(t=>{t.setValues("showHelpers",e)})),s.add(i,"maxSpeed",.1,10,.1).onChange(e=>n.forEach(t=>{t.setValues("maxSpeed",e)})),s.add(i,"maxForce",.01,2,.01).onChange(e=>n.forEach(t=>{t.setValues("maxForce",e)})),s.add(i,"perceptionRadius",.01,200,1).onChange(e=>n.forEach(t=>{t.setValues("perceptionRadius",e)})),s.add(i,"visibilityAngle",-Math.PI,Math.PI,.01).onChange(e=>n.forEach(t=>{t.setValues("visibilityAngle",e)})),s.add(i,"repelRadius",.01,200,1).onChange(e=>n.forEach(t=>{t.setValues("repelRadius",e)})),s.add(i,"alignmentWeight",0,1,.1),s.add(i,"cohesionWeight",0,1,.1),s.add(i,"separationWeight",0,1,.1),t.setup=()=>{t.createCanvas(window.innerWidth,window.innerHeight).parent("app"),t.background("white"),t.pixelDensity(1),t.colorMode(t.HSB),window.addEventListener("resize",()=>(function(e){e.resizeCanvas(window.innerWidth,window.innerHeight)})(t)),function(t){t.background(200,60,10),n=[];for(let s=0;s<20;s++)n.push(new h.default(t,{showHelpers:i.showHelpers,pos:t.createVector(t.random(window.innerWidth),t.random(window.innerHeight)),velocity:e(o).Vector.random2D().setMag(i.maxSpeed),maxSpeed:i.maxSpeed,maxForce:i.maxForce,perceptionRadius:i.perceptionRadius,visibilityAngle:i.visibilityAngle,wrapOnScreenEdge:!0}))}(t)},t.draw=()=>{t.background(200,60,10),function(e){let t=[];for(let i=0;i<e.length;i++){let s=e[i].groupBehaviour(e);t.push(s)}for(let s=0;s<e.length;s++)e[s].applyForces(t[s].cohesion.mult(i.cohesionWeight)).applyForces(t[s].alignment.mult(i.alignmentWeight)).applyForces(t[s].separation.mult(i.separationWeight)).update().draw()}(n)}});
//# sourceMappingURL=steering-behaviours-flocking.56483824.js.map
