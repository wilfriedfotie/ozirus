'use client';

import React, { useState, useEffect, useLayoutEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {
  Plus, Trash2, Printer,
  Settings, User, FileText, Briefcase,
  ChevronRight, ArrowLeft, Check, Copy,
  ShieldCheck, Clock, FilePlus,
  Layout, ListChecks, Database, Zap,
  Globe, Smartphone, Mail,
  Target, Rocket, X, Users, TrendingUp,
  BarChart2, Home, ClipboardList, RefreshCw, Save, FolderOpen, CalendarDays
} from 'lucide-react';
import { documentsService, DocumentKind, DocumentStatus, DOCUMENT_STATUS_LABELS } from './documents/documentsService';

/* ─── AUTH CONFIG ─────────────────────────────────── */
const ADMIN_SECRET_KEY = 'ozirus_admin_2026';
const ADMIN_ALLOWED_EMAILS = ['info.ozirus@gmail.com', 'contact.fotie@gmail.com'];
const PRIMARY_COLOR = '#7967FF';
const PRIMARY_LOGO_FALLBACK_FILTER = 'brightness(0) saturate(100%) invert(43%) sepia(91%) saturate(2126%) hue-rotate(224deg) brightness(101%) contrast(101%)';
const COMPANY_INFO = {
  name: 'Ozirus Agency',
  taxId: 'P030116814138J',
  registryId: 'RC/YAO/2021/B/145',
  address: 'Nkolbisson, Yaoundé, Cameroun',
  email: 'info.ozirus@gmail.com',
  phone: '+237 694 08 65 71',
  website: 'ozirus.agency',
};

/* ─── CATALOG DATA ────────────────────────────────── */
const CATALOG = [
  { 
    id: 'dev-mobile', 
    label: 'Application Mobile sur mesure (iOS & Android)', 
    price: 1800000, 
    subs: ['Discovery & UI/UX Design', 'Développement Flutter', 'Dashboard Admin Web', 'Déploiement Stores'] 
  },
  { 
    id: 'dev-saas', 
    label: 'Plateforme SaaS / Logiciel Métier', 
    price: 1500000, 
    subs: ['Analyse des processus', 'Architecture Database', 'Développement Frontend & Backend', 'Hébergement Cloud'] 
  },
  { 
    id: 'ia-chatbot', 
    label: 'Chatbot WhatsApp IA Pro', 
    price: 99000, 
    subs: ['Configuration API WhatsApp Business', 'Entraînement de l\'IA sur vos données', 'Prise de commande automatique', 'Support technique'] 
  },
  { id: 'pack-pme', label: 'Pack PME Automatisée', price: 349000, subs: ['Audit IA initial', 'Chatbot IA Pro', 'Automatisation CRM', 'Formation équipe'] },
];

/* ─── CONTRAT : TEXTES JURIDIQUES PAR DÉFAUT ──────── */
const DEFAULT_CONTRACT_TERMS = {
  confidentialite: 'Chaque Partie s\'engage à considérer comme strictement confidentielles toutes les informations techniques, commerciales et financières échangées dans le cadre du présent contrat, et à ne pas les divulguer à des tiers sans accord écrit préalable. Cet engagement demeure en vigueur pendant toute la durée du contrat et pour une période de deux (2) ans après son terme.',
  obligationsClient: '<ul><li>Désigner un interlocuteur unique habilité à valider les livrables.</li><li>Fournir dans les délais convenus les accès techniques, contenus, données et validations nécessaires à l\'exécution.</li><li>Formuler ses retours sur chaque livrable dans un délai de sept (7) jours ouvrés ; passé ce délai, le livrable est réputé accepté.</li><li>Régler les sommes dues selon l\'échéancier convenu à l\'article correspondant.</li></ul>',
  obligationsPrestataire: '<ul><li>Exécuter les prestations conformément au périmètre défini, dans les règles de l\'art.</li><li>Affecter les compétences nécessaires à la bonne réalisation du projet.</li><li>Informer le Client sans délai de toute difficulté susceptible d\'affecter le planning.</li><li>Assurer la confidentialité des données auxquelles il accède.</li></ul>',
  resiliation: 'Chaque Partie peut résilier le présent contrat en cas de manquement grave de l\'autre Partie, non réparé dans un délai de trente (30) jours après mise en demeure écrite restée sans effet. En cas de résiliation, les prestations effectivement réalisées à la date d\'effet restent dues au Prestataire, et les sommes déjà versées lui restent acquises à hauteur du travail accompli. Les livrables validés et payés sont remis au Client.',
  forceMajeure: 'Aucune des Parties ne pourra être tenue responsable d\'un manquement à ses obligations résultant d\'un cas de force majeure au sens du droit applicable (notamment : catastrophe naturelle, interruption prolongée des réseaux de télécommunication ou d\'électricité, décision des autorités publiques). La Partie affectée en informe l\'autre sans délai. Si l\'événement se prolonge au-delà de soixante (60) jours, chaque Partie peut résilier le contrat sans indemnité.',
  reversibilite: 'À l\'issue du contrat, quelle qu\'en soit la cause, le Prestataire remet au Client l\'ensemble des données lui appartenant dans un format standard exploitable (CSV a minima), ainsi que les accès aux environnements de production, sous réserve du complet règlement des sommes dues. Cette remise intervient dans un délai de trente (30) jours suivant la demande écrite du Client.',
  droitApplicable: 'Le présent contrat est régi par le droit camerounais. En cas de différend relatif à sa formation, son interprétation ou son exécution, les Parties s\'engagent à rechercher une solution amiable préalable. À défaut d\'accord dans un délai de trente (30) jours, le litige sera porté devant les tribunaux compétents de Yaoundé.',
};

/* ─── TYPES ───────────────────────────────────────── */
type DocType = 'PROPOSITION COMMERCIALE' | 'FACTURE' | 'BADGE' | 'CARTE DE VISITE' | 'SOCIAL';
type DocMode = 'PROPOSITION' | 'CONTRAT';
interface LineItem {
  id: string;
  description: string;
  longDescription: string;
  quantity: number;
  unitPrice: number;
  subItems: string[];
}
interface SocialImage {
  id: string;
  src: string;
  name: string;
  width: number;
  height: number;
}
interface CarouselSlide {
  title: string;
  text: string;
  images: SocialImage[];
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  );
}

function AdminContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [primaryLogoSrc, setPrimaryLogoSrc] = useState('/logo.png');

  const [docType, setDocType] = useState<DocType>('PROPOSITION COMMERCIALE');
  const [docMode, setDocMode] = useState<DocMode>('PROPOSITION');
  const [docNumber, setDocNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState('');
  
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientTaxId, setClientTaxId] = useState('');

  // Contrat : identification des parties & cadre juridique
  const [clientLegalRep, setClientLegalRep] = useState('');
  const [clientLegalRepRole, setClientLegalRepRole] = useState('');
  const [clientRegistryId, setClientRegistryId] = useState('');
  const [contractStartDate, setContractStartDate] = useState('');
  const [contractSignaturePlace, setContractSignaturePlace] = useState('Yaoundé');
  const [providerLegalRep, setProviderLegalRep] = useState('Fotie Wilfried Bonaventure');
  const [providerLegalRepRole, setProviderLegalRepRole] = useState('Gérant');
  const [termConfidentialite, setTermConfidentialite] = useState(DEFAULT_CONTRACT_TERMS.confidentialite);
  const [termObligationsClient, setTermObligationsClient] = useState(DEFAULT_CONTRACT_TERMS.obligationsClient);
  const [termObligationsPrestataire, setTermObligationsPrestataire] = useState(DEFAULT_CONTRACT_TERMS.obligationsPrestataire);
  const [termResiliation, setTermResiliation] = useState(DEFAULT_CONTRACT_TERMS.resiliation);
  const [termForceMajeure, setTermForceMajeure] = useState(DEFAULT_CONTRACT_TERMS.forceMajeure);
  const [termReversibilite, setTermReversibilite] = useState(DEFAULT_CONTRACT_TERMS.reversibilite);
  const [termDroitApplicable, setTermDroitApplicable] = useState(DEFAULT_CONTRACT_TERMS.droitApplicable);

  // Badge & Card Specific State
  const [personName, setPersonName] = useState('Wilfried Fotie');
  const [personRole, setPersonRole] = useState('CEO & Solutions Architect');
  const [personPhone, setPersonPhone] = useState('+237 694 08 65 71');
  const [personEmail, setPersonEmail] = useState('info.ozirus@gmail.com');
  const [personPhoto, setPersonPhoto] = useState('');

  // Social Media State
  const [socialTitle, setSocialTitle] = useState('Ozirus transforme votre PME avec l\'IA');
  const [socialSubtitle, setSocialSubtitle] = useState('Automatisez vos processus et gagnez 10h par semaine');
  const [socialType, setSocialType] = useState<'POST' | 'CAROUSEL'>('POST');
  const [socialTheme, setSocialTheme] = useState<'DARK' | 'LIGHT'>('DARK');
  const [socialSize, setSocialSize] = useState<'SQUARE' | 'PORTRAIT' | 'STORY' | 'LANDSCAPE'>('SQUARE');
  const [socialPattern, setSocialPattern] = useState<'GRID' | 'WAVES'>('GRID');
  const [socialFontSize, setSocialFontSize] = useState<number>(48);
  const [socialImages, setSocialImages] = useState<SocialImage[]>([]);
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([
    { title: 'Étape 01', text: 'Audit de vos processus actuels', images: [] },
    { title: 'Étape 02', text: 'Déploiement de votre agent IA', images: [] },
    { title: 'Étape 03', text: 'Formation de vos équipes', images: [] }
  ]);

  const readImageFile = (file: File): Promise<SocialImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const src = reader.result as string;
        const image = new Image();
        image.onload = () => {
          resolve({
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            src,
            name: file.name,
            width: image.naturalWidth || 1,
            height: image.naturalHeight || 1,
          });
        };
        image.onerror = () => {
          resolve({
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
            src,
            name: file.name,
            width: 1,
            height: 1,
          });
        };
        image.src = src;
      };
      reader.readAsDataURL(file);
    });
  };

  const getSocialImageFrameRatio = (imageCount: number, isCarousel = false) => {
    const contentWidth = isCarousel
      ? (socialSize === 'STORY' ? 300 : (socialSize === 'LANDSCAPE' ? 510 : 400))
      : (socialSize === 'STORY' ? 370 : (socialSize === 'LANDSCAPE' ? 680 : 480));
    const frameHeight = getSocialImageFrameHeight(imageCount, isCarousel);
    const gap = isCarousel ? 10 : 12;
    const cellWidth = (contentWidth - gap) / 2;

    return cellWidth / frameHeight;
  };

  const getSocialImageFrameHeight = (imageCount: number, isCarousel = false) => {
    const baseHeight = isCarousel
      ? (socialSize === 'LANDSCAPE' ? 74 : (socialSize === 'STORY' ? 125 : 108))
      : (socialSize === 'LANDSCAPE' ? 120 : (socialSize === 'STORY' ? 210 : 180));

    return imageCount === 1 ? Math.round(baseHeight * 1.22) : baseHeight;
  };

  const getSmartCropStyle = (image: SocialImage, frameRatio: number): React.CSSProperties => {
    const imageRatio = image.width / image.height;
    const ratioDelta = Math.abs(imageRatio - frameRatio) / frameRatio;
    const isWideCrop = imageRatio > frameRatio * 1.18;
    const isTallCrop = imageRatio < frameRatio * 0.82;

    return {
      width: '100%',
      height: '100%',
      display: 'block',
      objectFit: ratioDelta < 0.12 ? 'contain' : 'cover',
      objectPosition: isWideCrop ? 'center center' : (isTallCrop ? 'center 38%' : 'center center'),
      background: '#F8FAFC',
    };
  };

  const handleSocialImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const remainingSlots = 2 - socialImages.length;
    const files = Array.from(e.target.files || []).slice(0, remainingSlots);
    if (files.length) {
      const uploadedImages = await Promise.all(files.map(readImageFile));
      setSocialImages((current) => [...current, ...uploadedImages].slice(0, 2));
    }
    e.target.value = '';
  };

  const handleCarouselImagesChange = async (slideIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const slide = carouselSlides[slideIndex];
    const remainingSlots = 2 - slide.images.length;
    const files = Array.from(e.target.files || []).slice(0, remainingSlots);
    if (files.length) {
      const uploadedImages = await Promise.all(files.map(readImageFile));
      setCarouselSlides((current) => current.map((item, idx) => (
        idx === slideIndex ? { ...item, images: [...item.images, ...uploadedImages].slice(0, 2) } : item
      )));
    }
    e.target.value = '';
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [projectContext, setProjectContext] = useState('À la suite de nos échanges, nous avons identifié une opportunité majeure de transformation digitale pour votre structure, visant à automatiser vos opérations et maximiser votre impact sur le marché.');
  const [projectGoals, setProjectGoals] = useState('<ul><li>Optimisation des processus opérationnels</li><li>Amélioration de l\'expérience utilisateur client</li><li>Scalabilité de l\'infrastructure technique</li><li>Sécurisation des données critiques</li></ul>');
  const [projectExclusions, setProjectExclusions] = useState('<ul><li>Frais d\'hébergement cloud, noms de domaine, licences logicielles et APIs tierces non inclus sauf mention contraire.</li><li>Budget publicitaire, coûts SMS/WhatsApp, frais Apple/Google Store et passerelles de paiement à la charge du client.</li><li>Maintenance évolutive, nouvelles fonctionnalités et changements hors périmètre facturés séparément.</li></ul>');
  const [supportTerms, setSupportTerms] = useState('Support correctif inclus pendant 90 jours après livraison pour les anomalies bloquantes liées au périmètre validé. La maintenance évolutive et les SLA étendus font l\'objet d\'un contrat séparé.');
  const [conditionsPI, setConditionsPI] = useState('Le code source spécifique développé, hors infrastructure propre aux fournisseurs tiers utilisés (BSP, hébergeur, etc.), est cédé au client après règlement intégral. Les frameworks, bibliothèques tierces et outils internes préexistants restent exclus de cette cession. Les données du client sont exportables à tout moment (CSV a minima).');
  const [conditionsDelais, setConditionsDelais] = useState('Tout retard imputable au client (validation tardive, absence de données) entraîne un décalage équivalent du planning. En cas de dépassement significatif imputable à Ozirus Agency, une révision du calendrier de paiement est discutée avec le client.');
  const [conditionsImpayes, setConditionsImpayes] = useState('Tout retard de paiement au-delà de l\'échéance convenue entraîne l\'application de pénalités au taux annuel de 10%, majorées de frais de recouvrement forfaitaires.');
  const [projectContextTable, setProjectContextTable] = useState<TableData | null>(null);
  const [projectContextAfter, setProjectContextAfter] = useState('');
  const [projectContextMoreBlocks, setProjectContextMoreBlocks] = useState<ExtraBlock[]>([]);
  const [projectGoalsTable, setProjectGoalsTable] = useState<TableData | null>(null);
  const [projectGoalsAfter, setProjectGoalsAfter] = useState('');
  const [projectGoalsMoreBlocks, setProjectGoalsMoreBlocks] = useState<ExtraBlock[]>([]);
  const [projectExclusionsTable, setProjectExclusionsTable] = useState<TableData | null>(null);
  const [projectExclusionsAfter, setProjectExclusionsAfter] = useState('');
  const [projectExclusionsMoreBlocks, setProjectExclusionsMoreBlocks] = useState<ExtraBlock[]>([]);
  const [customSections, setCustomSections] = useState<{ id: string; title: string; content: string; contentAfter?: string; table: TableData | null; moreBlocks?: ExtraBlock[] }[]>([]);

  const [items, setItems] = useState<LineItem[]>([]);

  useEffect(() => {
    let isCancelled = false;
    const logo = new Image();
    logo.crossOrigin = 'anonymous';
    logo.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = logo.naturalWidth;
      canvas.height = logo.naturalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(logo, 0, 0);
      ctx.globalCompositeOperation = 'source-in';
      ctx.fillStyle = PRIMARY_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!isCancelled) {
        setPrimaryLogoSrc(canvas.toDataURL('image/png'));
      }
    };
    logo.src = '/logo.png';

    return () => {
      isCancelled = true;
    };
  }, []);
  const [applyTVA, setApplyTVA] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [acompte, setAcompte] = useState(0);

  const [timeline, setTimeline] = useState('6 à 12 semaines');
  const [paymentSteps, setPaymentSteps] = useState<{ label: string; percent: number }[]>([
    { label: 'Signature & Engagement', percent: 50 },
    { label: 'Livraison & Mise en service', percent: 50 },
  ]);
  const [activeTab, setActiveTab] = useState<'CLIENT' | 'PROJET' | 'FINANCE' | 'LEGAL' | 'IDENTITE' | 'SOCIAL'>('CLIENT');
  const [currency, setCurrency] = useState<'FCFA' | '€' | '$'>('FCFA');
  const [isGenerating, setIsGenerating] = useState(false);

  // Vue active du backoffice : hub d'accueil (null) ou éditeur de documents.
  const [activeSection, setActiveSection] = useState<'tools' | null>(null);

  // Document Firestore en cours d'édition (null = nouveau document non encore archivé).
  const [currentDocId, setCurrentDocId] = useState<string | null>(null);
  // Vrai dès qu'on édite un document archivé : empêche l'effet « Defaults » d'écraser
  // le numéro et les dates chargés depuis Firestore.
  const isEditingStoredDoc = React.useRef(false);
  const [docStatus, setDocStatus] = useState<DocumentStatus>('BROUILLON');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);
  // Export automatique demandé via `/admin?doc=<id>&print=1` depuis la bibliothèque.
  const [pendingPrint, setPendingPrint] = useState(false);

  // Notification non bloquante : `alert()` gèle toute la page pendant l'édition.
  const [toast, setToast] = useState<{ kind: 'success' | 'error' | 'info'; message: string } | null>(null);
  const toastTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (kind: 'success' | 'error' | 'info', message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ kind, message });
    toastTimerRef.current = setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => () => { if (toastTimerRef.current) clearTimeout(toastTimerRef.current); }, []);

  const buildPayload = () => ({
    docType, docMode, activeTab, docNumber, date, validUntil,
    clientName, clientCompany, clientEmail, clientAddress, clientTaxId,
    clientLegalRep, clientLegalRepRole, clientRegistryId,
    contractStartDate, contractSignaturePlace, providerLegalRep, providerLegalRepRole,
    termConfidentialite, termObligationsClient, termObligationsPrestataire,
    termResiliation, termForceMajeure, termReversibilite, termDroitApplicable,
    personName, personRole, personPhone, personEmail, personPhoto,
    socialTitle, socialSubtitle, socialType, socialTheme, socialSize, socialPattern, socialFontSize, socialImages, carouselSlides,
    applyTVA, discount, acompte, timeline, paymentSteps, currency,
    projectContext, projectGoals, projectExclusions, supportTerms, conditionsPI, conditionsDelais, conditionsImpayes,
    projectContextTable, projectContextAfter, projectContextMoreBlocks,
    projectGoalsTable, projectGoalsAfter, projectGoalsMoreBlocks,
    projectExclusionsTable, projectExclusionsAfter, projectExclusionsMoreBlocks,
    customSections, items
  });

  /** Applique un payload (Firestore ou localStorage) sur l'état de l'éditeur. */
  const applyPayload = (data: any) => {
    if (data.docType) setDocType(data.docType);
    if (data.docMode) setDocMode(data.docMode);
    if (data.activeTab) setActiveTab(data.activeTab);
    if (data.docNumber !== undefined) setDocNumber(data.docNumber);
    if (data.date !== undefined) setDate(data.date);
    if (data.validUntil !== undefined) setValidUntil(data.validUntil);
    if (data.clientName !== undefined) setClientName(data.clientName);
    if (data.clientCompany !== undefined) setClientCompany(data.clientCompany);
    if (data.clientEmail !== undefined) setClientEmail(data.clientEmail);
    if (data.clientAddress !== undefined) setClientAddress(data.clientAddress);
    if (data.clientTaxId !== undefined) setClientTaxId(data.clientTaxId);
    if (data.clientLegalRep !== undefined) setClientLegalRep(data.clientLegalRep);
    if (data.clientLegalRepRole !== undefined) setClientLegalRepRole(data.clientLegalRepRole);
    if (data.clientRegistryId !== undefined) setClientRegistryId(data.clientRegistryId);
    if (data.contractStartDate !== undefined) setContractStartDate(data.contractStartDate);
    if (data.contractSignaturePlace !== undefined) setContractSignaturePlace(data.contractSignaturePlace);
    if (data.providerLegalRep !== undefined) setProviderLegalRep(data.providerLegalRep);
    if (data.providerLegalRepRole !== undefined) setProviderLegalRepRole(data.providerLegalRepRole);
    if (data.termConfidentialite !== undefined) setTermConfidentialite(data.termConfidentialite);
    if (data.termObligationsClient !== undefined) setTermObligationsClient(data.termObligationsClient);
    if (data.termObligationsPrestataire !== undefined) setTermObligationsPrestataire(data.termObligationsPrestataire);
    if (data.termResiliation !== undefined) setTermResiliation(data.termResiliation);
    if (data.termForceMajeure !== undefined) setTermForceMajeure(data.termForceMajeure);
    if (data.termReversibilite !== undefined) setTermReversibilite(data.termReversibilite);
    if (data.termDroitApplicable !== undefined) setTermDroitApplicable(data.termDroitApplicable);
    if (data.personName !== undefined) setPersonName(data.personName);
    if (data.personRole !== undefined) setPersonRole(data.personRole);
    if (data.personPhone !== undefined) setPersonPhone(data.personPhone);
    if (data.personEmail !== undefined) setPersonEmail(data.personEmail);
    if (data.personPhoto !== undefined) setPersonPhoto(data.personPhoto);
    if (data.socialTitle !== undefined) setSocialTitle(data.socialTitle);
    if (data.socialSubtitle !== undefined) setSocialSubtitle(data.socialSubtitle);
    if (data.socialType) setSocialType(data.socialType);
    if (data.socialTheme) setSocialTheme(data.socialTheme);
    if (data.socialSize) setSocialSize(data.socialSize);
    if (data.socialPattern) setSocialPattern(data.socialPattern);
    if (data.socialFontSize !== undefined) setSocialFontSize(data.socialFontSize);
    if (data.socialImages) setSocialImages(data.socialImages);
    if (data.carouselSlides) setCarouselSlides(data.carouselSlides);
    if (data.applyTVA !== undefined) setApplyTVA(data.applyTVA);
    if (data.discount !== undefined) setDiscount(data.discount);
    if (data.acompte !== undefined) setAcompte(data.acompte);
    if (data.timeline !== undefined) setTimeline(data.timeline);
    if (data.paymentSteps) setPaymentSteps(data.paymentSteps);
    if (data.currency) setCurrency(data.currency);
    if (data.projectContext !== undefined) setProjectContext(data.projectContext);
    if (data.projectGoals !== undefined) setProjectGoals(data.projectGoals);
    if (data.projectExclusions !== undefined) setProjectExclusions(data.projectExclusions);
    if (data.supportTerms !== undefined) setSupportTerms(data.supportTerms);
    if (data.conditionsPI !== undefined) setConditionsPI(data.conditionsPI);
    if (data.conditionsDelais !== undefined) setConditionsDelais(data.conditionsDelais);
    if (data.conditionsImpayes !== undefined) setConditionsImpayes(data.conditionsImpayes);
    if (data.projectContextTable !== undefined) setProjectContextTable(data.projectContextTable);
    if (data.projectContextAfter !== undefined) setProjectContextAfter(data.projectContextAfter);
    if (data.projectGoalsTable !== undefined) setProjectGoalsTable(data.projectGoalsTable);
    if (data.projectGoalsAfter !== undefined) setProjectGoalsAfter(data.projectGoalsAfter);
    if (data.projectExclusionsTable !== undefined) setProjectExclusionsTable(data.projectExclusionsTable);
    if (data.projectExclusionsAfter !== undefined) setProjectExclusionsAfter(data.projectExclusionsAfter);
    if (data.projectContextMoreBlocks) setProjectContextMoreBlocks(data.projectContextMoreBlocks);
    if (data.projectGoalsMoreBlocks) setProjectGoalsMoreBlocks(data.projectGoalsMoreBlocks);
    if (data.projectExclusionsMoreBlocks) setProjectExclusionsMoreBlocks(data.projectExclusionsMoreBlocks);
    if (data.customSections) setCustomSections(data.customSections);
    if (data.items) setItems(data.items);
  };

  // Chargement initial : un document Firestore si `?doc=<id>`, sinon le brouillon local.
  useEffect(() => {
    const docId = searchParams.get('doc');

    if (docId) {
      let cancelled = false;
      // Posé avant le fetch : l'effet « Defaults » se déclenche dès que
      // `applyPayload` change docType/docMode et ne doit pas régénérer le numéro.
      isEditingStoredDoc.current = true;
      setIsLoadingDoc(true);
      documentsService
        .get(docId)
        .then((stored) => {
          if (cancelled) return;
          if (!stored) {
            isEditingStoredDoc.current = false;
            showToast('error', 'Document introuvable.');
            return;
          }
          applyPayload(stored.payload);
          setCurrentDocId(stored.id);
          setDocStatus(stored.status);
          setActiveSection('tools');
          // `?print=1` (bouton « Télécharger » de la bibliothèque) : l'export part
          // une fois l'aperçu paginé rendu, cf. l'effet d'auto-export plus bas.
          if (searchParams.get('print') === '1') setPendingPrint(true);
        })
        .catch((e) => console.error('Failed to load document from Firestore', e))
        .finally(() => { if (!cancelled) setIsLoadingDoc(false); });
      return () => { cancelled = true; };
    }

    try {
      const saved = localStorage.getItem('ozirus_editor_save');
      if (saved) applyPayload(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load save from localStorage', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Authorization check
  useEffect(() => {
    let isCancelled = false;
    const key = searchParams.get('key');
    const storedAuth = localStorage.getItem('ozirus_admin_auth');

    if (key === ADMIN_SECRET_KEY) {
      localStorage.setItem('ozirus_admin_auth', 'true');
      setIsAuthorized(true);
      router.replace('/admin');
      return;
    }

    const verifySession = async () => {
      if (storedAuth === 'true') {
        setIsAuthorized(true);
        return;
      }

      try {
        const response = await fetch('/api/auth/session', { credentials: 'include' });
        const session = await response.json();
        const email = session?.user?.email;

        if (!isCancelled && email && ADMIN_ALLOWED_EMAILS.includes(email)) {
          localStorage.setItem('ozirus_admin_auth', 'true');
          setIsAuthorized(true);
          return;
        }
      } catch (err) {
        console.error('Admin session check error:', err);
      }

      if (!isCancelled) {
        setIsAuthorized(false);
        router.replace('/login');
      }
    };

    verifySession();

    return () => {
      isCancelled = true;
    };
  }, [searchParams, router]);

  // Defaults
  useEffect(() => {
    // Ne pas régénérer numéro et échéance quand on ouvre un document existant
    // (`/admin?doc=<id>`) : ils font partie du document archivé. Sans ce garde, un
    // contrat converti depuis une proposition perdrait son numéro au chargement.
    if (!isEditingStoredDoc.current) {
      const prefix = docType === 'FACTURE' ? 'F' : (docMode === 'CONTRAT' ? 'CTR' : 'PC');
      setDocNumber(`${prefix}-${new Date().getFullYear()}-${Math.floor(Math.random()*1000).toString().padStart(3,'0')}`);
      const d = new Date(); d.setDate(d.getDate() + 30);
      setValidUntil(d.toISOString().split('T')[0]);
    }

    if (docType === 'BADGE' || docType === 'CARTE DE VISITE') {
      setActiveTab('IDENTITE');
    } else if (docType === 'SOCIAL') {
      setActiveTab('SOCIAL');
    } else {
      if (activeTab === 'IDENTITE' || activeTab === 'SOCIAL') setActiveTab('CLIENT');
    }
  }, [docType, docMode]);

  const addItem = (catalogId: string) => {
    const p = CATALOG.find(x => x.id === catalogId);
    if (!p) return;
    setItems([...items, { 
      id: Math.random().toString(36).substr(2,9), 
      description: p.label, 
      longDescription: `Solution technologique avancée conçue pour offrir performance, fiabilité et une expérience utilisateur optimale.`,
      unitPrice: p.price, 
      quantity: 1, 
      subItems: [...p.subs] 
    }]);
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));
  const updateItem = (id: string, field: keyof LineItem, value: any) => setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const addSubItem = (itemId: string) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: [...i.subItems, 'Nouvel élément...'] } : i));
  const updateSubItem = (itemId: string, idx: number, val: string) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: i.subItems.map((s, si) => si === idx ? val : s) } : i));
  const removeSubItem = (itemId: string, idx: number) => setItems(items.map(i => i.id === itemId ? { ...i, subItems: i.subItems.filter((_, si) => si !== idx) } : i));

  const addPaymentStep = () => setPaymentSteps([...paymentSteps, { label: 'Nouvelle étape', percent: 0 }]);
  const updatePaymentStep = (idx: number, field: 'label' | 'percent', value: string | number) => setPaymentSteps(paymentSteps.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  const removePaymentStep = (idx: number) => setPaymentSteps(paymentSteps.filter((_, i) => i !== idx));

  const addCustomSection = () => setCustomSections([...customSections, { id: Math.random().toString(36).substr(2, 9), title: 'Nouvelle section', content: '', table: null }]);
  const updateCustomSection = (id: string, field: 'title' | 'content' | 'contentAfter' | 'table' | 'moreBlocks', value: any) => setCustomSections(customSections.map(s => s.id === id ? { ...s, [field]: value } : s));
  const removeCustomSection = (id: string) => setCustomSections(customSections.filter(s => s.id !== id));

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + (i.unitPrice * i.quantity), 0), [items]);
  const totalHT = subtotal - discount;
  const tvaAmount = applyTVA ? totalHT * 0.1925 : 0;
  const totalTTC = totalHT + tvaAmount;
  const netAPayer = totalTTC - acompte;

  const formatPrice = (p: number) => {
    const formatted = new Intl.NumberFormat('fr-FR').format(p);
    return currency === 'FCFA' ? `${formatted} FCFA` : `${currency} ${formatted}`;
  };

  const formatDate = (value: string) => {
    if (!value) return 'Non renseignée';
    return new Intl.DateTimeFormat('fr-FR').format(new Date(value));
  };

  /**
   * Catégorie d'archivage : le mode CONTRAT prime sur le type de document, une
   * proposition commerciale passée en mode contrat est bien archivée comme contrat.
   */
  const documentKind: DocumentKind | null =
    docType === 'FACTURE' ? 'FACTURE'
    : docType === 'PROPOSITION COMMERCIALE' ? (docMode === 'CONTRAT' ? 'CONTRAT' : 'PROPOSITION')
    : null;

  /** Sauvegarde dans Firestore (collection `documents`) + brouillon local de secours. */
  const saveDocument = async () => {
    localStorage.setItem('ozirus_editor_save', JSON.stringify(buildPayload()));

    if (!documentKind) {
      showToast('info', 'Brouillon local sauvegardé (non archivé : type non facturable).');
      return;
    }

    setIsSaving(true);
    try {
      const draft = {
        kind: documentKind,
        status: docStatus,
        docNumber,
        date,
        clientName,
        clientCompany,
        currency,
        totalTTC,
        payload: buildPayload(),
      };

      if (currentDocId) {
        await documentsService.update(currentDocId, draft);
      } else {
        const id = await documentsService.create(draft);
        setCurrentDocId(id);
      }
      showToast('success', 'Document enregistré dans la bibliothèque !');
    } catch (e) {
      console.error('Failed to save document to Firestore', e);
      showToast('error', "Erreur lors de l'enregistrement. Le brouillon local a été conservé.");
    } finally {
      setIsSaving(false);
    }
  };

  const exportToPDF = async () => {
    const isCustomSize = docType === 'BADGE' || docType === 'CARTE DE VISITE' || docType === 'SOCIAL';
    const pages = document.querySelectorAll(isCustomSize ? '.print-target' : '.a4-page:not([aria-hidden="true"])');

    setIsGenerating(true);
    try {
      if (docType === 'SOCIAL' && socialType === 'POST') {
        // Export as High-Quality Image (JPG) for Single Post
        const page = pages[0] as HTMLElement;
        const canvas = await html2canvas(page, { scale: 3, useCORS: true });
        const link = document.createElement('a');
        link.download = `Ozirus_Post_${socialSize}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
      } else {
        // Handle PDF Export for DOCS, BADGE, CARTE, and SOCIAL CAROUSEL
        let pdfFormat: any = 'a4';
        let pdfOrientation: 'p' | 'l' = 'p';

        if (docType === 'BADGE') pdfFormat = [54, 86];
        else if (docType === 'CARTE DE VISITE') { pdfFormat = [85, 55]; pdfOrientation = 'l'; }
        else if (docType === 'SOCIAL' && socialType === 'CAROUSEL') {
          // Adjust PDF dimensions based on socialSize
          if (socialSize === 'SQUARE') pdfFormat = [200, 200];
          else if (socialSize === 'PORTRAIT') pdfFormat = [200, 250];
          else if (socialSize === 'STORY') pdfFormat = [200, 355];
          else if (socialSize === 'LANDSCAPE') { pdfFormat = [200, 112]; pdfOrientation = 'l'; }
        }

        const pdf = new jsPDF(pdfOrientation, 'mm', pdfFormat);

        for (let i = 0; i < pages.length; i++) {
          const page = pages[i] as HTMLElement;
          const canvas = await html2canvas(page, { scale: 3, useCORS: true, backgroundColor: '#FFFFFF' });
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          
          if (i > 0) pdf.addPage(pdfFormat, pdfOrientation);
          
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        }

        const fileName = `${docLabel.split(' ')[0]}_${isCustomSize ? (docType === 'SOCIAL' ? 'Carousel' : personName) : clientCompany || 'OZIRUS'}_${docNumber}.pdf`.replace(/\s+/g, '_');
        pdf.save(fileName);
      }
    } catch (err) {
      console.error("PDF Generation error:", err);
      showToast('error', 'Erreur lors de la génération du PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Nombre de pages A4 vu au tick précédent, pour détecter la fin de pagination.
  const lastPageCountRef = React.useRef(-1);

  /**
   * Auto-export après arrivée depuis la bibliothèque (`?doc=<id>&print=1`).
   * On attend que l'aperçu paginé ait effectivement produit ses pages `.a4-page` :
   * PaginatedA4Group mesure et découpe en plusieurs passes, exporter trop tôt
   * donnerait un PDF partiel (une seule page, ou aucune).
   */
  useEffect(() => {
    if (!pendingPrint || isLoadingDoc || isGenerating) return;

    let cancelled = false;
    let attempts = 0;

    const tryExport = () => {
      if (cancelled) return;
      const pages = document.querySelectorAll('.a4-page:not([aria-hidden="true"])');
      // Deux passes stables avec le même nombre de pages = pagination terminée.
      if (pages.length > 0 && pages.length === lastPageCountRef.current) {
        setPendingPrint(false);
        router.replace(`/admin?doc=${currentDocId ?? ''}`);
        exportToPDF();
        return;
      }
      lastPageCountRef.current = pages.length;
      if (++attempts > 40) {
        setPendingPrint(false);
        showToast('error', "L'aperçu n'a pas pu être préparé pour l'export.");
        return;
      }
      setTimeout(tryExport, 250);
    };

    const timer = setTimeout(tryExport, 600);
    return () => { cancelled = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrint, isLoadingDoc]);

  const [previewKey, setPreviewKey] = useState(0);
  const previewScrollRef = React.useRef<HTMLDivElement>(null);
  const previewScrollTopRef = React.useRef(0);

  const refreshPreview = () => {
    if (previewScrollRef.current) previewScrollTopRef.current = previewScrollRef.current.scrollTop;
    setPreviewKey(k => k + 1);
  };

  // Basculer proposition <-> contrat change la liste des blocs du document (préambule,
  // articles juridiques, signatures). PaginatedA4Group conserve sa pagination précédente
  // dans un state interne : sans remonter le sous-arbre, l'aperçu garde des blocs périmés
  // (p. ex. « 1. COMPRÉHENSION DU BESOIN » qui subsiste à côté de « PRÉAMBULE »).
  useEffect(() => {
    setPreviewKey(k => k + 1);
  }, [docMode]);

  useEffect(() => {
    // La restauration doit se faire après que PaginatedA4Group ait fini
    // son cycle de mesure (qui prend 1 ou 2 renders). On utilise un délai.
    const timer1 = setTimeout(() => {
      if (previewScrollRef.current) previewScrollRef.current.scrollTop = previewScrollTopRef.current;
    }, 50);
    const timer2 = setTimeout(() => {
      if (previewScrollRef.current) previewScrollRef.current.scrollTop = previewScrollTopRef.current;
    }, 200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [previewKey]);

  if (isAuthorized === null) return null;
  if (isAuthorized === false) return null;

  /* ─── HUB D'ACCUEIL ─── */
  if (activeSection === null) {
    const sections = [
      {
        id: 'tools' as const,
        label: 'Outils Création',
        description: 'Générez factures, propositions commerciales, badges, cartes de visite et posts réseaux sociaux.',
        icon: <FileText size={28} color="#7967FF" />,
        color: '#7967FF',
        action: () => setActiveSection('tools'),
        tags: ['Factures', 'Propositions', 'Badges', 'Social'],
      },
      {
        id: 'documents',
        label: 'Documents',
        description: 'Bibliothèque des propositions commerciales, factures et contrats : consultez, modifiez, téléchargez ou supprimez.',
        icon: <FolderOpen size={28} color="#8B5CF6" />,
        color: '#8B5CF6',
        action: () => router.push('/admin/documents'),
        tags: ['Propositions', 'Factures', 'Contrats', 'Archivage'],
      },
      {
        id: 'brief',
        label: 'Brief Client',
        description: 'Collectez les informations client de façon adaptative (site web, app, automatisation, autre) et exportez en Word.',
        icon: <ClipboardList size={28} color="#0EA5E9" />,
        color: '#0EA5E9',
        action: () => router.push('/admin/brief'),
        tags: ['Collecte', 'Adaptatif', 'Export Word'],
      },
      {
        id: 'leads',
        label: 'Leads IA',
        description: 'Lancez des campagnes de prospection B2B automatisées, scorez vos leads et générez des messages personnalisés.',
        icon: <Target size={28} color="#F59E0B" />,
        color: '#F59E0B',
        action: () => router.push('/admin/leads'),
        tags: ['Campagnes', 'Scoring', 'CRM', 'Export CSV'],
      },
      {
        id: 'marketing',
        label: 'Plan Marketing',
        description: 'Gérez vos objectifs marketing hebdomadaires, suivez vos secteurs cibles et planifiez vos actions.',
        icon: <TrendingUp size={28} color="#10B981" />,
        color: '#10B981',
        action: () => router.push('/admin/marketing'),
        tags: ['Objectifs', 'Secteurs', 'Todos', 'Suivi'],
      },
      {
        id: 'mvp-roadmap',
        label: 'Roadmap MVP',
        description: 'Plan marketing pour vendre l\'offre MVP : personas, canaux et budget ads, scripts de prospection, script vidéo et plan semaine par semaine.',
        icon: <Rocket size={28} color="#F97316" />,
        color: '#F97316',
        action: () => router.push('/admin/mvp-roadmap'),
        tags: ['Personas', 'Ads', 'Scripts', 'Vidéo', 'Plan'],
      },
      {
        id: 'planning',
        label: 'Plannings',
        description: 'Créez et sauvegardez les plannings des contrats signés, avec responsabilités, aperçu et export PDF.',
        icon: <CalendarDays size={28} color="#14B8A6" />,
        color: '#14B8A6',
        action: () => router.push('/admin/planning'),
        tags: ['Contrats signés', 'Éditeur', 'Firebase', 'PDF'],
      },
      {
        id: 'core',
        label: 'Ozirus Core',
        description: 'Accédez aux données internes, scripts IA et ressources techniques de l\'agence.',
        icon: <Zap size={28} color="#6366F1" />,
        color: '#6366F1',
        action: () => router.push('/admin/core'),
        tags: ['IA', 'Scripts', 'Ressources', 'Interne'],
      },
      {
        id: 'manager',
        label: 'Manager',
        description: 'Tableau de bord de gestion des projets clients et suivi des livrables.',
        icon: <BarChart2 size={28} color="#EC4899" />,
        color: '#EC4899',
        action: () => router.push('/admin/manager'),
        tags: ['Projets', 'Clients', 'Livrables'],
      },
    ];

    return (
      <div style={{ minHeight: '100vh', background: '#F1F5F9' }}>
        {/* Header */}
        <div style={{ background: '#FFF', borderBottom: '1px solid #E2E8F0', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, background: '#7967FF15', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={20} color="#7967FF" />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0F172A', margin: 0 }}>Ozirus Admin</h1>
              <p style={{ fontSize: 11, color: '#94A3B8', margin: 0 }}>Digital Excellence Framework</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#64748B', border: '1px solid #E2E8F0', padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
          >
            <Home size={14} /> Retour au site
          </button>
        </div>

        {/* Body */}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 32px' }}>
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0F172A', margin: '0 0 8px' }}>Tableau de bord</h2>
            <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>Choisissez une section pour commencer.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={s.action}
                style={{
                  background: '#FFF',
                  border: `1px solid #E2E8F0`,
                  borderRadius: 16,
                  padding: 28,
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${s.color}22`;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${s.color}44`;
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#E2E8F0';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Accent top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: s.color, borderRadius: '16px 16px 0 0' }} />

                <div style={{ width: 52, height: 52, background: s.color + '15', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {s.icon}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0F172A', margin: 0 }}>{s.label}</h3>
                    <ChevronRight size={16} color="#CBD5E1" />
                  </div>
                  <p style={{ fontSize: 13, color: '#64748B', margin: 0, lineHeight: 1.6 }}>{s.description}</p>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, fontWeight: 700, background: s.color + '12', color: s.color, padding: '3px 9px', borderRadius: 20 }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isDoc = docType === 'PROPOSITION COMMERCIALE';
  const isContract = isDoc && docMode === 'CONTRAT';
  // En mode contrat, le libellé du document et son intitulé de page de garde changent.
  const docLabel = isContract ? 'CONTRAT DE PRESTATION' : docType;

  // Numérotation continue des articles en mode contrat. Le préambule n'est pas numéroté :
  // viennent d'abord les sections personnalisées, puis les articles fixes.
  //
  // La numérotation doit être PURE : `PaginatedA4Group` rend chaque bloc deux fois (une
  // passe de mesure hors écran + les pages visibles), donc un compteur mutable incrémenté
  // au fil du rendu donnerait des numéros différents entre les deux passes. On calcule
  // donc l'ordre une seule fois ici, et chaque titre lit son rang dans cette table.
  // Simple tableau (pas de useMemo) : ce composant comporte des early returns au-dessus,
  // un hook ici violerait les Rules of Hooks.
  const contractArticleOrder = [
    ...customSections.map(s => `custom:${s.id}`),
    ...(items.length > 0 ? ['objet'] : []),
    'prix',
    'echeancier',
    'conditions',
    'obligations',
    'confidentialite',
    'resiliation',
    'forceMajeure',
    'reversibilite',
    'droitApplicable',
    'modalites',
  ];

  const sectionHeading = (id: string, contractTitle: string, proposalTitle: string) => {
    if (!isContract) return proposalTitle;
    const rank = contractArticleOrder.indexOf(id);
    return rank === -1 ? contractTitle : `ARTICLE ${rank + 1} — ${contractTitle}`;
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#F1F5F9', overflow: 'hidden', gap: 20 }}>
      {toast && (
        <div
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 18px', borderRadius: 12, fontSize: 12.5, fontWeight: 700, color: '#FFF',
            background: toast.kind === 'success' ? '#10B981' : toast.kind === 'error' ? '#EF4444' : '#0F172A',
            boxShadow: '0 8px 24px rgba(15,23,42,0.22)',
          }}
        >
          {toast.kind === 'success' ? <Check size={15} /> : toast.kind === 'error' ? <X size={15} /> : <FileText size={15} />}
          {toast.message}
        </div>
      )}
      
      {/* ─── LEFT PANEL: CONFIG ─── */}
      <div style={{ width: 600, flexShrink: 0, background: '#FFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: '10px 0 30px rgba(0,0,0,0.02)', zIndex: 10 }}>
        
        <div style={{ padding: '24px', borderBottom: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => setActiveSection(null)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                <ArrowLeft size={13} /> Accueil
              </button>
              <div>
                <h1 style={{ fontSize: 15, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
                  <FileText size={16} color="#7967FF" />
                  Outils Création
                </h1>
                <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 1, marginBottom: 0 }}>Docs · Badges · Social</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                onClick={() => router.push('/admin/documents')}
                title="Bibliothèque de documents"
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', color: '#475569', border: '1px solid #E2E8F0', padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}
              >
                <FolderOpen size={14} />
              </button>
              <button
                onClick={saveDocument}
                disabled={isSaving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#7967FF', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', opacity: isSaving ? 0.6 : 1 }}
              >
                <Save size={14} /> {isSaving ? 'Envoi...' : 'Sauvegarder'}
              </button>
            </div>
          </div>

          {isLoadingDoc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, fontSize: 11, fontWeight: 700, color: '#64748B' }}>
              <Clock size={13} className="animate-spin" /> Chargement du document...
            </div>
          )}

          {documentKind && !isLoadingDoc && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '8px 10px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {currentDocId ? 'Édition' : 'Nouveau'}
              </span>
              <select
                value={docStatus}
                onChange={(e) => setDocStatus(e.target.value as DocumentStatus)}
                style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11, fontWeight: 700, color: '#0F172A', background: '#FFF', outline: 'none' }}
              >
                {Object.entries(DOCUMENT_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              {currentDocId && (
                <button
                  onClick={() => {
                    isEditingStoredDoc.current = false;
                    setCurrentDocId(null);
                    setDocStatus('BROUILLON');
                    router.replace('/admin');
                  }}
                  title="Détacher pour créer un nouveau document"
                  style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 8, padding: '6px 10px', fontSize: 10, fontWeight: 800, color: '#64748B', cursor: 'pointer' }}
                >
                  DUPLIQUER
                </button>
              )}
            </div>
          )}

          <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 }}>
            <button onClick={() => setDocType('FACTURE')} style={{ ...tabBtn, padding: '6px 8px', background: docType === 'FACTURE' ? '#FFF' : 'transparent', color: docType === 'FACTURE' ? '#7967FF' : '#64748B' }}>FACTURE</button>
            <button onClick={() => setDocType('PROPOSITION COMMERCIALE')} style={{ ...tabBtn, padding: '6px 8px', background: docType === 'PROPOSITION COMMERCIALE' ? '#FFF' : 'transparent', color: docType === 'PROPOSITION COMMERCIALE' ? '#7967FF' : '#64748B' }}>DOCS</button>
            <button onClick={() => setDocType('BADGE')} style={{ ...tabBtn, padding: '6px 8px', background: docType === 'BADGE' ? '#FFF' : 'transparent', color: docType === 'BADGE' ? '#7967FF' : '#64748B' }}>BADGE</button>
            <button onClick={() => setDocType('SOCIAL')} style={{ ...tabBtn, padding: '6px 8px', background: docType === 'SOCIAL' ? '#FFF' : 'transparent', color: docType === 'SOCIAL' ? '#7967FF' : '#64748B' }}>SOCIAL</button>
            <button onClick={() => setDocType('CARTE DE VISITE')} style={{ ...tabBtn, padding: '6px 8px', background: docType === 'CARTE DE VISITE' ? '#FFF' : 'transparent', color: docType === 'CARTE DE VISITE' ? '#7967FF' : '#64748B' }}>CARTE</button>
          </div>

          {isDoc && (
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: 4, borderRadius: 10, gap: 1 }}>
                <button
                  onClick={() => setDocMode('PROPOSITION')}
                  style={{ ...tabBtn, flex: 1, padding: '8px', background: docMode === 'PROPOSITION' ? '#FFF' : 'transparent', color: docMode === 'PROPOSITION' ? '#7967FF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <FileText size={13} /> PROPOSITION
                </button>
                <button
                  onClick={() => setDocMode('CONTRAT')}
                  style={{ ...tabBtn, flex: 1, padding: '8px', background: docMode === 'CONTRAT' ? '#FFF' : 'transparent', color: docMode === 'CONTRAT' ? '#7967FF' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <ShieldCheck size={13} /> CONTRAT
                </button>
              </div>
              <p style={{ fontSize: 10, color: '#94A3B8', marginTop: 8, lineHeight: 1.5 }}>
                {isContract
                  ? 'Mode contrat : périmètre, prix et échéancier deviennent des articles engageants. Complétez l\'identification des parties dans l\'onglet Client.'
                  : 'Mode proposition : document commercial avec offre valable jusqu\'à une date limite.'}
              </p>
            </div>
          )}
        </div>

        {/* Local Nav */}
        <div style={{ display: 'flex', padding: '0 24px', borderBottom: '1px solid #F1F5F9', gap: 16 }}>
          {isDoc ? (
            <>
              <button onClick={() => setActiveTab('CLIENT')} style={{ ...subTab, color: activeTab === 'CLIENT' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'CLIENT' ? '#7967FF' : 'transparent' }}><User size={14} /></button>
              <button onClick={() => setActiveTab('PROJET')} style={{ ...subTab, color: activeTab === 'PROJET' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'PROJET' ? '#7967FF' : 'transparent' }}><Layout size={14} /></button>
              <button onClick={() => setActiveTab('FINANCE')} style={{ ...subTab, color: activeTab === 'FINANCE' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'FINANCE' ? '#7967FF' : 'transparent' }}><Briefcase size={14} /></button>
              <button onClick={() => setActiveTab('LEGAL')} style={{ ...subTab, color: activeTab === 'LEGAL' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'LEGAL' ? '#7967FF' : 'transparent' }}><ShieldCheck size={14} /></button>
            </>
          ) : docType === 'FACTURE' ? (
            <button style={{ ...subTab, color: '#7967FF', borderBottomColor: '#7967FF' }}><FilePlus size={14} /></button>
          ) : docType === 'SOCIAL' ? (
            <button onClick={() => setActiveTab('SOCIAL')} style={{ ...subTab, color: activeTab === 'SOCIAL' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'SOCIAL' ? '#7967FF' : 'transparent' }}><Layout size={14} /></button>
          ) : (
            <button onClick={() => setActiveTab('IDENTITE')} style={{ ...subTab, color: activeTab === 'IDENTITE' ? '#7967FF' : '#94A3B8', borderBottomColor: activeTab === 'IDENTITE' ? '#7967FF' : 'transparent' }}><User size={14} /></button>
          )}
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {docType === 'SOCIAL' && activeTab === 'SOCIAL' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div style={{ background: '#F8FAFC', padding: 16, borderRadius: 16, border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <p style={sectionTitle}>Format & Style</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => setSocialType('POST')} style={{ ...tabBtn, flex: 1, background: socialType === 'POST' ? '#7967FF' : '#FFF', color: socialType === 'POST' ? '#FFF' : '#64748B', border: socialType === 'POST' ? 'none' : '1px solid #E2E8F0', boxShadow: socialType === 'POST' ? '0 4px 12px rgba(121,103,255,0.2)' : 'none' }}>Post Unique</button>
                    <button onClick={() => setSocialType('CAROUSEL')} style={{ ...tabBtn, flex: 1, background: socialType === 'CAROUSEL' ? '#7967FF' : '#FFF', color: socialType === 'CAROUSEL' ? '#FFF' : '#64748B', border: socialType === 'CAROUSEL' ? 'none' : '1px solid #E2E8F0', boxShadow: socialType === 'CAROUSEL' ? '0 4px 12px rgba(121,103,255,0.2)' : 'none' }}>Carrousel IA</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setSocialTheme('DARK')} style={{ ...tabBtn, flex: 1, background: socialTheme === 'DARK' ? '#0F172A' : '#FFF', color: socialTheme === 'DARK' ? '#FFF' : '#64748B', border: socialTheme === 'DARK' ? 'none' : '1px solid #E2E8F0' }}>Dark Mode</button>
                    <button onClick={() => setSocialTheme('LIGHT')} style={{ ...tabBtn, flex: 1, background: socialTheme === 'LIGHT' ? '#F8FAFC' : '#FFF', color: socialTheme === 'LIGHT' ? '#0F172A' : '#64748B', border: socialTheme === 'LIGHT' ? 'none' : '1px solid #E2E8F0' }}>Light Mode</button>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={() => setSocialPattern('GRID')} style={{ ...tabBtn, flex: 1, background: socialPattern === 'GRID' ? '#7967FF15' : '#FFF', color: socialPattern === 'GRID' ? '#7967FF' : '#64748B', border: socialPattern === 'GRID' ? '1px solid #7967FF33' : '1px solid #E2E8F0' }}>Motif : Grille</button>
                    <button onClick={() => setSocialPattern('WAVES')} style={{ ...tabBtn, flex: 1, background: socialPattern === 'WAVES' ? '#7967FF15' : '#FFF', color: socialPattern === 'WAVES' ? '#7967FF' : '#64748B', border: socialPattern === 'WAVES' ? '1px solid #7967FF33' : '1px solid #E2E8F0' }}>Motif : Waves</button>
                  </div>
                  </div>

                <div>
                  <p style={sectionTitle}>Plateforme / Dimensions</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginTop: 8 }}>
                    {[
                      { id: 'SQUARE', label: 'LinkedIn', desc: 'Carré 1:1' },
                      { id: 'SQUARE', label: 'Facebook', desc: 'Carré 1:1' },
                      { id: 'LANDSCAPE', label: 'Twitter', desc: 'Vignette 16:9' },
                      { id: 'PORTRAIT', label: 'Instagram', desc: 'Portrait 4:5' },
                      { id: 'STORY', label: 'Story', desc: 'Mobile 9:16' }
                    ].map((sz, idx) => {
                      const isActive = socialSize === sz.id && (
                        (sz.label === 'LinkedIn' && socialSize === 'SQUARE') || 
                        (sz.label === 'Facebook' && socialSize === 'SQUARE') ||
                        (sz.label === 'Twitter' && socialSize === 'LANDSCAPE') ||
                        (sz.label === 'Instagram' && socialSize === 'PORTRAIT') ||
                        (sz.label === 'Story' && socialSize === 'STORY')
                      );
                      // Simplified selection for demo, we'll just use the ID but keep labels unique-ish
                      return (
                        <button 
                          key={idx}
                          onClick={() => setSocialSize(sz.id as any)}
                          style={{ 
                            padding: '10px 4px', borderRadius: 10, fontSize: 10, fontWeight: 800,
                            background: socialSize === sz.id ? '#7967FF' : '#FFF',
                            color: socialSize === sz.id ? '#FFF' : '#64748B',
                            border: socialSize === sz.id ? 'none' : '1px solid #E2E8F0',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2
                          }}
                        >
                          <span style={{ fontSize: 9 }}>{sz.label}</span>
                          <span style={{ fontSize: 7, opacity: 0.7 }}>{sz.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <p style={sectionTitle}>Taille Police</p>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#7967FF' }}>{socialFontSize}px</span>
                  </div>
                  <input 
                    type="range" min="24" max="80" step="2" 
                    value={socialFontSize} 
                    onChange={e => setSocialFontSize(parseInt(e.target.value))} 
                    style={{ width: '100%', accentColor: '#7967FF' }} 
                  />
                </div>
              </div>

              {socialType === 'POST' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Accroche principale</label>
                    <textarea value={socialTitle} onChange={e => setSocialTitle(e.target.value)} style={{ ...inputStyle, minHeight: 100 }} placeholder="Ex: Comment l'IA transforme votre business..." />
                  </div>
                  <div>
                    <label style={labelStyle}>Appel à l'action</label>
                    <RichEditor value={socialSubtitle} onChange={setSocialSubtitle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Images du post ({socialImages.length}/2)</label>
                    <input type="file" accept="image/*" multiple onChange={handleSocialImagesChange} disabled={socialImages.length >= 2} style={{ ...inputStyle, padding: '8px', cursor: socialImages.length >= 2 ? 'not-allowed' : 'pointer', opacity: socialImages.length >= 2 ? 0.6 : 1 }} />
                    {socialImages.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 10 }}>
                        {socialImages.map((image) => (
                          <div key={image.id} style={{ position: 'relative', height: 72, borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                            <img src={image.src} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => setSocialImages(socialImages.filter((item) => item.id !== image.id))} style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 8, border: 'none', background: 'rgba(15,23,42,0.75)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Supprimer l'image">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={sectionTitle}>Séquence de slides ({carouselSlides.length})</p>
                    <span style={{ fontSize: 10, color: '#7967FF', fontWeight: 800 }}>DÉFILEMENT HORIZONTAL →</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {carouselSlides.map((slide, idx) => (
                      <div key={idx} style={{ background: '#FFF', border: '1px solid #E2E8F0', padding: 16, borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 24, height: 24, background: '#7967FF15', color: '#7967FF', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 900 }}>{idx + 1}</span>
                                <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>Slide de contenu</span>
                            </div>
                            <button onClick={() => setCarouselSlides(carouselSlides.filter((_, i) => i !== idx))} style={{ width: 28, height: 28, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', background: '#FEF2F2', border: 'none' }}><Trash2 size={14} /></button>
                        </div>
                        <input type="text" value={slide.title} onChange={e => setCarouselSlides(carouselSlides.map((s, i) => i === idx ? { ...s, title: e.target.value } : s))} style={{ ...inputStyle, padding: '8px 12px', fontSize: 12, fontWeight: 700 }} placeholder="Titre percutant" />
                        <div style={{ marginTop: 4 }}>
                          <RichEditor value={slide.text} onChange={(val) => setCarouselSlides(carouselSlides.map((s, i) => i === idx ? { ...s, text: val } : s))} />
                        </div>
                        <div>
                          <label style={labelStyle}>Images de la slide ({slide.images.length}/2)</label>
                          <input type="file" accept="image/*" multiple onChange={(e) => handleCarouselImagesChange(idx, e)} disabled={slide.images.length >= 2} style={{ ...inputStyle, padding: '8px', cursor: slide.images.length >= 2 ? 'not-allowed' : 'pointer', opacity: slide.images.length >= 2 ? 0.6 : 1 }} />
                          {slide.images.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, marginTop: 10 }}>
                              {slide.images.map((image) => (
                                <div key={image.id} style={{ position: 'relative', height: 64, borderRadius: 10, overflow: 'hidden', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                                  <img src={image.src} alt={image.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  <button onClick={() => setCarouselSlides(carouselSlides.map((s, i) => i === idx ? { ...s, images: s.images.filter((item) => item.id !== image.id) } : s))} style={{ position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 7, border: 'none', background: 'rgba(15,23,42,0.75)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} aria-label="Supprimer l'image">
                                    <X size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCarouselSlides([...carouselSlides, { title: 'Nouveau Titre', text: 'Ajoutez une explication claire et concise ici.', images: [] }])} 
                    style={{ ...primaryBtnStyle, background: '#FFF', color: '#7967FF', border: '2px dashed #7967FF33', boxShadow: 'none', marginTop: 8 }}
                  >
                    <Plus size={18} /> Ajouter une étape
                  </button>
                </div>
              )}
            </div>
          )}

          {(docType === 'BADGE' || docType === 'CARTE DE VISITE') && activeTab === 'IDENTITE' && (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <p style={sectionTitle}>Informations Personnel</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <input type="text" placeholder="Nom Complet" value={personName} onChange={e => setPersonName(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Poste / Titre" value={personRole} onChange={e => setPersonRole(e.target.value)} style={inputStyle} />
                    <input type="text" placeholder="Téléphone" value={personPhone} onChange={e => setPersonPhone(e.target.value)} style={inputStyle} />
                    <input type="email" placeholder="Email" value={personEmail} onChange={e => setPersonEmail(e.target.value)} style={inputStyle} />
                    <div>
                      <label style={labelStyle}>Photo du Badge (Upload)</label>
                      <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ ...inputStyle, padding: '8px' }} />
                      {personPhoto && <p style={{ fontSize: 10, color: '#22C55E', marginTop: 4, fontWeight: 700 }}>✓ Image chargée</p>}
                    </div>
                  </div>
                </div>
             </div>
          )}

          {docType === 'FACTURE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <p style={sectionTitle}>Client</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="text" placeholder="Nom du contact" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Entreprise" value={clientCompany} onChange={e => setClientCompany(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Adresse" value={clientAddress} onChange={e => setClientAddress(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="NIU / Numéro fiscal (optionnel)" value={clientTaxId} onChange={e => setClientTaxId(e.target.value)} style={inputStyle} />
                </div>
              </div>

              <div>
                <p style={sectionTitle}>Document</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Numéro</label>
                    <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Devise</label>
                    <select value={currency} onChange={e => setCurrency(e.target.value as any)} style={inputStyle}>
                      <option value="FCFA">FCFA</option>
                      <option value="€">EUR (€)</option>
                      <option value="$">USD ($)</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Date d'émission</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Échéance paiement</label>
                    <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              <div>
                <p style={sectionTitle}>Lignes de facturation</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          style={{ ...inputStyle, padding: '8px 10px' }}
                          value={item.description}
                          onChange={e => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Description de la prestation"
                        />
                        <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 4, flexShrink: 0 }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ ...labelStyle, fontSize: 9 }}>Quantité</label>
                          <input
                            type="number"
                            style={{ ...inputStyle, padding: '8px 10px' }}
                            value={item.quantity}
                            onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))}
                          />
                        </div>
                        <div style={{ flex: 2 }}>
                          <label style={{ ...labelStyle, fontSize: 9 }}>Prix unitaire</label>
                          <input
                            type="number"
                            style={{ ...inputStyle, padding: '8px 10px' }}
                            value={item.unitPrice}
                            onChange={e => updateItem(item.id, 'unitPrice', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setItems([...items, { id: Math.random().toString(36).substr(2, 9), description: '', longDescription: '', unitPrice: 0, quantity: 1, subItems: [] }])}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, border: '1px dashed #CBD5E1', background: 'none', color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <Plus size={14} /> Ajouter une ligne
                  </button>
                </div>
              </div>

              <div>
                <p style={sectionTitle}>Finance</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Remise ({currency})</label>
                      <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Acompte déjà versé</label>
                      <input type="number" value={acompte} onChange={e => setAcompte(Number(e.target.value))} style={inputStyle} />
                    </div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>
                    <input type="checkbox" checked={applyTVA} onChange={e => setApplyTVA(e.target.checked)} />
                    Appliquer la TVA (19,25%)
                  </label>
                </div>
              </div>
            </div>
          )}

          {isDoc && activeTab === 'CLIENT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={sectionTitle}>Identité Client</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input type="text" placeholder="Nom du contact" value={clientName} onChange={e => setClientName(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="Entreprise" value={clientCompany} onChange={e => setClientCompany(e.target.value)} style={inputStyle} />
                  <input type="text" placeholder="NIU / Identifiant fiscal client" value={clientTaxId} onChange={e => setClientTaxId(e.target.value)} style={inputStyle} />
                  <input type="email" placeholder="Email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} style={inputStyle} />
                  <textarea placeholder="Adresse complète" value={clientAddress} onChange={e => setClientAddress(e.target.value)} style={{ ...inputStyle, minHeight: 80 }} />
                </div>
              </div>

              {isContract && (
                <>
                  <div>
                    <p style={sectionTitle}>Signataire côté client</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Représentant légal</label>
                        <input type="text" placeholder="Nom du signataire" value={clientLegalRep} onChange={e => setClientLegalRep(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Qualité du signataire</label>
                        <input type="text" placeholder="Gérant, Directeur Général…" value={clientLegalRepRole} onChange={e => setClientLegalRepRole(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Registre du commerce (RCCM)</label>
                        <input type="text" placeholder="RC/…" value={clientRegistryId} onChange={e => setClientRegistryId(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <p style={sectionTitle}>Signataire côté Ozirus</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div>
                        <label style={labelStyle}>Représentant légal</label>
                        <input type="text" value={providerLegalRep} onChange={e => setProviderLegalRep(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Qualité</label>
                        <input type="text" value={providerLegalRepRole} onChange={e => setProviderLegalRepRole(e.target.value)} style={inputStyle} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div>
                <p style={sectionTitle}>Document</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} style={inputStyle} />
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} style={inputStyle} />
                  {isContract ? (
                    <>
                      <div>
                        <label style={labelStyle}>Entrée en vigueur</label>
                        <input type="date" value={contractStartDate} onChange={e => setContractStartDate(e.target.value)} style={inputStyle} />
                      </div>
                      <div>
                        <label style={labelStyle}>Fait à</label>
                        <input type="text" value={contractSignaturePlace} onChange={e => setContractSignaturePlace(e.target.value)} style={inputStyle} />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label style={labelStyle}>Offre valable jusqu’au</label>
                      <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)} style={inputStyle} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isDoc && activeTab === 'PROJET' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <p style={sectionTitle}>Vision du projet</p>
                <div style={{ marginBottom: 12 }}>
                   <label style={labelStyle}>Contexte stratégique</label>
                   <RichEditor value={projectContext} onChange={setProjectContext} table={projectContextTable} onTableChange={setProjectContextTable} valueAfter={projectContextAfter} onChangeAfter={setProjectContextAfter} moreBlocks={projectContextMoreBlocks} onMoreBlocksChange={setProjectContextMoreBlocks} />
                </div>
                <div>
                   <label style={labelStyle}>Objectifs de performance</label>
                   <RichEditor value={projectGoals} onChange={setProjectGoals} table={projectGoalsTable} onTableChange={setProjectGoalsTable} valueAfter={projectGoalsAfter} onChangeAfter={setProjectGoalsAfter} moreBlocks={projectGoalsMoreBlocks} onMoreBlocksChange={setProjectGoalsMoreBlocks} />
                </div>
                <div style={{ marginTop: 12 }}>
                   <label style={labelStyle}>Périmètre non inclus</label>
                   <RichEditor value={projectExclusions} onChange={setProjectExclusions} table={projectExclusionsTable} onTableChange={setProjectExclusionsTable} valueAfter={projectExclusionsAfter} onChangeAfter={setProjectExclusionsAfter} moreBlocks={projectExclusionsMoreBlocks} onMoreBlocksChange={setProjectExclusionsMoreBlocks} />
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Ingénierie & Services</p>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <select onChange={(e) => { addItem(e.target.value); e.target.value=''; }} style={{ ...inputStyle, flex: 1 }}>
                    <option value="">+ Catalogue Standard</option>
                    {CATALOG.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                  <button 
                    onClick={() => setItems([...items, { 
                      id: Math.random().toString(36).substr(2,9), 
                      description: 'Nouveau Module', 
                      longDescription: 'Détails de l\'architecture technique et fonctionnelle...', 
                      unitPrice: 0, 
                      quantity: 1, 
                      subItems: [] 
                    }])}
                    style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 10, padding: '0 12px', color: '#7967FF', fontWeight: 700, fontSize: 20 }}
                  >+</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {items.map(item => (
                    <div key={item.id} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                        <input type="text" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} style={{ ...inputStyle, fontWeight: 700, flex: 1 }} />
                        <button onClick={() => removeItem(item.id)} style={{ color: '#EF4444' }}><Trash2 size={16} /></button>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <RichEditor value={item.longDescription} onChange={(val) => updateItem(item.id, 'longDescription', val)} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                        {item.subItems.map((s, idx) => (
                          <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input type="text" value={s} onChange={e => updateSubItem(item.id, idx, e.target.value)} style={{ ...inputStyle, fontSize: 12, padding: '6px 10px' }} />
                            <button onClick={() => removeSubItem(item.id, idx)} style={{ color: '#94A3B8' }}><Trash2 size={12} /></button>
                          </div>
                        ))}
                        <button onClick={() => addSubItem(item.id)} style={{ fontSize: 11, fontWeight: 700, color: '#7967FF', textAlign: 'left', marginTop: 4 }}>+ Spécificité technique</button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                        <input type="number" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', parseInt(e.target.value)||0)} placeholder="Qté" style={inputStyle} />
                        <input type="number" value={item.unitPrice} onChange={e => updateItem(item.id, 'unitPrice', parseInt(e.target.value)||0)} placeholder="Prix" style={inputStyle} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p style={sectionTitle}>Sections personnalisées</p>
                <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 12, lineHeight: 1.5 }}>Ajoutez vos propres sections (titre + texte + tableau optionnel), affichées à la fin de la page 1, après « Compréhension du besoin ».</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {customSections.map((section, idx) => (
                    <div key={section.id} style={{ border: '1px solid #E2E8F0', borderRadius: 12, padding: 16, background: '#F8FAFC' }}>
                      <div style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                        <span style={{ fontSize: 11, fontWeight: 900, color: '#7967FF' }}>{idx + 2}.</span>
                        <input
                          type="text"
                          value={section.title}
                          onChange={e => updateCustomSection(section.id, 'title', e.target.value)}
                          style={{ ...inputStyle, fontWeight: 700, flex: 1, textTransform: 'uppercase' }}
                          placeholder="Titre de la section"
                        />
                        <button onClick={() => removeCustomSection(section.id)} style={{ color: '#EF4444', flexShrink: 0 }}><Trash2 size={16} /></button>
                      </div>
                      <RichEditor
                        value={section.content}
                        onChange={val => updateCustomSection(section.id, 'content', val)}
                        table={section.table}
                        onTableChange={val => updateCustomSection(section.id, 'table', val)}
                        valueAfter={section.contentAfter}
                        onChangeAfter={val => updateCustomSection(section.id, 'contentAfter', val)}
                        moreBlocks={section.moreBlocks}
                        onMoreBlocksChange={val => updateCustomSection(section.id, 'moreBlocks', val)}
                      />
                    </div>
                  ))}
                  <button onClick={addCustomSection} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, border: '1px dashed #CBD5E1', background: 'none', color: '#64748B', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                    <Plus size={14} /> Ajouter une section
                  </button>
                </div>
              </div>
            </div>
          )}

          {isDoc && activeTab === 'FINANCE' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={sectionTitle}>Réglages Financiers</p>
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Devise de facturation</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['FCFA', '€', '$'].map(curr => (
                      <button 
                        key={curr} 
                        onClick={() => setCurrency(curr as any)}
                        style={{ 
                          flex: 1, padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                          border: '1px solid #E2E8F0', cursor: 'pointer',
                          background: currency === curr ? '#7967FF' : '#FFF',
                          color: currency === curr ? '#FFF' : '#64748B'
                        }}
                      >{curr}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={labelStyle}>Remise ({currency})</label>
                    <input type="number" value={discount} onChange={e => setDiscount(parseInt(e.target.value)||0)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Acompte perçu</label>
                    <input type="number" value={acompte} onChange={e => setAcompte(parseInt(e.target.value)||0)} style={inputStyle} />
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={applyTVA} onChange={e => setApplyTVA(e.target.checked)} style={{ width: 16, height: 16, accentColor: '#7967FF' }} />
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Appliquer TVA (19.25%)</span>
                </label>
              </div>
              <div>
                <p style={sectionTitle}>Logistique</p>
                <label style={labelStyle}>Délai de réalisation</label>
                <input type="text" value={timeline} onChange={e => setTimeline(e.target.value)} style={inputStyle} />
              </div>
              <div>
                <p style={sectionTitle}>Échéancier de paiement</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {paymentSteps.map((step, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="text" value={step.label} onChange={e => updatePaymentStep(idx, 'label', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="Étape" />
                      <input type="number" value={step.percent} onChange={e => updatePaymentStep(idx, 'percent', parseInt(e.target.value) || 0)} style={{ ...inputStyle, width: 70 }} placeholder="%" />
                      <button onClick={() => removePaymentStep(idx)} style={{ color: '#EF4444', flexShrink: 0 }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button onClick={addPaymentStep} style={{ fontSize: 11, fontWeight: 700, color: '#7967FF', textAlign: 'left', marginTop: 2 }}>+ Ajouter une étape</button>
                  {paymentSteps.reduce((s, p) => s + p.percent, 0) !== 100 && (
                    <p style={{ fontSize: 10, color: '#F97316', fontWeight: 700 }}>Total : {paymentSteps.reduce((s, p) => s + p.percent, 0)}% (devrait faire 100%)</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {isDoc && activeTab === 'LEGAL' && (
            <div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.6 }}>
              <p style={{ fontWeight: 700, color: '#0F172A', marginBottom: 10 }}>Cadre Juridique Standardisé :</p>
              <ul style={{ paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li><b>Retards :</b> Pénalités applicables après échéance + frais de recouvrement.</li>
                <li><b>IP :</b> Cession du code spécifique après apurement du solde.</li>
                <li><b>Démarrage :</b> Versement de l'acompte (50%) requis pour planification.</li>
                <li><b>Support :</b> Correctifs inclus 90 jours post-déploiement selon périmètre validé.</li>
              </ul>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 18 }}>
                <div>
                  <label style={labelStyle}>Délais et livraison (suite)</label>
                  <RichEditor value={conditionsDelais} onChange={setConditionsDelais} />
                </div>
                <div>
                  <label style={labelStyle}>Support et maintenance</label>
                  <RichEditor value={supportTerms} onChange={setSupportTerms} />
                </div>
                <div>
                  <label style={labelStyle}>Propriété intellectuelle</label>
                  <RichEditor value={conditionsPI} onChange={setConditionsPI} />
                </div>
                <div>
                  <label style={labelStyle}>Gestion des impayés</label>
                  <RichEditor value={conditionsImpayes} onChange={setConditionsImpayes} />
                </div>
              </div>

              {isContract && (
                <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px solid #F1F5F9' }}>
                  <p style={sectionTitle}>Clauses contractuelles</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 16, lineHeight: 1.5 }}>
                    Ces articles n’apparaissent qu’en mode contrat. Les obligations acceptent du HTML simple (listes à puces).
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Obligations du Prestataire</label>
                      <RichEditor value={termObligationsPrestataire} onChange={setTermObligationsPrestataire} />
                    </div>
                    <div>
                      <label style={labelStyle}>Obligations du Client</label>
                      <RichEditor value={termObligationsClient} onChange={setTermObligationsClient} />
                    </div>
                    <div>
                      <label style={labelStyle}>Confidentialité</label>
                      <RichEditor value={termConfidentialite} onChange={setTermConfidentialite} />
                    </div>
                    <div>
                      <label style={labelStyle}>Résiliation</label>
                      <RichEditor value={termResiliation} onChange={setTermResiliation} />
                    </div>
                    <div>
                      <label style={labelStyle}>Force majeure</label>
                      <RichEditor value={termForceMajeure} onChange={setTermForceMajeure} />
                    </div>
                    <div>
                      <label style={labelStyle}>Réversibilité / restitution des données</label>
                      <RichEditor value={termReversibilite} onChange={setTermReversibilite} />
                    </div>
                    <div>
                      <label style={labelStyle}>Droit applicable & juridiction</label>
                      <RichEditor value={termDroitApplicable} onChange={setTermDroitApplicable} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
            <span style={{ color: '#64748B', fontWeight: 600 }}>{isDoc ? 'Total à régler' : 'Prêt pour impression'}</span>
            <span style={{ fontWeight: 900, color: '#0F172A', fontSize: 18 }}>{isDoc ? formatPrice(netAPayer) : 'Gratuit'}</span>
          </div>
          <button 
            onClick={exportToPDF} 
            disabled={isGenerating}
            style={{ width: '100%', background: '#7967FF', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)', opacity: isGenerating ? 0.7 : 1 }}
          >
            {isGenerating ? <Clock size={18} className="animate-spin" /> : <Rocket size={18} />}
            {isGenerating ? 'GÉNÉRATION...' : `GÉNÉRER LE ${docType.includes('CARTE') ? 'CARTE' : docLabel}`}
          </button>
        </div>
      </div>

      {/* ─── RIGHT PANEL: PREVIEW ─── */}
      <div ref={previewScrollRef} style={{ flex: 1, overflowY: 'auto', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40, position: 'relative' }} className="no-print">

        <button
          onClick={refreshPreview}
          title="Rafraîchir l'aperçu"
          style={{
            position: 'sticky', top: 16, alignSelf: 'flex-end', marginRight: 24, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#FFF', color: '#7967FF', border: '1px solid #E2E8F0',
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 800,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,23,42,0.08)',
          }}
        >
          <RefreshCw size={14} /> Rafraîchir l'aperçu
        </button>

        {docType === 'SOCIAL' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40, width: '100%', alignItems: 'center' }}>
            {socialType === 'POST' ? (
               <div className="print-target" style={{ 
                 width: socialSize === 'STORY' ? 450 : (socialSize === 'LANDSCAPE' ? 800 : 600), 
                 height: socialSize === 'SQUARE' ? 600 : (socialSize === 'PORTRAIT' ? 750 : (socialSize === 'STORY' ? 800 : 450)), 
                 background: socialTheme === 'DARK' ? 'linear-gradient(135deg, #0F172A 0%, #111827 100%)' : '#FFFFFF', 
                 position: 'relative', 
                 overflow: 'hidden', 
                 display: 'flex', 
                 flexDirection: 'column', 
                 justifyContent: 'center', 
                 padding: socialSize === 'STORY' ? '80px 40px' : (socialSize === 'LANDSCAPE' ? '40px 60px' : 60), 
                 boxShadow: '0 40px 100px rgba(0,0,0,0.2)',
                 border: socialTheme === 'LIGHT' ? '1px solid #F1F5F9' : 'none',
                 transition: 'all 0.3s ease'
               }}>
                  {/* Stylized SVG Background Patterns */}
                  <div style={{ position: 'absolute', inset: 0, opacity: socialTheme === 'DARK' ? 0.05 : 0.03, pointerEvents: 'none' }}>
                    <svg width="100%" height="100%">
                      {socialPattern === 'GRID' ? (
                        <>
                          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke={socialTheme === 'DARK' ? '#FFF' : '#000'} strokeWidth="1"/>
                          </pattern>
                          <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1" fill={socialTheme === 'DARK' ? '#FFF' : '#000'} />
                          </pattern>
                          <rect width="100%" height="100%" fill="url(#grid)" />
                          <rect width="100%" height="100%" fill="url(#dots)" />
                        </>
                      ) : (
                        <>
                          <path 
                            d="M0 100 C 150 200, 350 0, 600 100 L 600 0 L 0 0 Z" 
                            fill={socialTheme === 'DARK' ? '#7967FF' : '#7967FF'} 
                            fillOpacity={socialTheme === 'DARK' ? "0.2" : "0.1"}
                          />
                          <path 
                            d="M0 200 C 200 300, 400 100, 600 200 L 600 0 L 0 0 Z" 
                            fill={socialTheme === 'DARK' ? '#4F46E5' : '#4F46E5'} 
                            fillOpacity={socialTheme === 'DARK' ? "0.15" : "0.08"}
                          />
                          <path 
                            d="M0 300 C 300 400, 500 200, 800 300 L 800 0 L 0 0 Z" 
                            fill="#7967FF" 
                            fillOpacity="0.05"
                          />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Glassmorphism Blob */}
                  <div style={{ 
                    position: 'absolute', 
                    top: '20%', 
                    right: '-10%', 
                    width: '60%', 
                    height: '60%', 
                    background: 'linear-gradient(135deg, rgba(121,103,255,0.05) 0%, rgba(79,70,229,0.02) 100%)', 
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    filter: 'blur(80px)',
                    zIndex: 0,
                    animation: 'blob-float 20s infinite alternate'
                  }} />

                  {/* Modern Decorative Elements */}
                  <div style={{ position: 'absolute', top: -50, right: -50, width: 300, height: 300, background: 'radial-gradient(circle, #7967FF 0%, transparent 70%)', opacity: socialTheme === 'DARK' ? 0.05 : 0.02, filter: 'blur(100px)' }} />
                  <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)', opacity: socialTheme === 'DARK' ? 0.04 : 0.015, filter: 'blur(120px)' }} />
                  
                  {/* Geometric accents */}
                  <div style={{ position: 'absolute', top: 40, left: 40, width: 2, height: 40, background: 'linear-gradient(to bottom, #7967FF, transparent)' }} />
                  <div style={{ position: 'absolute', top: 40, left: 40, width: 40, height: 2, background: 'linear-gradient(to right, #7967FF, transparent)' }} />

                  <img src={primaryLogoSrc} alt="Ozirus" style={{ height: socialSize === 'STORY' ? 35 : 45, width: 'auto', maxWidth: 180, objectFit: 'contain', filter: socialTheme === 'DARK' ? 'brightness(0) invert(1)' : 'none', marginBottom: socialImages.length > 0 ? 14 : 20, opacity: 0.95 }} />
                  
                  <div style={{ width: 50, height: 6, background: '#7967FF', marginBottom: socialImages.length > 0 ? 24 : 35, borderRadius: 3 }} />

                  {socialImages.length > 0 && (
                    <div style={{
                      width: '100%',
                      height: getSocialImageFrameHeight(socialImages.length),
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: 12,
                      marginBottom: 32,
                      position: 'relative',
                      zIndex: 1,
                      alignItems: 'center',
                    }}>
                      {socialImages.map((image) => {
                        const frameRatio = getSocialImageFrameRatio(socialImages.length);

                        return (
                          <div key={image.id} style={{
                            width: '100%',
                            justifySelf: 'start',
                            height: '100%',
                            borderRadius: 22,
                            overflow: 'hidden',
                            border: socialTheme === 'DARK' ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)',
                            boxShadow: '0 18px 45px rgba(0,0,0,0.16)',
                            background: socialTheme === 'DARK' ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                          }}>
                            <img src={image.src} alt={image.name} style={getSmartCropStyle(image, frameRatio)} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  <h2 style={{ 
                    fontSize: socialFontSize, 
                    fontWeight: 900, 
                    color: socialTheme === 'DARK' ? '#FFF' : '#0F172A', 
                    lineHeight: 1.1, 
                    fontFamily: 'var(--font-display, "Clash Display"), sans-serif', 
                    marginBottom: socialFontSize * 0.4,
                    letterSpacing: 0
                  }}>{socialTitle}</h2>
                  
                  <div style={{ 
                    fontSize: socialFontSize * 0.42, 
                    color: socialTheme === 'DARK' ? '#94A3B8' : '#475569', 
                    fontWeight: 500, 
                    lineHeight: 1.5, 
                    marginBottom: socialFontSize * 0.8,
                    maxWidth: '95%'
                  }} dangerouslySetInnerHTML={{ __html: socialSubtitle }} />
                  
                  <div style={{ marginTop: 'auto', transform: 'translateY(40px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, borderTop: socialTheme === 'DARK' ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)', paddingTop: 16 }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7967FF', flexShrink: 0 }} />
                        <p style={{ fontSize: 11, color: socialTheme === 'DARK' ? '#FFF' : '#0F172A', fontWeight: 800, letterSpacing: 0, whiteSpace: 'nowrap' }}>https://ozirus.agency</p>
                     </div>
                     <p style={{ fontSize: 10, color: socialTheme === 'DARK' ? '#64748B' : '#64748B', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>#Innovation #Digital #IA</p>
                  </div>
               </div>
            ) : (
               <div style={{ width: '100%', maxWidth: 1000, overflowX: 'auto', display: 'flex', gap: 30, padding: '40px 60px', scrollSnapType: 'x mandatory' }}>
                  {carouselSlides.map((slide, idx) => {
                    const isDarkSlide = socialTheme === 'DARK' ? (idx % 2 === 0) : (idx % 2 !== 0);
                    const bg = isDarkSlide ? '#0F172A' : '#FFFFFF';
                    const textPrimary = isDarkSlide ? '#FFF' : '#0F172A';
                    const textSecondary = isDarkSlide ? '#94A3B8' : '#475569';
                    const logoFilter = isDarkSlide ? 'brightness(0) invert(1)' : 'none';
                    const patternOpacity = isDarkSlide ? 0.05 : 0.03;

                    return (
                      <div key={idx} className="print-target" style={{ 
                        flexShrink: 0, 
                        width: socialSize === 'STORY' ? 380 : (socialSize === 'LANDSCAPE' ? 600 : 500), 
                        height: socialSize === 'SQUARE' ? 500 : (socialSize === 'PORTRAIT' ? 625 : (socialSize === 'STORY' ? 675 : 337)), 
                        background: bg, 
                        position: 'relative', 
                        overflow: 'hidden', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        justifyContent: 'center', 
                        padding: socialSize === 'STORY' ? '70px 40px' : (socialSize === 'LANDSCAPE' ? '30px 45px' : 50), 
                        borderRadius: 0, 
                        boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                        scrollSnapAlign: 'center',
                        border: isDarkSlide ? 'none' : '1px solid #F1F5F9',
                        transition: 'all 0.3s ease'
                      }}>
                          {/* Stylized SVG Background Patterns */}
                          <div style={{ position: 'absolute', inset: 0, opacity: patternOpacity, pointerEvents: 'none' }}>
                            <svg width="100%" height="100%">
                              {socialPattern === 'GRID' ? (
                                <>
                                  <pattern id={`grid-${idx}`} width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke={isDarkSlide ? '#FFF' : '#000'} strokeWidth="1"/>
                                  </pattern>
                                  <pattern id={`dots-${idx}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill={isDarkSlide ? '#FFF' : '#000'} />
                                  </pattern>
                                  <rect width="100%" height="100%" fill={`url(#grid-${idx})`} />
                                  <rect width="100%" height="100%" fill={`url(#dots-${idx})`} />
                                </>
                              ) : (
                                <>
                                  <path 
                                    d="M0 100 C 150 200, 350 0, 500 100 L 500 0 L 0 0 Z" 
                                    fill={isDarkSlide ? '#7967FF' : '#7967FF'} 
                                    fillOpacity={isDarkSlide ? "0.25" : "0.15"}
                                  />
                                  <path 
                                    d="M0 200 C 200 300, 400 100, 500 200 L 500 0 L 0 0 Z" 
                                    fill={isDarkSlide ? '#4F46E5' : '#4F46E5'} 
                                    fillOpacity={isDarkSlide ? "0.2" : "0.1"}
                                  />
                                </>
                              )}
                            </svg>
                          </div>

                          {/* Patterns */}
                          <div style={{ position: 'absolute', top: -50, right: -50, width: 150, height: 150, background: 'radial-gradient(circle, #7967FF 0%, transparent 70%)', opacity: 0.1, filter: 'blur(40px)' }} />
                          <div style={{ position: 'absolute', bottom: 20, left: -20, width: 100, height: 100, background: 'radial-gradient(circle, #4F46E5 0%, transparent 70%)', opacity: 0.05, filter: 'blur(30px)' }} />
                          
                          <div style={{ position: 'absolute', top: 30, right: 40, fontSize: 60, fontWeight: 900, color: isDarkSlide ? 'rgba(255,255,255,0.03)' : 'rgba(121,103,255,0.05)', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{String(idx + 1).padStart(2, '0')}</div>
                          
                          <img src={primaryLogoSrc} alt="Ozirus" style={{ height: 30, width: 'auto', maxWidth: 120, objectFit: 'contain', filter: logoFilter, marginBottom: slide.images.length > 0 ? 12 : 16, opacity: 0.9 }} />
                          
                          <div style={{ width: 40, height: 4, background: '#7967FF', marginBottom: slide.images.length > 0 ? 18 : 25, borderRadius: 2 }} />

                          {slide.images.length > 0 && (
                            <div style={{
                              width: '100%',
                              height: getSocialImageFrameHeight(slide.images.length, true),
                              display: 'grid',
                              gridTemplateColumns: 'repeat(2, 1fr)',
                              gap: 10,
                              marginBottom: 24,
                              position: 'relative',
                              zIndex: 1,
                              alignItems: 'center',
                            }}>
                              {slide.images.map((image) => {
                                const frameRatio = getSocialImageFrameRatio(slide.images.length, true);

                                return (
                                  <div key={image.id} style={{
                                    width: '100%',
                                    justifySelf: 'start',
                                    height: '100%',
                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    border: isDarkSlide ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(15,23,42,0.08)',
                                    boxShadow: '0 14px 30px rgba(0,0,0,0.14)',
                                    background: isDarkSlide ? 'rgba(255,255,255,0.06)' : '#F8FAFC',
                                  }}>
                                    <img src={image.src} alt={image.name} style={getSmartCropStyle(image, frameRatio)} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          
                          {/* Background Logo Watermark for final slide */}
                          {idx === carouselSlides.length - 1 && (
                            <div style={{ 
                              position: 'absolute', 
                              bottom: '-10%', 
                              right: '-10%', 
                              width: '60%', 
                              height: '60%', 
                              opacity: isDarkSlide ? 0.03 : 0.05, 
                              pointerEvents: 'none',
                              zIndex: 0,
                              transform: 'rotate(-15deg)'
                            }}>
                              <img src={primaryLogoSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: logoFilter }} />
                            </div>
                          )}

                          <h3 style={{ 
                            fontSize: idx === carouselSlides.length - 1 ? socialFontSize * 0.7 : socialFontSize * 0.7, 
                            fontWeight: 900, 
                            color: textPrimary, 
                            lineHeight: 1.1, 
                            fontFamily: 'var(--font-display, "Clash Display"), sans-serif', 
                            marginBottom: socialFontSize * 0.3,
                            position: 'relative',
                            zIndex: 1
                          }}>{slide.title}</h3>
                          
                          <div style={{ 
                            fontSize: idx === carouselSlides.length - 1 ? socialFontSize * 0.4 : socialFontSize * 0.38, 
                            color: textSecondary, 
                            fontWeight: 500, 
                            lineHeight: 1.5, 
                            marginBottom: idx === carouselSlides.length - 1 ? socialFontSize * 0.5 : 0,
                            position: 'relative',
                            zIndex: 1
                          }} dangerouslySetInnerHTML={{ __html: slide.text }} />
                          
                          {idx === carouselSlides.length - 1 && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', position: 'relative', zIndex: 1 }}>
                               <div style={{ 
                                 display: 'grid', 
                                 gridTemplateColumns: socialSize === 'LANDSCAPE' ? 'repeat(3, 1fr)' : '1fr', 
                                 gap: 15,
                                 background: isDarkSlide ? 'rgba(255,255,255,0.03)' : 'rgba(121,103,255,0.05)',
                                 padding: 20,
                                 borderRadius: 20,
                                 border: isDarkSlide ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(121,103,255,0.1)'
                               }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#7967FF22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Smartphone size={18} color="#7967FF" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: 9, fontWeight: 800, color: '#7967FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Téléphone</span>
                                      <span style={{ fontSize: 13, color: textPrimary, fontWeight: 700 }}>{COMPANY_INFO.phone}</span>
                                    </div>
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#7967FF22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Mail size={18} color="#7967FF" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: 9, fontWeight: 800, color: '#7967FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                                      <span style={{ fontSize: 13, color: textPrimary, fontWeight: 700 }}>{COMPANY_INFO.email}</span>
                                    </div>
                                 </div>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 10, background: '#7967FF22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Globe size={18} color="#7967FF" />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontSize: 9, fontWeight: 800, color: '#7967FF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website</span>
                                      <span style={{ fontSize: 13, color: textPrimary, fontWeight: 700 }}>{COMPANY_INFO.website}</span>
                                    </div>
                                 </div>
                               </div>

                               <div style={{ 
                                 marginTop: 0,
                                 display: 'flex',
                                 flexDirection: 'column',
                                 alignItems: 'center',
                                 gap: 8,
                                 width: '100%'
                               }}>
                                 <p style={{ fontSize: 11, fontWeight: 800, color: '#7967FF', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: -4 }}>Scannez pour démarrer votre projet</p>
                                 <div style={{ 
                                   background: '#FFF', 
                                   padding: 8, 
                                   borderRadius: 16, 
                                   display: 'flex', 
                                   alignItems: 'center', 
                                   justifyContent: 'center', 
                                   boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                   border: '1px solid rgba(0,0,0,0.05)'
                                 }}>
                                   <img 
                                     src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://${COMPANY_INFO.website}`)}`} 
                                     alt="QR" 
                                     style={{ width: 85, height: 85, objectFit: 'contain' }}
                                   />
                                 </div>
                               </div>
                            </div>
                          )}

                          <div style={{ marginTop: 'auto', transform: 'translateY(30px)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, borderTop: isDarkSlide ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', paddingTop: 14 }}>
                             <p style={{ fontSize: 9.5, color: '#7967FF', fontWeight: 800, letterSpacing: 0, whiteSpace: 'nowrap' }}>https://ozirus.agency</p>
                             <div style={{ display: 'flex', gap: 6 }}>
                                {carouselSlides.map((_, i) => (
                                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i === idx ? '#7967FF' : (isDarkSlide ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }} />
                                ))}
                             </div>
                          </div>
                      </div>
                    );
                  })}
               </div>
            )}
          </div>
        )}

        {docType === 'BADGE' && (
          <div className="print-target" style={{ width: '54mm', height: '86mm', background: '#F8FAFC', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', flexDirection: 'column', border: '1px solid #E2E8F0' }}>
            <div style={{ height: '28%', background: 'linear-gradient(135deg, #7967FF 0%, #4F46E5 100%)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 20 }}>
              <img src={primaryLogoSrc} alt="Ozirus" style={{ height: 22, width: 'auto', maxWidth: '80%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            
            <div style={{ flex: 1, padding: '0 10px 10px 10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -45 }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', border: '4px solid #FFF', background: '#F1F5F9', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0,0,0,0.1)', marginBottom: 8, zIndex: 5 }}>
                {personPhoto ? (
                  <img src={personPhoto} alt={personName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={30} color="#7967FF" />
                )}
              </div>

              <div style={{ marginBottom: 6 }}>
                <h2 style={{ fontSize: 14, fontWeight: 900, color: '#0F172A', margin: '0 0 1px 0', fontFamily: 'var(--font-display, "Clash Display"), sans-serif', lineHeight: 1.1 }}>{personName}</h2>
                <p style={{ fontSize: 8.5, fontWeight: 800, color: '#7967FF', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{personRole}</p>
              </div>

              <div style={{ marginTop: 'auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ background: '#FFF', padding: '8px 10px', borderRadius: 10, boxShadow: '0 2px 6px rgba(121,103,255,0.05)', border: '1px solid #7967FF11' }}>
                  <p style={{ fontSize: 6.5, fontStyle: 'italic', color: '#64748B', lineHeight: 1.3, margin: '0 0 5px 0', fontWeight: 600 }}>"On crée les outils de demain pour faire grandir votre projet dès aujourd'hui."</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'center' }}>
                    {[
                      { icon: '✦', text: 'Profitez de l\'IA : Réduisez vos dépenses et optimisez votre rentabilité' },
                      { icon: '✦', text: 'Solutions Robustes : Nous réalisons vos applications de rêve performantes' },
                      { icon: '✦', text: 'Automatisation : Libérez-vous des tâches répétitives dès aujourd\'hui' }
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 5, color: '#7967FF' }}>{item.icon}</span>
                        <span style={{ fontSize: 5.5, fontWeight: 800, color: '#0F172A', textAlign: 'left' }}>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center', padding: '6px 10px', background: '#0F172A', borderRadius: 10 }}>
                  <div style={{ background: '#FFF', padding: '2px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${personName}\nORG:Ozirus Agency\nTITLE:${personRole}\nTEL:${personPhone}\nEMAIL:${personEmail}\nEND:VCARD`)}`} 
                      alt="QR Code" 
                      style={{ width: 26, height: 26 }} 
                    />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: 6, color: '#7967FF', fontWeight: 900, margin: 0, letterSpacing: '0.02em' }}>Ozirus Agency</p>
                    <p style={{ fontSize: 5, color: 'rgba(255,255,255,0.6)', fontWeight: 700, margin: 0 }}>https://ozirus.agency</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {docType === 'CARTE DE VISITE' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {/* FRONT */}
            <div className="print-target" style={{ width: '85mm', height: '55mm', background: '#0F172A', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: '#7967FF', clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0% 100%)', opacity: 0.1 }}></div>
              <img src={primaryLogoSrc} alt="Ozirus" style={{ height: 35, width: 'auto', maxWidth: '80%', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>
            {/* BACK */}
            <div className="print-target" style={{ width: '85mm', height: '55mm', background: '#FFF', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', display: 'flex', border: '1px solid #E2E8F0' }}>
               <div style={{ width: 8, background: '#7967FF' }} />
               <div style={{ flex: 1, padding: 25, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', margin: '0 0 2px 0', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{personName}</h2>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#7967FF', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{personRole}</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: '#475569', fontWeight: 600 }}>
                      <Smartphone size={10} color="#7967FF" /> {personPhone}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: '#475569', fontWeight: 600 }}>
                      <User size={10} color="#7967FF" /> {personEmail}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 9, color: '#475569', fontWeight: 600 }}>
                      <Globe size={10} color="#7967FF" /> {COMPANY_INFO.website}
                    </div>
                  </div>
               </div>
               <div style={{ width: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderLeft: '1px solid #F1F5F9' }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`BEGIN:VCARD\nVERSION:3.0\nFN:${personName}\nORG:Ozirus Agency\nTITLE:${personRole}\nTEL:${personPhone}\nEMAIL:${personEmail}\nEND:VCARD`)}`} 
                    alt="QR Code" 
                    style={{ width: 50, height: 50 }} 
                  />
               </div>
            </div>
          </div>
        )}

        {docType === 'FACTURE' && (
          <PaginatedA4Group
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 25, borderBottom: '1px solid #F1F5F9' }}>
                <div>
                  <img src={primaryLogoSrc} alt="Ozirus" style={{ height: 35, width: 'auto', maxWidth: 120, objectFit: 'contain', filter: primaryLogoSrc === '/logo.png' ? PRIMARY_LOGO_FALLBACK_FILTER : 'none', marginBottom: 12 }} />
                  <p style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-display, "Clash Display"), sans-serif', letterSpacing: '0.05em' }}>OZIRUS AGENCY — SOLUTIONS IA & DIGITAL</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 20, fontWeight: 900, color: '#7967FF', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>FACTURE</p>
                  <p style={{ fontSize: 10, color: '#64748B', marginTop: 5, fontWeight: 600 }}>RÉF: {docNumber} | DATE: {formatDate(date)}</p>
                  <p style={{ fontSize: 10, color: '#64748B', fontWeight: 600 }}>ÉCHÉANCE: {formatDate(validUntil)}</p>
                </div>
              </div>
            }
            blocks={[
              {
                key: 'facture-client-header',
                content: (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 30 }}>
                    <InfoBox title="ÉMETTEUR" lines={[COMPANY_INFO.name, COMPANY_INFO.address, `NIU: ${COMPANY_INFO.taxId}`]} />
                    <InfoBox
                      title="FACTURÉ À"
                      lines={[
                        clientCompany || clientName || 'Client',
                        ...(clientCompany && clientName ? [clientName] : []),
                        ...(clientAddress ? [clientAddress] : []),
                        ...(clientTaxId ? [`NIU: ${clientTaxId}`] : []),
                      ]}
                    />
                  </div>
                ),
              },
              {
                key: 'facture-table-header',
                content: (
                  <div style={{ display: 'flex', padding: '10px 14px', background: '#0F172A', borderRadius: '8px 8px 0 0', marginTop: 30 }}>
                    <span style={{ flex: 1, fontSize: 10, fontWeight: 800, color: '#FFF', letterSpacing: '0.05em' }}>DESCRIPTION</span>
                    <span style={{ width: 60, textAlign: 'center', fontSize: 10, fontWeight: 800, color: '#FFF' }}>QTÉ</span>
                    <span style={{ width: 110, textAlign: 'right', fontSize: 10, fontWeight: 800, color: '#FFF' }}>PU</span>
                    <span style={{ width: 110, textAlign: 'right', fontSize: 10, fontWeight: 800, color: '#FFF' }}>TOTAL</span>
                  </div>
                ),
              },
              ...items.map((item, idx) => ({
                key: `facture-item-${item.id}`,
                content: (
                  <div style={{ display: 'flex', padding: '12px 14px', background: idx % 2 === 0 ? '#FFF' : '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                    <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: '#0F172A' }}>{item.description || 'Sans description'}</span>
                    <span style={{ width: 60, textAlign: 'center', fontSize: 11, color: '#475569' }}>{item.quantity}</span>
                    <span style={{ width: 110, textAlign: 'right', fontSize: 11, color: '#475569' }}>{formatPrice(item.unitPrice)}</span>
                    <span style={{ width: 110, textAlign: 'right', fontSize: 11, fontWeight: 700, color: '#0F172A' }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                  </div>
                ),
              })),
              {
                key: 'facture-totaux',
                content: (
                  <div style={{ marginTop: 20, alignSelf: 'flex-end', width: 280, marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <SummaryLine label="Sous-total" value={formatPrice(subtotal)} />
                    {discount > 0 && <SummaryLine label="Remise" value={`- ${formatPrice(discount)}`} color="#EF4444" />}
                    <SummaryLine label="Total HT" value={formatPrice(totalHT)} />
                    {applyTVA && <SummaryLine label="TVA (19,25%)" value={formatPrice(tvaAmount)} />}
                    <div style={{ height: 1, background: '#F1F5F9', margin: '4px 0' }} />
                    <SummaryLine label="Total TTC" value={formatPrice(totalTTC)} weight={800} size={14} color="#0F172A" />
                    {acompte > 0 && <SummaryLine label="Acompte versé" value={`- ${formatPrice(acompte)}`} color="#EF4444" />}
                    <div style={{ background: '#7967FF', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#FFF' }}>NET À PAYER</span>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#FFF' }}>{formatPrice(netAPayer)}</span>
                    </div>
                  </div>
                ),
              },
              {
                key: 'facture-mobile-money',
                content: (
                  <div style={{ marginTop: 30, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 14, padding: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', marginBottom: 14, letterSpacing: '0.1em' }}>MOBILE MONEY</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: 4 }}>ORANGE MONEY</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: '#0F172A' }}>694 08 65 71</p>
                        <p style={{ fontSize: 9, color: '#64748B', marginTop: 4 }}>Titulaire : NA Fotie</p>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: 4 }}>MTN MOMO</p>
                        <p style={{ fontSize: 15, fontWeight: 900, color: '#0F172A' }}>678 615 677</p>
                        <p style={{ fontSize: 9, color: '#64748B', marginTop: 4 }}>Titulaire : Fotie Wilfried Bonaventure</p>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                key: 'facture-rib',
                content: (
                  <div style={{ marginTop: 16, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 14, padding: 20 }}>
                    <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', marginBottom: 14, letterSpacing: '0.1em' }}>VIREMENT BANCAIRE (RIB)</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <SummaryLine label="Banque" value="UBA Cameroun" />
                      <SummaryLine label="Titulaire" value="Fotie Wilfried Bonaventure" />
                      <SummaryLine label="IBAN" value="CM21 10033 05203 03009004415-64" weight={800} color="#0F172A" />
                      <SummaryLine label="Code Swift/BIC" value="UNAFCMCX" weight={800} color="#0F172A" />
                    </div>
                  </div>
                ),
              },
              {
                key: 'facture-footer',
                content: (
                  <div style={{ marginTop: 30, paddingTop: 30, borderTop: '1px solid #F1F5F9' }}>
                    <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>
                      Paiement attendu au plus tard le {formatDate(validUntil)}, par virement ou Mobile Money. Merci de mentionner la référence {docNumber} et d'envoyer une preuve de paiement à {COMPANY_INFO.email}.
                    </p>
                    <p style={{ fontSize: 9, color: '#94A3B8', marginTop: 16 }}>
                      {COMPANY_INFO.name} — {COMPANY_INFO.email} — {COMPANY_INFO.phone} — {COMPANY_INFO.website}
                    </p>
                  </div>
                ),
              },
            ]}
          />
        )}

        {isDoc && (
          <React.Fragment key={previewKey}>
            {/* PAGE DE GARDE */}
            <A4Page>
              <Header docType={docLabel} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />
              
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '32px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#86868B', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>
                    Dossier Confidentiel
                  </p>
                  <h1 style={{ fontSize: 72, fontWeight: 600, color: '#1D1D1F', lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
                    {isContract ? 'Contrat' : 'Proposition'}
                  </h1>
                  <h1 style={{ fontSize: 72, fontWeight: 300, color: '#86868B', lineHeight: 1.05, letterSpacing: '-0.03em', margin: 0 }}>
                    {isContract ? 'de prestation.' : 'commerciale.'}
                  </h1>
                </div>

                <div style={{ width: 40, height: 2, backgroundColor: '#1D1D1F', margin: '16px 0' }} />

                {isContract ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: 11, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 500 }}>
                        Entre les soussignés
                      </p>
                      <p style={{ fontSize: 20, color: '#1D1D1F', fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                        {COMPANY_INFO.name}
                      </p>
                      <p style={{ fontSize: 13, color: '#86868B', fontWeight: 400, margin: '2px 0 0 0' }}>
                        et
                      </p>
                      <p style={{ fontSize: 20, color: '#1D1D1F', fontWeight: 500, margin: '2px 0 0 0', letterSpacing: '-0.01em' }}>
                        {clientCompany || 'Client Corporate'}
                      </p>
                      {contractStartDate && (
                        <p style={{ fontSize: 13, color: '#86868B', fontWeight: 400, marginTop: 10 }}>
                          Entrée en vigueur : {formatDate(contractStartDate)}
                        </p>
                      )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <p style={{ fontSize: 11, color: '#86868B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, fontWeight: 500 }}>
                        Préparé pour
                      </p>
                      <p style={{ fontSize: 24, color: '#1D1D1F', fontWeight: 500, margin: 0, letterSpacing: '-0.01em' }}>
                        {clientCompany || 'Client Corporate'}
                      </p>
                      <p style={{ fontSize: 16, color: '#86868B', fontWeight: 400, marginTop: 4, margin: '4px 0 0 0' }}>
                        Attn: {clientName}
                      </p>
                  </div>
                )}
              </div>
              
              {/* Footer style consistent with others */}
              <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #F1F5F9', textAlign: 'center' }}>
                <p style={{ fontSize: 9, color: '#94A3B8', margin: 0 }}>
                  {COMPANY_INFO.name} — NIU : {COMPANY_INFO.taxId} — {COMPANY_INFO.address} — {COMPANY_INFO.email} — {COMPANY_INFO.phone}
                </p>
              </div>
            </A4Page>

            {/* PAGE(S) 1: CONTEXTE & SOLUTION — pagination automatique */}
            <PaginatedA4Group
              header={<Header docType={docLabel} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />}
              blocks={[
                {
                  key: 'client-header',
                  content: isContract ? (
                    <div style={{ marginTop: 30 }}>
                      <SectionTitle title="ENTRE LES SOUSSIGNÉS" />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <PartyBlock
                          role="LE PRESTATAIRE"
                          company={COMPANY_INFO.name}
                          address={COMPANY_INFO.address}
                          taxId={COMPANY_INFO.taxId}
                          registryId={COMPANY_INFO.registryId}
                          rep={providerLegalRep}
                          repRole={providerLegalRepRole}
                          email={COMPANY_INFO.email}
                        />
                        <PartyBlock
                          role="LE CLIENT"
                          company={clientCompany || '(Client Corporate)'}
                          address={clientAddress}
                          taxId={clientTaxId}
                          registryId={clientRegistryId}
                          rep={clientLegalRep || clientName}
                          repRole={clientLegalRepRole}
                          email={clientEmail}
                        />
                      </div>
                      <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7, marginTop: 14 }}>
                        Ci-après désignés individuellement « la Partie » et collectivement « les Parties ».
                        {contractStartDate ? ` Le présent contrat prend effet le ${formatDate(contractStartDate)}.` : ''}
                      </p>
                    </div>
                  ) : (
                    <div style={{ marginTop: 30, display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>À l'attention de</p>
                        <p style={{ fontSize: 18, fontWeight: 900, color: '#0F172A', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{clientCompany || '(Client Corporate)'}</p>
                        <p style={{ fontSize: 12, color: '#7967FF', fontWeight: 600 }}>{clientName}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>VALIDITÉ : {formatDate(validUntil)}</p>
                        {clientTaxId && <p style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600 }}>NIU CLIENT : {clientTaxId}</p>}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'contexte-strategique-title',
                  content: (
                    <div style={{ marginTop: 30, marginBottom: 10 }}>
                        <SectionTitle title={isContract ? 'PRÉAMBULE' : '1. COMPRÉHENSION DU BESOIN'} />
                    </div>
                  ),
                },
                ...splitHtmlIntoBlocks(projectContext).map((htmlPart, idx) => ({
                  key: `contexte-strategique-part-${idx}`,
                  content: (
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }} dangerouslySetInnerHTML={{ __html: htmlPart.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
                  ),
                })),
                ...(projectContextTable ? renderTableBlocks(projectContextTable, 'contexte-strategique-table').map((b, idx, arr) => ({
                  key: b.key,
                  content: (
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: idx === arr.length - 1 && !projectContextAfter ? '8px' : '0px' }}>{b.content}</div>
                  ),
                })) : []),
                ...(projectContextAfter ? splitHtmlIntoBlocks(projectContextAfter).map((htmlPart, idx) => ({
                  key: `contexte-strategique-after-${idx}`,
                  content: (
                    <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginTop: idx === 0 ? '8px' : '0', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }} dangerouslySetInnerHTML={{ __html: htmlPart.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
                  ),
                })) : []),
                ...projectContextMoreBlocks.flatMap((block, blockIdx) => [
                  ...renderTableBlocks(block.table, `contexte-strategique-moretable-${block.id}`).map((b, idx, arr) => ({
                    key: b.key,
                    content: (
                      <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) ? '8px' : '0px', marginTop: idx === 0 ? '8px' : '0' }}>{b.content}</div>
                    )
                  })),
                  ...(block.showTextAfter && block.textAfter ? splitHtmlIntoBlocks(block.textAfter).map((htmlPart, idx) => ({
                    key: `contexte-strategique-moreafter-${block.id}-${idx}`,
                    content: (
                      <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginTop: idx === 0 ? '8px' : '0', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }} dangerouslySetInnerHTML={{ __html: htmlPart.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
                    )
                  })) : [])
                ]),
                {
                  key: 'ce-qui-est-inclus-title',
                  content: (
                    <div style={{ marginTop: 18, background: '#F1F5F966', padding: '20px 20px 0 20px', borderRadius: '15px 15px 0 0', borderLeft: '4px solid #7967FF' }}>
                      <p style={{ fontSize: 10, fontWeight: 900, color: '#7967FF', margin: 0, letterSpacing: '0.1em', paddingTop: 2, paddingBottom: 2, lineHeight: 1.4 }}>CE QUI EST INCLUS :</p>
                    </div>
                  ),
                },
                ...splitHtmlIntoBlocks(projectGoals).map((htmlPart, idx, arr) => ({
                  key: `ce-qui-est-inclus-part-${idx}`,
                  content: (
                    <div style={{ 
                      background: '#F1F5F966', 
                      padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && !projectGoalsTable && projectGoalsMoreBlocks.length === 0 ? '4px 20px 20px 20px' : '4px 20px') : (idx === arr.length - 1 && !projectGoalsTable && projectGoalsMoreBlocks.length === 0 ? '10px 20px 20px 20px' : '10px 20px'), 
                      borderRadius: idx === arr.length - 1 && !projectGoalsTable && projectGoalsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0', 
                      borderLeft: '4px solid #7967FF',
                      fontSize: 11, lineHeight: 1.8, color: '#0F172A' 
                    }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                  ),
                })),
                ...(projectGoalsTable ? renderTableBlocks(projectGoalsTable, 'ce-qui-est-inclus-table').map((b, idx, arr) => ({
                  key: b.key,
                  content: (
                    <div style={{ background: '#F1F5F966', padding: idx === arr.length - 1 && !projectGoalsAfter && projectGoalsMoreBlocks.length === 0 ? '10px 20px 20px 20px' : '0px 20px 0 20px', borderRadius: idx === arr.length - 1 && !projectGoalsAfter && projectGoalsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0', borderLeft: '4px solid #7967FF', fontSize: 11, lineHeight: 1.8, color: '#0F172A' }}>
                      {b.content}
                    </div>
                  ),
                })) : []),
                ...(projectGoalsAfter ? splitHtmlIntoBlocks(projectGoalsAfter).map((htmlPart, idx, arr) => ({
                  key: `ce-qui-est-inclus-after-${idx}`,
                  content: (
                    <div style={{ 
                      background: '#F1F5F966', 
                      padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && projectGoalsMoreBlocks.length === 0 ? '4px 20px 20px 20px' : '4px 20px') : (idx === arr.length - 1 && projectGoalsMoreBlocks.length === 0 ? '10px 20px 20px 20px' : '10px 20px'), 
                      borderRadius: idx === arr.length - 1 && projectGoalsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0', 
                      borderLeft: '4px solid #7967FF',
                      fontSize: 11, lineHeight: 1.8, color: '#0F172A' 
                    }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                  ),
                })) : []),
                ...projectGoalsMoreBlocks.flatMap((block, blockIdx, allBlocks) => [
                  ...renderTableBlocks(block.table, `ce-qui-est-inclus-moretable-${block.id}`).map((b, idx, arr) => ({
                    key: b.key,
                    content: (
                      <div style={{ background: '#F1F5F966', padding: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) && blockIdx === allBlocks.length - 1 ? '10px 20px 20px 20px' : '0px 20px 0 20px', borderRadius: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) && blockIdx === allBlocks.length - 1 ? '0 0 15px 15px' : '0', borderLeft: '4px solid #7967FF', fontSize: 11, lineHeight: 1.8, color: '#0F172A' }}>
                        {b.content}
                      </div>
                    )
                  })),
                  ...(block.showTextAfter && block.textAfter ? splitHtmlIntoBlocks(block.textAfter).map((htmlPart, idx, arr) => ({
                    key: `ce-qui-est-inclus-moreafter-${block.id}-${idx}`,
                    content: (
                      <div style={{ 
                        background: '#F1F5F966', 
                        padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '4px 20px 20px 20px' : '4px 20px') : (idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '10px 20px 20px 20px' : '10px 20px'), 
                        borderRadius: idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '0 0 15px 15px' : '0', 
                        borderLeft: '4px solid #7967FF',
                        fontSize: 11, lineHeight: 1.8, color: '#0F172A' 
                      }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                    )
                  })) : [])
                ]),
                {
                  key: 'hors-perimetre-title',
                  content: (
                    <div style={{ marginTop: 16, background: '#FFF7ED', padding: '18px 18px 0 18px', borderRadius: '15px 15px 0 0', borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderTop: '1px solid #FED7AA' }}>
                      <p style={{ fontSize: 10, fontWeight: 900, color: '#F97316', margin: 0, letterSpacing: '0.1em', paddingTop: 2, paddingBottom: 2, lineHeight: 1.4 }}>EXPLICITEMENT HORS PÉRIMÈTRE :</p>
                    </div>
                  ),
                },
                ...splitHtmlIntoBlocks(projectExclusions).map((htmlPart, idx, arr) => ({
                  key: `hors-perimetre-part-${idx}`,
                  content: (
                    <div style={{ 
                      background: '#FFF7ED', 
                      padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && !projectExclusionsTable && projectExclusionsMoreBlocks.length === 0 ? '4px 18px 18px 18px' : '4px 18px') : (idx === arr.length - 1 && !projectExclusionsTable && projectExclusionsMoreBlocks.length === 0 ? '10px 18px 18px 18px' : '10px 18px'), 
                      borderRadius: idx === arr.length - 1 && !projectExclusionsTable && projectExclusionsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0',
                      borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderBottom: idx === arr.length - 1 && !projectExclusionsTable && projectExclusionsMoreBlocks.length === 0 ? '1px solid #FED7AA' : 'none',
                      fontSize: 10, lineHeight: 1.7, color: '#7C2D12' 
                    }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                  ),
                })),
                ...(projectExclusionsTable ? renderTableBlocks(projectExclusionsTable, 'hors-perimetre-table').map((b, idx, arr) => ({
                  key: b.key,
                  content: (
                    <div style={{ background: '#FFF7ED', padding: idx === arr.length - 1 && !projectExclusionsAfter && projectExclusionsMoreBlocks.length === 0 ? '10px 18px 18px 18px' : '0px 18px 0 18px', borderRadius: idx === arr.length - 1 && !projectExclusionsAfter && projectExclusionsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0', borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderBottom: idx === arr.length - 1 && !projectExclusionsAfter && projectExclusionsMoreBlocks.length === 0 ? '1px solid #FED7AA' : 'none', fontSize: 10, lineHeight: 1.7, color: '#7C2D12' }}>
                      {b.content}
                    </div>
                  ),
                })) : []),
                ...(projectExclusionsAfter ? splitHtmlIntoBlocks(projectExclusionsAfter).map((htmlPart, idx, arr) => ({
                  key: `hors-perimetre-after-${idx}`,
                  content: (
                    <div style={{ 
                      background: '#FFF7ED', 
                      padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && projectExclusionsMoreBlocks.length === 0 ? '4px 18px 18px 18px' : '4px 18px') : (idx === arr.length - 1 && projectExclusionsMoreBlocks.length === 0 ? '10px 18px 18px 18px' : '10px 18px'), 
                      borderRadius: idx === arr.length - 1 && projectExclusionsMoreBlocks.length === 0 ? '0 0 15px 15px' : '0',
                      borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderBottom: idx === arr.length - 1 && projectExclusionsMoreBlocks.length === 0 ? '1px solid #FED7AA' : 'none',
                      fontSize: 10, lineHeight: 1.7, color: '#7C2D12' 
                    }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                  ),
                })) : []),
                ...projectExclusionsMoreBlocks.flatMap((block, blockIdx, allBlocks) => [
                  ...renderTableBlocks(block.table, `hors-perimetre-moretable-${block.id}`).map((b, idx, arr) => ({
                    key: b.key,
                    content: (
                      <div style={{ background: '#FFF7ED', padding: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) && blockIdx === allBlocks.length - 1 ? '10px 18px 18px 18px' : '0px 18px 0 18px', borderRadius: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) && blockIdx === allBlocks.length - 1 ? '0 0 15px 15px' : '0', borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderBottom: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) && blockIdx === allBlocks.length - 1 ? '1px solid #FED7AA' : 'none', fontSize: 10, lineHeight: 1.7, color: '#7C2D12' }}>
                        {b.content}
                      </div>
                    )
                  })),
                  ...(block.showTextAfter && block.textAfter ? splitHtmlIntoBlocks(block.textAfter).map((htmlPart, idx, arr) => ({
                    key: `hors-perimetre-moreafter-${block.id}-${idx}`,
                    content: (
                      <div style={{ 
                        background: '#FFF7ED', 
                        padding: htmlPart.match(/^<ul|<ol/i) ? (idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '4px 18px 18px 18px' : '4px 18px') : (idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '10px 18px 18px 18px' : '10px 18px'), 
                        borderRadius: idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '0 0 15px 15px' : '0',
                        borderLeft: '1px solid #FED7AA', borderRight: '1px solid #FED7AA', borderBottom: idx === arr.length - 1 && blockIdx === allBlocks.length - 1 ? '1px solid #FED7AA' : 'none',
                        fontSize: 10, lineHeight: 1.7, color: '#7C2D12' 
                      }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                    )
                  })) : [])
                ]),
                ...customSections.flatMap((section, idx) => [
                  {
                    key: `section-${section.id}-title`,
                    content: (
                      <div style={{ marginTop: 30, marginBottom: 10 }}>
                        <SectionTitle title={sectionHeading(`custom:${section.id}`, section.title.toUpperCase(), `${idx + 2}. ${section.title.toUpperCase()}`)} />
                      </div>
                    ),
                  },
                  ...splitHtmlIntoBlocks(section.content).map((htmlPart, partIdx) => ({
                    key: `section-${section.id}-part-${partIdx}`,
                    content: (
                      <div
                        style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }}
                        dangerouslySetInnerHTML={{ __html: htmlPart }}
                      />
                    ),
                  })),
                  ...(section.table ? renderTableBlocks(section.table, `section-${section.id}-table`).map((b, bIdx, arr) => ({
                    key: b.key,
                    content: (
                      <div
                        style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: bIdx === arr.length - 1 && !section.contentAfter ? '8px' : '0px' }}
                      >
                        {b.content}
                      </div>
                    ),
                  })) : []),
                  ...(section.contentAfter ? splitHtmlIntoBlocks(section.contentAfter).map((htmlPart, partIdx) => ({
                    key: `section-${section.id}-after-${partIdx}`,
                    content: (
                      <div
                        style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginTop: partIdx === 0 ? '8px' : '0', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }}
                        dangerouslySetInnerHTML={{ __html: htmlPart }}
                      />
                    ),
                  })) : []),
                  ...(section.moreBlocks ? section.moreBlocks.flatMap((block, blockIdx) => [
                    ...renderTableBlocks(block.table, `section-${section.id}-moretable-${block.id}`).map((b, idx, arr) => ({
                      key: b.key,
                      content: (
                        <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginBottom: idx === arr.length - 1 && (!block.showTextAfter || !block.textAfter) ? '8px' : '0px', marginTop: idx === 0 ? '8px' : '0' }}>{b.content}</div>
                      )
                    })),
                    ...(block.showTextAfter && block.textAfter ? splitHtmlIntoBlocks(block.textAfter).map((htmlPart, partIdx) => ({
                      key: `section-${section.id}-moreafter-${block.id}-${partIdx}`,
                      content: (
                        <div style={{ fontSize: 12, lineHeight: 1.7, color: '#475569', marginTop: partIdx === 0 ? '8px' : '0', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '8px' }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                      )
                    })) : [])
                  ]) : [])
                ]),
              ]}
            />

            {/* PAGE(S) 2+: FINANCE & CONDITIONS — pagination automatique */}
            <PaginatedA4Group
              header={<Header docType={docLabel} docNumber={docNumber} date={date} currency={currency} logoSrc={primaryLogoSrc} />}
              blocks={[
                ...(items.length > 0 ? [
                  {
                    key: 'solution-proposee-title',
                    content: (
                      <div style={{ marginTop: 30 }}>
                        <SectionTitle title={sectionHeading('objet', 'OBJET & PÉRIMÈTRE', 'SOLUTION PROPOSÉE')} />
                        <div style={{ display: 'flex', borderBottom: '1px solid #7967FF', marginTop: 16 }}>
                          <span style={{ width: 60, padding: '12px 0', fontSize: 9, color: '#94A3B8', letterSpacing: '0.1em', fontWeight: 700 }}>RÉF.</span>
                          <span style={{ flex: 1, padding: '12px 0', fontSize: 9, color: '#94A3B8', letterSpacing: '0.1em', fontWeight: 700 }}>BLOC FONCTIONNEL</span>
                        </div>
                      </div>
                    )
                  },
                  ...items.flatMap((item, idx) => {
                    const blocks = [];
                    blocks.push({
                      key: `item-${item.id}-title`,
                      content: (
                        <div style={{ display: 'flex', paddingTop: 16 }}>
                          <div style={{ width: 60, fontSize: 11, fontWeight: 500, color: '#0F172A' }}>
                            B{idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: 13, fontWeight: 500, color: '#0F172A', margin: '0 0 6px 0' }}>
                              {item.description}
                            </h3>
                          </div>
                        </div>
                      )
                    });
                    
                    if (item.longDescription) {
                      blocks.push(...splitHtmlIntoBlocks(item.longDescription).map((htmlPart, partIdx) => ({
                        key: `item-${item.id}-desc-${partIdx}`,
                        content: (
                          <div style={{ display: 'flex' }}>
                            <div style={{ width: 60 }}></div>
                            <div style={{ flex: 1, fontSize: 11, lineHeight: 1.7, color: '#94A3B8', marginBottom: htmlPart.match(/^<ul|<ol/i) ? '2px' : '4px' }} dangerouslySetInnerHTML={{ __html: htmlPart.replace(/<p>/g, '').replace(/<\/p>/g, '') }} />
                          </div>
                        )
                      })));
                    }

                    if (item.subItems && item.subItems.length > 0) {
                      blocks.push({
                        key: `item-${item.id}-subitems`,
                        content: (
                          <div style={{ display: 'flex' }}>
                            <div style={{ width: 60 }}></div>
                            <ul style={{ flex: 1, margin: '4px 0 0 0', paddingLeft: 18, fontSize: 11, lineHeight: 1.7, color: '#94A3B8' }}>
                              {item.subItems.map((sub, i) => (
                                <li key={i} style={{ marginBottom: 4 }}>{sub}</li>
                              ))}
                            </ul>
                          </div>
                        )
                      });
                    }

                    blocks.push({
                      key: `item-${item.id}-border`,
                      content: (
                        <div style={{ borderBottom: '1px solid #F1F5F9', marginTop: 12 }} />
                      )
                    });
                    
                    return blocks;
                  })
                ] : []),
                {
                  key: 'devis-title',
                  content: (
                    <div style={{ marginTop: 30 }}>
                        <SectionTitle title={sectionHeading('prix', 'PRIX', 'PRIX')} />
                        <div style={{ display: 'flex', borderBottom: '2px solid #7967FF' }}>
                          <span style={{ flex: 1, padding: '12px 0', fontSize: 10, color: '#94A3B8', letterSpacing: '0.1em', fontWeight: 800 }}>BLOC FONCTIONNEL</span>
                          <span style={{ width: 60, textAlign: 'center', padding: '12px 0', fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>QTÉ</span>
                          <span style={{ width: 120, textAlign: 'right', padding: '12px 0', fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>UNITÉ ({currency})</span>
                          <span style={{ width: 120, textAlign: 'right', padding: '12px 0', fontSize: 10, color: '#94A3B8', fontWeight: 800 }}>TOTAL ({currency})</span>
                        </div>
                    </div>
                  ),
                },
                ...items.map((item, idx) => ({
                  key: `devis-item-${item.id}`,
                  content: (
                    <div style={{ display: 'flex', borderBottom: '1px solid #F1F5F9' }}>
                      <span style={{ flex: 1, padding: '14px 0', fontSize: 12, fontWeight: 700 }}>{item.description}</span>
                      <span style={{ width: 60, textAlign: 'center', padding: '14px 0', fontSize: 12 }}>{item.quantity}</span>
                      <span style={{ width: 120, textAlign: 'right', padding: '14px 0', fontSize: 12 }}>{formatPrice(item.unitPrice).replace(currency, '').replace('FCFA','').trim()}</span>
                      <span style={{ width: 120, textAlign: 'right', padding: '14px 0', fontSize: 12, fontWeight: 800 }}>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ),
                })),
                {
                  key: 'devis-totaux',
                  content: (
                    <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ width: 280, background: '#F8FAFC', padding: 20, borderRadius: 15, border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <SummaryLine label="Sous-total Brut" value={formatPrice(subtotal)} />
                        {discount > 0 && <SummaryLine label="Remise commerciale" value={`-${formatPrice(discount)}`} color="#EF4444" />}
                        <SummaryLine label="Total HT" value={formatPrice(totalHT)} weight={700} />
                        {applyTVA && <SummaryLine label="TVA (19.25%)" value={formatPrice(tvaAmount)} />}
                        {!applyTVA && <SummaryLine label="TVA" value="Non appliquée" />}
                        <div style={{ height: 1, background: '#E2E8F0', margin: '4px 0' }} />
                        <SummaryLine label="TOTAL TTC" value={formatPrice(totalTTC)} weight={900} color="#7967FF" size={16} />
                        {acompte > 0 && <SummaryLine label="Acompte versé" value={`-${formatPrice(acompte)}`} color="#22C55E" />}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 900, borderTop: '2px solid #7967FF', paddingTop: 10, marginTop: 4 }}>
                            <span>NET À PAYER</span>
                            <span>{formatPrice(netAPayer)}</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'echeancier-title',
                  content: (
                    <div style={{ marginTop: 40 }}>
                      <SectionTitle title={sectionHeading('echeancier', 'MODALITÉS DE PAIEMENT & DÉLAIS', 'ÉCHÉANCIER & DÉLAI')} />
                    </div>
                  ),
                },
                {
                  key: 'echeancier-grille',
                  content: (
                    <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', marginBottom: 12, letterSpacing: '0.1em' }}>MODALITÉS DE PAIEMENT</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {paymentSteps.map((step, idx) => (
                            <PaymentStep key={idx} step={String(idx + 1).padStart(2, '0')} label={step.label} percent={`${step.percent}%`} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#94A3B8', marginBottom: 12, letterSpacing: '0.1em' }}>DÉLAI DE RÉALISATION</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>{timeline}</p>
                        <p style={{ fontSize: 10, color: '#64748B', marginTop: 8, lineHeight: 1.6 }}>Jalons intermédiaires vérifiables communiqués au démarrage du projet, à compter de la réception de l'acompte.</p>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'echeancier-signature',
                  content: isContract ? (
                    // En mode contrat, la signature est déplacée en fin de document (bloc 'contrat-signatures').
                    <div />
                  ) : (
                    <div style={{ marginTop: 30, display: 'flex', justifyContent: 'flex-end' }}>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', marginBottom: 10 }}>POUR ACCORD (Cachet et Signature)</p>
                        <div style={{ width: 180, height: 80, border: '1px dashed #CBD5E1', borderRadius: 12, marginLeft: 'auto', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{fontSize:9, color:'#CBD5E1'}}>Signature Client</span>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'conditions-title',
                  content: (
                    <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('conditions', 'CONDITIONS & PROPRIÉTÉ INTELLECTUELLE', 'CONDITIONS & PROPRIÉTÉ')} />
                    </div>
                  ),
                },
                {
                  key: 'conditions-pi',
                  content: (
                    <div style={{ marginTop: 12 }}>
                      <CGVItem title="PROPRIÉTÉ INTELLECTUELLE" text={conditionsPI} />
                    </div>
                  ),
                },
                {
                  key: 'conditions-delais',
                  content: (
                    <div style={{ marginTop: 12 }}>
                      <CGVItem title="DÉLAIS ET LIVRAISON" text={`Durée estimée : ${timeline}. ${conditionsDelais}`} />
                    </div>
                  ),
                },
                {
                  key: 'conditions-support',
                  content: (
                    <div style={{ marginTop: 12 }}>
                      <CGVItem title="SUPPORT ET MAINTENANCE" text={supportTerms} />
                    </div>
                  ),
                },
                {
                  key: 'conditions-impayes',
                  content: (
                    <div style={{ marginTop: 12 }}>
                      <CGVItem title="GESTION DES IMPAYÉS" text={conditionsImpayes} />
                    </div>
                  ),
                },
                ...(isContract ? [
                  {
                    key: 'contrat-obligations-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('obligations', 'OBLIGATIONS DES PARTIES', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-obligations-prestataire-title',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', letterSpacing: '0.05em' }}>OBLIGATIONS DU PRESTATAIRE</p>
                      </div>
                    ),
                  },
                  // splitHtmlIntoBlocks réécrit les listes (puces rendues via un span
                  // positionné, pour éviter leur découpe à l'export PDF) et rend chaque
                  // puce paginable indépendamment — même traitement que les autres
                  // sections riches du document.
                  ...splitHtmlIntoBlocks(termObligationsPrestataire).map((htmlPart, idx) => ({
                    key: `contrat-obligations-prestataire-part-${idx}`,
                    content: (
                      <div style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                    ),
                  })),
                  {
                    key: 'contrat-obligations-client-title',
                    content: (
                      <div style={{ marginTop: 16 }}>
                        <p style={{ fontSize: 10, fontWeight: 900, color: '#0F172A', letterSpacing: '0.05em' }}>OBLIGATIONS DU CLIENT</p>
                      </div>
                    ),
                  },
                  ...splitHtmlIntoBlocks(termObligationsClient).map((htmlPart, idx) => ({
                    key: `contrat-obligations-client-part-${idx}`,
                    content: (
                      <div style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: htmlPart }} />
                    ),
                  })),
                  {
                    key: 'contrat-confidentialite-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('confidentialite', 'CONFIDENTIALITÉ', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-confidentialite-body',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{termConfidentialite}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-resiliation-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('resiliation', 'RÉSILIATION', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-resiliation-body',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{termResiliation}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-force-majeure-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('forceMajeure', 'FORCE MAJEURE', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-force-majeure-body',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{termForceMajeure}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-reversibilite-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('reversibilite', 'RÉVERSIBILITÉ & RESTITUTION DES DONNÉES', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-reversibilite-body',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{termReversibilite}</p>
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-droit-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title={sectionHeading('droitApplicable', 'DROIT APPLICABLE & JURIDICTION', '')} />
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-droit-body',
                    content: (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{termDroitApplicable}</p>
                      </div>
                    ),
                  },
                ] : []),
                {
                  key: 'modalites-title',
                  content: (
                    <div style={{ marginTop: 40 }}>
                      <SectionTitle title={sectionHeading('modalites', 'MODALITÉS DE RÈGLEMENT', 'MODALITÉS DE RÈGLEMENT')} />
                    </div>
                  ),
                },
                {
                  key: 'modalites-mobile-money',
                  content: (
                    <div style={{ marginTop: 12, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', marginBottom: 12, letterSpacing: '0.1em' }}>MOBILE MONEY</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: 4 }}>ORANGE MONEY</p>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>694 08 65 71</p>
                          <p style={{ fontSize: 9, color: '#64748B', marginTop: 4 }}>Titulaire : NA Fotie</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 9, fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', marginBottom: 4 }}>MTN MOMO</p>
                          <p style={{ fontSize: 13, fontWeight: 900, color: '#0F172A' }}>678 615 677</p>
                          <p style={{ fontSize: 9, color: '#64748B', marginTop: 4 }}>Titulaire : Fotie Wilfried Bonaventure</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'modalites-rib',
                  content: (
                    <div style={{ marginTop: 14, background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', marginBottom: 12, letterSpacing: '0.1em' }}>VIREMENT BANCAIRE (RIB)</p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <SummaryLine label="Banque" value="UBA Cameroun" />
                        <SummaryLine label="Titulaire" value="Fotie Wilfried Bonaventure" />
                        <SummaryLine label="IBAN" value="CM21 10033 05203 03009004415-64" weight={800} color="#0F172A" />
                        <SummaryLine label="Code Swift/BIC" value="UNAFCMCX" weight={800} color="#0F172A" />
                      </div>
                    </div>
                  ),
                },
                ...(isContract ? [
                  {
                    key: 'contrat-signatures-title',
                    content: (
                      <div style={{ marginTop: 40 }}>
                        <SectionTitle title="SIGNATURES" />
                        <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>
                          Fait à {contractSignaturePlace || '…'}, le {formatDate(contractStartDate || date)}, en deux (2) exemplaires originaux,
                          chaque Partie reconnaissant avoir reçu le sien.
                        </p>
                      </div>
                    ),
                  },
                  {
                    key: 'contrat-signatures-blocs',
                    content: (
                      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                        <SignatureBlock
                          role="LE PRESTATAIRE"
                          company={COMPANY_INFO.name}
                          rep={providerLegalRep}
                          repRole={providerLegalRepRole}
                        />
                        <SignatureBlock
                          role="LE CLIENT"
                          company={clientCompany || '(Client Corporate)'}
                          rep={clientLegalRep || clientName}
                          repRole={clientLegalRepRole}
                        />
                      </div>
                    ),
                  },
                ] : []),
                {
                  key: 'modalites-footer',
                  content: (
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #F1F5F9' }}>
                      <p style={{ fontSize: 9, color: '#94A3B8' }}>
                        {COMPANY_INFO.name} — NIU : {COMPANY_INFO.taxId} — {COMPANY_INFO.address} — {COMPANY_INFO.email} — {COMPANY_INFO.phone}
                      </p>
                    </div>
                  ),
                },
              ]}
            />
          </React.Fragment>
        )}

      </div>

      <style jsx global>{`
        .a4-page {
          width: 210mm;
          min-height: 297mm;
          background: #FFF;
          box-shadow: 0 0 50px rgba(0,0,0,0.08);
          padding: 20mm;
          box-sizing: border-box;
          position: relative;
          font-family: var(--font-sans, "DM Sans"), sans-serif;
          display: flex;
          flex-direction: column;
        }
        @media print {
          body { background: white !important; padding: 0 !important; margin: 0 !important; }
          .no-print { display: none !important; }
          .a4-page { 
            box-shadow: none !important; 
            margin: 0 !important; 
            width: 100% !important;
            height: 100% !important;
            page-break-before: always;
            border: none !important;
          }
          .a4-page:first-child { page-break-before: avoid; }
          @page { size: A4; margin: 0; }
        }
        @keyframes blob-float {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─── HELPER COMPONENTS ─── */

interface TableData {
  headers: string[];
  rows: string[][];
  rowColors?: string[];
}
interface ExtraBlock {
  id: string;
  table: TableData;
  textAfter: string;
  showTextAfter?: boolean;
}

function RichEditor({ value, onChange, table, onTableChange, valueAfter, onChangeAfter, moreBlocks, onMoreBlocksChange }: { value: string, onChange: (val: string) => void, table?: TableData | null, onTableChange?: (val: TableData | null) => void, valueAfter?: string, onChangeAfter?: (val: string) => void, moreBlocks?: ExtraBlock[], onMoreBlocksChange?: (blocks: ExtraBlock[]) => void }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const editorAfterRef = React.useRef<HTMLDivElement>(null);
  const [showAfter, setShowAfter] = React.useState(!!valueAfter);
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);
  useEffect(() => {
    if (editorAfterRef.current && valueAfter !== undefined && editorAfterRef.current.innerHTML !== valueAfter) {
      editorAfterRef.current.innerHTML = valueAfter;
    }
  }, [valueAfter]);
  const exec = (cmd: string) => {
    document.execCommand(cmd, false);
    if (editorRef.current && document.activeElement === editorRef.current) onChange(editorRef.current.innerHTML);
    if (editorAfterRef.current && document.activeElement === editorAfterRef.current && onChangeAfter) onChangeAfter(editorAfterRef.current.innerHTML);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div style={{ border: '1px solid #E2E8F0', borderRadius: 10, overflow: 'hidden', background: '#FFF' }}>
      <div style={{ display: 'flex', gap: 5, padding: '6px 10px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
        <button onMouseDown={e => e.preventDefault()} onClick={() => exec('bold')} style={toolBtnStyle}>B</button>
        <button onMouseDown={e => e.preventDefault()} onClick={() => exec('italic')} style={toolBtnStyle}>I</button>
        <button onMouseDown={e => e.preventDefault()} onClick={() => exec('insertUnorderedList')} style={toolBtnStyle}>• Liste</button>
        {onTableChange && !table && (
          <button onMouseDown={e => e.preventDefault()} onClick={() => onTableChange({ headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] })} style={toolBtnStyle}>▦ + Tableau</button>
        )}
        {onMoreBlocksChange && table && (
          <button onMouseDown={e => e.preventDefault()} onClick={() => onMoreBlocksChange([...(moreBlocks || []), { id: Math.random().toString(36).slice(2), table: { headers: ['Colonne 1', 'Colonne 2'], rows: [['', '']] }, textAfter: '' }])} style={toolBtnStyle}>▦ + Autre Tableau</button>
        )}
      </div>
      <div ref={editorRef} contentEditable onPaste={handlePaste} onInput={(e) => onChange(e.currentTarget.innerHTML)} style={{ padding: '12px', minHeight: 80, outline: 'none', fontSize: 13, lineHeight: 1.6 }} />
      {onTableChange && table && <TableEditor table={table} onChange={onTableChange} onAddAfter={() => setShowAfter(true)} showAddAfter={!!onChangeAfter && !showAfter} />}
      {onChangeAfter && table && showAfter && (
        <div ref={editorAfterRef} contentEditable onPaste={handlePaste} onInput={(e) => onChangeAfter(e.currentTarget.innerHTML)} style={{ padding: '12px', minHeight: 60, outline: 'none', fontSize: 13, lineHeight: 1.6, borderTop: '1px dashed #E2E8F0', background: '#F8FAFC' }} />
      )}
      
      {moreBlocks?.map((block, idx) => (
        <React.Fragment key={block.id}>
          <TableEditor 
            table={block.table} 
            onChange={t => {
              if (!t && onMoreBlocksChange) {
                onMoreBlocksChange(moreBlocks.filter((_, i) => i !== idx));
              } else if (t && onMoreBlocksChange) {
                const nb = [...moreBlocks];
                nb[idx].table = t;
                onMoreBlocksChange(nb);
              }
            }} 
            onAddAfter={() => {
              if (onMoreBlocksChange) {
                const nb = [...moreBlocks];
                nb[idx].showTextAfter = true;
                onMoreBlocksChange(nb);
              }
            }} 
            showAddAfter={!block.showTextAfter} 
          />
          {block.showTextAfter && (
            <div 
              contentEditable 
              onPaste={handlePaste} 
              onInput={e => {
                if (onMoreBlocksChange) {
                  const nb = [...moreBlocks];
                  nb[idx].textAfter = e.currentTarget.innerHTML;
                  onMoreBlocksChange(nb);
                }
              }} 
              style={{ padding: '12px', minHeight: 60, outline: 'none', fontSize: 13, lineHeight: 1.6, borderTop: '1px dashed #E2E8F0', background: '#F8FAFC' }} 
              dangerouslySetInnerHTML={{ __html: block.textAfter || '' }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function TableEditor({ table, onChange, onAddAfter, showAddAfter }: { table: TableData; onChange: (val: TableData | null) => void, onAddAfter?: () => void, showAddAfter?: boolean }) {
  const addColumn = () => onChange({ headers: [...table.headers, `Colonne ${table.headers.length + 1}`], rows: table.rows.map(r => [...r, '']) });
  const removeColumn = (colIdx: number) => onChange({ headers: table.headers.filter((_, i) => i !== colIdx), rows: table.rows.map(r => r.filter((_, i) => i !== colIdx)) });
  const addRow = () => onChange({ ...table, rows: [...table.rows, table.headers.map(() => '')] });
  const removeRow = (rowIdx: number) => onChange({ ...table, rows: table.rows.filter((_, i) => i !== rowIdx) });
  const updateHeader = (colIdx: number, val: string) => onChange({ ...table, headers: table.headers.map((h, i) => i === colIdx ? val : h) });
  const updateCell = (rowIdx: number, colIdx: number, val: string) => onChange({ ...table, rows: table.rows.map((r, ri) => ri === rowIdx ? r.map((c, ci) => ci === colIdx ? val : c) : r) });
  const updateRowColor = (rowIdx: number, color: string) => {
    const newColors = [...(table.rowColors || [])];
    while (newColors.length < table.rows.length) newColors.push('');
    newColors[rowIdx] = color;
    onChange({ ...table, rowColors: newColors });
  };

  return (
    <div style={{ padding: '0 12px 12px', borderTop: '1px solid #F1F5F9' }}>
      <div style={{ display: 'flex', gap: 6, margin: '10px 0' }}>
        <button onMouseDown={e => { e.preventDefault(); document.execCommand('bold', false); }} style={{ ...toolBtnStyle, fontSize: 10 }}>B</button>
        <button onClick={addColumn} style={{ ...toolBtnStyle, fontSize: 10 }}>+ Colonne</button>
        <button onClick={addRow} style={{ ...toolBtnStyle, fontSize: 10 }}>+ Ligne</button>
        {showAddAfter && onAddAfter && (
          <button onClick={onAddAfter} style={{ ...toolBtnStyle, fontSize: 10, color: '#7967FF' }}>+ Continuer le texte</button>
        )}
        <button onClick={() => onChange(null)} style={{ ...toolBtnStyle, fontSize: 10, color: '#EF4444' }}>Supprimer le tableau</button>
      </div>
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: 'auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {table.headers.map((h, colIdx) => (
                <th key={colIdx} style={{ border: '1px solid #E2E8F0', padding: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <TableCell value={h} onChange={val => updateHeader(colIdx, val)} isHeader />
                    {table.headers.length > 1 && (
                      <button onClick={() => removeColumn(colIdx)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0 6px', flexShrink: 0 }}><X size={11} /></button>
                    )}
                  </div>
                </th>
              ))}
              <th style={{ width: 24 }} />
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rowIdx) => {
              const rowColor = table.rowColors?.[rowIdx] || '';
              return (
              <tr key={rowIdx} style={{ backgroundColor: rowColor || 'transparent' }}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} style={{ border: '1px solid #E2E8F0', padding: 0 }}>
                    <TableCell value={cell} onChange={val => updateCell(rowIdx, colIdx, val)} />
                  </td>
                ))}
                <td style={{ textAlign: 'center', display: 'flex', gap: 6, padding: '0 8px', alignItems: 'center', height: '100%', minHeight: 40 }}>
                  <input type="color" value={rowColor || '#ffffff'} onChange={e => updateRowColor(rowIdx, e.target.value)} style={{ width: 16, height: 16, padding: 0, border: 'none', background: 'none', cursor: 'pointer' }} title="Couleur de fond" />
                  {table.rows.length > 1 && (
                    <button onClick={() => removeRow(rowIdx)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex' }}><X size={11} /></button>
                  )}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableCell({ value, onChange, isHeader }: { value: string, onChange: (val: string) => void, isHeader?: boolean }) {
  const cellRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cellRef.current && cellRef.current.innerHTML !== value) {
      cellRef.current.innerHTML = value;
    }
  }, [value]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div
      ref={cellRef}
      contentEditable
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onBlur={(e) => onChange(e.currentTarget.innerHTML)}
      onPaste={handlePaste}
      style={{
        width: 110,
        padding: '6px 8px',
        fontSize: isHeader ? 11 : 12,
        fontWeight: isHeader ? 800 : 400,
        border: 'none',
        outline: 'none',
        background: isHeader ? '#F8FAFC' : 'transparent',
        minHeight: isHeader ? 34 : 40,
        fontFamily: 'inherit',
        whiteSpace: 'pre-wrap',
        boxSizing: 'border-box'
      }}
    />
  );
}

function renderTableBlocks(table: TableData, keyPrefix: string): { key: string; content: React.ReactNode }[] {
  if (!table || !table.headers || !table.rows || table.rows.length === 0) return [];
  const blocks: { key: string; content: React.ReactNode }[] = [];
  const colCount = table.headers.length;
  const colWidth = `${100 / colCount}%`;
  const tableStyle = "table-layout:fixed;width:100%;border-collapse:collapse;margin:0;";
  const thStyle = `width:${colWidth};border:1px solid #E2E8F0;padding:8px;font-size:11px;font-weight:800;background:#F8FAFC;text-align:left;word-wrap:break-word;white-space:pre-wrap;`;
  const tdStyle = `width:${colWidth};border:1px solid #E2E8F0;border-top:none;padding:8px;font-size:12px;word-wrap:break-word;white-space:pre-wrap;`;

  blocks.push({
    key: `${keyPrefix}-header`,
    content: (
      <div dangerouslySetInnerHTML={{ __html: `
        <table style="${tableStyle}">
          <thead><tr>${table.headers.map(h => `<th style="${thStyle}">${h}</th>`).join('')}</tr></thead>
        </table>
      `}} />
    )
  });

  table.rows.forEach((row, idx) => {
    const rowColor = table.rowColors?.[idx] || 'transparent';
    const rowStyle = rowColor && rowColor !== 'transparent' ? `background-color: ${rowColor};` : '';
    blocks.push({
      key: `${keyPrefix}-row-${idx}`,
      content: (
        <div dangerouslySetInnerHTML={{ __html: `
          <table style="${tableStyle}; border-top: none;">
            <tbody><tr style="${rowStyle}">${row.map(cell => `<td style="${tdStyle}">${cell}</td>`).join('')}</tr></tbody>
          </table>
        `}} />
      )
    });
  });

  return blocks;
}

function splitHtmlIntoBlocks(html: string): string[] {
  if (!html) return [];
  if (typeof window === 'undefined') return [html];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const blocks: string[] = [];
  
  // Transform lists into individual list items wrapped in their own UL/OL
  const lists = doc.querySelectorAll('ul, ol');
  lists.forEach((listNode) => {
    const list = listNode as HTMLElement;
    const listTag = list.nodeName.toLowerCase();
    const fragment = doc.createDocumentFragment();
    const children = Array.from(list.children);
    
    fragment.appendChild(doc.createElement('br'));
    
    children.forEach((li, idx) => {
      if (li.nodeName === 'LI') {
        const clone = list.cloneNode(false) as HTMLElement;
        clone.style.marginTop = idx === 0 ? (list.style.marginTop || '0') : '0';
        clone.style.marginBottom = idx === children.length - 1 ? (list.style.marginBottom || '0') : '0';
        clone.style.paddingLeft = clone.style.paddingLeft || '20px';
        if (listTag === 'ul') clone.style.listStyleType = 'none';
        if (listTag === 'ol') clone.style.listStyleType = 'decimal';
        
        const liClone = li.cloneNode(true) as HTMLElement;
        // Unwrap <p> inside <li> to fix bullet vertical alignment
        if (liClone.children.length === 1 && liClone.children[0].nodeName === 'P') {
          liClone.innerHTML = liClone.children[0].innerHTML;
        }
        // Apply extra padding-top to prevent font clipping in PDF
        liClone.style.paddingTop = '2px';
        
        if (listTag === 'ul') {
          liClone.style.position = 'relative';
          const bullet = doc.createElement('span');
          bullet.style.position = 'absolute';
          bullet.style.left = '-14px';
          bullet.style.top = '2px';
          bullet.innerHTML = '•';
          liClone.insertBefore(bullet, liClone.firstChild);
        }
        
        clone.appendChild(liClone);
        fragment.appendChild(clone);
        
        fragment.appendChild(doc.createElement('br'));
      }
    });
    list.parentNode?.replaceChild(fragment, list);
  });
  
  let processedHtml = doc.body.innerHTML;
  let normalizedHtml = processedHtml.replace(/(<\/(p|div|h[1-6])>)/gi, '$1<br>');
  const parts = normalizedHtml.split(/<br\s*\/?>/i);
  
  parts.forEach(part => {
    let clean = part.trim();
    clean = clean.replace(/^<[^>]+>\s*<\/[^>]+>$/, '').trim();
    if (clean && clean !== '&nbsp;' && clean !== '<br>') {
      const tempDoc = parser.parseFromString(`<div>${clean}</div>`, 'text/html');
      const inner = tempDoc.body.children[0].innerHTML;
      if (inner.trim() && inner.trim() !== '&nbsp;' && inner !== '<br>') {
        blocks.push(inner);
      }
    }
  });
  
  return blocks.length > 0 ? blocks : [html];
}



const A4_HEIGHT_MM = 297;
const MM_TO_PX = 3.7795; // à 96 DPI

/**
 * Répartit une liste de blocs indépendants sur autant de pages A4 que nécessaire,
 * en gardant chaque bloc entier (jamais coupé au milieu).
 *
 * Implémentation volontairement simple : à chaque rendu (donc à chaque frappe dans le
 * formulaire), on remesure tout depuis zéro dans un conteneur invisible et on recalcule
 * la répartition en pages. Pas de state intermédiaire ni de dépendance d'effet optimisée
 * (type "ne recalcule que si la structure change") — une version précédente plus
 * "optimisée" avec ResizeObserver + clé stable + refs s'est révélée fragile en pratique
 * (le calcul se figeait parfois sur un état non paginé). Recalculer systématiquement est
 * moins performant mais beaucoup plus facile à auditer et fiable.
 */
function PaginatedA4Group({ header, blocks }: { header: React.ReactNode; blocks: { key: string; content: React.ReactNode }[] }) {
  const measureRef = React.useRef<HTMLDivElement>(null);
  const headerMeasureRef = React.useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<{ key: string; content: React.ReactNode }[][]>([]);

  useLayoutEffect(() => {
    const container = measureRef.current;
    const headerEl = headerMeasureRef.current;
    if (!container || !headerEl || blocks.length === 0) {
      setPages(blocks.length ? [blocks] : []);
      return;
    }

    const safetyMarginPx = 6;
    const paddingYMm = 40; // 20mm top + 20mm bottom padding from .a4-page
    const maxPagePx = (A4_HEIGHT_MM - paddingYMm) * MM_TO_PX - safetyMarginPx;
    const headerHeight = headerEl.getBoundingClientRect().height;
    const blockEls = Array.from(container.children) as HTMLElement[];

    // getBoundingClientRect().height d'un bloc n'inclut pas son marginTop/marginBottom —
    // on mesure donc l'espace réel occupé dans le flux (distance entre le haut du bloc et
    // le haut du bloc suivant), qui capture naturellement marges et espacements.
    const containerTop = container.getBoundingClientRect().top;
    const tops = blockEls.map(el => el.getBoundingClientRect().top - containerTop);
    const containerHeight = container.getBoundingClientRect().height;
    const spans = blockEls.map((_, idx) => (idx + 1 < tops.length ? tops[idx + 1] : containerHeight) - tops[idx]);

    const result: { key: string; content: React.ReactNode }[][] = [];
    let current: { key: string; content: React.ReactNode }[] = [];
    let usedHeight = headerHeight;

    blocks.forEach((block, idx) => {
      const blockSpan = spans[idx] ?? 0;
      if (current.length > 0 && usedHeight + blockSpan > maxPagePx) {
        result.push(current);
        current = [];
        usedHeight = headerHeight;
      }
      current.push(block);
      usedHeight += blockSpan;
    });
    if (current.length > 0) result.push(current);

    const finalPages = result.length ? result : [blocks];
    setPages(prev => {
      // Évite un re-render (et donc un recalcul en cascade) si le résultat est identique —
      // notamment utile sous React Strict Mode, qui exécute cet effet deux fois de suite en
      // dev : sans ce garde-fou, le second passage peut mesurer un DOM déjà partiellement
      // transitionné vers le résultat du premier passage et produire une pagination incohérente.
      const samePageCount = prev.length === finalPages.length;
      const sameKeys = samePageCount && prev.every((p, i) => p.map(b => b.key).join('|') === finalPages[i].map(b => b.key).join('|'));
      return sameKeys ? prev : finalPages;
    });
  }, [blocks]);

  return (
    <>
      {/*
        Zone de mesure invisible : même boîte que .a4-page (largeur, padding, box-sizing,
        font-family) pour que le texte s'y enroule EXACTEMENT comme dans le rendu final.
      */}
      <div className="a4-page" style={{ position: 'fixed', top: 0, left: -99999, visibility: 'hidden', pointerEvents: 'none', minHeight: 0, boxShadow: 'none' }} aria-hidden="true">
        <div ref={headerMeasureRef}>{header}</div>
        <div ref={measureRef}>
          {blocks.map(b => <div key={b.key}>{b.content}</div>)}
        </div>
      </div>

      {pages.map((pageBlocks, pageIdx) => (
        <A4Page key={pageIdx}>
          {header}
          {pageBlocks.map(b => <React.Fragment key={b.key}>{b.content}</React.Fragment>)}
        </A4Page>
      ))}
    </>
  );
}

function A4Page({ children }: { children: React.ReactNode }) {
  return (
    <div className="a4-page">
      {children}
    </div>
  );
}

function InfoBox({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 14, padding: 18 }}>
      <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', marginBottom: 10, letterSpacing: '0.1em' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {lines.map((line, idx) => (
          <p key={idx} style={{ fontSize: idx === 0 ? 11 : 9, fontWeight: idx === 0 ? 900 : 600, color: idx === 0 ? '#0F172A' : '#64748B', lineHeight: 1.45, margin: 0 }}>
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function SummaryLine({ label, value, weight = 600, color = '#475569', size = 12 }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: size }}>
       <span style={{ color: '#64748B' }}>{label}</span>
       <span style={{ fontWeight: weight, color }}>{value}</span>
    </div>
  );
}

function PaymentStep({ step, label, percent }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '10px', background: '#F8FAFC', borderRadius: '8px' }}>
       <span style={{ fontSize: 10, fontWeight: 900, color: '#7967FF' }}>{step}</span>
       <span style={{ fontSize: 11, flex: 1, fontWeight: 600 }}>{label}</span>
       <span style={{ fontSize: 11, fontWeight: 800, color: '#0F172A' }}>{percent}</span>
    </div>
  );
}

function CGVItem({ title, text }: any) {
  return (
    <div style={{ background: '#F8FAFC', padding: 20, borderRadius: 12, border: '1px solid #F1F5F9' }}>
       <p style={{ fontSize: 9, fontWeight: 900, color: '#0F172A', marginBottom: 8, letterSpacing: '0.05em' }}>{title}</p>
       <p style={{ fontSize: 10, color: '#64748B', lineHeight: 1.7 }}>{text}</p>
    </div>
  );
}

function PartyBlock({ role, company, address, taxId, registryId, rep, repRole, email }: any) {
  return (
    <div style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', borderRadius: 12, padding: 16 }}>
      <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', letterSpacing: '0.1em', marginBottom: 8 }}>{role}</p>
      <p style={{ fontSize: 13, fontWeight: 900, color: '#0F172A', marginBottom: 6 }}>{company}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {address && <p style={{ fontSize: 9, color: '#64748B', lineHeight: 1.6 }}>{address}</p>}
        {taxId && <p style={{ fontSize: 9, color: '#64748B' }}>NIU : {taxId}</p>}
        {registryId && <p style={{ fontSize: 9, color: '#64748B' }}>RCCM : {registryId}</p>}
        {email && <p style={{ fontSize: 9, color: '#64748B' }}>{email}</p>}
        {rep && (
          <p style={{ fontSize: 9, color: '#0F172A', marginTop: 6, lineHeight: 1.6 }}>
            Représenté par <b>{rep}</b>{repRole ? `, ${repRole}` : ''}
          </p>
        )}
      </div>
    </div>
  );
}

function SignatureBlock({ role, company, rep, repRole }: any) {
  return (
    // `height: 100%` + colonne flex : les deux cadres de signature restent alignés même
    // quand un côté a une ligne de moins (qualité du signataire non renseignée).
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <p style={{ fontSize: 9, fontWeight: 900, color: '#7967FF', letterSpacing: '0.1em', marginBottom: 6 }}>{role}</p>
      <p style={{ fontSize: 11, fontWeight: 900, color: '#0F172A' }}>{company}</p>
      <p style={{ fontSize: 9, color: '#64748B', marginTop: 2, minHeight: 13 }}>
        {rep ? `${rep}${repRole ? ` — ${repRole}` : ''}` : ''}
      </p>
      <p style={{ fontSize: 9, color: '#94A3B8', marginTop: 10, marginBottom: 6 }}>
        Précédée de la mention « Lu et approuvé »
      </p>
      {/* Lieu et date renseignés par le signataire lui-même : une signature manuscrite
          non datée n'a quasiment aucune valeur probante en cas de contestation. */}
      <div style={{ display: 'flex', gap: 10, marginTop: 'auto', marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 8, color: '#94A3B8', letterSpacing: '0.04em' }}>Fait à</span>
          <div style={{ borderBottom: '1px solid #CBD5E1', height: 16 }} />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 8, color: '#94A3B8', letterSpacing: '0.04em' }}>Le</span>
          <div style={{ borderBottom: '1px solid #CBD5E1', height: 16 }} />
        </div>
      </div>
      {/* 120px ≈ 32 mm sur A4 : une signature tracée au doigt (Markup iOS) déborde
          facilement d'un cadre plus petit. */}
      <div style={{ height: 120, border: '1px dashed #CBD5E1', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 9, color: '#CBD5E1' }}>Cachet et signature</span>
      </div>
    </div>
  );
}

function Header({ docType, docNumber, date, currency, logoSrc }: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 25, borderBottom: '1px solid #F1F5F9' }}>
      <div>
        <img src={logoSrc} alt="Ozirus" style={{ height: 35, width: 'auto', maxWidth: 120, objectFit: 'contain', filter: logoSrc === '/logo.png' ? PRIMARY_LOGO_FALLBACK_FILTER : 'none', marginBottom: 12 }} />
        <p style={{ fontSize: 9, color: '#94A3B8', fontWeight: 800, fontFamily: 'var(--font-display, "Clash Display"), sans-serif', letterSpacing: '0.05em' }}>OZIRUS AGENCY — SOLUTIONS IA & DIGITAL</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: 16, fontWeight: 900, color: '#7967FF', fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>{docType}</p>
        <p style={{ fontSize: 10, color: '#64748B', marginTop: 5, fontWeight: 600 }}>RÉF: {docNumber} | DATE: {date} | DEVISE: {currency}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h3 style={{ fontSize: 13, fontWeight: 900, color: '#7967FF', letterSpacing: '0.1em', marginBottom: 25, display: 'flex', alignItems: 'center', gap: 15, fontFamily: 'var(--font-display, "Clash Display"), sans-serif' }}>
      {title}
      <div style={{ flex: 1, height: 1, background: '#F1F5F9' }} />
    </h3>
  );
}

const tabBtn = { padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800, border: 'none', cursor: 'pointer', transition: 'all 0.2s' };
const subTab = { padding: '12px 4px', background: 'none', border: 'none', borderBottom: '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' };
const sectionTitle = { fontSize: 10, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 12 };
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, outline: 'none', background: '#FFF', boxSizing: 'border-box' as const };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 800, color: '#64748B', marginBottom: 6, marginLeft: 4 };
const toolBtnStyle = { background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 4, padding: '4px 10px', fontSize: 11, cursor: 'pointer', fontWeight: 800, color: '#475569' };
const primaryBtnStyle = { width: '100%', background: '#7967FF', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 12px rgba(121,103,255,0.3)' };
