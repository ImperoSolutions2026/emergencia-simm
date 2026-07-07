/**
 * ============================================================================
 *  NEWSLETTER SIMM  ·  Google Sheets  (recebimento + planilha branded)
 * ============================================================================
 *  1) setupPlanilha()  → formata a planilha com a identidade da SIMM
 *                        (faixa escura + logo, cabeçalho teal, zebra, filtro).
 *                        Rode UMA vez pelo menu ▶ Executar.
 *  2) doPost(e)        → recebe cada inscrição do site e grava uma linha.
 *
 *  PASSO A PASSO
 *  1. Planilha → Extensões → Apps Script. Apague tudo e cole ESTE arquivo.
 *  2. Selecione "setupPlanilha" e clique ▶ Executar (autorize) → fica bonita.
 *  3. Implantar → Nova implantação → "App da Web":
 *        Executar como: Eu   |   Quem tem acesso: Qualquer pessoa
 *     Copie a URL /exec (se já publicou antes, use "Gerenciar implantações"
 *     → Editar → Nova versão; a URL /exec continua a mesma).
 *  4. No projeto: NEWSLETTER_SHEETS_URL = <URL /exec> (.env.local e Vercel).
 * ============================================================================
 */

var SHEET_NAME = "Inscrições";

var HEADERS = [
  "Data/Hora", "Nome", "Email", "Telefone",
  "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
  "Referrer", "Página",
];

// Paleta da marca (mesma do site)
var BRAND = {
  dark: "#0A0E14", darkSec: "#0D1C24", teal: "#20CAD8", tealSoft: "#EAFBFD",
  white: "#FFFFFF", muted: "#8AA0A6", body: "#1A2730", grid: "#D7EEF1",
};

var LAST_ROW = 2000; // linhas pré-formatadas (zebra pronta)

// Logo SIMM (PNG público do site). Troque se mudar de domínio.
var LOGO_URL = "https://www.emergenciasimm.com.br/assets/f76c6f27494be7a9e5a3f016f1754b03de404378.png";

/** Formata a planilha inteira com a identidade da SIMM. Rode uma vez. */
function setupPlanilha() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }
  ss.setActiveSheet(sheet);
  ss.moveActiveSheet(1);

  var NCOLS = HEADERS.length;

  // Limpeza total.
  sheet.clear();
  sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns()).breakApart();
  sheet.getImages().forEach(function (im) { im.remove(); });
  var oldFilter = sheet.getFilter();
  if (oldFilter) oldFilter.remove();
  sheet.getBandings().forEach(function (b) { b.remove(); });

  // Nº de colunas.
  var maxC = sheet.getMaxColumns();
  if (maxC < NCOLS) sheet.insertColumnsAfter(maxC, NCOLS - maxC);
  if (maxC > NCOLS) sheet.deleteColumns(NCOLS + 1, maxC - NCOLS);

  // Larguras.
  var widths = [160, 190, 250, 150, 120, 120, 150, 110, 130, 220, 240];
  for (var i = 0; i < widths.length; i++) sheet.setColumnWidth(i + 1, widths[i]);

  // Linha 1: faixa + logo (menor e centralizado, sem invadir o subtítulo).
  sheet.setRowHeight(1, 76);
  sheet.getRange(1, 1, 1, NCOLS).merge().setBackground(BRAND.dark);
  try {
    var img = sheet.insertImage(LOGO_URL, 1, 1, 18, 14); // url, col, row, offsetX, offsetY
    img.setWidth(170);
    img.setHeight(49); // proporção ~3.45:1
  } catch (e) {
    sheet.getRange(1, 1).setValue("  ◎  SIMM · MEDICINA DE EMERGÊNCIA")
      .setFontColor(BRAND.teal).setFontSize(16).setFontWeight("bold")
      .setVerticalAlignment("middle");
  }

  // Linha 2: subtítulo.
  sheet.setRowHeight(2, 28);
  sheet.getRange(2, 1, 1, NCOLS).merge()
    .setValue("   Newsletter · Medicina de Emergência   —   inscrições recebidas automaticamente pelo site")
    .setBackground(BRAND.darkSec)
    .setFontColor(BRAND.muted).setFontSize(10).setFontStyle("italic")
    .setVerticalAlignment("middle").setHorizontalAlignment("left");

  // Linha 3: cabeçalho.
  sheet.setRowHeight(3, 36);
  sheet.getRange(3, 1, 1, NCOLS).setValues([HEADERS])
    .setBackground(BRAND.teal).setFontColor(BRAND.dark).setFontWeight("bold")
    .setFontSize(10).setHorizontalAlignment("center").setVerticalAlignment("middle")
    .setWrap(true);
  sheet.setFrozenRows(3);

  // Dados: zebra + bordas.
  var data = sheet.getRange(4, 1, LAST_ROW - 3, NCOLS);
  var banding = data.applyRowBanding();
  banding.setHeaderRowColor(null).setFooterRowColor(null);
  banding.setFirstRowColor(BRAND.white).setSecondRowColor(BRAND.tealSoft);
  data.setFontColor(BRAND.body).setFontSize(10).setVerticalAlignment("middle");
  data.setBorder(true, true, true, true, true, true, BRAND.grid, SpreadsheetApp.BorderStyle.SOLID);
  sheet.getRange(4, 1, LAST_ROW - 3, 1).setNumberFormat("dd/MM/yyyy  HH:mm");

  // Filtro + visual limpo.
  sheet.getRange(3, 1, LAST_ROW - 2, NCOLS).createFilter();
  sheet.setHiddenGridlines(true);

  SpreadsheetApp.flush();
  ss.toast("Planilha SIMM formatada.", "✅ Pronto", 5);
}

/** Recebe a inscrição do site e grava uma linha. */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);
  try {
    var data = (e && e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 3) {
      setupPlanilha();
      sheet = ss.getSheetByName(SHEET_NAME);
    }
    sheet.appendRow([
      new Date(),
      data.nome || "", data.email || "", data.telefone || "",
      data.utm_source || "", data.utm_medium || "", data.utm_campaign || "",
      data.utm_term || "", data.utm_content || "",
      data.referrer || "", data.landing_page || "",
    ]);
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/** Teste no navegador → deve responder "Newsletter SIMM online". */
function doGet() {
  return ContentService.createTextOutput("Newsletter SIMM online");
}
