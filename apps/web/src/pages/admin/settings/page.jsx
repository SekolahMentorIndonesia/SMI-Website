import AdminLayout from '../../../layouts/AdminLayout';
import { Settings, Save, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">System Settings</h1>
          <p className="text-neutral-500">Manage system configurations</p>
        </div>
      </div>

      {saveMessage && (
        <div className={`p-4 rounded-2xl mb-6 ${saveMessage.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
          {saveMessage}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings size={24} className="text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">General Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Website Name</label>
              <input 
                type="text" 
                defaultValue="Sekolah Mentor Indonesia" 
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Telegram Bot Token</label>
              <input 
                type="text" 
                defaultValue="8344044925:AAEdXdK7WcHwlMawIr_QvYRLb38IgflRs7k" 
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Telegram Chat ID</label>
              <input 
                type="text" 
                defaultValue="8375398953" 
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings size={24} className="text-green-600" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Email Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">SMTP Host</label>
              <input 
                type="text" 
                defaultValue="smtp.example.com" 
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">SMTP Port</label>
              <input 
                type="number" 
                defaultValue="587" 
                className="w-full px-4 py-3 rounded-2xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-3">
        <button 
          onClick={() => window.location.reload()} 
          className="flex items-center gap-2 px-6 py-3 bg-neutral-100 text-neutral-700 rounded-2xl hover:bg-neutral-200 transition-colors"
        >
          <RefreshCw size={20} />
          Reset
        </button>
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-2xl hover:bg-brand-700 transition-colors"
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </div>
          ) : (
            <>
              <Save size={20} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </AdminLayout>
  );
}
