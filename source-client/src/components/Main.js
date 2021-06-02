import {
    Scene,
    LoadingManager,
    Clock,
    Vector2,
    Vector3,
    Raycaster,
    GridHelper,
    DirectionalLight,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import Animation from "./Animation"
import Camera from './Camera';
import Config from './Config';
import Keyboard from "./Keyboard"
import Loader from './OBJModel'
import LightManagement from './LightManagement';
import Model from "./Model"
import PipeManagement from './PipeManagement'
import Renderer from './Renderer';
import Rotator from './Rotator'

export default class Main {
    constructor(container) {
        // właściwości klasy
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(this.renderer);

        this.camera.position.set(290, 530, 860)
        this.camera.lookAt(290, 400, 0)
        // this.camera.position.set(-100, 350, -100)
        // this.camera.lookAt(-100, 370, -150)

        this.isLoaded = null
        this.animation = null

        let light = new DirectionalLight(0xffffff, 1);
        light.position.set(100, 300, 300);
        light.target = this.scene
        this.scene.add(light);

        // new OrbitControls(this.camera, this.renderer.domElement)
        // grid - testowa siatka na podłoże modelu

        const gridHelper = new GridHelper(1000, 10);
        gridHelper.position.set(450, 0, 450)
        this.scene.add(gridHelper);

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

        document.body.appendChild(this.stats.dom);

        this.clock = new Clock()

        this.manager = new LoadingManager();

        this.load = new Model(this.scene, this.manager, this.mixer)
        this.load.load("./assets/character.fbx", (geometry, mixer) => {
            this.player = geometry
            this.player.position.set(-120, 75, -120)
            this.player.rotation.y = -2.9
            this.player.scale.set(2.6, 2.6, 2.6)
            this.mixer = mixer
        }, "./assets/playing.fbx", "./assets/pre-lose.fbx", "./assets/losing.fbx", "./assets/win.fbx")

        let selector

        this.load.load("./assets/room.fbx", (geometry, mixer) => {
            this.room = geometry
            geometry.children[3].children[0].children[0].children[0].children[0].material.shininess = 0.5
            geometry.children[3].children[0].children[0].children[29].children[0].material.color.setRGB(0, 0, 0)
            geometry.children[3].children[0].children[0].children[4].position.set(0.22598000764846796, -0.45721997261047365, -0.1953999590873705) // krzeselko
            geometry.children[3].children[0].children[0].children[4].scale.set(1.071081256866455, 1.0710899591445922, 1.071081256866455)
            this.room.scale.set(5, 5, 5)
            // this.room.rotation.y -= Math.PI / 4
            // this.room.position.set(700, -900, -1300)
        }, null)

        this.pipes = new PipeManagement(this.scene, this.manager)
        console.log(this.pipes)

        this.rotator = new Rotator(this.scene, this.camera)

        window.onkeydown = (key) => {
            console.log(this["room"].children[3].children[0].children[0].children[4].children[0])
            switch (key.key) {
                case "w": {
                    selector.position.x += 0.01
                    break
                }
                case "s": {
                    selector.position.x -= 0.01
                    break
                }
                case "a": {
                    selector.position.z -= 0.01
                    break
                }
                case "d": {
                    selector.position.z += 0.01
                    break
                }
                case "Shift": {
                    selector.position.y -= 0.01
                    break
                }
                case " ": {
                    selector.position.y += 0.01
                    break
                }
                case "z": {
                    selector.rotation.y += 0.01
                    break
                }
                case "x": {
                    selector.rotation.y -= 0.01
                    break
                }
                case "c": {
                    selector.scale.x -= 0.1
                    selector.scale.y -= 0.1
                    selector.scale.z -= 0.1
                    break
                }
                case "v": {
                    selector.scale.x += 0.1
                    selector.scale.y += 0.1
                    selector.scale.z += 0.1
                    break
                }
            }
            console.log(selector.position, selector.rotation.y, selector.scale)
        }

        let geometry = new PlaneGeometry(176, 102, 1, 1)
        let material = new MeshBasicMaterial()

        let monitor = new Mesh(geometry, material)
        monitor.position.set(-44, 377, -367)
        monitor.rotation.y = -0.24

        let monitor2 = new Mesh(geometry, material)
        monitor2.position.set(-231, 377, -365)
        monitor2.rotation.y = 0.285

        this.scene.add(monitor)
        this.scene.add(monitor2)

        this.lightManager = new LightManagement()
        this.light = this.lightManager.getContainer()
        this.scene.add(this.light)
        this.light.position.y = 1200

        this.lightManager.createLight(235, -170)

        // this.loader = new Loader(this.manager, this.scene)
        // this.loader.load('./assets/tests/isometric.obj', { objectLoaded: (mesh) => { mesh.scale.set(2, 2, 2); this.scene.add(mesh) } })

        this.render()

    }



    render() {
        this.stats.begin()

        var delta = this.clock.getDelta();

        if (this.animation) this.animation.update(delta)

        if (this.mixer) this.mixer.update(delta)

        if (this.scene.children) {
            // for (let i = 0; i < this.scene.children[2].children.length; i++) {
            //     if (this.scene.children[2].children[i].userData.active) {
            //         this.scene.children[2].children[i].children[2].rotation.z -= 0.03
            //     }
            // }
        }

        this.stats.end()

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }


}
