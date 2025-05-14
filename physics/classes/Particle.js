export class Particle{
    constructor(x=0, y=0, mass=1, shape=new Circle()) {
        this.position = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);
        this.acceleration = new Vector2(0, 0);
        this.mass = mass;
        this.force = new Vector2(0, 0);

    }
}