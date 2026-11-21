const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');
const root = __dirname;
const assetRoot = __dirname;
const fontkit = require('fontkit');
const {layoutReading} = require('./读数布局.js');
const faceRegular = fontkit.openSync(root + '/字体/Roboto-Regular.ttf');
const faceSemiBold = fontkit.openSync(root + '/字体/Roboto-SemiBold.ttf');
function measure(value,size,weight,tracking){const face=weight===600?faceSemiBold:faceRegular;const run=face.layout(value);return run.positions.reduce((sum,p)=>sum+p.xAdvance,0)/face.unitsPerEm*size+Math.max(0,Array.from(value).length-1)*tracking;}

const out = root + '/预览';
fs.mkdirSync(out, {recursive: true});
const fontFiles = ['Roboto-Regular.ttf', 'Roboto-SemiBold.ttf'].map(name => root + '/字体/' + name);
function text(value, x, y, size, color = '#FFFFFF', weight = 400, anchor = 'start', extra = '') {
  return `<text x="${x}" y="${y}" font-family="Roboto" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" ${extra}>${value}</text>`;
}
// 36×36 transparent icon tile; tint with the current reading grade color.
function existingMetricIcon(kind,x,y,color) {
  if(kind==='humidity'){
    const drop='M16 9C14 12.6 10 17.7 10 22a6 6 0 0 0 12 0C22 17.7 18 12.6 16 9Z';
    return `<g transform="translate(${x} ${y})" color="${color}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><defs><mask id="humidity-steam-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><rect width="36" height="36" fill="white"/><path d="${drop}" fill="black" stroke="black" stroke-width="2.2"/></mask></defs><g mask="url(#humidity-steam-mask)"><path d="M21 10C18 15 24 21 21 27M27 10C24 15 30 21 27 27M33 10C30 15 36 21 33 27"/></g><path d="${drop}"/></g>`;
  }
  const shape="<path d=\"M14 22.5V6a4 4 0 0 1 8 0v16.5a7 7 0 1 1-8 0Z\"/><path d=\"M18 10v16\"/><circle cx=\"18\" cy=\"28\" r=\"2\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M26 9C28 6.8 30 11.2 32 9Q33.2 7.8 34.5 9M26 14C28 11.8 30 16.2 32 14Q33.2 12.8 34.5 14M26 19C28 16.8 30 21.2 32 19Q33.2 17.8 34.5 19\"/>";
  return `<g transform="translate(${x} ${y})" color="${color}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shape}</g>`;
}

