/**
 * Long reading text (design plan point 3, D-63). The content separates paragraphs with a blank
 * line; a closing question stands apart in the italic serif, like the reflection on "Heute".
 */
export function Prose({ text, className }: { text: string; className?: string }) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  const last = paragraphs.length - 1;
  return (
    <div className={className ? `prose ${className}` : 'prose'}>
      {paragraphs.map((p, i) => (
        <p key={i} className={i === last && last > 0 && p.endsWith('?') ? 'italic-serif prose__question' : undefined}>
          {p}
        </p>
      ))}
    </div>
  );
}
