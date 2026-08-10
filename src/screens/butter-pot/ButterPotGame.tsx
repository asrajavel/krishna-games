import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Timer } from "../../components/Timer";

interface Props {
  onExit: () => void;
}

type Phase = "playing" | "frozen" | "results";

const GAME_DURATION_MS = 75_000;
const FREEZE_MS = 4_000;
const AUTO_RESET_SECONDS = 10;
const MAX_THROWS = 14;
const GRAVITY = -9;

const POT_POSITIONS = [
  [-4, 3.5, -3.1],
  [-2, 5.1, -4.8],
  [0, 4, -3.8],
  [2, 5.1, -4.8],
  [4, 3.5, -3.1],
  [-5.2, 6.2, 0.2],
  [5.2, 6.2, 0.2],
  [-3.1, 2.3, 2.4],
  [3.1, 2.3, 2.4],
] as const;
const POT_COUNT = POT_POSITIONS.length;

interface Projectile {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  age: number;
}

interface Fragment {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  age: number;
}

export function ButterPotGame({ onExit }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const powerRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("playing");
  const [phase, setPhase] = useState<Phase>("playing");
  const [broken, setBroken] = useState(0);
  const [throws, setThrows] = useState(0);
  const [won, setWon] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_RESET_SECONDS);
  const [session, setSession] = useState(0);

  const finish = useCallback((success: boolean) => {
    if (phaseRef.current !== "playing") return;
    phaseRef.current = "frozen";
    setWon(success);
    setPhase("frozen");
  }, []);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    if (phase !== "frozen") return;
    const timeout = window.setTimeout(() => setPhase("results"), FREEZE_MS);
    return () => window.clearTimeout(timeout);
  }, [phase]);

  useEffect(() => {
    if (phase !== "results") return;
    const interval = window.setInterval(
      () => setCountdown((current) => Math.max(0, current - 1)),
      1000,
    );
    return () => window.clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "results" && countdown === 0) onExit();
  }, [countdown, onExit, phase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x3b2318);
    scene.fog = new THREE.Fog(0x3b2318, 22, 38);

    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.set(0, 4.8, 13.5);
    camera.lookAt(0, 3.6, -4);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.className = "block h-full w-full cursor-crosshair";
    renderer.domElement.setAttribute("aria-label", "Aim at a butter pot, hold to charge, and release to throw");
    mount.appendChild(renderer.domElement);

    const textures: THREE.Texture[] = [];
    const makeTexture = (
      paint: (context: CanvasRenderingContext2D, size: number) => void,
      repeatX: number,
      repeatY: number,
    ) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 256;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas textures are unavailable");
      paint(context, 256);
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(repeatX, repeatY);
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(texture);
      return texture;
    };

    const floorTexture = makeTexture((context, size) => {
      const tile = size / 4;
      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 4; column += 1) {
          context.fillStyle = (row + column) % 2 ? "#8f402c" : "#b15b35";
          context.fillRect(column * tile, row * tile, tile, tile);
          context.strokeStyle = "rgba(255, 191, 94, 0.25)";
          context.lineWidth = 3;
          context.strokeRect(column * tile, row * tile, tile, tile);
        }
      }
      for (let i = 0; i < 180; i += 1) {
        context.fillStyle = i % 2 ? "rgba(45, 20, 15, 0.12)" : "rgba(255, 214, 147, 0.1)";
        context.fillRect((i * 47) % size, (i * 83) % size, 2, 2);
      }
    }, 3, 5);

    const wallTexture = makeTexture((context, size) => {
      context.fillStyle = "#d88949";
      context.fillRect(0, 0, size, size);
      for (let i = 0; i < 280; i += 1) {
        const light = i % 3 === 0;
        context.fillStyle = light ? "rgba(255, 232, 184, 0.08)" : "rgba(80, 34, 25, 0.08)";
        const radius = 1 + (i % 4);
        context.beginPath();
        context.arc((i * 71) % size, (i * 113) % size, radius, 0, Math.PI * 2);
        context.fill();
      }
    }, 3, 2);

    scene.add(new THREE.HemisphereLight(0xffe5b4, 0x36445f, 1.9));
    const sun = new THREE.DirectionalLight(0xffcf8b, 2.7);
    sun.position.set(-1.5, 6.8, 12);
    sun.target.position.set(0, 4, -4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 12;
    sun.shadow.camera.bottom = -5;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    sun.shadow.bias = -0.0002;
    sun.shadow.normalBias = 0.025;
    sun.shadow.radius = 2.5;
    scene.add(sun, sun.target);

    const aimSurfaces: THREE.Object3D[] = [];
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(17, 24),
      new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.9 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.55, 5);
    floor.receiveShadow = true;
    scene.add(floor);
    aimSurfaces.push(floor);

    const wallMaterial = new THREE.MeshStandardMaterial({
      map: wallTexture,
      color: 0xffc783,
      roughness: 0.95,
    });
    const wall = new THREE.Mesh(
      new THREE.PlaneGeometry(17, 10),
      wallMaterial,
    );
    wall.position.set(0, 4.45, -6);
    wall.receiveShadow = true;
    scene.add(wall);
    aimSurfaces.push(wall);

    const sideWallMaterial = wallMaterial.clone();
    [-8.25, 8.25].forEach((x) => {
      const sideWall = new THREE.Mesh(new THREE.BoxGeometry(0.5, 10, 24), sideWallMaterial);
      sideWall.position.set(x, 4.45, 5);
      sideWall.receiveShadow = true;
      scene.add(sideWall);
      aimSurfaces.push(sideWall);
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4b942,
      metalness: 0.28,
      roughness: 0.5,
    });
    [-0.15, 8.85].forEach((y) => {
      const trim = new THREE.Mesh(new THREE.BoxGeometry(17, 0.28, 0.35), trimMaterial);
      trim.position.set(0, y, -5.8);
      trim.castShadow = true;
      scene.add(trim);
    });

    const ceilingY = 9.2;
    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(17, 0.45, 24),
      new THREE.MeshStandardMaterial({
        color: 0x76536f,
        emissive: 0x24172a,
        emissiveIntensity: 0.18,
        roughness: 0.84,
      }),
    );
    ceiling.position.set(0, ceilingY + 0.225, 5);
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    aimSurfaces.push(ceiling);

    const lowerWall = new THREE.Mesh(
      new THREE.PlaneGeometry(16.6, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x6f263d, roughness: 0.82 }),
    );
    lowerWall.position.set(0, 0.55, -5.97);
    lowerWall.receiveShadow = true;
    scene.add(lowerWall);

    const columnMaterial = new THREE.MeshStandardMaterial({ color: 0x285c67, roughness: 0.65 });
    [-7.15, 7.15].forEach((x) => {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 8.9, 20), columnMaterial);
      shaft.position.set(x, 4.25, -5.25);
      shaft.castShadow = true;
      scene.add(shaft);
      [-0.25, 8.95].forEach((y) => {
        const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.5, 20), trimMaterial);
        capital.position.set(x, y, -5.25);
        capital.castShadow = true;
        scene.add(capital);
      });
    });

    for (let z = -3; z <= 13; z += 4) {
      const beam = new THREE.Mesh(
        new THREE.BoxGeometry(17, 0.28, 0.38),
        new THREE.MeshStandardMaterial({ color: 0x67412f, roughness: 0.78 }),
      );
      beam.position.set(0, 8.92, z);
      scene.add(beam);
    }

    const rug = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 9),
      new THREE.MeshStandardMaterial({ color: 0x173f57, roughness: 0.8 }),
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, -0.515, 5);
    rug.receiveShadow = true;
    scene.add(rug);
    const rugBorderMaterial = new THREE.MeshStandardMaterial({ color: 0xe9a93b, roughness: 0.62 });
    [-2.75, 2.75].forEach((x) => {
      const border = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.025, 8.7), rugBorderMaterial);
      border.position.set(x, -0.49, 5);
      scene.add(border);
    });
    [0.7, 9.3].forEach((z) => {
      const border = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.025, 0.12), rugBorderMaterial);
      border.position.set(0, -0.49, z);
      scene.add(border);
    });

    const potColors = [0xa93f2d, 0x265d68, 0x70436f, 0xc1582d, 0x34527b];
    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc247,
      metalness: 0.35,
      roughness: 0.4,
    });
    const butterMaterial = new THREE.MeshStandardMaterial({
      color: 0xffe189,
      emissive: 0x6b3e00,
      emissiveIntensity: 0.22,
      roughness: 0.48,
    });
    const ropeMaterial = new THREE.MeshStandardMaterial({ color: 0xe8bd72, roughness: 0.9 });
    const pots = new Map<number, THREE.Group>();
    const aimablePotParts = new Set<THREE.Object3D>();

    POT_POSITIONS.forEach(([x, y, z], id) => {
      const pot = new THREE.Group();
      pot.position.set(x, y, z);
      pot.userData.id = id;
      pot.userData.baseX = x;
      pot.userData.swingSpeed = 0.00125 + id * 0.00014;
      pot.userData.swingPhase = id * 1.35;
      pot.userData.swingAmount = id === 2 ? 0.35 : 0.55;

      const potMaterial = new THREE.MeshStandardMaterial({
        color: potColors[id % potColors.length],
        roughness: 0.58,
        metalness: 0.04,
      });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.68, 32, 24), potMaterial);
      body.scale.y = 0.82;
      body.castShadow = true;
      pot.add(body);
      aimablePotParts.add(body);

      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 0.4, 24), potMaterial);
      neck.position.y = 0.55;
      neck.castShadow = true;
      pot.add(neck);
      aimablePotParts.add(neck);
      pot.userData.aimParts = [body, neck];

      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.09, 10, 24), rimMaterial);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.77;
      pot.add(rim);

      const band = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.035, 8, 32), rimMaterial);
      band.rotation.x = Math.PI / 2;
      band.position.y = 0.05;
      pot.add(band);

      const butter = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.035, 24), butterMaterial);
      butter.position.y = 0.79;
      pot.add(butter);

      for (let dot = 0; dot < 6; dot += 1) {
        const angle = (dot / 6) * Math.PI * 2;
        const decoration = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), rimMaterial);
        decoration.position.set(Math.cos(angle) * 0.665, -0.18, Math.sin(angle) * 0.665);
        pot.add(decoration);
      }

      const ropeLength = ceilingY - (y + 0.78);
      const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, ropeLength, 10), ropeMaterial);
      rope.position.y = 0.78 + ropeLength / 2;
      rope.castShadow = true;
      pot.add(rope);

      pots.set(id, pot);
      scene.add(pot);
    });

    const launchOrigin = new THREE.Vector3(0, 0.6, 6);
    const launcher = new THREE.Mesh(
      new THREE.SphereGeometry(0.46, 20, 14),
      new THREE.MeshStandardMaterial({ color: 0xfff0a6, roughness: 0.65 }),
    );
    launcher.position.copy(launchOrigin);
    launcher.castShadow = true;
    scene.add(launcher);

    const trajectoryMaterial = new THREE.LineDashedMaterial({
      color: 0xffdf75,
      dashSize: 0.28,
      gapSize: 0.18,
      transparent: true,
      opacity: 0.9,
    });
    const trajectory = new THREE.Line(new THREE.BufferGeometry(), trajectoryMaterial);
    scene.add(trajectory);

    const raycaster = new THREE.Raycaster();
    const aimPoint = new THREE.Vector3(0, 4, -4);
    let projectile: Projectile | null = null;
    const fragments: Fragment[] = [];
    let charging = false;
    let chargeStartedAt = 0;
    let charge = 0.25;
    let throwCount = 0;
    let brokenCount = 0;
    let lastFrame = performance.now();
    let animationFrame = 0;

    const flightTime = () => 2.75 - charge * 2.2;

    const getVelocity = () => {
      const time = flightTime();
      return new THREE.Vector3(
        (aimPoint.x - launchOrigin.x) / time,
        (aimPoint.y - launchOrigin.y - 0.5 * GRAVITY * time * time) / time,
        (aimPoint.z - launchOrigin.z) / time,
      );
    };

    const updateTrajectory = () => {
      const velocity = getVelocity();
      const points: THREE.Vector3[] = [];
      const duration = flightTime();
      for (let i = 0; i <= 24; i += 1) {
        const time = (duration * i) / 24;
        points.push(new THREE.Vector3(
          launchOrigin.x + velocity.x * time,
          launchOrigin.y + velocity.y * time + 0.5 * GRAVITY * time * time,
          launchOrigin.z + velocity.z * time,
        ));
      }
      trajectory.geometry.dispose();
      trajectory.geometry = new THREE.BufferGeometry().setFromPoints(points);
      trajectory.computeLineDistances();
    };

    const updateAim = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const [intersection] = raycaster.intersectObjects(
        [...aimablePotParts, ...aimSurfaces],
        false,
      );
      if (intersection) {
        aimPoint.copy(intersection.point);
        updateTrajectory();
      }
    };

    const launch = () => {
      if (projectile || phaseRef.current !== "playing" || throwCount >= MAX_THROWS) return;
      throwCount += 1;
      setThrows(throwCount);
      const ball = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 18, 12),
        new THREE.MeshStandardMaterial({ color: 0xffefad, roughness: 0.55 }),
      );
      ball.position.copy(launchOrigin);
      ball.castShadow = true;
      scene.add(ball);
      projectile = { mesh: ball, velocity: getVelocity(), age: 0 };
      trajectory.visible = false;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (projectile || phaseRef.current !== "playing") return;
      updateAim(event);
      charging = true;
      chargeStartedAt = performance.now();
      renderer.domElement.setPointerCapture(event.pointerId);
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!charging) return;
      charging = false;
      renderer.domElement.releasePointerCapture(event.pointerId);
      launch();
    };

    const removeProjectile = () => {
      if (!projectile) return;
      scene.remove(projectile.mesh);
      projectile.mesh.geometry.dispose();
      (projectile.mesh.material as THREE.Material).dispose();
      projectile = null;
      trajectory.visible = phaseRef.current === "playing";
      if (throwCount >= MAX_THROWS && brokenCount < POT_COUNT) finish(false);
    };

    const breakPot = (id: number) => {
      const pot = pots.get(id);
      if (!pot) return;
      pots.delete(id);
      (pot.userData.aimParts as THREE.Object3D[]).forEach((part) => aimablePotParts.delete(part));
      scene.remove(pot);
      brokenCount += 1;
      setBroken(brokenCount);

      for (let i = 0; i < 12; i += 1) {
        const piece = new THREE.Mesh(
          new THREE.TetrahedronGeometry(0.13 + Math.random() * 0.1),
          new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? 0xf59e0b : 0xb5522e }),
        );
        piece.position.copy(pot.position);
        scene.add(piece);
        fragments.push({
          mesh: piece,
          velocity: new THREE.Vector3(
            (Math.random() - 0.5) * 5,
            Math.random() * 4 + 1,
            (Math.random() - 0.5) * 4,
          ),
          age: 0,
        });
      }

      removeProjectile();
      if (brokenCount === POT_COUNT) finish(true);
    };

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();
    updateTrajectory();

    renderer.domElement.addEventListener("pointermove", updateAim);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const animate = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;

      for (const pot of pots.values()) {
        pot.position.x = pot.userData.baseX
          + Math.sin(now * pot.userData.swingSpeed + pot.userData.swingPhase) * pot.userData.swingAmount;
      }

      if (charging) {
        charge = Math.min(1, 0.25 + (now - chargeStartedAt) / 1100);
        if (powerRef.current) powerRef.current.style.transform = `scaleX(${charge})`;
        updateTrajectory();
      } else if (!projectile) {
        charge = 0.25;
        if (powerRef.current) powerRef.current.style.transform = "scaleX(0.25)";
      }

      if (projectile && phaseRef.current === "playing") {
        projectile.age += delta;
        projectile.velocity.y += GRAVITY * delta;
        projectile.mesh.position.addScaledVector(projectile.velocity, delta);
        projectile.mesh.rotation.x += delta * 8;

        for (const [id, pot] of pots) {
          if (projectile.mesh.position.distanceTo(pot.position) < 1) {
            breakPot(id);
            break;
          }
        }

        if (projectile) {
          const position = projectile.mesh.position;
          const velocity = projectile.velocity;
          const bounce = 0.72;

          if (position.z <= -5.7 && velocity.z < 0) {
            position.z = -5.7;
            velocity.z = Math.abs(velocity.z) * bounce;
          } else if (position.z >= 15.5 && velocity.z > 0) {
            position.z = 15.5;
            velocity.z = -velocity.z * bounce;
          }
          if (position.x <= -7.95 && velocity.x < 0) {
            position.x = -7.95;
            velocity.x = Math.abs(velocity.x) * bounce;
          } else if (position.x >= 7.95 && velocity.x > 0) {
            position.x = 7.95;
            velocity.x = -velocity.x * bounce;
          }
          if (position.y <= -0.27 && velocity.y < 0) {
            position.y = -0.27;
            velocity.y = Math.abs(velocity.y) * bounce;
          } else if (position.y >= 8.9 && velocity.y > 0) {
            position.y = 8.9;
            velocity.y = -velocity.y * bounce;
          }
        }

        if (projectile && projectile.age > 4.5) {
          removeProjectile();
        }
      }

      for (let i = fragments.length - 1; i >= 0; i -= 1) {
        const fragment = fragments[i];
        fragment.age += delta;
        fragment.velocity.y += GRAVITY * delta;
        fragment.mesh.position.addScaledVector(fragment.velocity, delta);
        fragment.mesh.rotation.x += delta * 6;
        fragment.mesh.rotation.z += delta * 4;
        if (fragment.age > 1.2) {
          scene.remove(fragment.mesh);
          fragment.mesh.geometry.dispose();
          (fragment.mesh.material as THREE.Material).dispose();
          fragments.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointermove", updateAim);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) return;
        object.geometry.dispose();
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        materials.forEach((material) => material.dispose());
      });
      textures.forEach((texture) => texture.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [finish, session]);

  const restart = () => {
    phaseRef.current = "playing";
    setPhase("playing");
    setBroken(0);
    setThrows(0);
    setWon(false);
    setCountdown(AUTO_RESET_SECONDS);
    setSession((current) => current + 1);
  };

  const score = broken * 100 + (won ? (MAX_THROWS - throws) * 25 : 0);

  return (
    <div className="relative h-full w-full overflow-hidden bg-game-bg text-game-text">
      <div className="absolute inset-x-0 top-0 z-20">
        <Timer
          key={session}
          durationMs={GAME_DURATION_MS}
          onExpire={() => finish(false)}
          paused={phase !== "playing"}
          variant="edge"
        />
      </div>

      <header className="pointer-events-none absolute inset-x-0 top-5 z-10 text-center">
        <h1 className="text-5xl font-extrabold text-game-accent">Butter Pot Launcher</h1>
        <p className="mt-1 text-xl text-slate-300">Aim anywhere. Hold longer for a much faster throw!</p>
      </header>

      <main className="absolute inset-0 overflow-hidden bg-slate-900">
        <div ref={mountRef} className="absolute inset-0" />

        <div className="pointer-events-none absolute left-6 top-20 rounded-2xl border border-amber-400/30 bg-slate-950/75 px-5 py-3 text-2xl font-bold shadow-xl">
          Pots {broken}/{POT_COUNT} · Throws {MAX_THROWS - throws}
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 w-72 -translate-x-1/2 rounded-2xl border border-amber-400/30 bg-slate-950/75 px-5 py-3">
          <div className="mb-2 text-center text-lg font-bold text-amber-100">Throw power</div>
          <div className="h-4 overflow-hidden rounded-full bg-slate-700">
            <div
              ref={powerRef}
              className="h-full origin-left rounded-full bg-gradient-to-r from-amber-300 to-orange-500"
              style={{ transform: "scaleX(0.25)" }}
            />
          </div>
        </div>

        {phase === "frozen" && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-slate-950/20">
            <h2 className={`rounded-3xl border-4 px-10 py-6 text-6xl font-extrabold shadow-2xl backdrop-blur-sm ${
              won
                ? "border-game-correct bg-emerald-950/80 text-game-correct-soft"
                : "border-amber-500 bg-slate-950/80 text-game-accent"
            }`}>
              {won ? "All Pots Broken!" : "Game Over!"}
            </h2>
          </div>
        )}
      </main>

      {phase === "results" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-7 bg-game-bg p-8 text-center">
          <h2 className="text-6xl font-extrabold text-game-accent">{won ? "Wonderful Throwing!" : "Nice Try!"}</h2>
          <div className="text-3xl text-slate-300">Score</div>
          <div className="text-8xl font-bold text-game-correct-soft">{score}</div>
          <button
            onClick={restart}
            tabIndex={-1}
            className="rounded-2xl bg-game-accent px-9 py-4 text-2xl font-extrabold text-slate-950 shadow-xl hover:brightness-110"
          >
            Play Again
          </button>
          <div className="text-xl text-slate-500">Next player in {countdown}...</div>
        </div>
      )}
    </div>
  );
}
