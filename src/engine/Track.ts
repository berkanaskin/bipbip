import * as THREE from 'three';

const LANE_WIDTH = 3;
const TRACK_SEGMENT_LENGTH = 20;
const VISIBLE_SEGMENTS = 10;

export class Track {
    private scene: THREE.Scene;
    private segments: THREE.Group[] = [];
    private currentZ: number = 0;
    private segmentPool: THREE.Group[] = [];

    constructor(scene: THREE.Scene) {
        this.scene = scene;
        this.createInitialTrack();
        this.createEnvironment();
    }

    private createInitialTrack(): void {
        for (let i = 0; i < VISIBLE_SEGMENTS; i++) {
            const segment = this.createSegment();
            segment.position.z = i * TRACK_SEGMENT_LENGTH;
            this.segments.push(segment);
            this.scene.add(segment);
        }
    }

    private createSegment(): THREE.Group {
        const segment = new THREE.Group();

        // Ground plane for this segment
        const groundGeometry = new THREE.PlaneGeometry(LANE_WIDTH * 3 + 2, TRACK_SEGMENT_LENGTH);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B7355,
            roughness: 0.9,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        ground.position.z = TRACK_SEGMENT_LENGTH / 2;
        ground.receiveShadow = true;
        segment.add(ground);

        // Lane markings
        const laneMarkMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

        for (let i = -1; i <= 1; i += 2) {
            const markGeometry = new THREE.PlaneGeometry(0.1, TRACK_SEGMENT_LENGTH - 1);
            const mark = new THREE.Mesh(markGeometry, laneMarkMaterial);
            mark.rotation.x = -Math.PI / 2;
            mark.position.set(i * LANE_WIDTH, 0.01, TRACK_SEGMENT_LENGTH / 2);
            segment.add(mark);
        }

        // Random side decorations
        this.addSideDecorations(segment);

        return segment;
    }

    private addSideDecorations(segment: THREE.Group): void {
        const decorationTypes = ['tree', 'rock', 'bush'];

        for (let side = -1; side <= 1; side += 2) {
            if (Math.random() > 0.3) {
                const type = decorationTypes[Math.floor(Math.random() * decorationTypes.length)];
                const decoration = this.createDecoration(type);
                decoration.position.set(
                    side * (LANE_WIDTH * 2 + 2 + Math.random() * 3),
                    0,
                    Math.random() * TRACK_SEGMENT_LENGTH
                );
                segment.add(decoration);
            }
        }
    }

    private createDecoration(type: string): THREE.Group {
        const group = new THREE.Group();

        switch (type) {
            case 'tree': {
                // Trunk
                const trunkGeo = new THREE.CylinderGeometry(0.3, 0.4, 2);
                const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
                const trunk = new THREE.Mesh(trunkGeo, trunkMat);
                trunk.position.y = 1;
                trunk.castShadow = true;
                group.add(trunk);

                // Foliage
                const foliageGeo = new THREE.ConeGeometry(1.5, 3, 8);
                const foliageMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
                const foliage = new THREE.Mesh(foliageGeo, foliageMat);
                foliage.position.y = 3.5;
                foliage.castShadow = true;
                group.add(foliage);
                break;
            }
            case 'rock': {
                const rockGeo = new THREE.DodecahedronGeometry(0.8);
                const rockMat = new THREE.MeshStandardMaterial({ color: 0x808080, roughness: 0.9 });
                const rock = new THREE.Mesh(rockGeo, rockMat);
                rock.position.y = 0.4;
                rock.rotation.set(Math.random(), Math.random(), Math.random());
                rock.castShadow = true;
                group.add(rock);
                break;
            }
            case 'bush': {
                const bushGeo = new THREE.SphereGeometry(0.7, 8, 6);
                const bushMat = new THREE.MeshStandardMaterial({ color: 0x32CD32 });
                const bush = new THREE.Mesh(bushGeo, bushMat);
                bush.position.y = 0.5;
                bush.scale.y = 0.7;
                bush.castShadow = true;
                group.add(bush);
                break;
            }
        }

        return group;
    }

    private createEnvironment(): void {
        // Sky gradient is handled by fog and scene background

        // Distant mountains (static background)
        const mountainGeo = new THREE.ConeGeometry(30, 40, 4);
        const mountainMat = new THREE.MeshStandardMaterial({
            color: 0x6B8E23,
            flatShading: true
        });

        for (let i = 0; i < 5; i++) {
            const mountain = new THREE.Mesh(mountainGeo, mountainMat);
            mountain.position.set(
                (Math.random() - 0.5) * 200,
                15,
                100 + Math.random() * 50
            );
            mountain.scale.set(
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5,
                0.5 + Math.random() * 0.5
            );
            this.scene.add(mountain);
        }

        // Ground plane extending far
        const farGroundGeo = new THREE.PlaneGeometry(500, 500);
        const farGroundMat = new THREE.MeshStandardMaterial({
            color: 0x98D982,
            roughness: 1
        });
        const farGround = new THREE.Mesh(farGroundGeo, farGroundMat);
        farGround.rotation.x = -Math.PI / 2;
        farGround.position.y = -0.1;
        farGround.position.z = 100;
        farGround.receiveShadow = true;
        this.scene.add(farGround);
    }

    public update(delta: number, speed: number): void {
        const movement = speed * delta;
        this.currentZ += movement;

        // Check if we need to recycle segments
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];

            // If segment is behind the camera, recycle it
            if (segment.position.z < this.currentZ - TRACK_SEGMENT_LENGTH * 2) {
                // Move to front
                const maxZ = Math.max(...this.segments.map(s => s.position.z));
                segment.position.z = maxZ + TRACK_SEGMENT_LENGTH;

                // Re-randomize decorations
                this.refreshSegmentDecorations(segment);
            }
        }
    }

    private refreshSegmentDecorations(segment: THREE.Group): void {
        // Remove existing decorations (keep ground and lane marks)
        const toRemove: THREE.Object3D[] = [];
        segment.children.forEach(child => {
            if (child.userData.isDecoration) {
                toRemove.push(child);
            }
        });
        toRemove.forEach(child => segment.remove(child));

        // Add new decorations
        this.addSideDecorations(segment);
    }

    public getLaneX(lane: number): number {
        // lane: -1 (left), 0 (center), 1 (right)
        return lane * LANE_WIDTH;
    }

    public reset(): void {
        this.currentZ = 0;
        this.segments.forEach((segment, i) => {
            segment.position.z = i * TRACK_SEGMENT_LENGTH;
        });
    }
}

export { LANE_WIDTH };
