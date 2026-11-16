// measure(text, size, weight, tracking): actual font advance width, including inter-character tracking.
// Temperature counts integer digits only: 24.6 has two, 100.0 has three; ignore the sign.
function layoutReading(value, unit, baseline, measure, metric = '') {
  const text = value == null ? '—' : String(value);
  const id = String(metric).toLowerCase().replace(/[₂.\s]/g, c => c === '₂' ? '2' : '');
  const integerDigits = ((text.match(/^[+-]?(\d+)/) || [null, ''])[1]).length;
  const digitCount = (id === 'temperature' || id === 'temp') ? integerDigits : (text.match(/\d/g) || []).length;
  const extend = ((id === 'temperature' || id === 'temp') && digitCount === 3)
    || (id === 'co2' && digitCount === 4)
    || ((id === 'pm25' || id === 'pm10') && digitCount === 3);
  const unitSize = 18, baseX = 146, right = 273, gap = 6, tracking = -0.6;
  const unitWidth = measure(unit, unitSize, 400, 0);
  const prefix = (text.match(/^[^\d]*\d/) || [''])[0];
  for (let size = 50; size >= 20; size--) {
    const shift = extend ? measure(prefix, size, 600, tracking) + tracking : 0;
    const x = baseX - shift;
    const unitX = x + measure(text, size, 600, tracking) + gap;
    if (unitX + unitWidth <= right) return {text, x, baseline, size, weight:600, tracking, unit, unitX, unitSize, baseX, shift, digitCount, extendsLeft:extend};
  }
  throw new RangeError('Reading exceeds reserved width; check formatting or font metrics.');
}
if (typeof module === 'object') module.exports = { layoutReading };
