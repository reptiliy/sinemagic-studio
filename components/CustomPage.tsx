import React, { useEffect } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useContent } from '../ContentContext';
import Header from './Header';
import Footer from './Footer';
import { useSection } from '../ContentContext';

const CustomPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { pages, loading } = useContent();
  const showHeader = useSection('header');
  const showFooter = useSection('footer');

  const handleNavigate = (view: string) => {
    navigate('/', { state: { view } });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const page = pages.find(p => p.slug === slug);

  if (!page || !page.isVisible) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <Header currentView="custom" onNavigate={handleNavigate} />}
      
      <main className="flex-grow pt-20 animate-in fade-in duration-700">
        <div className="container mx-auto px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
            {page.title}
          </h1>
          
          <div className="prose prose-invert max-w-none">
            {/* Safe HTML rendering or simple text */}
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </main>

      {showFooter && <Footer onNavigate={handleNavigate} />}
    </div>
  );
};

export default CustomPage;
