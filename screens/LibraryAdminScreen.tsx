import React, { useState } from 'react';
import { 
  LayoutDashboard, FileText, Image as ImageIcon, Book, Settings, LogOut, 
  Plus, Search, Bell, ChevronDown, Edit3, Trash2, Eye, Save, UploadCloud,
  CheckCircle, MoreHorizontal, BarChart2, TrendingUp, Users, X
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Article, GlossaryTerm } from '../types';

// --- Dummy Data ---

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Avances en el tratamiento de la Hipertensión',
    subtitle: 'Nuevas guías clínicas para el 2024 enfocadas en prevención.',
    category: 'Cardiología',
    specialty: 'Cardiólogo',
    author: 'Dr. Goyo Editorial',
    status: 'published',
    publishDate: '12 May, 2024',
    views: 1240,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '2',
    title: 'Nutrición esencial para diabéticos',
    subtitle: 'Cómo balancear los carbohidratos sin sacrificar el sabor.',
    category: 'Nutrición',
    specialty: 'Nutricionista',
    author: 'Dra. Ana Silva',
    status: 'published',
    publishDate: '10 May, 2024',
    views: 890,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: '3',
    title: 'Síntomas tempranos del Alzheimer',
    subtitle: 'Identificación y protocolos de actuación temprana.',
    category: 'Neurología',
    specialty: 'Neurólogo',
    author: 'Dr. Goyo Editorial',
    status: 'draft',
    publishDate: '-',
    views: 0,
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=300'
  }
];

const MOCK_GLOSSARY: GlossaryTerm[] = [
  { id: '1', term: 'Bradicardia', definition: 'Ritmo cardíaco más lento de lo normal.', specialty: 'Cardiología' },
  { id: '2', term: 'Cefalea', definition: 'Dolor de cabeza intenso y persistente.', specialty: 'Neurología' },
  { id: '3', term: 'Insulina', definition: 'Hormona producida por el páncreas que regula la glucosa.', specialty: 'Endocrinología' },
];

const SPECIALTIES = [
  'Cardiólogo', 'Nutricionista', 'Neurólogo', 'Pediatra', 'Ginecólogo', 'Hematólogo', 'Neumonólogo', 'Endocrinólogo', 'General'
];

interface LibraryAdminScreenProps {
  onLogout: () => void;
}

type AdminView = 'overview' | 'articles' | 'editor' | 'glossary' | 'media';

