import { Raycaster, Vector2 } from '../three/build/three.module.js';

export default class Rotator extends Raycaster {
    constructor(scene, camera, pipeList, levelData) {

        super()
        this.scene = scene
        this.camera = camera
        this.pipeList = pipeList
        this.levelData = levelData

        document.socket.on("rotation", (data) => {
            if (this.levelData.state[data.cords.y][data.cords.x].rotation == 3) { this.levelData.state[data.cords.y][data.cords.x].rotation = 0 }
            else { this.levelData.state[data.cords.y][data.cords.x].rotation++ }
            this.animateRotation(this.pipeList[data.cords.x][data.cords.y])
            this.checkForWin()
        })

        window.addEventListener('mousedown', (e) => this.rotateElement(e));
    }

    rotateElement(e) {
        let vector = new Vector2()
        vector.x = (e.clientX / window.innerWidth) * 2 - 1;
        vector.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.setFromCamera(vector, this.camera);
        var intersects = this.intersectObjects(this.scene.children[2].children, true);
        if (intersects.length > 0) {
            if (!intersects[0].object.userData.clickable && !intersects[0].object.parent.userData.clickable) return
            let userData
            intersects[0].object.parent.name == "container" ? userData = intersects[0].object.parent.userData : userData = intersects[0].object.userData
            document.socket.emit("rotation", userData)
            this.animateRotation(intersects[0].object)
            if (this.levelData.state[userData.cords.y][userData.cords.x].rotation == 3) { this.levelData.state[userData.cords.y][userData.cords.x].rotation = 0 }
            else { this.levelData.state[userData.cords.y][userData.cords.x].rotation++ }
            this.checkForWin()
        }
    }

    animateRotation(target, leftToRotate = Math.PI / 2, step = 0.01) {
        let object
        target.parent.name == "container" ? object = target.parent : object = target
        if (step >= leftToRotate) {
            let scale = object.userData.scale
            object.rotation.z -= leftToRotate
            object.scale.set(scale, scale, scale)
        } else {
            object.rotation.z -= step
            let newLeftToRotate = leftToRotate - step
            let newStep
            if (step >= 0.08) {
                newStep = step
                let newScale = object.scale.x + step / 2
                object.scale.set(newScale, newScale, newScale)
            } else {
                newStep = step + 0.003
                let newScale = object.scale.x - step / 3
                object.scale.set(newScale, newScale, newScale)
            }
            setTimeout(() => {
                this.animateRotation(object, newLeftToRotate, newStep)
            }, 10);
        }
    }
    checkForWin() {
        if (JSON.stringify(this.levelData.state) == JSON.stringify(this.levelData.solved)) document.socket.emit("win")
    }
}