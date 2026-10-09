/* ================= SETTINGS ================= */
const ZOOM_LINK   = 'https://us05web.zoom.us/j/6041856500?pwd=SHq0hE2YUauhcYEdfdayQGfYxwd3qQ.1';   // your Zoom link
const SUPABASE_URL = 'https://mzhcamnkpwmnfvxnhwwj.supabase.co';                  // Project URL
const SUPABASE_KEY = 'sb_publishable_1fCRe0Q_-5PfqkGrfhNOqQ_5Hws0sRM';             // anon public key
document.getElementById('joinBtn').href = ZOOM_LINK;

/* ================= 3D BACKGROUND ================= */
const cv = document.getElementById('bg');
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
R.setPixelRatio(Math.min(devicePixelRatio, 2));
const S = new THREE.Scene();
S.fog = new THREE.FogExp2(0x02030a, 0.03);
const C = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
C.position.z = 9;

// glow sprite
function glowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d'), gr = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(120,150,255,.95)'); gr.addColorStop(.35, 'rgba(60,80,255,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}
const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }));
glow.scale.set(9, 9, 1); S.add(glow);

// core orb
const core = new THREE.Group(); S.add(core);
core.add(new THREE.Mesh(new THREE.SphereGeometry(1.6, 64, 64), new THREE.MeshBasicMaterial({ color: 0x0c1c8a, transparent: true, opacity: .4 })));
const wire = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 2), new THREE.MeshBasicMaterial({ color: 0x7894ff, wireframe: true, transparent: true, opacity: .55 }));
core.add(wire);
const rings = [];
for (let i = 0; i < 4; i++) {
  const r = new THREE.Mesh(new THREE.TorusGeometry(2.1 + i * .3, .03, 16, 220),
    new THREE.MeshBasicMaterial({ color: i % 2 ? 0x8a5cff : 0x5a85ff }));
  r.rotation.set(Math.random() * 3, Math.random() * 3, 0);
  r.userData.sp = (Math.random() * .8 + .6) * (i % 2 ? -1 : 1);
  core.add(r); rings.push(r);
}

// floating glass panels orbiting the core
const panels = [], pg = new THREE.PlaneGeometry(1.2, .75), eg = new THREE.EdgesGeometry(pg);
for (let i = 0; i < 30; i++) {
  const m = new THREE.Mesh(pg, new THREE.MeshBasicMaterial({ color: 0x1b2c86, transparent: true, opacity: .3 + Math.random() * .3, side: THREE.DoubleSide }));
  m.add(new THREE.LineSegments(eg, new THREE.LineBasicMaterial({ color: 0x86a2ff })));
  m.userData = { a: i / 30 * Math.PI * 2, rad: 4 + Math.random() * 2, y: (Math.random() - .5) * 6, sp: .5 + Math.random() * .6, ph: Math.random() * 6 };
  S.add(m); panels.push(m);
}

// diamond frames
const dia = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(6)), new THREE.LineBasicMaterial({ color: 0x6070ff, transparent: true, opacity: .45 }));
const dia2 = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.OctahedronGeometry(8)), new THREE.LineBasicMaterial({ color: 0x8a5cff, transparent: true, opacity: .25 }));
S.add(dia, dia2);

// particles
const N = 1200, pp = new Float32Array(N * 3);
for (let i = 0; i < N * 3; i++) pp[i] = (Math.random() - .5) * 45;
const pgeo = new THREE.BufferGeometry(); pgeo.setAttribute('position', new THREE.BufferAttribute(pp, 3));
const pts = new THREE.Points(pgeo, new THREE.PointsMaterial({ size: .05, color: 0xa8b8ff, transparent: true, opacity: .8 }));
S.add(pts);

