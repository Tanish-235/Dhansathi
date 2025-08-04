import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, BookOpen, Edit, Trash2, X } from 'lucide-react';

// Axios configuration
const axios = {
  create: (config) => {
    const instance = {
      defaults: { ...config },
      interceptors: {
        request: { use: () => {} },
        response: { use: () => {} }
      }
    };
    
    const makeRequest = async (method, url, data = null, config = {}) => {
      const fullUrl = instance.defaults.baseURL + url;
      const requestConfig = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...instance.defaults.headers,
          ...config.headers
        },
        ...config
      };
      
      if (data) {
        requestConfig.body = JSON.stringify(data);
      }
      
      try {
        const response = await fetch(fullUrl, requestConfig);
        
        if (!response.ok) {
          const error = new Error(`Request failed with status ${response.status}`);
          error.response = {
            status: response.status,
            statusText: response.statusText,
            data: await response.text()
          };
          throw error;
        }
        
        const responseData = await response.json();
        return { data: responseData, status: response.status };
      } catch (error) {
        if (error.response) {
          throw error;
        }
        const networkError = new Error('Network Error');
        networkError.code = 'NETWORK_ERROR';
        throw networkError;
      }
    };
    
    instance.get = (url, config) => makeRequest('GET', url, null, config);
    instance.post = (url, data, config) => makeRequest('POST', url, data, config);
    instance.put = (url, data, config) => makeRequest('PUT', url, data, config);
    instance.delete = (url, config) => makeRequest('DELETE', url, null, config);
    
    return instance;
  }
};

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:3001/api', // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

const Tutorial = () => {
  const [tutorials, setTutorials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingTutorial, setEditingTutorial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: ''
  });

  // Fetch tutorials from backend
  const fetchTutorials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/tutorials');
      setTutorials(response.data);
      setError('');
    } catch (err) {
      if (err.code === 'NETWORK_ERROR') {
        setError('Failed to connect to server. Make sure your backend is running.');
      } else {
        setError(`Failed to load tutorials: ${err.response?.status || 'Unknown error'}`);
      }
      console.error('Error fetching tutorials:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new tutorial
  const addTutorial = async (tutorialData) => {
    try {
      const response = await api.post('/tutorials', tutorialData);
      setTutorials(prev => [...prev, response.data]);
      setError('');
      return true;
    } catch (err) {
      if (err.code === 'NETWORK_ERROR') {
        setError('Failed to connect to server. Check your backend connection.');
      } else if (err.response?.status === 400) {
        setError('Invalid tutorial data. Please check all fields.');
      } else {
        setError(`Failed to add tutorial: ${err.response?.status || 'Unknown error'}`);
      }
      console.error('Error adding tutorial:', err);
      return false;
    }
  };

//   // Update tutorial
//   const updateTutorial = async (id, tutorialData) => {
//     try {
//       const response = await api.put(`/tutorials/${id}`, tutorialData);
//       setTutorials(prev => prev.map(t => t._id === id ? response.data : t));
//       setError('');
//       return true;
//     } catch (err) {
//       if (err.code === 'NETWORK_ERROR') {
//         setError('Failed to connect to server.');
//       } else if (err.response?.status === 404) {
//         setError('Tutorial not found. It may have been deleted.');
//         fetchTutorials(); // Refresh the list
//       } else if (err.response?.status === 400) {
//         setError('Invalid tutorial data. Please check all fields.');
//       } else {
//         setError(`Failed to update tutorial: ${err.response?.status || 'Unknown error'}`);
//       }
//       console.error('Error updating tutorial:', err);
//       return false;
//     }
//   };
  // Update tutorial
  const updateTutorial = async (id, tutorialData) => {
    try {
      const response = await api.put(`/tutorials/${id}`, tutorialData);
      // If backend returns the updated tutorial as response.data, update state accordingly
      setTutorials(prev => prev.map(t => t._id === id ? response.data : t));
      setError('');
      return true;
    } catch (err) {
      if (err.code === 'NETWORK_ERROR') {
        setError('Failed to connect to server.');
      } else if (err.response?.status === 404) {
        setError('Tutorial not found. It may have been deleted.');
        fetchTutorials(); // Refresh the list
      } else if (err.response?.status === 400) {
        setError('Invalid tutorial data. Please check all fields.');
      } else {
        setError(`Failed to update tutorial: ${err.response?.status || 'Unknown error'}`);
      }
      console.error('Error updating tutorial:', err);
      return false;
    }
  };

  // Delete tutorial
  const deleteTutorial = async (id) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this tutorial?')) {
      return;
    }

    try {
      await api.delete(`/tutorials/${id}`);
      setTutorials(prev => prev.filter(t => t._id !== id));
      setError('');
    } catch (err) {
      if (err.code === 'NETWORK_ERROR') {
        setError('Failed to connect to server.');
      } else if (err.response?.status === 404) {
        setError('Tutorial not found. It may have already been deleted.');
        fetchTutorials(); // Refresh the list
      } else {
        setError(`Failed to delete tutorial: ${err.response?.status || 'Unknown error'}`);
      }
      console.error('Error deleting tutorial:', err);
    }
  };

  // Load tutorials on component mount
  useEffect(() => {
    fetchTutorials();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.url) {
      setError('Please fill in all fields');
      return;
    }

    // URL validation
    try {
      new URL(formData.url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    const success = editingTutorial 
      ? await updateTutorial(editingTutorial._id, formData)
      : await addTutorial(formData);

    if (success) {
      setFormData({ title: '', description: '', url: '' });
      setShowForm(false);
      setEditingTutorial(null);
    }
  };

  // Handle edit
  const handleEdit = (tutorial) => {
    setEditingTutorial(tutorial);
    setFormData({
      title: tutorial.title,
      description: tutorial.description,
      url: tutorial.url
    });
    setShowForm(true);
  };

  // Handle cancel
  const handleCancel = () => {
    setShowForm(false);
    setEditingTutorial(null);
    setFormData({ title: '', description: '', url: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-600" size={40} />
            Tutorial Manager
          </h1>
          <p className="text-gray-600">Organize and manage your learning resources</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add Tutorial Button */}
        {!showForm && (
          <div className="mb-8 text-center">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add New Tutorial
            </button>
          </div>
        )}

        {/* Tutorial Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter tutorial title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all"
                  placeholder="Enter tutorial description"
                  required
                />
              </div>

              <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL *
                </label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="https://example.com/tutorial"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                >
                  {editingTutorial ? 'Update Tutorial' : 'Add Tutorial'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading tutorials...</p>
          </div>
        )}

        {/* Tutorials List */}
        {!loading && (
          <div className="space-y-4">
            {tutorials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No tutorials yet</h3>
                <p className="text-gray-500">Add your first tutorial to get started!</p>
              </div>
            ) : (
              tutorials.map((tutorial) => (
                <div key={tutorial._id} className="bg-white rounded-xl shadow-lg p-6 border hover:shadow-xl transition-shadow duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{tutorial.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tutorial)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                        title="Edit tutorial"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteTutorial(tutorial._id)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1"
                        title="Delete tutorial"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">{tutorial.description}</p>
                  
                  <a
                    href={tutorial.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    <ExternalLink size={16} />
                    Visit Tutorial
                  </a>
                  
                  {tutorial.createdAt && (
                    <p className="text-xs text-gray-400 mt-4">
                      Added: {new Date(tutorial.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorial;