import * as THREE from 'three';
import { SceneManager } from './engine/SceneManager';
import { Track } from './engine/Track';
import { InputManager } from './engine/InputManager';
import { Fox } from './characters/Fox';
import { BipBip } from './characters/BipBip';
import { ObstacleManager } from './objects/ObstacleManager';
import { CoinManager } from './objects/CoinManager';
import { UIManager } from './ui/UIManager';
import { GameData } from './data/GameData';

export type GameState = 'loading' | 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameCallbacks {
    onLoadProgress: (progress: number, item: string) => void;
    onLoadComplete: () => void;
}

export class Game {
    private canvas: HTMLCanvasElement;
    private callbacks: GameCallbacks;
    private sceneManager!: SceneManager;
    private track!: Track;
    private inputManager!: InputManager;
    private fox!: Fox;
    private bipbip!: BipBip;
    private obstacleManager!: ObstacleManager;
    private coinManager!: CoinManager;
    private uiManager!: UIManager;
    private gameData!: GameData;

    private state: GameState = 'loading';
    private clock: THREE.Clock = new THREE.Clock();

    // Game parameters
    private baseSpeed: number = 15;
    private currentSpeed: number = 15;
    private maxSpeed: number = 40;
    private speedAcceleration: number = 0.5;
    private distanceTraveled: number = 0;
    private score: number = 0;
    private coinsCollected: number = 0;

    // Chase mechanics
    private gapDistance: number = 30; // Initial gap between fox and bipbip
    private minGap: number = 5;
    private maxGap: number = 50;

    constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
        this.canvas = canvas;
        this.callbacks = callbacks;
    }

    async init(): Promise<void> {
        try {
            this.callbacks.onLoadProgress(0.1, 'Sahne hazırlanıyor...');

            // Initialize scene manager
            this.sceneManager = new SceneManager(this.canvas);

            this.callbacks.onLoadProgress(0.15, 'Parkur oluşturuluyor...');

            // Initialize track
            this.track = new Track(this.sceneManager.getScene());

            this.callbacks.onLoadProgress(0.2, 'Kontroller ayarlanıyor...');

            // Initialize input manager
            this.inputManager = new InputManager(this.canvas);

            this.callbacks.onLoadProgress(0.3, 'Tilki yükleniyor...');

            // Initialize characters
            this.fox = new Fox(this.sceneManager.getScene());
            await this.fox.load((p) => {
                this.callbacks.onLoadProgress(0.3 + p * 0.25, 'Tilki yükleniyor...');
            });

            this.callbacks.onLoadProgress(0.55, 'BipBip yükleniyor...');

            this.bipbip = new BipBip(this.sceneManager.getScene());
            await this.bipbip.load((p) => {
                this.callbacks.onLoadProgress(0.55 + p * 0.25, 'BipBip yükleniyor...');
            });

            this.callbacks.onLoadProgress(0.8, 'Engeller hazırlanıyor...');

            // Initialize managers
            this.obstacleManager = new ObstacleManager(this.sceneManager.getScene());
            this.coinManager = new CoinManager(this.sceneManager.getScene());

            this.callbacks.onLoadProgress(0.9, 'Arayüz yükleniyor...');

            // Initialize UI
            this.uiManager = new UIManager(this);

            // Initialize game data
            this.gameData = new GameData();

            this.callbacks.onLoadProgress(1, 'Hazır!');

            // Small delay before completing
            await new Promise(resolve => setTimeout(resolve, 500));

            this.callbacks.onLoadComplete();

            // Show menu
            this.setState('menu');

            // Start game loop
            this.animate();

        } catch (error) {
            console.error('Game initialization failed:', error);
        }
    }

    private animate = (): void => {
        requestAnimationFrame(this.animate);

        const delta = this.clock.getDelta();

        if (this.state === 'playing') {
            this.update(delta);
        }

        this.sceneManager.render();
    };

    private update(delta: number): void {
        // Update speed (gradual acceleration)
        if (this.currentSpeed < this.maxSpeed) {
            this.currentSpeed += this.speedAcceleration * delta;
        }

        // Update distance
        this.distanceTraveled += this.currentSpeed * delta;

        // Process input
        const input = this.inputManager.getInput();
        if (input.left) {
            console.log('Input: LEFT');
            this.fox.moveLeft();
        }
        if (input.right) {
            console.log('Input: RIGHT');
            this.fox.moveRight();
        }
        if (input.jump) {
            console.log('Input: JUMP');
            this.fox.jump();
        }
        if (input.slide) {
            console.log('Input: SLIDE');
            this.fox.slide();
        }

        // Update track
        this.track.update(delta, this.currentSpeed);

        // Update characters
        this.fox.update(delta, this.currentSpeed);
        this.bipbip.setGapDistance(this.gapDistance);
        this.bipbip.update(delta, this.currentSpeed);

        // Update obstacles
        this.obstacleManager.update(delta, this.currentSpeed, this.distanceTraveled);

        // Update coins
        this.coinManager.update(delta, this.currentSpeed);

        // Check collisions
        this.checkCollisions();

        // Update chase mechanics
        this.updateChase(delta);

        // Update camera to follow fox
        this.sceneManager.updateCamera(this.fox.getPosition());

        // Update HUD
        this.uiManager.updateHUD({
            score: Math.floor(this.distanceTraveled),
            coins: this.coinsCollected,
            distance: this.distanceTraveled,
            gap: this.gapDistance
        });
    }

    private checkCollisions(): void {
        const foxBounds = this.fox.getBounds();

        // Check obstacle collisions
        if (this.obstacleManager.checkCollision(foxBounds, this.fox.isJumping(), this.fox.isSliding())) {
            this.gameOver('obstacle');
        }

        // Check coin collisions
        const coinsGained = this.coinManager.checkCollision(foxBounds);
        if (coinsGained > 0) {
            this.coinsCollected += coinsGained;
            this.score += coinsGained * 10;
        }
    }

    private updateChase(delta: number): void {
        // Fox gains on BipBip slowly
        const catchUpRate = 0.5 * delta;
        this.gapDistance -= catchUpRate;

        // BipBip escapes when gap is too small
        if (this.gapDistance < this.minGap + 5) {
            this.bipbip.speedBurst();
            this.gapDistance += 10;
        }

        // Clamp gap
        this.gapDistance = Math.max(this.minGap, Math.min(this.maxGap, this.gapDistance));

        // Win condition
        if (this.gapDistance <= this.minGap) {
            this.gameOver('caught');
        }
    }

    // Public methods for UI and state management

    public startGame(): void {
        this.setState('playing');
        this.resetGame();
    }

    public pauseGame(): void {
        if (this.state === 'playing') {
            this.setState('paused');
        }
    }

    public resumeGame(): void {
        if (this.state === 'paused') {
            this.setState('playing');
        }
    }

    public gameOver(reason: 'obstacle' | 'caught'): void {
        this.setState('gameover');
        this.gameData.saveScore(Math.floor(this.distanceTraveled), this.coinsCollected);
        this.uiManager.showGameOver(reason, {
            score: Math.floor(this.distanceTraveled),
            coins: this.coinsCollected,
            highScore: this.gameData.getHighScore()
        });
    }

    public goToMenu(): void {
        this.setState('menu');
    }

    private resetGame(): void {
        this.currentSpeed = this.baseSpeed;
        this.distanceTraveled = 0;
        this.score = 0;
        this.coinsCollected = 0;
        this.gapDistance = 30;

        this.fox.reset();
        this.bipbip.reset();
        this.track.reset();
        this.obstacleManager.reset();
        this.coinManager.reset();
    }

    private setState(state: GameState): void {
        this.state = state;
        this.uiManager.onStateChange(state);
    }

    public getState(): GameState {
        return this.state;
    }

    public getGameData(): GameData {
        return this.gameData;
    }
}
