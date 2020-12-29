// import * as THREE from '../../libs/three.module.js';
import Overpaint from '../objects/Overpaint.js';

export class Scene extends THREE.Scene {

    constructor(){

        super();
        this.scene = 0;

        //カメラ
        this._persCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 10, 500);
        this.camera = this._persCamera; //初期値
        this.camera.camPos = new THREE.Vector3(-74, 70, 215);//
        this.camera.position.set(this.camera.camPos.x,this.camera.camPos.y,this.camera.camPos.z);

        this._overpaint = new Overpaint();
        this.add(this._overpaint);

    }

    update(){

        this._overpaint.update();

    }
}
