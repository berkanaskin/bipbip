import * as THREE from 'three';

export class SceneManager {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;

    // Camera settings for chase view - closer to character
    private cameraOffset = new THREE.Vector3(0, 4, -6);
    private cameraLookOffset = new THREE.Vector3(0, 1.5, 10);

    constructor(canvas: HTMLCanvasElement) {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        this.scene.fog = new THREE.Fog(0x87CEEB, 50, 150);

        // Create camera - narrower FOV for closer feel
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 200);
        this.camera.position.set(0, 4, -6);
        this.camera.lookAt(0, 1.5, 10);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;

        // Setup lighting
        this.setupLighting();

        // Handle resize
        window.addEventListener('resize', this.onResize);
    }

    private setupLighting(): void {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);

        // Main directional light (sun)
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.0);
        sunLight.position.set(30, 50, 30);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 150;
        sunLight.shadow.camera.left = -50;
        sunLight.shadow.camera.right = 50;
        sunLight.shadow.camera.top = 50;
        sunLight.shadow.camera.bottom = -50;
        this.scene.add(sunLight);

        // Hemisphere light for sky/ground color blending
        const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x98D982, 0.4);
        this.scene.add(hemiLight);
    }

    private onResize = (): void => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    public updateCamera(targetPosition: THREE.Vector3): void {
        // Smooth camera follow
        const targetCameraPos = targetPosition.clone().add(this.cameraOffset);
        this.camera.position.lerp(targetCameraPos, 0.1);

        const lookAtPos = targetPosition.clone().add(this.cameraLookOffset);
        this.camera.lookAt(lookAtPos);
    }

    public render(): void {
        this.renderer.render(this.scene, this.camera);
    }

    public getScene(): THREE.Scene {
        return this.scene;
    }

    public getCamera(): THREE.PerspectiveCamera {
        return this.camera;
    }

    public dispose(): void {
        window.removeEventListener('resize', this.onResize);
        this.renderer.dispose();
    }
}
