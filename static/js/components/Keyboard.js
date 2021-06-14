import Animation from "./Animation.js"
import Config from "./Config.js";

const KEYS = {
    "left": 65,
    "up": 87,
    "right": 68,
    "down": 83,
};

export default class Keyboard {
    constructor(domElement, animation, modelMesh) {

        this.domElement = domElement;
        this.animation = animation
        this.modelMesh = modelMesh
        this.pressedWalkingKeys = 0

        // events
        this.domElement.addEventListener('keydown', event => this.onKeyDown(event), false);
        this.domElement.addEventListener('keyup', event => this.onKeyUp(event), false);


    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = false;
                this.pressedWalkingKeys -= 1
                if (this.pressedWalkingKeys == 0) {
                    this.stopWalking()
                }
                break;
            case KEYS.left:
                Config.rotateLeft = false;
                this.pressedWalkingKeys -= 1
                if (this.pressedWalkingKeys == 0) {
                    this.stopWalking()
                }
                break;
            case KEYS.right:
                Config.rotateRight = false;
                this.pressedWalkingKeys -= 1
                if (this.pressedWalkingKeys == 0) {
                    this.stopWalking()
                }
                break;
            case KEYS.down:
                Config.moveBackwards = false
                this.pressedWalkingKeys -= 1
                if (this.pressedWalkingKeys == 0) {
                    this.stopWalking()
                }
                break
        }
    }

    onKeyDown(event) {
        if (event.repeat) return
        switch (event.keyCode) {
            case KEYS.up:
                Config.moveForward = true;
                if (this.pressedWalkingKeys == 0) {
                    this.startWalking()
                }
                this.pressedWalkingKeys += 1
                break;
            case KEYS.left:
                Config.rotateLeft = true;
                if (this.pressedWalkingKeys == 0) {
                    this.startWalking()
                }
                this.pressedWalkingKeys += 1
                break;
            case KEYS.right:
                Config.rotateRight = true;
                if (this.pressedWalkingKeys == 0) {
                    this.startWalking()
                }
                this.pressedWalkingKeys += 1
                break;
            case KEYS.down:
                Config.moveBackwards = true
                if (this.pressedWalkingKeys == 0) {
                    this.startWalking()
                }
                this.pressedWalkingKeys += 1
                break
        }
    }

    startWalking() {
        this.animation.playAnim("flip")
    }

    stopWalking() {
        this.animation.stopAnim()
    }
}
