import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DragControls } from "three/examples/jsm/controls/DragControls";

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

// Geometry: Mesh의 골격
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Material: Mesh의 외형, Basic이 아닌 Standard는 빛의 영향을 받게 됨.
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
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

// GLB 파일 로드
loader.load("/untitled.glb", (gltf) => {
  // 로드된 모델을 씬에 추가
  const model = gltf.scene;
  scene.add(model);

  // 필요한 경우 모델 위치, 크기, 회전 조정
  model.position.set(3, 3, 0);
  model.scale.set(1, 1, 1);
}, undefined, (error) => {
  console.error(error);
});

// GLB 파일 로드
loader.load("/modelglb.glb", (gltf) => {
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

// 드래그하고자 하는 객체들을 배열로 정의
const draggableObjects = [mesh, capsuleMesh, cylinderMesh, torusMesh, shapeMesh, extrudeMesh];
// DragControls 인스턴스 생성
const dragControls = new DragControls(draggableObjects, camera, renderer.domElement);

// 드래그 이벤트 리스너 추가 (예시)
dragControls.addEventListener('dragstart', function (event) {
  // 드래그 시작 시 OrbitControls 비활성화
  orbitControls.enabled = false;
});

dragControls.addEventListener('dragend', function (event) {
  // 드래그 끝날 때 OrbitControls 다시 활성화
  orbitControls.enabled = true;
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

const render = () => {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

renderer.render(scene, camera);


// // 마우스로 도형 움직이기..

// import "./style.css";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// // antialias 는 끝부분의 우글거림 완화
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// // 렌더러 그림자 허용하기
// renderer.shadowMap.enabled = true;
// // 렌더러 사이즈 화면대로 맞춰주기
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//   //시야각 (fov)
//   60,
//   //가로 세로 비율?
//   window.innerWidth / window.innerHeight,
//   // near plane
//   0.1,
//   // far plane
//   100
// );
// camera.position.y = 1;
// camera.position.z = 10;

// // 첫 번째 인자는 색, 두 번째 인자는 빛의 밝기
// const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
// directionalLight.castShadow = true;
// directionalLight.position.set(3, 4, 5);
// //빛이 0, 0, 0을 바라보게 하는 코드, 0 0 0 은 사실 디폴트
// directionalLight.lookAt(0, 0 ,0);
// scene.add(directionalLight);

// const floorGeometry = new THREE.PlaneGeometry(20, 20);
// const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbbb });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2;
// floor.receiveShadow = true;
// floor.castShadow = true;
// scene.add(floor);

// // Geometry: Mesh의 골격
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// // Material: Mesh의 외형, Basic이 아닌 Standard는 빛의 영향을 받게 됨.
// // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
// // const material = new THREE.MeshBasicMaterial();
// // material.color = new THREE.Color("#ff0000");

// // 장소위에 등장하는 등장 인물은 Mesh
// const mesh = new THREE.Mesh(geometry, material);
// mesh.position.y = 0.5;
// mesh.castShadow = true;
// mesh.receiveShadow = true;
// // scene에 mesh 추가
// scene.add(mesh);

// const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 20, 30);
// const capsuleMaterial = new THREE.MeshStandardMaterial({ color: 0xffff00 });
// const capsuleMesh = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
// capsuleMesh.position.set(3, 1.75, 0);
// capsuleMesh.castShadow = true;
// capsuleMesh.receiveShadow = true;
// scene.add(capsuleMesh);

// const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2);
// const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
// const cylinderMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
// cylinderMesh.position.set(-3, 1, 0);
// cylinderMesh.castShadow = true;
// cylinderMesh.receiveShadow = true;
// scene.add(cylinderMesh);

// const torusGeometry = new THREE.TorusGeometry(0.5, 0.1, 16, 100);
// const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x000ff });
// const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
// torusMesh.position.set(0, 0.5, 1);
// torusMesh.castShadow = true;
// torusMesh.receiveShadow = true;
// scene.add(torusMesh);

// const starShape = new THREE.Shape();
// starShape.moveTo(0, 1);
// starShape.lineTo(0.2, 0.2);
// starShape.lineTo(1, 0.2);
// starShape.lineTo(0.4, -0.1);
// starShape.lineTo(0.6, -1);
// starShape.lineTo(0, -0.5);
// starShape.lineTo(-0.6, -1);
// starShape.lineTo(-0.4, -0.1);
// starShape.lineTo(-1, 0.2);
// starShape.lineTo(-0.2, 0.2);

// const shapeGeometry = new THREE.ShapeGeometry(starShape);
// const shapeMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff });
// const shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);
// shapeMesh.position.set(0, 1, 2);
// scene.add(shapeMesh);

// const extrudeSetting = {
//   steps: 1,
//   depth: 0.1,
//   bevelEnabled: true,
//   bevelThickness: 0.3,
//   bevelSize: 0.3,
//   bevelSegments: 100,
// };

// const extrudeGeometry = new THREE.ExtrudeGeometry(starShape, extrudeSetting);
// const extrudeMaterial = new THREE.MeshStandardMaterial({ color: 0x0ddaaf });
// const extrudeMesh = new THREE.Mesh(extrudeGeometry, extrudeMaterial);
// extrudeMesh.position.set(2, 1.3, 2);
// extrudeMesh.castShadow = true;
// extrudeMesh.receiveShadow = true;
// scene.add(extrudeMesh);

// const loader = new GLTFLoader();

// // GLB 파일 로드
// loader.load("/modelglb.glb", (gltf) => {
//   // 로드된 모델을 씬에 추가
//   const model = gltf.scene;
//   scene.add(model);

//   // 필요한 경우 모델 위치, 크기, 회전 조정
//   model.position.set(0, 0, 0);
//   model.scale.set(1, 1, 1);
// }, undefined, (error) => {
//   console.error(error);
// });

// loader.load("/untitled.glb", (gltf) => {
//   // 로드된 모델을 씬에 추가
//   const model = gltf.scene;
//   scene.add(model);

//   // 필요한 경우 모델 위치, 크기, 회전 조정
//   model.position.set(0, 0, 0);
//   model.scale.set(10, 10, 10);
// }, undefined, (error) => {
//   console.error(error);
// });

// const orbitControls = new OrbitControls(camera, renderer.domElement);
// orbitControls.update();

// // 개발자 도구 켰다가 꺼도 리사이즈 해주는 코드
// window.addEventListener("resize", () => {
//   // 렌더러 사이즈 화면대로 맞춰주기
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   // mesh의 비율 망가지지 않게 해주기
//   camera.aspect = window.innerWidth / window.innerHeight;
//   // 카메라 속성 바꾼 것을 반영하기
//   camera.updateProjectionMatrix();
//   renderer.render(scene, camera);
// });

// // const render = () => {
// //   renderer.render(scene, camera);
// //   requestAnimationFrame(render);
// // };

// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();
// let selectedObject = null;

// function onMouseMove(event) {
//   // 마우스 위치를 정규화된 디바이스 좌표로 변환
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   // 선택된 객체가 없다면 레이캐스팅을 사용하여 객체 선택
//   if (!selectedObject) {
//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObjects(scene.children);

//     if (intersects.length > 0) {
//       // 첫 번째 교차 객체를 선택된 객체로 설정
//       selectedObject = intersects[0].object;
//     }
//   }
// }

// function onMouseUp(event) {
//   // 마우스 버튼을 놓으면 객체 선택 해제
//   selectedObject = null;
// }

// function render() {
//   requestAnimationFrame(render);

//   // 선택된 객체가 있다면 마우스 위치로 이동
//   if (selectedObject) {
//     raycaster.setFromCamera(mouse, camera);
//     const intersects = raycaster.intersectObject(floor);

//     if (intersects.length > 0) {
//       selectedObject.position.copy(intersects[0].point);
//     }
//   }

//   renderer.render(scene, camera);
// }

// window.addEventListener('mousemove', onMouseMove);
// window.addEventListener('mouseup', onMouseUp);
// render();

// // render();

// // renderer.render(scene, camera);