export const LibraryAdminScreen: React.FC<LibraryAdminScreenProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminView>('overview');
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // --- Layout Components ---

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-50 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center text-white font-bold font-heading">
          G
        </div>
        <div>
           <h1 className="font-bold text-gray-900 leading-none">Dr. Goyo</h1>
           <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">Editorial</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <NavButton view="overview" icon={LayoutDashboard} label="Resumen" />
        <NavButton view="articles" icon={FileText} label="Artículos" />
        <NavButton view="glossary" icon={Book} label="Glosario Médico" />
        <NavButton view="media" icon={ImageIcon} label="Multimedia" />
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button className="flex items-center gap-3 p-3 w-full text-gray-500 hover:bg-gray-50 rounded-lg transition-colors">
          <Settings size={20} />
          <span className="text-sm font-medium">Configuración</span>
        </button>
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 p-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );

  const NavButton = ({ view, icon: Icon, label }: { view: AdminView, icon: any, label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setEditingArticle(null);
      }}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
        ${currentView === view || (view === 'articles' && currentView === 'editor')
          ? 'bg-gray-100 text-secondary' 
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}
      `}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  const Header = () => (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
         <h2 className="text-lg font-bold text-gray-800 capitalize">
            {currentView === 'overview' ? 'Panel Principal' : 
             currentView === 'articles' ? 'Gestión de Artículos' :
             currentView === 'editor' ? (editingArticle ? 'Editar Artículo' : 'Nuevo Artículo') :
             currentView === 'glossary' ? 'Glosario Médico' : 'Biblioteca de Medios'}
         </h2>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
           <input 
              type="text" 
              placeholder="Buscar..." 
              className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/20 w-64"
           />
        </div>
        <button className="relative text-gray-400 hover:text-gray-600">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
           <div className="text-right">
              <p className="text-sm font-bold text-gray-900">Admin Goyo</p>
              <p className="text-xs text-gray-500">Editor Jefe</p>
           </div>
           <Avatar src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="Admin" size="md" />
           <ChevronDown size={16} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
    </header>
  );

  // --- Views ---

  const OverviewView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Artículos Publicados', value: '142', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Borradores', value: '8', icon: Edit3, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Lecturas Totales', value: '45.2k', icon: Eye, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Conversión a Citas', value: '12%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-heading font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      {/* Top Articles Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
           <h3 className="font-bold text-lg text-gray-900">Artículos Más Leídos</h3>
           <button className="text-sm text-primary font-medium hover:underline">Ver reporte completo</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Artículo</th>
              <th className="p-4">Categoría</th>
              <th className="p-4">Lecturas</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_ARTICLES.slice(0, 2).map((art) => (
              <tr key={art.id} className="hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                     <img src={art.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                     <span className="font-medium text-gray-900">{art.title}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">{art.category}</td>
                <td className="p-4 font-bold text-gray-900">{art.views}</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full uppercase">Publicado</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const ArticlesView = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Todos</button>
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Publicados</button>
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Borradores</button>
        </div>
        <Button 
           label="Crear nuevo artículo" 
           icon={Plus} 
           onClick={() => {
             setEditingArticle(null);
             setCurrentView('editor');
           }}
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
             <tr>
               <th className="p-5">Artículo</th>
               <th className="p-5">Categoría & Especialidad</th>
               <th className="p-5">Estado</th>
               <th className="p-5">Fecha</th>
               <th className="p-5 text-right">Acciones</th>
             </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {MOCK_ARTICLES.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50/50 transition-colors group">
                   <td className="p-5">
                      <div className="flex items-center gap-4">
                         <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={article.image} alt="" className="w-full h-full object-cover" />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 text-sm">{article.title}</h4>
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">{article.subtitle}</p>
                         </div>
                      </div>
                   </td>
                   <td className="p-5">
                      <p className="text-sm font-medium text-gray-900">{article.category}</p>
                      <p className="text-xs text-primary">{article.specialty}</p>
                   </td>
                   <td className="p-5">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase flex w-fit items-center gap-1.5 ${
                         article.status === 'published' 
                           ? 'bg-green-50 text-green-700 border border-green-100' 
                           : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${article.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                         {article.status === 'published' ? 'Publicado' : 'Borrador'}
                      </span>
                   </td>
                   <td className="p-5 text-sm text-gray-500">
                      {article.publishDate}
                   </td>
                   <td className="p-5 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            onClick={() => {
                              setEditingArticle(article);
                              setCurrentView('editor');
                            }}
                         >
                            <Edit3 size={18} />
                         </button>
                         <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 size={18} />
                         </button>
                      </div>
                   </td>
                </tr>
             ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const EditorView = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
         <button 
            onClick={() => setCurrentView('articles')}
            className="text-gray-500 hover:text-gray-900 text-sm font-medium flex items-center gap-1"
         >
            ← Volver a la lista
         </button>
         <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 shadow-sm">
               Guardar Borrador
            </button>
            <Button label="Publicar Artículo" icon={CheckCircle} />
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Editor */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
               <div className="space-y-4">
                  <input 
                     type="text" 
                     placeholder="Título del Artículo" 
                     defaultValue={editingArticle?.title}
                     className="w-full text-3xl font-heading font-bold text-gray-900 placeholder:text-gray-300 border-none focus:ring-0 p-0"
                  />
                  <input 
                     type="text" 
                     placeholder="Subtítulo o descripción breve..." 
                     defaultValue={editingArticle?.subtitle}
                     className="w-full text-xl text-gray-500 placeholder:text-gray-300 border-none focus:ring-0 p-0"
                  />
               </div>

               {/* Cover Image Placeholder */}
               <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all relative overflow-hidden group">
                  {editingArticle?.image ? (
                     <>
                        <img src={editingArticle.image} className="w-full h-full object-cover" alt="Cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <span className="text-white font-medium flex items-center gap-2"><ImageIcon/> Cambiar Imagen</span>
                        </div>
                     </>
                  ) : (
                     <>
                        <UploadCloud size={48} className="mb-2 opacity-50" />
                        <span className="font-medium">Subir imagen destacada</span>
                        <span className="text-xs mt-1">PNG, JPG hasta 5MB (Recomendado 1200x630)</span>
                     </>
                  )}
               </div>

               {/* Rich Text Simulator */}
               <div className="min-h-[400px] border-t border-gray-100 pt-6">
                  <div className="flex gap-2 mb-4 text-gray-400 border-b border-gray-100 pb-2">
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded">B</button>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded italic">I</button>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded underline">U</button>
                     <div className="w-px h-4 bg-gray-200 mx-1"></div>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded">H1</button>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded">H2</button>
                     <div className="w-px h-4 bg-gray-200 mx-1"></div>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded">Link</button>
                     <button className="p-1 hover:text-gray-900 hover:bg-gray-100 rounded">List</button>
                  </div>
                  <textarea 
                     className="w-full h-full min-h-[300px] resize-none border-none focus:ring-0 text-gray-700 leading-relaxed p-0"
                     placeholder="Escribe el contenido aquí..."
                     defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua..."
                  ></textarea>
               </div>
            </div>
         </div>

         {/* Sidebar Settings */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
               <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider">Configuración</h3>
               
               <Input label="Categoría" placeholder="Ej. Prevención" defaultValue={editingArticle?.category} />
               
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 font-sans">
                     Conexión con Especialidad
                  </label>
                  <div className="relative">
                     <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option value="">Seleccionar especialidad...</option>
                        {SPECIALTIES.map(s => (
                           <option key={s} value={s} selected={editingArticle?.specialty === s}>{s}</option>
                        ))}
                     </select>
                     <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">
                     * Esto conectará el artículo con médicos de esta especialidad en la app.
                  </p>
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Etiquetas</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                     <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        Salud <X size={10} className="cursor-pointer" />
                     </span>
                     <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        Prevención <X size={10} className="cursor-pointer" />
                     </span>
                  </div>
                  <input 
                     type="text" 
                     placeholder="Añadir etiqueta..." 
                     className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
               </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
               <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-full text-primary shadow-sm">
                     <Users size={20} />
                  </div>
                  <div>
                     <h4 className="font-bold text-gray-900 text-sm">Audiencia Estimada</h4>
                     <p className="text-xs text-blue-700 mt-1">Basado en la especialidad seleccionada, este artículo podría interesar a 2.4k pacientes.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );

  const GlossaryView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="lg:col-span-2 space-y-6">
         <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
               <h3 className="font-bold text-gray-900">Términos Médicos</h3>
               <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{MOCK_GLOSSARY.length} Términos</span>
            </div>
            <div className="divide-y divide-gray-100">
               {MOCK_GLOSSARY.map((term) => (
                  <div key={term.id} className="p-4 hover:bg-gray-50 transition-colors group">
                     <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 text-lg">{term.term}</h4>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="text-gray-400 hover:text-blue-600"><Edit3 size={16} /></button>
                           <button className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                     </div>
                     <p className="text-gray-600 text-sm mb-2">{term.definition}</p>
                     <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                        {term.specialty}
                     </span>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <div>
         <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Añadir Nuevo Término</h3>
            <div className="space-y-4">
               <Input label="Término" placeholder="Ej. Hiperglucemia" />
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Definición</label>
                  <textarea 
                     className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none h-32"
                     placeholder="Escribe una definición clara y breve..."
                  ></textarea>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidad</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                     {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
               </div>
               <Button label="Guardar Término" fullWidth icon={Save} />
            </div>
         </div>
      </div>
    </div>
  );

  const MediaView = () => (
    <div className="animate-in fade-in slide-in-from-bottom-4">
       <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-gray-900">Biblioteca de Imágenes</h3>
          <Button label="Subir Imágenes" icon={UploadCloud} variant="outline" />
       </div>
       
       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
             'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=300',
             'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=300',
             'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
             'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=300',
             'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=300',
             'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&q=80&w=300'
          ].map((src, i) => (
             <div key={i} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer">
                <img src={src} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                   <button className="p-2 bg-white rounded-full text-gray-900 hover:text-primary"><Edit3 size={16} /></button>
                   <button className="p-2 bg-white rounded-full text-gray-900 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
             </div>
          ))}
          
          <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 hover:border-gray-300 transition-colors cursor-pointer">
             <Plus size={32} />
             <span className="text-sm font-medium mt-2">Añadir más</span>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-bg flex font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
           {currentView === 'overview' && <OverviewView />}
           {currentView === 'articles' && <ArticlesView />}
           {currentView === 'editor' && <EditorView />}
           {currentView === 'glossary' && <GlossaryView />}
           {currentView === 'media' && <MediaView />}
        </main>
      </div>
    </div>
  );
};