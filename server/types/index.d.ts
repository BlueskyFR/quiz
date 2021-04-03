export {};

declare global {
  type EventResponse<T> =
    | {
        success: true;
        data: T;
        error?: never;
      }
    | {
        success: false;
        data?: never;
        error: string;
      };

  interface Team {
    name: string;
    id: string;
    personCount: number;
    points: number;
  }

  type Vote = string | number | number[] | boolean;
}
