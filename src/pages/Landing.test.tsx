
import React from 'react';
import { render, screen } from '../utils/test-utils';
import Landing from './Landing';
import { describe, it, expect } from 'vitest';

describe('Landing Page', () => {
  it('renders main heading and CTA buttons', () => {
    render(<Landing />);
    
    expect(screen.getByText('Advanced Plant Disease Detection')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Try Demo')).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(<Landing />);
    
    expect(screen.getByText('Disease Detection')).toBeInTheDocument();
    expect(screen.getByText('Early Warnings')).toBeInTheDocument();
    expect(screen.getByText('Treatment Plans')).toBeInTheDocument();
    expect(screen.getByText('Field Insights')).toBeInTheDocument();
  });

  it('shows the how it works section', () => {
    render(<Landing />);
    
    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('Upload Images')).toBeInTheDocument();
    expect(screen.getByText('Get Diagnosis')).toBeInTheDocument();
    expect(screen.getByText('Apply Treatment')).toBeInTheDocument();
  });
});
