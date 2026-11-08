// measure(text, size, weight, tracking) must use the device font metrics.
function layoutReading(value, unit, baseline, measure) {
  const text = value == null ? '—' : String(value);
  const unitSize = 18, x = 112, right = 242, gap = 6, tracking = -0.6;
  const unitWidth = measure(unit, unitSize, 400, 0);
  for (let size = 50; size >= 20; size--) {
    const unitX = x + measure(text, size, 600, tracking) + gap;
    if (unitX + unitWidth <= right) return {text, x, baseline, size, weight:600, tracking, unit, unitX, unitSize};
  }
  throw new RangeError('Reading exceeds reserved width; check formatting or font metrics.');
}
if (typeof module === 'object') module.exports = { layoutReading };
