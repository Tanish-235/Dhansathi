import { useNavigate } from 'react-router-dom';
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
  baseURL: 'http://localhost:5000/api', // Change this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

const Tutorial = () => {
  const navigate = useNavigate();
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
      // Ensure response.data is always an array
      const data = Array.isArray(response.data) ? response.data : [];
      setTutorials(data);
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
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back to Home Page Button - Top Left */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center text-purple-600 hover:text-purple-800 font-semibold bg-white bg-opacity-80 px-4 py-2 rounded-xl shadow"
        >
          ← Back to Home Page
        </button>
      </div>
  <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 mb-8 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
              <BookOpen size={40} />
              Tutorial Manager - Dhansathi
            </h1>
            <p className="text-purple-100">Smart tutorial management for your learning journey</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Add Tutorial Section */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl">
              <BookOpen className="text-purple-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
            </h2>
          </div>

          {!showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add New Tutorial
            </button>
          ) : (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 transition-colors p-2"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tutorial Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 outline-none transition-all text-gray-800"
                    placeholder="Enter tutorial title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Tutorial URL
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 outline-none transition-all text-gray-800"
                    placeholder="https://example.com/tutorial"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 outline-none transition-all text-gray-800"
                    placeholder="Enter tutorial description"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSubmit}
                  className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {editingTutorial ? 'Update Tutorial' : 'Add Tutorial'}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Tutorials Overview Section */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-3xl p-8 mb-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Tutorial Collection</h3>
              <p className="text-purple-200">Manage your learning resources</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-400">
                {Array.isArray(tutorials) ? tutorials.length : 0}
              </div>
              <div className="text-sm text-purple-200">Total Tutorials</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-lg">Loading tutorials...</p>
          </div>
        )}

        {/* Tutorials List */}
        {!loading && (
          <div className="space-y-6">
            {Array.isArray(tutorials) && tutorials.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-lg">
                <BookOpen size={64} className="mx-auto text-gray-300 mb-6" />
                <h3 className="text-2xl font-bold text-gray-600 mb-3">No tutorials yet</h3>
                <p className="text-gray-500 text-lg">Add your first tutorial to get started on your learning journey!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(tutorials) && tutorials.map((tutorial, idx) => (
                  <div key={tutorial._id || idx} className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-purple-100 p-2 rounded-xl">
                        <BookOpen className="text-purple-600" size={20} />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(tutorial)}
                          className="text-purple-600 hover:text-purple-800 transition-colors p-2 rounded-xl hover:bg-purple-50"
                          title="Edit tutorial"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => deleteTutorial(tutorial._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-xl hover:bg-red-50"
                          title="Delete tutorial"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{tutorial.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">{tutorial.description}</p>
                    
                    <a
                      href={tutorial.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-2xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <ExternalLink size={16} />
                      Visit Tutorial
                    </a>
                    
                    {tutorial.createdAt && (
                      <p className="text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                        Added: {new Date(tutorial.createdAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorial;