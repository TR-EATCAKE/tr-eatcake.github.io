const G = 0.1
const K = 1000

const PARTICLE_WIDTH = 10
const PARTICLE_HEIGHT = 10
const PARTICLE_RADIUS = 5
const FPS = 60

var updateInterval;
var running = false;

var particles = [];
var all_tracing = false;

var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")

for(e of document.getElementsByClassName("numinput")){
	e.value = "0";
}
document.getElementById("m_particle_count").value = 1;
for (e of document.getElementsByClassName("colorinput")){
	e.value = "#FFFFFF"
}

var s_mass_slider = document.getElementById("s_particle_mass");
var s_mass_value = document.getElementById("s_mass_value");
s_mass_value.innerHTML += s_mass_slider.value;
s_mass_slider.oninput = function() {
  s_mass_value.innerHTML = "Parçacık Kütlesi: " + this.value;
}

var m_mass_slider = document.getElementById("m_particle_mass");
var m_mass_value = document.getElementById("m_mass_value");
m_mass_value.innerHTML += m_mass_slider.value;
m_mass_slider.oninput = function() {
  m_mass_value.innerHTML = "Parçacık Kütlesi: " + this.value;
}

var m_count_slider = document.getElementById("m_particle_count");
var m_count_value = document.getElementById("m_count_value");
m_count_value.innerHTML += m_count_slider.value;
m_count_slider.oninput = function() {
	m_count_value.innerHTML = "Parçacık Sayısı: " + this.value;
}

var total_particle_count = document.getElementById("total_particle_count");
total_particle_count.innerHTML += particles.length

class Vector2{
	constructor(x=0,y=0){
	    this.x = x;
	    this.y = y;
	}
	plus(vector){
	    return new Vector2(this.x+vector.x,this.y+vector.y)
	}
	minus(vector){
	    return new Vector2(this.x-vector.x, this.y-vector.y)
	}
	scale(n){
		return new Vector2(this.x*n, this.y*n)
	}
	normalize(){
	    if (this == new Vector2()){
			return this;
	    }else{
            return new Vector2(this.x/this.length, this.y/this.length);
	    }
	}
	get length(){
	    return Math.hypot(this.x,this.y)
	}
	set length(len){
		newVector = this.normalize().scale(len);
		this.x = newVector.x;
		this.y = newVector.y;
	}
}

class Particle{
	constructor(color="white", mass=1, position=new Vector2(), radius=PARTICLE_RADIUS){
		this.id = particles.length;
		this.color = color;
		this.mass = mass;
		this.magnitude = 0;
		this.position = position;
		this.radius = radius;
		this.force = new Vector2();
		this.acceleration = new Vector2();
		this.velocity = new Vector2();
		this.tracing = false;
		this.traces = [];
		this.trace_cooldown = 0;
		this.collisions = new Set();
	}
	spawn(){
		particles.push(this)
		this.draw()
	}
	momentum(){
		return this.velocity.multiply(this.mass)
	}
	energyK(){
		return 1/2*this.mass*this.velocity.length()*this.velocity.length()
	}
	update(){
		this.acceleration = this.force.scale(1/this.mass);
		this.velocity = this.velocity.plus(this.acceleration);
		this.position = this.position.plus(this.velocity);

		if (this.tracing){
			if (this.trace_cooldown == 0){
				this.traces.push(this.position)
				this.trace_cooldown = FPS/2;
			}else this.trace_cooldown --;
		}

		this.force = new Vector2();

		///this.force = new Vector2();
		///this.colliding = false;
		///var sets = [];
		///for (var i = 0; i<particles.length; i++){
		///	var start_i = i+1;
		///	for (var j = start_i; j<particles.length; j++){
		///		var p1 = particles[i];
		///		var p2 = particles[j];
		///		var rel_pos1 = p1.position.minus(p2.position);
		///		var rel_pos2 = p2.position.minus(p1.position);
		///		var distance = rel_pos1.length();
		///		var gravityForce;
		///	}
		///}
		////particles.forEach(p=>{
		////	if (p==this) return;
		////	var dx = vMinus(p.position, this.position)
		////	var ndx = vNormalized(dx)
		////	if (dx.length()<=this.radius+p.radius){
		////		this.colliding = true
		////		var angleDX = Math.atan2(-dx.y, dx.x)
		////		this.velocity.minus(vScaled(ndx, this.velocity.length()*Math.cos(Math.atan2(-this.velocity.y,this.velocity.x)-angleDX)))
		////		p.velocity.minus(vScaled(ndx, -p.velocity.length()*Math.cos(Math.atan2(-p.velocity.y,p.velocity.x)+angleDX)))
		////	}else{
		////		var Gforce = vScaled(ndx, (G*this.mass*p.mass)/(dx.length()*dx.length()))
		////		this.force = vPlus(this.force, Gforce);
		////		var Mforce = vScaled(ndx, -(K*this.magnitude*p.magnitude)/(dx.length()*dx.length()))
		////		this.force = vPlus(this.force, Mforce)
		////	}
		////})
		////this.acceleration = vScaled(this.force, 1/this.mass)
		////this.velocity = vPlus(this.velocity, this.acceleration)
		////this.position = vPlus(this.position, this.velocity)
		////if (this.tracing){
		////	this.traces.push(this.position)
		}
		/*
		if (this.position.x >= canvas.width-PARTICLE_WIDTH){
			this.velocity.x *= -1
			this.position.x = canvas.width-PARTICLE_WIDTH
		}
		if (this.position.x <= 0){
			this.velocity.x*=-1
			this.position.x = 0
		}
		if (this.position.y>=canvas.height-PARTICLE_HEIGHT){
			this.velocity.y*=-1
			this.position.y = canvas.height-PARTICLE_HEIGHT
		}
		if (this.position.y<=0){
			this.velocity.y*=-1
			this.position.y=0
		}
		KENARDAN SEKME KODU */
	////}
	draw(){
		ctx.fillStyle = this.color;
		if (this.tracing && all_tracing){
			this.traces.forEach(trace=>{
				ctx.beginPath()
				ctx.arc(trace.x, trace.y, 1.5,0,2*Math.PI)
				ctx.fill()
			})
		}
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y,this.radius,0,2*Math.PI);
		ctx.fill()
	}
}

