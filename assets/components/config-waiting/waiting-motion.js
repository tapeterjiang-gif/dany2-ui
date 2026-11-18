(function(root){
  'use strict';
  const durations={adding:1600,clearing:1200};
  function waitingFrame(elapsed,state){
    if(!Object.prototype.hasOwnProperty.call(durations,state))throw new RangeError('Unknown waiting state');
    const period=durations[state];
    return {angle:(((elapsed%period)+period)%period)/period*360,opacity:Math.max(0,Math.min(1,elapsed/160)),period};
  }
  const api={durations,waitingFrame,fadeInMs:160,arcDegrees:90};
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.DanyConfigWaiting=api;
})(typeof window==='object'?window:null);
