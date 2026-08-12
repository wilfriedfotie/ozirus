import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prospect, campaign } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY manquante' }, { status: 500 });
  }

  const prompt = `Tu es un agent d'analyse de leads B2B pour une agence d'automatisation IA.

Analyse ce prospect et retourne UNIQUEMENT un JSON valide, sans markdown, sans explication.

Prospect :
- Nom : ${prospect.name}
- Catégorie : ${prospect.category ?? 'Non renseigné'}
- Adresse : ${prospect.address ?? 'Non renseignée'}
- Téléphone : ${prospect.phone ? 'Oui' : 'Non'}
- Site web : ${prospect.website ? prospect.website : 'Aucun'}
- Note Google : ${prospect.googleRating ?? 'N/A'} (${prospect.googleReviewsCount ?? 0} avis)

Offre de l'agence : ${campaign.offer}
Niche ciblée : ${campaign.niche}
Ville : ${campaign.city}

Critères de scoring (total 100 points) :
- +20 si contact disponible (téléphone ou email)
- +20 si besoin visible (pas de site, mauvais avis, pas de présence digitale)
- +20 si fit avec l'offre (niche correspondante)
- +15 si présence digitale faible ou améliorable
- +15 si business actif (avis récents, note > 3.5)
- +10 si facilité de personnalisation du message

Règles : 0-49 = cold, 50-74 = warm, 75-100 = hot

Retourne ce JSON exact :
{
  "score": <nombre entre 0 et 100>,
  "priority": "<cold|warm|hot>",
  "detectedProblem": "<problème principal détecté en 1 phrase>",
  "recommendedAngle": "<angle d'approche recommandé en 1 phrase>",
  "reason": "<justification du score en 1-2 phrases>",
  "budgetPotential": "<low|medium|high|unknown>",
  "conversionDifficulty": "<easy|medium|hard>"
}`;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: `OpenAI error: ${err}` }, { status: res.status });
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  try {
    const score = JSON.parse(content);
    return NextResponse.json(score);
  } catch {
    return NextResponse.json({ error: 'Réponse OpenAI non parseable', raw: content }, { status: 500 });
  }
}
