var renderer;
var scene;
var camera;
var cameraControls;
var controller;

var container = document.getElementById("threejs_container");
var width = container.offsetWidth;
var height = container.offsetHeight;


init();
animate();


function init() {
	initRenderer();
	initScene();
	initCamera();
	initLight();	
	initReferenceView();	
	initMVC();
}


function initRenderer() {
	renderer = new THREE.WebGLRenderer({precision: 'lowp', antialias: true, preserveDrawingBuffer: false});
    renderer.setSize(width, height);  
    renderer.setClearColor("rgb(255, 255, 255)", 1); 

	container.appendChild(renderer.domElement);
}


function initScene() {
    scene = new THREE.Scene();
}


function initCamera() {
    camera = new THREE.PerspectiveCamera(55, width / height, 1, 100);
    camera.position.set(3, 1, 3);   
    
    cameraControls = new THREE.OrbitControls(camera, renderer.domElement);    
    cameraControls.noPan = false;
    cameraControls.noKeys = true;
}


function initLight() {
    var light = new THREE.PointLight("rgb(255, 255, 255)");
    
    light.position.set(0, 50, 10);
    scene.add(light);        
}


function initReferenceView() {
	var lineGeometryX = new THREE.Geometry();	
	var lineMaterialX = new THREE.LineBasicMaterial({color: "rgb(255, 0, 0)", linewidth: 2});

	lineGeometryX.vertices.push(new THREE.Vector3(-10, 0, 0));
	lineGeometryX.vertices.push(new THREE.Vector3(10, 0, 0));

	scene.add(new THREE.Line(lineGeometryX, lineMaterialX));

	var lineGeometryY = new THREE.Geometry();	
	var lineMaterialY = new THREE.LineBasicMaterial({color: "rgb(0, 255, 0)", linewidth: 2});

	lineGeometryY.vertices.push(new THREE.Vector3(0, -10, 0));
	lineGeometryY.vertices.push(new THREE.Vector3(0, 10, 0));

	scene.add(new THREE.Line(lineGeometryY, lineMaterialY));

	var lineGeometryZ = new THREE.Geometry();	
	var lineMaterialZ = new THREE.LineBasicMaterial({color: "rgb(0, 0, 255)", linewidth: 2});

	lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, -10));
	lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, 10));

	scene.add(new THREE.Line(lineGeometryZ, lineMaterialZ));	

	for (var i = -15 ; i <= 15 ; i++) {
		var lineGeometryPlane = new THREE.Geometry();
		var lineMaterialPlane = new THREE.LineBasicMaterial({color: "rgb(100, 100, 100)", linewidth: 0.5});

		lineGeometryPlane.vertices.push(new THREE.Vector3(i, 0, -15));
		lineGeometryPlane.vertices.push(new THREE.Vector3(i, 0, 15));

		scene.add(new THREE.Line(lineGeometryPlane, lineMaterialPlane));	
	}

	for (var i = -15 ; i <= 15 ; i++) {
		var lineGeometryPlane = new THREE.Geometry();
		var lineMaterialPlane = new THREE.LineBasicMaterial({color: "rgb(100, 100, 100)", linewidth: 0.5});

		lineGeometryPlane.vertices.push(new THREE.Vector3(-15, 0, i));
		lineGeometryPlane.vertices.push(new THREE.Vector3(15, 0, i));

		scene.add(new THREE.Line(lineGeometryPlane, lineMaterialPlane));	
	}	

}


function initMVC() {
	var modelView = new ModelView();
	
	controller = new Controller(modelView);
	controller.addDatGUI();

	modelView.addToScene(scene);		
}


function Controller(modelView) {
	
	this.modelView = modelView;

	var self = this;

	this.addDatGUI = function() {
		var gui = new dat.GUI({ autoPlace: false });
		var controlsContainer = document.getElementById('controls-container');
		controlsContainer.appendChild(gui.domElement);

		gui.add(self.modelView, 'eccentricity', 0, 1, 0.01).name('e');
		gui.add(self.modelView, 'semimajorAxis', 6371, 10000, 0.01).name('a');
		gui.add(self.modelView, 'inclination', -360, 360, 0.01).name('i');
		gui.add(self.modelView, 'longtitudeAscendingNode', 0, 360, 0.01).name('Omega');
		gui.add(self.modelView, 'periapsisArgument', 0, 360, 0.01).name('omega');
		gui.add(self.modelView, 'meanAnomaly', 0, 360, 0.01).name('v');
	};

}


function ModelView() {
	
	this.eccentricity = 0;
	this.semimajorAxis = 6371;
	this.inclination = 0;
	this.longtitudeAscendingNode = 0;
	this.periapsisArgument = 0;
	this.meanAnomaly = 0;
	
	this.addToScene = function() {
		
	};
	
}


function animate() {
	/* Will always point to the center of the frame */
	cameraControls.target = new THREE.Vector3(0, 0, 0);
	cameraControls.update();

	renderer.render(scene, camera);
    requestAnimationFrame(animate);	
}



