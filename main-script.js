//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var currentCamera, cameraFront, cameraSide, cameraTop, cameraOrthographic, cameraPerspective, scene, renderer;
var wheel, arm, forearm, pipe, thigh, ankle, foot;
var ret1, ret2, wheel1, wheel2, wheel3, wheel4, tow;
var skull, eyeL, eyeR, earL, earR, mouth, head, eye, ear;
var chest, back, torso;
var armL, armR, forearmL, forearmR, pipeL, pipeR, leftArm, rightArm;
var hips, thighL, thighR, ankleL, ankleR, footL, footR, wheel1L, wheel2L, wheel3L, wheel1R, wheel2R, wheel3R, legs, feet;

var truckAABBmax = new THREE.Vector3(12, 8.25, 4.5);
var truckAABBmin = new THREE.Vector3(-12, -12, -34.5);

var towAABBmax = new THREE.Vector3(12, 15, -42.5);
var towAABBmin = new THREE.Vector3(-12, -12, -94.25);

var towPos = new THREE.Vector3(0,5.25,-46.5) // posicao correta do reboque

// towAABBmax e min respetivos para quando reboque ta na posicao = (12, 15, -22.5) e (-12, -12, -74.25)

var movementSpeed = 30;
var rotationSpeed = 5;
var maxLowerRotationAngle = Math.PI/2;
var minLowerRotationAngle = 0;
var maxHeadRotationAngle = Math.PI;
var minHeadRotationAngle = 0;
var maxLeftArmPosition = 11.25
var minLeftArmPosition = 6.75;
var maxRightArmPosition = -11.25
var minRightArmPosition = -6.75;
var viewSize = 50;

var isTruck = false;
var isCollidingThisFrame = false;
var wasCollidingLastFrame = false;
var animating = false; //ja houve animacao? inicia a false
var inPlace = false;

const clock = new THREE.Clock();

var materials = {
    black: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: 0xeb001f, wireframe: false }),
    darkRed: new THREE.MeshBasicMaterial({ color: 0x8f0a1c, wireframe: false }),
    lightGray: new THREE.MeshBasicMaterial({ color: 0xeeeeee, wireframe: false }),
    gray: new THREE.MeshBasicMaterial({ color: 0xcccccc, wireframe:false}),
    blue: new THREE.MeshBasicMaterial({ color: 0x001170, wireframe:false})
}

var keys = Array(256).fill(0);

var geomWheel = new THREE.CylinderGeometry(3.75, 3.75, 3, 64);
var geomThigh = new THREE.BoxGeometry(7.5, 6, 3);
var geomAnkle = new THREE.BoxGeometry(7.5, 9, 3);
var geomFoot = new THREE.BoxGeometry(7.5, 3, 9);
var geomEye = new THREE.SphereGeometry(0.75);
var geomEar = new THREE.ConeGeometry(0.75, 1.5);



/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    const backgroundColor = new THREE.Color( 0xaaaaaa );
    scene = new THREE.Scene();

    scene.background = backgroundColor;


    scene.add(new THREE.AxisHelper(10));
    createTow();
    createHead();
    createLeftArm();
    createRightArm();
    createTorso();
    createLegs();  
    // initAABB(); 
}

//////////////////////
/* CREATE CAMERAS */
//////////////////////

function createCameras() {
    'use strict';
    cameraPerspective = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    cameraPerspective.position.set(50, 50, 50); // Posição da câmera
    cameraPerspective.lookAt(scene.position); // Orientação da câmera para o centro da cena
    scene.add(cameraPerspective);

    cameraOrthographic = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, 1, 1000);
    cameraOrthographic.position.set(500, 500, 500); // Posição da câmera
    cameraOrthographic.lookAt(scene.position); // Orientação da câmera para o centro da cena
    scene.add(cameraOrthographic);

    cameraFront = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, 1, 1000);
    cameraFront.position.set(0, 0, 500); // Posição da câmera
    cameraFront.lookAt(scene.position); // Orientação da câmera para o centro da cena
    scene.add(cameraFront);

    cameraSide = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, 1, 1000);
    cameraSide.position.set(500, 0, 0); // Posição da câmera
    cameraSide.lookAt(scene.position); // Orientação da câmera para o centro da cena
    scene.add(cameraSide);

    cameraTop = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, 1, 1000);
    cameraTop.position.set(0, 500, 0); // Posição da câmera
    cameraTop.lookAt(scene.position); // Orientação da câmera para o centro da cena
    scene.add(cameraTop);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createWheel(x,y,z){
    'use strict';
    wheel = new THREE.Mesh(geomWheel, materials.black);
    wheel.rotateZ(Math.PI / 2);
    wheel.position.set(x,y,z);
    return wheel;
}

