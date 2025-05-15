import { Vector2 } from "./Vector2.js";
import { Shape, Circle, Rectangle } from "./Shapes.js";

export class PhysicsObject{

    isDynamic = true;
    collisions = [];

    velocity = new Vector2(0, 0);
    acceleration = new Vector2(0, 0);
    force = new Vector2(0, 0);

    rotation = 0;
    angularVelocity = 0;
    angularAcceleration = 0;
    
    constructor(position, mass=1, shape=new Circle()) {
        this.position = position;
        this.mass = mass;
        this.shape = shape;
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
        this.rotation = this.rotation % (Math.PI * 2);
        if (this.isDynamic){
            this.acceleration = this.force.scaled(1/this.mass);
            this.addVelocity(this.acceleration.scaled(deltaTime));
            this.addPosition(this.velocity.scaled(deltaTime));

            this.angularVelocity += this.angularAcceleration * deltaTime;
            this.rotation += this.angularVelocity * deltaTime;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.rotation);
        this.shape.draw(ctx);
        ctx.restore();
    }

}