import { GameOverData } from './UIManager';

export interface GameOverScreenCallbacks {
  onRetry: () => void;
  onMenu: () => void;
}

export class GameOverScreen {
  private container: HTMLElement;
  private element: HTMLElement;
  private callbacks: GameOverScreenCallbacks;

  constructor(container: HTMLElement, callbacks: GameOverScreenCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.element = this.createElement();
    this.container.appendChild(this.element);
  }

  private createElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'gameover-screen';
    wrapper.innerHTML = `
      <div class="gameover-bg" id="gameover-bg"></div>
      <div class="gameover-overlay">
        <div class="gameover-stats">
          <span class="stat-score" id="go-score">0</span>
          <span class="stat-coins" id="go-coins">0</span>
        </div>
        <div class="gameover-buttons">
          <button class="invisible-btn retry-btn" data-action="retry"></button>
          <button class="invisible-btn menu-btn" data-action="menu"></button>
        </div>
      </div>
    `;

    this.addStyles();

    // Event listeners
    wrapper.querySelector('[data-action="retry"]')?.addEventListener('click', () => {
      this.callbacks.onRetry();
    });
    wrapper.querySelector('[data-action="menu"]')?.addEventListener('click', () => {
      this.callbacks.onMenu();
    });

    return wrapper;
  }

  private addStyles(): void {
    if (document.getElementById('gameover-screen-styles')) return;

    const style = document.createElement('style');
    style.id = 'gameover-screen-styles';
    style.textContent = `
      .gameover-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 400;
      }
      
      .gameover-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #1a1a2e;
      }
      
      .gameover-bg.caught {
        background-image: url('./designs/game_over_1.png');
      }
      
      .gameover-bg.lost {
        background-image: url('./designs/game_over_2.png');
      }
      
      .gameover-overlay {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      
      .gameover-stats {
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      
      .stat-score, .stat-coins {
        font-family: 'Outfit', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        color: white;
        text-shadow: 0 2px 4px rgba(0,0,0,0.5);
      }
      
      .gameover-buttons {
        position: absolute;
        bottom: 25%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .gameover-screen .invisible-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
      }
      
      .gameover-screen .invisible-btn:hover {
        opacity: 0.2;
        background: rgba(255, 255, 255, 0.3);
      }
      
      .retry-btn {
        width: 180px;
        height: 50px;
        border-radius: 25px;
      }
      
      .menu-btn {
        width: 180px;
        height: 50px;
        border-radius: 25px;
      }
    `;
    document.head.appendChild(style);
  }

  public show(reason: 'obstacle' | 'caught', data: GameOverData): void {
    const bg = this.element.querySelector('#gameover-bg') as HTMLElement;

    // Use different backgrounds based on reason
    if (reason === 'caught') {
      bg.className = 'gameover-bg caught';
    } else {
      bg.className = 'gameover-bg lost';
    }

    // Update stats
    (this.element.querySelector('#go-score') as HTMLElement).textContent = data.score.toString() + 'm';
    (this.element.querySelector('#go-coins') as HTMLElement).textContent = data.coins.toString();

    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }
}
