import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, User } from "lucide-react";
import axios from "axios";

export default function ContentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/api/content/${id}`);
        setContent(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
        navigate('/app');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchContent();
    }
  }, [id, navigate]);

  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p className="mb-6 text-gray-700 leading-relaxed text-lg">
            {block.content}
          </p>
        );
      
      case 'heading':
        return (
          <h2 className="mb-6 text-3xl font-bold text-gray-900 mt-8">
            {block.content}
          </h2>
        );
      
      case 'list':
        return (
          <ul className="mb-6 list-disc list-inside text-gray-700 text-lg">
            {block.content.split('\n').filter(item => item.trim()).map((item, index) => (
              <li key={index} className="mb-2">{item}</li>
            ))}
          </ul>
        );
      
      case 'quote':
        return (
          <blockquote className="mb-6 border-l-4 border-blue-500 pl-6 italic text-gray-600 text-lg bg-blue-50 py-4 rounded-r-lg">
            {block.content}
          </blockquote>
        );
      
      case 'image':
        return (
          <div className="mb-6">
            <img 
              src={block.content} 
              alt={content?.title}
              className="max-w-full h-auto rounded-lg shadow-lg"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div className="text-red-500 text-sm" style={{display: 'none'}}>
              Image not available: {block.content}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Content not found</h2>
          <button
            onClick={() => navigate('/app')}
            className="text-blue-600 hover:text-blue-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6">
              {content.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(content.created_at).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {content.User?.name || 'SMI Team'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="prose max-w-none">
            {content.content_blocks && Array.isArray(content.content_blocks) && content.content_blocks.length > 0 ? (
              content.content_blocks.map((block, index) => (
                <div key={index}>
                  {renderBlock(block)}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No content available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
