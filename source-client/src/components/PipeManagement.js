import { Object3D, MeshPhongMaterial } from 'three'
import Loader from './OBJModel'

export default class Model extends Object3D {
    constructor(scene, manager) {
        super()
        this.scene = scene;
        this.manager = manager;
        this.scene.add(this)
        this.loader = new Loader(this.manager, this.scene)
        this.loader.load('./assets/pipecollection.obj', this)
    }

    objectLoaded(mesh) {
        //tutaj zapytanie do serwera o obecny stan planszy, w callbacku wywolana funkcja
        let testState = {
            config: {
                playerColor: 0,     // ustala kolor gracza, 0 to czerwony, 1 to zielony
                scale: 2.9,               // ustala jakiej wielkosci elementy beda na ekranie
                positionX: 400,    // ustala pozycje X kontenera
                positionY: 200,    // ustala pozycje Y kontenera
                positionZ: 80,     // ustala pozycje Z kontenera
                rotation: -0.2,         // ustala obrot kontenera
                width: 4,               // podaje ile mniejszych tablic bedzie wystepowalo w poziomie
                height: 4               // podaje ile wiekszych tablic bedzie wystepowalo w poziomie
            },                          // generowanie poziomu zaczyna sie od lewego dolnego rogu i idzie w prawo, a nastepnie
            state: [                    // przechodzi do kolejnego wiersza
                [                       // height to ilosc tablic zawierajacych tablice z obiektami, a width to ilosc obiektow w mniejszych tablicach
                    {
                        type: "exit",   // typ elementu na planszy
                        rotation: 3,    // jego obrot, dla 0 wlot u gory
                        active: false   // wiadomosc czy jest juz zasilony przez strumien wody
                    },
                    {
                        type: "elbow",   // exit, line, elbow, cross, tee, input, w przypadku jesli input nalezy podac dodatkowo base: <type inny niz input>
                        rotation: 1,    // 0, 1, 2, 3 - dla cross nie jest brane pod uwage, dla line 0 i 2 oraz 1 i 3 wygladaja tak samo
                        active: false   // true lub false, na razie dziala tylko z type exit
                    },
                    {
                        type: "exit",
                        rotation: 2,
                        active: false
                    },
                    {
                        type: "exit",
                        rotation: 2,
                        active: false
                    }
                ],
                [
                    {
                        type: "tee",
                        rotation: 1,
                        active: false
                    },
                    {
                        type: "tee",
                        rotation: 3,
                        active: false
                    },
                    {
                        type: "tee",
                        rotation: 1,
                        active: false
                    },
                    {
                        type: "elbow",
                        rotation: 3,
                        active: false
                    }
                ],
                [
                    {
                        type: "exit",
                        rotation: 0,
                        active: false
                    },
                    {
                        type: "exit",
                        rotation: 0,
                        active: false
                    },
                    {
                        type: "input",
                        base: "tee",
                        rotation: 1,
                        active: true
                    },
                    {
                        type: "elbow",
                        rotation: 3,
                        active: true
                    }
                ],
                [
                    {
                        type: "exit",
                        rotation: 2,
                        active: false
                    },
                    {
                        type: "tee",
                        rotation: 3,
                        active: true
                    },
                    {
                        type: "elbow",
                        rotation: 3,
                        active: true
                    },
                    {
                        type: "exit",
                        rotation: 1,
                        active: false
                    }
                ]
            ]
        }

        this.constructSpace(testState, mesh)
    }

    constructSpace(data, mesh) {
        // this.position.set(data.config.positionX, data.config.positionY, data.config.positionZ)
        // this.rotation = data.config.rotation
        // this.scale = data.config.scale
        console.log(this, data.config.positionX, data.config.positionY, data.config.positionZ, data.config.rotation, data.config.scale)
        let spacing = 66.5
        for (let i = 0; i < data.config.width; i++) {
            for (let j = 0; j < data.config.height; j++) {
                let color = (i + j) % 2
                let pipe = this.newPipe(mesh, data.state[j][i], color)
                pipe.position.set(i * spacing, j * spacing, 0)
                pipe.rotation.z = Math.PI / 2 * (data.state[j][i].rotation * -1 + 1)
                data.state[j][i].active ? pipe.userData.active = true : null
                if (data.config.playerColor == color || data.state[j][i].type == "input") pipe.userData.clickable = true
                pipe.userData.scale = 1
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

}
