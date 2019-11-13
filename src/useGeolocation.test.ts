jest.mock('@capacitor/core', () => {
  let watchListener: any;

  let positions = [
    [43.0664229,-89.3978106],
    [43.0726269,-89.3807787],
    [43.0639252,-89.3879085],
    [43.0542669,-89.3788027]
  ];
  let position = positions[0];
  let pos = 0;

  return {
    Plugins: {
      Geolocation: {
        positions: positions,
        __updatePosition: () => {
          position = positions[++pos % positions.length];
          watchListener({
            timestamp: 1573676975,
            coords: {
              latitude: position[0],
              longitude: position[1],
              accuracy: 1
            }
          });
        },
        clearWatch: ({ id }: { id: string }) => {
        },
        watchPosition: async (options: GeolocationOptions, cb: (pos: GeolocationPosition, err: any) => void) => {
          watchListener = cb;
          watchListener({
            timestamp: 1573676975,
            coords: {
              latitude: position[0],
              longitude: position[1],
              accuracy: 1
            }
          });

          return 'testid';
        },
      }
    }
  }
});

import { Plugins, GeolocationOptions, GeolocationPosition } from '@capacitor/core';

import { useGeolocation } from './useGeolocation';

import { renderHook, act } from '@testing-library/react-hooks'

it('Gets current geolocation position', async () => {
  const r = renderHook(() => useGeolocation());
  const geoMock = (Plugins.Geolocation as any);

  function match(pos: GeolocationPosition, coords: [number, number]) {
    expect(pos).toMatchObject({
      coords: {
        latitude: coords[0],
        longitude: coords[1] 
      }
    });
  }

  await act(async function() {
    const [ currentPosition ] = r.result.current as any;
    match(currentPosition, geoMock.positions[0]);
    (Plugins.Geolocation as any).__updatePosition();
  });
  await act(async function() {
    const [ currentPosition ] = r.result.current as any;
    match(currentPosition, geoMock.positions[1]);
    (Plugins.Geolocation as any).__updatePosition();
  });
  await act(async function() {
    const [ currentPosition ] = r.result.current as any;
    match(currentPosition, geoMock.positions[2]);
    (Plugins.Geolocation as any).__updatePosition();
  });
  await act(async function() {
    const [ currentPosition ] = r.result.current as any;
    match(currentPosition, geoMock.positions[3]);
    (Plugins.Geolocation as any).__updatePosition();
  });
});