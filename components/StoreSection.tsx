import React, { useState } from 'react';
import { useContent, Product } from '../ContentContext';
import { useLanguage } from '../LanguageContext';
import { ShoppingBag, ArrowLeft, Check, Minus, Plus, X, Star, User, Send } from 'lucide-react';

type StoreView = 'grid' | 'detail' | 'checkout' | 'success';

const StoreSection: React.FC = () => {
  const { t } = useLanguage();
  const { products, addOrder, reviews, addReview: addReviewToContext } = useContent();
  
  const [view, setView] = useState<StoreView>('grid');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Reviews State
  const [newReview, setNewReview] = useState({ author: '', text: '', rating: 5 });

  // Order State
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    comment: ''
  });

  // Filter only visible products
  const visibleProducts = (products || []).filter(p => p && p.isVisible);

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product);
    try {
      setSelectedProduct(product);
      const initialColor = product.colors && product.colors.length > 0 ? product.colors[0] : '';
      setSelectedColor(initialColor);
      setQuantity(1);
      setView('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error handling product click:', e);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.author || !newReview.text) return;
    
    await addReviewToContext({
      author: newReview.author,
      rating: newReview.rating,
      text: newReview.text
    });
    
    setNewReview({ author: '', text: '', rating: 5 });
  };

  const handleBuyNow = () => {
    setView('checkout');
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await addOrder({
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phone,
        address: formData.address,
        comment: formData.comment,
        items: [{
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: quantity,
          price: selectedProduct.price,
          color: selectedColor
        }],
        total: parseInt(selectedProduct.price) * quantity
      });
      
      setView('success');
    } catch (error) {
      console.error('Failed to submit order', error);
      alert('Ошибка при оформлении заказа');
    }
  };

  const resetStore = () => {
    setView('grid');
    setSelectedProduct(null);
    setQuantity(1);
    setFormData({ firstName: '', lastName: '', phone: '', address: '', comment: '' });
  };

  if (visibleProducts.length === 0) return null;

  return (
    <section id="store" className="py-24 relative overflow-hidden min-h-screen">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-full bg-cyan-900/10 blur-[100px] pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* VIEW: GRID */}
        {view === 'grid' && (
          <>
            <div className="mb-16 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                Market
              </div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                Наши <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">Товары</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                Лучшие товары для ваших питомцев. Игрушки, домики и многое другое.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
              {visibleProducts.map((product) => (
                <div 
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative rounded-xl md:rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image */}
                  <div className="aspect-square relative overflow-hidden bg-black/40">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ShoppingBag className="w-8 h-8 md:w-12 md:h-12 opacity-20" />
                      </div>
                    )}
                    
                    {/* Overlay Button */}
                    <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center backdrop-blur-sm">
                      <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold px-8 py-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg hover:shadow-cyan-500/25">
                        Купить
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 md:p-6">
                    <div className="text-[10px] md:text-xs text-cyan-400 font-bold mb-1 md:mb-2 uppercase tracking-wider opacity-80">
                      {product.category}
                    </div>
                    <h3 className="text-white font-bold text-sm md:text-xl mb-2 md:mb-3 leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-base md:text-2xl font-black text-white">
                        {product.price} ₽
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* VIEW: DETAIL */}
        {view === 'detail' && selectedProduct && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <button 
              onClick={() => setView('grid')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Назад в каталог</span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {/* Product Image */}
              <div className="aspect-square rounded-3xl overflow-hidden bg-black/40 border-2 border-white/10 relative">
                {selectedProduct.image ? (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ShoppingBag className="w-24 h-24 opacity-20" />
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col justify-center">
                <div className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-xs font-bold uppercase tracking-wider text-cyan-400 w-fit">
                  {selectedProduct.category}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-8">
                  {selectedProduct.price} ₽
                </div>
                
                <p className="text-gray-400 leading-relaxed mb-8 text-lg">
                  {selectedProduct.description || "Описание товара временно отсутствует. Но мы гарантируем отличное качество!"}
                </p>

                {/* Options */}
                <div className="space-y-6 mb-8 p-6 rounded-2xl bg-white/5 border border-white/10">
                  {/* Colors */}
                  {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                    <div>
                      <label className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 block">Цвет</label>
                      <div className="flex gap-3">
                        {selectedProduct.colors.map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-white scale-110 shadow-lg shadow-white/20' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quantity */}
                  <div>
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 block">Количество</label>
                    <div className="flex items-center gap-4 bg-black/40 rounded-full w-fit p-1 border border-white/10">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold text-white w-8 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-1 active:scale-95"
                >
                  Купить сейчас
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-24 border-t border-white/5 pt-16">
              <h3 className="text-3xl font-black text-white mb-12 flex items-center gap-4">
                Отзывы покупателей
                <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-full text-gray-300">
                  {reviews.length}
                </span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Reviews List */}
                <div className="lg:col-span-2 space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-fade-in">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-white/10">
                            <User className="w-5 h-5 text-gray-300" />
                          </div>
                          <div>
                            <div className="font-bold text-white">{review.author}</div>
                            <div className="text-xs text-gray-500">{review.date}</div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                        {review.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Review Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl sticky top-24">
                    <h4 className="text-xl font-bold text-white mb-6">Оставить отзыв</h4>
                    <form onSubmit={handleAddReview} className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Ваше имя</label>
                        <input
                          type="text"
                          required
                          value={newReview.author}
                          onChange={(e) => setNewReview({...newReview, author: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm"
                          placeholder="Иван"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Оценка</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReview({...newReview, rating: star})}
                              className="focus:outline-none transition-transform hover:scale-110"
                            >
                              <Star 
                                className={`w-8 h-8 ${star <= newReview.rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-600 hover:text-yellow-500/50'}`} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Ваш отзыв</label>
                        <textarea
                          required
                          value={newReview.text}
                          onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors text-sm min-h-[120px]"
                          placeholder="Расскажите о своих впечатлениях..."
                        />
                      </div>

                      <button 
                        type="submit"
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Отправить
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: CHECKOUT */}
        {view === 'checkout' && selectedProduct && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            <button 
              onClick={() => setView('detail')}
              className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
            >
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/10">
                <ArrowLeft className="w-5 h-5" />
              </div>
              <span className="font-medium">Назад к товару</span>
            </button>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
              <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-lg">
                  1
                </span>
                Оформление заказа
              </h2>

              {/* Order Summary */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 mb-8">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/10">
                   {selectedProduct.image && <img src={selectedProduct.image} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-white">{selectedProduct.name}</h3>
                  <div className="text-sm text-gray-400 flex gap-4">
                    <span>Кол-во: {quantity}</span>
                    {selectedColor && (
                      <span className="flex items-center gap-2">
                        Цвет: <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: selectedColor }} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xl font-bold text-cyan-400">
                  {parseInt(selectedProduct.price) * quantity} ₽
                </div>
              </div>

              <form onSubmit={handleSubmitOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Имя</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Иван"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Фамилия</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                      placeholder="Иванов"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Телефон</label>
                  <input 
                    required
                    type="tel" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="+7 (999) 000-00-00"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Адрес доставки</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors min-h-[100px]"
                    placeholder="Город, улица, дом, квартира"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Комментарий к заказу</label>
                  <textarea 
                    value={formData.comment}
                    onChange={e => setFormData({...formData, comment: e.target.value})}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Код домофона, удобное время и т.д."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-1 active:scale-95 mt-8"
                >
                  Подтвердить заказ
                </button>
              </form>
            </div>
          </div>
        )}

        {/* VIEW: SUCCESS */}
        {view === 'success' && (
          <div className="max-w-md mx-auto text-center animate-fade-in py-20">
            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-8 animate-bounce">
              <Check className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4">Спасибо за заказ!</h2>
            <p className="text-gray-400 text-lg mb-12">
              Ваш заказ успешно оформлен и находится в обработке. <br/>
              Наш менеджер свяжется с вами в ближайшее время.
            </p>
            <button 
              onClick={resetStore}
              className="px-8 py-3 rounded-full border border-white/10 hover:bg-white/5 text-white font-bold transition-all"
            >
              Вернуться в магазин
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default StoreSection;
