import { AlertTriangle } from 'lucide-react'

const ConstructionBanner = () => {
  return (
    <div className="bg-yellow-500/10 border-b border-yellow-500/20 py-2 px-4 text-center relative">
      <div className="flex items-center justify-center gap-2 text-yellow-500">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">
          TextArena is under construction — Please check back on February 14th for our official launch!
        </span>
      </div>
    </div>
  )
}

export default ConstructionBanner