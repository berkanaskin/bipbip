import { HUDData } from './UIManager';

export interface GameHUDCallbacks {
    onPause: () => void;
}

export class GameHUD {
    private container: HTMLElement;
    private element: HTMLElement;
    private callbacks: GameHUDCallbacks;

    private scoreElement!: HTMLElement;
    private coinsElement!: HTMLElement;
    private gapElement!: HTMLElement;
    private pauseOverlay: HTMLElement | null = null;

    constructor(container: HTMLElement, callbacks: GameHUDCallbacks) {
        this.container = container;
        this.callbacks = callbacks;
        this.element = this.createElement();
        this.container.appendChild(this.element);
    }

    private createElement(): HTMLElement {
        const wrapper = document.createElement('div');
        wrapper.className = 'game-hud';
        wrapper.innerHTML = `
      <div class="hud-top">
        <div class="hud-left">
          <div class="score-display">
            <span class="score-label">MESAFE</span>
            <span class="score-value" id="hud-score">0</span>
            <span class="score-unit">m</span>
          </div>
        </div>
        
        <div class="hud-center">
          <div class="gap-indicator">
            <span class="gap-icon">🦊</span>
            <div class="gap-bar">
              <div class="gap-fill" id="hud-gap"></div>
            </div>
            <span class="gap-icon">🐦</span>
          </div>
        </div>
        
        <div class="hud-right">
          <div class="coins-display">
            <span class="coin-icon">🪙</span>
            <span class="coin-value" id="hud-coins">0</span>
          </div>
          <button class="pause-btn" id="pause-btn">⏸️</button>
        </div>
      </div>
      
      <div class="hud-bottom">
        <div class="power-up-slots">
          <div class="power-slot empty"></div>
          <div class="power-slot empty"></div>
          <div class="power-slot empty"></div>
        </div>
      </div>
    `;

        this.addStyles();

        // Cache elements
        this.scoreElement = wrapper.querySelector('#hud-score') as HTMLElement;
        this.coinsElement = wrapper.querySelector('#hud-coins') as HTMLElement;
        this.gapElement = wrapper.querySelector('#hud-gap') as HTMLElement;

        // Event listeners
        wrapper.querySelector('#pause-btn')?.addEventListener('click', () => {
            this.callbacks.onPause();
        });

        return wrapper;
    }

    private addStyles(): void {
        if (document.getElementById('game-hud-styles')) return;

        const style = document.createElement('style');
        style.id = 'game-hud-styles';
        style.textContent = `
      .game-hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        padding: env(safe-area-inset-top, 10px) env(safe-area-inset-right, 10px) env(safe-area-inset-bottom, 10px) env(safe-area-inset-left, 10px);
      }
      
      .game-hud > * {
        pointer-events: auto;
      }
      
      .hud-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 1rem;
        gap: 1rem;
      }
      
      .hud-left, .hud-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .hud-center {
        flex: 1;
        max-width: 200px;
      }
      
      .score-display {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
      }
      
      .score-label {
        font-size: 0.6rem;
        color: rgba(255, 255, 255, 0.6);
        margin-right: 0.25rem;
      }
      
      .score-value {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
      }
      
      .score-unit {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.6);
      }
      
      .gap-indicator {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        padding: 0.5rem;
        border-radius: 20px;
      }
      
      .gap-icon {
        font-size: 1.2rem;
      }
      
      .gap-bar {
        flex: 1;
        height: 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
        overflow: hidden;
        min-width: 80px;
      }
      
      .gap-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff6b6b, #feca57);
        border-radius: 4px;
        transition: width 0.2s ease;
        width: 50%;
      }
      
      .coins-display {
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      
      .coin-icon {
        font-size: 1.2rem;
      }
      
      .coin-value {
        font-size: 1.2rem;
        font-weight: 700;
        color: #ffd700;
      }
      
      .pause-btn {
        width: 44px;
        height: 44px;
        border: none;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        font-size: 1.2rem;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .pause-btn:hover {
        transform: scale(1.1);
      }
      
      .hud-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        display: flex;
        justify-content: center;
      }
      
      .power-up-slots {
        display: flex;
        gap: 0.5rem;
      }
      
      .power-slot {
        width: 50px;
        height: 50px;
        border-radius: 12px;
        background: rgba(0, 0, 0, 0.3);
        border: 2px dashed rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .power-slot.active {
        background: linear-gradient(135deg, #48dbfb, #0984e3);
        border: 2px solid white;
        animation: pulse-power 1s ease-in-out infinite;
      }
      
      @keyframes pulse-power {
        0%, 100% { box-shadow: 0 0 10px rgba(72, 219, 251, 0.5); }
        50% { box-shadow: 0 0 20px rgba(72, 219, 251, 0.8); }
      }
      
      .pause-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 300;
      }
      
      .pause-title {
        font-size: 3rem;
        font-weight: 900;
        color: white;
        margin-bottom: 2rem;
      }
      
      .pause-buttons {
        display: flex;
        gap: 1rem;
      }
    `;
        document.head.appendChild(style);
    }

    public update(data: HUDData): void {
        this.scoreElement.textContent = Math.floor(data.distance).toString();
        this.coinsElement.textContent = data.coins.toString();

        // Gap indicator (closer = more filled, reversed logic for chase)
        const gapPercent = Math.max(0, Math.min(100, ((50 - data.gap) / 45) * 100));
        this.gapElement.style.width = `${gapPercent}%`;
    }

    public showPauseOverlay(): void {
        if (this.pauseOverlay) return;

        this.pauseOverlay = document.createElement('div');
        this.pauseOverlay.className = 'pause-overlay';
        this.pauseOverlay.innerHTML = `
      <h2 class="pause-title">⏸️ DURDURULDU</h2>
      <div class="pause-buttons">
        <button class="menu-btn play-btn" id="resume-btn">DEVAM</button>
      </div>
    `;

        this.element.appendChild(this.pauseOverlay);

        this.pauseOverlay.querySelector('#resume-btn')?.addEventListener('click', () => {
            this.hidePauseOverlay();
        });
    }

    public hidePauseOverlay(): void {
        if (this.pauseOverlay) {
            this.pauseOverlay.remove();
            this.pauseOverlay = null;
        }
    }

    public show(): void {
        this.element.style.display = 'block';
    }

    public hide(): void {
        this.element.style.display = 'none';
        this.hidePauseOverlay();
    }
}
