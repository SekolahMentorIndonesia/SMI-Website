import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Play, BookOpen, Download, Filter, Search } from 'lucide-react';
import contentService from '../../../services/contentService';
import { fetchFilteredContent, getFeaturedPosts } from '../../../services/bloggerService';

export default function WebsiteContent() {
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const filters = [
    { id: 'all', label: 'Semua', icon: BookOpen },
    { id: 'artikel', label: 'Artikel', icon: BookOpen },
    { id: 'video', label: 'Video', icon: Play },
    { id: 'ebook', label: 'Ebook', icon: Download },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
  ];

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        
        // Load all website content
        // Fetch featured from all posts (empty string) instead of just 'website'
        const [allResponse, featuredData] = await Promise.all([
          contentService.getWebsiteContent(),
          getFeaturedPosts('')
        ]);
        
        if (allResponse.success) {
          setAllContent(allResponse.data);
          setFilteredContent(allResponse.data);
        }
        
        setFeatured(featuredData.slice(0, 4));
      } catch (error) {
        console.error('Error loading website content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  useEffect(() => {
    // Filter content based on active filter
    if (activeFilter === 'all') {
      setFilteredContent(allContent);
    } else {
      const filtered = allContent.filter(item => item.contentType === activeFilter);
      setFilteredContent(filtered);
    }
  }, [allContent, activeFilter]);

  useEffect(() => {
    // Filter content based on search term
    if (searchTerm.trim() === '') {
      if (activeFilter === 'all') {
        setFilteredContent(allContent);
      } else {
        const filtered = allContent.filter(item => item.contentType === activeFilter);
        setFilteredContent(filtered);
      }
    } else {
      const searchResults = allContent.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContent(searchResults);
    }
  }, [allContent, searchTerm, activeFilter]);

  const ContentCard = ({ item }) => {
    const getIcon = () => {
      switch (item.contentType) {
        case 'video':
          return <Play className="w-5 h-5" />;
        case 'ebook':
          return <Download className="w-5 h-5" />;
        case 'tutorial':
          return <BookOpen className="w-5 h-5" />;
        default:
          return <BookOpen className="w-5 h-5" />;
      }
    };

    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
        onClick={() => window.open(item.link, '_blank')}
      >
        {/* Image */}
        <div className="h-56 relative overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-50 to-blue-50 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  {getIcon()}
                </div>
                <p className="text-brand-600 text-sm font-medium capitalize">{item.contentType}</p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-4">
            {item.categories.slice(0, 3).map((category, index) => (
              <span
                key={index}
                className="bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-medium"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Date & Reading Time */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {item.formattedDate}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {item.readingTime} menit
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
            {item.title}
          </h3>

          {/* Excerpt */}
          <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
            {item.description}
          </p>

          {/* Read More */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <BookOpen className="w-4 h-4" />
              SMI Team
            </div>
            <button className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1 transition-colors">
              Baca Selengkapnya
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </motion.article>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-full">
            <div className="w-5 h-5 border-2 border-white/30 rounded-full animate-spin"></div>
            <span className="ml-2">Memuat konten...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-brand-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 mb-6 font-display leading-tight">
              Pusat Edukasi Gratis
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Materi dari Blogger CMS untuk memulai perjalanan sebagai konten kreator.
            </p>
          </motion.div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari konten..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 px-4 sm:px-6 bg-neutral-50 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-600" />
              <span className="text-sm font-medium text-neutral-600">Filter:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeFilter === filter.id
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">
              {filters.find(f => f.id === activeFilter)?.label || 'Semua'} 
              <span className="text-neutral-500 font-normal ml-2">
                ({filteredContent.length} konten)
              </span>
            </h2>
          </div>

          {filteredContent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredContent.map((item, index) => (
                <ContentCard key={index} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Belum ada konten
              </h3>
              <p className="text-neutral-600">
                Konten dengan kategori ini akan segera tersedia
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-brand-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold text-white mb-4">
              Dapatkan Update Konten Terbaru
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Subscribe untuk mendapatkan artikel, video, dan ebook gratis langsung di inbox Anda
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.open('https://sekolahmentorindonesia.blogspot.com', '_blank')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 rounded-full hover:bg-neutral-50 transition-colors font-bold"
              >
                <BookOpen className="w-5 h-5" />
                Kunjungi Blog
              </button>
              <button 
                onClick={() => window.open('/', '_self')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-brand-600 transition-colors font-bold"
              >
                Kembali ke Landing Page
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
