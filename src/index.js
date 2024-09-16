import * as Cesium from "cesium";
import {HeadingPitchRoll, Ion, Math, Quaternion, Viewer} from "cesium";
import "cesium/Widgets/widgets.css";
import "./css/main.css";
import * as MATH from "mathjs";

// Your access token can be found at: https://cesium.com/ion/tokens.
Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYzVmYzgyNy1mYTAyLTRlYTktOTk0Ni1kNmEwNmNkOGY0MDQiLCJpZCI6MjIwNTk2LCJpYXQiOjE3MTc2NzgwNzR9.OxDy9eWiX8vyBXdOcgjSyfMGYfll2sa-DBSBhH-uais";
// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer");
const iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];

if (iframe) {
  iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms');
}

const scene = viewer.scene;
const clock = viewer.clock;
let i;
const ids = [];
const satelliteIds = [];
const groundStationIds = [];
const bodiesIds = [];
var idsLenght;

const satelliteGroup = document.getElementById("satellite-content");
const groundStationGroup = document.getElementById("ground-station-content");
const bodiesGroup = document.getElementById("bodies-content");

function icrf(scene, time) {
  if (scene.mode !== Cesium.SceneMode.SCENE3D) {
    return;
  }

  const icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
  if (Cesium.defined(icrfToFixed)) {
    const camera = viewer.camera;
    const offset = Cesium.Cartesian3.clone(camera.position);
    const transform = Cesium.Matrix4.fromRotationTranslation(
        icrfToFixed
    );
    camera.lookAtTransform(transform, offset);
  }
}

function createNavBall() {

  const xCamera = viewer.camera.position.x - 2*viewer.camera.direction.x;
  const yCamera = viewer.camera.position.y - 2*viewer.camera.direction.y;
  const zCamera = viewer.camera.position.z - 2*viewer.camera.direction.z;

  const cameraCartesian = new Cesium.Cartesian3(xCamera, yCamera, zCamera) + viewer.camera.direction;
  const position = cameraCartesian;
  const heading = viewer.camera.heading;
  const pitch = viewer.camera.pitch;
  const roll = viewer.camera.roll;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = new Quaternion(0,0,0,1);

  viewer.clock.onTick.addEventListener(function() {

    const directionX = viewer.camera.directionWC.x;
    const directionY = viewer.camera.directionWC.y;
    const directionZ = viewer.camera.directionWC.z;

    const cosX = MATH.acos(directionX);
    const sinX = MATH.asin(directionX);
    const cosY = MATH.acos(directionY);
    const sinY = MATH.asin(directionY);
    const cosZ = MATH.acos(directionZ);

    const listOfRadForZ = [];
    const listOfRadForX = [];
    for (let j = 0; j < 1000; j++) {
      const currentNumberPi = Math.PI / j;
      const currentNumberTwoPi = (2 * Math.PI) / j
      listOfRadForZ.push(currentNumberPi);
      listOfRadForX.push(currentNumberTwoPi);
    }

    let xCamera, yCamera, zCamera;
    let pitchCamera, rollCamera, headingCamera;
    let pitchDefault, rollDefault, headingDefault;

    xCamera = viewer.camera.position.x;
    yCamera = viewer.camera.position.y;
    zCamera = viewer.camera.position.z;

    pitchCamera = viewer.camera.pitch;
    rollCamera = viewer.camera.roll;
    headingCamera = viewer.camera.heading;

    pitchDefault = -Math.PI/2;
    rollDefault = 0;
    headingDefault = 2*Math.PI;

    let deltaPitch, deltaRoll, deltaHeading;

    deltaPitch = pitchDefault - pitchCamera;
    deltaRoll = rollDefault - rollCamera;
    deltaHeading = headingDefault - headingCamera;

    // console.log("Heading : ", headingCamera);
    // console.log("Pitch : ", pitchCamera);
    // console.log("Roll : ", rollCamera);

    console.log("Heading delta : ", deltaHeading);
    console.log("Pitch delta: ", deltaPitch);
    console.log("Roll delta: ", deltaRoll);    //
    // let headingPitchRoll;
    // headingPitchRoll = new HeadingPitchRoll(headingCamera, pitchCamera, rollCamera);

    let zoom, zeroZoom, deltaZoom;
    zoom = viewer.camera.getMagnitude();
    zeroZoom = 34642019.37981909;
    deltaZoom = (zeroZoom - zoom) / zeroZoom;
    // console.log("Zoom : ", zoom);
    // console.log("Delta Zoom : ", deltaZoom);

    let rSpherical, thetaSpherical, phiSpherical;
    rSpherical = MATH.sqrt(xCamera * xCamera + yCamera * yCamera + zCamera * zCamera);
    thetaSpherical = MATH.acos(zCamera / rSpherical);
    phiSpherical = MATH.atan2(yCamera, xCamera);

    let rSphericalNavBall, thetaSphericalNavBall, phiSphericalNavBall;
    if (deltaZoom > 0) {
      rSphericalNavBall = rSpherical - 3 + deltaZoom*2.5;
    }
    else {
      rSphericalNavBall = rSpherical - 3 + deltaZoom*3;
    }
    thetaSphericalNavBall = thetaSpherical + 18e-9;
    phiSphericalNavBall = phiSpherical;

    let xNavBall, yNavBall, zNavBall;
    xNavBall = rSphericalNavBall * MATH.sin(thetaSphericalNavBall) * MATH.cos(phiSphericalNavBall);
    yNavBall = rSphericalNavBall * MATH.sin(thetaSphericalNavBall) * MATH.sin(phiSphericalNavBall);
    zNavBall = rSphericalNavBall * MATH.cos(thetaSphericalNavBall);



    let position
    position = new Cesium.Cartesian3(xNavBall, yNavBall, zNavBall);
    navBallEntity.position = position;
    // navBallEntity.orientation = Cesium.Transforms.headingPitchRollQuaternion(position, headingPitchRoll);
  });

  const navBallEntity = viewer.entities.add({
    id: "navBall",
    position: position,
    orientation: orientation,
    show: true,
    model: {
      uri: "./navball.glb",
      minimumPixelSize: 200,
      maximumScale: 10000,
      scale: 0.15
    },
  });
  return navBallEntity
}