function createThigh(x,y,z){
    'use strict';
    thigh = new THREE.Mesh(geomThigh, materials.lightGray);
    thigh.position.set(x,y,z);
    return thigh;
}

function createAnkle(x,y,z){
    'use strict';
    ankle = new THREE.Mesh(geomAnkle, materials.blue);
    ankle.position.set(x,y,z);
    return ankle;
}

function createEye(x,y,z){
    'use strict';
    eye = new THREE.Mesh(geomEye, materials.red);
    eye.position.set(x,y,z);
    return eye;
}

function createEar(x,y,z){
    'use strict';
    ear = new THREE.Mesh(geomEar, materials.blue);
    ear.position.set(x,y,z);
    return ear;
}

function createTorso(){
    'use strict';
    chest = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 4.5), materials.red);
    back = new THREE.Mesh(new THREE.BoxGeometry(9, 12, 9), materials.red);
    chest.position.set( 0, 1.5, 2.25);
    back.position.set(0, 0, 0);
    torso = new THREE.Object3D();
    torso.add(chest);
    torso.add(back);
    scene.add(torso);
    torso.position.set(0,0,0);
}

function createHead(){
    'use strict';

    skull = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 3), materials.blue);
    mouth = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.5), materials.lightGray);
    eyeL = createEye(1.5, 1.6, 1.5);
    eyeR = createEye(-1.5, 1.6, 1.5);
    earL = createEar(2.25, 3.76, 0);
    earR = createEar(-2.25, 3.76, 0);    
    skull.position.set(0, 1.6, 0);
    mouth.position.set(0, 0.76, 1.5);
    head = new THREE.Object3D();
    head.position.set(0,5.99,0);
    head.add(skull);
    head.add(eyeL);
    head.add(eyeR);
    head.add(earL);
    head.add(earR);
    head.add(mouth);
    scene.add(head);
}

function createFoot(x,y,z){
    'use strict';
    foot = new THREE.Mesh(geomFoot, materials.blue);
    foot.position.set(x,y,z);
    return foot;
}

function createFeet(){
    'use strict';
    footL = createFoot(5.25, 0, 3);
    footR = createFoot(-5.25, 0, 3);
    feet = new THREE.Object3D();
    feet.position.set(0, -23.25, 2.25);
    feet.add(footL);
    feet.add(footR);
    return feet;
}

function createLegs(){
    'use strict';

    wheel1L = createWheel( 10.5, -3, 3);
    wheel2L = createWheel( 10.5, -13.5, 3);
    wheel3L = createWheel( 10.5, -21, 3);
    wheel1R = createWheel( -10.5, -3, 3);
    wheel2R = createWheel( -10.5, -13.5, 3);
    wheel3R = createWheel( -10.5, -21, 3);
    hips = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 4.5), materials.red);
    hips.position.set(0,-5.27,-1.5);
    thighL = createThigh(5.25, -9.75, 2.25);
    thighR = createThigh(-5.25, -9.75, 2.25);
    ankleL = createAnkle(5.25, -17.25, 2.25);
    ankleR = createAnkle(-5.25, -17.25, 2.25);
    feet = createFeet();
    legs = new THREE.Object3D();
    legs.position.set(0, -5.25, -3.75);
    legs.add(wheel1L);
    legs.add(wheel2L);
    legs.add(wheel3L);
    legs.add(wheel1R);
    legs.add(wheel2R);
    legs.add(wheel3R);
    legs.add(hips);
    legs.add(thighL);
    legs.add(thighR);
    legs.add(ankleL);
    legs.add(ankleR);
    legs.add(feet);
    scene.add(legs);
}

function createLeftArm(){
    'use strict';

    armL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 9, 4.5), materials.darkRed);
    forearmL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3, 9), materials.darkRed);
    pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 6), materials.lightGray);
    pipeL.rotateZ(Math.PI / -4);
    armL.position.set(0, 1.5, -2.25);
    forearmL.position.set(0,-4.5,0);
    pipeL.position.set(2.25, 5.25, -2.25);
    leftArm = new THREE.Object3D();
    leftArm.position.set(6.75, 0, 0);
    leftArm.add(armL);
    leftArm.add(forearmL);
    leftArm.add(pipeL);
    scene.add(leftArm);
}

