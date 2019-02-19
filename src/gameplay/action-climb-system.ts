module Lemmings {

    export class ActionClimbSystem implements IActionSystem {

        public soundSystem = new SoundSystem();

        private sprite:Animation[] = [];
        
        constructor(sprites:LemmingsSprite){
            this.sprite.push(sprites.getAnimation(SpriteTypes.CLIMBING, false));
            this.sprite.push(sprites.getAnimation(SpriteTypes.CLIMBING, true));
        }

        public getActionName() : string {
            return "climb";
        }


        /** render Leming to gamedisply */
        public draw(gameDisplay:DisplayImage, lem: Lemming) {
            let ani = this.sprite[ (lem.lookRight ? 1 : 0)];

            let frame = ani.getFrame(lem.frameIndex);

            gameDisplay.drawFrame(frame, lem.x, lem.y);
        }


        public process(level:Level, lem: Lemming):LemmingStateType {

            let groundMask = level.getGroundMaskLayer();

            lem.frameIndex = (lem.frameIndex + 1) % 8;

            if (lem.frameIndex  < 4) {
                // check for top
                if (!groundMask.hasGroundAt(lem.x, lem.y - 7 - lem.frameIndex)) {
                    lem.y = lem.y - 10;
                    return LemmingStateType.HOISTING;
                }
            }
            else {
                lem.y--;

                if (groundMask.hasGroundAt(lem.x + (lem.lookRight? -1 : 1), lem.y - 8)) {
                 
                    lem.lookRight = !lem.lookRight;
                    lem.x += (lem.lookRight?2:-2);
                    return LemmingStateType.FALLING;
                }
            }
            
        }

    }

}