const czmlDataSource = Cesium.CzmlDataSource.load("./Output.czml");
viewer.dataSources.add(czmlDataSource).then(ds => {
  for (let i = 0; i < ds.entities.values.length; i++) {
    const currentId = ds.entities.values[i].id;
    idsLenght = ids.push(currentId);
  }
  for (let j = 0; j < ds.entities.values.length; j++) {
    const currentId = ids[j];
    const currentElement = ds.entities.values[j];
    viewer.entities.add(currentElement);
    const strId = currentId.toString();

    if (strId.includes("SAT/") && (!strId.includes("/SAT/"))) {
      const liSatellite = document.createElement('li');
      liSatellite.innerText = currentId;
      liSatellite.addEventListener("click", (e) => {
        const didFly = viewer.flyTo(currentElement)});
      satelliteGroup.appendChild(liSatellite);
    }

    if (currentId.toString().includes("GROUND_STATION/")) {
      const liGroundStation = document.createElement('li');
      liGroundStation.innerText = currentId;
      liGroundStation.addEventListener("click", (e) => {
        const didFly = viewer.flyTo(currentElement);});

      groundStationGroup.appendChild(liGroundStation);
    }

    if (currentId.toString().includes("BODY") && (!strId.includes("ABSTRACT_POINT_ON"))) {
      const liBodies = document.createElement('li');
      liBodies.innerText = currentId;
      liBodies.addEventListener("click", (e) => {
        const didFly = viewer.flyTo(currentElement);});
      bodiesGroup.appendChild(liBodies);
    }
  }
})

const navBallEntity = createNavBall();

const coll = document.getElementsByClassName("all-objects");

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener('click', function () {
    this.classList.toggle('active');
    const content = this.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
    } else {
      content.style.display = 'block';
    }
  });
}

const toolbar = document.querySelector("div.cesium-viewer-toolbar");
const modeButton = document.querySelector("span.cesium-sceneModePicker-wrapper");
const lightButton = document.createElement("button");
const icrfButton = document.createElement("button");
const objectsButton = document.createElement("button");
const navBallButton = document.createElement("button");

lightButton.classList.add("cesium-button", "cesium-toolbar-button");
icrfButton.classList.add("cesium-button", "cesium-toolbar-button");
objectsButton.classList.add("cesium-button", "cesium-toolbar-button");
navBallButton.classList.add("cesium-button", "cesium-toolbar-button");

document.getElementById("all-objects").style.display = "none";
var icrfOn = false;


lightButton.innerHTML = "<img draggable='false' src='./buttons-display/light.png' alt=''>";
icrfButton.innerHTML = "<img draggable='false' src='./buttons-display/ITRF.png' alt=''>";
objectsButton.innerHTML = "<img draggable='false' src='./buttons-display/objects.png' alt=''>";
navBallButton.innerHTML = "<img draggable='false' src='./buttons-display/navball.png' alt=''>";
toolbar.insertBefore(lightButton, modeButton);
toolbar.insertBefore(icrfButton, modeButton);
toolbar.insertBefore(objectsButton, modeButton);
toolbar.insertBefore(navBallButton, modeButton);

lightButton.addEventListener("click", (e) => {viewer.scene.globe.enableLighting = !viewer.scene.globe.enableLighting;})
icrfButton.addEventListener("click", (e) => {
  if (icrfOn) {
    scene.postUpdate.removeEventListener(icrf);
    icrfOn = false;
  }
  else {
    scene.postUpdate.addEventListener(icrf)
    icrfOn = true;
  }});

objectsButton.addEventListener("click", (e) => {

  if (document.getElementById("all-objects").style.display === "none") {

    document.getElementById("all-objects").style.display = "block";
    document.getElementById("objects-tabbutongroup").style.display = "block";
    document.getElementById("objects-tabgroup").style.display = "block";
    document.getElementById("satellite-group").style.display = "block";
    document.getElementById("ground-station-group").style.display = "block";
    document.getElementById("bodies-group").style.display = "block";
    document.getElementById("satellite-content").style.display = "block";
    document.getElementById("ground-station-content").style.display = "none";
    document.getElementById("bodies-content").style.display = "none";
  }
  else {
    document.getElementById("all-objects").style.display = "none";
    document.getElementById("objects-tabbutongroup").style.display = "none";
    document.getElementById("objects-tabgroup").style.display = "none";
    document.getElementById("satellite-group").style.display = "none";
    document.getElementById("ground-station-group").style.display = "none";
    document.getElementById("bodies-group").style.display = "none";
    document.getElementById("satellite-content").style.display = "none";
    document.getElementById("ground-station-content").style.display = "none";
    document.getElementById("bodies-content").style.display = "none";
  }
});

navBallButton.addEventListener("click", (e) => {
  navBallEntity.show = !navBallEntity.show;
});
