interface LoadingAnimationProps {
  text?: string
  className?: string
}

export function LoadingAnimation({ text = "Loading...", className = "" }: LoadingAnimationProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-64 h-16 mb-4 overflow-hidden">
        {/* Road/Path */}
        <div className="absolute bottom-2 left-0 right-0 h-1 bg-gray-300 rounded-full">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-full opacity-50"></div>
        </div>

        {/* Moving Car */}
        <div className="absolute bottom-3 animate-car-move">
          <div className="relative">
            {/* Car Shadow */}
            <div className="absolute top-6 left-1 w-8 h-2 bg-gray-400 rounded-full opacity-30 blur-sm"></div>
            {/* Car Icon */}
            <CarIcon />
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-center">{text}</p>
    </div>
  )
}

// Car icon component facing right (forward direction)
const CarIcon = () => (
  <svg
    width="32"
    height="20"
    viewBox="0 0 32 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-blue-600"
  >
    {/* Car body - oriented to face right (forward direction) */}
    <path
      d="M6 14h20c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-3l-2-3H11L9 6H6c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2z"
      fill="currentColor"
    />
    {/* Front windshield */}
    <path d="M11 3h6l2 3H9l2-3z" fill="rgba(255,255,255,0.3)" />
    {/* Front wheel */}
    <circle cx="24" cy="16" r="2" fill="currentColor" />
    {/* Rear wheel */}
    <circle cx="8" cy="16" r="2" fill="currentColor" />
    {/* Front bumper/headlight */}
    <rect x="26" y="10" width="2" height="2" fill="currentColor" />
  </svg>
)
