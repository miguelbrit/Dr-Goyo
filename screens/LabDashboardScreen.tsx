import React, { useState } from 'react';
import { 
  LayoutDashboard, FlaskConical, Calendar, FileText, MessageSquare, BarChart, Settings, LogOut, 
  Bell, Menu, Search, Plus, Clock, ChevronRight, Filter, MoreVertical, CheckCircle, XCircle, AlertCircle, Upload
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';

interface LabDashboardProps {
  onLogout: () => void;
  labName?: string;
}

type DashboardView = 'overview' | 'services' | 'appointments' | 'results' | 'chat' | 'stats' | 'settings';

export const LabDashboardScreen: React.FC<LabDashboardProps> = ({ onLogout, labName = "LabCare Diagnósticos" }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  // --- Mock Data ---
  const stats = [
    { label: 'Citas Hoy', value: '18', icon: Calendar, color: 'bg-blue-100 text-blue-600' },
    { label: 'Resultados Pendientes', value: '7', icon: AlertCircle, color: 'bg-orange-100 text-orange-600' },
    { label: 'Exámenes Realizados', value: '142', icon: FlaskConical, color: 'bg-teal-100 text-teal-600' },
    { label: 'Mensajes', value: '5', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  ];

  const appointments = [
    { id: 1, patient: 'Pedro Perez', test: 'Hematología Completa', time: '08:00 AM', status: 'pending', image: 'https://i.pravatar.cc/150?u=10' },
    { id: 2, patient: 'Laura Díaz', test: 'Perfil Lipídico', time: '08:30 AM', status: 'completed', image: 'https://i.pravatar.cc/150?u=11' },
    { id: 3, patient: 'Roberto Gomez', test: 'Prueba de Embarazo', time: '09:15 AM', status: 'confirmed', image: 'https://i.pravatar.cc/150?u=12' },
    { id: 4, patient: 'Maria Silva', test: 'Perfil Tiroideo', time: '10:00 AM', status: 'confirmed', image: 'https://i.pravatar.cc/150?u=13' },
  ];

  const services = [
    { id: 1, name: 'Hematología Completa', price: 25.00, duration: '24 horas', preparation: 'No requiere ayuno', active: true },
    { id: 2, name: 'Perfil Lipídico', price: 40.00, duration: '24 horas', preparation: 'Ayuno 12 horas', active: true },
    { id: 3, name: 'Perfil Tiroideo', price: 55.00, duration: '48 horas', preparation: 'Ayuno 8 horas', active: true },
    { id: 4, name: 'Rayos X Tórax', price: 35.00, duration: 'Inmediato', preparation: 'Ninguna', active: false },
  ];

  const pendingResults = [
    { id: 101, patient: 'Ana García', test: 'Hematología', date: 'Hoy', status: 'uploading' },
    { id: 102, patient: 'Carlos Ruiz', test: 'Perfil 20', date: 'Ayer', status: 'ready' },
  ];

  // --- Components ---

  const SidebarItem = ({ id, icon: Icon, label }: { id: DashboardView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === id 
          ? 'bg-primary text-white shadow-lg shadow-primary/30' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ item }: { item: typeof stats[0] }) => (
    <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
        <item.icon size={24} />
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium">{item.label}</p>
        <h3 className="text-2xl font-heading font-bold text-gray-900">{item.value}</h3>
      </div>
    </div>
  );

  // --- Main Render ---

  return (
    <div className="min-h-screen bg-gray-bg flex">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
              <FlaskConical size={24} />
            </div>
            <div>
               <h1 className="font-heading font-bold text-xl text-gray-900">Dr. Goyo</h1>
               <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Laboratorio</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="services" icon={FlaskConical} label="Servicios" />
            <SidebarItem id="appointments" icon={Calendar} label="Citas" />
            <SidebarItem id="results" icon={FileText} label="Resultados" />
            <SidebarItem id="chat" icon={MessageSquare} label="Chat" />
            <SidebarItem id="stats" icon={BarChart} label="Estadísticas" />
            <SidebarItem id="settings" icon={Settings} label="Configuración" />
          </nav>

          <div className="pt-6 border-t border-gray-100">
             <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
             >
               <LogOut size={20} />
               Cerrar Sesión
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:block">
               <h2 className="text-xl font-heading font-bold text-gray-800">{labName}</h2>
               <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><AlertCircle size={10} className="text-yellow-500"/> Ranking 4.8/5.0</span>
                  <span>•</span>
                  <span>Caracas, Venezuela</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-gray-100 p-1 rounded-full">
               <button 
                  onClick={() => setIsOpen(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isOpen ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
               >
                  Operativo
               </button>
               <button 
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isOpen ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}
               >
                  Cerrado
               </button>
            </div>

            <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Avatar src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=200" alt="Lab" size="md" />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {currentView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => <StatCard key={idx} item={stat} />)}
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Appointments Today */}
                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                           <h3 className="font-heading font-bold text-lg text-gray-900">Citas de Hoy</h3>
                           <button 
                              onClick={() => setCurrentView('appointments')}
                              className="text-primary text-sm font-medium hover:underline"
                           >
                              Ver agenda completa
                           </button>
                        </div>
                        <div className="divide-y divide-gray-100">
                           {appointments.map((apt) => (
                              <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <img src={apt.image} alt={apt.patient} className="w-10 h-10 rounded-full object-cover" />
                                    <div>
                                       <p className="font-bold text-gray-900">{apt.patient}</p>
                                       <p className="text-xs text-gray-500">{apt.test}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                       <Clock size={14} />
                                       {apt.time}
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                                       apt.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                       apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                       'bg-yellow-100 text-yellow-700'
                                    }`}>
                                       {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'completed' ? 'Realizada' : 'Pendiente'}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Pending Results & Quick Actions */}
                  <div className="space-y-6">
                     <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                           <FileText className="text-orange-500" size={20} />
                           <h3 className="font-heading font-bold text-lg text-gray-900">Resultados Pendientes</h3>
                        </div>
                        <div className="space-y-3">
                           {pendingResults.map((res) => (
                              <div key={res.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
                                 <div>
                                    <p className="font-bold text-gray-800 text-sm">{res.patient}</p>
                                    <p className="text-xs text-gray-500">{res.test}</p>
                                 </div>
                                 <button className="text-xs bg-white text-primary font-bold px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/5 flex items-center gap-1">
                                    <Upload size={12} />
                                    Subir
                                 </button>
                              </div>
                           ))}
                        </div>
                        <button 
                           onClick={() => setCurrentView('results')}
                           className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium"
                        >
                           Ver todos los resultados
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {currentView === 'services' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Catálogo de Servicios</h2>
                  <div className="flex gap-2 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                           type="text" 
                           placeholder="Buscar examen..." 
                           className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                     </div>
                     <Button label="Nuevo Servicio" icon={Plus} />
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                           <tr>
                              <th className="p-4">Examen</th>
                              <th className="p-4">Precio</th>
                              <th className="p-4">Preparación</th>
                              <th className="p-4">Entrega</th>
                              <th className="p-4">Estado</th>
                              <th className="p-4 text-right">Acciones</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {services.map((service) => (
                              <tr key={service.id} className="hover:bg-gray-50/50 transition-colors">
                                 <td className="p-4">
                                    <div className="font-bold text-gray-900">{service.name}</div>
                                 </td>
                                 <td className="p-4 font-medium text-gray-900">${service.price.toFixed(2)}</td>
                                 <td className="p-4 text-sm text-gray-600">{service.preparation}</td>
                                 <td className="p-4 text-sm text-gray-600">{service.duration}</td>
                                 <td className="p-4">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                       service.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                       {service.active ? 'Activo' : 'Inactivo'}
                                    </span>
                                 </td>
                                 <td className="p-4 text-right">
                                    <button className="text-primary font-bold text-sm hover:underline">Editar</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {currentView !== 'overview' && currentView !== 'services' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                  <Settings size={48} />
               </div>
               <h3 className="text-xl font-bold text-gray-900">Sección en Construcción</h3>
               <p className="text-gray-500 max-w-md mt-2">
                  Estamos trabajando para habilitar el módulo de {currentView} lo antes posible.
               </p>
               <Button label="Volver al Dashboard" variant="outline" className="mt-6" onClick={() => setCurrentView('overview')} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};