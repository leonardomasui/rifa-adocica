import { useState, useEffect } from 'react'
import { Heart, Gift, Wine, Camera, Crown, Copy, Check, X, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { generatePixPayload } from './utils/pix'

// O mock será substituído pela API
const SHEET_ID = "1T6O8M4El1ciW2v0FZNQIXwF7kWzJshhfBze1UowWAgk";
// Para fins da documentação que o usuário pediu:
// fetch("URL_DO_APPS_SCRIPT") ... converter resposta -> vendidos.

function App() {
  const [vendidos, setVendidos] = useState([]);
  const [selecionados, setSelecionados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showPix, setShowPix] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const WHATSAPP_NUMBER = "5519989318419";
  const PIX_CONFIG = {
    key: "19989318419",
    name: "Gabriela Eduarda Gimenez da Silva",
    city: "Piracicaba" // Cidade padrão
  };

  useEffect(() => {
    // Para funcionar integração real, substitua pela URL do Apps Script Implantado (Web App):
    const URL_DO_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzB8mjZ7w-U3fhYyZvM3gUmzBR4WB2uS82FmSqWGFONTqiobQXeP0vNQmdUiMXxzmY0/exec"; 
    
    if (URL_DO_APPS_SCRIPT) {
      fetch(URL_DO_APPS_SCRIPT)
        .then(res => res.json())
        .then(data => {
          setVendidos(data.vendidos || []);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(true);
          setLoading(false);
        });
    } else {
      // Mock temporário caso a URL não esteja configurada
      setTimeout(() => {
        setVendidos([7, 12, 23, 45, 88]); // mock
        setLoading(false);
      }, 1500);
    }
  }, []);

  const toggleNumero = (num) => {
    if (vendidos.includes(num)) return;
    
    if (selecionados.includes(num)) {
      setSelecionados(selecionados.filter((n) => n !== num));
    } else {
      setSelecionados([...selecionados, num]);
    }
  };

  const valorUnitario = 5;
  const valorTotal = selecionados.length * valorUnitario;

  const handleWhatsApp = () => {
    const nums = selecionados.sort((a,b) => a - b).join(', ');
    const msg = `Olá ❤️\nJá realizei o PIX!\nEscolhi os números ${nums} para participar da RIFA ADOÇICA.\nSegue o comprovante em anexo.`;
    const wappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(wappUrl, '_blank');
  };

  const pixPayload = generatePixPayload({
    key: PIX_CONFIG.key,
    name: PIX_CONFIG.name,
    city: PIX_CONFIG.city,
    amount: valorTotal
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background animado (partículas) viria aqui, vamos usar gradiente fixo por enquanto */}
      
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 text-center relative z-10 glass-card mx-4 mt-4 rounded-3xl border-t border-white/20">
        <Heart className="w-16 h-16 text-rifa-pink mx-auto mb-4 animate-pulse drop-shadow-[0_0_15px_rgba(255,209,217,0.5)]" />
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-rifa-pink to-rifa-gold">
          RIFA ADOÇICA
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-2 tracking-widest text-white/90">
          DIA DOS NAMORADOS
        </h2>
        <p className="text-white/70 max-w-lg mx-auto mb-8 font-light">
          Escolha seus números e participe de uma experiência romântica inesquecível.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="glass px-6 py-3 rounded-full flex gap-4 items-center">
            <span className="text-rifa-gold font-bold text-xl">Sorteio: 10/06</span>
            <div className="w-px h-6 bg-white/20"></div>
            <span className="text-rifa-pink font-bold text-xl">R$ 5,00 / número</span>
          </div>
        </div>
      </header>

      {/* Grid de Números */}
      <main className="max-w-4xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
            <Gift className="text-rifa-gold" />
            Escolha Seus Números
          </h3>
          <p className="text-white/60">Selecione os números da sorte abaixo. Números cinzas já foram vendidos.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-rifa-pink border-t-rifa-red rounded-full animate-spin"></div>
            <p className="mt-4 text-rifa-pink font-medium animate-pulse">Buscando números apaixonados...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 bg-red-950/50 rounded-xl">
            <p>Erro ao carregar a rifa. Tente novamente mais tarde.</p>
          </div>
        ) : (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {Array.from({ length: 101 }, (_, i) => i).map((num) => {
              const estornado = vendidos.includes(num); // "Vendido"
              const isSelected = selecionados.includes(num);

              let bgClass = "bg-white/10 hover:bg-white/20 border-white/20 text-white"; // Disponível
              if (estornado) {
                bgClass = "bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed opacity-60"; // Vendido
              } else if (isSelected) {
                bgClass = "bg-rifa-red border-rifa-pink text-white shadow-[0_0_15px_rgba(193,18,31,0.6)] scale-110 z-10"; // Selecionado
              }

              return (
                <button
                  key={num}
                  onClick={() => toggleNumero(num)}
                  disabled={estornado}
                  className={`relative w-full aspect-square rounded-xl border flex items-center justify-center font-bold text-lg md:text-xl transition-all duration-300 ${bgClass}`}
                >
                  {num}
                  {estornado && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-zinc-500 rotate-45 transform"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* Checkout flutuante */}
      {selecionados.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-fade-in-up">
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t-rifa-pink/30">
            <div className="text-center sm:text-left">
              <p className="text-white/80">
                <span className="font-bold text-white">{selecionados.length}</span> números selecionados
              </p>
              <p className="text-2xl font-bold text-rifa-gold">
                Total: R$ {valorTotal.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <button 
              onClick={() => setShowPix(true)}
              className="w-full sm:w-auto bg-rifa-gold hover:bg-yellow-500 text-black px-8 py-3 rounded-xl font-bold shadow-[0_0_20px_rgba(212,163,115,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <QrCode size={20} />
              Gerar PIX
            </button>
          </div>
        </div>
      )}

      {/* Modal PIX */}
      {showPix && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowPix(false)}
          />
          
          <div className="relative w-full max-w-md glass-card rounded-3xl p-8 border border-white/20 animate-scale-in">
            <button 
              onClick={() => setShowPix(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              <X />
            </button>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-rifa-gold mb-2">Pagamento PIX</h3>
              <p className="text-white/70">Escaneie o QR Code ou copie o código abaixo</p>
            </div>

            <div className="bg-white p-4 rounded-2xl mb-8 flex items-center justify-center mx-auto w-48 h-48">
              <QRCodeSVG 
                value={pixPayload}
                size={160}
                level="M"
                includeMargin={false}
              />
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/50 mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-white">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
              </div>

              <div className="glass-card p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-bold">Código Pix Copia e Cola</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    readOnly 
                    value={pixPayload}
                    className="bg-transparent text-white/80 text-sm flex-1 outline-none overflow-hidden text-ellipsis"
                  />
                  <button 
                    onClick={copyToClipboard}
                    className="text-rifa-gold hover:text-rifa-pink transition-colors p-1"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                >
                  <Check size={20} />
                  Já fiz o PIX! Enviar Comprovante
                </button>
                <p className="text-[10px] text-center text-white/40 italic">
                  Você será direcionado para o WhatsApp da Gabriela para confirmar seu pagamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção Romântica (Decoração) */}
      <section className="py-20 relative px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 relative z-10 glass-card p-8 rounded-3xl">
             <Wine className="w-12 h-12 text-rifa-pink mb-4" />
             <h3 className="text-3xl font-bold text-rifa-pink">Uma noite especial</h3>
             <p className="text-lg text-white/80 leading-relaxed font-light">
               Para os amantes de bons momentos: O ganhador levará uma cesta exclusiva cuidadosamente preparada com vinho selecionado, brigadeiros gourmet, uvas frescas e morangos, criando o ambiente perfeito para uma noite romântica inesquecível.
             </p>
          </div>
          
          <div className="relative h-[400px] flex items-center justify-center">
            {/* Decorações via divs e icones */}
            <div className="absolute top-10 left-10 animate-bounce delay-100"><Heart className="w-8 h-8 text-rifa-red opacity-80" /></div>
            <div className="absolute bottom-20 right-10 animate-bounce delay-300"><Heart className="w-12 h-12 text-rifa-pink opacity-60" /></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rifa-red rounded-full blur-[100px] opacity-30"></div>
            
            <div className="glass w-48 h-64 rounded-xl rotate-[-10deg] absolute left-10 p-2 shadow-2xl border-white/20">
              <div className="w-full h-4/5 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden">
                <Crown className="w-16 h-16 text-rifa-gold opacity-50" />
              </div>
              <p className="text-center mt-3 font-handwriting text-rifa-pink text-sm">Amor verdadeiro</p>
            </div>
            
            <div className="glass w-56 h-72 rounded-xl rotate-[5deg] absolute right-4 z-10 p-2 shadow-2xl border-white/20">
              <div className="w-full h-4/5 bg-zinc-800 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-rifa-red/20 to-black">
                 <Camera className="w-16 h-16 text-white/50" />
              </div>
              <p className="text-center mt-3 font-handwriting text-rifa-gold text-base">Nosso Momento</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/80 py-10 px-4 text-center border-t border-white/10 relative z-10 pb-32">
        <div className="max-w-2xl mx-auto opacity-70 text-sm space-y-4">
          <p>O sorteio será realizado no dia 10/06.</p>
          <p>Os números selecionados só serão garantidos após o envio do comprovante de pagamento via WhatsApp.</p>
          <p className="text-rifa-pink text-lg mt-8 font-light italic">"Boa sorte e feliz Dia dos Namorados ❤️"</p>
        </div>
      </footer>
      
    </div>
  )
}

export default App
