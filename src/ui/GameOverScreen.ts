export interface GameOverCallbacks {
  onRetry: () => void;
  onMenu: () => void;
  onLeaderboard?: () => void;
}

export interface GameOverData {
  score: number;
  coins: number;
  highScore: number;
  distance?: number;
  time?: string;
}

export class GameOverScreen {
  private container: HTMLElement;
  private element: HTMLElement;
  private callbacks: GameOverCallbacks;

  constructor(container: HTMLElement, callbacks: GameOverCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.element = document.createElement('div');
    this.element.className = 'game-over-screen';
    this.element.style.display = 'none';
    this.container.appendChild(this.element);
    this.addStyles();
  }

  public show(reason: 'obstacle' | 'caught', data: GameOverData): void {
    // Clear previous content
    this.element.innerHTML = '';

    if (reason === 'caught') {
      // Player WON - caught the bird
      this.element.innerHTML = this.createWinScreen(data);
    } else {
      // Player LOST - hit obstacle
      this.element.innerHTML = this.createLoseScreen(data);
    }

    // Add event listeners
    this.element.querySelector('[data-action="retry"]')?.addEventListener('click', () => {
      this.callbacks.onRetry();
    });
    this.element.querySelector('[data-action="menu"]')?.addEventListener('click', () => {
      this.callbacks.onMenu();
    });
    this.element.querySelector('[data-action="leaderboard"]')?.addEventListener('click', () => {
      this.callbacks.onLeaderboard?.();
    });

    this.element.style.display = 'block';
  }

