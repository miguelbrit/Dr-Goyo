import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, ArrowLeft, MoreVertical, Phone } from 'lucide-react';
import { ChatMessage, Message } from '../components/ChatMessage';
import { Avatar } from '../components/Avatar';

interface ChatScreenProps {
  initialMessage?: string;
  onBack: () => void;
  onViewDoctorList: (specialty?: string) => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ initialMessage, onBack, onViewDoctorList }) => {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting or handling initial message
  useEffect(() => {
    if (initialMessage) {
      addMessage(initialMessage, 'user');
      simulateResponse(initialMessage);
    } else {
      // Default greeting
      setMessages([
        {
          id: 'welcome',
          text: 'Hola, soy Dr. Goyo (IA). \n\nEstoy aquí para orientarte sobre tus síntomas o dudas de salud. Recuerda que mi ayuda es informativa y no sustituye una consulta médica profesional.\n\n¿En qué puedo ayudarte hoy?',
          sender: 'ai',
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }
  }, []);

  // Auto-scroll
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

  const handleSend = () => {
    if (!inputText.trim()) return;
    addMessage(inputText, 'user');
    simulateResponse(inputText);
    setInputText('');
  };

  // --- AI LOGIC START ---
  const analyzeSymptoms = (text: string): { specialty: string; reasoning: string } | null => {
    const lowerText = text.toLowerCase();
    
    // Logic for symptom/pathology detection mapped to specialty
    if (lowerText.includes('corazon') || lowerText.includes('pecho') || lowerText.includes('palpitaciones') || lowerText.includes('presion') || lowerText.includes('hipertension') || lowerText.includes('cardiaco')) {
      return { specialty: 'Cardiólogo', reasoning: 'Tus síntomas podrían estar relacionados con el sistema cardiovascular.' };
    }
    
    if (lowerText.includes('cabeza') || lowerText.includes('migraña') || lowerText.includes('mareo') || lowerText.includes('memoria') || lowerText.includes('convulsion')) {
      return { specialty: 'Neurólogo', reasoning: 'Lo que describes parece estar relacionado con el sistema neurológico.' };
    }
    
    if (lowerText.includes('dieta') || lowerText.includes('peso') || lowerText.includes('gordo') || lowerText.includes('flaco') || lowerText.includes('comer') || lowerText.includes('alimento')) {
      return { specialty: 'Nutricionista', reasoning: 'Para temas de alimentación y peso, un nutricionista es el especialista indicado.' };
    }

    if (lowerText.includes('sangre') || lowerText.includes('moretones') || lowerText.includes('anemia') || lowerText.includes('coagulacion') || lowerText.includes('sangrado')) {
      return { specialty: 'Hematólogo', reasoning: 'Tus síntomas sugieren una posible afección sanguínea.' };
    }

    if (lowerText.includes('embarazo') || lowerText.includes('menstruacion') || lowerText.includes('regla') || lowerText.includes('ovarios') || lowerText.includes('mujer') || lowerText.includes('intimo')) {
      return { specialty: 'Ginecólogo', reasoning: 'Para salud femenina y reproductiva, te recomiendo consultar a un ginecólogo.' };
    }

    if (lowerText.includes('diabetes') || lowerText.includes('hormonas') || lowerText.includes('tiroides') || lowerText.includes('sed') || lowerText.includes('cansancio') || lowerText.includes('azucar')) {
      return { specialty: 'Endocrinólogo', reasoning: 'Estos síntomas suelen estar asociados al sistema endocrino y hormonal.' };
    }

    if (lowerText.includes('niño') || lowerText.includes('bebe') || lowerText.includes('hijo') || lowerText.includes('crecimiento')) {
      return { specialty: 'Pediatra', reasoning: 'Para la atención de niños y adolescentes, el especialista adecuado es un pediatra.' };
    }

    if (lowerText.includes('tos') || lowerText.includes('respirar') || lowerText.includes('pulmones') || lowerText.includes('aire') || lowerText.includes('asma') || lowerText.includes('gripe')) {
      return { specialty: 'Neumonólogo', reasoning: 'Tus síntomas respiratorios deberían ser evaluados por un neumonólogo.' };
    }

    // Default fallback (General Practitioner context, but maps to list generally)
    if (lowerText.includes('medico') || lowerText.includes('doctor') || lowerText.includes('cita')) {
        return { specialty: '', reasoning: 'Puedo mostrarte nuestra lista general de especialistas.' };
    }

    return null;
  };

  const simulateResponse = (userText: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const analysis = analyzeSymptoms(userText);

      if (analysis) {
        // Known specialty or general request
        if (analysis.specialty) {
           addMessage(
             `Entiendo. ${analysis.reasoning}\n\nHe filtrado nuestra lista de médicos para mostrarte solo los especialistas en **${analysis.specialty}**.`,
             'ai',
             'action',
             {
               actionLabel: `Ver ${analysis.specialty}s recomendados`,
               onAction: () => onViewDoctorList(analysis.specialty)
             }
           );
        } else {
           // General request
           addMessage(
             'Claro, puedo ayudarte a encontrar el especialista adecuado. Aquí tienes el acceso a nuestro directorio médico.',
             'ai',
             'action',
             {
               actionLabel: 'Ver todos los médicos',
               onAction: () => onViewDoctorList()
             }
           );
        }
      } else {
        // Unknown or vague
        addMessage(
          'Entiendo. Para poder orientarte mejor hacia la especialidad correcta, ¿podrías darme más detalles sobre tus síntomas?\n\nPor ejemplo: "tengo dolor de cabeza constante" o "necesito una dieta".',
          'ai',
          'action',
          {
            actionLabel: 'Ver lista general',
            onAction: () => onViewDoctorList()
          }
        );
      }
    }, 1500);
  };
  // --- AI LOGIC END ---

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar src="" alt="Dr. Goyo" size="md" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="font-heading font-bold text-gray-800 text-lg">Dr. Goyo</h1>
              <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full">Asistente IA</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><Phone size={20} /></button>
           <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><MoreVertical size={20} /></button>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-bg">
        <p className="text-center text-xs text-gray-400 my-4">
           La IA puede cometer errores. Verifica la información importante.
        </p>
        
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        
        {isTyping && (
          <div className="flex justify-start w-full mb-4">
             <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none flex gap-1 items-center shadow-sm">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t border-gray-100 sticky bottom-0 z-20 pb-safe">
        <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all shadow-sm">
          <button className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-200 rounded-full">
            <Mic size={20} />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tus síntomas..."
            className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 placeholder:text-gray-400 py-1"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className={`
              p-2 rounded-xl transition-all shadow-md
              ${inputText.trim() 
                ? 'bg-primary text-white hover:scale-105 hover:bg-teal-600' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};