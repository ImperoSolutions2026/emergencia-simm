import { NextResponse } from "next/server";

// =============================================================================
// Inscrição na Newsletter — Nome, Email, Telefone + atribuição (UTMs).
// O destino final é uma planilha Google Sheets, alimentada por um Web App do
// Google Apps Script (doPost). Basta definir a variável de ambiente:
//
//   NEWSLETTER_SHEETS_URL = https://script.google.com/macros/s/XXXX/exec
//
// O passo a passo de como criar o Apps Script está em NEWSLETTER-SETUP.md.
// Encaminhamos server-side (não do navegador) para: evitar CORS, manter a URL
// da planilha privada e registrar timestamp/validação no servidor.
// =============================================================================

type Inscricao = {
  nome: string;
  email: string;
  telefone: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  landing_page: string;
  criadoEm: string;
};

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

async function persistir(lead: Inscricao) {
  // Sempre registra nos logs de runtime (recuperável no painel da Vercel).
  console.log("[NEWSLETTER]", JSON.stringify(lead));

  const url = process.env.NEWSLETTER_SHEETS_URL;
  if (!url) {
    console.warn(
      "[NEWSLETTER] NEWSLETTER_SHEETS_URL não configurada — lead só foi para o log."
    );
    return;
  }

  // Encaminha para o Web App do Google Sheets (Apps Script).
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(lead),
    redirect: "follow", // Apps Script responde via redirect 302 → script.googleusercontent.com
  });
  if (!resp.ok) {
    throw new Error(`Sheets respondeu ${resp.status}`);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body.nome ?? "").trim();
    const email = String(body.email ?? "").trim();
    const telefone = String(body.telefone ?? "").trim();

    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { ok: false, error: "Preencha nome, e-mail e telefone." },
        { status: 400 }
      );
    }
    if (!emailOk(email)) {
      return NextResponse.json(
        { ok: false, error: "E-mail inválido." },
        { status: 400 }
      );
    }

    await persistir({
      nome,
      email,
      telefone,
      utm_source: String(body.utm_source ?? ""),
      utm_medium: String(body.utm_medium ?? ""),
      utm_campaign: String(body.utm_campaign ?? ""),
      utm_term: String(body.utm_term ?? ""),
      utm_content: String(body.utm_content ?? ""),
      referrer: String(body.referrer ?? ""),
      landing_page: String(body.landing_page ?? ""),
      criadoEm: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[NEWSLETTER] erro:", err);
    return NextResponse.json(
      { ok: false, error: "Erro ao registrar. Tente novamente." },
      { status: 500 }
    );
  }
}
