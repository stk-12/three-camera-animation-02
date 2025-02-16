// import { radian, random } from './utils';
import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


class Main {
  constructor() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.canvas = document.querySelector("#canvas");

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.viewport.width, this.viewport.height);

    this.loader = new GLTFLoader();

    this.mixer = null;
    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.camera = null;
    this.mesh = null;

    this.controls = null;

    this._init();
    // this._update();
    this._addEvent();
  }

  _setCamera() {
    //ウインドウとWebGL座標を一致させる
    const fov = 45;
    const fovRadian = (fov / 2) * (Math.PI / 180); //視野角をラジアンに変換
    const distance = (this.viewport.height / 2) / Math.tan(fovRadian); //ウインドウぴったりのカメラ距離
    this.camera = new THREE.PerspectiveCamera(fov, this.viewport.width / this.viewport.height, 1, distance * 2);
    this.camera.position.z = distance;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
  }

  // _setControlls() {
  //   this.controls = new OrbitControls(this.camera, this.canvas);
  //   this.controls.enableDamping = true;
  // }

  _setLight() {
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(1, 1, 1);
    this.scene.add(light);

    const ambLight = new THREE.AmbientLight(0xFFFFFF, 0.8);
    this.scene.add(ambLight);
  }

  _addModel() {
    this.loader.load('model/city1.glb', (gltf) => {
      const model = gltf.scene;
      const animations = gltf.animations;

      this.camera = gltf.cameras[0];


      if(animations && animations.length) {
 
          //Animation Mixerインスタンスを生成
          this.mixer = new THREE.AnimationMixer(model);
  
          //全てのAnimation Clipに対して
          for (let i = 0; i < animations.length; i++) {
              let animation = animations[i];
  
              //Animation Actionを生成
              let action = this.mixer.clipAction(animation) ;
  
              //ループ設定
              // action.setLoop(THREE.LoopOnce); // 1回再生
              action.setLoop(THREE.LoopRepeat); // ループ再生
  
              //アニメーションの最後のフレームでアニメーションが終了
              action.clampWhenFinished = true;
  
              //アニメーションを再生
              action.play();
          }
      }


      this.scene.add(model);

      this._update();

    });
  }

  _addMesh() {
    const geometry = new THREE.BoxGeometry(50, 50, 50);
    const material = new THREE.MeshStandardMaterial({color: 0x444444});
    this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(this.mesh);
  }

  _init() {
    // this._setCamera();
    // this._setControlls();
    // this._setLight();
    // this._addMesh();
    this._addModel();
  }

  _update() {

    //レンダリング
    this.renderer.render(this.scene, this.camera);
    // this.controls.update();
    requestAnimationFrame(this._update.bind(this));

    //Animation Mixerを実行
    if(this.mixer){
      this.mixer.update(this.clock.getDelta() * 0.5);
    }
  }

  _onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    // レンダラーのサイズを修正
    this.renderer.setSize(this.viewport.width, this.viewport.height);
    // カメラのアスペクト比を修正
    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();
  }

  _addEvent() {
    window.addEventListener("resize", this._onResize.bind(this));
  }
}

new Main();



