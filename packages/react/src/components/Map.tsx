import React, { useEffect, useRef } from 'react';
import { useMap, UseMapOptions } from '../hooks/useMap';
import { MapInstance } from '@gmaps-kit/core';

export interface MapProps extends UseMapOptions {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onMapReady?: (map: MapInstance) => void;
}

export const Map: React.FC<MapProps> = ({
  id,
  className,
  style,
  children,
  onMapReady,
  ...mapOptions
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { mapInstance, isReady } = useMap(id, { ...mapOptions, onMapReady });

  useEffect(() => {
    if (containerRef.current && !containerRef.current.id) {
      containerRef.current.id = id;
    }
  }, [id]);

  return (
    <div ref={containerRef} id={id} className={className} style={style}>
      {children}
    </div>
  );
};
