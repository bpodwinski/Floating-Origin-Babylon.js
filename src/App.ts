import {
    Engine,
    Scene,
    UniversalCamera,
    Vector3,
    MeshBuilder,
    TransformNode,
    Color3,
    StandardMaterial,
    PointLight,
    Texture,
    DefaultRenderingPipeline,
    PBRMetallicRoughnessMaterial,
    Camera,
} from "@babylonjs/core";
//import { Effect } from "@babylonjs/core/Materials/effect";

// import venusCloudsFragment from "./shaders/venusCloudsFragmentShader.fragment.fx?raw";
// import venusCloudsVertex from "./shaders/venusCloudsVertexShader.vertex.fx?raw";

// Effect.ShadersStore[`${venusCloudsVertex}VertexShader`] = venusCloudsVertex;
// Effect.ShadersStore[`${venusCloudsFragment}FragmentShader`] =
//     venusCloudsFragment;

export class FloatingCameraScene {
    public static CreateScene(
        engine: Engine,
        canvas: HTMLCanvasElement
    ): Scene {
        // Scene Init
        let scene = new Scene(engine);
        scene.clearColor.set(0, 0, 0, 1);
        scene.collisionsEnabled = true;
        scene.textures.forEach((texture) => {
            texture.anisotropicFilteringLevel = 16;
        });

        // Create an OriginCamera, which is a special floating-origin UniversalCamera
        // It works much like UniversalCamera, but we use its doublepos and doubletgt
        // properties instead of position and target
        let camera = new OriginCamera(
            "camera",
            ScaleManager.toSimulationVector(
                new Vector3(5_906_400_000 - 10_000, 0, 10_000)
            ),
            scene
        );
        camera.doubletgt = ScaleManager.toSimulationVector(
            new Vector3(5_906_400_000, 0, 0)
        );

        camera.touchAngularSensibility = 10000;
        camera.inertia = 0.1;

        camera.speed = ScaleManager.toSimulationUnits(100);
        camera.keysUp.push(90); // Z
        camera.keysDown.push(83); // S
        camera.keysLeft.push(81); // Q
        camera.keysRight.push(68); // D
        camera.keysUpward.push(69); // A
        camera.keysDownward.push(65); // E
        camera.minZ = 0.1;
        camera.maxZ = 1_000_000_000;
        camera.fov = 0.75;
        camera.checkCollisions = true;
        camera.applyGravity = false;
        camera.attachControl(canvas, true);

        // Adjust camera speed with mouse wheel
        canvas.addEventListener(
            "wheel",
            function (e) {
                camera.speed = Math.min(
                    10,
                    Math.max(1, (camera.speed -= e.deltaY * 0.001))
                );
            },
            { passive: true }
        );

        // Pipeline Begin
        const pipeline = new DefaultRenderingPipeline("Pipeline", true, scene, [
            camera,
        ]);
        pipeline.imageProcessingEnabled = true;
        pipeline.imageProcessing.toneMappingEnabled = true;
        pipeline.imageProcessing.toneMappingType = 2;
        pipeline.imageProcessing.exposure = 1.2;
        pipeline.imageProcessing.contrast = 1.0;

        pipeline.fxaaEnabled = true;
        pipeline.bloomEnabled = true;
        pipeline.bloomThreshold = 0;
        pipeline.bloomKernel = 80;
        pipeline.bloomWeight = 0.2;

        pipeline.sharpenEnabled = true;
        pipeline.sharpen.edgeAmount = 0.1;
        pipeline.sharpen.colorAmount = 1.0;

        pipeline.samples = 4;
        // Pipeline End

        // Sun Begin
        // Light
        let entSunLight = new Entity("entSunLight", scene);
        entSunLight.doublepos.set(0, 0, 0);
        camera.add(entSunLight);

        let sunLight = new PointLight("sunLight", new Vector3(0, 0, 0), scene);

        sunLight.intensity = 5e10;
        sunLight.falloffType = PointLight.FALLOFF_PHYSICAL;
        sunLight.diffuse = new Color3(1, 1, 1);
        sunLight.specular = new Color3(1, 1, 1);
        sunLight.parent = entSunLight;

        // Object
        const entSun = new Entity("entSun", scene);
        entSun.doublepos.set(0, 0, 0);
        camera.add(entSun);

        const sun = MeshBuilder.CreateSphere("sun", {
            segments: 256,
            diameter: ScaleManager.toSimulationUnits(696_340 * 2),
        });

        let sunMaterial = new StandardMaterial("sunMaterial", scene);

        sunMaterial.diffuseColor = new Color3(1, 0.8, 0);
        sunMaterial.emissiveColor = new Color3(1, 0.8, 0);
        sunMaterial.specularColor = new Color3(0, 0, 0);

        sun.material = sunMaterial;
        sun.parent = entSun;
        // Sun End

        // Mercury Begin
        // const entMercury = new Entity("entMercury", scene);
        // entMercury.doublepos.set(
        //     ScaleManager.toSimulationUnits(57_910_000),
        //     0,
        //     0
        // );
        // camera.add(entMercury);

        // const mercury = MeshBuilder.CreateSphere("mercury", {
        //     segments: 256,
        //     diameter: ScaleManager.toSimulationUnits(2_439.7 * 2),
        // });

        // let mercuryMaterial = new PBRMetallicRoughnessMaterial(
        //     "mercuryMaterial",
        //     scene
        // );

        // mercuryMaterial.baseTexture = new Texture(
        //     "/mercury/mercury_surface_albedo.ktx2",
        //     scene
        // );
        // mercuryMaterial.normalTexture = new Texture(
        //     "/mercury/mercury_surface_albedo.ktx2",
        //     scene
        // );

        // mercuryMaterial.metallic = 0.0;
        // mercuryMaterial.roughness = 0.85;
        // mercury.material = mercuryMaterial;

        // mercury.checkCollisions = true;
        // mercury.parent = entMercury;
        // Mercury End

        // Venus Begin
        // const entVenus = new Entity("entVenus", scene);
        // entVenus.doublepos.set(
        //     ScaleManager.toSimulationUnits(108_200_000),
        //     0,
        //     0
        // );
        // camera.add(entVenus);

        // const venus = MeshBuilder.CreateSphere("venus", {
        //     segments: 256,
        //     diameter: ScaleManager.toSimulationUnits(6_051.8 * 2),
        // });

        // let venusMaterial = new PBRMetallicRoughnessMaterial(
        //     "venusMaterial",
        //     scene
        // );

        // venusMaterial.baseTexture = new Texture(
        //     "/venus/venus_surface_albedo.ktx2",
        //     scene
        // );
        // venusMaterial.normalTexture = new Texture(
        //     "/venus/venus_surface_bump.ktx2",
        //     scene
        // );

        // venusMaterial.metallic = 0.0;
        // venusMaterial.roughness = 0.85;
        // venus.material = venusMaterial;

        // venus.checkCollisions = true;
        // venus.parent = entVenus;
        // Venus End

        // Pluto Begin
        const entPluto = new Entity("entPluto", scene);
        entPluto.doublepos.set(
            ScaleManager.toSimulationUnits(5_906_400_000),
            0,
            0
        );
        camera.add(entPluto);

        const pluto = MeshBuilder.CreateSphere("pluto", {
            segments: 256,
            diameter: ScaleManager.toSimulationUnits(2_377 * 2),
        });

        let plutoMaterial = new PBRMetallicRoughnessMaterial(
            "plutoMaterial",
            scene
        );

        plutoMaterial.baseTexture = new Texture(
            "/pluto/pluto_surface_albedo.ktx2",
            scene
        );
        plutoMaterial.normalTexture = new Texture(
            "/pluto/pluto_surface_normal.ktx2",
            scene
        );

        plutoMaterial.metallic = 0.0;
        plutoMaterial.roughness = 0.85;
        pluto.material = plutoMaterial;

        pluto.checkCollisions = true;
        pluto.parent = entPluto;
        // Pluto End

        return scene;
    }
}

