(function(root){
'use strict';
// Roboto SemiBold 3.015 metrics, native 502 x 410 pixels. Font kerning is disabled.
const C={left:22,right:452,baseline:234,maxFontSize:116,minFontSize:88,unitFontSize:36,unitWidth:100.6171875,gapBeforeSlash:6,gapAfterSlash:6,gapBeforeUnit:8,digitAdvanceEm:0.5712890625,slashAdvanceEm:0.38037109375,slashRatio:0.69,trackingRatio:-6/108};
function normalize(value){const n=Number(value);return Number.isFinite(n)?Math.max(0,Math.min(999,Math.trunc(n))):0;}
function layout(pm25,pm10){
 const a=String(normalize(pm25)),b=String(normalize(pm10));
 function widths(size){const tracking=C.trackingRatio*size;return {a:a.length*C.digitAdvanceEm*size+(a.length-1)*tracking,b:b.length*C.digitAdvanceEm*size+(b.length-1)*tracking,slash:C.slashAdvanceEm*Math.ceil(C.slashRatio*size)};}
 const count=a.length+b.length;
 const size=count===6?88:count===5?104:116,w=widths(size);
 if(w.a+w.b+w.slash+C.gapBeforeSlash+C.gapAfterSlash+C.gapBeforeUnit+C.unitWidth>C.right-C.left)throw Error('PM reading area overflow');
 const slashX=C.left+w.a+C.gapBeforeSlash,rightX=slashX+w.slash+C.gapAfterSlash,unitX=rightX+w.b+C.gapBeforeUnit;
 return {pm25:a,pm10:b,fontSize:size,tracking:C.trackingRatio*size,baseline:C.baseline,leftX:C.left,slashX,slashFontSize:Math.ceil(C.slashRatio*size),rightX,unitX,unitFontSize:C.unitFontSize,endX:unitX+C.unitWidth,widths:w};
}
const api={constants:C,normalize,layout};
if(typeof module==='object'&&module.exports)module.exports=api;else root.PMTextLayout=api;
})(typeof window==='object'?window:this);
