import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { translations as initialTranslations, Language } from './translations';

export type TranslationRecord = {
  key: string;
  value: string;
  lang: string;
};

type Section = {
  id: string;
  is_visible: boolean;
  display_order: number;
};

type ContentContextType = {
  // key -> { lang -> value }
  translations: Record<string, Record<string, string>>; 
  sections: Record<string, boolean>;
  products: Product[];
  orders: Order[];
  loading: boolean;
  refreshContent: () => Promise<void>;
  updateTranslation: (key: string, value: string, lang?: string) => Promise<void>;
  toggleSection: (id: string, isVisible: boolean) => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  pages: CustomPage[];
  addPage: (page: Omit<CustomPage, 'id'>) => Promise<void>;
  updatePage: (id: string, updates: Partial<CustomPage>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
};

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  isVisible: boolean;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  comment?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: string;
    color?: string;
  }[];
  total: number;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  category: string;
  description?: string;
  isVisible: boolean;
  colors?: string[];
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'Интерактивная игрушка', price: '1500', image: '', category: 'Игрушки', isVisible: true, colors: ['#FF0000', '#00FF00', '#0000FF'] },
  { id: '2', name: 'Уютный домик', price: '3500', image: '', category: 'Домики', isVisible: true, colors: ['#8B4513', '#D2691E'] },
  { id: '3', name: 'Когтеточка-столбик', price: '2000', image: '', category: 'Аксессуары', isVisible: true },
  { id: '4', name: 'Миска керамическая', price: '800', image: '', category: 'Посуда', isVisible: true },
  { id: '5', name: 'Ошейник с GPS', price: '5000', image: '', category: 'Аксессуары', isVisible: true },
  { id: '6', name: 'Мягкая лежанка', price: '2500', image: '', category: 'Мебель', isVisible: true },
  { id: '7', name: 'Лазерная указка', price: '500', image: '', category: 'Игрушки', isVisible: true },
  { id: '8', name: 'Переноска-рюкзак', price: '4500', image: '', category: 'Аксессуары', isVisible: true },
  { id: '9', name: 'Набор витаминов', price: '1200', image: '', category: 'Здоровье', isVisible: true },
];

const MOCK_REVIEWS: Review[] = [
  { id: '1', author: 'Алексей К.', rating: 5, date: '15.10.2023', text: 'Отличный товар! Качество на высоте, коту очень понравилось.' },
  { id: '2', author: 'Мария С.', rating: 4, date: '20.10.2023', text: 'Всё супер, доставка быстрая. Единственное - цвет немного отличается от фото.' },
  { id: '3', author: 'Дмитрий В.', rating: 5, date: '05.11.2023', text: 'Беру уже второй раз. Рекомендую!' },
];

const ContentContext = createContext<ContentContextType | undefined>(undefined);

// Helper to flatten the nested translations object from translations.ts
const flattenTranslations = (source: Record<string, any>) => {
  const result: Record<string, Record<string, string>> = {};

  Object.entries(source).forEach(([lang, sections]) => {
    Object.entries(sections).forEach(([section, keys]) => {
      // @ts-ignore
      Object.entries(keys).forEach(([key, value]) => {
        const fullKey = `${section}.${key}`;
        if (!result[fullKey]) {
          result[fullKey] = {};
        }
        // @ts-ignore
        result[fullKey][lang] = value as string;
      });
    });
  });

  return result;
};

