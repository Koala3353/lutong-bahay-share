// Kalde, the kaldero (rice pot) buddy. Moods: happy, wink, cheer, sleepy. `bag` puts a surplus bag in the other hand.
export default function Mascot({ mood = 'happy', bag = false, size = 200, className = '', title = 'Kalde, the rice pot mascot' }) {
  const eyes = {
    happy: (
      <>
        <circle cx="82" cy="124" r="5.5" fill="#2B3A34" />
        <circle cx="118" cy="124" r="5.5" fill="#2B3A34" />
        <circle cx="84" cy="122" r="1.8" fill="#fff" />
        <circle cx="120" cy="122" r="1.8" fill="#fff" />
      </>
    ),
    wink: (
      <>
        <circle cx="82" cy="124" r="5.5" fill="#2B3A34" />
        <circle cx="84" cy="122" r="1.8" fill="#fff" />
        <path d="M110 124q8-8 16 0" stroke="#2B3A34" strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
    cheer: (
      <path d="M74 126q8-9 16 0M110 126q8-9 16 0" stroke="#2B3A34" strokeWidth="4" fill="none" strokeLinecap="round" />
    ),
    sleepy: (
      <path d="M74 124q8 7 16 0M110 124q8 7 16 0" stroke="#2B3A34" strokeWidth="4" fill="none" strokeLinecap="round" />
    ),
  }[mood]

  const mouth =
    mood === 'cheer' ? (
      <path d="M88 138q12 18 24 0z" fill="#2B3A34" />
    ) : mood === 'sleepy' ? (
      <path d="M94 142q6 3 12 0" stroke="#2B3A34" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    ) : (
      <path d="M90 138q10 11 20 0" stroke="#2B3A34" strokeWidth="4" fill="none" strokeLinecap="round" />
    )

  return (
    <svg
      className={`kalde ${className}`}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      role="img"
      aria-label={title}
    >
      <ellipse cx="100" cy="188" rx="58" ry="7" fill="#2B3A34" opacity="0.08" />

      <g fill="none" stroke="#9ED9BB" strokeWidth="6" strokeLinecap="round">
        <path className="steam-a" d="M82 52q-9-10 0-20t0-18" />
        <path className="steam-b" d="M118 52q-9-10 0-20t0-18" />
      </g>

      <g className="kalde-body">
        <ellipse cx="38" cy="124" rx="12" ry="9" fill="#FFB88C" />
        <ellipse cx="162" cy="124" rx="12" ry="9" fill="#FFB88C" />
        <path d="M40 84h120v52a46 46 0 0 1-46 46H86a46 46 0 0 1-46-46z" fill="#FFCBA4" />
        <path d="M54 100q-4 30 6 52" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.45" fill="none" />
        <rect x="32" y="66" width="136" height="26" rx="13" fill="#FFE08A" />
        <rect x="88" y="54" width="24" height="16" rx="8" fill="#FFB88C" />
        <circle cx="68" cy="140" r="9" fill="#FFB3C6" opacity="0.7" />
        <circle cx="132" cy="140" r="9" fill="#FFB3C6" opacity="0.7" />
        {eyes}
        {mouth}
        {bag && (
          <g>
            <path d="M150 146h34l-3 36h-28z" fill="#CDEEDC" />
            <path d="M150 146h34l-1 8h-32z" fill="#A9DFC4" />
            <path d="M158 146q0-12 9-12t9 12" stroke="#3F8F6A" strokeWidth="3.5" fill="none" strokeLinecap="round" />
            <circle cx="167" cy="166" r="6" fill="#fff" opacity="0.8" />
          </g>
        )}
      </g>
    </svg>
  )
}
