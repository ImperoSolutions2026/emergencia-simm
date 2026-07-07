# Newsletter → Google Sheets — Setup

A dobra "Assine nossa Newsletter" (componente `app/components/Newsletter.tsx`)
captura **Nome, Email, Telefone** + **atribuição de tráfego (UTMs)** e grava tudo
numa planilha do Google Sheets.

Fluxo: `formulário → /api/newsletter (servidor) → Web App do Apps Script → planilha`.
O envio é server-side de propósito: evita CORS e mantém a URL da planilha privada.

## Passo a passo (uma vez)

1. **Crie a planilha** no Google Sheets (ex.: "Newsletter SIMM — Leads").
2. **Extensões → Apps Script**. Apague o código de exemplo e cole o conteúdo de
   [`google-apps-script.gs`](./google-apps-script.gs).
3. **Implantar → Nova implantação → App da Web**:
   - *Executar como:* **Eu**
   - *Quem tem acesso:* **Qualquer pessoa**
   - Autorize as permissões quando pedir.
4. Copie a **URL que termina em `/exec`**.
5. Defina a variável de ambiente do projeto:
   - **Local:** crie `.env.local` na pasta `meu-site` com:
     ```
     NEWSLETTER_SHEETS_URL=https://script.google.com/macros/s/XXXXX/exec
     ```
   - **Produção (Vercel):** Settings → Environment Variables → adicione
     `NEWSLETTER_SHEETS_URL` com a mesma URL → **Redeploy**.

Pronto. Cada inscrição vira uma linha na aba **"Inscrições"**, com colunas:
`Data/Hora · Nome · Email · Telefone · utm_source · utm_medium · utm_campaign · utm_term · utm_content · Referrer · Página`.

## UTMs e tráfego orgânico

- Se o link tiver UTM (ex.: link da bio no Instagram
  `...?utm_source=instagram&utm_medium=organic&utm_campaign=bio`), os valores
  são gravados como vieram.
- Se **não** houver UTM, a origem é **inferida pelo referrer**:
  - veio de busca (Google/Bing/etc.) → `utm_medium = organic`
  - veio de rede social → `utm_medium = social`
  - veio de outro site → `utm_medium = referral`
  - acesso direto → `utm_medium = none`
- A primeira origem da visita é preservada (first-touch, via `sessionStorage`).

## Sem a env var configurada

Se `NEWSLETTER_SHEETS_URL` não estiver definida, o formulário **funciona**, mas o
lead só é registrado nos **logs de runtime da Vercel** (não vai pra planilha).
Configure a variável para a entrega real.
