export const LessonState = {
  Pending: 1,
  Approved: 2,
  Rejected: 3,
  Planned: 4,
  Cancelled: 5,
  Ongoing: 6,
  Finished: 7,
  Conflicted: 8,
  Completed: 9,
} as const;

export type LessonStateId = (typeof LessonState)[keyof typeof LessonState];

export function isOneOfStates(
  stateId: number,
  states: LessonStateId[]
): boolean {
  return states.includes(stateId as LessonStateId);
}
