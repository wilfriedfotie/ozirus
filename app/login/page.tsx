'use client';

import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { LogIn } from "lucide-react"

export default function LoginPage() {
  return (
    <main style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0D0D16' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#1A1A24', padding: 40, borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', maxWidth: 400, width: '100%' }}
      >
        <img src="/logo.png" style={{ height: 40, marginBottom: 32 }} alt="Ozirus" />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Accès Admin</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, marginBottom: 32 }}>Seule l'adresse <strong>info.ozirus@gmail.com</strong> est autorisée.</p>
        
        <button 
          onClick={() => signIn("google", { callbackUrl: "/admin" })}
          style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#fff', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}
        >
          <LogIn size={20} /> Se connecter avec Google
        </button>
      </motion.div>
    </main>
  )
}