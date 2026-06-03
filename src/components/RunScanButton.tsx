'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RunScanButton() {
  const [isScanning, setIsScanning] = useState(false)
  const router = useRouter()

  const handleScan = async () => {
    setIsScanning(true)
    const toastId = toast.loading('Running intelligence scan across all competitors...')
    try {
      const res = await fetch('/api/cron/monitor')
      const data = await res.json()
      
      if (data.success) {
        toast.success(`Scan complete! Processed ${data.processed} URLs. Detected ${data.changes?.length || 0} changes.`, { id: toastId })
        router.refresh()
      } else {
        toast.error(`Scan failed: ${data.error}`, { id: toastId })
      }
    } catch (err) {
      toast.error('Network error during scan.', { id: toastId })
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <button 
      onClick={handleScan}
      disabled={isScanning}
      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
    >
      {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      {isScanning ? 'Scanning...' : 'Run Scan'}
    </button>
  )
}
