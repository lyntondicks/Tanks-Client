import Component from '../component/ChildComponent';
import DomHandler from '../DomHandler';
import EventHandler from '../EventHandler';
import DomEventHandler from '../DomEventHandler';

export default class DisconnectedScreen extends Component{

    element: HTMLElement;
    disconnectElt: HTMLElement;

    constructor(parent){
        super();
        this.element = DomHandler.getElement('.section-disconnected', parent);
        this.disconnectElt = DomHandler.getElement('.option-disconnect', this.element);

    }

    enable(){
        DomEventHandler.addListener(this, this.disconnectElt, 'click', this.onDisconnect);
        this.element.style.display = 'block';
    }

    disable(){
        DomEventHandler.removeListener(this, this.disconnectElt, 'click', this.onDisconnect);
        this.element.style.display = '';
    }

    onDisconnect(){
        EventHandler.callEvent(EventHandler.Event.CONNECTION_SCREEN_DISCONNECT);
    }
}