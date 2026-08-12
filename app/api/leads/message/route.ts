import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prospect, campaign, score } = await req.json();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY manquante' }, { status: 500 });
  }

  const prompt = `Tu es un expert en copywriting B2B pour une agence d'automatisation IA appelée Ozirus Agency.

Génère un message de prospection personnalisé pour le canal "${campaign.channel}".

Contexte du prospect :
- Nom : ${prospect.name}
- Secteur : ${prospect.category ?? campaign.niche}
- Ville : ${prospect.city}
- Site web : ${prospect.website ? 'Oui — ' + prospect.website : 'Aucun'}
- Note Google : ${prospect.googleRating ?? 'N/A'} (${prospect.googleReviewsCount ?? 0} avis)
- Problème détecté : ${score.detectedProblem}
- Angle recommandé : ${score.recommendedAngle}

Offre Ozirus : ${campaign.offer}

Règles :
- Message court, naturel, non spam
- Basé uniquement sur les informations fournies
- Ton chaleureux et professionnel
- Pas de promesses excessives
- Finir par un appel à l'action clair (15 min de call)
- En français

Canal : ${campaign.channel}
${campaign.channel === 'whatsapp' ? '- Format WhatsApp : court (max 5 lignes), emojis sobres, gras avec *asterisques*' : ''}
${campaign.channel === 'email' ? '- Format email : objet accrocheur + corps structuré en 3 paragraphes courts' : ''}
${campaign.channel === 'linkedin' ? '- Format LinkedIn : message de connexion, max 300 caractères, sobre' : ''}
${campaign.channel === 'call' ? '- Format script d\'appel : intro + accroche + valeur + CTA, avec les répliques exactes entre guillemets' : ''}

Retourne UNIQUEMENT ce JSON valide, sans markdown :
{
  "message": "<le message complet>",
  "subject": ${campaign.channel === 'email' ? '"<objet de l\'email>"' : 'null'}
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
      temperature: 0.7,
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
    const result = JSON.parse(content);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'Réponse OpenAI non parseable', raw: content }, { status: 500 });
  }
}
