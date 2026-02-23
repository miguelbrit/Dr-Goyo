import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, ArrowLeft, MoreVertical, Phone, Bot, User, Stethoscope, Pill, Microscope, HelpCircle } from 'lucide-react';
import { ChatMessage, Message } from '../components/ChatMessage';
import { Avatar } from '../components/Avatar';

type SpecialistDomain = 'DOCTOR' | 'PHARMACY' | 'LABORATORY' | 'GENERAL';

interface ChatScreenProps {
  initialMessage?: string;
  onBack: () => void;
  onViewDoctorList: (specialty?: string) => void;
  onViewPharmacyList: () => void;
  onViewLabList: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ 
  initialMessage, 
  onBack, 
  onViewDoctorList,
  onViewPharmacyList,
  onViewLabList
}) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<SpecialistDomain>('GENERAL');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting or handling initial message
  useEffect(() => {
    if (initialMessage) {
      handleUserMessage(initialMessage);
    } else {
      setMessages([
        {
          id: 'welcome',
          text: '¡Hola! Soy el asistente virtual de **Dr. Goyo**. 🩺\n\nEstoy aquí para ayudarte a encontrar lo que necesitas. Puedes consultarme sobre síntomas, medicamentos o exámenes de laboratorio.\n\n¿En qué puedo asistirte hoy?',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: 'user' | 'ai', type: 'text' | 'action' | 'doctor-list' = 'text', extraData: any = {}) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      type,
      ...extraData
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleUserMessage = (text: string) => {
    if (!text.trim()) return;
    addMessage(text, 'user');
    processAIResponse(text);
  };

  const processAIResponse = (userText: string) => {
    setIsTyping(true);
    
    // Simulate thinking time
    setTimeout(() => {
      setIsTyping(false);
      const domain = analyzeDomain(userText);
      
      // Update context if we found a clear domain
      if (domain !== 'GENERAL') {
        setCurrentDomain(domain);
      }

      const response = generateResponse(userText, domain);
      
      addMessage(
        response.text,
        'ai',
        response.type,
        response.extraData
      );
    }, 1500);
  };

  const analyzeDomain = (text: string): SpecialistDomain => {
    const t = text.toLowerCase();
    
    // PHARMACY keywords
    if (t.includes('pastilla') || t.includes('remedio') || t.includes('medicamento') || t.includes('jarabe') || t.includes('farmacia') || t.includes('receta') || t.includes('comprar')) {
        return 'PHARMACY';
    }
    
    // LABORATORY keywords
    if (t.includes('examen') || t.includes('analisis') || t.includes('sangre') || t.includes('orina') || t.includes('laboratorio') || t.includes('radiografia') || t.includes('perfil')) {
        return 'LABORATORY';
    }

    // DOCTOR keywords (Symptoms/Medical)
    if (t.includes('duele') || t.includes('dolor') || t.includes('siento') || t.includes('fiebre') || t.includes('tos') || t.includes('vomito') || t.includes('doctor') || t.includes('medico') || t.includes('especialista')) {
        return 'DOCTOR';
    }

    return 'GENERAL';
  };

  const generateResponse = (text: string, domain: SpecialistDomain) => {
    const t = text.toLowerCase();

    // Context-aware response generation
    if (domain === 'PHARMACY') {
      return {
        text: 'He detectado que buscas información sobre medicamentos o servicios de farmacia. 💊\n\nPuedo ayudarte a localizar farmacias cercanas que tengan convenios y servicios de entrega a domicilio.',
        type: 'action' as const,
        extraData: {
          actionLabel: 'Ver Farmacias Cercanas',
          onAction: onViewPharmacyList
        }
      };
    }

    if (domain === 'LABORATORY') {
      return {
        text: 'Parece que necesitas realizarte algún estudio o análisis clínico. 🔬\n\nContamos con convenios en laboratorios de alta tecnología para análisis de sangre, imágenes y más.',
        type: 'action' as const,
        extraData: {
          actionLabel: 'Ver Laboratorios',
          onAction: onViewLabList
        }
      };
    }

    if (domain === 'DOCTOR') {
      // Check for specifics within the doctor domain
      let specialty = '';
      if (t.includes('corazon') || t.includes('pecho')) specialty = 'Cardiólogo';
      else if (t.includes('niño') || t.includes('hijo')) specialty = 'Pediatra';
      else if (t.includes('piel')) specialty = 'Dermatólogo';
      
      return {
        text: `Entiendo tus síntomas. Es importante que un profesional médico te evalue. 👨‍⚕️\n\n${specialty ? `He identificado que un **${specialty}** sería el ideal para tu caso.` : 'Te sugiero consultar con un médico general para una evaluación inicial.'}`,
        type: 'action' as const,
        extraData: {
          actionLabel: specialty ? `Ver ${specialty}s` : 'Ver Médicos Disponibles',
          onAction: () => onViewDoctorList(specialty)
        }
      };
    }

    // AMBIGUOUS or GENERAL
    if (text.length < 10) {
      return {
        text: '¡Claro! Cuéntame un poco más. ¿Te sientes mal, buscas un medicamento específico o necesitas agendar un examen de laboratorio? 😊',
        type: 'text' as const,
        extraData: {}
      };
    }

    return {
        text: 'He recibido tu mensaje, pero no estoy seguro de cómo canalizarte mejor. 🤔\n\n¿Tu consulta está relacionada con síntomas médicos, compra de medicinas o exámenes de laboratorio?',
        type: 'text' as const,
        extraData: {}
    };
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <Avatar src="" alt="Dr. Goyo" size="md" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-heading font-bold text-gray-800 text-lg leading-tight">Dr. Goyo</h1>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Online ahora</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
           <button className="p-2.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><Phone size={19} /></button>
           <button className="p-2.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"><MoreVertical size={19} /></button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8FAFB] scrollbar-hide">
        <div className="flex justify-center mb-6">
          <span className="bg-white/80 backdrop-blur-sm border border-gray-100 px-4 py-1.5 rounded-full text-[10px] text-gray-400 font-medium shadow-sm uppercase tracking-widest">
            Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </span>
        </div>
        
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start w-full mb-4 animate-in fade-in duration-300">
             <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm">
                <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-100 safe-bottom">
        <div className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/5 transition-all group">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-white rounded-full shadow-none hover:shadow-sm">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe tus síntomas o busca medicinas..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder:text-gray-400 text-sm py-1.5"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`
              p-2.5 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center
              ${inputText.trim() 
                ? 'bg-primary text-white hover:scale-105 active:scale-95 shadow-primary/20' 
                : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}
            `}
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-3 font-medium">
          Dr. Goyo es una IA y no debe usarse para emergencias médicas.
        </p>
      </div>
    </div>
  );

  function handleSend() {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    handleUserMessage(text);
  }
};