import { useState, useEffect } from 'react'
import { Heart, Gift, Wine, Camera, Crown, Copy, Check, X, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { generatePixPayload } from './utils/pix'

// O mock será substituído pela API
const SHEET_ID = "1T6O8M4El1ciW2v0FZNQIXwF7kWzJshhfBze1UowWAgk";

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
    city: "Piracicaba"
  };

  useEffect(() => {
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
      setTimeout(() => {
        setVendidos([7, 12, 23, 45, 88]);
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
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0a] text-white font-sans selection:bg-rifa-pink/30">
      {/* Background Decorativo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-rifa-red/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rifa-pink/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
      </div>
      
      {/* Hero Section */}
      <header className="pt-20 pb-16 px-4 text-center relative z-10 glass-card mx-4 mt-4 rounded-[40px] border-t border-white/10 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-rifa-red/5 to-transparent rounded-[40px]"></div>
        <Heart className="w-16 h-16 text-rifa-pink mx-auto mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(255,209,217,0.5)]" />
        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-rifa-pink via-white to-rifa-gold">
          RIFA ADOÇICA
        </h1>
        <h2 className="text-xl md:text-2xl font-light mb-8 tracking-[0.3em] text-rifa-gold/80 uppercase">
          Edição Dia dos Namorados
        </h2>
        
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="glass-card px-8 py-4 rounded-full flex gap-6 items-center border border-white/10 shadow-inner">
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Data do Sorteio</span>
              <span className="text-rifa-gold font-bold text-xl">10 de Junho</span>
            </div>
            <div className="w-px h-10 bg-white/10"></div>
            <div className="flex flex-col items-start">
              <span className="text-[10px] uppercase tracking-widest text-white/40">Valor por Número</span>
              <span className="text-rifa-pink font-bold text-xl">R$ 5,00</span>
            </div>
          </div>
        </div>
      </header>

      {/* Grid de Números */}
      <main className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rifa-gold/10 border border-rifa-gold/20 mb-4">
            <Gift size={16} className="text-rifa-gold" />
            <span className="text-xs font-bold text-rifa-gold uppercase tracking-wider">Garanta sua sorte</span>
          </div>
          <h3 className="text-3xl md:text-4xl font-bold mb-4">Escolha Seus Números</h3>
          <p className="text-white/50 max-w-md mx-auto">Toque nos números desejados para selecionar. Números escuros com traço já foram vendidos.</p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 border-4 border-rifa-pink/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-rifa-pink border-t-transparent rounded-full animate-spin"></div>
              <Heart className="absolute inset-0 m-auto text-rifa-pink animate-pulse" size={24} />
            </div>
            <p className="mt-8 text-rifa-pink font-medium animate-pulse tracking-widest uppercase text-xs">Sincronizando com a sorte...</p>
          </div>
        ) : error ? (
          <div className="text-center text-rifa-red py-16 bg-rifa-red/5 border border-rifa-red/20 rounded-3xl backdrop-blur-xl">
            <p className="font-bold text-xl mb-2">Ops! Algo deu errado.</p>
            <p className="opacity-70">Não conseguimos carregar os números. Tente atualizar a página.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 md:gap-4">
            {Array.from({ length: 101 }, (_, i) => i).map((num) => {
              const isVendido = vendidos.includes(num);
              const isSelected = selecionados.includes(num);

              let bgClass = "bg-white/5 hover:bg-white/10 border-white/10 text-white/90 hover:scale-105 active:scale-95";
              if (isVendido) {
                bgClass = "bg-black/40 border-white/5 text-white/20 cursor-not-allowed opacity-40";
              } else if (isSelected) {
                bgClass = "bg-gradient-to-br from-rifa-red to-rifa-pink border-rifa-pink text-white shadow-[0_0_25px_rgba(193,18,31,0.5)] scale-110 z-10 rotate-3";
              }

              return (
                <button
                  key={num}
                  onClick={() => toggleNumero(num)}
                  disabled={isVendido}
                  className={`relative w-full aspect-square rounded-2xl border flex items-center justify-center font-black text-xl md:text-2xl transition-all duration-300 ${bgClass}`}
                >
                  {num}
                  {isVendido && (
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
                      <div className="w-[150%] h-px bg-white/20 rotate-45 transform"></div>
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
        <div className="fixed bottom-0 left-0 right-0 p-6 z-50 animate-fade-in-up">
          <div className="max-w-2xl mx-auto glass-card rounded-[32px] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/20 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
                <div className="w-2 h-2 rounded-full bg-rifa-pink animate-ping"></div>
                <p className="text-white/60 text-sm font-medium">
                  <span className="font-bold text-white text-lg">{selecionados.length}</span> números escolhidos
                </p>
              </div>
              <p className="text-4xl font-black text-white tracking-tight">
                R$ {valorTotal.toFixed(2).replace('.', ',')}
              </p>
            </div>
            
            <button 
              onClick={() => setShowPix(true)}
              className="w-full sm:w-auto bg-white text-black hover:bg-rifa-gold transition-colors px-10 py-5 rounded-2xl font-black text-lg shadow-xl flex items-center justify-center gap-3 group"
            >
              <QrCode size={24} className="group-hover:scale-110 transition-transform" />
              GERAR PAGAMENTO
            </button>
          </div>
        </div>
      )}

      {/* Modal PIX */}
      {showPix && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            onClick={() => setShowPix(false)}
          />
          
          <div className="relative w-full max-w-md glass-card rounded-[40px] p-8 md:p-10 border border-white/20 animate-scale-in shadow-[0_0_100px_rgba(0,0,0,0.8)]">
            <button 
              onClick={() => setShowPix(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-rifa-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-rifa-gold/20">
                <QrCode className="text-rifa-gold" size={32} />
              </div>
              <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Pagamento PIX</h3>
              <p className="text-white/50 text-sm">Escaneie o código abaixo com o app do seu banco</p>
            </div>

            <div className="bg-white p-6 rounded-[32px] mb-10 flex items-center justify-center mx-auto w-56 h-56 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
              <QRCodeSVG 
                value={pixPayload}
                size={180}
                level="M"
              />
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-end px-2">
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Total a Pagar</p>
                  <p className="text-3xl font-black text-white">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Titular</p>
                  <p className="text-sm font-bold text-rifa-gold">Gabriela Eduarda...</p>
                </div>
              </div>

              <div className="bg-white/5 p-5 rounded-2xl border border-white/10 flex flex-col gap-3">
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Código Copia e Cola</p>
                <div className="flex gap-4 items-center">
                  <div className="flex-1 overflow-hidden">
                    <p className="text-white/60 text-xs truncate font-mono">{pixPayload}</p>
                  </div>
                  <button 
                    onClick={copyToClipboard}
                    className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-rifa-gold hover:bg-rifa-gold hover:text-black transition-all"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(22,163,74,0.3)] transition-all active:scale-95"
                >
                  <Check size={24} />
                  JÁ FIZ O PAGAMENTO
                </button>
                <p className="text-[10px] text-center text-white/30 mt-4 italic leading-relaxed">
                  Após clicar, você enviará o comprovante para a Gabriela via WhatsApp para validar seus números.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Seção Romântica (Decoração) */}
      <section className="py-24 relative px-4 overflow-hidden border-t border-white/5 bg-gradient-to-b from-transparent to-black/50">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Bloco de Texto */}
          <div className="relative z-10 glass-card p-10 md:p-14 rounded-[48px] border border-white/10 text-center flex flex-col items-center justify-center min-h-[500px]">
             <div className="w-16 h-16 bg-rifa-pink/10 rounded-2xl flex items-center justify-center mb-8 border border-rifa-pink/20">
               <Wine className="w-8 h-8 text-rifa-pink" />
             </div>
             <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-6">
               Uma noite <span className="text-rifa-pink">especial</span>
             </h3>
             <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light max-w-2xl">
               Para os amantes de bons momentos: O ganhador levará uma cesta exclusiva cuidadosamente preparada com vinho selecionado, brigadeiros gourmet, uvas frescas e morangos, criando o ambiente perfeito para uma noite romântica inesquecível.
             </p>
             <div className="flex items-center gap-4 pt-8 text-rifa-gold">
                <Crown size={20} />
                <span className="font-bold uppercase tracking-widest text-xs">Prêmio Exclusivo Adoçica</span>
             </div>
          </div>
          
          {/* Bloco da Imagem */}
          <div className="relative group w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-rifa-red to-rifa-pink rounded-[40px] blur-2xl opacity-10 group-hover:opacity-30 transition-opacity duration-700"></div>
            <div className="relative glass-card p-3 rounded-[40px] border border-white/20 overflow-hidden shadow-2xl h-[500px]">
              <img 
                src="/cesta.jpg" 
                alt="Cesta Romântica Rifa Adoçica" 
                className="w-full h-full rounded-[32px] object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <p className="text-center mt-6 text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase italic">
              * Imagem meramente ilustrativa
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black py-16 px-4 text-center border-t border-white/5 relative z-10 pb-40">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="flex items-center justify-center gap-3 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default">
            <Heart size={16} fill="currentColor" />
            <div className="w-24 h-px bg-white/50"></div>
            <Heart size={16} fill="currentColor" />
          </div>
          <div className="space-y-4 opacity-40 text-sm font-medium tracking-wide">
            <p className="hover:text-white transition-colors">O sorteio será realizado no dia 10/06 via Live no Instagram.</p>
            <p className="hover:text-white transition-colors">Os números selecionados só serão garantidos após validação do comprovante.</p>
          </div>
          <p className="text-rifa-pink text-2xl mt-12 font-serif italic tracking-tight drop-shadow-[0_0_10px_rgba(255,209,217,0.3)]">
            "Boa sorte e feliz Dia dos Namorados ❤️"
          </p>
        </div>
      </footer>
      
    </div>
  )
}

export default App