function spawnSingle(color, mass, x, y, vx, vy, tracing){
	var p = new Particle(color, parseFloat(mass), new Vector2(parseFloat(x),parseFloat(y)));
	p.velocity = new Vector2(parseFloat(vx), parseFloat(vy));
	if (tracing) p.tracing = true;
	p.spawn();
	total_particle_count.innerHTML = "Toplam Parçacık Sayısı: " + particles.length
}

function spawnMultiple(color, mass, count, randomvelocity){
	for (i=0;i<parseInt(count);i++){
		var p = new Particle(color, parseFloat(mass), new Vector2(Math.random()*canvas.width,Math.random()*canvas.height))
		if (randomvelocity){
			p.velocity = new Vector2(Math.random(),Math.random());
		}
		p.spawn()
		total_particle_count.innerHTML = "Toplam Parçacık Sayısı: " + particles.length
	}
}

function tracing(){
	if (all_tracing){
		all_tracing = false;
		document.getElementById("tracebtn").innerHTML = "Yörüngeleri Çiz: Kapalı";
	}else{
		all_tracing = true;
		document.getElementById("tracebtn").innerHTML = "Yörüngeleri Çiz: Açık";
	}
}

function start(){
	if (running){
		running = false;
		document.getElementById("startbtn").innerHTML = "Başlat";
		clearInterval(updateInterval);
	}else{
		running = true;
		document.getElementById("startbtn").innerHTML = "Durdur";
	
		updateInterval = setInterval(()=>{
			Update()
		},1000/FPS)
	}
}

function reset(){
	running = false;
	document.getElementById("startbtn").innerHTML = "Başlat";
	clearInterval(updateInterval);
	particles = [];
	all_tracing = false;
	document.getElementById("tracebtn").innerHTML = "Yörüngeleri Çiz: Kapalı";
	total_particle_count.innerHTML = "Toplam Parçacık Sayısı: " + particles.length
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width, canvas.height)
}

function Update(){
	ctx.fillStyle = "black";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	for (var i = 0; i<particles.length; i++){
			var start_i = i+1;
			for (var j = start_i; j<particles.length; j++){
				var p1 = particles[i];
				var p2 = particles[j];

				var rel_pos1 = p1.position.minus(p2.position);
				var rel_pos2 = p2.position.minus(p1.position);
				var distance = rel_pos1.length;

				if (distance <= p1.radius+p2.radius){
					p1.collisions.add(p2.id);
					p2.collisions.add(p1.id);
				}else{
					p1.collisions.delete(p2.id);
					p2.collisions.delete(p1.id);
				}
				var gravity_scale = (G*p1.mass*p2.mass)/(distance*distance);
				if (!p1.collisions.has(p2.id)){
					p1.force = p1.force.plus(rel_pos2.normalize().scale(gravity_scale));
					p2.force = p2.force.plus(rel_pos1.normalize().scale(gravity_scale));
				}
			}
			particles[i].update();
			particles[i].draw();
		}
}

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);