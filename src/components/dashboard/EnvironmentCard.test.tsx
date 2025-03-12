
import React from 'react';
import { render, screen } from '../../utils/test-utils';
import EnvironmentCard from './EnvironmentCard';
import { describe, it, expect } from 'vitest';

describe('EnvironmentCard', () => {
  it('renders with temperature icon correctly', () => {
    render(
      <EnvironmentCard 
        title="Temperature" 
        value="25°C"
        icon="temperature"
      />
    );
    
    expect(screen.getByText('Temperature')).toBeInTheDocument();
    expect(screen.getByText('25°C')).toBeInTheDocument();
  });

  it('renders with humidity icon correctly', () => {
    render(
      <EnvironmentCard 
        title="Humidity" 
        value="65%"
        icon="humidity"
      />
    );
    
    expect(screen.getByText('Humidity')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('displays change information when provided', () => {
    render(
      <EnvironmentCard 
        title="Soil Moisture" 
        value="45%"
        icon="moisture"
        change="+5%"
        trend="up"
      />
    );
    
    expect(screen.getByText('Soil Moisture')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.getByText('+5% from yesterday')).toBeInTheDocument();
    expect(screen.getByText('+5% from yesterday')).toHaveClass('text-plant');
  });
});
