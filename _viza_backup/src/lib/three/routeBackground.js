import * as THREE from "three";
import airports from "../../data/airports-min.json";

/* WebGL check */
export function isWebGLAvailable() {
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

/**
 * Route-arc background that AUTO-FITS the selected route to the viewport.
 * API: { setRoute(from,to), setSpeed(v), setFitSpan(v), pause(), resume(), destroy() }
 */
export function createHeroRouteBackground(container, opts = {}) {
  const {
    bgColor = 0x0a3b63,
    arcColor = 0xd06549,    // brand accent
    arcThickness = 0.035,   // visible but tasteful
    arcHeight = 0.6,        // relative lift (multiplied by endpoint separation)
    speed = 0.45,
    fitSpan = 1.2,          // desired endpoint separation AFTER zoom (0.9–1.4 good)
    maxScale = 6            // clamp zoom for very short routes
  } = opts;

  const prefersReduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduce) return { destroy() {} };

  // ------------ Renderer / Camera / Scene ------------
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(dpr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(bgColor, 1);
  Object.assign(renderer.domElement.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none"
  });
  container.appendChild(renderer.domElement);

  // Put camera in front so nothing clips at z=0
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const scene = new THREE.Scene();

  // ------------ Vignette (under the route) ------------
  const vigUniforms = {
    uStrength: { value: 0.28 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  };
  const vignette = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: vigUniforms,
      vertexShader: `void main(){ gl_Position = vec4(position,1.0); }`,
      fragmentShader: `
        uniform float uStrength; uniform vec2 uResolution;
        void main(){
          vec2 uv = gl_FragCoord.xy / uResolution;
          vec2 c = uv - 0.5;
          float r = length(c)*1.4;
          float v = smoothstep(1.0, 0.35, r);
          gl_FragColor = vec4(0.0,0.0,0.0,(1.0 - v) * uStrength);
        }
      `
    })
  );
  vignette.renderOrder = 10;
  scene.add(vignette);

  // ------------ Route group (scaled & positioned to fit) ------------
  const routeGroup = new THREE.Group();
  routeGroup.renderOrder = 1000;
  scene.add(routeGroup);

  let currentCurve = null;
  let plane = null;
  let t = 0;
  let running = true;
  let currentSpeed = speed;
  let desiredFitSpan = fitSpan;

  // Fallback airports if dataset isn’t loaded
  const fallbackAirports = {
    DEL: [77.099, 28.556],
    DXB: [55.365, 25.253],
    BOM: [72.865, 19.089],
    BLR: [77.706, 13.198],
    SIN: [103.991, 1.364]
  };
  const AIRPORTS =
    airports && Object.keys(airports || {}).length ? airports : fallbackAirports;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

  function lonLatToNDC(lon, lat) {
    // Equirectangular mapping → NDC-ish; we’ll auto-zoom later.
    const x = clamp((lon / 180) * 0.9, -0.98, 0.98);
    const y = clamp((lat / 90) * 0.6, -0.9, 0.9);
    return new THREE.Vector3(x, y, 0);
  }
  function getIATA(iata) {
    if (!iata) return null;
    return AIRPORTS[iata.toUpperCase().trim()] || null;
  }

  function clearRoute() {
    for (let i = routeGroup.children.length - 1; i >= 0; i--) {
      const obj = routeGroup.children[i];
      routeGroup.remove(obj);
      obj.geometry?.dispose?.();
      obj.material?.dispose?.();
    }
    currentCurve = null;
    plane = null;
  }

  function createPlaneMarker() {
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false });
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 14), mat);
    cone.rotation.z = -Math.PI / 2; cone.renderOrder = 1003;
    const wing = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.01, 0.01), mat);
    wing.position.y = -0.008; wing.renderOrder = 1003;
    const g = new THREE.Group(); g.add(cone); g.add(wing); return g;
  }

  function buildRouteMeshes(curve) {
    // Core arc
    const core = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 240, arcThickness, 12, false),
      new THREE.MeshBasicMaterial({ color: arcColor, transparent: true, opacity: 1.0, depthTest: false, depthWrite: false })
    );
    core.renderOrder = 1002; routeGroup.add(core);

    // Glow
    const glow = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 240, arcThickness * 2.8, 12, false),
      new THREE.MeshBasicMaterial({ color: arcColor, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false })
    );
    glow.renderOrder = 1001; routeGroup.add(glow);

    // Plane
    plane = createPlaneMarker(); routeGroup.add(plane);
  }

  // Sample curve to compute bounds (so we can scale-to-fit safely)
  function sampleBounds(curve, samples = 64) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i <= samples; i++) {
      const p = curve.getPoint(i / samples);
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    }
    return { minX, maxX, minY, maxY, spanX: maxX - minX, spanY: maxY - minY };
  }

  function setRoute(fromIATA, toIATA) {
    const A = getIATA(fromIATA), B = getIATA(toIATA);
    if (!A || !B) { console.warn("[route-bg] Unknown IATA:", fromIATA, toIATA); return false; }

    // Raw endpoints in NDC-ish space
    const p0raw = lonLatToNDC(A[0], A[1]);
    const p1raw = lonLatToNDC(B[0], B[1]);

    // Center them around origin so we can scale the group
    const mid = p0raw.clone().add(p1raw).multiplyScalar(0.5);
    const p0 = p0raw.clone().sub(mid);
    const p1 = p1raw.clone().sub(mid);

    // Separation in local space (before scaling)
    const separation = p0.distanceTo(p1) || 0.001;

    // Build curve in local space with relative lift
    const midLocal = p0.clone().add(p1).multiplyScalar(0.5);
    const dir = p1.clone().sub(p0).normalize();
    const perp = new THREE.Vector3(-dir.y, dir.x, 0);     // 90° to the segment
    const control = midLocal.clone().add(perp.multiplyScalar(arcHeight * separation));
    const curve = new THREE.QuadraticBezierCurve3(p0, control, p1);

    // Create meshes
    clearRoute();
    buildRouteMeshes(curve);
    currentCurve = curve;

    // Position group back at geographic midpoint
    routeGroup.position.copy(mid);

    // --- SCALE-TO-FIT ---
    // 1) Desired span along the endpoints (how “big” the route should be)
    const desired = desiredFitSpan; // e.g., 1.2 in NDC units
    let scale = clamp(desired / separation, 1, maxScale);

    // 2) Ensure scaled curve stays inside [-0.95, 0.95] both axes
    const b = sampleBounds(curve, 80); // bounds in local space
    const maxAbs = Math.max(Math.abs(b.minX), Math.abs(b.maxX), Math.abs(b.minY), Math.abs(b.maxY));
    if (maxAbs > 0) {
      const boundScale = 0.95 / maxAbs; // keep some margin
      scale = Math.min(scale, boundScale);
    }

    routeGroup.scale.set(scale, scale, 1);

    // Start anim from 0
    t = 0;
    return true;
  }

  function setFitSpan(v) {
    const val = Number(v);
    if (!Number.isFinite(val) || val <= 0) return;
    desiredFitSpan = val;
  }

  function setSpeed(v) { currentSpeed = Math.max(0, Number(v) || 0); }
  function pause() { running = false; }
  function resume() { running = true; }

  // Global event + debug handle
  const onGlobalRoute = (e) => {
    const det = e?.detail || {};
    if (det.from && det.to) setRoute(det.from, det.to);
  };
  window.addEventListener("hv:set-route", onGlobalRoute);

  const api = { setRoute, setSpeed, setFitSpan, pause, resume, destroy };
  window.__hvRouteBg = api; // debug helper

  // Default visible demo
  setRoute("DEL", "DXB");

  // ------------ Resize & pointer ------------
  function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    vigUniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  }
  window.addEventListener("resize", resize, { passive: true });

  const targetOffset = new THREE.Vector2(0, 0);
  function onPointerMove(e) {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    targetOffset.set(nx * 0.02, ny * 0.02);
  }
  document.addEventListener("pointermove", onPointerMove, { passive: true });

  // ------------ RAF loop ------------
  let rafId = 0, last = performance.now();
  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (running && currentCurve && plane) {
      t = (t + dt * currentSpeed) % 1;
      const pos = currentCurve.getPointAt(t);
      const tan = currentCurve.getTangentAt(t);
      plane.position.copy(pos);
      plane.rotation.z = Math.atan2(tan.y, tan.x);

      // subtle parallax
      routeGroup.position.lerp(
        routeGroup.position.clone().add(new THREE.Vector3(targetOffset.x, targetOffset.y, 0)),
        0.08
      );
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  // ------------ Cleanup ------------
  function destroy() {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    document.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("hv:set-route", onGlobalRoute);
    clearRoute();
    vignette.geometry?.dispose?.();
    vignette.material?.dispose?.();
    renderer.dispose();
    renderer.domElement?.parentNode?.removeChild(renderer.domElement);
  }

  return api;
}
