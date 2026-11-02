(function(root){
'use strict';
// Roboto SemiBold 3.015 metrics, native 502 x 410 pixels. Font kerning is disabled.
const C={left:26,right:440,baseline:223,maxFontSize:108,minFontSize:84,unitFontSize:30,unitWidth:83.84765625,gapBeforeSlash:10,gapAfterSlash:10,gapBeforeUnit:14,digitAdvanceEm:0.5712890625,slashAdvanceEm:0.38037109375,slashRatio:82/108,trackingRatio:-6/108};
function normalize(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(999,Math.trunc(n))):0;}
function layout(pm25,pm10){
 const a=String(normalize(pm25)),b=String(normalize(pm10));
 function widths(size){const tracking=C.trackingRatio*size;return {a:a.length*C.digitAdvanceEm*size+(a.length-1)*tracking,b:b.length*C.digitAdvanceEm*size+(b.length-1)*tracking,slash:C.slashAdvanceEm*C.slashRatio*size};}
 let size=C.maxFontSize,w;
 for(;size>=C.minFontSize;size--){w=widths(size);if(w.a+w.b+w.slash+C.gapBeforeSlash+C.gapAfterSlash+C.gapBeforeUnit+C.unitWidth<=C.right-C.left)break;}
 if(size<C.minFontSize)throw Error('PM font metrics exceed the reserved reading area');
 const slashX=C.left+w.a+C.gapBeforeSlash,rightX=slashX+w.slash+C.gapAfterSlash,unitX=rightX+w.b+C.gapBeforeUnit;
 return {pm25:a,pm10:b,fontSize:size,tracking:C.trackingRatio*size,baseline:C.baseline,leftX:C.left,slashX,slashFontSize:C.slashRatio*size,rightX,unitX,unitFontSize:C.unitFontSize,endX:unitX+C.unitWidth,widths:w};
}
const api={constants:C,normalize,layout};
if(typeof module==='object'&&module.exports)module.exports=api;else root.PMTextLayout=api;
})(typeof window==='object'?window:this);