// Normalize the visible left edges of all five icons to local x=1.25.
function metricIcon(kind,x,y,color) {
  if(kind==='temperature') return `<g transform="translate(${x} ${y+2}) translate(1.25 0) scale(1.153846 1) translate(-1.25 0)">${existingMetricIcon(kind,-8.5,0,color)}</g>`;
  if(kind==='humidity') return `<g transform="translate(${x} ${y+2}) translate(1.25 0) scale(1.15 1) translate(-1.25 0)">${existingMetricIcon(kind,-7.65,0,color)}</g>`;

  // Material Symbols Rounded: air / blur_on, as defined by the environment guide.
  if(kind==='co2') {
    const path = "M460-160q-32 0-59.5-16T356-220q-11-20-.5-40t32.5-20q13 0 23 8t18 18q5 7 13.5 10.5T460-240q17 0 28.5-11.5T500-280q0-17-11.5-28.5T460-320H120q-17 0-28.5-11.5T80-360q0-17 11.5-28.5T120-400h340q50 0 85 35t35 85q0 50-35 85t-85 35ZM120-560q-17 0-28.5-11.5T80-600q0-17 11.5-28.5T120-640h500q25 0 42.5-17.5T680-700q0-25-17.5-42.5T620-760q-16 0-30 7.5T568-731q-7 12-17 21.5t-24 9.5q-20 0-32.5-15t-6.5-32q14-42 50.5-67.5T620-840q58 0 99 41t41 99q0 58-41 99t-99 41H120Zm678 308q-20 9-39-2.5T740-288q0-14 9.5-23.5T771-328q14-8 21.5-22t7.5-30q0-25-17.5-42.5T740-440H120q-17 0-28.5-11.5T80-480q0-17 11.5-28.5T120-520h620q58 0 99 41t41 99q0 42-22 76.5T798-252Z";
    return `<g transform="translate(${x} ${y})" fill="${color}"><g transform="translate(-1.75 38.75) scale(0.0375)"><path d="${path}"/></g></g>`;
  }
  const path = "M120-380q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-160q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm120 340q-17 0-28.5-11.5T200-240q0-17 11.5-28.5T240-280q17 0 28.5 11.5T280-240q0 17-11.5 28.5T240-200Zm0-160q-17 0-28.5-11.5T200-400q0-17 11.5-28.5T240-440q17 0 28.5 11.5T280-400q0 17-11.5 28.5T240-360Zm0-160q-17 0-28.5-11.5T200-560q0-17 11.5-28.5T240-600q17 0 28.5 11.5T280-560q0 17-11.5 28.5T240-520Zm0-160q-17 0-28.5-11.5T200-720q0-17 11.5-28.5T240-760q17 0 28.5 11.5T280-720q0 17-11.5 28.5T240-680Zm160 340q-25 0-42.5-17.5T340-400q0-25 17.5-42.5T400-460q25 0 42.5 17.5T460-400q0 25-17.5 42.5T400-340Zm0-160q-25 0-42.5-17.5T340-560q0-25 17.5-42.5T400-620q25 0 42.5 17.5T460-560q0 25-17.5 42.5T400-500Zm0 300q-17 0-28.5-11.5T360-240q0-17 11.5-28.5T400-280q17 0 28.5 11.5T440-240q0 17-11.5 28.5T400-200Zm0-480q-17 0-28.5-11.5T360-720q0-17 11.5-28.5T400-760q17 0 28.5 11.5T440-720q0 17-11.5 28.5T400-680Zm0 580q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-720q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm160 480q-25 0-42.5-17.5T500-400q0-25 17.5-42.5T560-460q25 0 42.5 17.5T620-400q0 25-17.5 42.5T560-340Zm0-160q-25 0-42.5-17.5T500-560q0-25 17.5-42.5T560-620q25 0 42.5 17.5T620-560q0 25-17.5 42.5T560-500Zm0 300q-17 0-28.5-11.5T520-240q0-17 11.5-28.5T560-280q17 0 28.5 11.5T600-240q0 17-11.5 28.5T560-200Zm0-480q-17 0-28.5-11.5T520-720q0-17 11.5-28.5T560-760q17 0 28.5 11.5T600-720q0 17-11.5 28.5T560-680Zm0 580q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-720q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm160 620q-17 0-28.5-11.5T680-240q0-17 11.5-28.5T720-280q17 0 28.5 11.5T760-240q0 17-11.5 28.5T720-200Zm0-160q-17 0-28.5-11.5T680-400q0-17 11.5-28.5T720-440q17 0 28.5 11.5T760-400q0 17-11.5 28.5T720-360Zm0-160q-17 0-28.5-11.5T680-560q0-17 11.5-28.5T720-600q17 0 28.5 11.5T760-560q0 17-11.5 28.5T720-520Zm0-160q-17 0-28.5-11.5T680-720q0-17 11.5-28.5T720-760q17 0 28.5 11.5T760-720q0 17-11.5 28.5T720-680Zm120 300q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Zm0-160q-8 0-14-6t-6-14q0-8 6-14t14-6q8 0 14 6t6 14q0 8-6 14t-14 6Z";
  const label = kind==='pm25' ? '2.5' : '10';
  // Keep the reference dot topology, with circular dots and an optically equal 30px width.
  const circles = [];
  for (const cx of [120,240,400,560,720,840]) {
    const ys = [120,840].includes(cx) ? [-560,-400] : [240,720].includes(cx) ? [-720,-560,-400,-240] : [-840,-720,-560,-400,-240,-120];
    for(const cy of ys) {
      const edge = [120,840].includes(cx) || [-840,-120].includes(cy);
      const center = [400,560].includes(cx) && [-560,-400].includes(cy);
      const radius = edge ? 0.85 : center ? 2.35 : 1.55;
      const px = 2.1 + (cx-120)/720*28.3;
      const py = 1.85 + (cy+840)/720*22.3;
      circles.push(`<circle cx="${px}" cy="${py}" r="${radius}"/>`);
    }
  }
  return `<g transform="translate(${x} ${y})" fill="${color}">${circles.join('')}${text(label,16.25,39,12,color,600,'middle')}</g>`;

}

