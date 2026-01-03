import { GameData } from '../data/GameData';

export interface StoreScreenCallbacks {
  onClose: () => void;
  onPurchase: (itemId: string) => void;
}

export class StoreScreen {
  private container: HTMLElement;
  private element: HTMLElement;
  private callbacks: StoreScreenCallbacks;
  private currentPage: number = 1;

  constructor(container: HTMLElement, callbacks: StoreScreenCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.element = this.createElement();
    this.container.appendChild(this.element);
  }

  private createElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'store-screen';
    wrapper.innerHTML = `
      <div class="store-bg" id="store-bg"></div>
      <div class="store-overlay">
        <button class="invisible-btn close-btn" data-action="close"></button>
        <button class="invisible-btn prev-btn" data-action="prev"></button>
        <button class="invisible-btn next-btn" data-action="next"></button>
        <div class="store-items-overlay" id="store-items"></div>
      </div>
    `;

    this.addStyles();

    // Event listeners
    wrapper.querySelector('[data-action="close"]')?.addEventListener('click', () => {
      this.callbacks.onClose();
    });
    wrapper.querySelector('[data-action="prev"]')?.addEventListener('click', () => {
      this.changePage(-1);
    });
    wrapper.querySelector('[data-action="next"]')?.addEventListener('click', () => {
      this.changePage(1);
    });

    return wrapper;
  }

  private addStyles(): void {
    if (document.getElementById('store-screen-styles')) return;

    const style = document.createElement('style');
    style.id = 'store-screen-styles';
    style.textContent = `
      .store-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 500;
        display: flex;
        justify-content: center;
      }
      
      .store-bg {
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
      
      .store-bg.page-1 { background-image: url('./designs/store_1.png'); }
      .store-bg.page-2 { background-image: url('./designs/store_2.png'); }
      .store-bg.page-3 { background-image: url('./designs/store_3.png'); }
      .store-bg.page-4 { background-image: url('./designs/store_4.png'); }
      
      .store-overlay {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      
      .store-screen .invisible-btn {
        position: absolute;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
      }
      
      .store-screen .invisible-btn:hover {
        opacity: 0.2;
        background: rgba(255, 255, 255, 0.3);
      }
      
      .close-btn {
        top: 5%;
        right: 5%;
        width: 50px;
        height: 50px;
        border-radius: 25px;
      }
      
      .prev-btn {
        bottom: 5%;
        left: 10%;
        width: 80px;
        height: 50px;
        border-radius: 25px;
      }
      
      .next-btn {
        bottom: 5%;
        right: 10%;
        width: 80px;
        height: 50px;
        border-radius: 25px;
      }
      
      .store-items-overlay {
        position: absolute;
        top: 30%;
        left: 10%;
        right: 10%;
        bottom: 20%;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      
      .store-item-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    `;
    document.head.appendChild(style);
  }

  private changePage(delta: number): void {
    this.currentPage += delta;
    if (this.currentPage < 1) this.currentPage = 4;
    if (this.currentPage > 4) this.currentPage = 1;
    this.updateBackground();
  }

  private updateBackground(): void {
    const bg = this.element.querySelector('#store-bg') as HTMLElement;
    bg.className = `store-bg page-${this.currentPage}`;
  }

  public show(_gameData: GameData): void {
    this.currentPage = 1;
    this.updateBackground();
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }
}
