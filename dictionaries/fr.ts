// French is the source of truth for the dictionary shape — `ar.ts` is typed
// against `Dict`, so the two files stay structurally locked together.
//
// Price-bearing strings are FUNCTIONS taking an already-formatted price. Never
// hardcode a price here: it would silently desync from `lib/config.ts`.

export const fr = {
  announce: "Livraison gratuite partout au Maroc — Paiement à la livraison",
  nav: { brand: "Vitasilk", cta: "Commander" },
  hero: {
    eyebrow: "Vitasilk Professional",
    title1: "24K",
    title2: "Gold",
    subtitle:
      "Le lissage professionnel à l'or 24 carats — sans acide glyoxylique, sans formol. Des cheveux lisses, nourris et éclatants dès la première application.",
    cta: (price: string) => `Je commande — ${price}`,
    badge1: "0% Acide Glyoxylique",
    badge2: "1 L — Format Salon",
    badge3: "Or 24K & Kératine",
    scroll: "Découvrir",
  },
  marquee: [
    "Lissage parfait",
    "Sans acide glyoxylique",
    "Or 24 carats",
    "Kératine & Collagène",
    "Brillance miroir",
    "Format salon 1 L",
  ],
  problem: {
    title: "Un lissage ne devrait pas abîmer vos cheveux",
    subtitle:
      "Formules agressives, vapeurs irritantes, résultat qui s'efface au bout de trois lavages… La plupart des lissages coûtent cher à la fibre capillaire.",
    points: [
      "Formules à l'acide glyoxylique qui fragilisent la fibre",
      "Vapeurs irritantes pour vous et pour votre coiffeuse",
      "Résultat qui s'estompe après quelques lavages",
      "Cheveux secs, ternes et cassants après le lissage",
    ],
    promiseTitle: "La promesse 24K Gold",
    promise:
      "Une formule qui lisse en nourrissant : l'or 24 carats et la kératine referment la fibre, le collagène et les acides aminés la reconstruisent. Un lissage net et durable — sans acide glyoxylique, sans formol.",
  },
  safety: {
    title: "Sans acide glyoxylique. Sans formol.",
    subtitle:
      "Le lissage professionnel que vous pouvez utiliser sereinement, séance après séance.",
    items: [
      {
        title: "Sans acide glyoxylique",
        desc: "Aucune des substances mises en cause dans les lissages agressifs.",
      },
      {
        title: "Sans formol",
        desc: "Pas de vapeurs irritantes pour les yeux ni pour les voies respiratoires.",
      },
      {
        title: "Sûr en salon",
        desc: "Utilisable toute la journée par les professionnelles, sans compromis sur le résultat.",
      },
    ],
  },
  ingredients: {
    eyebrow: "La formule",
    title: "L'or 24 carats, et ce qui l'accompagne",
    subtitle: "Six actifs choisis pour lisser sans appauvrir la fibre capillaire.",
    items: [
      {
        name: "Or 24 carats",
        desc: "Apporte éclat et brillance miroir, et aide à sceller la cuticule.",
      },
      {
        name: "Kératine",
        desc: "La protéine dont le cheveu est fait — elle comble les brèches et lisse la fibre.",
      },
      {
        name: "Collagène",
        desc: "Redonne souplesse et élasticité aux longueurs fatiguées.",
      },
      {
        name: "Huile de coco",
        desc: "Nourrit en profondeur et protège la fibre pendant le passage du fer.",
      },
      {
        name: "Acides aminés",
        desc: "Reconstruisent les liaisons abîmées par les colorations et la chaleur.",
      },
      {
        name: "Panthénol",
        desc: "Pro-vitamine B5 : retient l'hydratation au cœur du cheveu.",
      },
    ],
  },
  benefits: {
    title: "Pourquoi il fait la différence",
    subtitle: "Une formule professionnelle pensée pour des résultats visibles et durables",
    items: [
      {
        title: "Lissage durable",
        desc: "Un résultat net qui tient plusieurs semaines, lavage après lavage.",
      },
      {
        title: "Brillance miroir",
        desc: "L'or 24 carats scelle la cuticule : la lumière accroche, les cheveux reflètent.",
      },
      {
        title: "Nourrit au lieu d'assécher",
        desc: "Kératine, collagène et huile de coco reconstruisent pendant que le lissage agit.",
      },
      {
        title: "Format Salon 1 L",
        desc: "Le vrai format professionnel : des dizaines d'applications, des mois d'utilisation.",
      },
    ],
  },
  brandStory: {
    eyebrow: "Vitasilk Professional",
    title: "L'exigence du salon, chez vous",
    subtitle:
      "La texture, le parfum et le fini d'un lissage haut de gamme — désormais entre vos mains.",
  },
  beforeAfter: {
    title: "Avant / Après",
    subtitle: "Faites glisser pour voir la transformation",
    before: "Avant",
    after: "Après",
  },
  howto: {
    title: "3 gestes, résultat salon",
    steps: [
      {
        title: "Lavez",
        desc: "Lavez avec un shampooing clarifiant, puis séchez vos cheveux à 80%.",
      },
      {
        title: "Appliquez",
        desc: "Appliquez le 24K Gold mèche par mèche, laissez poser 30 à 45 minutes.",
      },
      {
        title: "Séchez & lissez",
        desc: "Séchez complètement puis passez le fer pour sceller le soin. Admirez la brillance.",
      },
    ],
  },
  testimonials: {
    title: "Elles l'ont adopté",
    subtitle: "+12 000 clientes satisfaites au Maroc",
    items: [
      {
        name: "Salma — Casablanca",
        text: "J'ai fait des lissages pendant des années et mes cheveux le payaient. Avec le 24K Gold, c'est lisse ET nourri. La différence est énorme.",
      },
      {
        name: "Imane — Rabat",
        text: "Aucune odeur qui pique, aucune vapeur. J'ai pu le faire à la maison sans ouvrir toutes les fenêtres.",
      },
      {
        name: "Khadija — Marrakech",
        text: "Je suis coiffeuse et je l'utilise au salon toute la journée. Sans acide glyoxylique, ça change la vie — et le résultat tient.",
      },
      {
        name: "Sara — Tanger",
        text: "Deux mois après, mes cheveux sont encore lisses et brillants. Le litre en vaut vraiment le prix.",
      },
    ],
  },
  offer: {
    title: "Offre spéciale",
    subtitle: "Stock limité — profitez du prix spécial",
    unit: "24K Gold — Lissage Professionnel 1 L",
    save: (pct: number) => `Économisez ${pct}%`,
    freeDelivery: "Livraison gratuite",
    cod: "Paiement à la livraison",
    guarantee: "Satisfaite ou remboursée",
    countdown: { title: "L'offre expire dans", h: "Heures", m: "Minutes", s: "Secondes" },
    cta: "Commander maintenant",
  },
  form: {
    title: "Commandez maintenant",
    subtitle:
      "Remplissez le formulaire — nous vous appelons pour confirmer. Paiement à la livraison.",
    name: "Nom complet",
    namePh: "Votre nom et prénom",
    phone: "Téléphone",
    phonePh: "06 XX XX XX XX",
    city: "Ville",
    cityPh: "Votre ville",
    qty: "Quantité",
    total: "Total",
    submit: "Confirmer ma commande",
    sending: "Envoi en cours…",
    successTitle: "Commande reçue !",
    successText:
      "Merci ! Notre équipe vous appellera très vite pour confirmer la livraison.",
    errorTitle: "L'envoi a échoué",
    errorText:
      "Vérifiez votre connexion et réessayez, ou commandez directement sur WhatsApp — votre commande est conservée.",
    retry: "Réessayer",
    whatsapp: "Commander sur WhatsApp",
    errors: {
      name: "Veuillez entrer votre nom",
      phone: "Numéro de téléphone invalide",
      city: "Veuillez entrer votre ville",
    },
  },
  faq: {
    title: "Questions fréquentes",
    items: [
      {
        q: "Contient-il de l'acide glyoxylique ou du formol ?",
        a: "Non, ni l'un ni l'autre. C'est précisément ce qui distingue le 24K Gold : le lissage est obtenu sans ces substances, sans vapeurs irritantes et sans compromis sur le résultat.",
      },
      {
        q: "Convient-il à tous les types de cheveux ?",
        a: "Oui — cheveux colorés, méchés, déjà lissés, bouclés ou naturels. Sur cheveux très épais ou très frisés, comptez un temps de pose proche de 45 minutes.",
      },
      {
        q: "Combien de temps dure le lissage ?",
        a: "En moyenne 2 à 3 mois, selon la fréquence des lavages et le type de shampooing utilisé. Un shampooing sans sulfates prolonge nettement le résultat.",
      },
      {
        q: "Combien d'applications avec le format 1 L ?",
        a: "Selon la longueur et l'épaisseur des cheveux, comptez 10 à 20 applications — plusieurs mois d'utilisation, ou une saison complète en salon.",
      },
      {
        q: "Comment se passe la livraison ?",
        a: "Livraison gratuite partout au Maroc en 24 à 48h. Vous payez uniquement à la réception de votre commande.",
      },
    ],
  },
  footer: {
    tagline: "Le lissage professionnel à l'or 24 carats, chez vous.",
    rights: "© 2026 Vitasilk Professional. Tous droits réservés.",
  },
  sticky: { cta: "Commander" },
};

export type Dict = typeof fr;
