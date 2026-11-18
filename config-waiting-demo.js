(()=>{
  'use strict';
  const frames=[...document.querySelectorAll('[data-config-wait], [data-config-breath]')];
  if(!frames.length||!window.DanyConfigWaiting)return;
  let paused=false;
  const visibility=new WeakMap();
  const update=frame=>frame.dataset.waitPaused=String(paused||document.hidden||!visibility.get(frame));
  frames.forEach(frame=>{if(frame.dataset.configWait)frame.style.setProperty('--wait-period',window.DanyConfigWaiting.durations[frame.dataset.configWait]+'ms');visibility.set(frame,false);update(frame)});
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{visibility.set(entry.target,entry.isIntersecting);update(entry.target)}),{threshold:.1});
  frames.forEach(frame=>observer.observe(frame));
  document.querySelectorAll('[data-wait-toggle]').forEach(button=>button.addEventListener('click',()=>{
    paused=!paused;
    document.querySelectorAll('[data-wait-toggle]').forEach(node=>{node.setAttribute('aria-pressed',String(paused));node.textContent=paused?'播放等待动画':'暂停等待动画'});
    frames.forEach(update);
  }));
  document.addEventListener('visibilitychange',()=>frames.forEach(update));
})();
