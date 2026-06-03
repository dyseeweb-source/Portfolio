// main.js — smooth hover / tilt effect for interactive elements
(function(){
  const elSelector = '.proj-row, .service-card, .cc, .add-btn-row';
  const els = Array.from(document.querySelectorAll(elSelector));
  if(!els.length) return;

  const state = new Map();

  els.forEach(el=>{
    state.set(el, {tx:0, ty:0, s:1});
    el.addEventListener('mousemove', (e)=>onMove(e, el));
    el.addEventListener('mouseenter', ()=>{ el.classList.add('is-hover'); state.get(el).s = 1.02; });
    el.addEventListener('mouseleave', ()=>{ el.classList.remove('is-hover'); state.get(el).tx = 0; state.get(el).ty = 0; state.get(el).s = 1; });
  });

  function onMove(e, el){
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    const x = (px - 0.5) * 2; // -1 .. 1
    const y = (py - 0.5) * 2; // -1 .. 1

    // rotation degrees (max)
    const maxRotate = 6; // degrees
    const maxTranslate = 8; // px

    const tx = -y * maxRotate; // rotateX
    const ty = x * maxRotate;  // rotateY
    const tz = -y * maxTranslate;

    const s = state.get(el);
    s.tx = tx; s.ty = ty; s.tz = tz;
  }

  function animate(){
    state.forEach((s, el)=>{
      // lerp towards target
      s._rx = (s._rx || 0) + (s.tx - (s._rx || 0)) * 0.14;
      s._ry = (s._ry || 0) + (s.ty - (s._ry || 0)) * 0.14;
      s._tz = (s._tz || 0) + ((s.tz || 0) - (s._tz || 0)) * 0.14;

      const scale = s.s || 1;
      const transform = `perspective(900px) translateZ(${s._tz.toFixed(2)}px) rotateX(${s._rx.toFixed(2)}deg) rotateY(${s._ry.toFixed(2)}deg) scale(${scale})`;
      el.style.transform = transform;
    });
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();
