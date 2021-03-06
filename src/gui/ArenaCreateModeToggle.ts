import Component from "../component/ChildComponent";
import DomHandler from "../DomHandler";
import EventHandler from "../EventHandler";

export default class ArenaCreateModeToggle extends Component {

    private parentElt: HTMLElement;
    private cameraToggleElt: HTMLElement;
    private blockToggleElt: HTMLElement;
    private gamespawnToggleElt: HTMLElement;
    private initialspawnToggleElt: HTMLElement;

    private mode: number;

    constructor(gui: HTMLElement) {
        super();
        this.parentElt = DomHandler.getElement(".create-world-mode-toggle-parent", gui);
        this.cameraToggleElt = DomHandler.getElement("#gui-create-world-toggle-camera", this.parentElt);
        this.blockToggleElt = DomHandler.getElement("#gui-create-world-toggle-block", this.parentElt);
        this.gamespawnToggleElt = DomHandler.getElement("#gui-create-world-toggle-gamespawn", this.parentElt);
        this.initialspawnToggleElt = DomHandler.getElement("#gui-create-world-toggle-initialspawn", this.parentElt);

        this.mode = Mode.CAMERA;

    }

    public enable() {
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.onClick);
        EventHandler.addListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_BLOCK, this.onToggleBlock);
        EventHandler.addListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_CAMERA, this.onToggleCamera);
        EventHandler.addListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_GAMESPAWN, this.onToggleGameSpawn);
        EventHandler.addListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_INITIALSPAWN, this.onToggleInitialSpawn);

        EventHandler.addListener(this, EventHandler.Event.DOM_KEYDOWN, this.onKeyDown);

        this.updateHTMLClasses();

        this.parentElt.style.display = "inline-block";
    }

    public disable() {
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.onClick);
        EventHandler.removeListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_BLOCK, this.onToggleBlock);
        EventHandler.removeListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_CAMERA, this.onToggleCamera);
        EventHandler.removeListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_GAMESPAWN, this.onToggleGameSpawn);
        EventHandler.removeListener(this, EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_INITIALSPAWN, this.onToggleInitialSpawn);
        EventHandler.removeListener(this, EventHandler.Event.DOM_KEYDOWN, this.onKeyDown);

        this.parentElt.style.display = "none";
    }

    private onClick(event: MouseEvent) {
        if (event.target === this.cameraToggleElt) {
            if (this.mode !== Mode.CAMERA) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_CAMERA);
            }
        } else if (event.target === this.blockToggleElt) {
            if (this.mode !== Mode.BLOCK) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_BLOCK);
            }
        } else if (event.target === this.gamespawnToggleElt) {
            if (this.mode !== Mode.GAMESPAWN) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_GAMESPAWN);
            }
        } else if (event.target === this.initialspawnToggleElt) {
            if (this.mode !== Mode.INITIALSPAWN) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_INITIALSPAWN);
            }
        }
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.code === "KeyB") {
            if (this.mode !== Mode.BLOCK) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_BLOCK);
            }
        } else if (event.code === "KeyC") {
            if (this.mode !== Mode.CAMERA) {
                EventHandler.callEvent(EventHandler.Event.ARENA_CREATE_MODE_TOGGLE_CAMERA);
            }
        }
    }

    private onToggleCamera() {
        this.mode = Mode.CAMERA;
        this.updateHTMLClasses();
    }

    private onToggleBlock() {
        this.mode = Mode.BLOCK;
        this.updateHTMLClasses();
    }

    private onToggleGameSpawn() {
        this.mode = Mode.GAMESPAWN;
        this.updateHTMLClasses();
    }

    private onToggleInitialSpawn() {
        this.mode = Mode.INITIALSPAWN;
        this.updateHTMLClasses();
    }

    private updateHTMLClasses() {
        switch (this.mode) {
            case Mode.CAMERA:
                this.cameraToggleElt.classList.add("create-world-toggle-enabled");

                this.blockToggleElt.classList.remove("create-world-toggle-enabled");
                this.gamespawnToggleElt.classList.remove("create-world-toggle-enabled");
                this.initialspawnToggleElt.classList.remove("create-world-toggle-enabled");
                break;
            case Mode.BLOCK:
                this.blockToggleElt.classList.add("create-world-toggle-enabled");

                this.cameraToggleElt.classList.remove("create-world-toggle-enabled");
                this.gamespawnToggleElt.classList.remove("create-world-toggle-enabled");
                this.initialspawnToggleElt.classList.remove("create-world-toggle-enabled");
                break;
            case Mode.GAMESPAWN:
                this.gamespawnToggleElt.classList.add("create-world-toggle-enabled");

                this.cameraToggleElt.classList.remove("create-world-toggle-enabled");
                this.blockToggleElt.classList.remove("create-world-toggle-enabled");
                this.initialspawnToggleElt.classList.remove("create-world-toggle-enabled");
                break;
            case Mode.INITIALSPAWN:
                this.initialspawnToggleElt.classList.add("create-world-toggle-enabled");

                this.cameraToggleElt.classList.remove("create-world-toggle-enabled");
                this.gamespawnToggleElt.classList.remove("create-world-toggle-enabled");
                this.blockToggleElt.classList.remove("create-world-toggle-enabled");
                break;
        }
    }
}

enum Mode {
    CAMERA,
    BLOCK,
    GAMESPAWN,
    INITIALSPAWN,
}
