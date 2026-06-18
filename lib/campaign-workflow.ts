export const CAMPAIGN_WORKFLOW_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "IN_PROGRESS",
  "SUBMITTED",
  "COMPLETED",
] as const;

export type WorkflowStatus = (typeof CAMPAIGN_WORKFLOW_STATUSES)[number];
