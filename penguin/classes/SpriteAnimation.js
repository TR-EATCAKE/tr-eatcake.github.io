export class SpriteAnimation{
    constructor({
        frames,
        frame_index = 0,
        duration = 1,
        playing = false,
        loop = false
    }){
        this.frames = frames ?? [0];
        this.frame_index = frame_index ?? 0;
        this.duration = duration ?? 1;
        this.cooldown = 0;
        this.playing = playing ?? false;
        this.loop = loop ?? false;
    }
}