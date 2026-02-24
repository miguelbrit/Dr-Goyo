import React, { useState } from 'react';
import { 
  CheckCircle, XCircle, User, Building, Activity, 
  MapPin, Calendar, ExternalLink, ShieldAlert 
} from 'lucide-react';
import { Avatar } from './Avatar';

interface PendingEntity {
  id: string;
  entityType: 'Medico' | 'Farmacia' | 'Laboratorio';
  profile?: {
    name: string;
    surname?: string;
    email: string;
    imageUrl?: string;
    createdAt?: string;
  };
  specialty?: string;
  businessName?: string;
  city?: string;
  license?: string;
}

interface VerificationPanelProps {
  pendingItems: PendingEntity[];
  onApprove: (id: string, type: string) => void;
  onReject: (id: string, type: string) => void;
}

type TabType = 'all' | 'doctors' | 'pharmacies' | 'labs';

export const VerificationPanel: React.FC<VerificationPanelProps> = ({ 
  pendingItems, 
  onApprove, 
  onReject 
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const filteredItems = pendingItems.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'doctors') return item.entityType === 'Medico';
    if (activeTab === 'pharmacies') return item.entityType === 'Farmacia';
    if (activeTab === 'labs') return item.entityType === 'Laboratorio';
    return true;
  });

  const TabButton = ({ type, label, icon: Icon, count }: { type: TabType, label: string, icon: any, count: number }) => (
    <button
      onClick={() => setActiveTab(type)}
      className={`
        flex items-center gap-2 px-6 py-3 border-b-2 transition-all font-bold text-sm
        ${activeTab === type 
          ? 'border-primary text-gray-900 bg-primary/5' 
          : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}
      `}
    >
      <Icon size={18} />
      <span>{label}</span>
      {count > 0 && (
        <span className={`
          px-2 py-0.5 rounded-full text-[10px] 
          ${activeTab === type ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'}
        `}>
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-soft overflow-hidden animate-in fade-in duration-500">
      {/* Header & Tabs */}
      <div className="p-8 border-b border-gray-100 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              <CheckCircle className="text-primary" size={28} />
              Panel de Verificaciones
            </h3>
            <p className="text-gray-500 text-sm mt-1">
              Validación manual de credenciales para Garantizar la seguridad de la plataforma.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-2xl flex items-center gap-2 text-secondary text-xs font-bold">
            <ShieldAlert size={16} />
            {pendingItems.length} solicitudes pendientes
          </div>
        </div>

        <div className="flex overflow-x-auto no-scrollbar">
          <TabButton 
            type="all" 
            label="Todos" 
            icon={ShieldAlert} 
            count={pendingItems.length} 
          />
          <TabButton 
            type="doctors" 
            label="Médicos" 
            icon={User} 
            count={pendingItems.filter(i => i.entityType === 'Medico').length} 
          />
          <TabButton 
            type="pharmacies" 
            label="Farmacias" 
            icon={Building} 
            count={pendingItems.filter(i => i.entityType === 'Farmacia').length} 
          />
          <TabButton 
            type="labs" 
            label="Laboratorios" 
            icon={Activity} 
            count={pendingItems.filter(i => i.entityType === 'Laboratorio').length} 
          />
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <tr>
              <th className="px-8 py-5">Profesional / Negocio</th>
              <th className="px-8 py-5">Especialidad / Tipo</th>
              <th className="px-8 py-5">Ubicación</th>
              <th className="px-8 py-5">Registro</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <Avatar 
                      src={item.profile?.imageUrl} 
                      alt={item.profile?.name || item.businessName || 'User'} 
                      size="md"
                      className="ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-base leading-none mb-1">
                        {item.profile?.name} {item.profile?.surname || (item.entityType !== 'Medico' ? (item.businessName || '') : '')}
                      </p>
                      <p className="text-xs text-gray-400 font-medium">
                        {item.profile?.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className={`
                      text-[10px] font-black uppercase tracking-wider mb-1 px-2 py-0.5 rounded-md inline-block w-fit
                      ${item.entityType === 'Medico' ? 'bg-teal-50 text-teal-600' : 
                        item.entityType === 'Farmacia' ? 'bg-purple-50 text-purple-600' : 'bg-indigo-50 text-indigo-600'}
                    `}>
                      {item.entityType}
                    </span>
                    <span className="text-sm font-bold text-gray-700">
                      {item.specialty || (item.entityType === 'Laboratorio' ? 'Bioanálisis' : 'Farmacéutica')}
                    </span>
                    {item.license && (
                      <span className="text-[10px] text-gray-400 font-medium mt-1">Céd: {item.license}</span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={14} className="text-gray-300" />
                    <span className="text-sm font-medium">{item.city || 'Venezuela'}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">
                      {item.profile?.createdAt ? new Date(item.profile.createdAt).toLocaleDateString() : 'Reciente'}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-4">
                    <button 
                      className="p-2 text-gray-400 hover:text-primary hover:bg-accent/10 rounded-xl transition-all"
                      title="Ver detalles completos"
                    >
                      <ExternalLink size={18} />
                    </button>
                    <button 
                      onClick={() => onReject(item.id, item.entityType)}
                      className="px-4 py-2 bg-white border border-red-100 text-red-500 rounded-xl text-xs font-black hover:bg-red-50 active:scale-95 transition-all shadow-sm"
                    >
                      RECHAZAR
                    </button>
                    <button 
                      onClick={() => onApprove(item.id, item.entityType)}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-black hover:bg-gray-800 active:scale-95 transition-all shadow-lg shadow-gray-200"
                    >
                      APROBAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="max-w-xs mx-auto">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <CheckCircle size={32} />
                    </div>
                    <p className="text-gray-900 font-bold mb-1">¡Todo al día!</p>
                    <p className="text-gray-400 text-sm">
                      No hay solicitudes pendientes de aprobación.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredItems.length > 0 && (
        <div className="p-6 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            Dr. Goyo v1.0 Security Protocol - Master Approval Panel
          </p>
        </div>
      )}
    </div>
  );
};
