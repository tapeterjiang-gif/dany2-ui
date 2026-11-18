(function(root){
  'use strict';
  const modulo=(t,d)=>((t%d)+d)%d;
  const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
  // Three white arc masks are drawn over the static wifi-signal-0 PNG.
  function wifiConnecting(elapsed){
    const t=modulo(elapsed,1800);
    if(t<720)return [0,1,2].map(i=>smooth((t-(180+i*180))/180));
    if(t<1040)return [1,1,1];
    if(t<1320){const a=1-smooth((t-1040)/280);return [a,a,a]}
    return [0,0,0];
  }
  function bluetoothPairing(elapsed){
    const t=modulo(elapsed,1200);
    if(t<500)return 1;
    if(t<600)return 1-.8*smooth((t-500)/100);
    if(t<1100)return .2;
    return .2+.8*smooth((t-1100)/100);
  }
  const api={wifiConnecting,bluetoothPairing,wifiCycleMs:1800,bluetoothCycleMs:1200};
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.DanyStatusMotion=api;
})(typeof window==='object'?window:null);
