import React, { useState } from 'react';
import { 
  LayoutDashboard, Calendar, Users, MessageSquare, DollarSign, Settings, LogOut, 
  Bell, Search, Menu, X, ChevronRight, Clock, MapPin, MoreVertical, CheckCircle, XCircle, Filter 
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';

interface DoctorDashboardProps {
  onLogout: () => void;
  userName?: string;
}

type DashboardView = 'overview' | 'appointments' | 'patients' | 'calendar' | 'chat' | 'earnings' | 'settings';

export const DoctorDashboardScreen: React.FC<DoctorDashboardProps> = ({ onLogout, userName = "Dr. Alejandro" }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);

  // --- Mock Data ---
  const stats = [
    { label: 'Pacientes Totales', value: '1,204', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Citas Hoy', value: '8', icon: Calendar, color: 'bg-teal-100 text-teal-600' },
    { label: 'Ingresos Mes', value: '$3,450', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Mensajes', value: '12', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  ];

  const appointments = [
    { id: 1, patient: 'Ana García', time: '09:00 AM', type: 'Primera Consulta', status: 'confirmed', image: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, patient: 'Carlos Ruiz', time: '10:30 AM', type: 'Seguimiento', status: 'pending', image: 'https://i.pravatar.cc/150?u=2' },
    { id: 3, patient: 'Maria Lopez', time: '11:00 AM', type: 'Resultados', status: 'confirmed', image: 'https://i.pravatar.cc/150?u=3' },
    { id: 4, patient: 'Jose Diaz', time: '02:00 PM', type: 'Urgencia', status: 'cancelled', image: 'https://i.pravatar.cc/150?u=4' },
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

  const AppointmentRow = ({ apt }: { apt: typeof appointments[0] }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <img src={apt.image} alt={apt.patient} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <h4 className="font-bold text-gray-900">{apt.patient}</h4>
          <p className="text-sm text-gray-500">{apt.type}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
          <Clock size={16} />
          {apt.time}
        </div>
        <div className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
          apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
          apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
          {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'pending' ? 'Pendiente' : 'Cancelada'}
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 group-hover:text-primary">
          <ChevronRight size={20} />
        </button>
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
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <LayoutDashboard size={24} />
            </div>
            <div>
               <h1 className="font-heading font-bold text-xl text-gray-900">Dr. Goyo</h1>
               <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Médicos</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="appointments" icon={Calendar} label="Citas" />
            <SidebarItem id="patients" icon={Users} label="Pacientes" />
            <SidebarItem id="chat" icon={MessageSquare} label="Chat" />
            <SidebarItem id="earnings" icon={DollarSign} label="Ingresos" />
            <SidebarItem id="settings" icon={Settings} label="Configuración" />
          </nav>

          <div className="pt-6 border-t border-gray-100">
             <div className="bg-blue-50 p-4 rounded-xl mb-4">
                <p className="text-xs text-blue-600 font-bold mb-1">PLAN PROFESIONAL</p>
                <p className="text-xs text-blue-800">Tu suscripción expira en 12 días.</p>
             </div>
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
            <h2 className="text-xl font-heading font-bold text-gray-800 capitalize hidden md:block">
              {currentView}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-gray-100 p-1 rounded-full">
               <button 
                  onClick={() => setIsAvailable(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isAvailable ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
               >
                  Disponible
               </button>
               <button 
                  onClick={() => setIsAvailable(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isAvailable ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}
               >
                  Ausente
               </button>
            </div>

            <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-gray-900">{userName}</p>
                <p className="text-xs text-primary font-medium">Cardiólogo</p>
              </div>
              <Avatar src="https://i.pravatar.cc/150?u=doc" alt="Dr" size="md" />
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
                  {/* Left Column: Appointments */}
                  <div className="lg:col-span-2 space-y-6">
                     <div className="flex justify-between items-center">
                        <h3 className="font-heading font-bold text-lg text-gray-900">Próximas Citas</h3>
                        <button 
                           onClick={() => setCurrentView('appointments')}
                           className="text-primary text-sm font-medium hover:underline"
                        >
                           Ver todas
                        </button>
                     </div>
                     <div className="space-y-4">
                        {appointments.map(apt => <AppointmentRow key={apt.id} apt={apt} />)}
                     </div>
                     
                     {/* Weekly Chart Placeholder */}
                     <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 mt-8">
                        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Actividad Semanal</h3>
                        <div className="h-48 flex items-end justify-between gap-2 px-2">
                           {[40, 70, 45, 90, 60, 30, 80].map((h, i) => (
                              <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                                 <div 
                                    className="absolute bottom-0 left-0 right-0 bg-primary/80 rounded-t-lg transition-all group-hover:bg-primary"
                                    style={{ height: `${h}%` }}
                                 ></div>
                              </div>
                           ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-gray-400 font-bold uppercase">
                           <span>Lun</span><span>Mar</span><span>Mie</span><span>Jue</span><span>Vie</span><span>Sab</span><span>Dom</span>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Quick Actions & Income */}
                  <div className="space-y-6">
                     <div className="bg-gradient-to-br from-secondary to-blue-900 rounded-2xl p-6 text-white shadow-lg">
                        <h3 className="font-heading font-bold text-lg mb-1">Saldo Disponible</h3>
                        <p className="text-3xl font-bold mb-4">$1,250.00</p>
                        <p className="text-sm text-blue-200 mb-6">Próximo pago: 15 de Octubre</p>
                        <Button label="Retirar Fondos" fullWidth className="bg-white text-secondary hover:bg-blue-50" />
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Solicitudes Recientes</h3>
                        <div className="space-y-4">
                           {[1, 2].map((i) => (
                              <div key={i} className="flex gap-3 items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                 <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0"></div>
                                 <div>
                                    <p className="text-sm font-bold text-gray-800">Nuevo paciente asignado</p>
                                    <p className="text-xs text-gray-500 mb-2">Hace 2 horas</p>
                                    <div className="flex gap-2">
                                       <button className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Aceptar</button>
                                       <button className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Rechazar</button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {currentView === 'appointments' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Agenda de Citas</h2>
                  <div className="flex gap-2">
                     <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600"><Filter size={20} /></button>
                     <Button label="Nueva Cita" icon={Calendar} />
                  </div>
               </div>
               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                        <tr>
                           <th className="p-4">Paciente</th>
                           <th className="p-4">Fecha & Hora</th>
                           <th className="p-4">Tipo</th>
                           <th className="p-4">Estado</th>
                           <th className="p-4 text-right">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {appointments.map((apt) => (
                           <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                 <div className="flex items-center gap-3">
                                    <img src={apt.image} alt="" className="w-10 h-10 rounded-full" />
                                    <span className="font-bold text-gray-900">{apt.patient}</span>
                                 </div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">{apt.time}, Hoy</td>
                              <td className="p-4 text-sm text-gray-600">{apt.type}</td>
                              <td className="p-4">
                                 <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-red-100 text-red-700'
                                 }`}>
                                    {apt.status}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 <button className="text-primary font-bold text-sm hover:underline">Ver Detalle</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {currentView !== 'overview' && currentView !== 'appointments' && (
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