import { useState } from 'react';
import { ChromePicker } from 'react-color';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';

const modernTypography = {
   fontPairs: [
      {
         heading: 'Inter',
         body: 'Open Sans',
         style: 'Modern & Clean',
         weights: {
            heading: [400, 500, 600],
            body: [300, 400, 500]
         }
      },
      {
         heading: 'Plus Jakarta Sans',
         body: 'Inter',
         style: 'Contemporary',
         weights: {
            heading: [500, 600, 700],
            body: [400, 500]
         }
      }
   ],
   scales: {
      fluid: {
         minScreen: '20rem',
         maxScreen: '96rem',
         ratio: 1.25
      },
      modular: {
         base: '1rem',
         ratio: 1.333
      }
   }
};

const spacingPresets = {
   compact: {
      base: '0.75rem',
      ratio: 1.2
   },
   comfortable: {
      base: '1rem',
      ratio: 1.5
   },
   spacious: {
      base: '1.25rem',
      ratio: 1.7
   }
};

export const BrandingForm = ({ onSubmit, initialData = {} }) => {
   const [formData, setFormData] = useState({
      brand: {
         name: initialData.brand?.name || '',
         colors: {
            primary: initialData.brand?.colors?.primary || '#F59E0B',
            secondary: initialData.brand?.colors?.secondary || '#1F2937',
            accent: initialData.brand?.colors?.accent || '#10B981'
         },
         themes: {
            light: initialData.brand?.themes?.light || true,
            dark: initialData.brand?.themes?.dark || true,
            system: initialData.brand?.themes?.system || true
         }
      },
      typography: {
         type: initialData.typography?.type || 'fluid',
         scale: {
            minScreen: initialData.typography?.scale?.minScreen || '20rem',
            maxScreen: initialData.typography?.scale?.maxScreen || '96rem',
            ratio: initialData.typography?.scale?.ratio || 1.25
         },
         fontPair: initialData.typography?.fontPair || modernTypography.fontPairs[0],
         responsiveText: initialData.typography?.responsiveText || true
      },
      spacing: {
         type: initialData.spacing?.type || 'fluid',
         preset: initialData.spacing?.preset || 'comfortable',
         customRatio: initialData.spacing?.customRatio || 1.5
      },
      animations: {
         preference: initialData.animations?.preference || 'full',
         motionSafe: initialData.animations?.motionSafe || true,
         timings: {
            base: initialData.animations?.timings?.base || '300ms',
            type: initialData.animations?.timings?.type || 'ease-out'
         },
         hover: initialData.animations?.hover || [],
         scroll: initialData.animations?.scroll || []
      },
      accessibility: {
         contrast: initialData.accessibility?.contrast || 'WCAG AA',
         reduceMotion: initialData.accessibility?.reduceMotion || false,
         colorBlind: initialData.accessibility?.colorBlind || false,
         focusRings: initialData.accessibility?.focusRings || 'visible'
      }
   });

   const updateFormData = (path: string, value: any) => {
      const paths = path.split('.');
      setFormData(prev => {
         let newData = { ...prev };
         let current = newData;
         for (let i = 0; i < paths.length - 1; i++) {
            current[paths[i]] = { ...current[paths[i]] };
            current = current[paths[i]];
         }
         current[paths[paths.length - 1]] = value;
         return newData;
      });
   };

   return (
      <form
         onSubmit={e => {
            e.preventDefault();
            onSubmit(formData);
         }}
      >
         {/* Brand Identity */}
         <section className="space-y-6 mb-12">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-medium">Brand Identity</h3>
               <span className="text-sm text-gray-400">Define your visual language</span>
            </div>

            <div className="space-y-8">
               {/* Brand Name */}
               <div>
                  <label className="text-sm font-medium mb-2">Brand Name</label>
                  <input
                     type="text"
                     value={formData.brand.name}
                     onChange={e => updateFormData('brand.name', e.target.value)}
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:border-yellow-500 transition-colors"
                  />
               </div>

               {/* Color System */}
               <div className="grid grid-cols-3 gap-8">
                  {Object.entries(formData.brand.colors).map(([key, value]) => (
                     <div key={key} className="space-y-4">
                        <label className="text-sm font-medium capitalize">{key}</label>
                        <ChromePicker
                           color={value}
                           onChange={color => updateFormData(`brand.colors.${key}`, color.hex)}
                           className="!bg-gray-900/50 !shadow-none"
                        />
                     </div>
                  ))}
               </div>

               {/* Theme Options */}
               <div className="space-y-4">
                  <label className="text-sm font-medium">Theme Support</label>
                  <div className="grid grid-cols-3 gap-4">
                     {Object.entries(formData.brand.themes).map(([key, enabled]) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                           <span className="capitalize">{key}</span>
                           <Switch
                              checked={enabled}
                              onChange={checked => updateFormData(`brand.themes.${key}`, checked)}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* Typography System */}
         <section className="space-y-6 mb-12">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-medium">Typography</h3>
               <span className="text-sm text-gray-400">Font scaling & pairing</span>
            </div>

            <div className="space-y-8">
               {/* Scale Type */}
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="text-sm font-medium mb-2">Scale Type</label>
                     <select
                        value={formData.typography.type}
                        onChange={e => updateFormData('typography.type', e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                     >
                        <option value="fluid">Fluid Scaling</option>
                        <option value="static">Static Scale</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-sm font-medium mb-2">Scale Ratio</label>
                     <input
                        type="number"
                        step="0.01"
                        min="1"
                        max="2"
                        value={formData.typography.scale.ratio}
                        onChange={e => updateFormData('typography.scale.ratio', parseFloat(e.target.value))}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                     />
                  </div>
               </div>

               {/* Font Pairs */}
               <div className="grid grid-cols-2 gap-6">
                  {modernTypography.fontPairs.map((pair, idx) => (
                     <button
                        key={idx}
                        type="button"
                        onClick={() => updateFormData('typography.fontPair', pair)}
                        className={`p-6 rounded-xl border-2 text-left transition-all duration-200 ${
                           formData.typography.fontPair === pair
                              ? 'border-yellow-500 bg-yellow-500/10'
                              : 'border-gray-700 hover:border-gray-600'
                        }`}
                     >
                        <h4 className="text-xl mb-2" style={{ fontFamily: pair.heading }}>
                           {pair.heading}
                        </h4>
                        <p className="text-gray-400" style={{ fontFamily: pair.body }}>
                           {pair.style}
                        </p>
                     </button>
                  ))}
               </div>
            </div>
         </section>

         {/* Animation & Motion */}
         <section className="space-y-6 mb-12"></section>
            <div className="flex justify-between items-center"></div>
               <h3 className="text-xl font-medium">Animation & Motion</h3>
               <span className="text-sm text-gray-400">Control animations and transitions</span>
            </div>

            <div className="space-y-8">
               {/* Animation Preference */}
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="text-sm font-medium mb-2">Animation Preference</label>
                     <select
                        value={formData.animations.preference}
                        onChange={e => updateFormData('animations.preference', e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                     >
                        <option value="full">Full Animations</option>
                        <option value="reduced">Reduced Animations</option>
                     </select>
                  </div>
                  <div>
                     <label className="text-sm font-medium mb-2">Motion Safe</label>
                     <Switch
                        checked={formData.animations.motionSafe}
                        onChange={checked => updateFormData('animations.motionSafe', checked)}
                     />
                  </div>
               </div>

               {/* Animation Timings */}
               <div className="grid grid-cols-2 gap-6">
                  <div>
                     <label className="text-sm font-medium mb-2">Base Timing</label>
                     <input
                        type="text"
                        value={formData.animations.timings.base}
                        onChange={e => updateFormData('animations.timings.base', e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                     />
                  </div>
                  <div>
                     <label className="text-sm font-medium mb-2">Timing Function</label>
                     <select
                        value={formData.animations.timings.type}
                        onChange={e => updateFormData('animations.timings.type', e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                     >
                        <option value="ease-out">Ease Out</option>
                        <option value="ease-in">Ease In</option>
                        <option value="linear">Linear</option>
                     </select>
                  </div>
               </div>
            </div>
         </section>

         {/* Accessibility */}
         <section className="space-y-6 mb-12">
            <div className="flex justify-between items-center">
               <h3 className="text-xl font-medium">Accessibility</h3>
               <span className="text-sm text-gray-400">Enhance accessibility options</span>
            </div>

            <div className="space-y-8">
               {/* Contrast */}
               <div>
                  <label className="text-sm font-medium mb-2">Contrast</label>
                  <select
                     value={formData.accessibility.contrast}
                     onChange={e => updateFormData('accessibility.contrast', e.target.value)}
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                  >
                     <option value="WCAG AA">WCAG AA</option>
                     <option value="WCAG AAA">WCAG AAA</option>
                  </select>
               </div>

               {/* Reduce Motion */}
               <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-sm font-medium">Reduce Motion</span>
                  <Switch
                     checked={formData.accessibility.reduceMotion}
                     onChange={checked => updateFormData('accessibility.reduceMotion', checked)}
                  />
               </div>

               {/* Color Blind Mode */}
               <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                  <span className="text-sm font-medium">Color Blind Mode</span>
                  <Switch
                     checked={formData.accessibility.colorBlind}
                     onChange={checked => updateFormData('accessibility.colorBlind', checked)}
                  />
               </div>

               {/* Focus Rings */}
               <div>
                  <label className="text-sm font-medium mb-2">Focus Rings</label>
                  <select
                     value={formData.accessibility.focusRings}
                     onChange={e => updateFormData('accessibility.focusRings', e.target.value)}
                     className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3"
                  >
                     <option value="visible">Visible</option>
                     <option value="hidden">Hidden</option>
                  </select>
               </div>
            </div>
         </section>

         <div className="flex justify-end space-x-4 mt-12">
            <Button variant="outline" size="lg">Back</Button>
            <Button type="submit" size="lg">Continue</Button>
         </div>
      </form>
   );
};