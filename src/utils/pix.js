/**
 * Gera o payload do Pix estático (BRCode)
 * Baseado no padrão do Banco Central
 */
export function generatePixPayload({ key, name, city, amount, txid = '***' }) {
  const formatField = (id, value) => {
    const len = value.length.toString().padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const merchantAccountInfo = 
    formatField('00', 'br.gov.bcb.pix') +
    formatField('01', key);

  const payload = [
    formatField('00', '01'), // Payload Format Indicator
    formatField('01', '11'), // Point of Initiation Method (11 = Estático, 12 = Dinâmico)
    formatField('26', merchantAccountInfo),
    formatField('52', '0000'), // Merchant Category Code
    formatField('53', '986'),  // Currency (BRL)
    formatField('54', amount.toFixed(2)), // Amount
    formatField('58', 'BR'),   // Country
    formatField('59', name.substring(0, 25)), // Name (max 25)
    formatField('60', city.substring(0, 15)), // City (max 15)
    formatField('62', formatField('05', txid)), // Additional Data (TXID)
    '6304' // CRC16 indicator
  ].join('');

  return payload + crc16(payload);
}

function crc16(str) {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < str.length; i++) {
    let b = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      let bit = ((b >> (7 - j)) & 1) === 1;
      let c15 = ((crc >> 15) & 1) === 1;
      crc <<= 1;
      if (c15 ^ bit) crc ^= polynomial;
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}
