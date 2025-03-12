
import React from 'react';
import { render, screen } from '../../utils/test-utils';
import ActionButton from './ActionButton';
import { Sprout } from 'lucide-react';

describe('ActionButton', () => {
  it('renders correctly with default props', () => {
    render(
      <ActionButton 
        title="Test Button" 
        icon={<Sprout />} 
        href="/test"
      />
    );
    
    expect(screen.getByText('Test Button')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/test');
  });

  it('applies the correct variant class', () => {
    const { rerender } = render(
      <ActionButton 
        title="Default Button" 
        icon={<Sprout />} 
        href="/test"
        variant="default"
      />
    );
    
    const defaultButton = screen.getByRole('link').parentElement;
    expect(defaultButton).toHaveClass('text-primary-foreground');
    
    rerender(
      <ActionButton 
        title="Outline Button" 
        icon={<Sprout />} 
        href="/test"
        variant="outline"
      />
    );
    
    const outlineButton = screen.getByRole('link').parentElement;
    expect(outlineButton).toHaveClass('text-foreground');
  });
});
