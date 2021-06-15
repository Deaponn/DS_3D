import { FBXLoader } from '../three/examples/jsm/loaders/FBXLoader.js';
import { AnimationMixer } from "../three/build/three.module.js"

export default class Model {
    constructor(scene, manager) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null

        document.socket.on("lost", () => {
            this.playingAction.fadeOut(1)
            this.lostAction.play()
        })

        document.socket.on("win", () => {
            this.playingAction.fadeOut(1)
            this.winAction.play()
        })
    }

    load(path, returnData, ...animationList) {
        // Manager is passed in to loader to determine when loading done in main
        // Load model with FBXLoader
        this.loader = new FBXLoader(this.manager)
        this.loader.load(
            path,
            geometry => {
                this.geometry = geometry;
                this.scene.add(this.geometry);
                //console.log(this.geometry) // tu powinny być widoczne animacje
                // console.log(this.mesh)
                this.mixer = new AnimationMixer(this.geometry);
                this.loadAnimations(animationList)

                returnData(this.geometry, this.mixer)
            },
        );
    }

    async loadAnimations(list) {
        for (let i = 0; i < list.length; i++) {
            let animation = await this.loadAnimation(list[i])
            this.geometry.animations.push(animation)
        }
        document.getElementById("loading").style.display = "none"
        this.playingAction = this.mixer.clipAction(this.geometry.animations[0])
        this.lostAction = this.mixer.clipAction(this.geometry.animations[1])
        this.winAction = this.mixer.clipAction(this.geometry.animations[2])
        this.playingAction.play()
    }

    loadAnimation(name) {
        return new Promise(resolve => {
            this.loader.load(
                name,
                object => {
                    let animation = object.animations[0]
                    //console.log(animation)
                    resolve(animation)
                }
            )
        })
    }

    unload() {
        this.scene.remove(this.mesh); // ew funkcja do usunięcia modelu ze sceny
    }
}
