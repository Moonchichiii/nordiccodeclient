export interface PackageData {
  id: PackageType
  title: string
  priceEUR: string
  priceSEK: string
  features: string[]
  extraFeatures: string[]
  recommended?: boolean
}

export type PackageType = 'static' | 'fullstack' | 'enterprise'

export interface Addon {
  id: string
  title: string
  description: string
  priceEUR: string
  priceSEK: string
  compatible: PackageType[]
}