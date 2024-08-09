function e(e){return e&&e.__esModule?e.default:e}function t(e,t,s,i){Object.defineProperty(e,t,{get:s,set:i,enumerable:!0,configurable:!0})}var s=globalThis,i={},r={},a=s.parcelRequirebf15;null==a&&((a=function(e){if(e in i)return i[e].exports;if(e in r){var t=r[e];delete r[e];var s={id:e,exports:{}};return i[e]=s,t.call(s.exports,s,s.exports),s.exports}var a=Error("Cannot find module '"+e+"'");throw a.code="MODULE_NOT_FOUND",a}).register=function(e,t){r[e]=t},s.parcelRequirebf15=a);var o=a.register;o("hMArn",function(s,i){t(s.exports,"default",()=>n);var r=a("7Pz0b");let o=-1;var n=class{constructor(e,t){let s={pos:e.createVector(0,0),mass:1,velocity:e.createVector(0,0),acceleration:e.createVector(0,0),maxSpeed:15,maxForce:.25,wanderTheta:0,breakingThreshold:100,r:20,material:e.color("#00ffff"),perceptionRadius:30,repelRadius:20,wrapOnScreenEdge:!1,showHelpers:!1,...t};this.id=++o,this.p5=e,this.pos=s.pos,this.mass=s.mass,this.velocity=s.velocity,this.acceleration=s.acceleration,this.maxSpeed=s.maxSpeed,this.maxForce=s.maxForce,this.wanderTheta=s.wanderTheta,this.breakingThreshold=s.breakingThreshold,this.r=s.r,this.material=s.material,this.perceptionRadius=s.perceptionRadius,this.wrapOnScreenEdge=s.wrapOnScreenEdge,this.showHelpers=s.showHelpers,this.wanderTheta=0}setValues(e,t){if("number"==typeof t)switch(e){case"maxSpeed":this.maxSpeed=t;break;case"maxForce":this.maxForce=t;break;case"perceptionRadius":this.perceptionRadius=t;break;case"repelRadius":this.repelRadius=t;break;default:throw"Unsupported key passed to setValues()"}if("boolean"==typeof t){if("showHelpers"===e)this.showHelpers=t;else throw"Unsupported key passed to setValues()"}}draw(){return this.p5.push(),this.p5.translate(this.pos.x,this.pos.y),this.showHelpers&&this.drawHelpers(),this.p5.rotate(this.velocity.heading()),this.drawSprite(),this.p5.pop(),this}update(){return this.velocity.add(this.acceleration.limit(this.maxForce)),this.velocity.limit(this.maxSpeed),this.pos.add(this.velocity),this.wrapOnScreenEdge&&this.constraintWithinWindow(this.pos.x,this.pos.y),this.acceleration.set(0,0),this}applyForces(e){return e&&this.acceleration.add(e),this}drawSprite(){let e=this.r;return this.p5.stroke(this.material),this.p5.strokeWeight(1),this.p5.noFill(),this.p5.triangle(e,0,-e,e/2,-e,-e/2),this.p5.stroke(50),this}drawHelpers(){this.p5.noStroke(),this.p5.fill(255),this.p5.textSize(15),this.p5.text(this.id,0,0),this.p5.noFill(),this.velocity.mag()<this.maxSpeed?this.p5.stroke(0,80,50):this.p5.stroke(50),this.p5.strokeWeight(1),this.p5.circle(0,0,this.perceptionRadius);let e=this.velocity.copy().mult(20);return this.p5.line(0,0,e.x,e.y),this}seek(t,s=!1){if(!t)return this.p5.createVector();let i=e(r).Vector.sub(t,this.pos),a=this.maxSpeed;if(s){let e=i.mag();e<this.breakingThreshold&&(a=this.p5.map(e,0,this.breakingThreshold,0,this.maxSpeed))}return i.setMag(a),i.sub(this.velocity),i.limit(this.maxForce),i}flee(e){return null===e?null:this.seek(e).mult(-1)}pursue(e){let t=e.pos.copy(),s=e.velocity.copy();return s.mult(40),t.add(s),this.seek(t)}evade(e){let t=this.pursue(e);return t.mult(-1),t}arrive(e){return this.seek(e,!0)}wander(){let e=this.p5.PI/6,t=50*this.p5.cos(this.wanderTheta),s=50*this.p5.sin(this.wanderTheta),i=this.velocity.copy().setMag(100);return i.add(this.p5.createVector(t,s)),i.add(this.pos),this.constraintWithinWindow(this.pos.x,this.pos.y),this.wanderTheta+=this.p5.random(-e,e),this.seek(i)}pathFollow(e){let t=this.velocity.copy().normalize().mult(50).add(this.pos);this.p5.strokeWeight(1),this.p5.stroke(255);let s=e.getClosestSegment(t.x,t.y);return s.length&&s.length>e.radius&&s.intersectionPosition?this.seek(s.intersectionPosition):this.velocity.copy()}groupBehaviour(t){let s=this.p5.createVector(),i=this.p5.createVector(),a=this.p5.createVector(),o=t.length;for(let n=0;n<o;n++){if(t[n]===this)continue;let h=e(r).Vector.dist(t[n].pos,this.pos);if(h>this.perceptionRadius)continue;s.add(t[n].velocity),h>this.repelRadius&&i.add(t[n].pos);let p=this.pos.copy().sub(t[n].pos);a.add(p),this.p5.stroke(20),this.p5.strokeWeight(2),this.showHelpers&&this.p5.line(t[n].pos.x,t[n].pos.y,this.pos.x,this.pos.y),o-1>0&&(s.div(o-1).sub(this.velocity).setMag(this.maxSpeed),i.div(o-1).sub(this.pos).setMag(this.maxSpeed),a.div(o-1).sub(this.velocity).setMag(this.maxSpeed))}return{alignment:s,cohesion:i,separation:a}}constraintWithinWindow(e,t){let{innerWidth:s,innerHeight:i}=window;e<0&&(this.pos.x=s),e>s&&(this.pos.x=0),t<0&&(this.pos.y=i),t>i&&(this.pos.y=0)}}}),o("fK5g3",function(e,s){var i,r;t(e.exports,"defaultEntityConfig",()=>a),t(e.exports,"defaultEdgeConfig",()=>o),t(e.exports,"MOUSE_BTN",()=>i);let a={r:5},o={top:!0,right:!0,bottom:!0,left:!0};(r=i||(i={}))[r.LEFT=0]="LEFT",r[r.MIDDLE=1]="MIDDLE",r[r.RIGHT=2]="RIGHT"});var n=a("e93rA"),h=a("7Pz0b"),p=a("hMArn"),l=a("fK5g3");let c=[],d=null;new(e(h))(e=>{let t={showHelpers:!1,maxSpeed:4,maxForce:.1,mode:"Wander"},s=new n.GUI({autoPlace:!1});function i(e){switch(e.background(200,60,10),d=e.createVector(window.innerWidth/2,window.innerHeight/2),t.mode){case"Seek":r(e);break;case"Flee":c=[],r(e),d=d||e.createVector(window.innerWidth/2,window.innerHeight/2);break;case"Pursuit":c=[new p.default(e,{pos:e.createVector(window.innerWidth,window.innerHeight),maxSpeed:t.maxSpeed,maxForce:t.maxForce,showHelpers:t.showHelpers}),new p.default(e,{pos:e.createVector(200,300),maxSpeed:4,maxForce:.3,material:e.color("#0000ff"),showHelpers:t.showHelpers})],d=d||e.createVector(window.innerWidth/2,window.innerHeight/2);break;case"Evade":c=[new p.default(e,{pos:e.createVector(300,300),maxSpeed:t.maxSpeed,maxForce:t.maxForce,showHelpers:t.showHelpers}),new p.default(e,{pos:e.createVector(400,300),maxSpeed:2,maxForce:.1,material:e.color("#0000ff"),showHelpers:t.showHelpers})],d=d||e.createVector(window.innerWidth/2,window.innerHeight/2);break;case"Arrive":c=[new p.default(e,{pos:e.createVector(300,300),maxSpeed:t.maxSpeed,maxForce:t.maxForce,showHelpers:t.showHelpers})],d=d||e.createVector(window.innerWidth/2,window.innerHeight/2);break;case"Wander":c=[new p.default(e,{pos:e.createVector(window.innerWidth/2,window.innerHeight/2),maxSpeed:t.maxSpeed,maxForce:t.maxForce,showHelpers:t.showHelpers})],d=null}}function r(e){(c=[]).push(new p.default(e,{pos:e.createVector(200,300),maxSpeed:t.maxSpeed,maxForce:t.maxForce,showHelpers:t.showHelpers})),d=d||e.createVector(window.innerWidth/2,window.innerHeight/2)}s.domElement.id="gui",document.getElementById("gui")?.appendChild(s.domElement),s.add(t,"mode",["Seek","Flee","Pursuit","Evade","Arrive","Wander"]).name("Example Type").onChange(t=>{i(e)}),s.add(t,"showHelpers").onChange(e=>c.forEach((t,s)=>{t.setValues("showHelpers",e)})),s.add(t,"maxSpeed",.1,10,.1).onChange(e=>c.forEach((t,s)=>{0===s&&t.setValues("maxSpeed",e)})),s.add(t,"maxForce",.01,2,.01).onChange(e=>c.forEach((t,s)=>{0===s&&t.setValues("maxForce",e)})),e.setup=()=>{e.createCanvas(window.innerWidth,window.innerHeight).parent("app"),e.background("white"),e.pixelDensity(1),e.colorMode(e.HSB),window.addEventListener("resize",()=>(function(e){e.resizeCanvas(window.innerWidth,window.innerHeight)})(e)),i(e)},e.draw=()=>{var s;switch(e.background(200,60,10),(s=d)&&(e.push(),e.translate(s.x,s.y),e.noFill(),e.stroke(0,100,70),e.circle(0,0,5),e.rotate(e.PI/4),e.rectMode(e.CENTER),e.rect(0,0,10),e.pop()),t.mode){case"Seek":(function(){for(let e=0;e<c.length;e++){let t=c[e].seek(d);c[e].applyForces(t),c[e].update(),c[e].draw()}})();break;case"Flee":(function(){for(let e=0;e<c.length;e++){let t=c[e].flee(d);c[e].applyForces(t),c[e].update(),c[e].draw()}})();break;case"Pursuit":(function(){let e=c[0],t=c[1],s=t.seek(d);t.applyForces(s);let i=e.pursue(t);e.applyForces(i);for(let e=0;e<c.length;e++)c[e].update(),c[e].draw()})();break;case"Evade":(function(){let e=c[0],t=c[1],s=e.seek(d);e.applyForces(s);let i=t.evade(e);t.applyForces(i);for(let e=0;e<c.length;e++)c[e].update(),c[e].draw()})();break;case"Arrive":(function(){let e=c[0],t=e.arrive(d);e.applyForces(t);for(let e=0;e<c.length;e++)c[e].update(),c[e].draw()})();break;case"Wander":(function(){let e=c[0],t=e.wander();e.applyForces(t);for(let e=0;e<c.length;e++)c[e].update(),c[e].draw()})()}},e.mouseClicked=s=>{if(s.button!==l.MOUSE_BTN.LEFT)return!1;switch(t.mode){case"Seek":case"Flee":case"Pursuit":case"Evade":case"Arrive":d=e.createVector(s.clientX,s.clientY);break;case"Wander":d=null}return!1}});
//# sourceMappingURL=basic-steering-behaviours.e1337483.js.map
