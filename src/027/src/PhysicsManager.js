export class PhysicsManager {
    constructor() {
    }

    enablePhysics(scene, gravity) {
        scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }
}
