import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Book, Settings, LogOut, 
  Plus, Search, Bell, ChevronDown, Edit3, Trash2, Eye, Save, UploadCloud,
  CheckCircle, Users, X, ShieldCheck, Activity, Building, Truck, Briefcase, Filter, ChevronRight
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Article, GlossaryItem } from '../types';
import { ContentEditor } from '../components/ContentEditor';
import { GlossaryManager } from '../components/GlossaryManager';
import { supabase } from '../supabase';
import { VerificationPanel } from '../components/VerificationPanel';

// --- Types ---
type AdminView = 'overview' | 'approvals' | 'articles' | 'glossary' | 'media' | 'editor';

interface LibraryAdminScreenProps {
  onLogout: () => void;
}

export const LibraryAdminScreen: React.FC<LibraryAdminScreenProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [usersCount, setUsersCount] = useState({ 
    patients: 0, 
    doctors: { total: 0, verified: 0, pending: 0 }, 
    pharmacies: { total: 0, verified: 0, pending: 0 }, 
    labs: { total: 0, verified: 0, pending: 0 } 
  });
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for articles (loaded from DB)
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchStats();
    fetchPendingApprovals();
    fetchArticles();

    // Polling: Refresh pending approvals every 30 seconds
    console.log("[ADMIN] Initializing polling for new registrations...");
    const interval = setInterval(() => {
       console.log("[ADMIN] Auto-refreshing pending list...");
       fetchPendingApprovals();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('Article')
        .select(`
          *,
          author:Profile(name, surname)
        `)
        .order('publishDate', { ascending: false });

      if (error) throw error;

      // Map DB article to UI Article type
      const mappedArticles: Article[] = (data || []).map((art: any) => ({
        id: art.id,
        title: art.title,
        subtitle: art.subtitle || '',
        intro: art.intro || '',
        subcategories: art.subcategories || '',
        tags: art.tags || '',
        content: art.content,
        category: art.category || 'General',
        author: art.author ? `${art.author.name} ${art.author.surname || ''}` : 'Anónimo',
        status: (art.status as any) || 'published',
        publishDate: new Date(art.publishDate).toLocaleDateString(),
        views: art.views || 0,
        image: art.image || ''
      }));

      setArticles(mappedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

    const saveArticle = async (articleData: Partial<Article>) => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("Debes estar autenticado.");

        // No incluimos el "id" para que la base de datos lo genere automáticamente en INSERT
        const payload = {
          title: articleData.title,
          subtitle: articleData.subtitle,
          intro: articleData.intro,
          subcategories: articleData.subcategories,
          tags: articleData.tags,
          content: articleData.content,
          category: articleData.category,
          image: articleData.image || 'https://images.unsplash.com/photo-1576091160550-217359f452d3?auto=format&fit=crop&w=800&q=80',
          status: articleData.status || 'draft',
          type: 'Admin' as any,
          authorId: userData.user.id
        };

        let error;
        if (editingArticle?.id && !editingArticle.id.startsWith('mock-')) {
          // Actualizar artículo existente
          const { error: updateError } = await supabase
            .from('Article')
            .update(payload)
            .eq('id', editingArticle.id);
          error = updateError;
        } else {
          // Crear nuevo artículo (el ID se genera automáticamente en el servidor)
          const { error: insertError } = await supabase
            .from('Article')
            .insert([payload]);
          error = insertError;
        }

        if (error) throw error;

        alert("Artículo guardado y publicado exitosamente.");
        await fetchArticles(); // Recargar lista real
        setCurrentView('articles');
        setEditingArticle(null);
      } catch (error: any) {
        console.error("Error al guardar:", error);
        alert("Error al guardar: " + (error.message || "Error desconocido"));
      } finally {
        setLoading(false);
      }
    };

  const fetchStats = async () => {
    try {
      // Don't set global loading true if we already have some data to prevent full-screen flickering
      // only set it if it's the first load
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setUsersCount(result.data);
      }
    } catch (error: any) {
      console.error("STATS FETCH FAILURE:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/pending-approvals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setPendingDoctors(result.data || []);
        }
      }
    } catch (error) {
      console.error("Network error fetching pending approvals:", error);
    }
    // We don't set global loading false here to avoid race conditions with fetchStats
  };

  const handleUpdateStatus = async (entityId: string, entityType: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/update-approval', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ entityId, entityType, status })
      });
      const result = await response.json();
      if (result.success) {
        setPendingDoctors(prev => prev.filter(item => item.id !== entityId));
        fetchStats(); // Update counters
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleApprove = (id: string, type: string) => {
    handleUpdateStatus(id, type, 'VERIFIED');
  };

  const handleReject = (id: string, type: string) => {
    handleUpdateStatus(id, type, 'REJECTED');
  };

  const handleArticleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que quieres eliminar este artículo permanentemente?")) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('Article').delete().eq('id', id);
      if (error) throw error;
      await fetchArticles();
    } catch (error: any) {
       console.error("Error deleting article:", error);
       alert("Error al eliminar: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Layout Components ---

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 flex flex-col hidden lg:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-lg">
          <ShieldCheck size={24} />
        </div>
        <div>
           <h1 className="font-bold text-gray-900 leading-none">Dr. Goyo</h1>
           <span className="text-[10px] text-primary font-bold tracking-widest uppercase">Master Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavButton view="overview" icon={LayoutDashboard} label="Panel Central" />
        <NavButton view="approvals" icon={CheckCircle} label="Verificaciones" badge={pendingDoctors.length} />
        <NavButton view="articles" icon={FileText} label="Textos Sugeridos" />
        <NavButton view="glossary" icon={Book} label="Glosario Médico" />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );

  const NavButton = ({ view, icon: Icon, label, badge }: { view: AdminView, icon: any, label: string, badge?: number }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setEditingArticle(null);
      }}
      className={`
        w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all
        ${currentView === view || (view === 'articles' && currentView === 'editor')
          ? 'bg-gray-900 text-white shadow-md' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} />
        {label}
      </div>
      {badge ? (
        <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full">{badge}</span>
      ) : null}
    </button>
  );

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest">Dashboard de Métricas KPIs</h3>
         <button 
          onClick={fetchStats}
          disabled={loading}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
         >
            <Activity size={14} className={loading ? "animate-spin" : ""} /> 
            {loading ? "Actualizando..." : "Actualizar Indicadores"}
         </button>
      </div>

      {/* Primary KPI Row - Fixed height to avoid shaking/layout shift */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[140px]">
        {/* Patients Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md h-full">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Total Pacientes</p>
            <h3 className="text-3xl font-black text-gray-900 leading-none mt-1">
              {loading && usersCount.patients === 0 ? "..." : usersCount.patients}
            </h3>
          </div>
        </div>

        {/* Doctors Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-teal-50 text-teal-600 flex-shrink-0">
              <Briefcase size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Médicos Registrados</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none mt-1">{usersCount.doctors.total}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Aprobados</p>
              <p className="text-sm font-black text-teal-600">{usersCount.doctors.verified}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Pendientes</p>
              <p className="text-sm font-black text-amber-500">{usersCount.doctors.pending}</p>
            </div>
          </div>
        </div>

        {/* Pharmacies Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600 flex-shrink-0">
              <Building size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Farmacias Activas</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none mt-1">{usersCount.pharmacies.total}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Activas</p>
              <p className="text-sm font-black text-purple-600">{usersCount.pharmacies.verified}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Pendientes</p>
              <p className="text-sm font-black text-amber-500">{usersCount.pharmacies.pending}</p>
            </div>
          </div>
        </div>

        {/* Labs Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-indigo-50 text-indigo-600 flex-shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-wider">Laboratorios</p>
              <h3 className="text-3xl font-black text-gray-900 leading-none mt-1">{usersCount.labs.total}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-gray-50">
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Listos</p>
              <p className="text-sm font-black text-indigo-600">{usersCount.labs.verified}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Pendientes</p>
              <p className="text-sm font-black text-amber-500">{usersCount.labs.pending}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Footer */}
      <div className="bg-gray-900 rounded-3xl p-8 text-white overflow-hidden relative shadow-xl shadow-gray-200">
         <div className="relative z-10">
            <h4 className="text-xl font-bold mb-2">Resumen Operativo</h4>
            <p className="text-gray-400 text-sm max-w-md leading-relaxed">
               Actualmente hay <span className="text-amber-400 font-black">{(usersCount.doctors.pending || 0) + (usersCount.pharmacies.pending || 0) + (usersCount.labs.pending || 0)} profesionales</span> esperando revisión de credenciales. 
               Diríjase al módulo de Verificaciones para gestionar las solicitudes.
            </p>
         </div>
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <ShieldCheck size={120} />
         </div>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <VerificationPanel 
      pendingItems={pendingDoctors} 
      onApprove={handleApprove} 
      onReject={handleReject} 
    />
  );

  const renderArticles = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex justify-between items-center px-4">
          <div>
             <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Textos Sugeridos</h2>
             <p className="text-sm text-gray-500">Gestión de contenido educativo y noticias para pacientes.</p>
          </div>
          <Button 
              label="Redactar Nuevo Contenido" 
              icon={Plus} 
              className="bg-gray-900 text-white shadow-lg"
              onClick={() => { 
                try {
                  console.log("[ACTION] Opening Editor for new article...");
                  setEditingArticle(null); 
                  setCurrentView('editor'); 
                } catch (e) {
                  alert("Error al abrir el editor: " + e);
                }
              }}
          />
       </div>

       {loading && articles.length === 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <div key={article.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
                 <div className="h-40 relative overflow-hidden">
                    <img src={article.image} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase text-primary shadow-sm border border-white">
                       {article.category}
                    </div>
                 </div>
                 <div className="p-5 flex-1 flex flex-col">
                    <h4 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{article.title}</h4>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2 leading-relaxed">{article.intro || article.subtitle}</p>
                    <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <Eye size={14} className="text-gray-400" />
                          <span className="text-xs font-bold text-gray-400">{article.views} lecturas</span>
                       </div>
                       <div className="flex gap-1">
                          <button 
                            onClick={() => { setEditingArticle(article); setCurrentView('editor'); }}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                             <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleArticleDelete(article.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))}
         </div>
       )}
    </div>
  );

  const renderEditor = () => (
    <ContentEditor 
      article={editingArticle}
      onSave={saveArticle}
      onCancel={() => setCurrentView('articles')}
    />
  );

  return (
    <div className="min-h-screen bg-gray-bg flex font-sans">
      <Sidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
           <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">
                 {currentView === 'overview' ? 'Resumen Maestro' : 
                  currentView === 'approvals' ? 'Aprobaciones' :
                  currentView === 'articles' ? 'Textos Sugeridos' :
                  currentView === 'editor' ? 'Editor de Contenido' : 'Glosario'}
              </h2>
           </div>
           
           <div className="flex items-center gap-6">
              <button className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                 <Bell size={20} />
                 {pendingDoctors.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full border border-white pulse"></span>
                 )}
              </button>
              <div className="h-8 w-px bg-gray-100"></div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <p className="text-sm font-black text-gray-900 leading-none">MASTER ADMIN</p>
                    <p className="text-[10px] text-primary font-bold uppercase mt-1">Nivel: Superusuario</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white ring-2 ring-gray-100">
                    <ShieldCheck size={20} />
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 p-8">
           {currentView === 'overview' && renderOverview()}
           {currentView === 'approvals' && renderApprovals()}
           {currentView === 'articles' && renderArticles()}
           {currentView === 'editor' && renderEditor()}
           {currentView === 'glossary' && <GlossaryManager />}
        </main>
      </div>
    </div>
  );
};