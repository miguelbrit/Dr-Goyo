import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Calendar, Users, MessageSquare, DollarSign, Settings, LogOut, 
  Bell, Search, Menu, X, ChevronRight, Clock, MapPin, MoreVertical, CheckCircle, XCircle, Filter, Loader2 
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { DoctorProfileDetails } from '../components/DoctorProfileDetails';
import { formatDateTime12h } from '../utils/formatters';

interface DoctorDashboardProps {
  onLogout: () => void;
  userName?: string;
  userProfile?: any;
  onProfileUpdate?: () => void;
}

type DashboardView = 'overview' | 'appointments' | 'patients' | 'chat' | 'earnings' | 'settings';

export const DoctorDashboardScreen: React.FC<DoctorDashboardProps> = ({ onLogout, userName: initialUserName = "Doctor", userProfile: initialUserProfile }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(!initialUserProfile);
  const [profile, setProfile] = useState(initialUserProfile);
  const [userName, setUserName] = useState(initialUserName);

  useEffect(() => {
    if (!profile) {
      fetchProfile();
    }
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        // --- SECURITY GUARD ---
        if (result.data.doctor?.status !== 'VERIFIED') {
          console.error("Access denied: Doctor not verified");
          onLogout();
          return;
        }

        setProfile(result.data);
        setUserName(result.data.name);
      }
    } catch (err) {
      console.error("Error fetching doctor profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const doctorData = profile?.doctor || {};
  const specialty = doctorData.specialty || "Especialista";
  const experience = doctorData.experienceYears || "0";
  const city = doctorData.city || "No especificada";

  // --- Real Stats & Data ---
  const appointmentsData = doctorData.appointments || [];
  const completedAppointments = appointmentsData.filter((a: any) => a.status === 'completed');
  
  // Calculate Patients (Unique patients from appointments)
  const uniquePatients = Array.from(new Set(appointmentsData.map((a: any) => a.patientId))).length;
  
  // Calculate Earnings
  const totalEarnings = completedAppointments.reduce((sum: number, a: any) => sum + (a.price || 0), 0);

  const stats = [
    { label: 'Pacientes Totales', value: uniquePatients.toString(), icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Citas Hoy', value: appointmentsData.filter((a: any) => {
        const today = new Date().toISOString().split('T')[0];
        const aptDate = new Date(a.date).toISOString().split('T')[0];
        return aptDate === today;
      }).length.toString(), icon: Calendar, color: 'bg-teal-100 text-teal-600' },
    { label: 'Ingresos Totales', value: `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Nuevos Mensajes', value: '0', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  ];

  const appointments = appointmentsData;

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

  const AppointmentRow = ({ apt }: { apt: any }) => (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        {apt.patient?.profile?.imageUrl ? (
          <img src={apt.patient.profile.imageUrl} alt="" className="w-12 h-12 rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {apt.patient?.profile?.name?.charAt(0) || 'P'}
          </div>
        )}
        <div>
          <h4 className="font-bold text-gray-900">{apt.patient?.profile?.name} {apt.patient?.profile?.surname}</h4>
          <p className="text-xs text-gray-500 font-medium">
            {formatDateTime12h(apt.date)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
            apt.status === 'upcoming' ? 'bg-blue-100 text-blue-600' : 
            apt.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
         }`}>
            {apt.status}
         </span>
         <button className="p-2 text-gray-400 group-hover:text-primary transition-colors">
            <ChevronRight size={18} />
         </button>
      </div>
    </div>
  );

  // --- Main Render ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium font-heading">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

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
                <div className="flex items-center gap-1 justify-end">
                   <p className="text-sm font-bold text-gray-900">{userName}</p>
                   {doctorData.license && <CheckCircle size={14} className="text-primary" />}
                </div>
                <p className="text-xs text-primary font-medium">{specialty}</p>
              </div>
              <Avatar src={profile?.imageUrl || doctorData.imageUrl} alt="Dr" size="md" />
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
                        {appointments.length > 0 ? (
                          appointments.map((apt: any) => <AppointmentRow key={apt.id} apt={apt} />)
                        ) : (
                          <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium font-heading">No hay citas programadas hoy</p>
                          </div>
                        )}
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
                        <p className="text-3xl font-bold mb-4">$0.00</p>
                        <p className="text-sm text-blue-200 mb-6">Sin pagos pendientes</p>
                        <Button label="Retirar Fondos" fullWidth className="bg-white text-secondary hover:bg-blue-50" disabled />
                     </div>

                     <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Solicitudes Recientes</h3>
                        <div className="space-y-4 py-8 text-center">
                           <p className="text-sm text-gray-400 font-medium font-heading">No tienes solicitudes nuevas</p>
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
                        {appointments.length > 0 ? (
                          appointments.map((apt: any) => (
                             <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="p-4">
                                   <div className="flex items-center gap-3">
                                      {apt.patient?.profile?.imageUrl ? (
                                        <img src={apt.patient.profile.imageUrl} alt="" className="w-10 h-10 rounded-full" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                          {apt.patient?.profile?.name?.charAt(0) || 'P'}
                                        </div>
                                      )}
                                      <span className="font-bold text-gray-900">{apt.patient?.profile?.name} {apt.patient?.profile?.surname}</span>
                                   </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                   {formatDateTime12h(apt.date)}
                                </td>
                                <td className="p-4 text-sm text-gray-600">{apt.type}</td>
                                <td className="p-4">
                                   <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                      apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                                      apt.status === 'completed' ? 'bg-green-100 text-green-700' :
                                      'bg-red-100 text-red-700'
                                   }`}>
                                      {apt.status}
                                   </span>
                                </td>
                                <td className="p-4 text-right">
                                   <button className="text-primary font-bold text-sm hover:underline">Ver Detalle</button>
                                </td>
                             </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-12 text-center text-gray-500 font-medium">
                              No hay citas registradas en tu histórico
                            </td>
                          </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {currentView === 'patients' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Mis Pacientes</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appointments.length > 0 ? (
                    (() => {
                      const patientsMap = new Map();
                      appointments.forEach((apt: any) => {
                        if (!patientsMap.has(apt.patientId)) {
                          patientsMap.set(apt.patientId, apt.patient);
                        }
                      });
                      return Array.from(patientsMap.values()).map((patient: any) => (
                        <div key={patient.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft flex items-center gap-4">
                           {patient.profile?.imageUrl ? (
                             <img src={patient.profile.imageUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
                           ) : (
                             <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl font-heading">
                               {patient.profile?.name?.charAt(0) || 'P'}
                             </div>
                           )}
                           <div>
                              <h4 className="font-bold text-gray-900">{patient.profile?.name} {patient.profile?.surname}</h4>
                              <p className="text-sm text-gray-500">{patient.city || 'Venezuela'}</p>
                              <button className="text-primary text-xs font-bold mt-2 hover:underline">Ver Historial</button>
                           </div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="col-span-full py-20 text-center">
                       <Users className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                       <h3 className="text-lg font-bold text-gray-900">Sin pacientes registrados</h3>
                       <p className="text-gray-500">Tus pacientes aparecerán aquí una vez agenden su primera cita.</p>
                    </div>
                  )}
               </div>
            </div>
          )}

          {currentView === 'chat' && (
            <div className="h-full flex flex-col items-center justify-center py-20 animate-in fade-in">
               <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
               <h3 className="text-xl font-bold text-gray-900">Buzón de Mensajes</h3>
               <p className="text-gray-500 max-w-sm text-center mt-2">
                 Todavía no tienes conversaciones activas con tus pacientes.
               </p>
            </div>
          )}

          {currentView === 'earnings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8">
               <h2 className="text-2xl font-bold text-gray-900">Resumen de Ingresos</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                     <p className="text-gray-500 text-sm font-medium mb-1">Total Generado</p>
                     <p className="text-3xl font-bold text-gray-900">${totalEarnings.toFixed(2)}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                     <p className="text-gray-500 text-sm font-medium mb-1">Citas Completadas</p>
                     <p className="text-3xl font-bold text-blue-600">{completedAppointments.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft">
                     <p className="text-gray-500 text-sm font-medium mb-1">Saldo por Retirar</p>
                     <p className="text-3xl font-bold text-green-600">$0.00</p>
                  </div>
               </div>

               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                     <h3 className="font-bold text-gray-900">Historial de Transacciones</h3>
                  </div>
                  {completedAppointments.length > 0 ? (
                    <table className="w-full text-left">
                       <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                          <tr>
                             <th className="p-4">Fecha</th>
                             <th className="p-4">Detalle</th>
                             <th className="p-4">Monto</th>
                             <th className="p-4">Estado</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-gray-100">
                          {completedAppointments.map((apt: any) => (
                             <tr key={apt.id}>
                                <td className="p-4 text-sm text-gray-600">
                                   {new Date(apt.date).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                   <p className="text-sm font-bold text-gray-900">Consulta - {apt.patient?.profile?.name}</p>
                                   <p className="text-xs text-gray-500">ID: {apt.id.split('-')[0]}</p>
                                </td>
                                <td className="p-4 text-sm font-bold text-green-600">
                                   +${apt.price.toFixed(2)}
                                </td>
                                <td className="p-4">
                                   <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-600 uppercase">Procesado</span>
                                </td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                  ) : (
                    <div className="p-12 text-center text-gray-400 font-medium font-heading">
                       No hay transacciones registradas todavía.
                    </div>
                  )}
               </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="animate-in fade-in duration-500">
               <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 font-heading">Configuración del Perfil</h2>
                  <p className="text-gray-500">Administra tu información profesional y foto de perfil.</p>
               </div>
               <DoctorProfileDetails userProfile={profile} onUpdate={fetchProfile} />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};