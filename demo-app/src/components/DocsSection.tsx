import React, { useState } from 'react';
import { OverviewSection } from './docs/OverviewSection';
import { CoreSection } from './docs/CoreSection';
import { HooksSection } from './docs/HooksSection';
import { ComponentsSection } from './docs/ComponentsSection';
import { ExamplesSection } from './docs/ExamplesSection';

type DocSection = 'overview' | 'core' | 'hooks' | 'components' | 'examples';

export const DocsSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DocSection>('overview');

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'core':
        return <CoreSection />;
      case 'hooks':
        return <HooksSection />;
      case 'components':
        return <ComponentsSection />;
      case 'examples':
        return <ExamplesSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('core')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'core'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Core Package
            </button>
            <button
              onClick={() => setActiveSection('hooks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'hooks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Hooks (20)
            </button>
            <button
              onClick={() => setActiveSection('components')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'components'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Components
            </button>
            <button
              onClick={() => setActiveSection('examples')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'examples'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Examples
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="px-6">{renderContent()}</div>
    </div>
  );
};
