import { OBJLoader } from '../three/examples/jsm/loaders/OBJLoader.js';

export default class Model {
    constructor(manager, scene) {
        this.manager = manager
        this.geometry = null
        this.scene = scene
    }

    load(path, that) {
        new OBJLoader(this.manager).load(
            path,
            geometry => {
                this.geometry = geometry;
                that.objectLoaded(this.geometry)
            },
        );
    }
}
