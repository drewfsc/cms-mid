/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';


import CMSHeader from '@/components/cms/CMSHeader';
import { Save, RotateCcw, Upload, X, Plus, Trash2, UserPlus, Crown, Shield, Edit3 } from 'lucide-react';
import { SiteConfigManager, SiteConfig, SiteColors } from '@/lib/site-config';
import { useState, useEffect } from 'react';

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'editor';
  status: 'active' | 'pending' | 'inactive';
  lastLogin?: string;
}

export default function CMSSettings() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([
    {
      id: '1',
      name: 'Drew McCauley',
      email: 'admin@reign.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@reign.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@reign.com',
      role: 'editor',
      status: 'pending',
      lastLogin: undefined
    }
  ]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'editor' as const });

  useEffect(() => {
    const config = SiteConfigManager.getSiteConfig();
    setSiteConfig(config);
    setLogoPreview(config.siteIcon || null);
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Logo file size must be less than 5MB');
      return;
    }

    setIsUploadingLogo(true);

    // Convert to base64 for storage (in a real app, you'd upload to a CDN)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setLogoPreview(dataUrl);
      setIsUploadingLogo(false);
      setHasChanges(true);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveLogo = () => {
    if (logoPreview && siteConfig) {
      const updatedConfig = { ...siteConfig, siteIcon: logoPreview };
      SiteConfigManager.saveSiteConfig(updatedConfig);
      setSiteConfig(updatedConfig);
      setHasChanges(false);
    }
  };

  const handleRemoveLogo = () => {
    if (siteConfig) {
      const updatedConfig = { ...siteConfig, siteIcon: undefined };
      SiteConfigManager.saveSiteConfig(updatedConfig);
      setSiteConfig(updatedConfig);
      setLogoPreview(null);
      setHasChanges(true);
    }
  };

  const handleBrandColorChange = (colorId: string, hex: string) => {
    if (!siteConfig) return;
    
    const updatedBrandColors = siteConfig.brandColors.map(color => 
      color.id === colorId ? { ...color, hex } : color
    );
    
    const updatedConfig = { ...siteConfig, brandColors: updatedBrandColors };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const handleBackgroundColorChange = (colorId: string, hex: string) => {
    if (!siteConfig) return;
    
    const updatedBackgroundColors = siteConfig.backgroundColors.map(color => 
      color.id === colorId ? { ...color, hex } : color
    );
    
    const updatedConfig = { ...siteConfig, backgroundColors: updatedBackgroundColors };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const addBrandColor = () => {
    if (!siteConfig) return;
    
    const newColor: SiteColors = {
      id: `brand-${Date.now()}`,
      name: 'Custom Brand Color',
      hex: '#3B82F6',
      description: 'Custom brand color'
    };
    
    const updatedConfig = { ...siteConfig, brandColors: [...siteConfig.brandColors, newColor] };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const addBackgroundColor = () => {
    if (!siteConfig) return;
    
    const newColor: SiteColors = {
      id: `bg-${Date.now()}`,
      name: 'Custom Background',
      hex: '#F3F4F6',
      description: 'Custom background color'
    };
    
    const updatedConfig = { ...siteConfig, backgroundColors: [...siteConfig.backgroundColors, newColor] };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const removeBrandColor = (colorId: string) => {
    if (!siteConfig) return;
    
    const updatedConfig = { 
      ...siteConfig, 
      brandColors: siteConfig.brandColors.filter(color => color.id !== colorId)
    };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const removeBackgroundColor = (colorId: string) => {
    if (!siteConfig) return;
    
    const updatedConfig = { 
      ...siteConfig, 
      backgroundColors: siteConfig.backgroundColors.filter(color => color.id !== colorId)
    };
    setSiteConfig(updatedConfig);
    setHasChanges(true);
  };

  const handleSaveAll = () => {
    if (siteConfig) {
      SiteConfigManager.saveSiteConfig(siteConfig);
      setHasChanges(false);
    }
  };

  const handleReset = () => {
    SiteConfigManager.resetToDefaults();
    const config = SiteConfigManager.getSiteConfig();
    setSiteConfig(config);
    setLogoPreview(config.siteIcon || null);
    setHasChanges(false);
  };

  const addTeamUser = () => {
    if (newUser.name && newUser.email) {
      const user: TeamUser = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: 'pending'
      };
      setTeamUsers([...teamUsers, user]);
      setNewUser({ name: '', email: '', role: 'editor' });
      setShowAddUser(false);
    }
  };

  const removeTeamUser = (userId: string) => {
    setTeamUsers(teamUsers.filter(user => user.id !== userId));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'manager': return Shield;
      case 'editor': return Edit3;
      default: return Edit3;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
      case 'manager': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      case 'editor': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
      case 'inactive': return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (!siteConfig) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <CMSHeader title="Site Settings" showBackButton={true} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Manage logo, colors, and team access
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2 inline" />
              Reset
            </button>
            <button
              onClick={handleSaveAll}
              disabled={!hasChanges}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save className="w-4 h-4 mr-2 inline" />
              Save Changes
            </button>
          </div>
        </div>

        {/* Logo Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 mb-8 border-0">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Site Logo</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Upload your site logo. Supports square or rectangular formats up to 5MB.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Current Logo Display */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Current Logo</h3>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-lg flex items-center justify-center bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Site Logo" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-400 font-bold text-lg">LOGO</span>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {logoPreview ? 'Custom logo uploaded' : 'No logo uploaded'}
                  </p>
                  {logoPreview && (
                    <button
                      onClick={handleRemoveLogo}
                      className="text-red-600 hover:text-red-700 text-sm flex items-center mt-1"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Remove logo
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Upload New Logo</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="space-y-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                    <div>
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                      </label>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, SVG up to 5MB. Square or rectangular formats supported.
                    </p>
                  </div>
                </div>

                {/* Preview */}
                {logoPreview && logoPreview !== siteConfig.siteIcon && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shadow-sm border">
                          <img 
                            src={logoPreview} 
                            alt="Logo Preview" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900 dark:text-blue-300">
                            New Logo Preview
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            Click save to apply changes
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setLogoPreview(siteConfig.siteIcon || null)}
                          className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSaveLogo}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                        >
                          Save Logo
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colors Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 mb-8 border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Brand Colors</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Primary brand colors used throughout the site
              </p>
            </div>
            <button
              onClick={addBrandColor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Color</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.brandColors.map((color) => (
              <div key={color.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{color.name}</h3>
                  <button
                    onClick={() => removeBrandColor(color.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="flex-1">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleBrandColorChange(color.id, e.target.value)}
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => handleBrandColorChange(color.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="#000000"
                    />
                  </div>
                  {color.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{color.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Colors Configuration */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 mb-8 border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Background Colors</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Background colors and gradients available for sections
              </p>
            </div>
            <button
              onClick={addBackgroundColor}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Color</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.backgroundColors.map((color) => (
              <div key={color.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">{color.name}</h3>
                  <button
                    onClick={() => removeBackgroundColor(color.id)}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    <div className="flex-1">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleBackgroundColorChange(color.id, e.target.value)}
                        className="w-full h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                      />
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => handleBackgroundColorChange(color.id, e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="#000000"
                    />
                  </div>
                  {color.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{color.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Gradient Examples */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">3-Stop Gradient Examples</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="w-full h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg mb-2"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Blue → Purple → Pink</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="w-full h-16 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-lg mb-2"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Green → Blue → Purple</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="w-full h-16 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 rounded-lg mb-2"></div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Yellow → Red → Pink</p>
              </div>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-3">
              💡 Use CSS gradients like <code>linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899)</code> for 3-stop gradients
            </p>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-neumorphic p-8 border-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Team Users</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage team access with admin, manager, and editor roles
              </p>
            </div>
            <button
              onClick={() => setShowAddUser(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>

          {/* Add User Form */}
          {showAddUser && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-medium text-blue-900 dark:text-blue-300 mb-4">Add New Team Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as 'admin' | 'manager' | 'editor' })}
                    className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="editor">Editor</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={addTeamUser}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add User
                </button>
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setNewUser({ name: '', email: '', role: 'editor' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Team Users List */}
          <div className="space-y-4">
            {teamUsers.map((user) => {
              const RoleIcon = getRoleIcon(user.role);
              return (
                <div key={user.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        <RoleIcon className="w-3 h-3 mr-1 inline" />
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </div>
                      <button
                        onClick={() => removeTeamUser(user.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {user.lastLogin && (
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Last login: {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Role Permissions Info */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Role Permissions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Crown className="w-4 h-4 text-red-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Admin</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Full system access</li>
                  <li>• User management</li>
                  <li>• Site settings</li>
                  <li>• All content editing</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Manager</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Content management</li>
                  <li>• Section editing</li>
                  <li>• User oversight</li>
                  <li>• Limited settings</li>
                </ul>
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Edit3 className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-gray-900 dark:text-white">Editor</span>
                </div>
                <ul className="text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Content editing</li>
                  <li>• Section management</li>
                  <li>• Media uploads</li>
                  <li>• Basic features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}



