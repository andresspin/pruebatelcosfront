import { useState, useEffect } from 'react';
import api from './api';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Phone, 
  Mail, 
  User, 
  Tag,
  Loader2,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function App() {
  const [clients, setClients] = useState({ data: [], links: [] });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category_id: ''
  });

  useEffect(() => {
    fetchClients();
    fetchCategories();
  }, []);

  const fetchClients = async (url = '/clients') => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryId) params.category_id = categoryId;

      const response = await api.get(url, { params });
      setClients(response.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchClients();
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', category_id: '' });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone || '',
      category_id: client.category_id
    });
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, formData);
      } else {
        await api.post('/clients', formData);
      }
      setShowModal(false);
      fetchClients();
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        alert('Ocurrió un error al guardar el cliente.');
      }
    }
  };

  const deleteClient = async (id) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        alert('Error al eliminar cliente.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <User className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Prueba Clientes
            </h1>
          </div>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative md:w-64">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white transition-all"
              >
                <option value="">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-all active:scale-95"
            >
              Filtrar
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                        <span className="text-slate-500 font-medium">Cargando datos...</span>
                      </div>
                    </td>
                  </tr>
                ) : clients.data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No se encontraron clientes.
                    </td>
                  </tr>
                ) : (
                  clients.data.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                            {client.name.charAt(0)}
                          </div>
                          <div className="font-semibold text-slate-800">{client.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3 h-3" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone className="w-3 h-3" />
                              {client.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {client.category?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditModal(client)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteClient(client.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && clients.links && clients.links.length > 3 && (
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Mostrando <span className="font-semibold">{clients.from}</span> a <span className="font-semibold">{clients.to}</span> de <span className="font-semibold">{clients.total}</span> clientes
              </div>
              <div className="flex gap-2">
                {clients.links.map((link, i) => {
                  if (link.label.includes('Previous')) {
                    return (
                      <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => fetchClients(link.url.replace('http://prueba-clientes.test/api', ''))}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )
                  }
                  if (link.label.includes('Next')) {
                    return (
                      <button
                        key={i}
                        disabled={!link.url}
                        onClick={() => fetchClients(link.url.replace('http://prueba-clientes.test/api', ''))}
                        className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-all"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )
                  }
                  if (!isNaN(link.label)) {
                    return (
                      <button
                        key={i}
                        disabled={!link.url || link.active}
                        onClick={() => fetchClients(link.url.replace('http://prueba-clientes.test/api', ''))}
                        className={`w-8 h-8 rounded-lg border text-sm font-medium transition-all ${
                          link.active 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {link.label}
                      </button>
                    )
                  }
                  return null;
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Categoría</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                >
                  <option value="">Seleccione una categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="mt-1 text-xs text-red-500 font-medium">{errors.category_id[0]}</p>}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md shadow-indigo-200 transition-all active:scale-95"
                >
                  {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
