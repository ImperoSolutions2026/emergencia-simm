// Atribuição de tráfego (lado cliente). Captura UTMs da URL e, quando não há
// UTM tagueada, INFERE a origem a partir do referrer — assim o tráfego orgânico
// (busca do Google, Instagram, indicações, direto) é atribuído automaticamente.
// Estratégia first-touch por visita: a primeira origem é preservada em sessionStorage.

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  landing_page: string;
};

const STORAGE_KEY = "simm_attribution";

const EMPTY: Attribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_term: "",
  utm_content: "",
  referrer: "",
  landing_page: "",
};

function inferFromReferrer(ref: string): { source: string; medium: string } {
  if (!ref) return { source: "direct", medium: "none" };
  let host = "";
  try {
    host = new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return { source: "direct", medium: "none" };
  }
  // Navegação dentro do próprio site não conta como nova origem.
  if (typeof window !== "undefined" && host === window.location.hostname) {
    return { source: "direct", medium: "none" };
  }
  const search = /google|bing|duckduckgo|yahoo|ecosia|brave/;
  const social =
    /instagram|facebook|fb\.|linkedin|lnkd|t\.co|twitter|x\.com|youtube|tiktok|whatsapp|wa\.me|telegram/;
  const base = host.split(".")[0];
  if (search.test(host)) return { source: base, medium: "organic" };
  if (social.test(host)) return { source: base, medium: "social" };
  return { source: host, medium: "referral" };
}

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return EMPTY;

  // First-touch: mantém a origem da primeira página desta visita.
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Attribution;
  } catch {
    /* sessionStorage indisponível — segue capturando */
  }

  const params = new URLSearchParams(window.location.search);
  const get = (k: string) => (params.get(k) || "").slice(0, 200);
  const referrer = document.referrer || "";

  let utm_source = get("utm_source");
  let utm_medium = get("utm_medium");

  // Sem UTM na URL → inferimos (orgânico / social / referral / direto).
  if (!utm_source) {
    const inf = inferFromReferrer(referrer);
    utm_source = inf.source;
    if (!utm_medium) utm_medium = inf.medium;
  }

  const attribution: Attribution = {
    utm_source,
    utm_medium,
    utm_campaign: get("utm_campaign"),
    utm_term: get("utm_term"),
    utm_content: get("utm_content"),
    referrer,
    landing_page: window.location.pathname + window.location.search,
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    /* ignora quota/privado */
  }
  return attribution;
}
