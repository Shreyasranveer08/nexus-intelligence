'use client'

import React from 'react'
import Link from 'next/link'
import { Hexagon } from 'lucide-react'

export default function MarketingFooter() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#0a0a0a] pt-16 pb-8 px-6 lg:px-12 relative z-10 text-slate-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/welcome" className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Hexagon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">NexusIntel</span>
          </Link>
          <p className="text-sm leading-relaxed mb-6">
            The live intelligence platform for modern SaaS companies. Know what your competitors are doing before your customers do.
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Product</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/features" className="hover:text-blue-400 transition-colors">Features</Link></li>
            <li><Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link></li>
            <li><Link href="/analyze" className="hover:text-blue-400 transition-colors">Analyze Website</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Company</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-blue-400 transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Careers</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 tracking-wide uppercase text-xs">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            <li><Link href="#" className="hover:text-blue-400 transition-colors">Security</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between text-xs">
        <p>© 2026 NexusIntel Inc. All rights reserved.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">Twitter</Link>
          <Link href="#" className="hover:text-white transition-colors">LinkedIn</Link>
          <Link href="#" className="hover:text-white transition-colors">GitHub</Link>
        </div>
      </div>
    </footer>
  )
}
