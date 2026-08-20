/**
 * Sanitize JSON-LD content before injecting via dangerouslySetInnerHTML.
 * Prevents XSS by escaping closing script tags that could break out of the JSON-LD block.
 */
export function sanitizeJsonLd(data: Record<string, unknown>): string {
  const raw = JSON.stringify(data);
  // Escape any closing </script> tags within the JSON string to prevent XSS breakout
  return raw.replace(/<\/script>/gi, '<\\/script>');
}
