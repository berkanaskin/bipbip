export interface InputState {
    left: boolean;
    right: boolean;
    jump: boolean;
    slide: boolean;
}

export class InputManager {
    private canvas: HTMLCanvasElement;
    private inputState: InputState = {
        left: false,
        right: false,
        jump: false,
        slide: false
    };

    // Touch tracking
    private touchStartX: number = 0;
    private touchStartY: number = 0;
    private touchStartTime: number = 0;
    private isTouching: boolean = false;

    // Thresholds
    private readonly SWIPE_THRESHOLD = 30;
    private readonly SWIPE_TIME_THRESHOLD = 300;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', this.onTouchStart, { passive: false });
        this.canvas.addEventListener('touchmove', this.onTouchMove, { passive: false });
        this.canvas.addEventListener('touchend', this.onTouchEnd, { passive: false });

        // Keyboard events for desktop
        window.addEventListener('keydown', this.onKeyDown);
        window.addEventListener('keyup', this.onKeyUp);

        // Mouse events for desktop testing
        this.canvas.addEventListener('mousedown', this.onMouseDown);
        this.canvas.addEventListener('mouseup', this.onMouseUp);
        this.canvas.addEventListener('mousemove', this.onMouseMove);
    }

    private onTouchStart = (e: TouchEvent): void => {
        e.preventDefault();
        const touch = e.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
        this.isTouching = true;
    };

    private onTouchMove = (e: TouchEvent): void => {
        e.preventDefault();
    };

    private onTouchEnd = (e: TouchEvent): void => {
        e.preventDefault();

        if (!this.isTouching) return;
        this.isTouching = false;

        const touch = e.changedTouches[0];
        const deltaX = touch.clientX - this.touchStartX;
        const deltaY = touch.clientY - this.touchStartY;
        const deltaTime = Date.now() - this.touchStartTime;

        // Only count as swipe if fast enough
        if (deltaTime > this.SWIPE_TIME_THRESHOLD) return;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY && absX > this.SWIPE_THRESHOLD) {
            // Horizontal swipe
            if (deltaX > 0) {
                this.triggerInput('right');
            } else {
                this.triggerInput('left');
            }
        } else if (absY > absX && absY > this.SWIPE_THRESHOLD) {
            // Vertical swipe
            if (deltaY < 0) {
                this.triggerInput('jump');
            } else {
                this.triggerInput('slide');
            }
        }
    };

    private onKeyDown = (e: KeyboardEvent): void => {
        switch (e.code) {
            case 'ArrowLeft':
            case 'KeyA':
                this.triggerInput('left');
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.triggerInput('right');
                break;
            case 'ArrowUp':
            case 'KeyW':
            case 'Space':
                this.triggerInput('jump');
                break;
            case 'ArrowDown':
            case 'KeyS':
                this.triggerInput('slide');
                break;
        }
    };

    private onKeyUp = (_e: KeyboardEvent): void => {
        // Reset states if needed
    };

    // Mouse simulation for desktop testing
    private mouseStartX: number = 0;
    private mouseStartY: number = 0;
    private isMouseDown: boolean = false;

    private onMouseDown = (e: MouseEvent): void => {
        this.mouseStartX = e.clientX;
        this.mouseStartY = e.clientY;
        this.isMouseDown = true;
    };

    private onMouseUp = (e: MouseEvent): void => {
        if (!this.isMouseDown) return;
        this.isMouseDown = false;

        const deltaX = e.clientX - this.mouseStartX;
        const deltaY = e.clientY - this.mouseStartY;

        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX > absY && absX > this.SWIPE_THRESHOLD) {
            if (deltaX > 0) {
                this.triggerInput('right');
            } else {
                this.triggerInput('left');
            }
        } else if (absY > absX && absY > this.SWIPE_THRESHOLD) {
            if (deltaY < 0) {
                this.triggerInput('jump');
            } else {
                this.triggerInput('slide');
            }
        }
    };

    private onMouseMove = (_e: MouseEvent): void => {
        // Could add visual feedback here
    };

    private triggerInput(action: keyof InputState): void {
        this.inputState[action] = true;

        // Auto-reset after a frame
        requestAnimationFrame(() => {
            this.inputState[action] = false;
        });
    }

    public getInput(): InputState {
        return { ...this.inputState };
    }

    public dispose(): void {
        this.canvas.removeEventListener('touchstart', this.onTouchStart);
        this.canvas.removeEventListener('touchmove', this.onTouchMove);
        this.canvas.removeEventListener('touchend', this.onTouchEnd);
        window.removeEventListener('keydown', this.onKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);
        this.canvas.removeEventListener('mousedown', this.onMouseDown);
        this.canvas.removeEventListener('mouseup', this.onMouseUp);
        this.canvas.removeEventListener('mousemove', this.onMouseMove);
    }
}
