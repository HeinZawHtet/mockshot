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

  const { toPng } = await import('html-to-image')
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    skipAutoScale: true,
  })

  const link = document.createElement('a')
  link.href = dataUrl
  link.download = `${filename}.png`
  link.click()
}
