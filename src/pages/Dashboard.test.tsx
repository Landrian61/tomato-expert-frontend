import React from "react";
import { render, screen } from "../utils/test-utils";
import Dashboard from "./Dashboard";
import { describe, it, expect, vi } from "vitest";
import { environmentalData, criValue, criTrendData } from "@/data/mock-data";

// Mock the components used in Dashboard
vi.mock("@/components/dashboard/EnvironmentCard", () => ({
  default: ({ title, value }: { title: string; value: string }) => (
    <div data-testid={`environment-card-${title.toLowerCase()}`}>
      <div>{title}</div>
      <div>{value}</div>
    </div>
  )
}));

vi.mock("@/components/dashboard/RiskGauge", () => ({
  default: ({ value }: { value: number }) => (
    <div data-testid="risk-gauge">CRI: {value}</div>
  )
}));

vi.mock("@/components/dashboard/TrendChart", () => ({
  default: ({ title, data }: { title: string; data: any[] }) => (
    <div data-testid="trend-chart">
      <div>{title}</div>
      <div>Data points: {data.length}</div>
    </div>
  )
}));

vi.mock("@/components/dashboard/ActionButton", () => ({
  default: ({ title, href }: { title: string; href: string }) => (
    <div
      data-testid={`action-button-${title.replace(/ /g, "-").toLowerCase()}`}
    >
      <a href={href}>{title}</a>
    </div>
  )
}));

vi.mock("@/components/layout/Layout", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">
      <h1>Field Overview</h1>
      {children}
    </div>
  )
}));

describe("Dashboard Page", () => {
  it("renders all environment cards with correct data", () => {
    render(<Dashboard />);

    // Check temperature card
    const tempCard = screen.getByTestId("environment-card-temperature");
    expect(tempCard).toBeInTheDocument();
    expect(tempCard).toHaveTextContent(environmentalData.temperature.value);

    // Check humidity card
    const humidityCard = screen.getByTestId("environment-card-humidity");
    expect(humidityCard).toBeInTheDocument();
    expect(humidityCard).toHaveTextContent(environmentalData.humidity.value);

    // Check soil moisture card
    const moistureCard = screen.getByTestId("environment-card-soil moisture");
    expect(moistureCard).toBeInTheDocument();
    expect(moistureCard).toHaveTextContent(
      environmentalData.soilMoisture.value
    );
  });

  it("renders risk gauge with correct CRI value", () => {
    render(<Dashboard />);

    const riskGauge = screen.getByTestId("risk-gauge");
    expect(riskGauge).toBeInTheDocument();
    expect(riskGauge).toHaveTextContent(`CRI: ${criValue}`);
  });

  it("renders trend chart with correct data", () => {
    render(<Dashboard />);

    const trendChart = screen.getByTestId("trend-chart");
    expect(trendChart).toBeInTheDocument();
    expect(trendChart).toHaveTextContent(`Data points: ${criTrendData.length}`);
  });

  it("renders quick action buttons", () => {
    render(<Dashboard />);

    expect(
      screen.getByTestId("action-button-plant-diagnosis")
    ).toBeInTheDocument();
    expect(screen.getByTestId("action-button-risk-alerts")).toBeInTheDocument();
    expect(
      screen.getByTestId("action-button-field-insights")
    ).toBeInTheDocument();
  });
});
