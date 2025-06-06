import { Car } from "lucide-react"

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
            <Car className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-center">{text}</p>
    </div>
  )
}
