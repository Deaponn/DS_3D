import { Raycaster, Vector2 } from 'three';

export default class Rotator extends Raycaster {
    constructor(scene, camera) {

        super()
        this.scene = scene
        this.camera = camera

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
            // tu wysylane zapytanie do serwera o "pozwolenie" na obrot, jesli odpowiedz twierdzaca to wykonuje sie instrukcja ponizej
            intersects[0].object.parent.name == "container" ? this.animateRotation(intersects[0].object.parent) : this.animateRotation(intersects[0].object)
        }
    }

    animateRotation(object, leftToRotate = Math.PI / 2, step = 0.01) {
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
}