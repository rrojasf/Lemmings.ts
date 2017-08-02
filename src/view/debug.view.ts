module Lemmings {

    export class DebugView {


        private levelIndex = 0;
        private levelGroupIndex = 0;
        private musicIndex = 0;
        private soundIndex = 0;
        private gameResources: GameResources = null;
        private musicPlayer: AudioPlayer = null;
        private soundPlayer: AudioPlayer = null;

        private gameFactory = new GameFactory("./");


        public elementSoundNumber: HTMLElement = null;
        public elementTrackNumber: HTMLElement = null;
        public elementLevelNumber: HTMLElement = null;
        public elementSelectedGame: HTMLSelectElement = null;
        public elementSelectLevelGroup: HTMLSelectElement = null;
        public elementLevelName: HTMLElement = null;
        public gameCanvas: HTMLCanvasElement = null;



        public playMusic(moveInterval: number) {

            this.stopMusic();
            if (!this.gameResources) return;

            if (moveInterval == null) moveInterval = 0;
            this.musicIndex += moveInterval;
            this.musicIndex = (this.musicIndex < 0) ? 0 : this.musicIndex;

            if (this.elementTrackNumber) {
                this.elementTrackNumber.innerHTML = this.musicIndex.toString();
            }

            this.gameResources.getMusicPlayer(this.musicIndex)
                .then((player) => {
                    this.musicPlayer = player;
                    this.musicPlayer.play();
                });
        }


        public stopMusic() {
            if (this.musicPlayer) {
                this.musicPlayer.stop();
                this.musicPlayer = null;
            }
        }


        public stopSound() {
            if (this.soundPlayer) {
                this.soundPlayer.stop();
                this.soundPlayer = null;
            }
        }

        public playSound(moveInterval: number) {
            this.stopSound();

            if (moveInterval == null) moveInterval = 0;

            this.soundIndex += moveInterval;

            this.soundIndex = (this.soundIndex < 0) ? 0 : this.soundIndex;

            if (this.elementSoundNumber) {
                this.elementSoundNumber.innerHTML = this.soundIndex.toString();
            }


            this.gameResources.getSoundPlayer(this.soundIndex)
                .then((player) => {
                    this.soundPlayer = player;
                    this.soundPlayer.play();
                });
        }



        public moveToLevel(moveInterval: number) {
            if (moveInterval == null) moveInterval = 0;
            this.levelIndex += moveInterval;

            this.levelIndex = (this.levelIndex < 0) ? 0 : this.levelIndex;

            if (this.elementLevelNumber) {
                this.elementLevelNumber.innerHTML = (this.levelIndex + 1).toString();
            }

            this.loadLevel();
        }


        private clearHtmlList(htmlList: HTMLSelectElement) {
            while (htmlList.options.length) {
                htmlList.remove(0);
            }
        }


        private arrayToSelect(htmlList: HTMLSelectElement, list: string[]) {

            this.clearHtmlList(htmlList);

            for (var i = 0; i < list.length; i++) {
                var opt = list[i];
                var el: HTMLOptionElement = document.createElement("option");
                el.textContent = opt;
                el.value = i.toString();
                htmlList.appendChild(el);
            }
        }


        public selectLevelGroup(newLevelGroupIndex: number) {
            this.levelGroupIndex = newLevelGroupIndex;

            this.loadLevel();
        }


        private selectGame(gameTypeName: string) {

            if (gameTypeName == null) gameTypeName = "LEMMINGS";

            let gameType = Lemmings.GameTypes.fromString(gameTypeName);

            this.gameFactory.getGameResources(gameType)
                .then((newGameResources) => {

                    this.gameResources = newGameResources;

                    this.arrayToSelect(this.elementSelectLevelGroup, this.gameResources.getLevelGroups());
                    this.levelGroupIndex = 0;

                    this.loadLevel();
                });
        }



        private loadLevel() {
            if (this.gameResources == null) return;

            this.gameResources.getLevel(this.levelGroupIndex, this.levelIndex)
                .then((level) => {
                    if (level == null) return;

                    if (this.elementLevelName) {
                        this.elementLevelName.innerHTML = level.name;
                    }


                    var cav: HTMLCanvasElement = this.gameCanvas;
                    cav.width = 1600;
                    cav.height = 200;
                    cav.className = "PixelatedRendering";
                    var ctx = cav.getContext("2d");

                    /// create image
                    var imgData = ctx.createImageData(level.width, level.height);
                    /// set pixels
                    imgData.data.set(level.groundImage);
                    /// write image to context
                    ctx.putImageData(imgData, 0, 0);


                    console.dir(level);
                });

        }

    }
}