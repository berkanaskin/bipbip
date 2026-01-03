import { Game } from './Game';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    const loadingBar = document.getElementById('loading-bar') as HTMLElement;
    const loadingText = document.getElementById('loading-text') as HTMLElement;
    const loadingScreen = document.getElementById('loading-screen') as HTMLElement;

    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }

    // Create game instance
    const game = new Game(canvas, {
        onLoadProgress: (progress: number, item: string) => {
            loadingBar.style.width = `${progress * 100}%`;
            loadingText.textContent = item;
        },
        onLoadComplete: () => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    });

    // Start game initialization
    game.init();
});
