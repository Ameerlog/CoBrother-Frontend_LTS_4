import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/services';

export default function HomepageFeatureSelector({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let response;
      if (type === 'domain') response = await adminAPI.getDomains();
      else if (type === 'venture') response = await adminAPI.getVentures();
      else if (type === 'software') response = await adminAPI.getCoCreations();

      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [type]);

  const handleToggle = async (id) => {
    try {
      if (type === 'domain') await adminAPI.toggleDomainHomepage(id);
      else if (type === 'venture') await adminAPI.toggleVentureHomepage(id);
      else if (type === 'software') await adminAPI.toggleSoftwareHomepage(id);

      // Refresh the list after toggle
      await fetchItems();
    } catch (error) {
      console.error('Failed to toggle homepage feature:', error);
      alert('Failed to update homepage feature status');
    }
  };

  const getTitle = (item) => {
    if (type === 'domain') return `${item.domainName || ''}${item.domainExtension || ''}`;
    if (type === 'venture') return item.brandDetails?.brandName || `Venture #${item.id}`;
    if (type === 'software') return item.name || `Software #${item.id}`;
    return '';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-8 h-8 border-4 border-gray-400 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        Featured {type === 'software' ? 'Softwares' : type + 's'}
      </h3>

      {items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No {type === 'software' ? 'softwares' : type + 's'} found
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{getTitle(item)}</div>
                <div className="text-sm text-gray-500">ID: {item.id}</div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.featuredOnHomepage || item.featured_on_homepage || false}
                  onChange={() => handleToggle(item.id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-700">Featured</span>
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}