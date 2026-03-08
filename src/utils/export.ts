export function preloadExport(): void {
  void import('html-to-image')
}

export async function exportAsPng(
  elementId: string,
  filename = 'mockshot'
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    console.error(`exportAsPng: element #${elementId} not found`)
    return
  }

  // Hide interactive-only UI elements (action buttons, emoji picker) during capture
  const hideStyle = document.createElement('style')
  hideStyle.textContent = '.export-hide { display: none !important; }'
  document.head.appendChild(hideStyle)

  const { toPng } = await import('html-to-image')
  const options = { pixelRatio: 2, skipAutoScale: true }

  try {
    await toPng(element, options) // first call caches external resources (fixes CSS backgroundImage)
    const dataUrl = await toPng(element, options)

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${filename}.png`
    link.click()
  } finally {
    document.head.removeChild(hideStyle)
  }
}
