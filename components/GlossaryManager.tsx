import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Eye, Save, X, 
  BookOpen, Pill, Activity, ClipboardList, Filter,
  ChevronDown, CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../supabase';
import { GlossaryItem } from '../types';
import { Button } from './Button';

export const GlossaryManager: React.FC = () => {
  const [items, setItems] = useState<GlossaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MEDICINE' | 'PATHOLOGY' | 'PRE_OP_LIST'>('ALL');
  const [formData, setFormData] = useState<Partial<GlossaryItem>>({
    term: '',
    type: 'MEDICINE',
    description: '',
    category: '',
    status: 'DRAFT'
  });

  useEffect(() => {
    fetchItems();
  }, [typeFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      let query = supabase.from('GlossaryItem').select('*').order('term');
      
      if (typeFilter !== 'ALL') {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching glossary items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.term || !formData.description) {
      alert('Término y descripción son obligatorios');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        term: formData.term,
        type: formData.type,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      let error;
      if (formData.id) {
        const { error: updateError } = await supabase
          .from('GlossaryItem')
          .update(payload)
          .eq('id', formData.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('GlossaryItem')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      
      setIsEditing(false);
      setFormData({ term: '', type: 'MEDICINE', description: '', category: '', status: 'DRAFT' });
      fetchItems();
    } catch (error: any) {
      alert('Error al guardar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas eliminar este ítem?')) return;
    try {
      setLoading(true);
      const { error } = await supabase.from('GlossaryItem').delete().eq('id', id);
      if (error) throw error;
      fetchItems();
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MEDICINE': return <Pill size={18} className="text-blue-500" />;
      case 'PATHOLOGY': return <Activity size={18} className="text-red-500" />;
      case 'PRE_OP_LIST': return <ClipboardList size={18} className="text-teal-500" />;
      default: return <BookOpen size={18} />;
    }
  };

  const filteredItems = items.filter(item => 
    item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isEditing) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-50">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            {formData.id ? <Edit3 className="text-primary" /> : <Plus className="text-primary" />}
            {formData.id ? 'Editar Término' : 'Nuevo Término del Glosario'}
          </h2>
          <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Término / Nombre</label>
              <input 
                type="text"
                placeholder="Ej: Amoxicilina, Diabetes..."
                value={formData.term}
                onChange={e => setFormData({...formData, term: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Tipo de Contenido</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/10 appearance-none"
              >
                <option value="MEDICINE">Medicamento</option>
                <option value="PATHOLOGY">Patología</option>
                <option value="PRE_OP_LIST">Lista Pre-Operatoria</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Categoría / Especialidad</label>
              <input 
                type="text"
                placeholder="Ej: Antibiótico, Endocrinología..."
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Estado</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 'DRAFT'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.status === 'DRAFT' ? 'bg-amber-100 text-amber-700 ring-2 ring-amber-200' : 'bg-gray-50 text-gray-400'}`}
                >
                  Borrador
                </button>
                <button 
                  type="button"
                  onClick={() => setFormData({...formData, status: 'PUBLISHED'})}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${formData.status === 'PUBLISHED' ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-200' : 'bg-gray-50 text-gray-400'}`}
                >
                  Publicado
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest block">Descripción Completa</label>
            <textarea 
              placeholder="Escribe la descripción, dosis, síntomas o pasos del proceso..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 h-48 resize-none leading-relaxed"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              label="Guardar Término" 
              icon={Save} 
              fullWidth 
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white shadow-xl shadow-gray-200"
            />
            <button 
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-8 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Glosario Médico</h2>
          <p className="text-sm text-gray-500 text-balance">Administra la base de conocimientos de medicamentos, patologías y guías pre-operatorias.</p>
        </div>
        <Button 
          label="Nuevo Término" 
          icon={Plus} 
          onClick={() => {
            setFormData({ term: '', type: 'MEDICINE', description: '', category: '', status: 'DRAFT' });
            setIsEditing(true);
          }}
          className="bg-gray-900 text-white shadow-lg shadow-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 sticky top-24">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Buscar término..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-2 pb-2 block">Filtrar por Tipo</label>
              {[
                { id: 'ALL', label: 'Todos', icon: BookOpen },
                { id: 'MEDICINE', label: 'Medicinas', icon: Pill },
                { id: 'PATHOLOGY', label: 'Patologías', icon: Activity },
                { id: 'PRE_OP_LIST', label: 'Pre-Op', icon: ClipboardList },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setTypeFilter(type.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${typeFilter === type.id ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <type.icon size={16} />
                    {type.label}
                  </div>
                  {typeFilter === type.id && <ChevronDown size={14} className="-rotate-90" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List Content */}
        <div className="lg:col-span-3">
          {loading && items.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-3xl animate-pulse" />)}
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft group hover:shadow-xl transition-all duration-500 border-l-4 border-l-transparent hover:border-l-primary">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-xl">
                        {getTypeIcon(item.type)}
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${item.status === 'PUBLISHED' ? 'bg-teal-50 text-teal-600' : 'bg-amber-50 text-amber-600'}`}>
                        {item.status === 'PUBLISHED' ? 'Publicado' : 'Borrador'}
                      </span>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setFormData(item); setIsEditing(true); }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{item.term}</h4>
                  <p className="text-xs text-primary font-bold mb-3 uppercase tracking-wider">{item.category}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-200">
                <Search size={32} />
              </div>
              <div>
                <p className="text-gray-900 font-bold">No se encontraron términos</p>
                <p className="text-sm text-gray-400">Intenta con otra búsqueda o filtro.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