//
// Floating-Origin Camera
//
// This camera is based on UniversalCamera,
// but it acts differently. It is fixed
// at world's origin (0, 0, 0),
// and it moves all Entities added to its list
// around the origin, mitigating floating-point
// imprecisions at places with huge coordinates.
//

// Our floating-origin OriginCamera
class OriginCamera extends UniversalCamera {
    private _list: Array<Entity> = new Array<Entity>();

    // double precision position
    // you must use the doublepos to change its position, instead of position directly.
    private _doublepos: Vector3 = new Vector3();
    public get doublepos() {
        return this._doublepos;
    }
    public set doublepos(pos: Vector3) {
        this._doublepos.copyFrom(pos);
    }

    // double precision target
    // you must use the doubletgt to change it, instead of setTarget() directly.
    private _doubletgt: Vector3 = new Vector3();
    public get doubletgt() {
        return this._doubletgt;
    }
    public set doubletgt(tgt: Vector3) {
        this._doubletgt.copyFrom(tgt);
        this.setTarget(this._doubletgt.subtract(this._doublepos));
    }

    // Constructor
    constructor(name: string, position: Vector3, scene: Scene) {
        super(name, Vector3.Zero(), scene);

        this.doublepos = position;

        this._scene.onBeforeActiveMeshesEvaluationObservable.add(() => {
            // accumulate any movement on current frame
            // to the double precision position,
            // then clear the camera movement (move camera back to origin);
            // this would not be necessary if we moved the camera
            // ouselves from this class, but for now we're
            // leaving that responsibility for the original UniversalCamera,
            // so when it moves from origin, we must update our doublepos
            // and reset the UniversalCamera back to origin.
            this.doublepos.addInPlace(this.position);
            this.position.set(0, 0, 0);

            // iterate through all registered Entities
            for (let i = 0; i < this._list.length; i++) {
                // update the Entity
                this._list[i].update(this);
            }
        });
    }

