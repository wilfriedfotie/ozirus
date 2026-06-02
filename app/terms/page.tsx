'use client';

import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <main style={{ background: '#fff', color: '#111', fontFamily: 'DM Sans, sans-serif', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#7967FF', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Retour à l'accueil</Link>
        
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 40, marginTop: 32, marginBottom: 40 }}>Conditions Générales de Vente & d'Utilisation</h1>
        
        <p style={{ color: '#666', marginBottom: 32 }}>Dernière mise à jour : 31 Mai 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>1. Objet</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Les présentes Conditions Générales (CGV/CGU) régissent la vente et l'utilisation des formations en ligne et des packs de produits IA (White Label) proposés par Ozirus Agency. En accédant à nos services, vous acceptez sans réserve ces conditions.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>2. Formations IA</h2>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2.1 Inscription et Accès</h3>
          <p style={{ lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
            L'accès à la formation est strictement personnel. Le partage de vos identifiants de connexion avec des tiers est formellement interdit et peut entraîner la suspension de votre accès sans remboursement.
          </p>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>2.2 Garantie de Satisfaction</h3>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Nous offrons une garantie "Satisfait ou Remboursé" de 14 jours calendaires à compter de la date d'achat. Pour être éligible, l'étudiant ne doit pas avoir visionné plus de 20% du contenu total de la formation. Toute demande de remboursement doit être envoyée par email à info.ozirus@gmail.com.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>3. Packs IA & Marque Blanche</h2>
          <p style={{ lineHeight: 1.7, color: '#444', marginBottom: 16 }}>
            Les produits IA vendus en "Marque Blanche" (White Label) confèrent au client le droit de les revendre sous son propre nom. 
          </p>
          <ul style={{ lineHeight: 1.7, color: '#444', paddingLeft: 20 }}>
            <li>Le client est responsable du support technique de ses propres clients finaux.</li>
            <li>Le code source reste la propriété intellectuelle d'Ozirus, sauf mention contraire explicite.</li>
            <li>Ozirus ne garantit pas de revenus spécifiques suite à l'utilisation ou la revente de ces produits.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>4. Paiements</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Les paiements s'effectuent par Mobile Money (Orange/MTN), Wave ou Virement bancaire. Les prix sont indiqués en FCFA. Ozirus se réserve le droit de modifier ses tarifs à tout moment, mais les services seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>5. Responsabilité</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Ozirus Agency met tout en œuvre pour fournir des outils et formations de qualité. Cependant, nous ne pouvons être tenus responsables des résultats financiers ou commerciaux obtenus par les clients. La réussite dépend de l'exécution et du travail personnel de chaque entrepreneur.
          </p>
        </section>

        <footer style={{ marginTop: 80, borderTop: '1px solid #eee', paddingTop: 40, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 14 }}>© {new Date().getFullYear()} Ozirus Agency · Douala, Cameroun</p>
        </footer>
      </div>
    </main>
  );
}
