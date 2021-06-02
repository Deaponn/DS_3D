import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { AnimationMixer } from "three"

export default class Model {
    constructor(scene, manager) {
        this.scene = scene;
        this.mesh = null;
        this.manager = manager;
        this.geometry = null
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
            //console.log(this.geometry)
        }
        const action = this.mixer.clipAction(this.geometry.animations[2]);
        action.play();
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
