import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SearchFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  size?: 'small' | 'medium';
}

export default function SearchField({ label, value, onChange, size = 'medium' }: SearchFieldProps) {
  return (
    <TextField
      fullWidth
      size={size}
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
