import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export type AnimationName = 'idle' | 'run' | 'jump' | 'slide' | 'die' | 'dance';

export abstract class Character {
    protected scene: THREE.Scene;
    protected model: THREE.Group | null = null;
    protected mixer: THREE.AnimationMixer | null = null;
    protected animations: Map<AnimationName, THREE.AnimationAction> = new Map();
    protected currentAnimation: AnimationName = 'idle';

    protected position: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    protected targetLane: number = 0; // -1, 0, 1
    protected currentLane: number = 0;
    protected laneChangeSpeed: number = 10;

    protected isJumpingState: boolean = false;
    protected isSlidingState: boolean = false;
    protected jumpVelocity: number = 0;
    protected gravity: number = 30;
    protected jumpForce: number = 12;

    protected slideTimer: number = 0;
    protected slideDuration: number = 0.6;

    constructor(scene: THREE.Scene) {
        this.scene = scene;
    }

    protected async loadModel(
        path: string,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(
                path,
                (gltf) => {
                    this.model = gltf.scene;
                    this.model.traverse((child) => {
                        if ((child as THREE.Mesh).isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    // Setup animation mixer
                    this.mixer = new THREE.AnimationMixer(this.model);

                    // Store animations
                    gltf.animations.forEach((clip) => {
                        const action = this.mixer!.clipAction(clip);
                        // Map animation names
                        const name = this.mapAnimationName(clip.name);
                        if (name) {
                            this.animations.set(name, action);
                        }
                    });

                    this.scene.add(this.model);

                    if (onProgress) onProgress(1);
                    resolve();
                },
                (xhr) => {
                    if (onProgress && xhr.total > 0) {
                        onProgress(xhr.loaded / xhr.total);
                    }
                },
                reject
            );
        });
    }

    protected abstract mapAnimationName(clipName: string): AnimationName | null;

    public playAnimation(name: AnimationName, fadeTime: number = 0.2): void {
        if (this.currentAnimation === name) return;

        const newAction = this.animations.get(name);
        const currentAction = this.animations.get(this.currentAnimation);

        if (!newAction) return;

        if (currentAction) {
            currentAction.fadeOut(fadeTime);
        }

        newAction.reset().fadeIn(fadeTime).play();
        this.currentAnimation = name;
    }

    public update(delta: number, _speed: number): void {
        // Update animation mixer
        if (this.mixer) {
            this.mixer.update(delta);
        }

        // Lane transition
        const targetX = this.targetLane * 3; // LANE_WIDTH = 3
        const diff = targetX - this.position.x;
        if (Math.abs(diff) > 0.1) {
            this.position.x += Math.sign(diff) * this.laneChangeSpeed * delta;
        } else {
            this.position.x = targetX;
            this.currentLane = this.targetLane;
        }

        // Jump physics
        if (this.isJumpingState) {
            this.position.y += this.jumpVelocity * delta;
            this.jumpVelocity -= this.gravity * delta;

            if (this.position.y <= 0) {
                this.position.y = 0;
                this.isJumpingState = false;
                this.jumpVelocity = 0;
                this.playAnimation('run');
            }
        }

        // Slide timer
        if (this.isSlidingState) {
            this.slideTimer -= delta;
            if (this.slideTimer <= 0) {
                this.isSlidingState = false;
                this.playAnimation('run');
            }
        }

        // Update model position
        if (this.model) {
            this.model.position.copy(this.position);
        }
    }

    public moveLeft(): void {
        if (this.targetLane > -1) {
            this.targetLane--;
        }
    }

    public moveRight(): void {
        if (this.targetLane < 1) {
            this.targetLane++;
        }
    }

    public jump(): void {
        if (!this.isJumpingState && !this.isSlidingState) {
            this.isJumpingState = true;
            this.jumpVelocity = this.jumpForce;
            this.playAnimation('jump');
        }
    }

    public slide(): void {
        if (!this.isSlidingState && !this.isJumpingState) {
            this.isSlidingState = true;
            this.slideTimer = this.slideDuration;
            this.playAnimation('slide');
        }
    }

    public getPosition(): THREE.Vector3 {
        return this.position.clone();
    }

    public getBounds(): THREE.Box3 {
        if (this.model) {
            return new THREE.Box3().setFromObject(this.model);
        }
        // Fallback bounds
        const size = new THREE.Vector3(1, 2, 1);
        if (this.isSlidingState) {
            size.y = 0.8;
        }
        return new THREE.Box3(
            this.position.clone().sub(size.clone().multiplyScalar(0.5)),
            this.position.clone().add(size.clone().multiplyScalar(0.5))
        );
    }

    public isJumping(): boolean {
        return this.isJumpingState;
    }

    public isSliding(): boolean {
        return this.isSlidingState;
    }

    public reset(): void {
        this.position.set(0, 0, 0);
        this.targetLane = 0;
        this.currentLane = 0;
        this.isJumpingState = false;
        this.isSlidingState = false;
        this.jumpVelocity = 0;
        this.slideTimer = 0;
        this.playAnimation('run');

        if (this.model) {
            this.model.position.copy(this.position);
        }
    }
}
