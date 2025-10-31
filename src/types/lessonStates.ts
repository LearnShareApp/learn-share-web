export const LessonState = {
  Pending: 1,
  Planned: 2,
  Ongoing: 3,
  Finished: 4,
  Cancelled: 5,
  Rejected: 6,
} as const;

export type LessonStateId = (typeof LessonState)[keyof typeof LessonState];

export function isOneOfStates(
  stateId: number,
  states: LessonStateId[]
): boolean {
  return states.includes(stateId as LessonStateId);
}
