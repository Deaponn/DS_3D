import { Sprite, Vector3 } from "../three/build/three.module.js"

export default class Particle extends Sprite {
    constructor(material) {
        super()

        this.material = material.clone()
        // skala naszego sprite
        this.y = Math.floor(Math.random() * 10) / 10
        this.scale.set(
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10,
            Math.floor(Math.random() * 10) + 10
        );

    }

    update() {
        // wewnątrz tej funkcji przemieszczamy cząsteczkę do góry - y
        // a kiedy osiągnie określony punkt
        // cząsteczka wraca na y = 0
        // trzeba też zmieniać przezroczystość cząsteczki
        // tak aby u góry stała się całkiem przezroczysta
        // można tez losować jej x i z aby wywołać wrażenie drgania
        // całość wymaga trochę eksperymentów
        // aby wrażenie było poprawne
        // a moje pytajniki należy zastąpić własnymi pomysłami

        if (this.position.y > 30) {
            this.position.x = Math.random()
            this.position.z = Math.random()
            this.position.y = 0;
            this.material.opacity = 1;
        }


        this.material.opacity -= 0.02;
        this.position.y += Math.floor(Math.random() * 10) / 10

    }

    changeScale(x, y, z) {
        this.scale.set(x, y, z)
    }
}