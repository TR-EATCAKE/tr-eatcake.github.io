import { SpriteAnimation } from "./SpriteAnimation.js";
import { Vector2 } from "./Vector2.js";

export class Sprite{
    constructor({
        image,
        frame_size,
        h_frames,
        v_frames,
        frame_count,
        scale,
        position,
        animation
    }){
        this.image = image;
        this.frame_size = frame_size ?? new Vector2(32, 32);
        this.h_frames = h_frames ?? 1;
        this.v_frames = v_frames ?? 1;
        this.frame_count = frame_count ?? 0;
        this.scale = scale ?? 1;
        this.position = position ?? Vector2.ZERO;
        this.frames = new Map();
        this.animation = animation ?? new SpriteAnimation({});
        this.setFrames();
    }
    setFrames(){
        var count = 0;

        for (var i = 0; i< this.v_frames; i++){
            for (var j = 0; j < this.h_frames; j++){
                this.frames.set(
                    count,
                    new Vector2(j * this.frame_size.x, i * this.frame_size.y)
                )
                count++;
            }
        }
    }
    setAnimation(anim){
        if (this.animation == anim) return;
        this.animation.frame_index = 0;
        this.animation = anim;
    }
    draw(ctx, deltaTime){

        if (this.animation.playing){
            if (this.animation.frames.length == 0) this.animation.playing = false;
            if (this.animation.cooldown <= 0){
                if (this.animation.frame_index == this.animation.frames.length-1){
                    if (this.animation.loop) this.animation.frame_index = 0;
                    else this.animation.playing = false;
                }
                else this.animation.frame_index++;
                this.animation.cooldown = this.animation.duration/this.animation.frames.length;
            }else this.animation.cooldown -= deltaTime;
            this.frame_count = this.animation.frames[this.animation.frame_index];
        }

        const frame = this.frames.get(this.frame_count) ?? Vector2.ZERO;

        ctx.drawImage(
            this.image,
            frame.x,
            frame.y,
            this.frame_size.x,
            this.frame_size.y,
            this.position.x,
            this.position.y,
            this.frame_size.x * this.scale,
            this.frame_size.y * this.scale
        )
    }
}