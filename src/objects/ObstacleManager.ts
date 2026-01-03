import * as THREE from 'three';

export type ObstacleType = 'jump' | 'slide' | 'both';

interface Obstacle {
    mesh: THREE.Group;
    type: ObstacleType;
    lane: number;
    z: number;
    passed: boolean;
}

const LANE_WIDTH = 3;
const SPAWN_DISTANCE = 100;
const DESPAWN_DISTANCE = -20;
const MIN_OBSTACLE_GAP = 15;

export class ObstacleManager {
    private scene: THREE.Scene;
    private obstacles: Obstacle[] = [];
    private lastSpawnZ: number = 50;
    private obstaclePool: THREE.Group[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createObstaclePool();
    }

    private createObstaclePool(): void {
        // Pre-create some obstacles for pooling
        for (let i = 0; i < 20; i++) {
            const obstacle = this.createObstacleMesh('jump', 0);
            obstacle.visible = false;
            this.scene.add(obstacle);
            this.obstaclePool.push(obstacle);
        }
    }

    private createObstacleMesh(type: ObstacleType, lane: number): THREE.Group {
        const group = new THREE.Group();

        const colors = [0xFF6B6B, 0xFECA57, 0x48DBFB, 0xFF9FF3, 0x54A0FF];
        const color = colors[Math.floor(Math.random() * colors.length)];

        if (type === 'jump' || type === 'both') {
            // Low barrier - must jump over
            const barrierGeo = new THREE.BoxGeometry(2.5, 1.2, 0.5);
            const barrierMat = new THREE.MeshStandardMaterial({
                color,
                metalness: 0.3,
                roughness: 0.4
            });
            const barrier = new THREE.Mesh(barrierGeo, barrierMat);
            barrier.position.y = 0.6;
            barrier.castShadow = true;
            group.add(barrier);

            // Posts on sides
            const postGeo = new THREE.CylinderGeometry(0.1, 0.1, 1.5);
            const postMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const leftPost = new THREE.Mesh(postGeo, postMat);
            leftPost.position.set(-1.2, 0.75, 0);
            group.add(leftPost);

            const rightPost = new THREE.Mesh(postGeo, postMat);
            rightPost.position.set(1.2, 0.75, 0);
            group.add(rightPost);
        }

        if (type === 'slide') {
            // High barrier - must slide under
            const beamGeo = new THREE.BoxGeometry(2.8, 0.5, 0.3);
            const beamMat = new THREE.MeshStandardMaterial({
                color,
                metalness: 0.3,
                roughness: 0.4
            });
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.y = 1.8;
            beam.castShadow = true;
            group.add(beam);

            // Support poles
            const poleGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.5);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
            const leftPole = new THREE.Mesh(poleGeo, poleMat);
            leftPole.position.set(-1.3, 1.25, 0);
            group.add(leftPole);

            const rightPole = new THREE.Mesh(poleGeo, poleMat);
            rightPole.position.set(1.3, 1.25, 0);
            group.add(rightPole);
        }

        group.position.x = lane * LANE_WIDTH;

        return group;
    }

    private getPooledObstacle(): THREE.Group | null {
        for (const obstacle of this.obstaclePool) {
            if (!obstacle.visible) {
                return obstacle;
            }
        }
        return null;
    }

    public update(delta: number, speed: number, distanceTraveled: number): void {
        // Move obstacles
        const movement = speed * delta;

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.z -= movement;
            obstacle.mesh.position.z = obstacle.z;

            // Remove if behind player
            if (obstacle.z < DESPAWN_DISTANCE) {
                obstacle.mesh.visible = false;
                this.obstacles.splice(i, 1);
            }
        }

        // Spawn new obstacles
        const targetZ = distanceTraveled + SPAWN_DISTANCE;
        while (this.lastSpawnZ < targetZ) {
            this.lastSpawnZ += MIN_OBSTACLE_GAP + Math.random() * 10;
            this.spawnObstacle(this.lastSpawnZ - distanceTraveled);
        }
    }

    private spawnObstacle(relativeZ: number): void {
        const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const typeRoll = Math.random();
        let type: ObstacleType;

        if (typeRoll < 0.45) {
            type = 'jump';
        } else if (typeRoll < 0.9) {
            type = 'slide';
        } else {
            type = 'both'; // Rare: must change lane
        }

        // Get or create obstacle mesh
        let mesh = this.getPooledObstacle();
        if (!mesh) {
            mesh = this.createObstacleMesh(type, lane);
            this.scene.add(mesh);
            this.obstaclePool.push(mesh);
        }

        // Reset mesh
        mesh.visible = true;
        mesh.position.set(lane * LANE_WIDTH, 0, relativeZ);

        // Recreate mesh content for type
        while (mesh.children.length > 0) {
            mesh.remove(mesh.children[0]);
        }
        const newMesh = this.createObstacleMesh(type, lane);
        while (newMesh.children.length > 0) {
            const child = newMesh.children[0];
            newMesh.remove(child);
            mesh.add(child);
        }

        this.obstacles.push({
            mesh,
            type,
            lane,
            z: relativeZ,
            passed: false
        });
    }

    public checkCollision(bounds: THREE.Box3, isJumping: boolean, isSliding: boolean): boolean {
        for (const obstacle of this.obstacles) {
            if (obstacle.passed) continue;

            // Check if obstacle is near player (z around 0)
            if (Math.abs(obstacle.z) > 2) continue;

            // Check lane
            const playerLane = Math.round(bounds.getCenter(new THREE.Vector3()).x / LANE_WIDTH);
            if (playerLane !== obstacle.lane) continue;

            // Check collision based on obstacle type and player action
            if (obstacle.type === 'jump' && !isJumping) {
                return true; // Hit jump obstacle
            }
            if (obstacle.type === 'slide' && !isSliding) {
                return true; // Hit slide obstacle
            }
            if (obstacle.type === 'both' && playerLane === obstacle.lane) {
                return true; // Can only avoid by changing lane
            }

            obstacle.passed = true;
        }

        return false;
    }

    public reset(): void {
        for (const obstacle of this.obstacles) {
            obstacle.mesh.visible = false;
        }
        this.obstacles = [];
        this.lastSpawnZ = 50;
    }
}
