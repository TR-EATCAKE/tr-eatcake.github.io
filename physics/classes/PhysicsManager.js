import { Vector2 } from "./Vector2.js";
import { Shape, Circle, Rectangle } from "./Shapes.js";

export class PhysicsManager{
    
    static objects = [];

    static addObject(object){
        this.objects.push(object);
        return object;
    }

    static removeObject(object){
        const index = this.objects.indexOf(object);
        if (index > -1) this.objects.splice(index, 1);
    }

    static update(deltaTime){
        var totalKinetic = 0;
        for (let i = 0; i < this.objects.length; i++) {
            const objectA = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const objectB = this.objects[j];
                if (this.checkCollision(objectA, objectB)){
                    this.handleCollision(objectA, objectB);
                }
            }

            if (objectA.shape.type == Shape.CIRCLE){
                    if (objectA.position.x + objectA.shape.radius > canvas.width || objectA.position.x - objectA.shape.radius < 0){
                        
                        objectA.velocity.x *= -1;
                    }
                    if (objectA.position.y + objectA.shape.radius > canvas.height || objectA.position.y - objectA.shape.radius < 0){
                        objectA.velocity.y *= -1;
                    }
                }else if (objectA.shape.type == Shape.RECTANGLE){
                    if (objectA.position.x + objectA.shape.width / 2 > canvas.width || objectA.position.x - objectA.shape.width / 2 < 0){
                        objectA.velocity.x *= -1;
                    }
                    if (objectA.position.y + objectA.shape.height / 2 > canvas.height || objectA.position.y - objectA.shape.height / 2 < 0){
                        objectA.velocity.y *= -1;
                    }
                }
            totalKinetic += objectA.velocity.magnitude * objectA.velocity.magnitude * objectA.mass / 2;
            objectA.update(deltaTime);
        }
        //console.log("Total Kinetic Energy: " + totalKinetic);
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
        const distance = Vector2.subtract(circleB.position, circleA.position).magnitude;
        return distance < (circleA.shape.radius + circleB.shape.radius);
    }

    static checkRectangleCollision(rectangleA, rectangleB){
        const aLeft   = rectangleA.position.x - rectangleA.shape.width / 2;
        const aRight  = rectangleA.position.x + rectangleA.shape.width / 2;
        const aTop    = rectangleA.position.y - rectangleA.shape.height / 2;
        const aBottom = rectangleA.position.y + rectangleA.shape.height / 2;

        const bLeft   = rectangleB.position.x - rectangleB.shape.width / 2;
        const bRight  = rectangleB.position.x + rectangleB.shape.width / 2;
        const bTop    = rectangleB.position.y - rectangleB.shape.height / 2;
        const bBottom = rectangleB.position.y + rectangleB.shape.height / 2;

        // Check for overlap
        return (
            aLeft < bRight &&
            aRight > bLeft &&
            aTop < bBottom &&
            aBottom > bTop
        );
    }

    static checkCircleRectangleCollision(circle, rectangle){
        const circleDistanceX = Math.abs(circle.position.x - rectangle.position.x);
        const circleDistanceY = Math.abs(circle.position.y - rectangle.position.y);

        if (circleDistanceX > (rectangle.shape.width / 2 + circle.shape.radius)) { return false; }
        if (circleDistanceY > (rectangle.shape.height / 2 + circle.shape.radius)) { return false; }

        if (circleDistanceX < (rectangle.shape.width / 2)) { return true; }
        if (circleDistanceY < (rectangle.shape.height / 2)) { return true; }

        const cornerDistance_sq = Math.pow(circleDistanceX - rectangle.shape.width / 2, 2) +
                                   Math.pow(circleDistanceY - rectangle.shape.height / 2, 2);

        return (cornerDistance_sq <= Math.pow(circle.shape.radius, 2));
    }

    static handleCollision(objectA, objectB){
        if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.CIRCLE){
            this.handleCircleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.RECTANGLE){
            this.handleRectangleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.CIRCLE && objectB.shape.type == Shape.RECTANGLE){
            this.handleCircleRectangleCollision(objectA, objectB);
        }
        else if (objectA.shape.type == Shape.RECTANGLE && objectB.shape.type == Shape.CIRCLE){
            this.handleCircleRectangleCollision(objectB, objectA);
        }

    }

    static handleCircleCollision(circleA, circleB){

        var uA, uB;

        const distance = Vector2.subtract(circleB.position, circleA.position);
        const normal = distance.normalized();
        const overlap = circleA.shape.radius + circleB.shape.radius - distance.magnitude;

        if (circleA.isDynamic && circleB.isDynamic){
            circleA.addPosition(normal.scaled(-overlap / 2));
            circleB.addPosition(normal.scaled(overlap / 2));

            var factor = 2 * Vector2.subtract(circleB.velocity, circleA.velocity).dot(distance) / ((circleA.mass + circleB.mass) * distance.magnitude);

            uA = normal.scaled(factor * circleB.mass);
            uB = normal.scaled(-factor * circleA.mass);

        }else if (circleA.isDynamic){
            circleA.addPosition(normal.scaled(-overlap));
            uA = normal.scaled(-2 * circleB.velocity.magnitude);
            uB = new Vector2(0, 0);
        }else{
            circleB.addPosition(normal.scaled(overlap));
            uA = new Vector2(0, 0);
            uB = normal.scaled(2 * circleB.velocity.magnitude);
        }

        circleA.addVelocity(uA);
        circleB.addVelocity(uB);
    }

    static handleRectangleCollision(rectangleA, rectangleB){
        const aLeft   = rectangleA.position.x - rectangleA.shape.width / 2;
        const aRight  = rectangleA.position.x + rectangleA.shape.width / 2;
        const aTop    = rectangleA.position.y - rectangleA.shape.height / 2;
        const aBottom = rectangleA.position.y + rectangleA.shape.height / 2;

        const bLeft   = rectangleB.position.x - rectangleB.shape.width / 2;
        const bRight  = rectangleB.position.x + rectangleB.shape.width / 2;
        const bTop    = rectangleB.position.y - rectangleB.shape.height / 2;
        const bBottom = rectangleB.position.y + rectangleB.shape.height / 2;

        // Calculate the overlap on each axis
        const overlapX = Math.min(aRight, bRight) - Math.max(aLeft, bLeft);
        const overlapY = Math.min(aBottom, bBottom) - Math.max(aTop, bTop);

        if (overlapX < overlapY) {
            if (aLeft < bLeft) {
                // Move A to the left
                rectangleA.addPosition(new Vector2(-overlapX / 2, 0));
                rectangleB.addPosition
            }
        }
    }

    static handleCircleRectangleCollision(circle, rectangle){
        var uC, uR;
        const distance = Vector2.subtract(rectangle.position, circle.position);
        const normal = distance.normalized();

        const dx = distance.x;
        const dy = distance.y;


        
        
    }

}