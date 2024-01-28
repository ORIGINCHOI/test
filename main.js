import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

// antialias 는 끝부분의 우글거림 완화
const renderer = new THREE.WebGLRenderer({ antialias: true });
// 렌더러 그림자 허용하기
renderer.shadowMap.enabled = true;
// 렌더러 사이즈 화면대로 맞춰주기
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  //시야각 (fov)
  60,
  //가로 세로 비율?
  window.innerWidth / window.innerHeight,
  // near plane
  0.1,
  // far plane
  100
);
camera.position.y = 1;
camera.position.z = 10;

// 첫 번째 인자는 색, 두 번째 인자는 빛의 밝기
const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
directionalLight.castShadow = true;
directionalLight.position.set(3, 4, 5);
//빛이 0, 0, 0을 바라보게 하는 코드, 0 0 0 은 사실 디폴트
directionalLight.lookAt(0, 0 ,0);
scene.add(directionalLight);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
floor.castShadow = true;
scene.add(floor);

// AxesHelper : x, y, z 축 추가
const axesHelper = new THREE.AxesHelper(70);
scene.add(axesHelper);

// Geometry: Mesh의 골격
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material: Mesh의 외형, Basic이 아닌 Standard는 빛의 영향을 받게 됨.
const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// const material = new THREE.MeshBasicMaterial();
// material.color = new THREE.Color("#ff0000");

// 장소위에 등장하는 등장 인물은 Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = 0.5;
mesh.castShadow = true;
mesh.receiveShadow = true;
// scene에 mesh 추가
scene.add(mesh);

const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 20, 30);
const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
capsuleMesh.position.set(3, 1.75, 0);
capsuleMesh.castShadow = true;
capsuleMesh.receiveShadow = true;
scene.add(capsuleMesh);

const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinderMesh.position.set(-3, 1, 0);
cylinderMesh.castShadow = true;
cylinderMesh.receiveShadow = true;
scene.add(cylinderMesh);

const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x000ff });
const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
torusMesh.position.set(0, 0.5, 1);
torusMesh.castShadow = true;
torusMesh.receiveShadow = true;
scene.add(torusMesh);

const starShape = new THREE.Shape();
starShape.moveTo(0, 1);
starShape.lineTo(0.2, 0.2);
starShape.lineTo(1, 0.2);
starShape.lineTo(0.4, -0.1);
starShape.lineTo(0.6, -1);
starShape.lineTo(0, -0.5);
starShape.lineTo(-0.6, -1);
starShape.lineTo(-0.4, -0.1);
starShape.lineTo(-1, 0.2);
starShape.lineTo(-0.2, 0.2);

const shapeGeometry = new THREE.ShapeGeometry(starShape);
const shapeMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
shapeMesh.position.set(0, 1, 2);
scene.add(shapeMesh);

const extrudeSetting = {
  steps: 1,
  depth: 0.1,
  bevelEnabled: true,
  bevelThickness: 0.3,
  bevelSize: 0.3,
  bevelSegments: 100,
};

const extrudeGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSetting);
const extrudeMaterial = new THREE.MeshStandardMaterial({ color: 0x0ddaaf });
const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
extrudeMesh.position.set(2, 1.3, 2);
extrudeMesh.castShadow = true;
extrudeMesh.receiveShadow = true;
scene.add(extrudeMesh);

const loader = new GLTFLoader();

// 드래그하고자 하는 객체들을 배열로 정의
const draggableObjects = [mesh, capsuleMesh, cylinderMesh, torusMesh, shapeMesh, extrudeMesh];

// GLB 파일 로드
loader.load("/untitled.glb", (gltf) => {
  // 로드된 모델을 씬에 추가
  const model = gltf.scene;
  scene.add(model);

  draggableObjects.push(model);

  // 필요한 경우 모델 위치, 크기, 회전 조정
  model.position.set(3, 3, 0);
  model.scale.set(1, 1, 1);
}, undefined, (error) => {
  console.error(error);
});

loader.load("/wall.glb", (gltf) => {
  // 로드된 모델을 씬에 추가
  const model = gltf.scene;
  scene.add(model);

  // 필요한 경우 모델 위치, 크기, 회전 조정
  model.position.set(0, 0, 0);
  model.scale.set(1, 1, 1);
}, undefined, (error) => {
  console.error(error);
});

const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.update();

// DragControls 인스턴스 생성
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

let selectedObject = null;

const pointerLock = new PointerLockControls(camera, renderer.domElement);

document.addEventListener("click", () => {
  pointerLock.lock();
});

// 드래그 이벤트 리스너 추가...
dragControls.addEventListener("dragstart", (event) => {
  // 드래그 시작 시 OrbitControls 비활성화
  orbitControls.enabled = false;
  selectedObject = event.object;
  // pointerLock.unlock();
});

dragControls.addEventListener("dragend", (event) => {
  // 드래그 끝날 때 OrbitControls 다시 활성화
  orbitControls.enabled = true;
  selectedObject = null;
  // pointerLock.lock();
});

// 시점 이동 및 키보드 이동 추가?
// PointerLockControls 인스턴스 생성...
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

// 화면 클릭 시 포인터 잠금 모드 활성화
// document.addEventListener("click", () => {
//   pointerLock.lock();
// });
// pointerLock.lock();

document.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyW":
      moveForward = true;
      break;
    case "KeyA":
      moveLeft = true;
      break;
    case "KeyS":
      moveBackward = true;
      break;
    case "KeyD":
      moveRight = true;
      break;
  }
});

document.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyW":
      moveForward = false;
      break;
    case "KeyA":
      moveLeft = false;
      break;
    case "KeyS":
      moveBackward = false;
      break;
    case "KeyD":
      moveRight = false;
      break;
  }
});

// 개발자 도구 켰다가 꺼도 리사이즈 해주는 코드
window.addEventListener("resize", () => {
  // 렌더러 사이즈 화면대로 맞춰주기
  renderer.setSize(window.innerWidth, window.innerHeight);
  // mesh의 비율 망가지지 않게 해주기
  camera.aspect = window.innerWidth / window.innerHeight;
  // 카메라 속성 바꾼 것을 반영하기
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

// 애니메이션 루프
const render = () => {
  const time = performance.now();
  const delta = (time - prevTime) / 1000;

  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize(); // 이 방향 벡터를 정규화??

  if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

  pointerLock.moveRight(-velocity.x * delta);
  pointerLock.moveForward(-velocity.z * delta);

  if (selectedObject) {
    // 선택한 물체를 사용자와 함께 이동
    selectedObject.position.add(new THREE.Vector3(-velocity.x * delta, 0, -velocity.z * delta));
  }

  prevTime = time;

  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

renderer.render(scene, camera);
