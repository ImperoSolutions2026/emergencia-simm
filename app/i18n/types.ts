export type Locale = "pt" | "en" | "es";

export interface Dictionary {
  header: {
    nav: { courses: string; academy: string; teachers: string; tools: string; blog: string };
    studentArea: string;
  };
  hero: {
    preHeadline: string;
    headline: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    credibility: string;
    stats: { trained: string; courses: string; states: string; years: string };
  };
  problem: {
    label: string;
    title: string;
    paragraphs: string[];
    quote: string;
    quoteHighlight: string;
    turnTitle: string;
    turnParagraphs: string[];
    turnHighlight: string;
  };
  difference: {
    label: string;
    title: string;
    blocks: { title: string; text: string }[];
  };
  products: {
    label: string;
    title: string;
    subtitle: string;
    esc: {
      tag: string;
      title: string;
      text: string;
      meta: string;
      cta: string;
    };
    academy: {
      tag: string;
      title: string;
      text: string;
      meta: string;
      cta: string;
    };
  };
  ecosystem: {
    label: string;
    title: string;
    subtitle: string;
    pillars: { title: string; text: string; tag: string }[];
  };
  authorityQuotes: {
    quotes: string[];
  };
  globalSeal: {
    label: string;
    title: string;
    text: string;
  };
  blog: {
    label: string;
    title: string;
    subtitle: string;
    categories: string[];
    featuredLabel: string;
    posts: { title: string; excerpt: string; author: string; date: string; category: string; source: string; featured?: boolean }[];
    cta: string;
    ctaSub: string;
    empty: string;
  };
  challenge: {
    label: string;
    title: string;
    subtitle: string;
    subNote: string;
    tag: string;
    caseTitle: string;
    caseText: string;
    ctaStart: string;
    questionTitle: string;
    answers: string[];
    successTitle: string;
    successText: string;
    successCta: string;
    successRetry: string;
    failTitle: string;
    failText: string;
    failCta: string;
    failRetry: string;
  };
  forWho: {
    label: string;
    title: string;
    forYouTitle: string;
    forYou: string[];
    notForYouTitle: string;
    notForYou: string[];
    statLabel: string;
    statValue: string;
    statText: string;
  };
  teachers: {
    label: string;
    title: string;
    subtitle: string;
    list: { name: string; title: string; bio: string[]; areas: string[] }[];
    footnote: string;
    cta: string;
  };
  testimonials: {
    label: string;
    title: string;
    list: { text: string; name: string; role: string; location: string; tag: string }[];
    footer: string;
  };
  map: {
    label: string;
    title: string;
    text: string;
    pinNote: string;
    stats: { value: string; label: string }[];
  };
  newsletter: {
    badge: string;
    title: string;
    subtitle: string;
    items: string[];
    namePlaceholder: string;
    placeholder: string;
    phonePlaceholder: string;
    cta: string;
    sending: string;
    social: string;
    successTitle: string;
    successText: string;
    errorText: string;
  };
  scores: {
    label: string;
    title: string;
    subtitle: string;
    terminal: string;
    ageLabel: string;
    agePlaceholder: string;
    historyLabel: string;
    historyOptions: { value: string; label: string }[];
    ecgLabel: string;
    ecgOptions: { value: string; label: string }[];
    calculate: string;
    resultLabel: string;
    riskHigh: string;
    riskMed: string;
    riskLow: string;
  };
  fluxogramas: {
    label: string;
    title: string;
    subtitle: string;
    list: { title: string; subtitle: string }[];
    downloadBtn: string;
    modalTitle: string;
    modalText: string;
    modalPlaceholder: string;
    modalCta: string;
    modalNote: string;
  };
  finalCta: {
    label: string;
    title: string;
    paragraphs: string[];
    ctaPrimary: string;
    ctaSecondary: string;
    tagline1: string;
    tagline2: string;
  };
  footer: {
    description: string;
    since: string;
    courses: { title: string; links: string[] };
    resources: { title: string; links: string[] };
    institutional: { title: string; links: string[] };
    tagline: string;
    copyright: string;
    terms: string;
    privacy: string;
  };
}
