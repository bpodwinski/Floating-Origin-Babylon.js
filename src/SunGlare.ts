import {
    Scene,
    Vector3,
    Texture,
    Color4,
    Mesh,
    ParticleSystem,
    SphereParticleEmitter,
} from "@babylonjs/core";

export class StarGlare {
    /**
     * Creates a glare effect using a particle system.
     * @param scene - The js scene.
     * @param diameter - The diameter of the glare effect.
     * @returns The configured particle system.
     */
    public static create(
        scene: Scene,
        emitter: Mesh,
        diameter: number
    ): ParticleSystem {
        const particleSystem = new ParticleSystem("starGlare", 100, scene);

        particleSystem.emitter = emitter;
        particleSystem.renderingGroupId = 1;
        particleSystem.particleEmitterType = new SphereParticleEmitter(
            diameter / 2,
            0
        );

        particleSystem.particleTexture = new Texture("/T_Star.png", scene);

        particleSystem.minAngularSpeed = 0;
        particleSystem.maxAngularSpeed = 0;
        particleSystem.minSize = 500;
        particleSystem.maxSize = 750;
        particleSystem.minScaleX = 2.0;
        particleSystem.maxScaleX = 8.0;
        particleSystem.minScaleY = 1.0;
        particleSystem.maxScaleY = 10.0;

        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.minLifeTime = 5;
        particleSystem.maxLifeTime = 10;

        particleSystem.emitRate = 600;
        particleSystem.updateSpeed = 0.01;
        particleSystem.targetStopDuration = 0;

        particleSystem.gravity = new Vector3(0, 0, 0);

        particleSystem.color1 = new Color4(1, 1, 1, 1);
        particleSystem.color2 = new Color4(1, 1, 1, 1);
        particleSystem.colorDead = new Color4(0, 0, 0, 1);

        particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;

        particleSystem.preWarmCycles = 0;
        particleSystem.preWarmStepOffset = 1;

        particleSystem.minInitialRotation = -Math.PI * 2;
        particleSystem.maxInitialRotation = Math.PI * 2;

        particleSystem.addColorGradient(
            0,
            new Color4(0.8509, 0.4784, 0.1019, 0.02)
        );
        particleSystem.addColorGradient(
            0.5,
            new Color4(0.6039, 0.2887, 0.0579, 0.25)
        );
        particleSystem.addColorGradient(
            1,
            new Color4(0.3207, 0.0713, 0.0075, 0.02)
        );

        particleSystem.textureMask = new Color4(1, 1, 1, 1);

        particleSystem.preventAutoStart = true;

        return particleSystem;
    }
}
