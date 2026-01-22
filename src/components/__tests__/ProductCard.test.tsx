import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';
import { BrowserRouter } from 'react-router-dom';
import { StoreProvider } from '../../store/StoreContext';
import '../../i18n'; // Init i18n

const mockProduct = {
  id: '1',
  name: { en: 'Test Product', ar: 'منتج تجريبي' },
  price: 100,
  category: 'receivers',
  brand: 'Test Brand',
  image: 'test.jpg',
  description: { en: 'Desc', ar: 'وصف' },
  features: ['f1'],
  rating: 4.5,
  inStock: true
};

describe('ProductCard', () => {
  it('renders product name and price', () => {
    render(
      <StoreProvider>
        <BrowserRouter>
          <ProductCard product={mockProduct} />
        </BrowserRouter>
      </StoreProvider>
    );

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });
});
