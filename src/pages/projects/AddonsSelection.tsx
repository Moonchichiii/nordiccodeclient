import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowUpRight, CheckCircle2, ArrowLeft } from 'lucide-react'
import { PackageData } from './ProjectSelection'

import { useAddons } from '@/features/projects/hooks/useAddons'
import { toast } from 'react-toastify'

export interface Addon {
    id: string
    title: string
    description: string
    priceEUR: string
    priceSEK: string
    compatible: Array<'static' | 'fullstack' | 'enterprise'>
}

export const addons: Addon[] = [
    {
        id: 'seo',
        title: 'Advanced SEO Package',
        description: 'Enhanced SEO optimization including keyword research, meta optimization, and sitemap generation',
        priceEUR: '300',
        priceSEK: '3,100',
        compatible: ['static', 'fullstack', 'enterprise']
    },
    {
        id: 'analytics',
        title: 'Analytics Integration',
        description: 'Custom analytics dashboard with user behavior tracking and conversion metrics',
        priceEUR: '250',
        priceSEK: '2,600',
        compatible: ['fullstack', 'enterprise']
    },
    {
        id: 'maintenance',
        title: 'Extended Maintenance',
        description: '3 months of additional maintenance and support after the initial support period',
        priceEUR: '400',
        priceSEK: '4,200',
        compatible: ['static', 'fullstack', 'enterprise']
    },
    {
        id: 'cdn',
        title: 'Global CDN Setup',
        description: 'Content delivery network configuration for faster global access',
        priceEUR: '200',
        priceSEK: '2,100',
        compatible: ['fullstack', 'enterprise']
    }
]

export const enterpriseIncludedAddons = ['analytics', 'seo', 'maintenance', 'cdn']

interface AddonsSelectionProps {
    selectedPackage: PackageData
    onBack: () => void
}

const AddonsSelection = ({ selectedPackage, onBack }: AddonsSelectionProps) => {
    const navigate = useNavigate()
    const { addons, enterpriseIncludedAddons, saveAddons, isPending } = useAddons()
    const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set())

    const isEnterpriseIncluded = useCallback(
        (addonId: string) =>
            selectedPackage.id === 'enterprise' && enterpriseIncludedAddons.includes(addonId),
        [selectedPackage, enterpriseIncludedAddons]
    )

    const toggleAddon = (addonId: string) => {
        setSelectedAddons(prev => {
            const newSet = new Set(prev)
            newSet.has(addonId) ? newSet.delete(addonId) : newSet.add(addonId)
            return newSet
        })
    }

    const calculateTotal = useCallback(() => {
        let total = parsePrice(selectedPackage.priceEUR)
        selectedAddons.forEach(addonId => {
            const addon = addons.find(a => a.id === addonId)
            if (addon && !isEnterpriseIncluded(addon.id)) {
                total += parsePrice(addon.priceEUR)
            }
        })
        return total
    }, [selectedAddons, selectedPackage, addons, isEnterpriseIncluded])

    const handleContinue = async () => {
        try {
            await saveAddons.mutateAsync({
                packageId: selectedPackage.id,
                selectedAddons
            })

            navigate('/dashboard/payment-starter', {
                state: {
                    selectedPackage,
                    selectedAddons: Array.from(selectedAddons)
                }
            })
        } catch (err) {
            toast.error('Failed to save addons')
        }
    }

    const visibleAddons = useMemo(
        () => addons.filter(addon => addon.compatible.includes(selectedPackage.id)),
        [addons, selectedPackage]
    )

    return (
        <main className="w-full max-w-6xl mx-auto p-6">
            <Header onBack={onBack} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <PackageInfo selectedPackage={selectedPackage} />
                    <AddonsList
                        addons={visibleAddons}
                        selectedAddons={selectedAddons}
                        isEnterpriseIncluded={isEnterpriseIncluded}
                        onToggle={toggleAddon}
                    />
                </div>

                <OrderSummary
                    selectedPackage={selectedPackage}
                    selectedAddons={selectedAddons}
                    addons={addons}
                    total={calculateTotal()}
                    isPending={isPending}
                    onContinue={handleContinue}
                />
            </div>
        </main>
    )
}

const Header = ({ onBack }: { onBack: () => void }) => (
    <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-light text-white">Customize Your Package</h2>
    </div>
)

