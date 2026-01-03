import { Game, GameState } from '../Game';
import { StartScreen } from './StartScreen';
import { GameHUD } from './GameHUD';
import { GameOverScreen } from './GameOverScreen';
import { StoreScreen } from './StoreScreen';

export interface HUDData {
    score: number;
    coins: number;
    distance: number;
    gap: number;
}

export interface GameOverData {
    score: number;
    coins: number;
    highScore: number;
}

export class UIManager {
    private game: Game;
    private container: HTMLElement;

    private startScreen: StartScreen;
    private gameHUD: GameHUD;
    private gameOverScreen: GameOverScreen;
    private storeScreen: StoreScreen;

    constructor(game: Game) {
        this.game = game;
        this.container = document.getElementById('ui-container') as HTMLElement;

        // Initialize UI components
        this.startScreen = new StartScreen(this.container, {
            onPlay: () => this.game.startGame(),
            onStore: () => this.showStore(),
            onSettings: () => this.showSettings()
        });

        this.gameHUD = new GameHUD(this.container, {
            onPause: () => this.game.pauseGame()
        });

        this.gameOverScreen = new GameOverScreen(this.container, {
            onRetry: () => this.game.startGame(),
            onMenu: () => this.game.goToMenu()
        });

        this.storeScreen = new StoreScreen(this.container, {
            onClose: () => this.hideStore(),
            onPurchase: (itemId: string) => this.handlePurchase(itemId)
        });

        // Hide all initially
        this.hideAll();
    }

    public onStateChange(state: GameState): void {
        this.hideAll();

        switch (state) {
            case 'menu':
                this.startScreen.show();
                break;
            case 'playing':
                this.gameHUD.show();
                break;
            case 'paused':
                this.gameHUD.show();
                this.gameHUD.showPauseOverlay();
                break;
            case 'gameover':
                // GameOverScreen is shown via showGameOver method
                break;
        }
    }

    public updateHUD(data: HUDData): void {
        this.gameHUD.update(data);
    }

    public showGameOver(reason: 'obstacle' | 'caught', data: GameOverData): void {
        this.gameHUD.hide();
        this.gameOverScreen.show(reason, data);
    }

    private showStore(): void {
        this.startScreen.hide();
        this.storeScreen.show(this.game.getGameData());
    }

    private hideStore(): void {
        this.storeScreen.hide();
        this.startScreen.show();
    }

    private showSettings(): void {
        // TODO: Implement settings screen
        console.log('Settings clicked');
    }

    private handlePurchase(itemId: string): void {
        const gameData = this.game.getGameData();
        // Handle purchase logic
        console.log('Purchase:', itemId);
    }

    private hideAll(): void {
        this.startScreen.hide();
        this.gameHUD.hide();
        this.gameOverScreen.hide();
        this.storeScreen.hide();
    }
}
