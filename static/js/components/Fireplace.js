import { Object3D, SpriteMaterial, TextureLoader, AdditiveBlending } from "../three/build/three.module.js"
import Particle from "./Particle.js"

export default class Fireplace extends Object3D {

    constructor() {
        super()
        //tablica na cząsteczki
        this.particles = []
        // przewidywana ilość cząsteczek
        this.count = 20
        // materiał cząsteczki, rzecz najważniejsza
        // jego właściwość blending decyduje o tym, że cząsteczki mieszają się
        // ze sobą

        this.particleMaterial = new SpriteMaterial({
            color: 0xff3312,
            map: new TextureLoader().load("./assets/fire.png"),
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: AdditiveBlending
        });

        this.init()
    }

    init() {
        while (this.count > 0) {
            var particle = new Particle(this.particleMaterial)
            this.add(particle)
            this.particles.push(particle);
            this.count--
        }
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].update()
        }
    }

    updateScale(x, y, z) {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].changeScale(x, y, z)
        }
    }
}
