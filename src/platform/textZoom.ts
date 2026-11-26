/**
 * Android's system font size reaches the WebView as a text zoom that multiplies every
 * font-size. Body text should grow with it (accessibility), but the inscriptions inside a
 * card frame are decorative, sized to the art and repeated as real text below the card.
 * This measures the effective zoom once so card.css can keep those inscriptions in their frame.
 */
export function measureTextZoom(doc: Document = document): number {
  const probe = doc.createElement('span');
  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.fontSize = '100px';
  probe.textContent = 'x';
  doc.body.appendChild(probe);
  const px = parseFloat(getComputedStyle(probe).fontSize);
  probe.remove();
  const zoom = px / 100;
  return Number.isFinite(zoom) && zoom > 0.5 && zoom < 4 ? zoom : 1;
}

export function applyTextZoom(doc: Document = document): number {
  const zoom = measureTextZoom(doc);
  doc.documentElement.style.setProperty('--text-zoom', String(Math.round(zoom * 1000) / 1000));
  return zoom;
}
