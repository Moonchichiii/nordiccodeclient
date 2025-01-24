// steps/LayoutForm.tsx
export const LayoutForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
      layout: initialData.layout || 'modern',
      navigation: initialData.navigation || 'top',
      header: {
        style: initialData.header?.style || 'minimal',
        sticky: initialData.header?.sticky || false,
      },
      contentWidth: initialData.contentWidth || 'contained',
      sections: initialData.sections || []
    });
   
    const layouts = [
      { id: 'modern', label: 'Modern', preview: '/layouts/modern.svg' },
      { id: 'classic', label: 'Classic', preview: '/layouts/classic.svg' },
      { id: 'minimal', label: 'Minimal', preview: '/layouts/minimal.svg' },
      { id: 'dynamic', label: 'Dynamic', preview: '/layouts/dynamic.svg' }
    ];
   
    const sectionTypes = [
      { id: 'hero', label: 'Hero Section', description: 'Full-width introduction area' },
      { id: 'features', label: 'Features Grid', description: 'Highlight key features/services' },
      { id: 'testimonials', label: 'Testimonials', description: 'Customer reviews section' },
      { id: 'cta', label: 'Call to Action', description: 'Convert visitors to customers' },
      { id: 'gallery', label: 'Media Gallery', description: 'Image/video showcase' }
    ];
   
    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        {/* Layout Selection */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium">Layout Style</h3>
          <div className="grid grid-cols-2 gap-4">
            {layouts.map(layout => (
              <label key={layout.id} className={`relative cursor-pointer group`}>
                <input
                  type="radio"
                  name="layout"
                  className="sr-only"
                  checked={formData.layout === layout.id}
                  onChange={() => setFormData(prev => ({ ...prev, layout: layout.id }))}
                />
                <div className={`p-4 rounded-xl border-2 transition-all duration-200
                  ${formData.layout === layout.id ? 'border-yellow-500 bg-yellow-500/10' : 
                  'border-gray-700 hover:border-gray-600'}`}>
                  <img src={layout.preview} alt={layout.label} className="w-full rounded-lg mb-4" />
                  <h4 className="font-medium text-center">{layout.label}</h4>
                </div>
              </label>
            ))}
          </div>
        </div>
   
        {/* Navigation */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium">Navigation & Header</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Navigation Style</label>
              <select
                value={formData.navigation}
                onChange={e => setFormData(prev => ({ ...prev, navigation: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="top">Top Bar</option>
                <option value="sidebar">Side Navigation</option>
                <option value="minimal">Minimal Menu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Header Style</label>
              <select
                value={formData.header.style}
                onChange={e => setFormData(prev => ({
                  ...prev,
                  header: { ...prev.header, style: e.target.value }
                }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2"
              >
                <option value="minimal">Minimal</option>
                <option value="centered">Centered</option>
                <option value="split">Split</option>
              </select>
            </div>
          </div>
        </div>
   
        {/* Section Builder */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Page Sections</h3>
          <div className="space-y-4">
            {sectionTypes.map(section => (
              <label
                key={section.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${formData.sections.includes(section.id) ? 'border-yellow-500 bg-yellow-500/10' : 
                  'border-gray-700 hover:border-gray-600'}`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={formData.sections.includes(section.id)}
                  onChange={e => {
                    const newSections = e.target.checked
                      ? [...formData.sections, section.id]
                      : formData.sections.filter(s => s !== section.id);
                    setFormData(prev => ({ ...prev, sections: newSections }));
                  }}
                />
                <div>
                  <h4 className="font-medium mb-1">{section.label}</h4>
                  <p className="text-sm text-gray-400">{section.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
   
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" size="lg">Back</Button>
          <Button type="submit" size="lg">Continue</Button>
        </div>
      </form>
    );
   };