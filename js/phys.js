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
    camera.position.set(12, 8, 12);   
    
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

	lineGeometryX.vertices.push(new THREE.Vector3(-15, 0, 0));
	lineGeometryX.vertices.push(new THREE.Vector3(15, 0, 0));

	scene.add(new THREE.Line(lineGeometryX, lineMaterialX));

	var lineGeometryY = new THREE.Geometry();	
	var lineMaterialY = new THREE.LineBasicMaterial({color: "rgb(0, 255, 0)", linewidth: 2});

	lineGeometryY.vertices.push(new THREE.Vector3(0, -15, 0));
	lineGeometryY.vertices.push(new THREE.Vector3(0, 15, 0));

	scene.add(new THREE.Line(lineGeometryY, lineMaterialY));

	var lineGeometryZ = new THREE.Geometry();	
	var lineMaterialZ = new THREE.LineBasicMaterial({color: "rgb(0, 0, 255)", linewidth: 2});

	lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, -15));
	lineGeometryZ.vertices.push(new THREE.Vector3(0, 0, 15));

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
	
	modelView.update();	
}


function Controller(modelView) {
	
	this.modelView = modelView;

	var self = this;

	this.addDatGUI = function() {
		
		var gui = new dat.GUI({ autoPlace: false });
		var controlsContainer = document.getElementById('controls-container');
		controlsContainer.appendChild(gui.domElement);

		var eccentricityControl = gui.add(self.modelView, 'eccentricity', 0, 0.99, 0.01);
		eccentricityControl.name('e');
		eccentricityControl.onChange(function(value) {
			self.modelView.update();
		});
		
		var semimajorAxisControl = gui.add(self.modelView, 'semimajorAxis', 6.371, 10.000, 0.01);
		semimajorAxisControl.name('a');
		semimajorAxisControl.onChange(function(value) {
			self.modelView.update();
		});
		
		var inclinationControl = gui.add(self.modelView, 'inclination', 0, 180, 0.01);
		inclinationControl.name('i');
		inclinationControl.onChange(function(value) {
			self.modelView.update();
		});

		var longtitudeAscendingNodeControl = gui.add(self.modelView, 'longtitudeAscendingNode', 0, 360, 0.01);
		longtitudeAscendingNodeControl.name('Omega');
		longtitudeAscendingNodeControl.onChange(function(value) {
			self.modelView.update();
		});

		var periapsisArgumentControl = gui.add(self.modelView, 'periapsisArgument', 0, 360, 0.01);
		periapsisArgumentControl.name('omega');
		periapsisArgumentControl.onChange(function(value) {
			self.modelView.update();
		});
		
		var meanAnomalyControl = gui.add(self.modelView, 'meanAnomaly', 0, 360, 0.01);
		meanAnomalyControl.name('v');
		meanAnomalyControl.onChange(function(value) {
			self.modelView.update();
		});
		
	};

}


function ModelView() {
	
	this.eccentricity = 0;
	this.semimajorAxis = 6.671;
	this.inclination = 0;
	this.longtitudeAscendingNode = 0;
	this.periapsisArgument = 0;
	this.meanAnomaly = 0;
	
	var self = this;
	
	var NUMBER_OF_VERTICES = 500
	
	var orbit;
	var radius;
	var body;
	var planet;
	
	initOrbit();
	initRadius();
	initBody();
	initPlanet();
	
	function initOrbit() {
		var material = new THREE.LineBasicMaterial({color: "rgb(0, 0, 0)", linewidth: 2});
		var geometry = new THREE.Geometry();
		
		for (var i = 0 ; i < NUMBER_OF_VERTICES ; i++) {
			geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		}
		
		orbit = new THREE.Line(geometry, material);
		
		scene.add(orbit);
	}
	
	function initRadius() {
		var material = new THREE.LineBasicMaterial({color: "rgb(0, 0, 0)", linewidth: 3});
		var geometry = new THREE.Geometry();
		
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		geometry.vertices.push(new THREE.Vector3(0, 0, 0));
		
		radius = new THREE.Line(geometry, material);
		
		scene.add(radius);
	}
	
	function initBody() {
		var geometry = new THREE.SphereGeometry(0.2, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: "rgb(255, 0, 0)"});
        
        body = new THREE.Mesh(geometry, material);	
        
        scene.add(body);
	}
	
	function initPlanet() {
		var geometry = new THREE.SphereGeometry(6.371, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: "rgb(200, 200, 200)", transparent: true, opacity: 0.2});
        
        planet = new THREE.Mesh(geometry, material);	
        
        scene.add(planet);		
	}
	
	this.getOrbitalPosition = function(nu) {	
		var a = this.semimajorAxis;
		var e = this.eccentricity;
		
		var inc = this.inclination * Math.PI / 180;
		var bigOmega = this.longtitudeAscendingNode * Math.PI / 180;
		var omega = this.periapsisArgument * Math.PI / 180;		
		
		var r = a * (1 - e * e) / (1 + e * Math.cos(nu + omega));

		var x = r * (Math.cos(nu + omega) * Math.cos(bigOmega) - Math.sin(nu + omega) * Math.cos(inc) * Math.sin(bigOmega));
		var y = r * (Math.cos(nu + omega) * Math.sin(bigOmega) + Math.sin(nu + omega) * Math.cos(inc) * Math.cos(bigOmega));
		var z = r * (Math.sin(nu + omega) * Math.sin(inc));	
		
		return [x, y, z];
	};
	
	this.update = function() {		
		for (var i = 0 ; i < NUMBER_OF_VERTICES ; i++) {
			var nu =  2 * Math.PI / NUMBER_OF_VERTICES * i;
			var orbitalPosition = this.getOrbitalPosition(nu);	

			orbit.geometry.vertices[i].x = orbitalPosition[1];
			orbit.geometry.vertices[i].y = orbitalPosition[2];
			orbit.geometry.vertices[i].z = orbitalPosition[0];
		}
		
		orbit.geometry.verticesNeedUpdate = true;
		
		var nu = this.meanAnomaly * Math.PI / 180;	
		var orbitalPosition = this.getOrbitalPosition(nu);	

		radius.geometry.vertices[1].x = orbitalPosition[1];
		radius.geometry.vertices[1].y = orbitalPosition[2];
		radius.geometry.vertices[1].z = orbitalPosition[0];

		radius.geometry.verticesNeedUpdate = true;
		
		body.position.x = orbitalPosition[1];
		body.position.y = orbitalPosition[2];
		body.position.z = orbitalPosition[0];
	};
	
}


function animate() {
	/* Will always point to the center of the frame */
	cameraControls.target = new THREE.Vector3(0, 0, 0);
	cameraControls.update();

	renderer.render(scene, camera);
    requestAnimationFrame(animate);	
}



