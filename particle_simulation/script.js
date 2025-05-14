const G = 0.1;
const K = 1000;

const PARTICLE_WIDTH = 10;
const PARTICLE_HEIGHT = 10;
const PARTICLE_RADIUS = 5;
const TRACE_RADIUS = 1.5;
const FPS = 60;

var updateInterval;
var running = false;

var particles = [];
var collisions = [];
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

	normalize(){
	    if (this.length == 0) return;
        this.x /= this.length;
        this.y /= this.length;
	}

	normalized(){
		if (this.length == 0) return new Vector2(0,0);
		return new Vector2(this.x/this.length, this.y/this.length);
	}

	scale(n){
		this.x *= n;
		this.y *= n;
	}

	scaled(n){
		return new Vector2(this.x*n, this.y*n);
	}

	static add(v1, v2){
		return new Vector2(v1.x + v2.x, v1.y + v2.y);
	}
	static subtract(v1, v2){
		return new Vector2(v1.x - v2.x, v1.y - v2.y);
	}
	static multiply(v, n){
		return new Vector2(v.x * n, v.y * n);
	}
	static dot(v1, v2){
		return v1.x * v2.x + v1.y * v2.y;
	}

	get length(){
	    return Math.hypot(this.x,this.y)
	}

	set length(len){
		this.normalize();
		this.x *= len;
		this.y *= len;
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
	get is_colliding(){
		return (this.collisions.size != 0);
	}
	get momentum(){
		return this.velocity.scale(this.mass);
	}
	get kineticEnergy(){
		return 1/2*this.mass*this.velocity.length*this.velocity.length;
	}
	spawn(){
		particles.push(this);
		this.draw();
	}
	update(){
		this.acceleration = this.force.scaled(1/this.mass);
		this.velocity = Vector2.add(this.velocity, this.acceleration);
		this.position = Vector2.add(this.position, this.velocity);

		if (this.is_colliding){
			for (var c of this.collisions){
				var distance = Vector2.subtract(this.position, particles[c].position);
				var overlap = this.radius + particles[c].radius - distance.length;
				this.position = Vector2.add(this.position, distance.normalized().scaled(overlap/2));
				particles[c].position = Vector2.add(particles[c].position, distance.normalized().scaled(-overlap/2));
				distance = Vector2.subtract(this.position, particles[c].position);
				var u1 = 2 * particles[c].mass * Vector2.dot(Vector2.subtract(particles[c].velocity, this.velocity), distance) / ((this.mass + particles[c].mass) * distance.length * distance.length);
				var u2 = 2 * this.mass * Vector2.dot(Vector2.subtract(this.velocity, particles[c].velocity), distance) / ((this.mass + particles[c].mass) * distance.length * distance.length);
				this.velocity = Vector2.add(this.velocity, distance.scaled(u1));
				particles[c].velocity = Vector2.add(particles[c].velocity, distance.scaled(u2));
				this.collisions.delete(particles[c].id);
				particles[c].collisions.delete(this.id);
			}
		}

		if (this.tracing){
			if (this.trace_cooldown == 0){
				this.trace_cooldown = FPS/5;
				if (this.position.x > canvas.width+this.radius || this.position.x < -this.radius || this.position.y > canvas.height+this.radius || this.position.y < -this.radius) return;
				this.traces.push(this.position)
			}else this.trace_cooldown --;
		}

		this.force = new Vector2();
	}
	draw(){
		ctx.fillStyle = this.color;
		if (this.tracing && all_tracing){
			this.traces.forEach(trace=>{
				ctx.beginPath()
				ctx.arc(trace.x, trace.y, TRACE_RADIUS,0,2*Math.PI)
				ctx.fill()
			})
		}
		if (this.position.x > canvas.width+this.radius || this.position.x < -this.radius || this.position.y > canvas.height+this.radius || this.position.y < -this.radius) return;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y,this.radius,0,2*Math.PI);
		ctx.fill()
	}
}

function spawnSingle(color, mass, x, y, vx, vy, tracing){
	var p = new Particle(color, parseFloat(mass), new Vector2(parseFloat(x),parseFloat(y)));
	p.velocity = new Vector2(parseFloat(vx), parseFloat(vy));
	p.tracing = tracing;
	p.spawn();
	total_particle_count.innerHTML = "Toplam Parçacık Sayısı: " + particles.length
}

function spawnMultiple(color, mass, count, tracing, randomvelocity){
	for (i=0;i<parseInt(count);i++){
		var p = new Particle(color, parseFloat(mass), new Vector2(Math.random()*canvas.width,Math.random()*canvas.height))
		p.tracing = tracing;
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
			for (var j = i+1; j<particles.length; j++){
				var p1 = particles[i];
				var p2 = particles[j];

				var rel_pos1 = Vector2.subtract(p1.position, p2.position);
				var rel_pos2 = Vector2.subtract(p2.position, p1.position);
				var distance = rel_pos1.length;

				if (distance < p1.radius+p2.radius){
					p1.collisions.add(p2.id);
					p2.collisions.add(p1.id);
				}
				var gravity_scale = (G*p1.mass*p2.mass)/(distance*distance);
				if (!p1.collisions.has(p2.id)){
					p1.force = Vector2.add(p1.force, rel_pos2.normalized().scaled(gravity_scale));
					p2.force = Vector2.add(p2.force, rel_pos1.normalized().scaled(gravity_scale));
				}
			}
			particles[i].update();
			particles[i].draw();
		}
}

ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width,canvas.height);