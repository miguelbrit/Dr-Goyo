import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FileText, Book, Settings, LogOut, 
  Plus, Search, Bell, ChevronDown, Edit3, Trash2, Eye, Save, UploadCloud,
  CheckCircle, Users, X, ShieldCheck, Activity, Building, Truck, Briefcase
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Article, GlossaryTerm } from '../types';
import { supabase } from '../supabase';

// --- Types ---
type AdminView = 'overview' | 'approvals' | 'articles' | 'glossary' | 'media' | 'editor';

interface LibraryAdminScreenProps {
  onLogout: () => void;
}

export const LibraryAdminScreen: React.FC<LibraryAdminScreenProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [usersCount, setUsersCount] = useState({ patients: 0, doctors: 0, pharmacies: 0, labs: 0 });
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State for articles (loaded from DB)
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    fetchStats();
    fetchPendingApprovals();
    fetchArticles();
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
          content: articleData.content,
          category: articleData.category,
          image: articleData.image,
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
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Current User ID for Stats:", user?.id);

      const [
        resP, resD, resPh, resL
      ] = await Promise.all([
        supabase.from('Patient').select('*', { count: 'exact', head: true }),
        supabase.from('Doctor').select('*', { count: 'exact', head: true }),
        supabase.from('Pharmacy').select('*', { count: 'exact', head: true }),
        supabase.from('Laboratory').select('*', { count: 'exact', head: true })
      ]);

      console.log("Stats results:", { resP, resD, resPh, resL });

      setUsersCount({
        patients: resP.count || 0,
        doctors: resD.count || 0,
        pharmacies: resPh.count || 0,
        labs: resL.count || 0
      });
      console.log("Real-time stats loaded:", { 
        patients: resP.count, 
        doctors: resD.count, 
        pharmacies: resPh.count, 
        labs: resL.count 
      });
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching real-time stats from Supabase:", error);
      // Detailed error log for the user to see in F12
      alert("Error al cargar estadísticas reales: " + (error.message || "Error de conexión"));
      setLoading(false);
    }
  };

  const fetchPendingApprovals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/pending-approvals', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (result.success) {
        setPendingDoctors(result.data); // This now includes all entities
      }
    } catch (error) {
      console.error("Error fetching pending:", error);
    }
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

  const handleArticleDelete = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
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

  const OverviewView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
         <h3 className="text-gray-500 text-sm font-bold uppercase tracking-widest">Estado del Sistema</h3>
         <button 
          onClick={fetchStats}
          disabled={loading}
          className="text-xs font-bold text-primary flex items-center gap-1 hover:underline"
         >
           <Activity size={14} className={loading ? "animate-spin" : ""} /> 
           {loading ? "Actualizando..." : "Actualizar Datos Reales"}
         </button>
      </div>
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Pacientes', value: usersCount.patients, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Médicos', value: usersCount.doctors, icon: Briefcase, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Farmacias', value: usersCount.pharmacies, icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Laboratorios', value: usersCount.labs, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Approvals Quick View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <CheckCircle className="text-primary" size={20} /> Médicos por Verificar
              </h3>
              <button 
                onClick={() => setCurrentView('approvals')}
                className="text-xs font-bold text-primary hover:underline"
              >
                 Ver todos
              </button>
           </div>
            <div className="space-y-4">
               {pendingDoctors.length > 0 ? pendingDoctors.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                     <div className="flex items-center gap-3">
                        <Avatar src={item.profile?.imageUrl} alt="User" size="sm" />
                        <div>
                           <p className="text-sm font-bold text-gray-900">{item.profile?.name} {item.profile?.surname || item.business_name || item.businessName}</p>
                           <p className="text-xs text-gray-500 font-medium text-primary">{item.entityType}</p>
                        </div>
                     </div>
                     <button 
                       onClick={() => handleApprove(item.id, item.entityType)}
                       className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-green-600 hover:bg-green-50 transition-colors"
                     >
                        Aprobar
                     </button>
                  </div>
               )) : (
                <p className="text-center text-gray-400 py-8 text-sm italic">No hay solicitudes pendientes</p>
              )}
           </div>
        </div>

        {/* Recent Suggested Texts View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                 <FileText className="text-blue-500" size={20} /> Textos Sugeridos Recientes
              </h3>
           </div>
           <div className="space-y-3">
              {articles.map(art => (
                 <div key={art.id} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                       <img src={art.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                       <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{art.title}</span>
                    </div>
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { setEditingArticle(art); setCurrentView('editor'); }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                       >
                         <Edit3 size={16} />
                       </button>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  const ApprovalsView = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in">
       <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-lg">Verificación de Cuentas Profesionales</h3>
          <p className="text-sm text-gray-500">Revisa las credenciales de los nuevos médicos antes de activar su perfil público.</p>
       </div>
       <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
             <tr>
                <th className="p-4">Profesional</th>
                <th className="p-4">Especialidad & Cédula</th>
                <th className="p-4">Ubicación</th>
                <th className="p-4">Documentos</th>
                <th className="p-4 text-right">Acciones</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {pendingDoctors.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                   <td className="p-4">
                      <div className="flex items-center gap-3">
                         <Avatar src={item.profile?.imageUrl} alt="User" />
                         <div>
                            <p className="font-bold text-gray-900">{item.profile?.name} {item.profile?.surname || item.business_name || item.businessName}</p>
                            <p className="text-xs text-gray-500">{item.profile?.email}</p>
                         </div>
                      </div>
                   </td>
                   <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">{item.entityType}</p>
                      <p className="text-xs text-primary font-bold">{item.specialty || 'Comercial'}</p>
                   </td>
                   <td className="p-4">
                      <p className="text-sm text-gray-600">{item.city || 'No especificada'}</p>
                   </td>
                   <td className="p-4">
                      <div className="flex gap-2">
                         <button className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 uppercase">Ver Datos</button>
                      </div>
                   </td>
                   <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button 
                            onClick={() => handleApprove(item.id, item.entityType)}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-green-700 active:scale-95 transition-all"
                         >
                            Aprobar
                         </button>
                         <button 
                            onClick={() => handleReject(item.id, item.entityType)}
                            className="bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50 transition-all"
                         >
                            Rechazar
                         </button>
                      </div>
                   </td>
                </tr>
             ))}
             {pendingDoctors.length === 0 && (
                <tr>
                   <td colSpan={5} className="p-12 text-center text-gray-400 italic">No hay solicitudes de verificación pendientes en este momento.</td>
                </tr>
             )}
          </tbody>
       </table>
    </div>
  );

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/upload-content', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setUploadStatus({ type: 'success', message: 'Archivo procesado y guardado como texto sugerido.' });
        // Refresh articles if we had them from DB
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Error al procesar archivo' });
      }
    } catch (error) {
       setUploadStatus({ type: 'error', message: 'Error de red al subir archivo' });
    } finally {
      setUploading(false);
    }
  };

  const ArticlesView = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
             <h2 className="text-2xl font-bold text-gray-900">Textos Sugeridos</h2>
             <p className="text-sm text-gray-500">Gestión de contenido educativo y noticias para pacientes.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept=".txt,.pdf,.docx"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              <label 
                htmlFor="file-upload" 
                className={`flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm font-bold cursor-pointer hover:border-primary hover:text-primary transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <UploadCloud size={18} />
                {uploading ? 'Procesando...' : 'Subir Documento (PDF/TXT)'}
              </label>
            </div>
            <Button 
               label="Redactar Nuevo Texto" 
               icon={Plus} 
               onClick={() => { setEditingArticle(null); setCurrentView('editor'); }}
            />
          </div>
       </div>

       {uploadStatus && (
         <div className={`p-4 rounded-xl flex items-center justify-between animate-in slide-in-from-top-2 ${uploadStatus.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
           <span className="text-sm font-bold">{uploadStatus.message}</span>
           <button onClick={() => setUploadStatus(null)}><X size={16} /></button>
         </div>
       )}

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
             <div key={article.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col group">
                <div className="h-40 relative">
                   <img src={article.image} alt="" className="w-full h-full object-cover" />
                   <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black uppercase text-primary">
                      {article.category}
                   </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                   <h4 className="font-bold text-gray-900 leading-tight mb-2 group-hover:text-primary transition-colors">{article.title}</h4>
                   <p className="text-xs text-gray-500 mb-4 line-clamp-2">{article.subtitle}</p>
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
    </div>
  );

  const EditorView = () => {
    const editorRef = React.useRef<HTMLDivElement>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    const execCommand = (command: string, value: string = '') => {
      document.execCommand(command, false, value);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean = false) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validation
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        alert("Formato no permitido. Solo JPG, PNG o WEBP.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert("El archivo es demasiado grande. Máximo 2MB.");
        return;
      }

      setUploadingImage(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error("No hay sesión activa. Inicia sesión de nuevo.");

        const userId = userData.user.id;
        const timestamp = Date.now();
        const fileName = `${userId}/${timestamp}_${file.name.replace(/\s/g, '_')}`;
        const filePath = `images/${fileName}`;

        console.log("Uploading file to path:", filePath);

        const { error: uploadError } = await supabase.storage
          .from('master-content')
          .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('master-content')
          .getPublicUrl(filePath);

        if (isFeatured) {
          // Update featured image
          setEditingArticle(prev => prev ? { ...prev, image: publicUrl } : null);
        } else {
          // Insert Image into ContentEditable
          if (editorRef.current) {
            editorRef.current.focus();
            const imgHtml = `<img src="${publicUrl}" alt="Contenido" class="max-w-full h-auto rounded-xl my-6 shadow-md block mx-auto" />`;
            document.execCommand('insertHTML', false, imgHtml);
          }
        }
      } catch (error: any) {
        console.error("Error uploading image:", error);
        alert(`Error al subir imagen: ${error.message || 'Error de conexión con Supabase Storage'}`);
      } finally {
        setUploadingImage(false);
      }
    };

    const [title, setTitle] = useState(editingArticle?.title || '');
    const [subtitle, setSubtitle] = useState(editingArticle?.subtitle || '');
    const [category, setCategory] = useState(editingArticle?.category || 'General');
    const [status, setStatus] = useState<Article['status']>(editingArticle?.status || 'draft');

    useEffect(() => {
      if (editorRef.current && editingArticle?.content) {
        editorRef.current.innerHTML = editingArticle.content;
      }
    }, []);

    const handleSave = () => {
      saveArticle({
        title: title || '',
        subtitle: subtitle || '',
        category,
        status,
        content: editorRef.current?.innerHTML || '',
        image: editingArticle?.image
      });
    };
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
         <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-20 z-10">
            <button 
               onClick={() => setCurrentView('articles')}
               className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-2"
            >
               <X size={18} /> Cancelar
            </button>
            <div className="flex gap-3">
               <Button 
                  label={editingArticle ? "Actualizar Texto" : "Guardar y Publicar"} 
                  icon={Save} 
                  className="bg-gray-900 text-white"
                  onClick={handleSave}
               />
            </div>
         </div>
         <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft space-y-8">
            {/* Header Editor */}
            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Contenido Sugerido</label>
               <input 
                  type="text" 
                  placeholder="Título Impactante..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-4xl font-heading font-black text-gray-900 placeholder:text-gray-200 border-none focus:ring-0 p-0"
               />
               <textarea 
                  placeholder="Introducción breve para captar atención..." 
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full text-lg text-gray-500 placeholder:text-gray-200 border-none focus:ring-0 p-0 resize-none h-20"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Categoría</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg text-sm p-2 focus:ring-1 focus:ring-gray-900 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Nutrición">Nutrición</option>
                  <option value="Cardiología">Cardiología</option>
                  <option value="Dermatología">Dermatología</option>
                  <option value="Pediatría">Pediatría</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Estado</label>
                <select 
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-lg text-sm p-2 focus:ring-1 focus:ring-gray-900 outline-none"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicar Ahora</option>
                </select>
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-50 rounded-xl border border-gray-100 sticky top-[148px] z-10">
               <button onClick={() => execCommand('formatBlock', 'H1')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 font-bold text-xs px-3">H1</button>
               <button onClick={() => execCommand('formatBlock', 'H2')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 font-bold text-xs px-3">H2</button>
               <button onClick={() => execCommand('bold')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200"><Edit3 size={16} className="font-bold" /></button>
               <button onClick={() => execCommand('italic')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 italic font-serif">I</button>
               <button onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 px-3">List</button>
               <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
               <button onClick={() => execCommand('justifyLeft')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200">Left</button>
               <button onClick={() => execCommand('justifyCenter')} className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200">Center</button>
               <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
               <button 
                  onClick={() => fileInputRef.current?.click()} 
                  disabled={uploadingImage}
                  className="p-2 hover:bg-white rounded border border-transparent hover:border-gray-200 flex items-center gap-2 text-xs font-bold"
               >
                  {uploadingImage ? <span className="animate-spin text-primary">●</span> : <UploadCloud size={16} />} 
                  Insertar Imagen
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => handleImageUpload(e, false)} 
                  accept="image/*" 
                  className="hidden" 
               />
            </div>
 
            <div 
              className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden group cursor-pointer relative"
            >
               {editingArticle?.image ? (
                  <img src={editingArticle.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
               ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                     <UploadCloud size={48} className="mb-2 opacity-50" />
                     <span className="font-bold">Imagen de Portada</span>
                     <span className="text-xs mb-4 text-center px-4">Haz clic para subir o arrastra una imagen (1200x675 px)</span>
                     <Button 
                        label="Seleccionar Imagen" 
                        onClick={(e) => {
                          e.stopPropagation();
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (ev: any) => handleImageUpload(ev, true);
                          input.click();
                        }}
                     />
                  </div>
               )}
               {editingArticle?.image && (
                 <div className="absolute top-4 right-4 animate-in fade-in">
                   <Button 
                    label="Cambiar Portada" 
                    icon={UploadCloud}
                    className="bg-white/90 backdrop-blur-sm text-gray-900 border-none shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (ev: any) => handleImageUpload(ev, true);
                      input.click();
                    }}
                   />
                 </div>
               )}
            </div>

            <div 
               ref={editorRef}
               contentEditable
               suppressContentEditableWarning
               className="w-full min-h-[500px] text-gray-800 leading-relaxed text-lg border-none focus:ring-0 p-0 outline-none rich-editor"
               onInput={() => {}} // dummy to allow contentEditable with React
            />
         </div>
      </div>
    );
  };

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
           {currentView === 'overview' && <OverviewView />}
           {currentView === 'approvals' && <ApprovalsView />}
           {currentView === 'articles' && <ArticlesView />}
           {currentView === 'editor' && <EditorView />}
           {/* glossary view simplified for now */}
           {currentView === 'glossary' && (
             <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400 font-medium italic">
               Módulo de Glosario en construcción...
             </div>
           )}
        </main>
      </div>
    </div>
  );
};