  private createWinScreen(data: GameOverData): string {
    const isNewRecord = data.score > data.highScore;
    return `
      <div class="go-container go-win">
        <div class="go-bg-pattern"></div>
        <div class="go-sunburst"></div>
        <div class="go-bg-gradient"></div>
        
        <!-- Decorative elements -->
        <div class="go-decor go-star-1">⭐</div>
        <div class="go-decor go-celebration">🎉</div>
        <div class="go-decor go-bolt">⚡</div>
        
        <div class="go-content">
          <!-- Title -->
          <div class="go-title-section">
            <h1 class="go-title go-title-win">YAKALADIN!</h1>
            ${isNewRecord ? `
            <div class="go-badge go-badge-record">
              <span class="go-badge-icon">🏆</span>
              <span>Yeni Rekor!</span>
            </div>
            ` : ''}
          </div>
          
          <!-- Photo frame with bird -->
          <div class="go-photo-frame go-frame-win">
            <div class="go-tape"></div>
            <div class="go-photo-inner">
              <img src="./designs/kus.png" alt="Kuş" class="go-photo-img" />
              <div class="go-stamp">YAKALANDI</div>
            </div>
            <div class="go-speech-bubble">BİP BİP!</div>
            <div class="go-photo-caption">Sonunda!</div>
          </div>
          
          <!-- Stats grid -->
          <div class="go-stats-grid go-stats-4">
            <div class="go-stat-card">
              <div class="go-stat-icon">🏆</div>
              <div class="go-stat-label">Skor</div>
              <div class="go-stat-value">${data.score.toLocaleString()}</div>
            </div>
            <div class="go-stat-card">
              <div class="go-stat-icon">💰</div>
              <div class="go-stat-label">Para</div>
              <div class="go-stat-value">${data.coins}</div>
            </div>
            <div class="go-stat-card">
              <div class="go-stat-icon">📏</div>
              <div class="go-stat-label">Mesafe</div>
              <div class="go-stat-value">${data.distance ? (data.distance / 1000).toFixed(1) + 'km' : Math.floor(data.score / 10) + 'm'}</div>
            </div>
            <div class="go-stat-card">
              <div class="go-stat-icon">⏱️</div>
              <div class="go-stat-label">Süre</div>
              <div class="go-stat-value">${data.time || this.formatTime(data.score)}</div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="go-buttons">
            <button class="go-btn go-btn-primary" data-action="retry">
              <span class="go-btn-icon">🔄</span>
              TEKRAR OYNA
            </button>
            <div class="go-btn-row">
              <button class="go-btn go-btn-secondary" data-action="menu">
                <span class="go-btn-icon">🏠</span>
                Ana Menü
              </button>
              <button class="go-btn go-btn-secondary" data-action="leaderboard">
                <span class="go-btn-icon">📊</span>
                Liderlik
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private createLoseScreen(data: GameOverData): string {
    return `
      <div class="go-container go-lose">
        <div class="go-bg-pattern"></div>
        <div class="go-bg-gradient"></div>
        
        <!-- Decorative elements -->
        <div class="go-decor go-question">❓</div>
        <div class="go-decor go-cloud">☁️</div>
        <div class="go-decor go-sad">😢</div>
        
        <div class="go-content">
          <!-- Title -->
          <div class="go-title-section">
            <h1 class="go-title go-title-lose">KAÇIRDIN!</h1>
            <div class="go-badge go-badge-tagline">
              <span>Sıkıysa Yakala!</span>
            </div>
          </div>
          
          <!-- Photo frame with fox -->
          <div class="go-photo-frame go-frame-lose">
            <div class="go-tape"></div>
            <div class="go-photo-inner">
              <img src="./designs/tilki.png" alt="Tilki" class="go-photo-img go-photo-grayscale" />
              <div class="go-bip-text">BİP BİP!</div>
            </div>
            <div class="go-photo-status">
              <span class="go-status-icon">🏃</span>
              <span>Durum: Kuş Uçtu!</span>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="go-stats-wide">
            <div class="go-stat-main">
              <div class="go-stat-icon-lg">🏆</div>
              <div class="go-stat-info">
                <span class="go-stat-label">Toplam Skor</span>
                <span class="go-stat-value-lg">${data.score.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="go-stats-grid go-stats-2">
            <div class="go-stat-card">
              <div class="go-stat-icon">💰</div>
              <div class="go-stat-label">Para</div>
              <div class="go-stat-value">${data.coins}</div>
            </div>
            <div class="go-stat-card">
              <div class="go-stat-icon">📏</div>
              <div class="go-stat-label">Mesafe</div>
              <div class="go-stat-value">${Math.floor(data.score / 10)}m</div>
            </div>
          </div>
          
          <!-- Buttons -->
          <div class="go-buttons">
            <button class="go-btn go-btn-primary" data-action="retry">
              <span class="go-btn-icon">🔄</span>
              TEKRAR OYNA
            </button>
            <div class="go-btn-row">
              <button class="go-btn go-btn-secondary" data-action="menu">
                <span class="go-btn-icon">🏠</span>
                Ana Menü
              </button>
              <button class="go-btn go-btn-secondary" data-action="leaderboard">
                <span class="go-btn-icon">📊</span>
                Liderlik
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private formatTime(score: number): string {
    const seconds = Math.floor(score / 15);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  public hide(): void {
    this.element.style.display = 'none';
  }

  private addStyles(): void {
    if (document.getElementById('game-over-styles')) return;

    const style = document.createElement('style');
    style.id = 'game-over-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Spline+Sans:wght@300;400;500;600;700;800&display=swap');

      .game-over-screen {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 300;
        font-family: 'Spline Sans', 'Outfit', sans-serif;
      }

      .go-container {
        position: relative;
        width: 100%;
        height: 100%;
        max-width: 480px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .go-win { background: #3E2723; }
      .go-lose { background: #3E2723; }

      .go-bg-pattern {
        position: absolute;
        inset: 0;
        opacity: 0.6;
        background-image: radial-gradient(#5D4037 15%, transparent 16%), radial-gradient(#5D4037 15%, transparent 16%);
        background-size: 30px 30px;
        background-position: 0 0, 15px 15px;
      }

      .go-sunburst {
        position: absolute;
        inset: 0;
        background: repeating-conic-gradient(from 0deg, rgba(255,255,255,0.03) 0deg 15deg, transparent 15deg 30deg);
        mask-image: radial-gradient(circle, black 30%, transparent 70%);
        animation: spin 12s linear infinite;
      }

      .go-bg-gradient {
        position: absolute;
        inset: 0;
        background: linear-gradient(to bottom, transparent, rgba(62,39,35,0.5), #3E2723);
        pointer-events: none;
      }

      .go-content {
        position: relative;
        z-index: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1.5rem 1.25rem;
        min-height: 100%;
      }

      /* Decorative elements */
      .go-decor {
        position: absolute;
        font-size: 2.5rem;
        opacity: 0.6;
        animation: float 3s ease-in-out infinite;
        z-index: 1;
      }
      .go-star-1 { top: 5rem; left: 2.5rem; animation-delay: 0.7s; }
      .go-celebration { top: 10rem; right: 1.5rem; animation-delay: 0.3s; }
      .go-bolt { bottom: 33%; left: 1rem; }
      .go-question { top: 3rem; left: 3rem; animation: bounce 2s infinite; }
      .go-cloud { top: 6rem; right: 2rem; opacity: 0.3; }
      .go-sad { top: 12rem; left: 1.5rem; }

      /* Title */
      .go-title-section {
        text-align: center;
        margin-bottom: 1rem;
      }

      .go-title {
        font-size: 3.5rem;
        font-weight: 900;
        font-style: italic;
        letter-spacing: -0.05em;
        line-height: 1;
        margin: 0;
        text-shadow: 4px 4px 0 #000;
        -webkit-text-stroke: 2px black;
        animation: float 3s ease-in-out infinite;
      }

      .go-title-win { color: #FFD600; }
      .go-title-lose { color: white; }

      .go-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1.25rem;
        border-radius: 9999px;
        font-weight: 900;
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        margin-top: 0.75rem;
        box-shadow: 2px 2px 0 rgba(0,0,0,1);
      }

      .go-badge-record {
        background: linear-gradient(to right, #b45309, #c2410c);
        color: white;
        border: 2px solid #fcd34d;
      }

      .go-badge-tagline {
        background: #4E342E;
        color: #FFD600;
        border: 2px solid #795548;
      }

      /* Photo frame */
      .go-photo-frame {
        position: relative;
        width: 240px;
        height: 240px;
        margin: 1rem auto;
        background: #fdfbf7;
        padding: 0.75rem;
        padding-bottom: 2.5rem;
        border-radius: 6px;
        box-shadow: 8px 8px 0 rgba(0,0,0,1);
        border: 1px solid #d4d4d4;
      }

      .go-frame-win { transform: rotate(2deg); }
      .go-frame-lose { transform: rotate(-1deg); }

      .go-tape {
        position: absolute;
        top: -12px;
        left: 50%;
        transform: translateX(-50%) rotate(1deg);
        width: 80px;
        height: 24px;
        background: rgba(255,255,255,0.3);
        backdrop-filter: blur(4px);
        border: 1px solid rgba(255,255,255,0.2);
        z-index: 30;
      }

      .go-photo-inner {
        position: relative;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(0,0,0,0.1);
        overflow: hidden;
        background: #e5e5e5;
      }

      .go-photo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .go-photo-grayscale {
        filter: grayscale(30%) sepia(20%);
      }

      .go-stamp {
        position: absolute;
        bottom: 1rem;
        right: 0.5rem;
        padding: 0.25rem 0.75rem;
        border: 6px solid #D50000;
        border-radius: 12px;
        color: #D50000;
        font-weight: 900;
        font-size: 1.5rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        transform: rotate(-15deg);
        opacity: 0;
        animation: stamp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.8s forwards;
        background: rgba(213,0,0,0.1);
        backdrop-filter: blur(1px);
      }

      .go-bip-text {
        position: absolute;
        top: 1rem;
        right: 0.5rem;
        color: #29B6F6;
        font-weight: 900;
        font-size: 1.25rem;
        font-style: italic;
        text-shadow: 2px 2px 0 #000;
        opacity: 0;
        animation: pop 0.3s ease 0.8s forwards;
      }

      .go-speech-bubble {
        position: absolute;
        top: -2rem;
        right: -2rem;
        background: white;
        border: 3px solid black;
        padding: 0.5rem 1rem;
        border-radius: 40%;
        border-bottom-left-radius: 0;
        font-weight: 900;
        font-size: 1.25rem;
        font-style: italic;
        color: black;
        box-shadow: 4px 4px 0 rgba(0,0,0,1);
        transform: rotate(12deg);
        animation: wiggle 3s ease-in-out infinite;
        z-index: 40;
      }

      .go-speech-bubble::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: -8px;
        width: 16px;
        height: 16px;
        background: white;
        border-left: 3px solid black;
        border-bottom: 3px solid black;
        transform: rotate(45deg);
      }

      .go-photo-caption {
        position: absolute;
        bottom: 0.75rem;
        left: 50%;
        transform: translateX(-50%) rotate(-1deg);
        color: #525252;
        font-weight: 900;
        font-size: 1rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .go-photo-status {
        position: absolute;
        bottom: 0.5rem;
        left: 1rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
        color: #737373;
        font-size: 0.75rem;
        font-weight: 700;
      }

      /* Stats */
      .go-stats-grid {
        display: grid;
        gap: 0.75rem;
        width: 100%;
        margin-bottom: 1rem;
      }

      .go-stats-4 { grid-template-columns: repeat(2, 1fr); }
      .go-stats-2 { grid-template-columns: repeat(2, 1fr); }

      .go-stats-wide {
        width: 100%;
        margin-bottom: 0.75rem;
      }

      .go-stat-main {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #4E342E;
        border-radius: 12px;
        border-bottom: 6px solid #795548;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .go-stat-icon-lg {
        font-size: 2rem;
        padding: 0.5rem;
        background: rgba(0,0,0,0.2);
        border-radius: 8px;
      }

      .go-stat-info {
        display: flex;
        flex-direction: column;
      }

      .go-stat-value-lg {
        font-size: 2rem;
        font-weight: 900;
        color: white;
        text-shadow: 2px 2px 0 #000;
        line-height: 1;
      }

      .go-stat-card {
        display: flex;
        flex-direction: column;
        padding: 0.75rem;
        background: #4E342E;
        border-radius: 12px;
        border-bottom: 6px solid #795548;
        box-shadow: 2px 2px 0 rgba(0,0,0,1);
        transition: transform 0.2s;
      }

      .go-stat-card:hover {
        transform: translateY(-2px);
      }

      .go-stat-icon {
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
      }

      .go-stat-label {
        font-size: 0.625rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: rgba(255,255,255,0.7);
        margin-bottom: 0.25rem;
      }

      .go-stat-value {
        font-size: 1.5rem;
        font-weight: 900;
        color: white;
        text-shadow: 2px 2px 0 #000;
        line-height: 1;
      }

      /* Buttons */
      .go-buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: auto;
        padding-bottom: 1rem;
      }

      .go-btn-row {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
      }

      .go-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.1s;
        font-family: inherit;
      }

      .go-btn:active {
        transform: translateY(4px);
        box-shadow: none !important;
        border-bottom-width: 0 !important;
      }

      .go-btn-primary {
        height: 64px;
        font-size: 1.25rem;
        background: linear-gradient(to bottom, #FF9800, #E65100);
        color: white;
        border-bottom: 6px solid #bf360c;
        box-shadow: 4px 4px 0 rgba(0,0,0,1);
      }

      .go-btn-primary:hover {
        filter: brightness(1.1);
      }

      .go-btn-secondary {
        height: 56px;
        font-size: 0.875rem;
        background: #4E342E;
        color: rgba(255,255,255,0.9);
        border-bottom: 4px solid #795548;
        box-shadow: 2px 2px 0 rgba(0,0,0,1);
      }

      .go-btn-secondary:hover {
        background: #5D4037;
      }

      .go-btn-icon {
        font-size: 1.5rem;
      }

      @keyframes float {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-10px) rotate(2deg); }
      }

      @keyframes stamp {
        0% { transform: scale(2.5) rotate(-15deg); opacity: 0; }
        70% { transform: scale(0.9) rotate(-15deg); opacity: 1; }
        100% { transform: scale(1) rotate(-15deg); opacity: 1; }
      }

      @keyframes pop {
        0% { transform: scale(0.5); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }

      @keyframes wiggle {
        0%, 100% { transform: rotate(8deg); }
        50% { transform: rotate(16deg); }
      }

      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }

      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(style);
  }
}
