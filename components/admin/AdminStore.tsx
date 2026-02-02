import React, { useState } from 'react';
import { useContent } from '../../ContentContext';
import { 
  ShoppingBag, Plus, Trash2, Edit3, Image as ImageIcon, 
  Package, Check, X, Clock, DollarSign, Phone, MapPin, User, MessageSquare
} from 'lucide-react';

const AdminStore: React.FC = () => {
  const { 
    products, addProduct, updateProduct, deleteProduct,
    orders, updateOrderStatus, refreshContent,
    reviews, deleteReview,
    sections, toggleSection
  } = useContent();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews' | 'settings'>('orders');

  const handleRefresh = async () => {
    if (confirm('Обновить данные из базы? Это перезапишет локальные изменения, если они не были сохранены.')) {
      await refreshContent();
    }
  };

  // Products State
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    image: '',
    category: '',
    description: '',
    isVisible: true,
    colors: [] as string[]
  });

  const handleSaveProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;

    if (editingProduct) {
      await updateProduct(editingProduct, newProduct);
      setEditingProduct(null);
    } else {
      await addProduct(newProduct);
    }

    setNewProduct({
      name: '',
      price: '',
      image: '',
      category: '',
      description: '',
      isVisible: true,
      colors: []
    });
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product.id);
    setNewProduct(product);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
      await deleteProduct(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'processing': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'processing': return 'В обработке';
      case 'completed': return 'Выполнен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Управление Магазином</h1>
          <p className="text-gray-400">Заказы, товары и настройки витрины</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl transition-colors border border-white/10 flex items-center gap-2"
        >
          <Clock className="w-4 h-4" />
          Обновить данные
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/5 rounded-xl w-fit border border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'orders' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Заказы ({orders?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'products' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Товары ({products?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'reviews' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Отзывы ({reviews?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'settings' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          Настройки
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">ID / Дата</th>
                    <th className="p-4 font-bold">Клиент</th>
                    <th className="p-4 font-bold">Состав заказа</th>
                    <th className="p-4 font-bold">Сумма</th>
                    <th className="p-4 font-bold">Статус</th>
                    <th className="p-4 font-bold">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 align-top">
                          <div className="font-mono text-xs text-gray-500 mb-1">#{order.id.slice(0, 8)}</div>
                          <div className="text-sm text-white font-medium">
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.date).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-white font-bold text-sm">
                              <User className="w-3 h-3 text-purple-400" />
                              {order.customerName}
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                              <Phone className="w-3 h-3" />
                              {order.customerPhone}
                            </div>
                            {order.address && (
                              <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <MapPin className="w-3 h-3" />
                                {order.address}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center gap-3 text-sm">
                                <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center text-xs font-bold text-gray-400">
                                  x{item.quantity}
                                </div>
                                <div>
                                  <div className="text-white font-medium">{item.productName}</div>
                                  <div className="text-xs text-gray-500">
                                    {item.color && <span className="inline-block w-2 h-2 rounded-full mr-1 align-middle" style={{backgroundColor: item.color}}></span>}
                                    {item.price} ₽
                                  </div>
                                </div>
                              </div>
                            ))}
                            {order.comment && (
                              <div className="text-xs text-yellow-500/80 bg-yellow-500/10 p-2 rounded border border-yellow-500/20 mt-2">
                                <span className="font-bold">Комментарий:</span> {order.comment}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            {order.total} ₽
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex flex-col gap-2">
                            {order.status === 'new' && (
                              <>
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'processing')}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-500/30 transition-colors"
                                >
                                  <Clock className="w-3 h-3" />
                                  В работу
                                </button>
                                <button 
                                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-bold rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                  Отменить
                                </button>
                              </>
                            )}
                            {order.status === 'processing' && (
                              <button 
                                onClick={() => updateOrderStatus(order.id, 'completed')}
                                className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg hover:bg-green-500/30 transition-colors"
                              >
                                <Check className="w-3 h-3" />
                                Завершить
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Заказов пока нет</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6 sticky top-6">
              <h4 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                {editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-gray-400 ml-1">Название товара</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Умная кормушка"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 ml-1">Цена (₽)</label>
                    <input
                      type="text"
                      value={newProduct.price}
                      onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                      placeholder="5000"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 ml-1">Категория</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                      placeholder="Аксессуары"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 ml-1">Ссылка на фото</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newProduct.image}
                      onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                      placeholder="https://..."
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors pr-10"
                    />
                    <ImageIcon className="absolute right-3 top-3.5 w-5 h-5 text-gray-600" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-400 ml-1">Описание</label>
                  <textarea
                    value={newProduct.description || ''}
                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                    placeholder="Описание товара..."
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.isVisible}
                      onChange={e => setNewProduct({...newProduct, isVisible: e.target.checked})}
                      className="w-4 h-4 rounded border-gray-600 bg-black/40 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">Показывать на сайте</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  {editingProduct && (
                    <button
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProduct({
                          name: '', price: '', image: '', category: '', description: '', isVisible: true, colors: []
                        });
                      }}
                      className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 font-bold hover:bg-white/5 transition-colors"
                    >
                      Отмена
                    </button>
                  )}
                  <button
                    onClick={handleSaveProduct}
                    disabled={!newProduct.name || !newProduct.price}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editingProduct ? 'Сохранить' : 'Добавить'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2 space-y-4">
            {products.map((product) => (
              <div 
                key={product.id}
                className="group flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-white/20 transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-black/40 overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{product.name}</h3>
                    {!product.isVisible && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold uppercase">
                        Скрыт
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-3">
                    <span className="text-cyan-400 font-bold">{product.price} ₽</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="truncate">{product.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                  <tr>
                    <th className="p-4 font-bold">Дата</th>
                    <th className="p-4 font-bold">Автор</th>
                    <th className="p-4 font-bold">Оценка</th>
                    <th className="p-4 font-bold">Текст</th>
                    <th className="p-4 font-bold w-20">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 align-top text-sm text-gray-400 whitespace-nowrap">
                          {review.date}
                        </td>
                        <td className="p-4 align-top">
                          <div className="font-bold text-white text-sm">{review.author}</div>
                        </td>
                        <td className="p-4 align-top">
                          <div className="flex items-center gap-1 text-yellow-400">
                            <span className="font-bold">{review.rating}</span>
                            <MessageSquare className="w-3 h-3 fill-current" />
                          </div>
                        </td>
                        <td className="p-4 align-top">
                          <p className="text-sm text-gray-300">{review.text}</p>
                        </td>
                        <td className="p-4 align-top">
                          <button 
                            onClick={() => {
                              if (confirm('Удалить этот отзыв?')) {
                                deleteReview(review.id);
                              }
                            }}
                            className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p>Отзывов пока нет</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-6">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-xl font-bold text-white mb-4">Настройки витрины</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${sections['store'] ? 'bg-purple-500/20 text-purple-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-white">Блок "Магазин" на главной</div>
                    <div className="text-sm text-gray-400">Отображать секцию товаров на главной странице сайта</div>
                  </div>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={sections['store'] !== undefined ? sections['store'] : true}
                    onChange={(e) => toggleSection('store', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm">
                <p>
                  <strong>Примечание:</strong> Выключение этого блока скроет весь магазин с главной страницы, 
                  но прямая ссылка на /store все равно будет работать. Чтобы скрыть отдельные товары, 
                  используйте переключатель "Показывать на сайте" при редактировании товара.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminStore;
