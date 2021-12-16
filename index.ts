import 'babylonjs-loaders';
import * as dat from 'dat.gui';
import { GUIController } from 'dat.gui';

const canvas = document.getElementById("canvas");
if (!(canvas instanceof HTMLCanvasElement)) throw new Error("Couldn't find a canvas. Aborting the demo")

const engine = new BABYLON.Engine(canvas, true, {});

class envMapTest {
	gui: dat.GUI;
	scene1Env: GUIController;
	scene2Env: GUIController;
	scene1: BABYLON.Scene;
	scene2: BABYLON.Scene;
	model1?: BABYLON.Mesh;
	model2?: BABYLON.Mesh;
	envMaps: string[];
	models: string[];


	constructor(scene1:BABYLON.Scene, scene2:BABYLON.Scene) {
		this.gui = new dat.GUI({});
		
		this.scene1 = scene1;
		this.scene2 = scene2;
		this.envMaps = [
			'none',
			'1EnvHDR',
			'2EnvHDR',
			'3EnvHDR',
			'4EnvHDR',
			'env1EnvHDR',
			'env2EnvHDR',
			'env3EnvHDR',
			'env4EnvHDR',
			'env5EnvHDR',
			'env6EnvHDR',
			'env7EnvHDR',
			'env8EnvHDR',
			'env9EnvHDR',
			'env10EnvHDR',
			'env11EnvHDR',
		]
		this.models = [
			'pixcap_1k',
			'sword_1',
			'robot1'
		]
		this.gui.add({model: 'none'}, 'model', this.models).onChange((t) => this.changeModel(t));

		this.scene1Env = this.gui.add({scene1: 'none'}, 'scene1', this.envMaps).onChange((t) => this.changeTexture(t, this.scene1));
		this.scene2Env = this.gui.add({scene2: 'none'}, 'scene2', this.envMaps).onChange((t) => this.changeTexture(t, this.scene2));

	}
	changeModel(modelName:string){
		for (var i = 0; i < this.scene1.meshes.length; i++) {
			this.scene1.meshes[i].dispose();
			this.scene2.meshes[i].dispose();
			i--;
		}    
		BABYLON.SceneLoader.Append("./", modelName + ".glb", this.scene1, function (scene) {
		});
		BABYLON.SceneLoader.Append("./", modelName + ".glb", this.scene2, function (scene) {
		});
	}

	changeTexture(envMap:string, scene:BABYLON.Scene){
		if(envMap == 'none'){
			scene.environmentTexture = null;
		}
		else{
			//@ts-ignore
			scene.environmentTexture = new BABYLON.CubeTexture.CreateFromPrefilteredData('environment/' + envMap + '.dds', scene);
		}
	}


}
function createCamera(cameraName:string, scene:BABYLON.Scene) {
	const name = cameraName|| 'camera';
	const target =  BABYLON.Vector3.Zero();
	const radius =  12;
	const camera = new BABYLON.ArcRotateCamera(name, Math.PI / 2, Math.PI / 3, radius, target, scene);
	camera.wheelDeltaPercentage = 0.1;
	camera.angularSensibilityY = 80;
	camera.angularSensibilityX = 80;
	camera.inertia = 0;
	camera.panningInertia = 0.9;

	camera.minZ = 0.01;

	return camera;
}

function prepareScene() {
	var scene = new BABYLON.Scene(engine);
    var scene2 = new BABYLON.Scene(engine);
    scene2.autoClear = false;
	const test = new envMapTest(scene, scene2);
	
	var camera1 = createCamera("camera1", scene);
	var camera2 = createCamera("camera1", scene2);


    // This attaches the camera to the canvas
    camera1.attachControl(canvas, true);
    camera2.attachControl(canvas, true);

        
    scene.activeCameras!.push(camera1);
    scene2.activeCameras!.push(camera2);

    camera1.viewport = new BABYLON.Viewport(0, 0, 0.5, 1);
    camera2.viewport = new BABYLON.Viewport(0.5, 0, 0.5, 1);


    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
    var light2 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene2);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;
    light2.intensity = 0.7;

  
	// Append glTF model to scene.
	BABYLON.SceneLoader.Append("./", "pixcap_1k.glb", scene, function (scene) {
		// test.model1 = 
	});
	BABYLON.SceneLoader.Append("./", "pixcap_1k.glb", scene2, function (scene) {
	});

    scene.afterRender = () => {
        scene2.render();
    }

	engine.runRenderLoop(() => {
		scene.render();
	});
}

prepareScene();


window.addEventListener("resize", () => {
	engine.resize();
})