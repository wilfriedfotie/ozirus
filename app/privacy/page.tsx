'use client';

import React from 'react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main style={{ background: '#fff', color: '#111', fontFamily: 'DM Sans, sans-serif', padding: '80px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#7967FF', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← Retour à l'accueil</Link>
        
        <h1 style={{ fontFamily: 'Clash Display, sans-serif', fontSize: 40, marginTop: 32, marginBottom: 40 }}>Politique de Confidentialité</h1>
        
        <p style={{ color: '#666', marginBottom: 32 }}>Dernière mise à jour : 31 Mai 2026</p>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>1. Collecte des données</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Nous collectons les informations que vous nous fournissez directement lors de votre inscription à nos formations ou lors de l'achat de nos packs IA : nom, adresse email, numéro de téléphone et informations de paiement.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>2. Utilisation des données</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Vos données sont utilisées exclusivement pour :
          </p>
          <ul style={{ lineHeight: 1.7, color: '#444', paddingLeft: 20, marginTop: 12 }}>
            <li>Fournir et gérer votre accès aux formations.</li>
            <li>Traiter vos transactions.</li>
            <li>Vous envoyer des mises à jour sur nos produits ou des informations importantes concernant votre formation.</li>
            <li>Améliorer nos services et votre expérience utilisateur.</li>
          </ul>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>3. Partage des données</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Ozirus Agency ne vend, n'échange ni ne loue vos informations personnelles à des tiers. Vos données ne sont partagées qu'avec nos prestataires de services de confiance (paiement, hébergement de cours) pour le bon fonctionnement de nos services.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>4. Sécurité</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de vos informations personnelles. Vos informations de paiement sont traitées via des passerelles sécurisées et ne sont pas stockées sur nos serveurs.
          </p>
        </section>

        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>5. Vos Droits</h2>
          <p style={{ lineHeight: 1.7, color: '#444' }}>
            Conformément aux lois en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, contactez-nous à contact.fotie@gmail.com.
          </p>
        </section>

        <footer style={{ marginTop: 80, borderTop: '1px solid #eee', paddingTop: 40, textAlign: 'center' }}>
          <p style={{ color: '#999', fontSize: 14 }}>© {new Date().getFullYear()} Ozirus Agency · Douala, Cameroun</p>
        </footer>
      </div>
    </main>
  );
}
