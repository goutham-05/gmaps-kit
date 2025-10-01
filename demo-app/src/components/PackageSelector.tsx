import React from 'react';

export type PackageType = 'core' | 'react' | 'docs';

export interface PackageSelectorProps {
  selectedPackage: PackageType;
  onPackageChange: (pkg: PackageType) => void;
}

export const PackageSelector: React.FC<PackageSelectorProps> = ({
  selectedPackage,
  onPackageChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">gmaps-kit</h1>
            </div>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedPackage === 'core'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onPackageChange('core')}
              >
                Core
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedPackage === 'react'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onPackageChange('react')}
              >
                React
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  selectedPackage === 'docs'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => onPackageChange('docs')}
              >
                Docs
              </button>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {selectedPackage === 'core'
              ? 'Framework-agnostic utilities'
              : selectedPackage === 'react'
                ? 'React hooks & components'
                : 'Documentation & examples'}
          </div>
        </div>
      </div>
    </div>
  );
};
