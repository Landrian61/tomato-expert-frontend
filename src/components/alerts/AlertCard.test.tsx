import React from "react";
import { render, screen, fireEvent } from "../../utils/test-utils";
import AlertCard from "./AlertCard";
import { describe, it, expect } from "vitest";

describe("AlertCard", () => {
  it("renders alert information correctly", () => {
    render(
      <AlertCard
        title="Test Alert"
        description="This is a test alert description"
        timestamp="2023-09-01T10:00:00Z"
        riskLevel="medium"
      />
    );

    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    expect(
      screen.getByText("This is a test alert description")
    ).toBeInTheDocument();
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
  });

  it("displays the correct risk badge based on risk level", () => {
    const { rerender } = render(
      <AlertCard
        title="Low Risk Alert"
        description="Description"
        timestamp="2023-09-01T10:00:00Z"
        riskLevel="low"
      />
    );

    expect(screen.getByText("Low Risk")).toHaveClass("bg-plant");

    rerender(
      <AlertCard
        title="Critical Risk Alert"
        description="Description"
        timestamp="2023-09-01T10:00:00Z"
        riskLevel="critical"
      />
    );

    expect(screen.getByText("Critical Risk")).toHaveClass("bg-tomato");
  });

  it("renders action buttons when notification data is present", () => {
    const mockNotification = {
      _id: "test-id",
      title: "Test Alert",
      message: "Description",
      type: "system",
      priority: "low",
      read: false,
      createdAt: "2023-09-01T10:00:00Z",
      data: { someData: "test" }
    };

    render(<AlertCard notification={mockNotification} onUpdate={() => {}} />);

    // Click the card header to expand it
    const cardHeader = screen.getByRole("button");
    fireEvent.click(cardHeader);

    // Now the buttons should be visible
    expect(screen.getByText("View Details")).toBeInTheDocument();
    expect(screen.getByText("Mark as Read")).toBeInTheDocument();
  });

  it("renders with actual notification data", () => {
    const mockNotification = {
      _id: "test-id",
      title: "Real Alert",
      message: "Real description",
      type: "weather",
      priority: "high",
      read: false,
      createdAt: "2023-09-01T10:00:00Z"
    };

    render(<AlertCard notification={mockNotification} onUpdate={() => {}} />);

    expect(screen.getByText("Real Alert")).toBeInTheDocument();
    expect(screen.getByText("Real description")).toBeInTheDocument();
    expect(screen.getByText("High Risk")).toBeInTheDocument();
    expect(screen.getByText("weather")).toBeInTheDocument();
  });

  it("handles read notifications correctly", () => {
    const mockNotification = {
      _id: "test-id",
      title: "Read Alert",
      message: "This is a read notification",
      type: "system",
      priority: "low",
      read: true,
      createdAt: "2023-09-01T10:00:00Z"
    };

    render(<AlertCard notification={mockNotification} onUpdate={() => {}} />);

    // Click the card header to expand it
    const cardHeader = screen.getByRole("button");
    fireEvent.click(cardHeader);

    // The "Mark as Read" button should not be present for read notifications
    expect(screen.queryByText("Mark as Read")).not.toBeInTheDocument();
  });
});
