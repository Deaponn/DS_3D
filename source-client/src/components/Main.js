import {
    Scene,
    LoadingManager,
    Clock,
    Vector3,
    GridHelper,
    DirectionalLight
} from 'three';
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
        this.camera.lookAt(700, 400, 0)

        this.isLoaded = null
        this.animation = null

        var light = new DirectionalLight(0xffffff, 0.3);
        light.position.set(100, 300, 300);
        light.target = this.scene
        this.scene.add(light);

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
        this.mixer = this.load.load("./assets/character.fbx", ["./assets/playing.fbx", "./assets/pre-lose.fbx", "./assets/losing.fbx", "./assets/win.fbx"], (mixer) => { this.mixer = mixer })

        new PipeManagement(this.scene, this.manager)

        this.rotator = new Rotator(this.scene, this.camera)

        this.manager.onProgress = (item, loaded, total) => {
            console.log(`progress ${item}: ${loaded} / ${total}`);
        };

        this.lightManager = new LightManagement()

        this.scene.add(this.lightManager.getContainer())

        this.lightManager.createLight(700, 400)

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
