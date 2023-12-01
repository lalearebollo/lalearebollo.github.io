let img;
let toggle = false;

var inc = 0.1;
var scl = 10;
var cols, rows;
var zoff = 0;

var fr;

var particles = [];
var flowfield;

function setup() {
  createCanvas(500, 500);
  cols = floor(width/scl);
  rows = floor(height/scl);
  fr = createP(''); 
  
  flowfield = new Array(cols * rows);
  
  for (var i = 0; i < 15000; i++){
    particles[i] = new particle();
  }
  img = loadImage('wemb1.jpg');
}

function particle(){
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 4;
  
  this.prevPos = this.pos.copy();
  
  this.update = function(){
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  this.follow = function(vectors){
    var x = floor(this.pos.x / scl);
    var y = floor(this.pos.y / scl);
    var index = x + y * cols;
    var force = vectors[index];
    this.applyForce(force);
  }
  
  this.applyForce = function(force){
    this.acc.add(force);
  }
  
  this.show = function(){
    let f = get(this.pos.x, this.pos.y);
    stroke(f, 5);
    strokeWeight(0.863); 
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  }
  
  this.updatePrev = function(){
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  this.edges = function(){
    if (this.pos.x > width){
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0){
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height){
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0){
      this.pos.x = height;
      this.updatePrev();
    }
  }
}

function draw() {
  if (toggle == false){
    image(img,0, 0, 500, 500);
    toggle = true;
  }
  var yoff = 0;
  for (var y = 0; y < rows; y++){
    var xoff = 0;
    for(var x = 0; x < cols; x++){
      var index = x + y * cols;
      var angle = noise(xoff, yoff, zoff) * TWO_PI * 3;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(0.5);
      flowfield[index] = v;
      xoff += inc;
      stroke(0, 50);
    }
    yoff += inc;
    zoff += 0.0001;
  }
  for (var i = 0; i < particles.length; i++){
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  print(particles.length);
}