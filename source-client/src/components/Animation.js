import { AnimationMixer } from 'three';

export default class Animation {
    constructor(mesh) {
        // mesh modelu
        this.mesh = mesh;
        // mixer
        this.mixer = new AnimationMixer(this.mesh);

    }

    playAnim(animName) {
        this.animName = animName
        this.mixer.uncacheRoot(this.mesh)
        this.mixer.clipAction(this.animName).play()
    }

    stopAnim() {
        this.mixer.existingAction(this.animName).paused = true
        this.mixer.existingAction(this.animName).fadeOut(0.5)
    }

    // update mixer
    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta);
        }
    }
}