import React, { useState, useEffect } from 'react';
import { User, Clock, MapPin, Star, Mail, Phone, Calendar, DollarSign, Heart, Search, Plus, X } from 'lucide-react';

export default function StonehillChildcare() {
  const [activeTab, setActiveTab] = useState('browse');
  const [providers, setProviders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from persistent storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [providersResult, favoritesResult] = await Promise.all([
        window.storage.get('childcare-providers', false).catch(() => null),
        window.storage.get('childcare-favorites', false).catch(() => null)
      ]);

      if (providersResult?.value) {
        setProviders(JSON.parse(providersResult.value));
      }
      if (favoritesResult?.value) {
        setFavorites(JSON.parse(favoritesResult.value));
      }
    } catch (error) {
      console.log('First time loading app');
    } finally {
      setLoading(false);
    }
  };

  const saveProviders = async (newProviders) => {
    try {
      await window.storage.set('childcare-providers', JSON.stringify(newProviders), false);
      setProviders(newProviders);
    } catch (error) {
      console.error('Failed to save providers:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await window.storage.set('childcare-favorites', JSON.stringify(newFavorites), false);
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  const toggleFavorite = (providerId) => {
    const newFavorites = favorites.includes(providerId)
      ? favorites.filter(id => id !== providerId)
      : [...favorites, providerId];
    saveFavorites(newFavorites);
  };

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.experience.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteProviders = providers.filter(p => favorites.includes(p.id));

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: '"Nunito Sans", sans-serif',
      padding: '0'
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700;900&display=swap');
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }

        .modal-backdrop {
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          animation: slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{
                fontSize: '36px',
                fontWeight: '900',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: '"Playfair Display", serif',
                margin: 0,
                lineHeight: 1.2
              }}>
                Stonehill Childcare
              </h1>
              <p style={{ color: '#666', margin: '4px 0 0 0', fontSize: '14px' }}>
                Connecting faculty families with student caregivers
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              <Plus size={18} />
              <span style={{ position: 'relative', zIndex: 1 }}>Register as Provider</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Tabs and Search */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setActiveTab('browse')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'browse' ? 'white' : 'rgba(255,255,255,0.3)',
                color: activeTab === 'browse' ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: activeTab === 'browse' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Browse All ({providers.length})
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              style={{
                padding: '12px 24px',
                background: activeTab === 'favorites' ? 'white' : 'rgba(255,255,255,0.3)',
                color: activeTab === 'favorites' ? '#667eea' : 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '15px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === 'favorites' ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Heart size={16} fill={activeTab === 'favorites' ? '#667eea' : 'none'} />
              Favorites ({favoriteProviders.length})
            </button>
          </div>

          {/* Search Bar */}
          {activeTab === 'browse' && (
            <div style={{
              position: 'relative',
              maxWidth: '500px'
            }}>
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#999'
                }}
              />
              <input
                type="text"
                placeholder="Search by name, major, or experience..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px 14px 48px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '15px',
                  background: 'white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  outline: 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Provider Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'white' }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '4px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <p style={{ fontSize: '18px', fontWeight: '600' }}>Loading providers...</p>
          </div>
        ) : (
          <>
            {(activeTab === 'browse' ? filteredProviders : favoriteProviders).length === 0 ? (
              <div style={{
                background: 'white',
                padding: '60px 40px',
                borderRadius: '16px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px'
                }}>
                  <User size={36} color="white" />
                </div>
                <h3 style={{ fontSize: '24px', marginBottom: '12px', color: '#333' }}>
                  {activeTab === 'favorites' ? 'No favorites yet' : 'No providers found'}
                </h3>
                <p style={{ color: '#666', fontSize: '16px', marginBottom: '24px' }}>
                  {activeTab === 'favorites' 
                    ? 'Start adding providers to your favorites to see them here'
                    : searchTerm 
                      ? 'Try adjusting your search terms'
                      : 'Be the first to register as a childcare provider!'}
                </p>
                {activeTab === 'browse' && !searchTerm && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="btn-primary"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontWeight: '700',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Plus size={18} />
                    Register Now
                  </button>
                )}
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                gap: '24px'
              }}>
                {(activeTab === 'browse' ? filteredProviders : favoriteProviders).map((provider, index) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    isFavorite={favorites.includes(provider.id)}
                    onToggleFavorite={() => toggleFavorite(provider.id)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Provider Modal */}
      {showAddModal && (
        <AddProviderModal
          onClose={() => setShowAddModal(false)}
          onAdd={(provider) => {
            const newProviders = [...providers, { ...provider, id: Date.now() }];
            saveProviders(newProviders);
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
}

function ProviderCard({ provider, isFavorite, onToggleFavorite, index }) {
  return (
    <div
      className="card-hover"
      style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        animation: `fadeIn 0.5s ease ${index * 0.1}s both`,
        position: 'relative'
      }}
    >
      {/* Favorite Button */}
      <button
        onClick={onToggleFavorite}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: isFavorite ? '#ff6b9d' : 'white',
          border: '2px solid #ff6b9d',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(255, 107, 157, 0.2)'
        }}
      >
        <Heart size={20} color={isFavorite ? 'white' : '#ff6b9d'} fill={isFavorite ? 'white' : 'none'} />
      </button>

      {/* Avatar */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
      }}>
        <User size={36} color="white" />
      </div>

      {/* Name and Year */}
      <h3 style={{
        fontSize: '22px',
        fontWeight: '800',
        marginBottom: '4px',
        color: '#1a1a1a'
      }}>
        {provider.name}
      </h3>
      <p style={{
        color: '#667eea',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '16px'
      }}>
        {provider.year} • {provider.major}
      </p>

      {/* Info Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <InfoItem icon={<Clock size={16} />} text={provider.availability} />
        <InfoItem icon={<DollarSign size={16} />} text={provider.rate} />
        <InfoItem icon={<Star size={16} />} text={provider.experience} />
        {provider.certifications && (
          <InfoItem icon={<Calendar size={16} />} text={provider.certifications} />
        )}
      </div>

      {/* P2P Services */}
      {provider.p2pServices && provider.p2pServices.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '8px' }}>
            Available on:
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {provider.p2pServices.map((service, idx) => (
              <span
                key={idx}
                style={{
                  background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                  color: '#667eea',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}
              >
                {service}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact Buttons */}
      <div style={{ display: 'flex', gap: '8px' }}>
        <a
          href={`mailto:${provider.email}`}
          style={{
            flex: 1,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '12px',
            borderRadius: '10px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
          }}
        >
          <Mail size={16} />
          Email
        </a>
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            style={{
              flex: 1,
              background: 'white',
              color: '#667eea',
              border: '2px solid #667eea',
              padding: '12px',
              borderRadius: '10px',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            <Phone size={16} />
            Call
          </a>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon, text }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#555',
      fontSize: '14px'
    }}>
      <div style={{
        color: '#667eea',
        display: 'flex',
        alignItems: 'center'
      }}>
        {icon}
      </div>
      <span>{text}</span>
    </div>
  );
}

function AddProviderModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    year: 'Freshman',
    major: '',
    email: '',
    phone: '',
    availability: '',
    rate: '',
    experience: '',
    certifications: '',
    p2pServices: []
  });

  const p2pOptions = ['Care.com', 'Sittercity', 'UrbanSitter', 'Wyndy', 'Bambino'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.major && formData.email && formData.availability && formData.rate && formData.experience) {
      onAdd(formData);
    }
  };

  const toggleP2P = (service) => {
    setFormData(prev => ({
      ...prev,
      p2pServices: prev.p2pServices.includes(service)
        ? prev.p2pServices.filter(s => s !== service)
        : [...prev.p2pServices, service]
    }));
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000
      }}
      onClick={onClose}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
      >
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Playfair Display", serif'
          }}>
            Register as Provider
          </h2>
          <button
            onClick={onClose}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '8px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <X size={20} color="#666" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              label="Full Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
                  Year *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '2px solid #e5e5e5',
                    fontSize: '15px',
                    outline: 'none',
                    transition: 'border 0.3s ease',
                    background: 'white'
                  }}
                >
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>
              <Input
                label="Major *"
                value={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                placeholder="Education"
                required
              />
            </div>

            <Input
              label="Email *"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@stonehill.edu"
              required
            />

            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(555) 123-4567"
            />

            <Input
              label="Availability *"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              placeholder="Weekday evenings, weekends"
              required
            />

            <Input
              label="Hourly Rate *"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
              placeholder="$15-20/hour"
              required
            />

            <Input
              label="Experience *"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              placeholder="3 years babysitting, ages 2-10"
              required
            />

            <Input
              label="Certifications"
              value={formData.certifications}
              onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
              placeholder="CPR certified, First Aid"
            />

            <div>
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
                P2P Platform Profiles
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {p2pOptions.map((service) => (
                  <button
                    key={service}
                    type="button"
                    onClick={() => toggleP2P(service)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: '10px',
                      border: '2px solid',
                      borderColor: formData.p2pServices.includes(service) ? '#667eea' : '#e5e5e5',
                      background: formData.p2pServices.includes(service) 
                        ? 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)'
                        : 'white',
                      color: formData.p2pServices.includes(service) ? '#667eea' : '#666',
                      fontWeight: '600',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {service}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
                Select platforms where you have active profiles
              </p>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '16px',
                cursor: 'pointer',
                marginTop: '8px',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
              }}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Register Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, required, ...props }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px', color: '#333' }}>
        {label}
      </label>
      <input
        {...props}
        style={{
          width: '100%',
          padding: '12px 16px',
          borderRadius: '10px',
          border: '2px solid #e5e5e5',
          fontSize: '15px',
          outline: 'none',
          transition: 'border 0.3s ease'
        }}
        onFocus={(e) => e.target.style.borderColor = '#667eea'}
        onBlur={(e) => e.target.style.borderColor = '#e5e5e5'}
      />
    </div>
  );
}
