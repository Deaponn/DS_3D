import { Object3D, MeshPhongMaterial } from '../three/build/three.module.js'
import Loader from './OBJModel.js'

export default class Model extends Object3D {
    constructor(scene, manager, level) {
        super()
        this.scene = scene;
        this.manager = manager;
        this.level = level
        this.pipeList = []
        this.scene.add(this)
        this.loader = new Loader(this.manager, this.scene)
        this.loader.load('./assets/pipecollection.obj', this)
        document.socket.on("setColor", (color) => {
            if (color == "red") this.playerColor = 0
            else this.playerColor = 1
            this.reloadClickable()
        })
    }

    objectLoaded(mesh) {
        //tutaj zapytanie do serwera o obecny stan planszy, w callbacku wywolana funkcja
        this.constructSpace(this.level, mesh)
    }

    constructSpace(data, mesh) {
        // this.position.set(data.config.positionX, data.config.positionY, data.config.positionZ)
        // this.rotation = data.config.rotation
        // this.scale = data.config.scale
        this.data = data
        let spacing = 66.5
        for (let i = 0; i < data.config.width; i++) {
            this.pipeList.push([])
            for (let j = 0; j < data.config.height; j++) {
                let color = (i + j) % 2
                let pipe = this.newPipe(mesh, data.state[j][i], color)
                pipe.position.set(i * spacing, j * spacing, 0)
                pipe.rotation.z = Math.PI / 2 * (data.state[j][i].rotation * -1 + 1)
                data.state[j][i].active ? pipe.userData.active = true : null
                pipe.userData.scale = 1
                pipe.userData.cords = { x: i, y: j }
                this.pipeList[i].push(pipe)
                this.add(pipe)
            }
        }
        console.log(this.scene)
        this.position.set(data.config.positionX, data.config.positionY, data.config.positionZ)
        this.rotation.y = data.config.rotation
        this.scale.set(data.config.scale, data.config.scale, data.config.scale)
    }

    newPipe(mesh, data, color) {
        switch (data.type) {
            case "exit": {
                let container = new Object3D()
                let pipe = mesh.children[8].clone() // 3, 4, 8
                let digits = mesh.children[4].clone()
                let pointer = mesh.children[3].clone()
                let background = mesh.children[9].clone()
                if (typeof color != "undefined") {
                    color == 0 ? pipe.material = new MeshPhongMaterial({ color: 0xff0000 }) : pipe.material = new MeshPhongMaterial({ color: 0x00ff00 })
                }
                digits.material = new MeshPhongMaterial({ color: 0x000000 })
                pointer.material = new MeshPhongMaterial({ color: 0xff0000 })
                container.add(pipe)
                container.add(digits)
                container.add(pointer)
                container.add(background)
                container.name = "container"
                return container
            }
            case "tee": {
                let pipe = mesh.children[1].clone() // 1
                if (typeof color != "undefined") {
                    color == 0 ? pipe.material = new MeshPhongMaterial({ color: 0xff0000 }) : pipe.material = new MeshPhongMaterial({ color: 0x00ff00 })
                }
                pipe.name = "pipe"
                return pipe
            }
            case "elbow": {
                let pipe = mesh.children[0].clone() // 0
                if (typeof color != "undefined") {
                    color == 0 ? pipe.material = new MeshPhongMaterial({ color: 0xff0000 }) : pipe.material = new MeshPhongMaterial({ color: 0x00ff00 })
                }
                pipe.name = "pipe"
                return pipe
            }
            case "line": {
                let pipe = mesh.children[2].clone() // 2
                if (typeof color != "undefined") {
                    color == 0 ? pipe.material = new MeshPhongMaterial({ color: 0xff0000 }) : pipe.material = new MeshPhongMaterial({ color: 0x00ff00 })
                }
                pipe.name = "pipe"
                return pipe
            }
            case "cross": {
                let pipe = mesh.children[7].clone() // 7
                if (typeof color != "undefined") {
                    color == 0 ? pipe.material = new MeshPhongMaterial({ color: 0xff0000 }) : pipe.material = new MeshPhongMaterial({ color: 0x00ff00 })
                }
                pipe.name = "pipe"
                return pipe
            }
            case "input": {
                let container = new Object3D()
                let John = mesh.children[5].clone() // 5, 6
                let handle = mesh.children[6].clone()
                let base = this.newPipe(mesh, { type: data.base })
                container.add(John)
                container.add(handle)
                if (data.base == "elbow") {
                    John.position.set(5, -5, 0)
                    handle.position.set(5, -5, 0)
                    John.rotation.z = Math.PI / 4
                }
                container.add(base)
                container.name = "container"
                return container
            }
        }
    }

    reloadClickable() {
        console.log(this.pipeList)
        for (let i = 0; i < this.pipeList.length; i++) {
            for (let j = 0; j < this.pipeList[i].length; j++) {
                let color = (i + j) % 2
                if (this.playerColor == color || this.data.state[j][i].type == "input") this.pipeList[i][j].userData.clickable = true
            }
        }
    }

}
