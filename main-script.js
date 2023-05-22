
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

var movementSpeed = 0.5;
var rotationSpeed = 0.1;
var maxLowerRotationAngle = Math.PI/2;
var minLowerRotationAngle = 0;
var maxHeadRotationAngle = Math.PI;
var minHeadRotationAngle = 0;
var maxLeftArmPosition = 11.25
var minLeftArmPosition = 6.75;
var maxRightArmPosition = -11.25
var minRightArmPosition = -6.75;

var isTruck = 0;

var materials = {
    black: new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: false }),
    red: new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: false }),
    white: new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: false }),
}

var keys = Array(256).fill(0);

var geomWheel = new THREE.CylinderGeometry(3.75, 3.75, 3);
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
    //createCorpo();
    createTow();
    createHead();
    createLeftArm();
    createRightArm();
    createTorso();
    createLegs();   
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
    thigh = new THREE.Mesh(geomThigh, materials.white);
    thigh.position.set(x,y,z);
    return thigh;
}

function createAnkle(x,y,z){
    'use strict';
    ankle = new THREE.Mesh(geomAnkle, materials.white);
    ankle.position.set(x,y,z);
    return ankle;
}

function createEye(x,y,z){
    'use strict';
    eye = new THREE.Mesh(geomEye, materials.white);
    eye.position.set(x,y,z);
    return eye;
}

function createEar(x,y,z){
    'use strict'
    ear = new THREE.Mesh(geomEar, materials.white);
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

    skull = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 3), materials.white);
    mouth = new THREE.Mesh(new THREE.ConeGeometry(1.5, 1.5), materials.white);
    eyeL = createEye(1.5, 1.5, 1.5);
    eyeR = createEye(-1.5, 1.5, 1.5);
    earL = createEar(2.25, 3.75, 0);
    earR = createEar(-2.25, 3.75, 0);    
    skull.position.set(0, 1.5, 0);
    mouth.position.set(0, 0.75, 1.5);
    head = new THREE.Object3D();
    head.position.set(0,6,0);
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
    foot = new THREE.Mesh(geomFoot, materials.white);
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

function createArm(){
    'use strict';
}

function createLegs(){
    'use strict';

    wheel1L = createWheel( 10.5, -3, 3);
    wheel2L = createWheel( 10.5, -13.5, 3);
    wheel3L = createWheel( 10.5, -21, 3);
    wheel1R = createWheel( -10.5, -3, 3);
    wheel2R = createWheel( -10.5, -13.5, 3);
    wheel3R = createWheel( -10.5, -21, 3);
    hips = new THREE.Mesh(new THREE.BoxGeometry(18, 9, 4.5), materials.white);
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

    armL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 9, 4.5), materials.white);
    forearmL = new THREE.Mesh(new THREE.BoxGeometry(4.5, 3, 9), materials.white);
    pipeL = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 6));
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

    armR = new THREE.Mesh(new THREE.BoxGeometry(-4.5, 9, 4.5), materials.white);
    forearmR = new THREE.Mesh(new THREE.BoxGeometry(-4.5, 3, 9), materials.white);
    pipeR = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 6));
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

    ret1 = new THREE.Mesh(new THREE.BoxGeometry(18, 19.5, 48), materials.white);
    ret1.position.set(0,0,0);

    ret2 = new THREE.Mesh(new THREE.BoxGeometry(18, 4.5, 33), materials.white);
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

    tow.position.set(0,5.25,-46.5);

}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';

}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';

}

////////////
/* UPDATE */
////////////
function update(){ 
    'use strict';
    if (keys[38]) {
      // Mover 'tow' para cima
        tow.position.z -= movementSpeed;
    }
    if (keys[40]) {
      // Mover 'tow' para baixo
        tow.position.z += movementSpeed;
    }
    if (keys[37]) {
      // Mover 'tow' para a esquerda
        tow.position.x -= movementSpeed;
    }
    if (keys[39]) {
      // Mover 'tow' para a direita
        tow.position.x += movementSpeed;
    }
    if (keys[70]) {
        head.rotation.x -= rotationSpeed;
    }
    if (keys[82]) {
        head.rotation.x += rotationSpeed;
    }
    if (head.rotation.x > maxHeadRotationAngle){
        head.rotation.x = maxHeadRotationAngle;
    }
    if (head.rotation.x < minHeadRotationAngle){
        head.rotation.x = minHeadRotationAngle;
    }
    if (keys[87]) {
        legs.rotation.x += rotationSpeed;
    }
    if (keys[83]) {
        legs.rotation.x -= rotationSpeed;
    }
    if (legs.rotation.x > maxLowerRotationAngle){
        legs.rotation.x = maxLowerRotationAngle;
    }
    if (legs.rotation.x < minLowerRotationAngle){
        legs.rotation.x = minLowerRotationAngle;
    }
    if (keys[81]) {
        feet.rotation.x += rotationSpeed;
    }
    if (keys[65]) {
        feet.rotation.x -= rotationSpeed;
    }
    if (feet.rotation.x > maxLowerRotationAngle){
        feet.rotation.x = maxLowerRotationAngle;
    }
    if (feet.rotation.x < minLowerRotationAngle){
        feet.rotation.x = minLowerRotationAngle;
    }
    if (keys[68]) {
        leftArm.position.x += movementSpeed;
        rightArm.position.x -= movementSpeed;
    }
    if (keys[69]) {
        leftArm.position.x -= movementSpeed;
        rightArm.position.x += movementSpeed;
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
            isTruck = 1;
        }
    else{
        isTruck = 0;
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
    currentCamera = cameraFront; // definir como default camera ativa a frontal

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
        currentCamera.aspect = window.innerWidth / window.innerHeight;
        currentCamera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    switch(e.keyCode){
        case 49: // Tecla 1 - Camera Frontal
            currentCamera = cameraFront;
            break;
            //currentCamera.updateProjectionMatrix(); // Atualize a matriz de projeção da câmera ativa
        case 50: // Tecla 2 - Camera Lateral
            currentCamera = cameraSide;
            break;
        case 51: // Tecla 3 - Camera Topo
            currentCamera = cameraTop;
            break;
        case 52: // Tecla 4 - Camera isometrica - ortogonal
            currentCamera = cameraOrthographic;
            break;
        case 53: // Tecla 5 - Camera isometrica - perspetiva
            currentCamera = cameraPerspective;
            break; 
        case 54: // Tecla 6 - Toggle Wireframe manualmente dar toggle a wireframe de cada material
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