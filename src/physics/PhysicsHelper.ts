export type RigidBodyConstraints = {
	translational: {
		x: boolean;
		y: boolean;
		z: boolean;
	};
	rotational: {
		x: boolean;
		y: boolean;
		z: boolean;
	};
};

export enum CollisionDetectionMode {
	Discrete = 'Discrete',
	Continuous = 'Continuous',
}

export enum RigidBodyType {
	Dynamic = 0,
	Fixed = 1,
	KinematicPositionBased = 2,
	KinematicVelocityBased = 3,
}
