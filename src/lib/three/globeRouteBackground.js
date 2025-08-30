import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import airports from "../../data/airports-min.json";

/* WebGL check */
export function isWebGLAvailable() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    return !!(window.WebGLRenderingContext && gl);
  } catch { return false; }
}

/**
 * 3D Globe with great-circle flight path and GLB aircraft.
 * API: { setRoute(from,to), setSpeed(v), pause(), resume(), destroy() }
 */
export function createHeroRouteBackground(container, opts = {}) {
  const {
    bgColor = 0x0a3b63,
    globeRadius = 1.0,
    speed = 0.35,
    dprCap = 1.75,
    autoCenter = true,
    arcColor = 0xd06549,
    arcRadius = 0.008,
    glowOpacity = 0.4,
    // asset paths
    texDay = "/assets/earth/earth_day_8k.jpg",
    texNight = "/assets/earth/earth_night_3600.jpg",   // smaller is fine for emissive
    texNormal = "/assets/earth/earth_normal_8k.png",
    texSpec = "/assets/earth/earth_spec_8k.png",
    texClouds = "/assets/earth/earth_clouds_8k.png",
    planeModel = "/assets/models/plane.glb"
  } = opts;

  const prefersReduce = typeof window !== "undefined"
    && window.matchMedia
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return { destroy() {} };

  // ---------- Renderer / Camera ----------
  const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(bgColor, 1);
  Object.assign(renderer.domElement.style, { position: "absolute", inset: "0", width: "100%", height: "100%", pointerEvents: "none" });
  container.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(0, 0, 3.2);

  const scene = new THREE.Scene();

  // ---------- Lights ----------
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(2, 1, 2);
  scene.add(dir);

  // ---------- World group ----------
  const world = new THREE.Group();
  scene.add(world);

  // ---------- Earth material (Phong supports specular+emissive maps) ----------
  const loader = new THREE.TextureLoader();

  const dayMap = loader.load(texDay, (t) => { t.colorSpace = THREE.SRGBColorSpace; });
  const nightMap = loader.load(texNight, (t) => { t.colorSpace = THREE.SRGBColorSpace; });
  const normalMap = loader.load(texNormal);
  const specMap = loader.load(texSpec);
  const cloudsMap = loader.load(texClouds, (t) => { t.colorSpace = THREE.SRGBColorSpace; });

  const earthMat = new THREE.MeshPhongMaterial({
    map: dayMap,
    normalMap: normalMap,
    specularMap: specMap,
    specular: new THREE.Color(0x888888),
    shininess: 20,
    emissive: new THREE.Color(0xffffff),
    emissiveMap: nightMap,
    emissiveIntensity: 0.35
  });

  const earth = new THREE.Mesh(new THREE.SphereGeometry(globeRadius, 96, 96), earthMat);
  world.add(earth);

  // Clouds layer
  const clouds = new THREE.Mesh(
    new THREE.SphereGeometry(globeRadius * 1.01, 96, 96),
    new THREE.MeshLambertMaterial({
      map: cloudsMap,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    })
  );
  clouds.name = "clouds";
  world.add(clouds);

  // Subtle atmosphere sprite
  const glowTex = new THREE.TextureLoader().load(
    "data:image/svg+xml;utf8,\
    <svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'>\
      <radialGradient id='g' cx='50%' cy='50%'>\
        <stop offset='0%' stop-color='white' stop-opacity='0.9'/>\
        <stop offset='100%' stop-color='white' stop-opacity='0'/>\
      </radialGradient>\
      <circle cx='32' cy='32' r='32' fill='url(#g)'/>\
    </svg>"
  );
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x87cefa, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
  glow.scale.set(globeRadius * 2.6, globeRadius * 2.6, 1);
  world.add(glow);

  // ---------- Route state ----------
  const routeGroup = new THREE.Group();
  world.add(routeGroup);

  let pathPoints = [];  // precomputed GC points above surface
  let plane = null;     // GLB or fallback primitive
  let t = 0;
  let running = true;
  let currentSpeed = speed;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const fallback = { DEL:[77.099,28.556], DXB:[55.365,25.253], BOM:[72.865,19.089], BLR:[77.706,13.198], SIN:[103.991,1.364] };
  const AIR = (airports && Object.keys(airports).length) ? airports : fallback;

  function latLonToVec3(lat, lon, r = globeRadius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    const x = -r * Math.sin(phi) * Math.cos(theta);
    const z =  r * Math.sin(phi) * Math.sin(theta);
    const y =  r * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  function slerpVec3(a, b, tt) {
    const v0 = a.clone().normalize();
    const v1 = b.clone().normalize();
    const dot = clamp(v0.dot(v1), -1, 1);
    const omega = Math.acos(dot);
    if (omega < 1e-6) return v0.clone();
    const sinOmega = Math.sin(omega);
    const s0 = Math.sin((1 - tt) * omega) / sinOmega;
    const s1 = Math.sin(tt * omega) / sinOmega;
    return v0.multiplyScalar(s0).add(v1.multiplyScalar(s1));
  }

  function clearRoute() {
    for (let i = routeGroup.children.length - 1; i >= 0; i--) {
      const obj = routeGroup.children[i];
      routeGroup.remove(obj);
      obj.geometry?.dispose?.();
      obj.material?.dispose?.();
    }
    pathPoints = [];
    t = 0;
  }

  function buildRoute(pA3, pB3) {
    // Sample great-circle and lift it ~12% at mid
    const raw = [];
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const tt = i / steps;
      const onSphere = slerpVec3(pA3, pB3, tt).normalize();
      const lift = 1 + Math.sin(Math.PI * tt) * 0.12;
      raw.push(onSphere.multiplyScalar(globeRadius * lift));
    }

    // Tube mesh along the path
    const curve = new THREE.CatmullRomCurve3(raw, false, "centripetal", 0.8);
    const core = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 480, arcRadius, 16, false),
      new THREE.MeshBasicMaterial({ color: arcColor, transparent: true, opacity: 1.0 })
    );
    const glowM = new THREE.MeshBasicMaterial({ color: arcColor, transparent: true, opacity: glowOpacity, blending: THREE.AdditiveBlending });
    const glow = new THREE.Mesh(new THREE.TubeGeometry(curve, 480, arcRadius * 2.4, 16, false), glowM);

    routeGroup.add(glow, core);
    pathPoints = raw;
  }

  // Plane: try GLB, fallback to primitive
  function createFallbackPlane() {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 16), mat);
    cone.rotation.z = -Math.PI / 2;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.01, 0.01), mat);
    wing.position.y = -0.008;
    const g = new THREE.Group(); g.add(cone); g.add(wing); return g;
  }
  function loadPlane() {
    return new Promise((resolve) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        planeModel,
        (gltf) => {
          const model = gltf.scene || gltf.scenes?.[0];
          if (!model) return resolve(createFallbackPlane());
          // Normalize orientation if needed (expect +X forward, +Y up)
          model.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = false;
              o.receiveShadow = false;
              if (o.material && o.material.map) o.material.map.colorSpace = THREE.SRGBColorSpace;
            }
          });
          model.scale.setScalar(0.25);   // adjust if too big/small
          // If your model exports with +Z forward, rotate to +X:
          model.rotation.y = -Math.PI / 2;
          resolve(model);
        },
        undefined,
        () => resolve(createFallbackPlane())
      );
    });
  }

  const targetQuat = new THREE.Quaternion();

  function rotateWorldToFace(targetVec) {
    const front = new THREE.Vector3(0, 0, 1);
    const from = targetVec.clone().normalize();
    targetQuat.copy(new THREE.Quaternion().setFromUnitVectors(from, front));
  }

  function getIATA(i) {
    if (!i) return null;
    return AIR[i.toUpperCase().trim()] || null;
  }

  async function setRoute(fromIATA, toIATA) {
    const a = getIATA(fromIATA), b = getIATA(toIATA);
    if (!a || !b) { console.warn("[globe-bg] Unknown IATA:", fromIATA, toIATA); return false; }

    const pA = latLonToVec3(a[1], a[0], globeRadius);
    const pB = latLonToVec3(b[1], b[0], globeRadius);

    clearRoute();
    buildRoute(pA, pB);

    if (!plane) {
      plane = await loadPlane();
      routeGroup.add(plane);
    }

    t = 0;
    if (autoCenter) {
      const mid = slerpVec3(pA, pB, 0.5);
      rotateWorldToFace(mid);
    }
    return true;
  }

  function setSpeed(v) { currentSpeed = Math.max(0, Number(v) || 0); }
  function pause() { running = false; }
  function resume() { running = true; }

  // ---------- Resize ----------
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize, { passive: true });

  // ---------- Events + debug ----------
  const onGlobalRoute = (e) => {
    const det = e?.detail || {};
    if (det.from && det.to) setRoute(det.from, det.to);
  };
  window.addEventListener("hv:set-route", onGlobalRoute);

  const api = { setRoute, setSpeed, pause, resume, destroy };
  window.__hvRouteBg = api;

  // Default demo
  setRoute("DEL", "DXB");

  // ---------- RAF ----------
  let rafId = 0, last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;

    // Subtle idle rotation + ease towards target
    world.quaternion.slerp(targetQuat, 0.08);
    world.rotation.y += 0.005 * dt;

    if (running && plane && pathPoints.length > 1) {
      t = (t + dt * currentSpeed) % 1;
      const N = pathPoints.length - 1;
      const f = t * N;
      const i0 = Math.floor(f);
      const i1 = Math.min(i0 + 1, N);
      const alpha = f - i0;

      const p0 = pathPoints[i0];
      const p1 = pathPoints[i1];
      if (p0 && p1) {
        // position
        plane.position.set(
          p0.x + (p1.x - p0.x) * alpha,
          p0.y + (p1.y - p0.y) * alpha,
          p0.z + (p1.z - p0.z) * alpha
        );
        // orientation
        const tan = new THREE.Vector3(p1.x - p0.x, p1.y - p0.y, p1.z - p0.z).normalize();
        const up = plane.position.clone().normalize();
        const right = new THREE.Vector3().crossVectors(up, tan).normalize();
        const look = new THREE.Matrix4().makeBasis(right, up, tan);
        plane.quaternion.setFromRotationMatrix(look);
      }
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function destroy() {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    window.removeEventListener("hv:set-route", onGlobalRoute);
    // cleanup
    for (const obj of [earth, clouds]) { obj.geometry?.dispose?.(); obj.material?.dispose?.(); }
    for (let i = routeGroup.children.length - 1; i >= 0; i--) {
      const obj = routeGroup.children[i];
      obj.geometry?.dispose?.(); obj.material?.dispose?.();
      routeGroup.remove(obj);
    }
    renderer.dispose();
    renderer.domElement?.parentNode?.removeChild(renderer.domElement);
  }

  return api;
}