function createRightArm(){
    'use strict';

    armR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 9, 4.5), materials.darkRed);
    forearmR = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3, 9), materials.darkRed);
    pipeR = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 6), materials.lightGray);
    pipeR.rotateZ(Math.PI / 4);
    armR.position.set(0, 1.5, -2.25);
    forearmR.position.set(0,-4.5,0);
    pipeR.position.set(-2.25, 5.25, -2.25);
    rightArm = new THREE.Object3D();
    rightArm.position.set(-6.75, 0, 0);
    rightArm.add(armR);
    rightArm.add(forearmR);
    rightArm.add(pipeR);
    scene.add(rightArm);

}

function createTow(){
    'use strict';

    ret1 = new THREE.Mesh(new THREE.BoxGeometry(18, 19.5, 48), materials.gray);
    ret1.position.set(0,0,0);

    ret2 = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 33), materials.gray);
    ret2.position.set(0, -12, -7.5);
    
    wheel1 = createWheel(-10.5, -13.5, -14.25);
    wheel2 = createWheel(-10.5, -13.5, -23.25);
    wheel3 = createWheel(10.5, -13.5, -14.25);
    wheel4 = createWheel(10.5, -13.5, -23.25);

    tow = new THREE.Object3D();
    tow.add(ret1);
    tow.add(ret2);
    tow.add(wheel1);
    tow.add(wheel2);
    tow.add(wheel3);
    tow.add(wheel4);
    // tow.position.set() 

    scene.add(tow);
    tow.position.set(0,5.25,-66.5);

}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    if(towAABBmin.x <= truckAABBmin.x && towAABBmax.x >= truckAABBmin.x && towAABBmax.z >= truckAABBmin.z && towAABBmin.z <= truckAABBmax.z){
        return true;
    }

    if(towAABBmin.x <= truckAABBmax.x && towAABBmax.x > truckAABBmax.x && towAABBmax.z >= truckAABBmin.z && towAABBmin.z <= truckAABBmax.z){
        return true;
    }
    /*
    if(towAABBmax.z >= truckAABBmin.z && towAABBmin.x < truckAABBmin.x && towAABBmax.x <= truckAABBmin.x){
        return true;
    }*/

    return false;

}

/////////////////////// 
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){    
    'use strict';

    animating = true;
}

function animationStep(animMov, remainingDistance){   
    if(animMov.length() >= remainingDistance.length()){
        tow.position.copy(towPos);
    } else {
        tow.position.add(animMov);
    }
    
    if(tow.position.x == towPos.x && tow.position.z == towPos.z){
        inPlace = true;
    }
}

