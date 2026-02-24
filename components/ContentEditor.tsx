import React, { useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { Save, X, Type, Tag, Layout, Hash, ChevronDown, Palette, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { Article } from '../types';

interface ContentEditorProps {
  article: Partial<Article> | null;
  onSave: (data: Partial<Article>) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'General', 'Nutrición', 'Cardiología', 'Dermatología', 
  'Pediatría', 'Ginecología', 'Psicología', 'Odontología'
];

export const ContentEditor: React.FC<ContentEditorProps> = ({ article, onSave, onCancel }) => {
  const [mounted, setMounted] = React.useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || '',
    intro: article?.intro || article?.subtitle || '',
    content: article?.content || '',
    category: article?.category || 'General',
    subcategories: article?.subcategories || '',
    tags: article?.tags || '',
    status: article?.status || 'draft',
    image: article?.image || ''
  });
  const [newCategory, setNewCategory] = useState('');
  const [showNewCatInput, setShowNewCatInput] = useState(false);
  
  React.useEffect(() => {
    console.log("[DEBUG] ContentEditor Mounted. Article ID:", article?.id || 'NEW');
    setMounted(true);
  }, [article]);

  if (!mounted) return (
    <div className="max-w-5xl mx-auto p-12 text-center animate-pulse">
      <div className="h-10 bg-gray-100 rounded-xl mb-4 w-1/4 mx-auto" />
      <div className="h-64 bg-gray-50 rounded-3xl" />
    </div>
  );

  // Quill configuration
  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }],
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline',
    'color', 'background',
    'list', 'bullet'
  ];

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert("El título es obligatorio.");
      return;
    }
    onSave({
      ...formData,
      subtitle: formData.intro // Sync subtitle for backward compatibility
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm sticky top-20 z-30 backdrop-blur-md bg-white/90">
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-900 text-sm font-bold flex items-center gap-2 transition-colors px-4 py-2 rounded-xl hover:bg-gray-50"
        >
          <X size={18} /> Cancelar Edición
        </button>
        <div className="flex gap-3">
          <Button 
            label={article?.id ? "Actualizar Contenido" : "Publicar Contenido"} 
            icon={Save} 
            className="bg-gray-900 text-white shadow-lg shadow-gray-900/10 hover:shadow-gray-900/20"
            onClick={handleSave}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-soft space-y-8">
            {/* Title Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <Type size={12} /> Título Impactante
              </div>
              <input 
                type="text" 
                placeholder="Escribe el título aquí..." 
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-4xl font-heading font-black text-gray-900 placeholder:text-gray-200 border-none focus:ring-0 p-0"
              />
            </div>

            {/* Intro Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                <Layout size={12} /> Introducción Breve
              </div>
              <textarea 
                placeholder="Un breve párrafo que resume el artículo y capta la atención..." 
                value={formData.intro}
                onChange={(e) => setFormData(prev => ({ ...prev, intro: e.target.value }))}
                className="w-full text-lg text-gray-600 placeholder:text-gray-200 border-2 border-gray-50 rounded-2xl focus:border-gray-200 focus:bg-gray-50/30 transition-all p-4 outline-none resize-none h-32 leading-relaxed"
              />
            </div>

            {/* Editor Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                  <Palette size={12} /> Contenido General del Artículo
                </div>
              </div>
              <div className="quill-wrapper border-2 border-gray-50 rounded-2xl overflow-hidden focus-within:border-gray-200 transition-all">
                <ReactQuill 
                  theme="snow"
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  modules={modules}
                  formats={formats}
                  placeholder="Escribe aquí el cuerpo del artículo..."
                  className="bg-white min-h-[400px]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Metadata & Image */}
        <div className="space-y-6">
          {/* Image Upload Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ImageIcon size={18} className="text-primary" /> Imagen de Portada
            </h3>
            
            <div className="relative group cursor-pointer">
              <div 
                className={`w-full h-48 rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center overflow-hidden transition-all group-hover:border-primary/30 ${formData.image ? 'border-none' : 'bg-gray-50'}`}
                onClick={() => document.getElementById('image-upload')?.click()}
              >
                {formData.image ? (
                  <>
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white">
                        <Camera size={24} />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto mb-3 text-gray-400">
                      <Camera size={20} />
                    </div>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Haz clic para subir</p>
                    <p className="text-xs text-gray-300 mt-1">Formatos sugeridos: JPG, PNG</p>
                  </div>
                )}
              </div>
              <input 
                id="image-upload"
                type="file" 
                accept="image/*"
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData(prev => ({ ...prev, image: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>
            {formData.image && (
              <button 
                onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                className="w-full text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors py-2"
              >
                Eliminar Fotografía
              </button>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft space-y-6">
            <h3 className="font-bold text-gray-900 border-b border-gray-50 pb-4">Configuración y Metadatos</h3>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Estado del Artículo</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicar Ahora</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Categoría Principal</label>
              <div className="relative">
                {!showNewCatInput ? (
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === 'ADD_NEW') setShowNewCatInput(true);
                        else setFormData(prev => ({ ...prev, category: e.target.value }));
                      }}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-gray-900/5 appearance-none transition-all"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      <option value="ADD_NEW">+ Agregar nueva...</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Nueva categoría..."
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none"
                    />
                    <button 
                      onClick={() => {
                        if (newCategory) {
                          setFormData(prev => ({ ...prev, category: newCategory }));
                          setShowNewCatInput(false);
                        }
                      }}
                      className="bg-gray-900 text-white p-3 rounded-xl hover:bg-black"
                    >
                      <Save size={18} />
                    </button>
                    <button 
                      onClick={() => setShowNewCatInput(false)}
                      className="bg-gray-100 text-gray-500 p-3 rounded-xl hover:bg-gray-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Subcategories */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block flex items-center gap-2">
                <Hash size={10} /> Subcategorías
              </label>
              <input 
                type="text"
                placeholder="Ej: Dieta, Ejercicio, Recetas..."
                value={formData.subcategories}
                onChange={(e) => setFormData(prev => ({ ...prev, subcategories: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
              />
              <p className="text-[9px] text-gray-400 italic">Separa por comas para múltiples entradas.</p>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block flex items-center gap-2">
                <Tag size={10} /> Etiquetas (Tags)
              </label>
              <input 
                type="text"
                placeholder="Ej: salud, bienestar, doctorgoyo..."
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900/5 transition-all"
              />
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
            <h4 className="text-amber-800 text-xs font-bold uppercase mb-2 flex items-center gap-2">
              Consejo de Redacción
            </h4>
            <p className="text-amber-900/70 text-xs leading-relaxed">
              Recuerda usar un lenguaje claro y acogedor. El Título debe ser accionable y la introducción debe resumir el valor que el paciente obtendrá al leer.
            </p>
          </div>
        </div>
      </div>
      
      {/* Global Quill Styles Overrides */}
      <style>{`
        .ql-container {
          font-family: inherit;
          font-size: 1.125rem;
          color: #1f2937;
        }
        .ql-toolbar.ql-snow {
          border: none;
          border-bottom: 1px solid #f3f4f6;
          padding: 8px 16px;
          background: #f9fafb;
        }
        .ql-container.ql-snow {
          border: none;
        }
        .ql-editor {
          min-height: 400px;
          padding: 24px;
        }
        .ql-editor.ql-blank::before {
          color: #e5e7eb;
          font-style: normal;
          left: 24px;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-header {
          width: 80px;
        }
      `}</style>
    </div>
  );
};
