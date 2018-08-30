import Component from '../Component';
import DomHandler from '../DomHandler';
import EventHandler from '../EventHandler';

export default class SinglePlayerGameMenu extends Component {

    constructor(){
        super();
        this.element = DomHandler.getElement('#game-menu-sp');
        this.cancelBtn = DomHandler.getElement('#game-menu-sp-cancel', this.element);
        this.saveBtn = DomHandler.getElement('#game-menu-sp-world-save', this.element);
        this.returnBtn = DomHandler.getElement("#game-menu-sp-return-to-main", this.element);
    }

    enable(){
        EventHandler.callEvent(EventHandler.Event.GAMEMENU_OPEN);

        EventHandler.addListener(this, EventHandler.Event.DOM_CLICK, this.handleClick);

        this.element.style.display = 'block';
    }

    disable(){
        EventHandler.removeListener(this, EventHandler.Event.DOM_CLICK, this.handleClick);

        this.element.style.display = '';
    }

    handleClick(event){
        if(event.target === this.cancelBtn){
            EventHandler.callEvent(EventHandler.Event.GAMEMENU_CLOSE_REQUEST);
        }else if(event.target === this.saveBtn){
            EventHandler.callEvent(EventHandler.Event.SP_GAMEMENU_SAVE_GAME_REQUEST);
        }else if(event.target === this.returnBtn){
            EventHandler.callEvent(EventHandler.Event.SP_GAMEMENU_RETURN_TO_MAIN_REQUEST);
        }
    }
}
