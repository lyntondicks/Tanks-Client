import { PerspectiveCamera, Spherical, Vector3 } from "three";
import ChildComponent from "../../component/ChildComponent";
import DomHandler from "../../DomHandler";
import EventHandler from "../../EventHandler";
import CameraControls from "./CameraControls";

export default class Camera extends ChildComponent {

    protected camera: PerspectiveCamera;
    protected controls: CameraControls;

    protected followingSpherical: Spherical;
    protected followingTarget: Vector3;

    protected controlsEnabled: boolean;

    constructor(camera: PerspectiveCamera) {
        super();
        this.camera = camera;
        this.controls = new CameraControls();

        this.followingSpherical = new Spherical(25, Math.PI / 4, Math.PI / 3);
        this.followingTarget = new Vector3();

        this.controlsEnabled = true;
    }

    public enable() {
        EventHandler.addListener(this, EventHandler.Event.DOM_RESIZE, this.onResize, EventHandler.Level.LOW);

        EventHandler.addListener(this, EventHandler.Event.GAMEMENU_OPEN, this.onGameMenuOpen);
        EventHandler.addListener(this, EventHandler.Event.GAMEMENU_CLOSE, this.onGameMenuClose);

        EventHandler.addListener(this, EventHandler.Event.CAMERA_CONTROLS_UPDATE, this.onControlsUpdate);

        EventHandler.addListener(this, EventHandler.Event.CAMERA_PAN, this.onPan);
    }

    public disable() {
        EventHandler.removeListener(this, EventHandler.Event.DOM_RESIZE, this.onResize, EventHandler.Level.LOW);

        EventHandler.removeListener(this, EventHandler.Event.GAMEMENU_OPEN, this.onGameMenuOpen);
        EventHandler.removeListener(this, EventHandler.Event.GAMEMENU_CLOSE, this.onGameMenuClose);

        EventHandler.removeListener(this, EventHandler.Event.CAMERA_CONTROLS_UPDATE, this.onControlsUpdate);

        EventHandler.removeListener(this, EventHandler.Event.CAMERA_PAN, this.onPan);
    }

    protected attachControls(updateStatus: boolean) {
        this.attachChild(this.controls);
        if (updateStatus) {
            this.controlsEnabled = true;
        }
    }

    protected detachControls(updateStatus: boolean) {
        this.detachChild(this.controls);
        if (updateStatus) {
            this.controlsEnabled = false;
        }
    }

    protected onControlsUpdate(spherical: Spherical) {
        this.followingSpherical = spherical;

        this.camera.position.setFromSpherical(this.followingSpherical);
        this.camera.position.add(this.followingTarget);

        this.camera.lookAt(this.followingTarget);
    }

    private onPan(data: any) {
        const deltaX = data.x;
        const deltaY = data.y;

        const offset = this.camera.position.clone();
        offset.sub(this.followingTarget);

        let targetDistance = offset.length();
        targetDistance *= Math.tan(this.camera.fov / 2 * Math.PI / 180);

        const yVec = new Vector3();
        const xVec = new Vector3();

        yVec.setFromMatrixColumn(this.camera.matrix, 0);
        xVec.copy(yVec);

        yVec.crossVectors(this.camera.up, yVec);
        yVec.multiplyScalar(2 * deltaY * targetDistance / DomHandler.getDisplayDimensions().height);
        this.followingTarget.add(yVec);

        xVec.multiplyScalar(-(2 * deltaX * targetDistance / DomHandler.getDisplayDimensions().height));
        this.followingTarget.add(xVec);

        this.camera.position.setFromSpherical(this.followingSpherical);
        this.camera.position.add(this.followingTarget);

        this.camera.lookAt(this.followingTarget);
    }

    private onResize() {
        const dimensions = DomHandler.getDisplayDimensions();
        this.camera.aspect = dimensions.width / dimensions.height;
        this.camera.updateProjectionMatrix();
    }

    private onGameMenuOpen() {
        if (this.controlsEnabled) {
            this.detachControls(false);
        }
    }

    private onGameMenuClose() {
        if (this.controlsEnabled) {
            this.attachControls(false);
        }
    }
}
