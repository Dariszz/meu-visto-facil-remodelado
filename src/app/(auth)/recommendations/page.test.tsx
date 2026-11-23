// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { beforeEach, expect, test, vi } from "vitest";
import RecommendationsOverviewPage from "./page";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth/get-current-user", () => ({ getCurrentUser: vi.fn() }));
const { getQuestionnaireOverview, redirect } = vi.hoisted(() => ({
  getQuestionnaireOverview: vi.fn(),
  redirect: vi.fn((path: string) => {
    throw new Error(`REDIRECT:${path}`);
  }),
}));
vi.mock("@/features/questionnaire/application/questionnaire-service", () => ({
  getQuestionnaireOverview,
}));
vi.mock("next/navigation", () => ({ redirect }));
beforeEach(() => vi.clearAllMocks());

const overview = (statuses: Record<string, string>) => ({
  kind: "READY",
  destinations: Object.entries(statuses).map(([slug, status]) => ({
    slug,
    name: slug.toUpperCase(),
    status,
  })),
});

test("sem destino respondido vai ao questionário; com um, direto a ele", async () => {
  getQuestionnaireOverview.mockResolvedValueOnce(
    overview({ ireland: "STARTED" }),
  );
  await expect(RecommendationsOverviewPage()).rejects.toThrow(
    "REDIRECT:/questionnaire",
  );
  getQuestionnaireOverview.mockResolvedValueOnce(
    overview({ ireland: "COMPLETE", canada: "NOT_STARTED" }),
  );
  await expect(RecommendationsOverviewPage()).rejects.toThrow(
    "REDIRECT:/recommendations/ireland",
  );
});

test("com vários destinos respondidos, lista só esses", async () => {
  getQuestionnaireOverview.mockResolvedValue(
    overview({ ireland: "COMPLETE", italy: "COMPLETE", canada: "STARTED" }),
  );
  render(await RecommendationsOverviewPage());
  expect(screen.getByRole("link", { name: "ITALY" })).toHaveAttribute(
    "href",
    "/recommendations/italy",
  );
  expect(
    screen.queryByRole("link", { name: "CANADA" }),
  ).not.toBeInTheDocument();
});
