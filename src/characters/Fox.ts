import * as THREE from 'three';
import { Character, AnimationName } from './Character';

export class Fox extends Character {
    private powerUpActive: boolean = false;
    private powerUpType: string | null = null;

    constructor(scene: THREE.Scene) {
        super(scene);
    }

    public async load(onProgress?: (progress: number) => void): Promise<void> {
        // Load the merged animation file which contains all animations
        await this.loadModel(
            './models/tilki/Meshy_AI_Meshy_Merged_Animations.glb',
            onProgress
        );

        // Scale and rotate the model appropriately
        if (this.model) {
            this.model.scale.set(1, 1, 1);
            this.model.rotation.y = 0; // Face forward (positive Z)
        }

        // Start with run animation
        this.playAnimation('run');
    }

    protected mapAnimationName(clipName: string): AnimationName | null {
        const lowerName = clipName.toLowerCase();

        if (lowerName.includes('run') || lowerName.includes('running')) {
            return 'run';
        }
        if (lowerName.includes('jump')) {
            return 'jump';
        }
        if (lowerName.includes('slide')) {
            return 'slide';
        }
        if (lowerName.includes('dance') || lowerName.includes('hip')) {
            return 'dance';
        }
        if (lowerName.includes('die') || lowerName.includes('dying')) {
            return 'die';
        }
        if (lowerName.includes('walk')) {
            return 'idle';
        }

        return null;
    }

    public update(delta: number, speed: number): void {
        super.update(delta, speed);

        // Power-up logic can be added here
        if (this.powerUpActive) {
            // Handle power-up effects
        }
    }

    public activatePowerUp(type: string): void {
        this.powerUpActive = true;
        this.powerUpType = type;

        // Handle different power-up types
        switch (type) {
            case 'jetpack':
                // Start flying animation/state
                break;
            case 'magnet':
                // Increase coin collection radius
                break;
            case 'shield':
                // Make invulnerable
                break;
        }
    }

    public deactivatePowerUp(): void {
        this.powerUpActive = false;
        this.powerUpType = null;
    }

    public hasPowerUp(): boolean {
        return this.powerUpActive;
    }

    public getPowerUpType(): string | null {
        return this.powerUpType;
    }

    public die(): void {
        this.playAnimation('die');
    }

    public celebrate(): void {
        this.playAnimation('dance');
    }

    public reset(): void {
        super.reset();
        this.powerUpActive = false;
        this.powerUpType = null;
    }
}
