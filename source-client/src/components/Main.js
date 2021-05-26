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

        this.camera.position.set(700, 500, 600)
        this.camera.lookAt(700, 200, 0)
        // this.camera.position.set(-100, 350, -100)
        // this.camera.lookAt(-100, 370, -150)

        this.isLoaded = null
        this.animation = null

        let light = new DirectionalLight(0xffffff, 1);
        light.position.set(100, 300, 300);
        light.target = this.scene
        this.scene.add(light);

        new OrbitControls(this.camera, this.renderer.domElement)
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

        this.load.load("./assets/room.fbx", (geometry, mixer) => {
            this.room = geometry
            geometry.children[3].children[0].children[0].children[0].children[0].material.shininess = 0.5
            console.log(geometry.children[3].children[0].children[0].children, geometry.children[3].children[0].children[0].children[29].children[0].material)
            geometry.children[3].children[0].children[0].children, geometry.children[3].children[0].children[0].children[29].children[0].material.color.setRGB(0, 0, 0)
            this.room.scale.set(5, 5, 5)
            // this.room.rotation.y -= Math.PI / 4
            // this.room.position.set(700, -900, -1300)
        }, null)

        new PipeManagement(this.scene, this.manager)

        this.rotator = new Rotator(this.scene, this.camera)

        this.manager.onProgress = (item, loaded, total) => {
            console.log(`progress ${item}: ${loaded} / ${total}`);
        };

        window.onkeydown = (key) => {
            switch (key.key) {
                case "w": {
                    this.player.position.x += 10
                    break
                }
                case "s": {
                    this.player.position.x -= 10
                    break
                }
                case "a": {
                    this.player.position.z -= 10
                    break
                }
                case "d": {
                    this.player.position.z += 10
                    break
                }
                case "Shift": {
                    this.player.position.y -= 10
                    break
                }
                case " ": {
                    this.player.position.y += 10
                    break
                }
                case "z": {
                    this.player.rotation.y += 0.01
                    break
                }
                case "x": {
                    this.player.rotation.y -= 0.01
                    break
                }
                case "c": {
                    this.player.scale.x -= 0.1
                    this.player.scale.y -= 0.1
                    this.player.scale.z -= 0.1
                    break
                }
                case "v": {
                    this.player.scale.x += 0.1
                    this.player.scale.y += 0.1
                    this.player.scale.z += 0.1
                    break
                }
            }
            console.log(this.player.position, this.player.rotation.y, this.player.scale)
        }

        var raycaster = new Raycaster(); // obiekt Raycastera symulujący "rzucanie" promieni
        var mouseVector = new Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie, a potem przeliczenia na pozycje 3D

        window.onmousedown = (event) => {
            mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouseVector, this.camera);
            var intersects = raycaster.intersectObjects(this.scene.children, true);
            console.log(intersects.length)
            if (intersects.length > 0) {

                // zerowy w tablicy czyli najbliższy kamery obiekt to ten, którego potrzebujemy:

                console.log(intersects[0].point);

            }
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
            for (let i = 0; i < this.scene.children[2].children.length; i++) {
                if (this.scene.children[2].children[i].userData.active) {
                    this.scene.children[2].children[i].children[2].rotation.z -= 0.03
                }
            }
        }

        this.stats.end()

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }


}
