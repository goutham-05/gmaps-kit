import { useState, useCallback } from 'react';

export interface GeometryCalculation {
  distance: number;
  bearing: number;
  heading: number;
  area: number;
  perimeter: number;
}

export interface UseGeometryReturn {
  isLoading: boolean;
  error: Error | null;
  results: GeometryCalculation | null;
  computeDistanceBetween: (
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral
  ) => number;
  computeHeading: (
    from: google.maps.LatLngLiteral,
    to: google.maps.LatLngLiteral
  ) => number;
  computeOffset: (
    from: google.maps.LatLngLiteral,
    distance: number,
    heading: number
  ) => google.maps.LatLngLiteral;
  computeOffsetOrigin: (
    to: google.maps.LatLngLiteral,
    distance: number,
    heading: number
  ) => google.maps.LatLngLiteral;
  computeLength: (path: google.maps.LatLngLiteral[]) => number;
  computeArea: (path: google.maps.LatLngLiteral[]) => number;
  computeBounds: (
    path: google.maps.LatLngLiteral[]
  ) => google.maps.LatLngBounds;
  computeCenter: (
    path: google.maps.LatLngLiteral[]
  ) => google.maps.LatLngLiteral;
  isLocationOnEdge: (
    point: google.maps.LatLngLiteral,
    polyline: google.maps.LatLngLiteral[],
    tolerance?: number
  ) => boolean;
  encodePath: (path: google.maps.LatLngLiteral[]) => string;
  decodePath: (encodedPath: string) => google.maps.LatLngLiteral[];
  spherical: typeof google.maps.geometry.spherical;
  encoding: typeof google.maps.geometry.encoding;
  poly: typeof google.maps.geometry.poly;
}

export function useGeometry(): UseGeometryReturn {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  const [results] = useState<GeometryCalculation | null>(null);

  const computeDistanceBetween = useCallback(
    (
      from: google.maps.LatLngLiteral,
      to: google.maps.LatLngLiteral
    ): number => {
      return google.maps.geometry.spherical.computeDistanceBetween(
        new google.maps.LatLng(from.lat, from.lng),
        new google.maps.LatLng(to.lat, to.lng)
      );
    },
    []
  );

  const computeHeading = useCallback(
    (
      from: google.maps.LatLngLiteral,
      to: google.maps.LatLngLiteral
    ): number => {
      return google.maps.geometry.spherical.computeHeading(
        new google.maps.LatLng(from.lat, from.lng),
        new google.maps.LatLng(to.lat, to.lng)
      );
    },
    []
  );

  const computeOffset = useCallback(
    (
      from: google.maps.LatLngLiteral,
      distance: number,
      heading: number
    ): google.maps.LatLngLiteral => {
      const offset = google.maps.geometry.spherical.computeOffset(
        new google.maps.LatLng(from.lat, from.lng),
        distance,
        heading
      );
      return { lat: offset.lat(), lng: offset.lng() };
    },
    []
  );

  const computeOffsetOrigin = useCallback(
    (
      to: google.maps.LatLngLiteral,
      distance: number,
      heading: number
    ): google.maps.LatLngLiteral => {
      const origin = google.maps.geometry.spherical.computeOffsetOrigin(
        new google.maps.LatLng(to.lat, to.lng),
        distance,
        heading
      );
      if (!origin) {
        throw new Error('Could not compute offset origin');
      }
      return { lat: origin.lat(), lng: origin.lng() };
    },
    []
  );

  const computeLength = useCallback(
    (path: google.maps.LatLngLiteral[]): number => {
      const latLngPath = path.map(
        (point) => new google.maps.LatLng(point.lat, point.lng)
      );
      return google.maps.geometry.spherical.computeLength(latLngPath);
    },
    []
  );

  const computeArea = useCallback(
    (path: google.maps.LatLngLiteral[]): number => {
      const latLngPath = path.map(
        (point) => new google.maps.LatLng(point.lat, point.lng)
      );
      return google.maps.geometry.spherical.computeArea(latLngPath);
    },
    []
  );

  const computeBounds = useCallback(
    (path: google.maps.LatLngLiteral[]): google.maps.LatLngBounds => {
      if (path.length === 0) {
        return new google.maps.LatLngBounds();
      }

      const bounds = new google.maps.LatLngBounds();
      path.forEach((point) => {
        bounds.extend(new google.maps.LatLng(point.lat, point.lng));
      });
      return bounds;
    },
    []
  );

  const computeCenter = useCallback(
    (path: google.maps.LatLngLiteral[]): google.maps.LatLngLiteral => {
      if (path.length === 0) {
        return { lat: 0, lng: 0 };
      }

      if (path.length === 1) {
        return path[0];
      }

      // Compute average of all points
      const avgLat =
        path.reduce((sum, point) => sum + point.lat, 0) / path.length;
      const avgLng =
        path.reduce((sum, point) => sum + point.lng, 0) / path.length;
      return { lat: avgLat, lng: avgLng };
    },
    []
  );

  const isLocationOnEdge = useCallback(
    (
      point: google.maps.LatLngLiteral,
      polyline: google.maps.LatLngLiteral[],
      tolerance?: number
    ): boolean => {
      const pointLatLng = new google.maps.LatLng(point.lat, point.lng);
      const polylineLatLng = polyline.map(
        (p) => new google.maps.LatLng(p.lat, p.lng)
      );
      // Create a temporary polyline for the geometry check
      const tempPolyline = new google.maps.Polyline({
        path: polylineLatLng,
      });
      return google.maps.geometry.poly.isLocationOnEdge(
        pointLatLng,
        tempPolyline,
        tolerance
      );
    },
    []
  );

  const encodePath = useCallback(
    (path: google.maps.LatLngLiteral[]): string => {
      const latLngPath = path.map(
        (point) => new google.maps.LatLng(point.lat, point.lng)
      );
      return google.maps.geometry.encoding.encodePath(latLngPath);
    },
    []
  );

  const decodePath = useCallback(
    (encodedPath: string): google.maps.LatLngLiteral[] => {
      const latLngPath = google.maps.geometry.encoding.decodePath(encodedPath);
      return latLngPath.map((point) => ({
        lat: point.lat(),
        lng: point.lng(),
      }));
    },
    []
  );

  return {
    isLoading,
    error,
    results,
    computeDistanceBetween,
    computeHeading,
    computeOffset,
    computeOffsetOrigin,
    computeLength,
    computeArea,
    computeBounds,
    computeCenter,
    isLocationOnEdge,
    encodePath,
    decodePath,
    spherical: google.maps.geometry.spherical,
    encoding: google.maps.geometry.encoding,
    poly: google.maps.geometry.poly,
  };
}
