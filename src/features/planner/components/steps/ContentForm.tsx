// steps/ContentForm.tsx
export const ContentForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
      contentTypes: initialData.contentTypes || [],
      seoSettings: initialData.seoSettings || {
        metaTags: true,
        siteMap: true,
        schema: true
      },
      multilingual: initialData.multilingual || false,
      languages: initialData.languages || [],
      dynamicContent: initialData.dynamicContent || {
        enabled: false,
        types: []
      }
    });
   
    const contentTypes = [
      { 
        id: 'blog',
        label: 'Blog System',
        description: 'Full featured blogging capability',
        features: ['Categories', 'Tags', 'Comments', 'Author profiles']
      },
      {
        id: 'portfolio',
        label: 'Portfolio Gallery',
        description: 'Showcase work/projects',
        features: ['Filtering', 'Detail views', 'Categories']
      },
      {
        id: 'products',
        label: 'Product Catalog',
        description: 'Display products/services',
        features: ['Categories', 'Search', 'Filters']
      }
    ];
   
    const languages = [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' },
      { code: 'se', name: 'Swedish' }
    ];
   
    const dynamicContentTypes = [
      { id: 'feed', label: 'Social Feed Integration' },
      { id: 'reviews', label: 'User Reviews/Ratings' },
      { id: 'analytics', label: 'Usage Analytics' }
    ];
   
    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        {/* Content Types */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium">Content Management</h3>
          <div className="grid grid-cols-3 gap-4">
            {contentTypes.map(type => (
              <div
                key={type.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200
                  ${formData.contentTypes.includes(type.id) 
                    ? 'border-yellow-500 bg-yellow-500/10' 
                    : 'border-gray-700'}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-medium">{type.label}</h4>
                  <Switch
                    checked={formData.contentTypes.includes(type.id)}
                    onChange={(checked) => {
                      setFormData(prev => ({
                        ...prev,
                        contentTypes: checked 
                          ? [...prev.contentTypes, type.id]
                          : prev.contentTypes.filter(t => t !== type.id)
                      }));
                    }}
                  />
                </div>
                <p className="text-sm text-gray-400 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-400 flex items-center">
                      <Check className="w-4 h-4 mr-2 text-yellow-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
   
        {/* SEO Settings */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium">SEO Configuration</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(formData.seoSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                <Switch
                  checked={value}
                  onChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      seoSettings: {
                        ...prev.seoSettings,
                        [key]: checked
                      }
                    }));
                  }}
                />
              </div>
            ))}
          </div>
        </div>
   
        {/* Multilingual Support */}
        <div className="space-y-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Multilingual Support</h3>
            <Switch
              checked={formData.multilingual}
              onChange={(checked) => {
                setFormData(prev => ({
                  ...prev,
                  multilingual: checked,
                  languages: checked ? ['en'] : []
                }));
              }}
            />
          </div>
          
          {formData.multilingual && (
            <div className="grid grid-cols-5 gap-4">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      languages: prev.languages.includes(lang.code)
                        ? prev.languages.filter(l => l !== lang.code)
                        : [...prev.languages, lang.code]
                    }));
                  }}
                  className={`p-3 rounded-lg border-2 transition-all duration-200
                    ${formData.languages.includes(lang.code)
                      ? 'border-yellow-500 bg-yellow-500/10'
                      : 'border-gray-700'}`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>
   
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" size="lg">Back</Button>
          <Button type="submit" size="lg">Review Plan</Button>
        </div>
      </form>
    );
   };