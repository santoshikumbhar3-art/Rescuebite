import { useState } from 'react'
import { RotateCcw, User, Store, QrCode, Sparkles, Check, ChevronUp, ChevronDown } from 'lucide-react'

export default function DemoControlBar({
  currentView,
  onViewChange,
  onResetDemo,
  onSimulateReservation,
  pendingCount = 0,
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleReset = () => {
    onResetDemo()
    showToast('Demo data reset to fresh state!')
  }

  const handleSimulate = () => {
    if (onSimulateReservation) {
      onSimulateReservation()
      showToast('Simulated incoming reservation created!')
    }
  }

  return (
    <aside
      aria-label="Demo Controller"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 w-auto max-w-[95vw]"
    >
      {/* Toast Notification */}
      {toast && (
        <div className="animate-rise mx-auto mb-2 flex items-center justify-center gap-1.5 rounded-full bg-forest px-4 py-1.5 text-xs font-semibold text-ivory shadow-lg">
          <Check className="h-3.5 w-3.5 text-butter" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-full border border-ink/20 bg-forest-deep/95 p-1.5 text-ivory shadow-2xl backdrop-blur-md">
        {/* Badge */}
        <span className="hidden items-center gap-1 pl-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-butter sm:inline-flex">
          <Sparkles className="h-3 w-3" />
          Demo Mode
        </span>

        <div className="hidden h-4 w-px bg-ivory/20 sm:block" />

        {/* View Switchers */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onViewChange('student')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              currentView === 'student'
                ? 'bg-ivory text-forest font-bold shadow-xs'
                : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>Student View</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('kitchen')}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              currentView === 'kitchen'
                ? 'bg-ivory text-forest font-bold shadow-xs'
                : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
            }`}
          >
            <Store className="h-3.5 w-3.5" />
            <span>Kitchen Hub</span>
          </button>

          <button
            type="button"
            onClick={() => onViewChange('scanner')}
            className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              currentView === 'scanner'
                ? 'bg-ivory text-forest font-bold shadow-xs'
                : 'text-ivory/80 hover:bg-ivory/10 hover:text-ivory'
            }`}
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>QR Scanner</span>
            {pendingCount > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-tomato px-1 text-[9px] font-bold text-ivory">
                {pendingCount}
              </span>
            )}
          </button>
        </div>

        <div className="h-4 w-px bg-ivory/20" />

        {/* Quick Demo Helper Actions */}
        <div className="flex items-center gap-1 pr-1">
          <button
            type="button"
            onClick={handleSimulate}
            className="hidden sm:inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-butter hover:bg-ivory/10"
            title="Auto-create test reservation for quick demoing"
          >
            <Sparkles className="h-3 w-3" />
            +Test Hold
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-ivory/70 hover:bg-ivory/10 hover:text-ivory"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
