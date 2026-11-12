// measure(text, size, weight, tracking) must use the device font metrics.
function layoutReading(value, unit, baseline, measure, metric = '') {
  const text = value == null ? '—' : String(value);
  // A four-digit CO2 reading shifts left by one 50px digit advance (~28px).
  const shift = metric === 'co2' && /^\d{4}$/.test(text) ? 28 : 0;
  const unitSize = 18, x = 146 - shift, right = 272, gap = 6, tracking = -0.6;
  const unitWidth = measure(unit, unitSize, 400, 0);
  for (let size = 50; size >= 20; size--) {
    const unitX = x + measure(text, size, 600, tracking) + gap;
    if (unitX + unitWidth <= right) return {text, x, baseline, size, weight:600, tracking, unit, unitX, unitSize};
  }
  throw new RangeError('Reading exceeds reserved width; check formatting or font metrics.');
}
if (typeof module === 'object') module.exports = { layoutReading };
