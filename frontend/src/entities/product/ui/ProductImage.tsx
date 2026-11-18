import { Box, BoxProps } from '@mui/material';
import { Product, productTint } from '../model/types';

interface ProductImageProps {
  product: Pick<Product, 'id' | 'emoji'>;
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
        bgcolor: productTint(product.id),
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
