/**
 * Gera o payload do Pix estático (BRCode) corrigido
 */
export function generatePixPayload({ key, name, city, amount, txid = '***' }) {
  // 1. Limpar e preparar os dados
  const cleanKey = key.replace(/\D/g, '');
  // Se for celular (11 dígitos), garante que tem o 55 no começo
  const formattedKey = cleanKey.length === 11 ? `+55${cleanKey}` : cleanKey;
  
  // Remover acentos e caracteres especiais
  const cleanName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
  const cleanCity = city.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();

  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const merchantAccountInfo = 
    formatField('00', 'br.gov.bcb.pix') +
    formatField('01', formattedKey);

  const payload = [
    formatField('00', '01'), // Payload Format Indicator
    formatField('01', '11'), // Point of Initiation Method
    formatField('26', merchantAccountInfo),
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'),  // Currency (BRL)
    formatField('54', amount.toFixed(2)), // Amount
    formatField('58', 'BR'),   // Country
    formatField('59', cleanName.substring(0, 25)), // Name (max 25)
    formatField('60', cleanCity.substring(0, 15)), // City (max 15)
    formatField('62', formatField('05', txid)), // TXID
    '6304' // CRC16 indicator
  ].join('');

  return payload + crc16(payload);
}

function crc16(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
