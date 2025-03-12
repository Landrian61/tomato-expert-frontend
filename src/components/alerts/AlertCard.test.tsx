
import React from 'react';
import { render, screen } from '../../utils/test-utils';
import AlertCard from './AlertCard';

describe('AlertCard', () => {
  it('renders alert information correctly', () => {
    render(
      <AlertCard 
        title="Test Alert" 
        description="This is a test alert description"
        timestamp="2023-09-01 10:00 AM"
        riskLevel="medium"
      />
    );
    
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
    expect(screen.getByText('This is a test alert description')).toBeInTheDocument();
    expect(screen.getByText('2023-09-01 10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('Medium Risk')).toBeInTheDocument();
  });

  it('displays the correct risk badge based on risk level', () => {
    const { rerender } = render(
      <AlertCard 
        title="Low Risk Alert" 
        description="Description"
        timestamp="2023-09-01"
        riskLevel="low"
      />
    );
    
    expect(screen.getByText('Low Risk')).toHaveClass('bg-plant');
    
    rerender(
      <AlertCard 
        title="Critical Risk Alert" 
        description="Description"
        timestamp="2023-09-01"
        riskLevel="critical"
      />
    );
    
    expect(screen.getByText('Critical Risk')).toHaveClass('bg-tomato');
  });

  it('renders action buttons', () => {
    render(
      <AlertCard 
        title="Test Alert" 
        description="Description"
        timestamp="2023-09-01"
        riskLevel="low"
      />
    );
    
    expect(screen.getByText('View Details')).toBeInTheDocument();
    expect(screen.getByText('Acknowledge')).toBeInTheDocument();
  });
});
