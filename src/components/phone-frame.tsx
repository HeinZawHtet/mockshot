interface PhoneFrameProps {
  children: React.ReactNode
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div
      id="phone-frame"
      style={{
        width: '390px',
        height: '844px',
        borderRadius: '47px',
        overflow: 'hidden',
        position: 'relative',
        flexShrink: 0,
        boxShadow: [
          '0 0 0 10px #1a1a22',
          '0 0 0 12px #0d0d14',
          '0 0 0 14px #1a1a22',
          '0 50px 100px rgba(0,0,0,0.7)',
          '0 20px 40px rgba(0,0,0,0.5)',
        ].join(', '),
      }}
    >
      {children}
    </div>
  )
}
