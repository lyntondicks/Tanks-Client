import Component from '../../../component/ChildComponent';
import EventHandler from '../../../EventHandler';
import DomHandler from '../../../DomHandler';
import MultiplayerControls from './MultiplayerControls';

import {Spherical, PerspectiveCamera} from 'three';

export default class Camera extends Component{

    camera: PerspectiveCamera;
    controls: MultiplayerControls;
    
    constructor(camera: PerspectiveCamera){
        super();
        this.camera = camera;

        this.controls = new MultiplayerControls(camera);
    }

    enable(){
        EventHandler.addListener(this, EventHandler.Event.DOM_RESIZE, this.onResize, EventHandler.Level.LOW);
        EventHandler.addListener(this, EventHandler.Event.GAMEMENU_OPEN, this.onGameMenuOpen);
        EventHandler.addListener(this, EventHandler.Event.GAMEMENU_CLOSE, this.onGameMenuClose);

        EventHandler.addListener(this, EventHandler.Event.ARENA_PLAYER_ADDITION, this.onArenaSceneUpdate);

        EventHandler.addListener(this, EventHandler.Event.ARENA_PLAYER_MOVE, this.onPlayerMove);

        this.attachControls();
    }

    disable(){
        EventHandler.removeListener(this, EventHandler.Event.DOM_RESIZE, this.onResize, EventHandler.Level.LOW);
        EventHandler.removeListener(this, EventHandler.Event.GAMEMENU_OPEN, this.onGameMenuOpen);
        EventHandler.removeListener(this, EventHandler.Event.GAMEMENU_CLOSE, this.onGameMenuClose);

        EventHandler.removeListener(this, EventHandler.Event.ARENA_PLAYER_ADDITION, this.onArenaSceneUpdate);

        EventHandler.removeListener(this, EventHandler.Event.ARENA_PLAYER_MOVE, this.onPlayerMove);

        this.detachControls();
    }

    onArenaSceneUpdate(data){
        this.controls.target = data.pos.clone().addScalar(0.5).setY(0);
        this.controls.spherical = new Spherical(25, 5 * Math.PI / 16, Math.PI);
        this.controls.update();
    }

    onPlayerMove(data){
        this.controls.target = data.pos.clone().addScalar(0.5).setY(0);
        this.controls.spherical.theta = data.bodyRot + Math.PI;
        this.controls.update();
    }

    onResize(){
        let dimensions = DomHandler.getDisplayDimensions();
        this.camera.aspect = dimensions.width / dimensions.height;
        this.camera.updateProjectionMatrix();
    }

    onGameMenuOpen(){
        this.detachControls();
    }

    onGameMenuClose(){
        this.attachControls();
    }

    attachControls(){
        this.attachChild(this.controls);
    }

    detachControls(){
        this.detachChild(this.controls);
    }
}
