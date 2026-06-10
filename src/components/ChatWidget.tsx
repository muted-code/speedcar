import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import type { Vehiculo } from '../types';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  vehiculos?: Vehiculo[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy tu asistente de Speed Car. ¿En qué te puedo ayudar hoy? ¿Buscas un carro en especial?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      
      // Filtramos el mensaje de bienvenida inicial porque algunos modelos (Llama 3)
      // fallan si el primer mensaje en el historial es de 'assistant' en lugar de 'user'.
      const payloadMessages = [...messages, userMsg].filter(m => {
        if (m.role === 'system') return false;
        if (m.role === 'assistant' && m.content.includes('Soy tu asistente de Speed Car')) return false;
        return true;
      });

      const res = await fetch(`${BACKEND_URL}/api/ia/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.respuesta, vehiculos: data.vehiculos }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Tuve un pequeño problema para conectarme, por favor intenta de nuevo.' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'No pude comunicarme con los servidores. Revisa tu conexión.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-primary text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Abrir chat de asistencia"
      >
        <MessageCircle size={28} />
      </button>

      {/* Ventana de Chat */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] max-w-[calc(100vw-32px)] sm:w-[400px] h-[500px] max-h-[calc(100vh-100px)] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="bg-surface-alt border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 text-primary p-2 rounded-full">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-text-main text-sm">Asistente Speed Car</h3>
              <p className="text-xs text-text-muted flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                En línea
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-text-muted hover:text-text-main hover:bg-border/50 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mensajes */}
        <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-surface/50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex flex-col gap-2">
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm self-end' : 'bg-surface-alt border border-border text-text-main rounded-tl-sm self-start'}`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm dark:prose-invert prose-p:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-ul:my-1 prose-li:my-0">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                
                {msg.vehiculos && msg.vehiculos.length > 0 && (
                  <div className="flex flex-col gap-2 mt-1 w-[85%]">
                    {msg.vehiculos.map(v => (
                      <Link 
                        key={v.id} 
                        to={`/vehiculo/${v.id}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 bg-surface border border-border p-2 rounded-xl hover:border-primary/50 transition-colors group shadow-sm"
                      >
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-alt">
                          {v.urls_imagenes && v.urls_imagenes.length > 0 ? (
                            <img src={v.urls_imagenes[0]} alt={v.modelo} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-text-muted text-xs">Sin foto</div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center overflow-hidden">
                          <p className="text-sm font-bold text-text-main truncate leading-tight group-hover:text-primary transition-colors">{v.marca} {v.modelo}</p>
                          <p className="text-[11px] text-text-muted truncate mt-0.5">{v.año} • {v.kilometraje?.toLocaleString() || 0} km</p>
                          <p className="text-xs font-bold text-primary mt-1">${(v.precio || 0).toLocaleString()} COP</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-surface-alt border border-border rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5 items-center">
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-surface border-t border-border flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta por un carro..."
            className="flex-grow bg-surface-alt border border-border text-sm rounded-xl px-4 py-2.5 text-text-main focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-primary text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-hover transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
