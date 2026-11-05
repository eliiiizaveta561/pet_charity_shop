import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { Box, BoxProps, Button, Typography } from '@mui/material';
import { Charity } from '../model/types';

const makeIcon = (active: boolean) =>
  L.divIcon({
    className: '',
    html: `<div class="paw-marker${active ? ' paw-marker--active' : ''}">🐾</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });

function FlyToSelected({ charity }: { charity: Charity | undefined }) {
  const map = useMap();
  const lat = charity?.lat;
  const lng = charity?.lng;

  useEffect(() => {
    if (lat !== undefined && lng !== undefined) {
      map.flyTo([lat, lng], Math.max(map.getZoom(), 7), { duration: 0.8 });
    }
  }, [lat, lng, map]);

  return null;
}

interface CharityMapProps {
  charities: Charity[];
  selectedId: number | null;
  onSelect: (charity: Charity) => void;
  height?: BoxProps['height'];
}

export default function CharityMap({ charities, selectedId, onSelect, height = 520 }: CharityMapProps) {
  const selected = charities.find((c) => c.id === selectedId);

  return (
    <Box sx={{ height, borderRadius: 3, overflow: 'hidden', border: 1, borderColor: 'divider' }}>
      <MapContainer center={[56.5, 40]} zoom={4} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; участники <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyToSelected charity={selected} />
        {charities.map((charity) => (
          <Marker
            key={charity.id}
            position={[charity.lat, charity.lng]}
            icon={makeIcon(charity.id === selectedId)}
          >
            <Popup>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {charity.name}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {charity.city}, {charity.address}
              </Typography>
              <Button
                size="small"
                variant="contained"
                disabled={charity.id === selectedId}
                onClick={() => onSelect(charity)}
              >
                {charity.id === selectedId ? 'Выбрана' : 'Выбрать'}
              </Button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
}
