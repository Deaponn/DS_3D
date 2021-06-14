import { Object3D, PointLight } from "../three/build/three.module.js"
import Fireplace from './Fireplace.js'

export default class WallManagement {
    constructor() {
        this.container = new Object3D()
        this.fireplaces = []
    }

    getContainer() {
        return this.container
    }

    createLight(x, z) {
        let fireplace = new Fireplace()
        let newLight = new PointLight("0xf0f0f0", 0.5)
        let container = new Object3D()
        newLight.shadow.mapSize.width = 1024;
        newLight.shadow.mapSize.height = 1024;
        container.position.set(x, 5, z)
        container.add(newLight)
        container.add(fireplace)
        this.fireplaces.push(fireplace)
        this.container.add(container)
    }

    updateAllLights(action, value) {
        for (let i = 0; i < this.container.children.length; i++) {
            this.container.children[i].children[0][action] = value
        }
    }

    updateFireplaces() {
        for (let i = 0; i < this.fireplaces.length; i++) {
            this.fireplaces[i].update()
        }
    }

    updateFireplacesScale(x, y, z) {
        for (let i = 0; i < this.fireplaces.length; i++) {
            this.fireplaces[i].updateScale(x, y, z)
        }
    }

}