// crystal shards
const shards = [];
for (let i = 0; i < 40; i++) {
  const m = new THREE.Mesh(new THREE.OctahedronGeometry(.12 + Math.random() * .25), new THREE.MeshBasicMaterial({ color: i % 2 ? 0x6f8cff : 0xa67bff, wireframe: true, transparent: true, opacity: .8 }));
  m.position.set((Math.random() - .5) * 26, (Math.random() - .5) * 16, (Math.random() - .5) * 16 - 4);
  m.userData = { r: Math.random() * .03 + .01, f: Math.random() * 2 + .5, y: m.position.y };
  S.add(m); shards.push(m);
}
// expanding shockwave rings
const waves = [];
for (let i = 0; i < 3; i++) {
  const w = new THREE.Mesh(new THREE.RingGeometry(1.9, 1.96, 128), new THREE.MeshBasicMaterial({ color: 0x7a9cff, transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
  w.userData.p = i / 3; S.add(w); waves.push(w);
}
// neon floor grid
const grid = new THREE.GridHelper(80, 60, 0x5a6cff, 0x2a3590);
grid.position.y = -6; grid.material.transparent = true; grid.material.opacity = .5; S.add(grid);
// warp-speed streaks
const SN = 300, sa = new Float32Array(SN * 6);
for (let i = 0; i < SN; i++) { const x = (Math.random() - .5) * 50, y = (Math.random() - .5) * 30, z = -Math.random() * 40; sa.set([x, y, z, x, y, z - 1.5], i * 6); }
const sgeo = new THREE.BufferGeometry(); sgeo.setAttribute('position', new THREE.BufferAttribute(sa, 3));
S.add(new THREE.LineSegments(sgeo, new THREE.LineBasicMaterial({ color: 0x7f9bff, transparent: true, opacity: .55 })));
let boost = 0;
addEventListener('pointerdown', () => boost = 1);
function resize() { R.setSize(innerWidth, innerHeight); C.aspect = innerWidth / innerHeight; C.updateProjectionMatrix(); }
addEventListener('resize', resize); resize();

let mx = 0, my = 0;
addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
const chatEl = document.getElementById('chat');
const curEl = document.querySelector('.cursor'), heroEl = document.querySelector('.hero');
addEventListener('mousemove', e => {
  curEl.style.left = e.clientX + 'px'; curEl.style.top = e.clientY + 'px';
  heroEl.style.transform = `perspective(900px) rotateY(${mx * 10}deg) rotateX(${my * -8}deg)`;
});
addEventListener('mousemove', () => { chatEl.style.transform = `perspective(900px) rotateY(${mx * -6}deg) rotateX(${my * 6}deg)`; });

const clock = new THREE.Clock();
(function loop() {
  requestAnimationFrame(loop);
  const t = clock.getElapsedTime(), dt = clock.getDelta();
  core.rotation.y = t * .9; core.rotation.x = Math.sin(t * .5) * .3;
  wire.rotation.y = -t * 1.4;
  const s = 1 + Math.sin(t * 3) * .05; core.scale.set(s, s, s);
  glow.material.opacity = .75 + Math.sin(t * 3) * .25;
  rings.forEach(r => { r.rotation.x += .012 * r.userData.sp; r.rotation.y += .018 * r.userData.sp; });
  panels.forEach(m => {
    const u = m.userData; u.a += .006 * u.sp;
    m.position.set(Math.cos(u.a) * u.rad, u.y + Math.sin(t * 2 + u.ph) * .4, Math.sin(u.a) * u.rad);
    m.lookAt(0, m.position.y, 0); m.rotation.z = t * u.sp;
  });
  dia.rotation.y = t * .35; dia.rotation.z = t * .2;
  dia2.rotation.y = -t * .25; dia2.rotation.x = t * .15;
  pts.rotation.y = t * .04;
  C.position.x += (mx * 3 - C.position.x) * .06;
  C.position.y += (-my * 2 - C.position.y) * .06;
  C.lookAt(0, 0, 0);
  boost *= .94;
  core.scale.multiplyScalar(1 + boost * .3);
  shards.forEach(m => { const u = m.userData; m.rotation.x += u.r; m.rotation.y += u.r * 1.5; m.position.y = u.y + Math.sin(t * u.f) * .6; });
  waves.forEach(w => { const u = w.userData; u.p = (u.p + .006 + boost * .02) % 1; const k = 1 + u.p * 6; w.scale.set(k, k, 1); w.material.opacity = (1 - u.p) * .7; w.quaternion.copy(C.quaternion); });
  grid.position.z = (t * 6) % (80 / 60);
  const q = sgeo.attributes.position.array, v = .7 + boost * 3;
  for (let i = 0; i < SN; i++) { const k = i * 6; q[k + 2] += v; q[k + 5] += v; if (q[k + 2] > 10) { q[k + 2] = -40; q[k + 5] = -41.5; } }
  sgeo.attributes.position.needsUpdate = true;
  R.render(S, C);
})();

/* ================= PRIVATE CHAT (SUPABASE) ================= */
const $ = id => document.getElementById(id);
const msgs = $('msgs'), nameI = $('name'), textI = $('text'), status = $('status');
nameI.value = localStorage.getItem('chat_name') || '';
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c == 'x' ? r : (r & 3 | 8)).toString(16); });
let sid = localStorage.getItem('sid'); if (!sid) { sid = uuid(); localStorage.setItem('sid', sid); }

const live = !SUPABASE_URL.startsWith('YOUR');
const db = live ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;
let seen = 0;

function setStatus(t) { status.lastChild.textContent = ' ' + t; }
function addMsg(m) {
  const d = document.createElement('div'); d.className = 'msg' + (m.from_teacher ? ' teacher' : '');
  const b = document.createElement('b'); b.textContent = m.from_teacher ? 'Teacher' : 'You';
  const p = document.createElement('p'); p.textContent = m.content;
  d.append(b, p); msgs.append(d); msgs.scrollTop = msgs.scrollHeight;
}
async function poll() {
  if (!db) return;
  const { data, error } = await db.rpc('student_get', { sid });
  if (error) { console.error(error); return setStatus('error: ' + String(error.message).slice(0, 45)); }
  setStatus('live');
  (data || []).forEach(m => { if (m.id > seen) { seen = m.id; addMsg(m); } });
}
$('form').addEventListener('submit', async e => {
  e.preventDefault();
  const name = nameI.value.trim().slice(0, 20), content = textI.value.trim().slice(0, 300);
  if (!name || !content) return;
  localStorage.setItem('chat_name', name); textI.value = '';
  if (db) { const { error } = await db.rpc('student_send', { sid, sname: name, msg: content }); if (error) { console.error(error); setStatus('error'); alert('Send failed: ' + error.message); } else poll(); }
  else addMsg({ content });
});
if (db) { poll(); setInterval(poll, 2500); }
else { setStatus('demo mode'); addMsg({ from_teacher: true, content: 'Welcome to CHEEMA ACADEMY! Add your Supabase keys in script.js to go live.' }); }
