import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it("matches routes for /register and /login", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const registerMatches = router.matchRoutes("/register");
    expect(registerMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const loginMatches = router.matchRoutes("/login");
    expect(loginMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const stagesMatches = router.matchRoutes("/approval-stages");
    expect(stagesMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const templateMatches = router.matchRoutes("/approval-template");
    expect(templateMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const queueMatches = router.matchRoutes("/approval-queue");
    expect(queueMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const respondedMatches = router.matchRoutes("/responded-approvals");
    expect(respondedMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const rejectedMatches = router.matchRoutes("/rejected-approvals");
    expect(rejectedMatches.at(-1)?.routeId).not.toBe(rootRouteId);
    const evalMatches = router.matchRoutes("/evaluation");
    expect(evalMatches.at(-1)?.routeId).not.toBe(rootRouteId);
  });
});
