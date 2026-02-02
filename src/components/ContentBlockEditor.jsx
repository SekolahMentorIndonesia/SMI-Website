import { useState } from "react";
import { X, Plus, Type, Heading, List, Quote, Image } from "lucide-react";

export default function ContentBlockEditor({ content_blocks, onChange }) {
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      content: ''
    };
    onChange([...content_blocks, newBlock]);
  };

  const updateBlock = (index, content) => {
    const updatedBlocks = [...content_blocks];
    updatedBlocks[index].content = content;
    onChange(updatedBlocks);
  };

  const removeBlock = (index) => {
    const updatedBlocks = content_blocks.filter((_, i) => i !== index);
    onChange(updatedBlocks);
  };

  const renderBlockEditor = (block, index) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Paragraph</span>
              <button
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={3}
              placeholder="Enter paragraph text..."
            />
          </div>
        );
      
      case 'heading':
        return (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Heading</span>
              <button
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(index, e.target.value)}
              className="w-full p-2 border rounded-md text-lg font-bold"
              placeholder="Enter heading text..."
            />
          </div>
        );
      
      case 'list':
        return (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">List</span>
              <button
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, e.target.value)}
              className="w-full p-2 border rounded-md resize-none"
              rows={4}
              placeholder="Enter list items (one per line)..."
            />
          </div>
        );
      
      case 'quote':
        return (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Quote</span>
              <button
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={block.content}
              onChange={(e) => updateBlock(index, e.target.value)}
              className="w-full p-2 border rounded-md resize-none italic"
              rows={3}
              placeholder="Enter quote text..."
            />
          </div>
        );
      
      case 'image':
        return (
          <div key={block.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Image URL</span>
              <button
                onClick={() => removeBlock(index)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={block.content}
              onChange={(e) => updateBlock(index, e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder="Enter image URL..."
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => addBlock('paragraph')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <Type className="w-4 h-4" />
          Paragraph
        </button>
        <button
          onClick={() => addBlock('heading')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <Heading className="w-4 h-4" />
          Heading
        </button>
        <button
          onClick={() => addBlock('list')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <List className="w-4 h-4" />
          List
        </button>
        <button
          onClick={() => addBlock('quote')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <Quote className="w-4 h-4" />
          Quote
        </button>
        <button
          onClick={() => addBlock('image')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
        >
          <Image className="w-4 h-4" />
          Image
        </button>
      </div>
      
      <div className="space-y-3">
        {content_blocks.map((block, index) => renderBlockEditor(block, index))}
      </div>
      
      {content_blocks.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No content blocks yet. Add your first block above.</p>
        </div>
      )}
    </div>
  );
}
