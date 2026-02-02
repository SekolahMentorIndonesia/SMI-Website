import { X } from "lucide-react";

export default function ContentPreview({ content, onClose }) {
  const renderBlock = (block) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p className="mb-4 text-gray-700 leading-relaxed">
            {block.content}
          </p>
        );
      
      case 'heading':
        return (
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            {block.content}
          </h2>
        );
      
      case 'list':
        return (
          <ul className="mb-4 list-disc list-inside text-gray-700">
            {block.content.split('\n').filter(item => item.trim()).map((item, index) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        );
      
      case 'quote':
        return (
          <blockquote className="mb-4 border-l-4 border-blue-500 pl-4 italic text-gray-600">
            {block.content}
          </blockquote>
        );
      
      case 'image':
        return (
          <div className="mb-4">
            <img 
              src={block.content} 
              alt={content.title}
              className="max-w-full h-auto rounded-lg"
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Content Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="prose max-w-none">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {content.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {content.description}
            </p>
            
            <div className="border-t pt-6">
              {content.content_blocks && content.content_blocks.length > 0 ? (
                content.content_blocks.map((block, index) => (
                  <div key={index}>
                    {renderBlock(block)}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No content blocks available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
