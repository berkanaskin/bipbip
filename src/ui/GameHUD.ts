export interface HUDData {
  score: number;
  coins: number;
  distance: number;
  gap: number;
}

export interface GameHUDCallbacks {
  onPause: () => void;
}

export class GameHUD {
  private container: HTMLElement;
  private element: HTMLElement;
  private callbacks: GameHUDCallbacks;

  // Element references for updates
  private scoreEl: HTMLElement | null = null;
  private coinsEl: HTMLElement | null = null;
  private gapBarEl: HTMLElement | null = null;
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
      <div class="hud-container">
        <!-- Top bar -->
        <div class="hud-top">
          <!-- Score -->
          <div class="hud-score-badge">
            <span class="hud-badge-icon">⭐</span>
            <span class="hud-score-value" id="hud-score">0</span>
          </div>
          
          <!-- Right side: Coins + Pause -->
          <div class="hud-right">
            <div class="hud-coins-badge">
              <span class="hud-badge-icon">💰</span>
              <span class="hud-coins-value" id="hud-coins">0</span>
            </div>
            <button class="hud-pause-btn" id="hud-pause">
              ⏸
            </button>
          </div>
        </div>
        
        <!-- Gap bar -->
        <div class="hud-gap-container">
          <div class="hud-gap-icon hud-fox-icon">🦊</div>
          <div class="hud-gap-bar">
            <div class="hud-gap-fill" id="hud-gap-fill"></div>
          </div>
          <div class="hud-gap-icon hud-bird-icon">🐦</div>
        </div>
      </div>
      
      <!-- Pause overlay -->
      <div class="hud-pause-overlay" id="hud-pause-overlay">
        <div class="hud-pause-content">
          <h2 class="hud-pause-title">DURAKLATILDI</h2>
          <button class="hud-resume-btn" id="hud-resume">
            ▶ DEVAM ET
          </button>
        </div>
      </div>
    `;

    this.addStyles();

    // Get element references
    this.scoreEl = wrapper.querySelector('#hud-score');
    this.coinsEl = wrapper.querySelector('#hud-coins');
    this.gapBarEl = wrapper.querySelector('#hud-gap-fill');
    this.pauseOverlay = wrapper.querySelector('#hud-pause-overlay');

    // Event listeners
    wrapper.querySelector('#hud-pause')?.addEventListener('click', () => {
      this.showPauseOverlay();
      this.callbacks.onPause();
    });

    wrapper.querySelector('#hud-resume')?.addEventListener('click', () => {
      this.hidePauseOverlay();
    });

    return wrapper;
  }

  public update(data: HUDData): void {
    if (this.scoreEl) {
      this.scoreEl.textContent = data.score.toLocaleString();
    }
    if (this.coinsEl) {
      this.coinsEl.textContent = data.coins.toString();
    }
    if (this.gapBarEl) {
      // Gap percentage: 0 = caught, 50 = max distance
      const gapPercent = Math.min(100, Math.max(0, (data.gap / 50) * 100));
      this.gapBarEl.style.width = `${gapPercent}%`;
    }
  }

  public showPauseOverlay(): void {
    if (this.pauseOverlay) {
      this.pauseOverlay.style.display = 'flex';
    }
  }

  public hidePauseOverlay(): void {
    if (this.pauseOverlay) {
      this.pauseOverlay.style.display = 'none';
    }
  }

  public show(): void {
    this.element.style.display = 'block';
    this.hidePauseOverlay();
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  private addStyles(): void {
    if (document.getElementById('game-hud-styles')) return;

    const style = document.createElement('style');
    style.id = 'game-hud-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');

      .game-hud {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        font-family: 'Fredoka', 'Outfit', sans-serif;
      }

      .hud-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding: 1rem;
        padding-top: 2rem;
        max-width: 480px;
        margin: 0 auto;
      }

      /* Top bar */
      .hud-top {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        pointer-events: auto;
      }

      .hud-right {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }

      /* Score badge */
      .hud-score-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #facc15;
        border-bottom: 4px solid #ca8a04;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transform: rotate(-2deg);
      }

      .hud-score-value {
        color: #78350f;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 0.025em;
      }

      /* Coins badge */
      .hud-coins-badge {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: #4ade80;
        border-bottom: 4px solid #16a34a;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transform: rotate(2deg);
      }

      .hud-coins-value {
        color: #14532d;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: 0.025em;
      }

      .hud-badge-icon {
        font-size: 1.5rem;
        filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.3));
      }

      /* Pause button */
      .hud-pause-btn {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.2);
        border: 2px solid rgba(255,255,255,0.4);
        border-radius: 1rem;
        font-size: 1.25rem;
        color: white;
        cursor: pointer;
        backdrop-filter: blur(8px);
        transition: all 0.2s;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .hud-pause-btn:hover {
        background: rgba(255,255,255,0.3);
      }

      .hud-pause-btn:active {
        transform: scale(0.95);
      }

      /* Gap bar */
      .hud-gap-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 360px;
        margin: 0 auto;
        width: 100%;
      }

      .hud-gap-icon {
        font-size: 1.5rem;
        padding: 0.25rem;
        background: currentColor;
        border: 2px solid white;
        border-radius: 9999px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }

      .hud-fox-icon { background: #f97316; }
      .hud-bird-icon { background: #3b82f6; }

      .hud-gap-bar {
        flex: 1;
        height: 16px;
        background: rgba(0,0,0,0.4);
        border-radius: 9999px;
        border: 2px solid rgba(255,255,255,0.2);
        overflow: hidden;
        backdrop-filter: blur(4px);
      }

      .hud-gap-fill {
        height: 100%;
        width: 65%;
        background: linear-gradient(to right, #f97316, #facc15);
        border-radius: 9999px;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(249,115,22,0.5);
      }

      .hud-gap-fill::after {
        content: '';
        display: block;
        width: 100%;
        height: 50%;
        background: linear-gradient(to bottom, rgba(255,255,255,0.3), transparent);
        border-radius: 9999px 9999px 0 0;
      }

      /* Pause overlay */
      .hud-pause-overlay {
        position: absolute;
        inset: 0;
        display: none;
        align-items: center;
        justify-content: center;
        background: rgba(0,0,0,0.7);
        backdrop-filter: blur(4px);
        z-index: 150;
        pointer-events: auto;
      }

      .hud-pause-content {
        text-align: center;
        padding: 2rem;
      }

      .hud-pause-title {
        font-size: 3rem;
        font-weight: 700;
        color: white;
        text-shadow: 4px 4px 0 #000;
        margin-bottom: 2rem;
      }

      .hud-resume-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        height: 64px;
        padding: 0 2rem;
        background: linear-gradient(to bottom, #4ade80, #16a34a);
        border: none;
        border-bottom: 6px solid #14532d;
        border-radius: 1rem;
        color: white;
        font-family: inherit;
        font-size: 1.5rem;
        font-weight: 700;
        text-transform: uppercase;
        cursor: pointer;
        box-shadow: 4px 4px 0 rgba(0,0,0,1);
        transition: all 0.1s;
      }

      .hud-resume-btn:hover {
        filter: brightness(1.1);
      }

      .hud-resume-btn:active {
        transform: translateY(4px);
        box-shadow: none;
        border-bottom-width: 0;
      }
    `;
    document.head.appendChild(style);
  }
}
