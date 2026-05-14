// Código para o Google Apps Script (Extensões -> Apps Script)
// 1. Cole este código no editor
// 2. Salve (Ctrl+S)
// 3. Clique em "Implantar" -> "Nova implantação"
// 4. Escolha o tipo "App da Web" (Web App)
// 5. Permissão de acesso: "Qualquer pessoa" (Anyone)
// 6. Autorize os popups e as permissões de conta
// 7. Copie a URL gerada e substitua no App.jsx no lugar de URL_DO_APPS_SCRIPT

function doGet() {
  const sheet = SpreadsheetApp.openById("1T6O8M4El1ciW2v0FZNQIXwF7kWzJshhfBze1UowWAgk")
    .getSheets()[0];

  const data = sheet.getDataRange().getValues();

  const vendidos = data
    .slice(1)
    .map(row => Number(row[0]))
    .filter(num => !isNaN(num));

  // Adicionar CORS headers na mão
  return ContentService
    .createTextOutput(JSON.stringify({ vendidos }))
    .setMimeType(ContentService.MimeType.JSON);
}
