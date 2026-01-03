export interface StartScreenCallbacks {
  onPlay: () => void;
  onStore: () => void;
  onSettings: () => void;
  onLeaderboard?: () => void;
  onProfile?: () => void;
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

    // Using the actual HTML structure from tasarim/başlangıç_ekranı code.html
    wrapper.innerHTML = `
      <div class="start-container">
        <div class="start-bg-overlay"></div>
        
        <div class="start-content">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-burst-outer"></div>
            <div class="logo-burst-inner"></div>
            <div class="logo-text">
              <h1 class="logo-title">BİP<br/><span class="logo-offset">BİP</span></h1>
              <div class="logo-tagline">Sıkıysa Yakala</div>
            </div>
          </div>
          
          <div class="spacer"></div>
          
          <!-- Buttons Section -->
          <div class="buttons-section">
            <div class="main-buttons">
              <button class="btn-play" data-action="play">
                <span class="btn-icon">▶</span>
                OYNA
              </button>
              <button class="btn-settings" data-action="settings">
                ⚙ AYARLAR
              </button>
            </div>
            
            <div class="nav-bar">
              <a class="nav-item" data-action="store">
                <span class="nav-icon">🏪</span>
                <span class="nav-label">MARKET</span>
              </a>
              <a class="nav-item" data-action="leaderboard">
                <span class="nav-icon">🏆</span>
                <span class="nav-label">LİDERLER</span>
              </a>
              <a class="nav-item" data-action="profile">
                <span class="nav-icon">👤</span>
                <span class="nav-label">PROFİL</span>
              </a>
            </div>
            
            <div class="home-indicator"></div>
          </div>
        </div>
      </div>
    `;

    this.addStyles();

    // Event listeners for all buttons
    wrapper.querySelector('[data-action="play"]')?.addEventListener('click', () => {
      this.callbacks.onPlay();
    });
    wrapper.querySelector('[data-action="store"]')?.addEventListener('click', () => {
      this.callbacks.onStore();
    });
    wrapper.querySelector('[data-action="settings"]')?.addEventListener('click', () => {
      this.callbacks.onSettings();
    });
    wrapper.querySelector('[data-action="leaderboard"]')?.addEventListener('click', () => {
      this.callbacks.onLeaderboard?.();
    });
    wrapper.querySelector('[data-action="profile"]')?.addEventListener('click', () => {
      this.callbacks.onProfile?.();
    });

    return wrapper;
  }

  private addStyles(): void {
    if (document.getElementById('start-screen-styles')) return;

    const style = document.createElement('style');
    style.id = 'start-screen-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Luckiest+Guy&family=Outfit:wght@400;600;700;900&display=swap');

      .start-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 200;
        font-family: 'Outfit', sans-serif;
      }

      .start-container {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, #221910 0%, #3d2a1a 50%, #5a3d20 100%);
        overflow: hidden;
      }

      .start-bg-overlay {
        position: absolute;
        inset: 0;
        background: 
          radial-gradient(ellipse at 50% 100%, rgba(244, 140, 37, 0.3) 0%, transparent 50%),
          radial-gradient(ellipse at 20% 20%, rgba(135, 206, 235, 0.2) 0%, transparent 40%);
        pointer-events: none;
      }

      .start-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: 3rem 1.5rem 1.5rem;
      }

      .logo-section {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        position: relative;
      }

      .logo-burst-outer,
      .logo-burst-inner {
        position: absolute;
        width: 280px;
        height: 280px;
        clip-path: polygon(
          20% 0%, 30% 10%, 45% 0%, 50% 15%, 65% 5%, 70% 20%, 85% 10%,
          80% 30%, 95% 35%, 85% 50%, 95% 65%, 80% 70%, 90% 85%, 70% 80%,
          65% 95%, 50% 85%, 35% 95%, 30% 80%, 15% 90%, 20% 70%, 5% 65%,
          15% 50%, 5% 35%, 20% 30%
        );
      }

      .logo-burst-outer {
        background: #fbbf24;
        transform: scale(1.1) rotate(12deg);
        animation: pulse 2s ease-in-out infinite;
        opacity: 0.9;
      }

      .logo-burst-inner {
        background: #f48c25;
        transform: rotate(-6deg);
      }

      .logo-text {
        position: relative;
        z-index: 10;
        text-align: center;
        transform: rotate(-6deg);
      }

      .logo-title {
        font-family: 'Luckiest Guy', cursive;
        font-size: 5rem;
        color: white;
        line-height: 0.85;
        transform: skewX(-6deg);
        text-shadow: 4px 4px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
        -webkit-text-stroke: 3px black;
        margin: 0;
      }

      .logo-offset {
        display: inline-block;
        transform: translateX(1.5rem);
      }

      .logo-tagline {
        margin-top: 1rem;
        background: #dc2626;
        color: white;
        font-weight: 900;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transform: rotate(2deg) translateX(1.5rem);
        display: inline-block;
        box-shadow: 4px 4px 0 rgba(0,0,0,1);
        border: 2px solid black;
      }

      .spacer {
        height: 3rem;
        flex-shrink: 0;
      }

      .buttons-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .main-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
        max-width: 320px;
        margin: 0 auto;
        width: 100%;
      }

      .btn-play {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        width: 100%;
        border-radius: 9999px;
        background: #f48c25;
        box-shadow: 0 6px 0 #b05d0e;
        border: 2px solid #f48c25;
        color: #221910;
        font-size: 1.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.1s;
        gap: 0.5rem;
      }

      .btn-play:active {
        box-shadow: none;
        transform: translateY(6px);
      }

      .btn-play:hover {
        background: #ff9d3a;
      }

      .btn-icon {
        font-size: 1.75rem;
      }

      .btn-settings {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 56px;
        width: 100%;
        border-radius: 9999px;
        background: rgba(34, 25, 16, 0.6);
        backdrop-filter: blur(4px);
        border: 2px solid rgba(244, 140, 37, 0.5);
        color: white;
        font-weight: 700;
        font-size: 1.125rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }

      .btn-settings:hover {
        background: rgba(244, 140, 37, 0.2);
      }

      .nav-bar {
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0.5rem 0.5rem;
        border-top: 1px solid rgba(255,255,255,0.1);
        margin-top: 0.5rem;
      }

      .nav-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 64px;
        height: 56px;
        color: #9ca3af;
        text-decoration: none;
        cursor: pointer;
        transition: color 0.2s;
      }

      .nav-item:hover {
        color: #f48c25;
      }

      .nav-icon {
        font-size: 1.5rem;
      }

      .nav-label {
        font-size: 0.625rem;
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      .home-indicator {
        height: 4px;
        width: 33%;
        background: rgba(255,255,255,0.2);
        border-radius: 9999px;
        margin: 0.5rem auto 0;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1.1) rotate(12deg); }
        50% { transform: scale(1.15) rotate(12deg); }
      }
    `;
    document.head.appendChild(style);
  }

  public show(): void {
    this.element.style.display = 'block';
  }

  public hide(): void {
    this.element.style.display = 'none';
  }
}
