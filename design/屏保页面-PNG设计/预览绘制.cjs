const fs = require('fs');
const { Resvg } = require('@resvg/resvg-js');
const root = __dirname;
const out = root + '/预览';
fs.mkdirSync(out, {recursive: true});
const fontFiles = ['Roboto-Regular.ttf', 'Roboto-SemiBold.ttf'].map(name => root + '/字体/' + name);
function text(value, x, y, size, color = '#FFFFFF', weight = 400, anchor = 'start', extra = '') {
  return `<text x="${x}" y="${y}" font-family="Roboto" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}" ${extra}>${value}</text>`;
}
// 36×36 transparent icon tile; tint with the current reading grade color.
function metricIcon(kind, x, y, color) {
  const shape = kind === 'temperature'
    ? '<path d="M14 22.5V6a4 4 0 0 1 8 0v16.5a7 7 0 1 1-8 0Z"/><path d="M18 10v16"/><circle cx="18" cy="28" r="2" fill="currentColor" stroke="none"/><path d="M26 9C28 6.8 30 11.2 32 9Q33.2 7.8 34.5 9M26 14C28 11.8 30 16.2 32 14Q33.2 12.8 34.5 14M26 19C28 16.8 30 21.2 32 19Q33.2 17.8 34.5 19"/>'
    : '<path d="M18 3C15 8 7 16 7 23a11 11 0 0 0 22 0C29 16 21 8 18 3Z"/><g stroke-width="1.6"><circle cx="14.5" cy="19" r="1.8"/><circle cx="21.5" cy="27" r="1.8"/><path d="M14 28L22 18"/></g>';
  return `<g transform="translate(${x} ${y})" color="${color}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${shape}</g>`;
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
body += text('PAST 24 HOURS', 438, 39, 26, '#F5F7F8', 400, 'end');
body += '<path d="M26 58 H476" stroke="url(#separator)" stroke-width="0.7"/>';
const displayOrder = [0, 1, 4, 2, 3];
displayOrder.forEach((sourceIndex, index) => {
  const row = rows[sourceIndex];
  const center = 92 + index * 68;
  const rowTop = center - 34;
  const chart = histories[sourceIndex];
  const titleBaseline = center + 11;
  const currentColor = chart.color(Number(row.value), 23);
  if (sourceIndex === 0 || sourceIndex === 1) {
    body += metricIcon(sourceIndex === 0 ? 'temperature' : 'humidity', 56, center - 18, currentColor);
  } else {
    body += text(row.name, 74, titleBaseline, 30, currentColor, 600, 'middle');
  }
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
  const readingShift = sourceIndex === 4 && /^\d{4}$/.test(row.value) ? 28 : 0;
  body += text(row.value, 146 - readingShift, center + 22, 50, '#F5F7F8', 600, 'start', 'letter-spacing="-0.6"');
  const unitX = { TEMP: 250, RH: 208, 'PM2.5': 208, PM10: 208, 'CO₂': 263.86 - readingShift }[row.name];
  body += text(row.unit, unitX, center + 22, 18, '#F5F7F8');

  body += `<path d="M23 ${center + 34} H479" stroke="url(#separator)" stroke-width="0.7"/>`;
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="502" height="410"><defs>${definitions}</defs><g clip-path="url(#screen)">${body}</g></svg>`;
for (const scale of [1, 4]) {
  fs.writeFileSync(`${out}/屏保页面-定稿-${scale === 1 ? '502x410' : '4x'}.png`, new Resvg(svg, { fitTo: { mode: 'zoom', value: scale }, font: { fontFiles, loadSystemFonts: false } }).render().asPng());
}
console.log(out);

for (const kind of ['temperature', 'humidity']) {
  for (const scale of [1, 4]) {
    const dir = root + '/切图/' + scale + 'x';
    fs.mkdirSync(dir, {recursive:true});
    const tile = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36">${metricIcon(kind,0,0,'#FFFFFF')}</svg>`;
    fs.writeFileSync(`${dir}/${kind}-icon.png`, new Resvg(tile, {fitTo:{mode:'zoom',value:scale}}).render().asPng());
  }
}