const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with static data
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(() => 
    flattenTranslations(initialTranslations)
  );
  const [sections, setSections] = useState<Record<string, boolean>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pages, setPages] = useState<CustomPage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContent = async () => {
    try {
      // 1. Load from LocalStorage (highest priority for offline/demo mode)
      let currentLocalProducts: Product[] = [];
      
      const localTrans = localStorage.getItem('site_translations');
      if (localTrans) {
        const parsed = JSON.parse(localTrans);
        setTranslations(prev => {
          const merged = { ...prev };
          Object.entries(parsed).forEach(([key, langs]) => {
             if (!merged[key]) merged[key] = {};
             // @ts-ignore
             Object.assign(merged[key], langs);
          });
          return merged;
        });
      }

      const localSections = localStorage.getItem('site_sections');
      if (localSections) {
        setSections(JSON.parse(localSections));
      }

      const localProducts = localStorage.getItem('site_products');
      if (localProducts) {
        try {
          const parsed = JSON.parse(localProducts);
          if (Array.isArray(parsed)) {
             // Auto-update if we have old products without colors or old count
             const needsUpdate = parsed.length !== DEFAULT_PRODUCTS.length || parsed.some((p: any) => !p.colors);
             if (needsUpdate) {
                // Merge existing products with defaults to keep ids/names but add new fields
                const merged = DEFAULT_PRODUCTS.map(def => {
                  const existing = parsed.find((p: Product) => p.id === def.id);
                  return existing ? { ...def, ...existing, colors: def.colors } : def;
                });
                currentLocalProducts = merged;
                setProducts(merged);
                localStorage.setItem('site_products', JSON.stringify(merged));
             } else {
                currentLocalProducts = parsed;
                setProducts(parsed);
             }
          }
        } catch (e) {
          console.error('Failed to parse products', e);
        }
      } else {
        // Initialize with default products if none exist
        currentLocalProducts = DEFAULT_PRODUCTS;
        setProducts(DEFAULT_PRODUCTS);
        localStorage.setItem('site_products', JSON.stringify(DEFAULT_PRODUCTS));
      }

      const localOrders = localStorage.getItem('site_orders');
      if (localOrders) {
        try {
          setOrders(JSON.parse(localOrders));
        } catch (e) {
          console.error('Failed to parse orders', e);
        }
      }

      const localReviews = localStorage.getItem('site_reviews');
      if (localReviews) {
        try {
          setReviews(JSON.parse(localReviews));
        } catch (e) {
          console.error('Failed to parse reviews', e);
        }
      } else {
        // Init with mock reviews
        setReviews(MOCK_REVIEWS);
        localStorage.setItem('site_reviews', JSON.stringify(MOCK_REVIEWS));
      }

      // 2. Try Supabase (if connected)
      // Check if supabase is configured (has URL)
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (hasSupabase) {
        // Fetch translations
        const { data: transData, error: transError } = await supabase
          .from('translations')
          .select('key, value, lang');
        
        if (!transError && transData) {
          const transMap: Record<string, Record<string, string>> = {};
          transData.forEach((t: TranslationRecord) => {
            if (!transMap[t.key]) {
              transMap[t.key] = {};
            }
            transMap[t.key][t.lang] = t.value;
          });
          
          setTranslations(prev => {
            const merged = { ...prev };
            Object.entries(transMap).forEach(([key, langs]) => {
              if (!merged[key]) merged[key] = {};
              Object.assign(merged[key], langs);
            });
            return merged;
          });
        }

        // Fetch sections
        const { data: sectData, error: sectError } = await supabase
          .from('sections')
          .select('id, is_visible');

        if (!sectError && sectData) {
          const sectMap: Record<string, boolean> = {};
          sectData.forEach((s: Section) => {
            sectMap[s.id] = s.is_visible;
          });
          setSections(prev => ({ ...prev, ...sectMap }));
        }

        // Fetch products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: true });

        if (!prodError) {
          if (prodData && prodData.length > 0) {
            const mappedProducts = prodData.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.image,
            category: p.category,
            description: p.description,
            isVisible: p.is_visible,
            colors: p.colors || []
          }));
            setProducts(mappedProducts);
            // Sync LocalStorage to match Server Data (Server is Truth)
            localStorage.setItem('site_products', JSON.stringify(mappedProducts));
          } else {
             // Seeding if empty: Use currentLocalProducts (or defaults)
             console.log('Seeding default products to Supabase...');
             
             // Ensure we have valid UUIDs for seeding
             const productsToSeed = (currentLocalProducts.length > 0 ? currentLocalProducts : DEFAULT_PRODUCTS).map(p => ({
                ...p,
                // Replace simple IDs ('1', '2') with UUIDs if necessary
                id: (p.id.length < 10) ? crypto.randomUUID() : p.id
             }));
             
             const { error: insertError } = await supabase
                .from('products')
                .insert(productsToSeed.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    image: p.image,
                    category: p.category,
                    description: p.description,
                    is_visible: p.isVisible,
                    colors: p.colors
                })));
            
             if (!insertError) {
                setProducts(productsToSeed);
                // Update local storage with new UUIDs to avoid re-seeding duplicates if cleared
                localStorage.setItem('site_products', JSON.stringify(productsToSeed));
             } else {
                console.error('Error seeding products:', insertError);
                // Even if seeding fails, we force show the default products so the site isn't empty!
                setProducts(productsToSeed);
                alert('Внимание: Не удалось инициализировать базу данных (RLS). Товары показаны локально. Запустите fix_rls.sql');
             }
          }
        } else {
          console.error('Supabase fetch error:', prodError);
        }

        // Fetch orders
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .order('date', { ascending: false });

        if (!orderError && orderData) {
          const mappedOrders = orderData.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            customerPhone: o.customer_phone,
            address: o.address,
            comment: o.comment,
            items: o.items,
            total: o.total,
            status: o.status,
            date: o.date
          }));
          setOrders(mappedOrders);
        }

        // Fetch reviews
        const { data: reviewData, error: reviewError } = await supabase
          .from('reviews')
          .select('*')
          .order('date', { ascending: false });

        if (!reviewError && reviewData) {
          const mappedReviews = reviewData.map((r: any) => ({
            id: r.id,
            author: r.author,
            rating: r.rating,
            date: r.date,
            text: r.text
          }));
          setReviews(mappedReviews);
        }

        // Fetch pages
        const { data: pageData, error: pageError } = await supabase
          .from('custom_pages')
          .select('*');

        if (!pageError && pageData) {
          const mappedPages = pageData.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            content: p.content,
            isVisible: p.is_visible
          }));
          setPages(mappedPages);
          localStorage.setItem('site_pages', JSON.stringify(mappedPages));
        }
      }

    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const refreshContent = async () => {
    await fetchContent();
  };

  const updateTranslation = async (key: string, value: string, lang: string = 'ru') => {
    // 1. Optimistic update in state
    setTranslations(prev => {
      const newState = { ...prev };
      if (!newState[key]) newState[key] = {};
      newState[key][lang] = value;
      return newState;
    });

    // 2. Save to LocalStorage
    try {
      const currentLocal = JSON.parse(localStorage.getItem('site_translations') || '{}');
      if (!currentLocal[key]) currentLocal[key] = {};
      currentLocal[key][lang] = value;
      localStorage.setItem('site_translations', JSON.stringify(currentLocal));
    } catch (e) {
      console.error('LocalStorage save error', e);
    }

    // 3. Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('translations')
          .upsert({ key, value, lang }, { onConflict: 'key, lang' });
        if (error) throw error;
      }
    } catch (error) {
      console.warn('Supabase update failed (using local storage):', error);
      // Don't throw, as we saved locally
    }
  };

  const toggleSection = async (id: string, isVisible: boolean) => {
    // 1. Optimistic update
    setSections(prev => ({ ...prev, [id]: isVisible }));

    // 2. Save to LocalStorage
    try {
      const currentLocal = JSON.parse(localStorage.getItem('site_sections') || '{}');
      currentLocal[id] = isVisible;
      localStorage.setItem('site_sections', JSON.stringify(currentLocal));
    } catch (e) { console.error(e); }

    // 3. Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('sections')
          .upsert({ id, is_visible: isVisible });
        if (error) throw error;
      }
    } catch (error) {
      console.warn('Supabase section update failed:', error);
    }
  };

  const addPage = async (page: Omit<CustomPage, 'id'>) => {
    const newPage: CustomPage = { ...page, id: generateUUID() };
    
    setPages(prev => {
      const updated = [...prev, newPage];
      localStorage.setItem('site_pages', JSON.stringify(updated));
      return updated;
    });

    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('custom_pages')
          .insert({
            id: newPage.id,
            slug: newPage.slug,
            title: newPage.title,
            content: newPage.content,
            is_visible: newPage.isVisible
          });
        if (error) console.error('Supabase add page error:', error);
      }
    } catch (e) { console.error(e); }
  };

  const updatePage = async (id: string, updates: Partial<CustomPage>) => {
    setPages(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('site_pages', JSON.stringify(updated));
      return updated;
    });

    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const dbUpdates: any = {};
        if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.content !== undefined) dbUpdates.content = updates.content;
        if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;

        const { error } = await supabase
          .from('custom_pages')
          .update(dbUpdates)
          .eq('id', id);
        if (error) console.error('Supabase update page error:', error);
      }
    } catch (e) { console.error(e); }
  };

  const deletePage = async (id: string) => {
    setPages(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('site_pages', JSON.stringify(updated));
      return updated;
    });

    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('custom_pages')
          .delete()
          .eq('id', id);
        if (error) console.error('Supabase delete page error:', error);
      }
    } catch (e) { console.error(e); }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newProduct: Product = { ...product, id: generateUUID() };
    
    // Validate required fields
    if (!newProduct.category) newProduct.category = 'Разное';
    if (!newProduct.colors) newProduct.colors = [];

    setProducts(prev => {
      const updated = [...prev, newProduct];
      localStorage.setItem('site_products', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!hasSupabase) {
        console.warn('Supabase not configured, saving locally only');
        alert('Внимание: Supabase не подключен! Товар сохранен только в браузере. Проверьте .env файл.');
        return;
      }

      if (hasSupabase) {
        console.log('Attempting to save to Supabase:', newProduct);
        const { data, error } = await supabase
          .from('products')
          .insert({
            id: newProduct.id,
            name: newProduct.name,
            price: newProduct.price,
            image: newProduct.image,
            category: newProduct.category,
            description: newProduct.description,
            is_visible: newProduct.isVisible,
            colors: newProduct.colors
          })
          .select();
        
        if (error) {
          console.error('Supabase add product error:', error);
          let errorMsg = 'Ошибка сохранения в базу данных Supabase:\n' + error.message;
          
          if (error.code === '42703') {
             errorMsg += '\n\nВОЗМОЖНАЯ ПРИЧИНА: Несоответствие схемы базы данных. Отсутствуют колонки colors или is_visible.';
             errorMsg += '\nРЕШЕНИЕ: Выполните SQL запрос из файла FINAL_SETUP.sql в редакторе Supabase.';
          } else if (error.code === '42501') {
             errorMsg += '\n\nВОЗМОЖНАЯ ПРИЧИНА: Нет прав на запись (RLS Policy).';
             errorMsg += '\nРЕШЕНИЕ: Выполните SQL запрос из файла FINAL_SETUP.sql для обновления политик.';
          }

          alert(errorMsg);
          // Revert local change if failed
          setProducts(prev => prev.filter(p => p.id !== newProduct.id));
        } else if (!data || data.length === 0) {
           console.warn('Supabase insert successful but returned no data. Possible RLS issue.');
           alert('Предупреждение: Товар отправлен, но база данных не вернула подтверждение. Возможно, проблема с правами доступа (RLS).');
        } else {
          console.log('Successfully saved to Supabase');
          // Refresh content to ensure we have the server-side state (timestamps etc)
          // Don't await this to keep UI responsive
          fetchContent(); 
        }
      }
    } catch (e: any) { 
      console.warn(e);
      alert('System Error: ' + e.message);
      // Revert local change if failed
      setProducts(prev => prev.filter(p => p.id !== newProduct.id));
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p);
      localStorage.setItem('site_products', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const dbUpdates: any = {};
        if (updates.name !== undefined) {
          dbUpdates.name = updates.name;
        }
        if (updates.price !== undefined) dbUpdates.price = updates.price;
        if (updates.image !== undefined) dbUpdates.image = updates.image;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.isVisible !== undefined) dbUpdates.is_visible = updates.isVisible;
        if (updates.colors !== undefined) dbUpdates.colors = updates.colors;

        const { error } = await supabase
          .from('products')
          .update(dbUpdates)
          .eq('id', id);
        
        if (error) {
          console.error('Supabase update product error:', error);
          alert('Ошибка обновления товара в базе данных:\n' + error.message);
        }
      }
    } catch (e: any) { 
      console.warn(e);
      alert('Ошибка при обновлении: ' + e.message);
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem('site_products', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        if (error) console.error('Supabase delete product error:', error);
      }
    } catch (e) { console.warn(e); }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...order,
      id: generateUUID(),
      date: new Date().toISOString(),
      status: 'new'
    };
    setOrders(prev => {
      const updated = [newOrder, ...prev];
      localStorage.setItem('site_orders', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('orders')
          .insert({
            id: newOrder.id,
            customer_name: newOrder.customerName,
            customer_phone: newOrder.customerPhone,
            address: newOrder.address,
            comment: newOrder.comment,
            items: newOrder.items,
            total: newOrder.total,
            status: newOrder.status,
            date: newOrder.date
          });
        if (error) console.error('Supabase add order error:', error);
      }
    } catch (e) { console.warn(e); }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem('site_orders', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id);
        if (error) console.error('Supabase update order status error:', error);
      }
    } catch (e) { console.warn(e); }
  };

  const addReview = async (review: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...review,
      id: generateUUID(),
      date: new Date().toLocaleDateString('ru-RU')
    };

    setReviews(prev => {
      const updated = [newReview, ...prev];
      localStorage.setItem('site_reviews', JSON.stringify(updated));
      return updated;
    });

    // Try Supabase
    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        await supabase.from('reviews').insert({
          id: newReview.id,
          author: newReview.author,
          rating: newReview.rating,
          date: newReview.date,
          text: newReview.text
        });
      }
    } catch (e) { console.warn(e); }
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => {
      const updated = prev.filter(r => r.id !== id);
      localStorage.setItem('site_reviews', JSON.stringify(updated));
      return updated;
    });

    try {
      // @ts-ignore
      const hasSupabase = !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      if (hasSupabase) {
        await supabase.from('reviews').delete().eq('id', id);
      }
    } catch (e) { console.warn(e); }
  };

  return (
    <ContentContext.Provider value={{ 
      translations, sections, loading, 
      refreshContent, updateTranslation, toggleSection,
      products, addProduct, updateProduct, deleteProduct,
      orders, addOrder, updateOrderStatus,
      reviews, addReview, deleteReview,
      pages, addPage, updatePage, deletePage
    }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Helper hook to safely get text with fallback (defaults to 'ru')
export const useText = (key: string, fallback: string = '', lang: string = 'ru') => {
  const { translations } = useContent();
  return translations[key]?.[lang] || fallback;
};

// Helper hook to check section visibility
export const useSection = (id: string) => {
  const { sections } = useContent();
  // Default to true if not explicitly set to false
  return sections[id] !== undefined ? sections[id] : true;
};
