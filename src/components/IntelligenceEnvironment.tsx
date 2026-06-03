'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function IntelligenceEnvironment() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-[#03050A]">
      
      {/* Layer 5: Deep Depth Gradients (keeps the background subtle) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#03050A] via-transparent to-transparent z-10 opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#03050A] via-transparent to-[#03050A] z-10 opacity-90" />

      {/* Volumetric Fog Layer */}
      <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] z-0" />
      <div className="absolute bottom-[20%] right-[30%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] z-0" />

      <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        
        {/* ========================================================
            LAYER 1: INDUSTRY INTELLIGENCE MAP (Global Connections)
        ======================================================== */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none">
          {/* Main Industry Interconnects */}
          <path d="M 100 200 L 400 300 L 800 200 L 1200 400" />
          <path d="M 400 300 L 600 600 L 1000 700 L 1400 500" />
          <path d="M 800 200 L 1000 700" />
          <path d="M 600 600 L 200 800" />
        </g>
        
        <g opacity="0.4" fontFamily="monospace" fontSize="8" fill="#94A3B8" letterSpacing="0.1em">
          {/* Industry Nodes */}
          <g transform="translate(100, 200)">
            <circle cx="0" cy="0" r="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            <text x="0" y="25" textAnchor="middle">HEALTHCARE</text>
          </g>
          <g transform="translate(200, 800)">
            <circle cx="0" cy="0" r="16" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            <text x="0" y="28" textAnchor="middle">E-COMMERCE</text>
          </g>
          <g transform="translate(1200, 400)">
            <circle cx="0" cy="0" r="18" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            <text x="0" y="32" textAnchor="middle">CLOUD INFRA</text>
          </g>
          <g transform="translate(600, 600)">
            <circle cx="0" cy="0" r="14" stroke="rgba(255,255,255,0.1)" strokeWidth="1" fill="none" />
            <text x="-25" y="4" textAnchor="end">FINTECH</text>
          </g>
        </g>

        {/* ========================================================
            LAYER 2: MARKET NETWORK (Company Clusters)
        ======================================================== */}
        <g stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" fill="none">
          {/* SaaS Cluster */}
          <circle cx="400" cy="300" r="4" fill="#38BDF8" stroke="none" />
          <text x="380" y="295" fill="#38BDF8" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" opacity="0.6">SAAS</text>
          
          <path d="M 400 300 L 350 250" />
          <text x="345" y="245" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="end" opacity="0.4">Monday.com</text>
          
          <path d="M 400 300 L 460 260" />
          <text x="465" y="260" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" opacity="0.4">Asana</text>

          <path d="M 400 300 L 440 350" />
          <text x="445" y="355" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" opacity="0.4">ClickUp</text>

          <path d="M 400 300 L 330 320" />
          <text x="325" y="325" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="end" opacity="0.4">Linear</text>

          {/* Cybersecurity Cluster */}
          <circle cx="1000" cy="700" r="4" fill="#F43F5E" stroke="none" />
          <text x="1015" y="695" fill="#F43F5E" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" opacity="0.6">CYBERSECURITY</text>
          
          <path d="M 1000 700 L 930 670" />
          <text x="925" y="665" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="end" opacity="0.4">CrowdStrike</text>

          <path d="M 1000 700 L 1050 630" />
          <text x="1055" y="630" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" opacity="0.4">Palo Alto</text>

          <path d="M 1000 700 L 1080 730" />
          <text x="1085" y="735" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" opacity="0.4">SentinelOne</text>

          {/* AI Cluster */}
          <circle cx="800" cy="200" r="4" fill="#A78BFA" stroke="none" />
          <text x="815" y="195" fill="#A78BFA" fontSize="10" fontFamily="monospace" letterSpacing="0.1em" opacity="0.6">ARTIFICIAL INTELLIGENCE</text>
          
          <path d="M 800 200 L 730 160" />
          <text x="725" y="155" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="end" opacity="0.4">OpenAI</text>

          <path d="M 800 200 L 860 140" />
          <text x="865" y="140" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" opacity="0.4">Anthropic</text>

          <path d="M 800 200 L 760 260" />
          <text x="755" y="270" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" textAnchor="end" opacity="0.4">Perplexity</text>
        </g>

        {/* ========================================================
            LAYER 3: LIVE INTELLIGENCE SIGNALS (Animated)
        ======================================================== */}
        <g fontFamily="monospace" fontSize="7">
          
          {/* Signal: Pricing Change */}
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 12, repeat: Infinity, times: [0, 0.1, 0.9, 1] }}>
            <motion.g animate={{ x: [400, 800], y: [300, 200] }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}>
              <circle cx="0" cy="0" r="1.5" fill="#34D399" />
              <rect x="-35" y="-12" width="70" height="9" rx="1" fill="rgba(52,211,153,0.1)" stroke="rgba(52,211,153,0.3)" strokeWidth="0.5" />
              <text x="0" y="-5" fill="#34D399" textAnchor="middle">PRICING CHANGE DETECTED</text>
            </motion.g>
          </motion.g>

          {/* Signal: Security Announcement */}
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 15, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay: 4 }}>
            <motion.g animate={{ x: [1000, 800], y: [700, 200] }} transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 4 }}>
              <circle cx="0" cy="0" r="1.5" fill="#F43F5E" />
              <rect x="5" y="-4" width="75" height="9" rx="1" fill="rgba(244,63,94,0.1)" stroke="rgba(244,63,94,0.3)" strokeWidth="0.5" />
              <text x="9" y="3" fill="#F43F5E">SECURITY ANNOUNCEMENT</text>
            </motion.g>
          </motion.g>

          {/* Signal: New Feature Launch */}
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 14, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay: 7 }}>
            <motion.g animate={{ x: [800, 1200], y: [200, 400] }} transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 7 }}>
              <circle cx="0" cy="0" r="1.5" fill="#A78BFA" />
              <rect x="-35" y="8" width="70" height="9" rx="1" fill="rgba(167,139,250,0.1)" stroke="rgba(167,139,250,0.3)" strokeWidth="0.5" />
              <text x="0" y="15" fill="#A78BFA" textAnchor="middle">NEW FEATURE LAUNCH</text>
            </motion.g>
          </motion.g>

          {/* Signal: Enterprise Push */}
          <motion.g animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 16, repeat: Infinity, times: [0, 0.1, 0.9, 1], delay: 2 }}>
            <motion.g animate={{ x: [600, 400], y: [600, 300] }} transition={{ duration: 16, repeat: Infinity, ease: "linear", delay: 2 }}>
              <circle cx="0" cy="0" r="1.5" fill="#38BDF8" />
              <rect x="-85" y="-4" width="75" height="9" rx="1" fill="rgba(56,189,248,0.1)" stroke="rgba(56,189,248,0.3)" strokeWidth="0.5" />
              <text x="-81" y="3" fill="#38BDF8">ENTERPRISE PUSH</text>
            </motion.g>
          </motion.g>

        </g>
      </svg>
    </div>
  )
}
