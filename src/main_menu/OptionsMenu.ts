import Component from "../component/ChildComponent";
import DomEventHandler from "../DomEventHandler";
import DomHandler from "../DomHandler";
import EventHandler from "../EventHandler";

export default class OptionsMenu extends Component {

    public element: HTMLElement;
    public returnBtn: HTMLElement;

    public forwardValueElt: HTMLElement;
    public backwardValueElt: HTMLElement;
    public leftValueElt: HTMLElement;
    public rightValueElt: HTMLElement;
    public shootValueElt: HTMLElement;
    public volumeValueElt: HTMLInputElement;
    public mouseValueElt: HTMLInputElement;

    public isListening: boolean;

    constructor(mainMenu: HTMLElement) {
        super();
        this.element = DomHandler.getElement("#main-menu-opt", mainMenu);

        this.forwardValueElt = DomHandler.getElement("#option-value-forward", this.element);
        this.backwardValueElt = DomHandler.getElement("#option-value-backward", this.element);
        this.leftValueElt = DomHandler.getElement("#option-value-left", this.element);
        this.rightValueElt = DomHandler.getElement("#option-value-right", this.element);
        this.shootValueElt = DomHandler.getElement("#option-value-shoot", this.element);

        this.volumeValueElt = DomHandler.getElement("#option-value-volume", this.element) as HTMLInputElement;
        this.mouseValueElt = DomHandler.getElement("#option-value-mouse", this.element) as HTMLInputElement;

        this.returnBtn = DomHandler.getElement("#opt-opt-return", this.element);

        this.isListening = false;

        this.loadValuesFromStorage();
    }

    public enable() {
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleBackwardClick);
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleForwardClick);
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleLeftClick);
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleRightClick);
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleReturnClick);
        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleShootClick);

        DomEventHandler.addListener(this, this.volumeValueElt, "change", this.handleVolumeChange);
        DomEventHandler.addListener(this, this.mouseValueElt, "change", this.handleMouseChange);

        this.element.style.display = "block";
    }

    public disable() {
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleBackwardClick);
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleForwardClick);
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleLeftClick);
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleRightClick);
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleReturnClick);
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleShootClick);

        DomEventHandler.removeListener(this, this.volumeValueElt, "change", this.handleVolumeChange);
        DomEventHandler.removeListener(this, this.mouseValueElt, "change", this.handleMouseChange);

        this.isListening = false;

        this.element.style.display = "";
    }

    public handleForwardClick(event: MouseEvent) {
        if (event.target === this.forwardValueElt) {
            if (!this.isListening) {
                this.listenForInput(this.forwardValueElt).then((data) => {
                    this.saveChange("forward", data);
                });
            }
        }
    }

    public handleBackwardClick(event: MouseEvent) {
        if (event.target === this.backwardValueElt) {
            if (!this.isListening) {
                this.listenForInput(this.backwardValueElt).then((data) => {
                    this.saveChange("backward", data);
                });
            }
        }
    }

    public handleLeftClick(event: MouseEvent) {
        if (event.target === this.leftValueElt) {
            if (!this.isListening) {
                this.listenForInput(this.leftValueElt).then((data) => {
                    this.saveChange("left", data);
                });
            }
        }
    }

    public handleRightClick(event: MouseEvent) {
        if (event.target === this.rightValueElt) {
            if (!this.isListening) {
                this.listenForInput(this.rightValueElt).then((data) => {
                    this.saveChange("right", data);
                });
            }
        }
    }

    public handleShootClick(event: MouseEvent) {
        if (event.target === this.shootValueElt) {
            if (!this.isListening) {
                this.listenForInput(this.shootValueElt).then((data) => {
                    this.saveChange("shoot", data);
                });
            }
        }
    }

    public handleReturnClick(event: MouseEvent) {
        if (event.target === this.returnBtn) {
            if (!this.isListening) {
                EventHandler.callEvent(EventHandler.Event.OPTMENU_RETURN_OPT_CLICK);
            }
        }
    }

    public handleVolumeChange() {
        const value = Number(this.volumeValueElt.value);
        this.saveChange("volume", value);
    }

    public handleMouseChange() {
        const value = Number(this.mouseValueElt.value);
        this.saveChange("mouseSensitivity", value);
    }

    // key = human readable
    // code = more precise
    public listenForInput(element: HTMLElement) {
        return new Promise((resolve) => {

            element.textContent = "Listening...";
            element.classList.add("active");

            const keyListener = (event: KeyboardEvent) => {
                const data = {
                   code: event.code,
                   key: event.key,
                   isMouse: false,
                };
                conclude(data);
            };

            const mouseListener = (event: MouseEvent) => {
                const data = {
                    code: event.button,
                    key: event.button,
                    isMouse: true,
                };

                conclude(data);
            };

            const conclude = (data: any) => {
                let text = data.key;
                if (data.isMouse) {
                    text = "Mouse " + text;
                }
                element.textContent = text;
                element.classList.remove("active");
                EventHandler.removeListener(this, EventHandler.Event.DOM_KEYDOWN, keyListener);
                EventHandler.removeListener(this, EventHandler.Event.DOM_MOUSEDOWN, mouseListener);
                this.isListening = false;
                resolve(data);
            };

            this.isListening = true;
            EventHandler.addListener(this, EventHandler.Event.DOM_KEYDOWN, keyListener);
            EventHandler.addListener(this, EventHandler.Event.DOM_MOUSEDOWN, mouseListener);

        });
    }

    public loadValuesFromStorage() {
        const rawOptions = localStorage.getItem("userOptions");
        if (rawOptions) {
            const options = JSON.parse(rawOptions);

            const setOption = (optionName: string, element: HTMLElement) => {
                if (options[optionName].isMouse) {
                    element.textContent = "Mouse " + options[optionName].key;
                } else {
                    element.textContent = options[optionName].key;
                }
            };

            const setRangeValue = (value: number, element: HTMLInputElement) => {
                element.value = "" + value;
            };

            setOption("forward", this.forwardValueElt);
            setOption("backward", this.backwardValueElt);
            setOption("left", this.leftValueElt);
            setOption("right", this.rightValueElt);
            setOption("shoot", this.shootValueElt);

            setRangeValue(options.volume, this.volumeValueElt);
            setRangeValue(options.mouseSensitivity, this.mouseValueElt);

        } else {
            console.warn("No options to read from. Were they deleted?");
        }
    }

    public saveChange(attribute: string, data: any) {
        const rawOptions = localStorage.getItem("userOptions");
        if (rawOptions) {
            const storedOptions = JSON.parse(rawOptions);
            storedOptions[attribute] = data;
            localStorage.setItem("userOptions", JSON.stringify(storedOptions));
            EventHandler.callEvent(EventHandler.Event.OPTIONS_UPDATE, storedOptions);
        }
    }
}
