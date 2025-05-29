import { Vector2 } from "./Vector2.js";
import { Shape, Circle, Rectangle } from "./Shapes.js";
import { PhysicsManager } from "./PhysicsManager.js";

export class PhysicsObject{

    isDynamic = true;
    onGround = false;
    collisions = [];

    gravityScale = 1;

    velocity = new Vector2(0, 0);
    acceleration = new Vector2(0, 0);
    force = new Vector2(0, 0);

    angle = 0;
    angularVelocity = 0;
    angularAcceleration = 0;
    
    constructor(position, mass=1, shape=new Circle()) {
        this.position = position;
        this.mass = mass;
        this.shape = shape;
    }

    get copy(){
        var copy = new PhysicsObject(this.position.copy, this.mass, this.shape.copy);
        copy.isDynamic = this.isDynamic;
        return copy;
    }

    addPosition(position) {
        this.position.add(position);
    }

    addVelocity(velocity) {
        this.velocity.add(velocity);
    }

    addAcceleration(acceleration) {
        this.acceleration.add(acceleration);
    }

    addForce(force) {
       this.force.add(force);
    }

    addCollision(other) {
        this.collisions.push(other);
    }

    setDynamic() {
        this.isDynamic = true;
    }

    setStatic() {
        this.isDynamic = false;
    }

    update(deltaTime) {
        if (this.isDynamic){
            this.acceleration = this.force.scaled(1/this.mass);
            this.addVelocity(this.acceleration.scaled(deltaTime));
            if (this.velocity.magnitude < 2) this.velocity = new Vector2(0, 0);
            this.addPosition(this.velocity.scaled(deltaTime));

            this.angularVelocity += this.angularAcceleration * deltaTime;
            this.angle += this.angularVelocity * deltaTime;
        }
        this.force = new Vector2(0, 0);
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        this.shape.draw(ctx);
        ctx.restore();
    }

}