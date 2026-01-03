import * as THREE from 'three';

interface Coin {
    mesh: THREE.Mesh;
    lane: number;
    z: number;
    collected: boolean;
}

const LANE_WIDTH = 3;
const SPAWN_DISTANCE = 80;
const DESPAWN_DISTANCE = -10;

export class CoinManager {
    private scene: THREE.Scene;
    private coins: Coin[] = [];
    private lastSpawnZ: number = 30;
    private coinGeometry: THREE.CylinderGeometry;
    private coinMaterial: THREE.MeshStandardMaterial;
    private coinPool: THREE.Mesh[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;

        // Shared geometry and material for all coins
        this.coinGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
        this.coinMaterial = new THREE.MeshStandardMaterial({
            color: 0xFFD700,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xFFAA00,
            emissiveIntensity: 0.2
        });

        this.createCoinPool();
    }

    private createCoinPool(): void {
        for (let i = 0; i < 50; i++) {
            const coin = new THREE.Mesh(this.coinGeometry, this.coinMaterial);
            coin.rotation.x = Math.PI / 2;
            coin.castShadow = true;
            coin.visible = false;
            this.scene.add(coin);
            this.coinPool.push(coin);
        }
    }

    private getPooledCoin(): THREE.Mesh | null {
        for (const coin of this.coinPool) {
            if (!coin.visible) {
                return coin;
            }
        }
        return null;
    }

    public update(delta: number, speed: number): void {
        const movement = speed * delta;

        // Update coin positions and rotation
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            coin.z -= movement;
            coin.mesh.position.z = coin.z;
            coin.mesh.rotation.y += delta * 3; // Spin animation

            // Floating animation
            coin.mesh.position.y = 1 + Math.sin(Date.now() * 0.005 + coin.z) * 0.2;

            // Remove if behind player
            if (coin.z < DESPAWN_DISTANCE) {
                coin.mesh.visible = false;
                this.coins.splice(i, 1);
            }
        }

        // Spawn new coins
        while (this.lastSpawnZ < SPAWN_DISTANCE) {
            this.lastSpawnZ += 5 + Math.random() * 5;
            this.spawnCoinPattern(this.lastSpawnZ);
        }

        // Adjust lastSpawnZ based on movement
        this.lastSpawnZ -= movement;
    }

    private spawnCoinPattern(z: number): void {
        const patternType = Math.floor(Math.random() * 4);

        switch (patternType) {
            case 0: // Single coin
                this.spawnCoin(Math.floor(Math.random() * 3) - 1, z);
                break;

            case 1: // Line in one lane
                const lane = Math.floor(Math.random() * 3) - 1;
                for (let i = 0; i < 3; i++) {
                    this.spawnCoin(lane, z + i * 2);
                }
                break;

            case 2: // Diagonal
                const startLane = Math.random() < 0.5 ? -1 : 1;
                for (let i = 0; i < 3; i++) {
                    this.spawnCoin(startLane - i * startLane, z + i * 3);
                }
                break;

            case 3: // Arc (jump pattern)
                for (let i = 0; i < 5; i++) {
                    const coin = this.spawnCoin(0, z + i * 1.5);
                    if (coin) {
                        // Make arc shape
                        const arcHeight = Math.sin((i / 4) * Math.PI) * 2;
                        coin.mesh.position.y = 1 + arcHeight;
                    }
                }
                break;
        }
    }

    private spawnCoin(lane: number, z: number): Coin | null {
        const mesh = this.getPooledCoin();
        if (!mesh) return null;

        mesh.visible = true;
        mesh.position.set(lane * LANE_WIDTH, 1, z);
        mesh.rotation.y = Math.random() * Math.PI * 2;

        const coin: Coin = {
            mesh,
            lane,
            z,
            collected: false
        };

        this.coins.push(coin);
        return coin;
    }

    public checkCollision(bounds: THREE.Box3): number {
        let collected = 0;

        for (const coin of this.coins) {
            if (coin.collected) continue;

            // Simple distance check
            const coinPos = coin.mesh.position;
            const playerCenter = bounds.getCenter(new THREE.Vector3());

            const distance = coinPos.distanceTo(playerCenter);

            if (distance < 2) { // Collection radius
                coin.collected = true;
                coin.mesh.visible = false;
                collected++;

                // Could add collection animation/sound here
            }
        }

        return collected;
    }

    public reset(): void {
        for (const coin of this.coins) {
            coin.mesh.visible = false;
        }
        this.coins = [];
        this.lastSpawnZ = 30;
    }
}
