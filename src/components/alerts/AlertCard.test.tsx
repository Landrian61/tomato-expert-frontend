import React from "react";
import { render, screen } from "../../utils/test-utils";
import AlertCard from "./AlertCard";
import { describe, it, expect } from "vitest";

describe("AlertCard", () => {
  it("renders alert information correctly", () => {
    render(
      <AlertCard
        title="Test Alert"
        description="This is a test alert description"
        timestamp="2023-09-01 10:00 AM"
        riskLevel="medium"
        testMode={true}
      />
    );

    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test alert description")
    ).toBeInTheDocument();
    expect(screen.getByTestId("timestamp")).toHaveTextContent(
      "2023-09-01 10:00 AM"
    );
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
  });

  it("displays the correct risk badge based on risk level", () => {
    const { rerender } = render(
      <AlertCard
        title="Low Risk Alert"
        description="Description"
        timestamp="2023-09-01"
        riskLevel="low"
        testMode={true}
      />
    );

    expect(screen.getByText("Low Risk")).toHaveClass("bg-plant");

    rerender(
      <AlertCard
        title="Critical Risk Alert"
        description="Description"
        timestamp="2023-09-01"
        riskLevel="critical"
        testMode={true}
      />
    );

    expect(screen.getByText("Critical Risk")).toHaveClass("bg-tomato");
  });

  it("renders action buttons", () => {
    render(
      <AlertCard
        title="Test Alert"
        description="Description"
        timestamp="2023-09-01"
        riskLevel="low"
        testMode={true}
      />
    );

    expect(screen.getByTestId("view-details-button")).toHaveTextContent(
      "View Details"
    );
    expect(screen.getByTestId("acknowledge-button")).toHaveTextContent(
      "Acknowledge"
    );
  });
});
