
module Lemmings {

    /** manage the in-game Lemmings animation sprite */
    export class LemmingsSprite {

        private lemmingAnimation:Animation[] = []; //- Loockup table from ActionType -> this.animations(); First Element: left-move, Second: right-move
        private colorPallet:ColorPallet;

        /** return the animation for a given animation type */
        public getAnimation(state:SpriteType, right:boolean) : Animation {
            return this.lemmingAnimation[this.typeToIndex(state, (right?1:0))];
        }


        constructor(fr:BinaryReader, colorPallet:ColorPallet) {
            this.colorPallet = colorPallet;

            this.registerAnimation(SpriteType.WALKING,       1, fr, 2, 16, 10, 8); //- walking (r)
            this.registerAnimation(SpriteType.JUMPING,       1, fr, 2, 16, 10, 1); //- jumping (r)
            this.registerAnimation(SpriteType.WALKING,      -1, fr, 2, 16, 10, 8); //- walking (l)
            this.registerAnimation(SpriteType.JUMPING,      -1, fr, 2, 16, 10, 1); //- jumping (l)
            this.registerAnimation(SpriteType.DIGGING,       0, fr, 3, 16, 14, 16); //- digging
            this.registerAnimation(SpriteType.CLIMBING,      1, fr, 2, 16, 12, 8); //- climbing (r)
            this.registerAnimation(SpriteType.CLIMBING,     -1, fr, 2, 16, 12, 8); //- climbing (l)
            this.registerAnimation(SpriteType.DROWNING,      0, fr, 2, 16, 10, 16); //- drowning
            this.registerAnimation(SpriteType.POSTCLIMBING,  1, fr, 2, 16, 12, 8); //- post-climb (r)
            this.registerAnimation(SpriteType.POSTCLIMBING, -1, fr, 2, 16, 12, 8); //- post-climb (l)
            this.registerAnimation(SpriteType.BUILDING,      1, fr, 3, 16, 13, 16); //- brick-laying (r)
            this.registerAnimation(SpriteType.BUILDING,     -1, fr, 3, 16, 13, 16); //- brick-laying (l)
            this.registerAnimation(SpriteType.BASHING,       1, fr, 3, 16, 10, 32); //- bashing (r)
            this.registerAnimation(SpriteType.BASHING,      -1, fr, 3, 16, 10, 32); //- bashing (l)
            this.registerAnimation(SpriteType.MINEING,       1, fr, 3, 16, 13, 24); //- mining (r)
            this.registerAnimation(SpriteType.MINEING,      -1, fr, 3, 16, 13, 24); //- mining (l)
            this.registerAnimation(SpriteType.FALLING,       1, fr, 2, 16, 10, 4); //- falling (r)
            this.registerAnimation(SpriteType.FALLING,      -1, fr, 2, 16, 10, 4); //- falling (l)
            this.registerAnimation(SpriteType.PREUMBRELLA,   1, fr, 3, 16, 16, 4); //- pre-umbrella (r)
            this.registerAnimation(SpriteType.UMBRELLA,      1, fr, 3, 16, 16, 4, true); //- umbrella (r)
            this.registerAnimation(SpriteType.PREUMBRELLA,  -1, fr, 3, 16, 16, 4); //- pre-umbrella (l)
            this.registerAnimation(SpriteType.UMBRELLA,     -1, fr, 3, 16, 16, 4, true); //- umbrella (l)
            this.registerAnimation(SpriteType.SPLATTING,     0, fr, 2, 16, 10, 16); //- splatting
            this.registerAnimation(SpriteType.EXITING,       0, fr, 2, 16, 13, 8); //- exiting
            this.registerAnimation(SpriteType.FRYING,        1, fr, 4, 16, 14, 14); //- fried
            this.registerAnimation(SpriteType.BLOCKING,      0, fr, 2, 16, 10, 16); //- blocking
            this.registerAnimation(SpriteType.SHRUGGING,     1, fr, 2, 16, 10, 8); //- shrugging (r)
            this.registerAnimation(SpriteType.SHRUGGING,     0, fr, 2, 16, 10, 8); //- shrugging (l)
            this.registerAnimation(SpriteType.OHNO,          0, fr, 2, 16, 10, 16); //- oh-no-ing
            this.registerAnimation(SpriteType.EXPLODING,     0, fr, 3, 32, 32, 1); //- explosion
        }


        private typeToIndex(state:SpriteType, dir:number): number{
            return state * 2 + ((dir<=0)?0:1);
        }


        private registerAnimation(state:SpriteType, dir:number, fr:BinaryReader, bitsPerPixle:number, width:number, height:number, frames:number, usePingPong:boolean = false) {

            //- load animation frames from main file (fr)
            var animation = new Animation();

            animation.loadFromFile(fr, bitsPerPixle, width, height, frames, this.colorPallet);
            animation.isPingPong = usePingPong;

            //- add animation to cache

            if (dir >= 0) {
                this.lemmingAnimation[this.typeToIndex(state, 1)] = animation;
            }

            if (dir <= 0) {
                this.lemmingAnimation[this.typeToIndex(state, -1)] = animation;
            }
        }



    }

}