const PackageInfo = ({ selectedPackage }: { selectedPackage: PackageData }) => (
    <div className="p-6 rounded-xl bg-gray-800/50 space-y-4">
        <div className="flex items-start justify-between">
            <div>
                <h3 className="text-xl font-light text-white">
                    {selectedPackage.title}
                </h3>
                <p className="text-sm text-gray-400 mt-1">Selected Package</p>
            </div>
            <div className="text-right">
                <div className="flex items-baseline">
                    <span className="text-2xl font-light text-white">
                        €{selectedPackage.priceEUR}
                    </span>
                    <span className="ml-2 text-sm text-gray-400">EUR</span>
                </div>
                <div className="flex items-baseline mt-1">
                    <span className="text-sm font-light text-gray-400">
                        {selectedPackage.priceSEK}
                    </span>
                    <span className="ml-1 text-xs text-gray-500">SEK</span>
                </div>
            </div>
        </div>
    </div>
)

const AddonsList = ({
    addons,
    selectedAddons,
    isEnterpriseIncluded,
    onToggle
}: {
    addons: Addon[]
    selectedAddons: Set<string>
    isEnterpriseIncluded: (id: string) => boolean
    onToggle: (id: string) => void
}) => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Available Add-ons</h3>
        <div className="space-y-4">
            {addons.map(addon => {
                const included = isEnterpriseIncluded(addon.id)

                return (
                    <div
                        key={addon.id}
                        onClick={() => {
                            if (!included) {
                                onToggle(addon.id)
                            }
                        }}
                        className={`w-full p-4 rounded-xl border transition-all duration-200 text-left
                            ${
                                included
                                    ? 'border-green-500 bg-green-500/10 cursor-not-allowed'
                                    : selectedAddons.has(addon.id)
                                    ? 'border-yellow-500 bg-yellow-500/10'
                                    : 'border-gray-700/50 hover:border-yellow-500/50'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <CheckCircle2
                                className={`w-5 h-5 mt-0.5
                                    ${
                                        included
                                            ? 'text-green-500'
                                            : selectedAddons.has(addon.id)
                                            ? 'text-yellow-500'
                                            : 'text-gray-500'
                                    }
                                `}
                            />
                            <div className="flex-grow">
                                <h4 className="text-white font-medium">
                                    {addon.title}{' '}
                                    {included && (
                                        <span className="text-xs text-green-400 ml-2">
                                            (Included in Enterprise)
                                        </span>
                                    )}
                                </h4>
                                <p className="text-sm text-gray-400 mt-1">
                                    {addon.description}
                                </p>
                            </div>
                            {!included && (
                                <div className="text-right">
                                    <div className="flex items-baseline">
                                        <span className="text-lg font-light text-white">
                                            €{addon.priceEUR}
                                        </span>
                                        <span className="ml-2 text-sm text-gray-400">EUR</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {addon.priceSEK} SEK
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
)

const OrderSummary = ({
    selectedPackage,
    selectedAddons,
    addons,
    total,
    isPending,
    onContinue
}: {
    selectedPackage: PackageData
    selectedAddons: Set<string>
    addons: Addon[]
    total: number
    isPending: boolean
    onContinue: () => Promise<void>
}) => (
    <div className="lg:sticky lg:top-6 h-fit">
        <div className="p-6 rounded-xl bg-gray-800/50 space-y-6">
            <h3 className="text-lg font-medium text-white">Order Summary</h3>

            <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-300">
                    <span>Base Package</span>
                    <span>€{selectedPackage.priceEUR}</span>
                </div>

                {Array.from(selectedAddons).map(addonId => {
                    const addon = addons.find(a => a.id === addonId)
                    return addon ? (
                        <div key={addonId} className="flex justify-between text-gray-300">
                            <span>{addon.title}</span>
                            <span>€{addon.priceEUR}</span>
                        </div>
                    ) : null
                })}

                <div className="pt-3 border-t border-gray-700/30">
                    <div className="flex justify-between text-white">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">€{total}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={onContinue}
                disabled={isPending}
                className="w-full py-3 px-4 rounded-lg text-sm font-medium 
                       transition-all duration-300 flex items-center justify-center gap-2
                       bg-yellow-500 text-gray-900 hover:bg-yellow-400 disabled:opacity-50"
            >
                <span>Continue to Payment</span>
                <ArrowUpRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5 
                               group-hover:-translate-y-0.5"
                />
            </button>
        </div>
    </div>
)

function parsePrice(str: string): number {
    return parseInt(str.replace(/,/g, ''), 10)
}

export default AddonsSelection
