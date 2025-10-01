import React from 'react';
import { SectionCard } from '../SectionCard';
import { CodeSnippet } from '../CodeSnippet';

export const ComponentsSection: React.FC = () => (
  <div className="space-y-6">
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        React Components
      </h2>
      <p className="text-lg text-gray-600">
        Pre-built React components for Google Maps integration.
      </p>
    </div>

    <div className="grid gap-6">
      <SectionCard
        title="Map Component"
        description="Main map component with all Google Maps features"
      >
        <CodeSnippet
          code={`import { Map } from '@gmaps-kit/react';

<Map 
  center={{ lat: 40.7128, lng: -74.006 }} 
  zoom={12} 
  className="h-96 w-full"
>
  <Marker position={{ lat: 40.7128, lng: -74.006 }} title="NYC" />
  <InfoWindow 
    position={{ lat: 40.7128, lng: -74.006 }}
    content="<h3>Hello World</h3>"
    visible={true}
  />
</Map>`}
        />
      </SectionCard>

      <SectionCard
        title="Marker Component"
        description="Individual marker component"
      >
        <CodeSnippet
          code={`import { Marker } from '@gmaps-kit/react';

<Marker
  position={{ lat: 40.7128, lng: -74.006 }}
  title="New York City"
  draggable={true}
  onClick={(event) => console.log('Marker clicked', event)}
  onDragEnd={(event) => console.log('Marker dragged', event)}
/>`}
        />
      </SectionCard>

      <SectionCard
        title="InfoWindow Component"
        description="InfoWindow component for displaying content"
      >
        <CodeSnippet
          code={`import { InfoWindow } from '@gmaps-kit/react';

<InfoWindow
  position={{ lat: 40.7128, lng: -74.006 }}
  content="<h3>Hello World</h3>"
  visible={true}
  onClose={() => console.log('InfoWindow closed')}
/>`}
        />
      </SectionCard>
    </div>
  </div>
);
