import type { Board } from "./types";

export const initialBoard: Board = {
  id: "orbit-board",
  title: "Product launch plan",
  subtitle: "A clear view of the work that moves your team forward.",
  columns: [
    {
      id: "backlog",
      title: "Backlog",
      cards: [
        {
          id: "card-research",
          title: "Interview early adopters",
          details: "Capture the sharpest needs before the next planning session.",
        },
        {
          id: "card-pricing",
          title: "Explore launch pricing",
          details: "Compare three simple packages and their first-year assumptions.",
        },
      ],
    },
    {
      id: "todo",
      title: "To do",
      cards: [
        {
          id: "card-copy",
          title: "Polish homepage copy",
          details: "Make the first screen feel direct, useful, and unmistakably ours.",
        },
      ],
    },
    {
      id: "progress",
      title: "In progress",
      cards: [
        {
          id: "card-dashboard",
          title: "Build the analytics view",
          details: "Turn the core metrics into a calm, glanceable dashboard.",
        },
        {
          id: "card-onboarding",
          title: "Prototype onboarding",
          details: "Test the shortest path from sign-up to first meaningful action.",
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      cards: [
        {
          id: "card-email",
          title: "Review lifecycle emails",
          details: "Check tone, timing, and the links in the activation sequence.",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      cards: [
        {
          id: "card-brand",
          title: "Choose the visual direction",
          details: "A warmer, more confident system is ready for the next pass.",
        },
      ],
    },
  ],
};