    // Register an Entity
    add(entity: Entity): void {
        this._list.push(entity);
    }
}

//
// Floating-Origin Entity
//
// Put any objects you want to become floating-origin
// as children of an Entity.
//
// You can have as many Entities as you want,
// but this is better if you space them, objects
// close to each other should be inside an unique Entity.
//

// Out floating-origin Entity
class Entity extends TransformNode {
    // You must use the doublepos property instead of position directly
    private _doublepos: Vector3 = new Vector3();
    public get doublepos() {
        return this._doublepos;
    }
    public set doublepos(pos: Vector3) {
        this._doublepos.copyFrom(pos);
    }

    constructor(name: string, scene: Scene) {
        super(name, scene);
    }

    // This is called automatically by OriginCamera
    public update(cam: OriginCamera): void {
        this.position = this.doublepos.subtract(cam.doublepos);
    }
}

/**
 * Manages scale conversion between real-world distances (in kilometers)
 */
class ScaleManager {
    /**
     * Scale factor to convert kilometers into simulation units.
     * In this context, 1 Babylon.js unit represents 1,000 km.
     */
    private static readonly SCALE_FACTOR = 1 / 1_000;

    /**
     * Converts a distance from kilometers to simulation units.
     *
     * @param value_km - The distance in kilometers.
     * @returns The equivalent distance in simulation units.
     */
    public static toSimulationUnits(value_km: number): number {
        return value_km * this.SCALE_FACTOR;
    }

    /**
     * Converts a position vector from kilometers to simulation units.
     *
     * @param position_km - The position vector in kilometers.
     * @returns A new `Vector3` instance representing the position in simulation units.
     */
    public static toSimulationVector(position_km: Vector3): Vector3 {
        return position_km.scale(this.SCALE_FACTOR);
    }
}
