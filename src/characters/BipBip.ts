import * as THREE from 'three';
import { Character, AnimationName } from './Character';

export class BipBip extends Character {
    private currentSpeedMultiplier: number = 1.0;
    private burstTimer: number = 0;
    private burstDuration: number = 2.0;

    // Trap spawning
    private trapCooldown: number = 0;

    // Gap distance for chase mechanics
    private gapDistance: number = 30;

    constructor(scene: THREE.Scene) {
        super(scene);
        // BipBip starts ahead of the player
        this.position.z = 30;
    }

    public async load(onProgress?: (progress: number) => void): Promise<void> {
        await this.loadModel(
            './models/bipbip/Meshy_AI_Animation_Running_withSkin.glb',
            onProgress
        );

        // Scale and position
        if (this.model) {
            this.model.scale.set(1.5, 1.5, 1.5);
            this.model.rotation.y = Math.PI; // Face forward
        }

        this.playAnimation('run');
    }

    protected mapAnimationName(clipName: string): AnimationName | null {
        const lowerName = clipName.toLowerCase();

        if (lowerName.includes('run_fast') || lowerName.includes('fast')) {
            return 'run'; // Use fast run as default run
        }
        if (lowerName.includes('run')) {
            return 'run';
        }
        if (lowerName.includes('vault')) {
            return 'jump';
        }
        if (lowerName.includes('slide')) {
            return 'slide';
        }
        if (lowerName.includes('walk')) {
            return 'idle';
        }

        return null;
    }

    public update(delta: number, speed: number): void {
        // Update burst timer
        if (this.burstTimer > 0) {
            this.burstTimer -= delta;
            if (this.burstTimer <= 0) {
                this.currentSpeedMultiplier = 1.0;
            }
        }

        // Update trap cooldown
        if (this.trapCooldown > 0) {
            this.trapCooldown -= delta;
        }

        // AI obstacle avoidance
        this.handleObstacleAvoidance();

        // Update base character movement
        super.update(delta, speed);

        // BipBip maintains gap distance from player
        // When gap is small, BipBip runs faster
        if (this.gapDistance < 15) {
            this.currentSpeedMultiplier = 1.2;
        } else if (this.gapDistance < 10) {
            this.currentSpeedMultiplier = 1.4;
        }

        // Update position based on gap
        this.position.z = this.gapDistance; // Z is relative to player
    }

    public setGapDistance(gap: number): void {
        this.gapDistance = gap;
    }

    private handleObstacleAvoidance(): void {
        // Simple AI: randomly switch lanes and occasionally jump/slide
        // In real implementation, this would receive obstacle data

        if (Math.random() < 0.01) { // 1% chance per frame to switch lane
            const direction = Math.random() < 0.5 ? -1 : 1;
            if (direction < 0) {
                this.moveLeft();
            } else {
                this.moveRight();
            }
        }

        if (Math.random() < 0.005) { // 0.5% chance to jump
            this.jump();
        }

        if (Math.random() < 0.005) { // 0.5% chance to slide
            this.slide();
        }
    }

    public speedBurst(): void {
        this.currentSpeedMultiplier = 2.0;
        this.burstTimer = this.burstDuration;
        // Could play a special animation here
    }

    public shouldDropTrap(gapDistance: number): boolean {
        // Drop trap when player is close and cooldown is ready
        if (gapDistance < 15 && this.trapCooldown <= 0) {
            this.trapCooldown = 5.0; // 5 second cooldown
            return true;
        }
        return false;
    }

    public getSpeedMultiplier(): number {
        return this.currentSpeedMultiplier;
    }



    public reset(): void {
        super.reset();
        this.position.z = 30;
        this.currentSpeedMultiplier = 1.0;
        this.burstTimer = 0;
        this.trapCooldown = 0;

        if (this.model) {
            this.model.position.copy(this.position);
        }
    }
}
