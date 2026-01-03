interface PlayerData {
    coins: number;
    highScore: number;
    totalDistance: number;
    gamesPlayed: number;
    unlockedCharacters: string[];
    powerUps: Record<string, number>;
    settings: {
        soundEnabled: boolean;
        musicEnabled: boolean;
        language: string;
    };
}

const DEFAULT_DATA: PlayerData = {
    coins: 0,
    highScore: 0,
    totalDistance: 0,
    gamesPlayed: 0,
    unlockedCharacters: ['fox'],
    powerUps: {},
    settings: {
        soundEnabled: true,
        musicEnabled: true,
        language: 'tr'
    }
};

const STORAGE_KEY = 'bipbip_save';

export class GameData {
    private data: PlayerData;

    constructor() {
        this.data = this.load();
    }

    private load(): PlayerData {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return { ...DEFAULT_DATA, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.error('Failed to load game data:', e);
        }
        return { ...DEFAULT_DATA };
    }

    private save(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
        } catch (e) {
            console.error('Failed to save game data:', e);
        }
    }

    public saveScore(score: number, coins: number): void {
        this.data.coins += coins;
        this.data.totalDistance += score;
        this.data.gamesPlayed++;

        if (score > this.data.highScore) {
            this.data.highScore = score;
        }

        this.save();
    }

    public getCoins(): number {
        return this.data.coins;
    }

    public spendCoins(amount: number): boolean {
        if (this.data.coins >= amount) {
            this.data.coins -= amount;
            this.save();
            return true;
        }
        return false;
    }

    public addCoins(amount: number): void {
        this.data.coins += amount;
        this.save();
    }

    public getHighScore(): number {
        return this.data.highScore;
    }

    public getTotalDistance(): number {
        return this.data.totalDistance;
    }

    public getGamesPlayed(): number {
        return this.data.gamesPlayed;
    }

    public unlockCharacter(characterId: string): void {
        if (!this.data.unlockedCharacters.includes(characterId)) {
            this.data.unlockedCharacters.push(characterId);
            this.save();
        }
    }

    public isCharacterUnlocked(characterId: string): boolean {
        return this.data.unlockedCharacters.includes(characterId);
    }

    public getUnlockedCharacters(): string[] {
        return [...this.data.unlockedCharacters];
    }

    public addPowerUp(powerUpId: string, quantity: number = 1): void {
        this.data.powerUps[powerUpId] = (this.data.powerUps[powerUpId] || 0) + quantity;
        this.save();
    }

    public usePowerUp(powerUpId: string): boolean {
        if (this.data.powerUps[powerUpId] && this.data.powerUps[powerUpId] > 0) {
            this.data.powerUps[powerUpId]--;
            this.save();
            return true;
        }
        return false;
    }

    public getPowerUpCount(powerUpId: string): number {
        return this.data.powerUps[powerUpId] || 0;
    }

    public getSettings(): PlayerData['settings'] {
        return { ...this.data.settings };
    }

    public updateSettings(settings: Partial<PlayerData['settings']>): void {
        this.data.settings = { ...this.data.settings, ...settings };
        this.save();
    }

    public resetData(): void {
        this.data = { ...DEFAULT_DATA };
        this.save();
    }
}
