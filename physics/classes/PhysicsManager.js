import { Vector2 } from "./Vector2.js";
import { Shape, Circle, Rectangle } from "./Shapes.js";
import { App } from "./App.js";

export class PhysicsManager{

    static GRAVITY = 981; // Pixels per second squared - 1 pixel = 1 centimeter
    
    static objects = [];
    static totalKineticEnergy = 0;
    static totalPotentialEnergy = 0;

    static addObject(object){
        this.objects.push(object);
        return object;
    }

    static removeObject(object){
        const index = this.objects.indexOf(object);
        if (index > -1) this.objects.splice(index, 1);
    }

    static update(deltaTime){
        this.totalKineticEnergy = 0;
        this.totalPotentialEnergy = 0;

        for (let i = 0; i < this.objects.length; i++) {
            const objectA = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const objectB = this.objects[j];
                if (this.checkCollision(objectA, objectB)){
                    this.handleCollision(objectA, objectB, deltaTime);
                }
            }
            if (!objectA.onGround) objectA.addForce(new Vector2(0, objectA.mass * this.GRAVITY * objectA.gravityScale));
            objectA.update(deltaTime);
            this.totalKineticEnergy += objectA.velocity.magnitude * objectA.velocity.magnitude * objectA.mass / 2;
            this.totalPotentialEnergy += (App.canvas.height - objectA.position.y) * this.GRAVITY * objectA.mass;
        }
        
    }

    static checkCollision(objectA, objectB){
        if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.CIRCLE){
            return this.checkCircleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.RECTANGLE){
            return this.checkRectangleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.RECTANGLE){
            return this.checkCircleRectangleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.CIRCLE){
            return this.checkCircleRectangleCollision(objectB, objectA);
        }
    }

    static checkCircleCollision(circleA, circleB){
        const distance = Vector2.subtract(circleB.position, circleA.position);
        return distance.magnitude < (circleA.shape.radius + circleB.shape.radius);
    }

    static checkRectangleCollision(rectangleA, rectangleB){
        
        return (
            rectangleA.position.x + rectangleA.shape.width / 2 > rectangleB.position.x - rectangleB.shape.width / 2 &&
            rectangleA.position.x - rectangleA.shape.width / 2 < rectangleB.position.x + rectangleB.shape.width / 2 &&
            rectangleA.position.y + rectangleA.shape.height / 2 > rectangleB.position.y - rectangleB.shape.height / 2 &&
            rectangleA.position.y - rectangleA.shape.height / 2 < rectangleB.position.y + rectangleB.shape.height / 2
        );

    }

    static checkCircleRectangleCollision(circle, rectangle){
        var N = new Vector2(
            Math.max(rectangle.position.x-rectangle.shape.width/2, Math.min(rectangle.position.x+rectangle.shape.width/2, circle.position.x)),
            Math.max(rectangle.position.y-rectangle.shape.height/2, Math.min(rectangle.position.y+rectangle.shape.height/2, circle.position.y))
        );

        var distance = Vector2.subtract(circle.position, N);

        return distance.magnitude < circle.shape.radius;
    }

    static handleCollision(objectA, objectB, collisionTime){
        if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.CIRCLE){
            this.handleCircleCollision(objectA, objectB, collisionTime);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.RECTANGLE){
            this.handleRectangleCollision(objectA, objectB, collisionTime);
        }
        else if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.RECTANGLE){
            this.handleCircleRectangleCollision(objectA, objectB, collisionTime);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.CIRCLE){
            this.handleCircleRectangleCollision(objectB, objectA, collisionTime);
        }

    }

    static handleCircleCollision(circleA, circleB, collisionTime){

        var uA, uB;

        var distance = Vector2.subtract(circleB.position, circleA.position);
        const normal = distance.normalized();
        const overlap = circleA.shape.radius + circleB.shape.radius - distance.magnitude;

        if (circleA.isDynamic && circleB.isDynamic){
            circleA.addPosition(normal.scaled(-overlap / 2));
            circleB.addPosition(normal.scaled(overlap / 2));

            distance = Vector2.subtract(circleB.position, circleA.position);

            var factor = 2 * Vector2.subtract(circleB.velocity, circleA.velocity).dot(normal) / ((circleA.mass + circleB.mass));

            uA = normal.scaled(factor * circleB.mass);
            uB = normal.scaled(-factor * circleA.mass);

        }else if (circleA.isDynamic){
            circleA.addPosition(normal.scaled(-overlap));
            distance = Vector2.subtract(circleB.position, circleA.position);
            uA = normal.scaled(-2 * circleA.velocity.dot(normal));
            uB = new Vector2(0, 0);
        }else if (circleB.isDynamic){
            circleB.addPosition(normal.scaled(overlap));
            distance = Vector2.subtract(circleB.position, circleA.position);
            uA = new Vector2(0, 0);
            uB = normal.scaled(-2 * circleB.velocity.dot(normal));
        }

        circleA.addVelocity(uA);
        circleB.addVelocity(uB);

        //circleA.addForce(uA.scaled(1/collisionTime));
        //circleB.addForce(uB.scaled(1/collisionTime));

    }

    static handleRectangleCollision(rectangleA, rectangleB, collisionTime){

        // Calculate overlap along x and y axes
    const dx = rectangleA.position.x - rectangleB.position.x;
    const px = (rectangleA.shape.width / 2 + rectangleB.shape.width / 2) - Math.abs(dx);

    const dy = rectangleA.position.y - rectangleB.position.y;
    const py = (rectangleA.shape.height / 2 + rectangleB.shape.height / 2) - Math.abs(dy);

    if (px <= 0 || py <= 0) return; // No overlap

    // Find the axis of minimum penetration
    let normal;
    let overlap;
    if (px < py) {
        normal = new Vector2(Math.sign(dx), 0);
        overlap = px;
    } else {
        normal = new Vector2(0, Math.sign(dy));
        overlap = py;
    }

    // Position correction: only move dynamic rectangles
    if (rectangleA.isDynamic && rectangleB.isDynamic) {
        rectangleA.addPosition(normal.scaled(overlap / 2));
        rectangleB.addPosition(normal.scaled(-overlap / 2));
    } else if (rectangleA.isDynamic) {
        rectangleA.addPosition(normal.scaled(overlap));
    } else if (rectangleB.isDynamic) {
        rectangleB.addPosition(normal.scaled(-overlap));
    }

    // Velocity resolution (elastic collision)
    const relVel = Vector2.subtract(rectangleA.velocity, rectangleB.velocity);
    const velAlongNormal = relVel.dot(normal);

    let uA = new Vector2(0, 0);
    let uB = new Vector2(0, 0);

    if (rectangleA.isDynamic && rectangleB.isDynamic) {
        const factor = 2 * velAlongNormal / (rectangleA.mass + rectangleB.mass);
        uA = normal.scaled(-factor * rectangleB.mass);
        uB = normal.scaled(factor * rectangleA.mass);
    } else if (rectangleA.isDynamic) {
        uA = normal.scaled(-2 * velAlongNormal);
    } else if (rectangleB.isDynamic) {
        uB = normal.scaled(2 * velAlongNormal);
    }

    rectangleA.addVelocity(uA);
    rectangleB.addVelocity(uB);

        
        
    }

    static handleCircleRectangleCollision(circle, rectangle, collisionTime){
        
        var N = new Vector2(
            Math.max(rectangle.position.x-rectangle.shape.width/2, Math.min(rectangle.position.x+rectangle.shape.width/2, circle.position.x)),
            Math.max(rectangle.position.y-rectangle.shape.height/2, Math.min(rectangle.position.y+rectangle.shape.height/2, circle.position.y))
        );

        var distance = Vector2.subtract(circle.position, N);
        
        if (distance.magnitude == 0){

            var edgeDistances = [
                circle.position.x - (rectangle.position.x - rectangle.shape.width / 2),  // Left distance
                (rectangle.position.x + rectangle.shape.width / 2) - circle.position.x,  // Right distance
                circle.position.y - (rectangle.position.y - rectangle.shape.height / 2), // Top distance
                (rectangle.position.y + rectangle.shape.height / 2) - circle.position.y  // Bottom distance
            ]

            var i = edgeDistances.indexOf(Math.min(...edgeDistances));

            switch (i){
                case 0: // Left edge
                    circle.addPosition(new Vector2(-(edgeDistances[i]+circle.radius), 0));
                    break;
                case 1: // Right edge
                    circle.addPosition(new Vector2(edgeDistances[i]+circle.radius, 0))                   
                    break;
                case 2: // Top edge
                    circle.addPosition(new Vector2(0, -(edgeDistances[i]+circle.radius)));
                    break;
                case 3: // Bottom edge
                    circle.addPosition(new Vector2(0, edgeDistances[i]+circle.radius))                   
                    break;
            }

            N = new Vector2(
                Math.max(rectangle.position.x-rectangle.shape.width/2, Math.min(rectangle.position.x+rectangle.shape.width/2, circle.position.x)),
                Math.max(rectangle.position.y-rectangle.shape.height/2, Math.min(rectangle.position.y+rectangle.shape.height/2, circle.position.y))
            );

            distance = Vector2.subtract(circle.position, N);

        }
            
        var normal = distance.normalized();
        var overlap = circle.shape.radius - distance.magnitude;

        var uCircle, uRectangle;
        
        if (circle.isDynamic && rectangle.isDynamic){
            
            circle.addPosition(normal.scaled(0.5*overlap));
            rectangle.addPosition(normal.scaled(-0.5*overlap));

            var factor = 2 * Vector2.subtract(circle.velocity, rectangle.velocity).dot(normal) / ((circle.mass + rectangle.mass));

            uCircle = normal.scaled(-factor * rectangle.mass);
            uRectangle = normal.scaled(factor * circle.mass);
            
        }else if (circle.isDynamic){
            circle.addPosition(normal.scaled(overlap));

            uCircle = normal.scaled(-2 * circle.velocity.dot(normal));
            uRectangle = new Vector2(0, 0);
        }else if (rectangle.isDynamic){
            rectangle.addPosition(normal.scaled(-overlap));

            uCircle = new Vector2(0, 0);
            uRectangle = normal.scaled(-2 * rectangle.velocity.dot(normal));
        }

        circle.addVelocity(uCircle);
        rectangle.addVelocity(uRectangle);
    }

}