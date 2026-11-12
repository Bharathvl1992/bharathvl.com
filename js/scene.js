import * as THREE from "three";

// A quiet globe: coastlines, the three cities of the career so far, and
// parcels moving along the routes between them: supply chain in one picture.
// `state` is tweened from main.js by scroll: { x, y, scale, lon, dim }
const CITIES = [
  { name: "Bengaluru", note: "Home · Manhattan Associates", lat: 12.97, lon: 77.59 },
  { name: "San Francisco", note: "MS Business Analytics", lat: 37.77, lon: -122.42 },
  { name: "Newark, DE", note: "Bank of America fraud platforms", lat: 39.68, lon: -75.75 },
];
const LAND_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json";
const TOPOJSON_URL = "https://cdn.jsdelivr.net/npm/topojson-client@3.1.0/+esm";

const toVec = (lat, lon, r = 1) => {
  const phi = THREE.MathUtils.degToRad(90 - lat), theta = THREE.MathUtils.degToRad(lon + 180);
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
};
// rotation.y that turns a given longitude toward the camera
const faceLon = (deg) => -THREE.MathUtils.degToRad(deg + 90);

export function createScene(canvas, state, { reducedMotion = false, labelsEl = null } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  const narrow = () => window.innerWidth < 900;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const rig = new THREE.Group();   // position + scale
  const globe = new THREE.Group(); // rotation
  rig.add(globe);
  scene.add(rig);

  const viewShader = `
    varying vec3 vN; varying vec3 vV;
    void main() {
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`;

  // matte dark sphere with a soft lit edge
  globe.add(new THREE.Mesh(
    new THREE.SphereGeometry(1, 96, 96),
    new THREE.ShaderMaterial({
      vertexShader: viewShader,
      fragmentShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          float f = pow(1.0 - max(dot(vN, vV), 0.0), 2.6);
          gl_FragColor = vec4(mix(vec3(0.035, 0.045, 0.07), vec3(0.30, 0.42, 0.58), f * 0.6), 1.0);
        }`,
    })
  ));
  // thin atmosphere
  rig.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.15, 64, 64),
    new THREE.ShaderMaterial({
      vertexShader: viewShader,
      fragmentShader: `
        varying vec3 vN; varying vec3 vV;
        void main() {
          float facing = clamp(dot(-vN, vV) / 0.5, 0.0, 1.0);
          gl_FragColor = vec4(vec3(0.38, 0.55, 0.78), pow(facing, 2.4) * 0.3);
        }`,
      side: THREE.BackSide, transparent: true, depthWrite: false,
    })
  ));

  // graticule
  const grat = [];
  for (let lon = -180; lon < 180; lon += 30) for (let lat = -90; lat < 90; lat += 3) grat.push(toVec(lat, lon, 1.001), toVec(lat + 3, lon, 1.001));
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 3) grat.push(toVec(lat, lon, 1.001), toVec(lat, lon + 3, 1.001));
  globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(grat), new THREE.LineBasicMaterial({ color: 0x8fa8c8, transparent: true, opacity: 0.07 })));

  // coastlines (loaded lazily; the globe is fine without them)
  const coastMat = new THREE.LineBasicMaterial({ color: 0xa9bdd8, transparent: true, opacity: 0 });
  Promise.all([fetch(LAND_URL).then((r) => r.json()), import(TOPOJSON_URL)])
    .then(([topo, { feature }]) => {
      const pts = [];
      const geom = feature(topo, topo.objects.land);
      const polys = (geom.features ?? [geom]).flatMap((f) => (f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates));
      polys.forEach((poly) => poly.forEach((ring) => {
        for (let i = 0; i < ring.length - 1; i++) pts.push(toVec(ring[i][1], ring[i][0], 1.002), toVec(ring[i + 1][1], ring[i + 1][0], 1.002));
      }));
      globe.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), coastMat));
      coastMat.userData.target = 0.5;
    })
    .catch((e) => console.warn("Coastlines unavailable:", e));

  // cities
  const amber = 0xf2b46b;
  const pins = CITIES.map((c) => {
    const p = toVec(c.lat, c.lon, 1.004);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.013, 16, 16), new THREE.MeshBasicMaterial({ color: amber }));
    dot.position.copy(p);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.03, 0.034, 48), new THREE.MeshBasicMaterial({ color: amber, transparent: true, side: THREE.DoubleSide, depthWrite: false }));
    ring.position.copy(p);
    ring.lookAt(p.clone().multiplyScalar(2));
    globe.add(dot, ring);
    let el = null;
    if (labelsEl) {
      el = document.createElement("div");
      el.className = "geo";
      el.innerHTML = `<b></b><span></span>`;
      el.firstChild.textContent = c.name;
      el.lastChild.textContent = c.note;
      labelsEl.appendChild(el);
    }
    return { p, ring, el };
  });

  // routes + parcels
  const routes = [[0, 1], [1, 2], [2, 0]].map(([a, b], k) => {
    const A = toVec(CITIES[a].lat, CITIES[a].lon), B = toVec(CITIES[b].lat, CITIES[b].lon);
    const angle = A.angleTo(B), lift = 0.06 + angle * 0.09;
    const at = (t) => {
      const s = Math.sin(angle);
      return A.clone().multiplyScalar(Math.sin((1 - t) * angle) / s).add(B.clone().multiplyScalar(Math.sin(t * angle) / s))
        .multiplyScalar(1.004 + lift * Math.sin(Math.PI * t));
    };
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(Array.from({ length: 97 }, (_, i) => at(i / 96))),
      new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0.32 })
    );
    const parcels = [0, 0.5].map((offset) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.011, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffe2b8 }));
      globe.add(m);
      return { m, offset };
    });
    globe.add(line);
    return { at, parcels, speed: 0.07 / Math.max(angle, 0.4), phase: k * 0.31 };
  });

  // a few far-off stars, barely there
  const N = 500, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 50; pos[i * 3 + 1] = (Math.random() - 0.5) * 30; pos[i * 3 + 2] = -10 - Math.random() * 30; }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xbcd0ea, size: 0.05, transparent: true, opacity: 0.35, depthWrite: false })));

  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 48 : 35;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });

  const clock = new THREE.Clock();
  const speed = reducedMotion ? 0 : 1;
  const world = new THREE.Vector3(), centre = new THREE.Vector3(), toCam = new THREE.Vector3();
  let t = 0;

  function frame() {
    t += Math.min(clock.getDelta(), 0.05) * speed;
    mouse.x += (mouse.tx - mouse.x) * 0.04;
    mouse.y += (mouse.ty - mouse.y) * 0.04;

    const small = narrow();
    // pull the globe toward the centre on narrower windows so it never slides off-screen
    rig.position.set(small ? 0 : state.x * Math.min(1, camera.aspect / 1.75), state.y + (small ? 0.4 : 0), 0);
    rig.scale.setScalar(state.scale * (small ? 0.7 : 1));
    globe.rotation.y = faceLon(state.lon) + Math.sin(t * 0.12) * 0.1 + mouse.x * 0.12;
    globe.rotation.x = 0.32 + mouse.y * 0.06;

    if (coastMat.userData.target) coastMat.opacity += (coastMat.userData.target - coastMat.opacity) * 0.03;
    routes.forEach((r) => r.parcels.forEach((p) => p.m.position.copy(r.at((t * r.speed + r.phase + p.offset) % 1))));

    const dim = small ? Math.min(state.dim, 0.5) : state.dim;
    rig.updateMatrixWorld();
    rig.getWorldPosition(centre);
    pins.forEach((pin, i) => {
      const k = (t * 0.35 + i * 0.33) % 1;
      pin.ring.scale.setScalar(1 + k * 2.2);
      pin.ring.material.opacity = (1 - k) * 0.7;
      if (!pin.el) return;
      world.copy(pin.p).applyMatrix4(globe.matrixWorld);
      const facing = world.clone().sub(centre).normalize().dot(toCam.copy(camera.position).sub(world).normalize());
      world.project(camera);
      pin.el.style.transform = `translate(${((world.x + 1) / 2) * window.innerWidth}px, ${((1 - world.y) / 2) * window.innerHeight}px)`;
      pin.el.style.opacity = facing > 0.15 && dim > 0.6 ? 1 : 0;
    });

    canvas.style.opacity = dim.toFixed(3);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
