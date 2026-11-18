(()=>{
  'use strict';
  const root=document.querySelector('[data-connection-demo]');
  if(!root||!window.DanyStatusMotion)return;
  const timing=window.DanyStatusMotion;
  const arcs=[1,2,3].map(i=>root.querySelectorAll(`[data-wifi-arc="${i}"]`));
  const bluetooth=root.querySelectorAll('[data-bt-icon]');
  const status=root.querySelector('[data-connection-label]');
  const pauseButton=root.querySelector('[data-connection-pause]');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const labels={wifi:'Wi-Fi 连接中 · 蓝牙已连接',bluetooth:'蓝牙等待配对 · Wi-Fi 未连接',connected:'Wi-Fi 已连接 · 蓝牙已连接'};
  let mode='wifi',paused=false,visible=false,raf=null,elapsed=0,anchor=performance.now();
  function paint(t){
    const values=mode==='wifi'?(reduce.matches?[.65,.35,.15]:timing.wifiConnecting(t)):(mode==='connected'?[1,1,1]:[0,0,0]);
    arcs.forEach((nodes,i)=>nodes.forEach(node=>node.style.opacity=values[i]));
    const opacity=mode==='bluetooth'?(reduce.matches?.7:timing.bluetoothPairing(t)):1;
    bluetooth.forEach(node=>node.style.opacity=opacity);
  }
  function active(){return visible&&!paused&&!document.hidden&&!reduce.matches&&mode!=='connected'}
  function tick(now){raf=null;elapsed=now-anchor;paint(elapsed);if(active())raf=requestAnimationFrame(tick)}
  function sync(reset=false){
    if(raf!==null){cancelAnimationFrame(raf);raf=null;elapsed=performance.now()-anchor}
    if(reset)elapsed=0;
    paint(elapsed);
    if(active()){anchor=performance.now()-elapsed;raf=requestAnimationFrame(tick)}
  }
  root.querySelectorAll('[data-connection-mode]').forEach(button=>button.addEventListener('click',()=>{
    mode=button.dataset.connectionMode;
    root.querySelectorAll('[data-connection-mode]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));
    status.textContent=labels[mode];sync(true);
  }));
  pauseButton.addEventListener('click',()=>{paused=!paused;pauseButton.textContent=paused?'播放动画':'暂停动画';pauseButton.setAttribute('aria-pressed',String(paused));sync()});
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{threshold:.1}).observe(root);
  document.addEventListener('visibilitychange',()=>sync());
  reduce.addEventListener('change',()=>sync());
  status.textContent=labels[mode];paint(0);
})();
