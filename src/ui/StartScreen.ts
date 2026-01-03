export interface StartScreenCallbacks {
  onPlay: () => void;
  onStore: () => void;
  onSettings: () => void;
}

export class StartScreen {
  private container: HTMLElement;
  private element: HTMLElement;
  private callbacks: StartScreenCallbacks;

  constructor(container: HTMLElement, callbacks: StartScreenCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.element = this.createElement();
    this.container.appendChild(this.element);
  }

  private createElement(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'start-screen';
    wrapper.innerHTML = `
      <div class="start-bg"></div>
      <div class="start-buttons">
        <button class="invisible-btn play-btn" data-action="play"></button>
        <button class="invisible-btn store-btn" data-action="store"></button>
        <button class="invisible-btn settings-btn" data-action="settings"></button>
      </div>
    `;

    this.addStyles();

    // Event listeners
    wrapper.querySelector('[data-action="play"]')?.addEventListener('click', () => {
      this.callbacks.onPlay();
    });
    wrapper.querySelector('[data-action="store"]')?.addEventListener('click', () => {
      this.callbacks.onStore();
    });
    wrapper.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
      this.callbacks.onSettings();
    });

    return wrapper;
  }

  private addStyles(): void {
    if (document.getElementById('start-screen-styles')) return;

    const style = document.createElement('style');
    style.id = 'start-screen-styles';
    style.textContent = `
      .start-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
      }
      
      .start-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('./designs/start_screen.png') center center / contain no-repeat;
        background-color: #1a1a2e;
      }
      
      .start-buttons {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 400px;
        margin: 0 auto;
      }
      
      .invisible-btn {
        position: absolute;
        background: transparent;
        border: none;
        cursor: pointer;
        opacity: 0;
      }
      
      .invisible-btn:hover {
        opacity: 0.1;
        background: rgba(255, 255, 255, 0.3);
      }
      
      /* Button positions based on design layout */
      .play-btn {
        bottom: 28%;
        left: 50%;
        transform: translateX(-50%);
        width: 200px;
        height: 60px;
        border-radius: 30px;
      }
      
      .store-btn {
        bottom: 18%;
        left: 25%;
        transform: translateX(-50%);
        width: 120px;
        height: 50px;
        border-radius: 25px;
      }
      
      .settings-btn {
        bottom: 18%;
        right: 25%;
        transform: translateX(50%);
        width: 120px;
        height: 50px;
        border-radius: 25px;
      }
    `;
    document.head.appendChild(style);
  }

  public show(): void {
    this.element.style.display = 'flex';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }
}