////////////
/* UPDATE */
////////////
function update(){ 
    'use strict';
    let delta = clock.getDelta();
    let towDelta = new THREE.Vector3();
    let dV = new THREE.Vector3();
    let dAux = new THREE.Vector3();

    if (keys[38] && !animating) {
      // Moves the 'tow' up
        towDelta.z -= 1;
        isCollidingThisFrame = checkCollisions();
    }
    if (keys[40] && !animating) {
      // Moves the 'tow' downwards
        towDelta.z += 1;
        isCollidingThisFrame = checkCollisions();
    }
    if (keys[37] && !animating) {
      // Moves the 'tow' to the left
        towDelta.x -= 1;
        isCollidingThisFrame = checkCollisions();
    }
    if (keys[39] && !animating) {
      // Moves the 'tow' to the right
        towDelta.x += 1;
        isCollidingThisFrame = checkCollisions();
    }

    let movement = towDelta.normalize().multiplyScalar(movementSpeed * delta);
    tow.position.add(movement);
    towAABBmax.add(movement);
    towAABBmin.add(movement);

    if(isCollidingThisFrame && !wasCollidingLastFrame && isTruck){
        handleCollisions();
    }

    if(!isCollidingThisFrame && wasCollidingLastFrame){
        wasCollidingLastFrame = false;
    }

    if(animating){
        dV.x = (towPos.x - tow.position.x);
        dV.z = (towPos.z - tow.position.z);
        dAux.copy(dV);
        animationStep(dV.normalize().multiplyScalar(movementSpeed*delta), dAux);
    }

    if(inPlace){
        wasCollidingLastFrame = true;
        animating = false;
        // SET towAABB to place after animation
        towAABBmax.x = 12;
        towAABBmax.y = 15;
        towAABBmax.z = -22.5;
        towAABBmin.x = -12;
        towAABBmin.y = -12;
        towAABBmin.z = -74.25;
        inPlace = false;
    }

    if (keys[70] && !animating) {
        head.rotation.x -= rotationSpeed * delta;
    }
    if (keys[82] && !animating) {
        head.rotation.x += rotationSpeed * delta;
    }    
    if (head.rotation.x > maxHeadRotationAngle){
        head.rotation.x = maxHeadRotationAngle;
    }
    if (head.rotation.x < minHeadRotationAngle){
        head.rotation.x = minHeadRotationAngle;
    }
    if (keys[87] && !animating) {
        legs.rotation.x += rotationSpeed * delta;
    }
    if (keys[83] && !animating) {
        legs.rotation.x -= rotationSpeed * delta;
    }
    if (legs.rotation.x > maxLowerRotationAngle){
        legs.rotation.x = maxLowerRotationAngle;
    }
    if (legs.rotation.x < minLowerRotationAngle){
        legs.rotation.x = minLowerRotationAngle;
    }
    if (keys[81] && !animating) {
        feet.rotation.x += rotationSpeed * delta;
    }
    if (keys[65] && !animating) {
        feet.rotation.x -= rotationSpeed * delta;
    }
    if (feet.rotation.x > maxLowerRotationAngle){
        feet.rotation.x = maxLowerRotationAngle;
    }
    if (feet.rotation.x < minLowerRotationAngle){
        feet.rotation.x = minLowerRotationAngle;
    }
    if (keys[68] && !animating) {
        leftArm.position.x += movementSpeed * delta;
        rightArm.position.x -= movementSpeed * delta;
    }
    if (keys[69] && !animating) {
        leftArm.position.x -= movementSpeed * delta;
        rightArm.position.x += movementSpeed * delta;
    }
    if (leftArm.position.x >= maxLeftArmPosition){
        leftArm.position.x = maxLeftArmPosition;
        rightArm.position.x = maxRightArmPosition;
    }
    if (leftArm.position.x <= minLeftArmPosition){
        leftArm.position.x = minLeftArmPosition;
        rightArm.position.x = minRightArmPosition;
    }
    if (leftArm.position.x == minLeftArmPosition && rightArm.position.x == minRightArmPosition && head.rotation.x == maxHeadRotationAngle &&
        feet.rotation.x == maxLowerRotationAngle && legs.rotation.x == maxLowerRotationAngle){
            isTruck = true;
            
        }
    else{
        isTruck = false;
    }
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, currentCamera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();
    currentCamera = cameraFront; // Defines the front view camera as the active default camera

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    requestAnimationFrame(animate);
    update();
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (window.innerHeight > 0 && window.innerWidth > 0) {
        if (currentCamera == cameraPerspective){
            currentCamera.aspect = window.innerWidth / window.innerHeight;
            currentCamera.updateProjectionMatrix();
        }
        else{
            currentCamera.left = -(window.innerWidth / window.innerHeight) * viewSize;
            currentCamera.right = (window.innerWidth / window.innerHeight) * viewSize;
            currentCamera.top = viewSize;
            currentCamera.bottom = -viewSize;
            currentCamera.updateProjectionMatrix();
        }
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch(e.keyCode){
        case 49: // Key 1 - Front View Camera
            currentCamera = cameraFront;
            onResize();
            break;
            // Atualize a matriz de projeção da câmera ativa
        case 50: // Key 2 - Side Camera
            currentCamera = cameraSide;
            onResize();
            break;
        case 51: // Key 3 - Top View Camera
            currentCamera = cameraTop;
            onResize();
            break;
        case 52: // Key 4 - Orthogonal Isometric Camera
            currentCamera = cameraOrthographic;
            onResize();
            break;
        case 53: // Key 5 - Perspective Isometric Camera
            currentCamera = cameraPerspective;
            onResize();
            break; 
        case 54: // Key 6 - Manually toggles each material's wireframe
            for (let i in materials){
                materials[i].wireframe = !materials[i].wireframe;
            }
        break;
    }
    keys[e.keyCode] = 1;
}


///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e) {
    'use strict';
    keys[e.keyCode] = 0;
}