const grade = { good: '#16A34A', fair: '#65A30D', moderate: '#CA8A04', wet: '#1D4ED8' };
const rows = [
  { name: 'TEMP', value: '24.6', unit: '°C', unitX: 293, identity: '#F97316', state: 'Neutral', mix: [['good', 20], ['moderate', 4]] },
  { name: 'RH', value: '56', unit: '%RH', unitX: 262, identity: '#0891B2', state: 'Comfort', mix: [['good', 23], ['wet', 1]] },
  { name: 'PM2.5', value: '26', unit: 'μg/m³', unitX: 262, identity: '#667A83', state: 'Moderate', mix: [['moderate', 24]] },
  { name: 'PM10', value: '17', unit: 'μg/m³', unitX: 262, identity: '#9A7958', state: 'Fair', mix: [['good', 8], ['fair', 16]] },
  { name: 'CO₂', value: '2168', unit: 'ppm', unitX: 282, identity: '#15803D', state: 'Poor', mix: [['good', 18], ['fair', 6]] }
];
function tint(color, amount) {
  return '#' + color.slice(1).match(/../g).map(channel => Math.round(parseInt(channel, 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')).join('');
}
function interpolate(values, hour) {
  const position = hour * (values.length - 1) / 23;
  const index = Math.floor(position);
  return values[index] + (values[Math.min(index + 1, values.length - 1)] - values[index]) * (position - index);
}
function particleColor(value, thresholds) {
  const palette = ['#16A34A', '#65A30D', '#CA8A04', '#EA580C', '#DC2626', '#7E22CE'];
  const index = thresholds.findIndex(limit => value <= limit);
  return palette[index < 0 ? 5 : index];
}
const pmv = [-0.2,-0.3,-0.5,-0.3,0,0.3,0.6,0.5,0.2,0,-0.1,0,0.2,0.1];
const histories = [
  { values: [23.8,23.5,23.2,23.8,24.5,25.4,26.1,25.6,24.8,24.1,23.9,24.4,25.0,24.6], min: 20, max: 28, color: (value, hour) => interpolate(pmv, hour) > 0.5 ? '#CA8A04' : '#16A34A' },
  { values: [53,55,58,61,57,52,48,46,50,55,59,57,54,56], min: 40, max: 70, color: value => value > 60 ? '#1D4ED8' : '#16A34A' },
  { values: [4,5,8,13,19,26,35,31,24,14,5,4,12,26], min: 0, max: 60, color: value => particleColor(value, [5,15,50,90,140]) },
  { values: [12,11,12,14,17,20,23,24,25,24,23,24,22,17], min: 0, max: 60, color: value => particleColor(value, [15,45,120,195,270]) },
  { values: [720,850,1120,1280,1040,790,650,730,980,1160,1350,1720,2050,2168], min: 0, max: 2500, color: value => value < 1000 ? '#16A34A' : value <= 2000 ? '#65A30D' : '#EA580C' }
];
let definitions = '<clipPath id="screen"><rect width="502" height="410" rx="82"/></clipPath>';
definitions += '<linearGradient id="separator" gradientUnits="userSpaceOnUse" x1="23" y1="0" x2="479" y2="0"><stop offset="0" stop-color="#252A2E" stop-opacity="0"/><stop offset="0.09" stop-color="#252A2E"/><stop offset="0.91" stop-color="#252A2E"/><stop offset="1" stop-color="#252A2E" stop-opacity="0"/></linearGradient>';
for (const color of ['#16A34A', '#65A30D', '#CA8A04', '#1D4ED8', '#EA580C']) {
  definitions += `<linearGradient id="bar${color.slice(1)}" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="${color}" stop-opacity="0.84"/></linearGradient>`;
}
let body = '<rect width="502" height="410" fill="#000000"/>';
body += text('10:30', 64, 39, 26, '#F5F7F8', 400);
body += text('24 HOURS', 438, 39, 26, '#F5F7F8', 400, 'end');
body += '<path d="M26 58 H476" stroke="url(#separator)" stroke-width="0.7"/>';
const displayOrder = [0, 1, 4, 2, 3];
displayOrder.forEach((sourceIndex, index) => {
  const row = rows[sourceIndex];
  const center = 92 + index * 68;
  const rowTop = center - 34;
  const chart = histories[sourceIndex];
  const currentColor = chart.color(Number(row.value), 23);
  const iconKind = ['temperature','humidity','pm25','pm10','co2'][sourceIndex];
  // Optical bottom of each alpha tile; align the visible icon, not its transparent box.
  const iconBottom = {temperature:38.5, humidity:31.25, co2:32.75, pm25:39.25, pm10:39.25}[iconKind];
  body += metricIcon(iconKind,54,center+22.5-iconBottom,currentColor);
  const baseline = center + 22;
  const plotX = 276;
  const plotStep = 7.82;
  const barWidth = 6.2;
  for (let hour = 0; hour < 24; hour++) {
    const value = interpolate(chart.values, hour);
    const height = Math.max(1, (value - chart.min) / (chart.max - chart.min) * 49);
    const x = plotX + hour * plotStep;
    const y = baseline - height;
    const color = chart.color(value, hour);
    body += `<path d="M${x} ${baseline} V${y + 1.5} Q${x} ${y} ${x + 1.5} ${y} H${x + barWidth - 1.5} Q${x + barWidth} ${y} ${x + barWidth} ${y + 1.5} V${baseline} Z" fill="url(#bar${color.slice(1)})"/>`;
  }
  const samples = Array.from({ length: 24 }, (_, hour) => interpolate(chart.values, hour));
  const average = samples.reduce((sum, value) => sum + value, 0) / samples.length;
  const averageY = baseline - (average - chart.min) / (chart.max - chart.min) * 49;
  const averagePMV = Array.from({ length: 24 }, (_, hour) => interpolate(pmv, hour)).reduce((sum, value) => sum + value, 0) / 24;
  const averageColor = sourceIndex === 0 ? (averagePMV > 0.5 ? '#CA8A04' : '#16A34A') : chart.color(average);
  body += `<path d="M${plotX} ${averageY} H462" stroke="${tint(averageColor, 0.16)}" stroke-width="0.7" stroke-opacity="0.72" stroke-dasharray="4 4" stroke-linecap="butt"/>`;
  const metric = ['temperature','humidity','pm25','pm10','co2'][sourceIndex];
  const reading = layoutReading(row.value,row.unit,center+22,measure,metric);
  body += text(reading.text, reading.x, reading.baseline, reading.size, '#F5F7F8',600,'start',`letter-spacing="${reading.tracking}"`);
  body += text(reading.unit, reading.unitX, reading.baseline, reading.unitSize, '#F5F7F8');

  body += `<path d="M23 ${center + 34} H479" stroke="url(#separator)" stroke-width="0.7"/>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="502" height="410"><defs>${definitions}</defs><g clip-path="url(#screen)">${body}</g></svg>`;
for (const scale of [1, 4]) {
  fs.writeFileSync(`${out}/屏保页面-定稿-${scale === 1 ? '502x410' : '4x'}.png`, new Resvg(svg, { fitTo: { mode: 'zoom', value: scale }, font: { fontFiles, loadSystemFonts: false } }).render().asPng());
}
console.log(out);

for (const kind of ['temperature', 'humidity', 'co2', 'pm25', 'pm10']) {
  for (const scale of [1, 4]) {
    const dir = assetRoot + '/切图/' + scale + 'x';
    fs.mkdirSync(dir, {recursive:true});
    const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="40">${metricIcon(kind,0,0,'#FFFFFF')}</svg>`;
    fs.writeFileSync(`${dir}/${kind}-icon.png`, new Resvg(tile, {fitTo:{mode:'zoom',value:scale}}).render().asPng());
  }
}
