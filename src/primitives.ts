import {
	BoxGeometry,
	CapsuleGeometry,
	ConeGeometry,
	CylinderGeometry,
	Mesh,
	MeshStandardMaterial,
	PlaneGeometry,
	SphereGeometry,
} from 'three';
import {
	CapsuleShape,
	ConeShape,
	CubeShape,
	CylinderShape,
	PlaneShape,
	QuadShape,
	SphereShape,
} from './physics/ColliderShapes';

import { Collider } from './physics/ColliderComponent';
import { GameObject } from './ecs/GameObject';
import { RigidBody } from './physics/RigidBodyComponent';

const PRIMITIVE_MATERIAL = new MeshStandardMaterial({ color: 0xffffff });
const DEFAULT_PLANE_SIZE = 10;
const DEFAULT_CUBE_SIZE = 1;
const DEFAULT_SPHERE_RADIUS = 1;
const DEFAULT_CYLINDER_RADIUS = 1;
const DEFAULT_CYLINDER_HEIGHT = 1;
const DEFAULT_CAPSULE_RADIUS = 1;
const DEFAULT_CAPSULE_HEIGHT = 1;
const DEFAULT_CONE_RADIUS = 1;
const DEFAULT_CONE_HEIGHT = 1;
const DEFAULT_QUAD_SIZE = 1;

export const createPlanePrimitive = () => {
	const mesh = new Mesh(
		new PlaneGeometry(DEFAULT_PLANE_SIZE, DEFAULT_PLANE_SIZE),
		PRIMITIVE_MATERIAL,
	);
	mesh.rotateX(-Math.PI / 2);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new PlaneShape(DEFAULT_PLANE_SIZE, DEFAULT_PLANE_SIZE);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createCubePrimitive = () => {
	const mesh = new Mesh(
		new BoxGeometry(DEFAULT_CUBE_SIZE, DEFAULT_CUBE_SIZE, DEFAULT_CUBE_SIZE),
		PRIMITIVE_MATERIAL,
	);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new CubeShape(
		DEFAULT_CUBE_SIZE,
		DEFAULT_CUBE_SIZE,
		DEFAULT_CUBE_SIZE,
	);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createSpherePrimitive = () => {
	const mesh = new Mesh(
		new SphereGeometry(DEFAULT_SPHERE_RADIUS, 32, 32),
		PRIMITIVE_MATERIAL,
	);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new SphereShape(DEFAULT_SPHERE_RADIUS);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createCylinderPrimitive = () => {
	const mesh = new Mesh(
		new CylinderGeometry(
			DEFAULT_CYLINDER_RADIUS,
			DEFAULT_CYLINDER_RADIUS,
			DEFAULT_CYLINDER_HEIGHT,
			32,
		),
		PRIMITIVE_MATERIAL,
	);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new CylinderShape(
		DEFAULT_CYLINDER_RADIUS,
		DEFAULT_CYLINDER_HEIGHT,
	);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createCapsulePrimitive = () => {
	const mesh = new Mesh(
		new CapsuleGeometry(DEFAULT_CAPSULE_RADIUS, DEFAULT_CAPSULE_HEIGHT, 32),
		PRIMITIVE_MATERIAL,
	);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new CapsuleShape(
		DEFAULT_CAPSULE_RADIUS,
		DEFAULT_CAPSULE_HEIGHT,
	);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createConePrimitive = () => {
	const mesh = new Mesh(
		new ConeGeometry(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT, 32),
		PRIMITIVE_MATERIAL,
	);
	mesh.rotateX(Math.PI / 2);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new ConeShape(DEFAULT_CONE_RADIUS, DEFAULT_CONE_HEIGHT);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};

export const createQuadPrimitive = () => {
	const mesh = new Mesh(
		new PlaneGeometry(DEFAULT_QUAD_SIZE, DEFAULT_QUAD_SIZE),
		PRIMITIVE_MATERIAL,
	);
	const gameObject = new GameObject().add(mesh);
	gameObject.addComponent(RigidBody, { initConfig: {} });
	const shape = new QuadShape(DEFAULT_QUAD_SIZE, DEFAULT_QUAD_SIZE);
	gameObject.addComponent(Collider, { shape: shape });
	return gameObject;
};
