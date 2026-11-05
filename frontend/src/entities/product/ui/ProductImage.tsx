import { Box, BoxProps } from '@mui/material';
import { Product } from '../model/types';

interface ProductImageProps {
  product: Pick<Product, 'emoji' | 'tint'>;
  width?: BoxProps['width'];
  height: BoxProps['height'];
  fontSize: BoxProps['fontSize'];
  borderRadius?: BoxProps['borderRadius'];
}

/** Эмодзи на цветном фоне вместо фотографии товара. */
export default function ProductImage({ product, width, height, fontSize, borderRadius }: ProductImageProps) {
  return (
    <Box
      sx={{
        width,
        height,
        fontSize,
        borderRadius,
        bgcolor: product.tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {product.emoji}
    </Box>
  );
}
