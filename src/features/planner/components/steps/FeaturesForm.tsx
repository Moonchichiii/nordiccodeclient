// steps/FeaturesForm.tsx
export const FeaturesForm = ({ onSubmit, initialData = {} }) => {
    const [formData, setFormData] = useState({
      features: initialData.features || [],
      interactivity: initialData.interactivity || [],
      accessibility: initialData.accessibility || [],
      performance: initialData.performance || []
    });
   
    const featureOptions = {
      core: [
        { id: 'auth', label: 'User Authentication', description: 'Secure login/registration system' },
        { id: 'profiles', label: 'User Profiles', description: 'Customizable user profiles' },
        { id: 'search', label: 'Search Functionality', description: 'Advanced search capabilities' },
        { id: 'notifications', label: 'Notifications', description: 'Real-time user notifications' }
      ],
      interactivity: [
        { id: 'infinite-scroll', label: 'Infinite Scrolling', description: 'Seamless content loading' },
        { id: 'drag-drop', label: 'Drag & Drop', description: 'Intuitive drag and drop interfaces' },
        { id: 'real-time', label: 'Real-time Updates', description: 'Live data synchronization' },
        { id: 'filters', label: 'Dynamic Filtering', description: 'Advanced content filtering' }
      ]
    };
   
    const accessibilityOptions = [
      { id: 'aria', label: 'ARIA Labels', description: 'Screen reader support' },
      { id: 'keyboard', label: 'Keyboard Navigation', description: 'Full keyboard control' },
      { id: 'contrast', label: 'High Contrast', description: 'Enhanced visual contrast' }
    ];
   
    return (
      <form onSubmit={e => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        {/* Core Features */}
        <div className="space-y-6 mb-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Core Features</h3>
            <span className="text-sm text-gray-400">Select features for your project</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {featureOptions.core.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                selected={formData.features.includes(feature.id)}
                onChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    features: checked 
                      ? [...prev.features, feature.id]
                      : prev.features.filter(f => f !== feature.id)
                  }));
                }}
              />
            ))}
          </div>
        </div>
   
        {/* Interactive Features */}
        <div className="space-y-6 mb-8">
          <h3 className="text-lg font-medium">Interactive Elements</h3>
          <div className="grid grid-cols-2 gap-4">
            {featureOptions.interactivity.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                selected={formData.interactivity.includes(feature.id)}
                onChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    interactivity: checked 
                      ? [...prev.interactivity, feature.id]
                      : prev.interactivity.filter(f => f !== feature.id)
                  }));
                }}
              />
            ))}
          </div>
        </div>
   
        {/* Accessibility */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium">Accessibility Features</h3>
          <div className="grid grid-cols-3 gap-4">
            {accessibilityOptions.map(feature => (
              <FeatureCard
                key={feature.id}
                feature={feature}
                selected={formData.accessibility.includes(feature.id)}
                onChange={(checked) => {
                  setFormData(prev => ({
                    ...prev,
                    accessibility: checked 
                      ? [...prev.accessibility, feature.id]
                      : prev.accessibility.filter(f => f !== feature.id)
                  }));
                }}
                variant="compact"
              />
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
   
