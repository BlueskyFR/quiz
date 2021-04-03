import {} from "../types";

// Question

export abstract class Question {
  constructor(
    public title: string,
    public type: string,
    public timer: number,
    public points: number,
    public everyoneGetsPoints: boolean
  ) {}
}

export class TextualQuestion extends Question {
  constructor(
    public title: string,
    public timer: number,
    public points: number,
    public everyoneGetsPoints: boolean,

    public answer?: string
  ) {
    super(title, "textual", timer, points, everyoneGetsPoints);
  }
}

export class SingleChoiceQuestion extends Question {
  constructor(
    public title: string,
    public timer: number,
    public points: number,
    public everyoneGetsPoints: boolean,

    public choices: string[],
    public answerID?: number
  ) {
    super(title, "singleChoice", timer, points, everyoneGetsPoints);
  }
}

export class MultipleChoiceQuestion extends Question {
  constructor(
    public title: string,
    public timer: number,
    public points: number,
    public everyoneGetsPoints: boolean,

    public choices: string[],
    public answersIDs?: number[]
  ) {
    super(title, "multipleChoice", timer, points, everyoneGetsPoints);
  }
}

export class TrueFalseQuestion extends Question {
  constructor(
    public title: string,
    public timer: number,
    public points: number,
    public everyoneGetsPoints: boolean,

    public answer?: boolean
  ) {
    super(title, "trueFalse", timer, points, everyoneGetsPoints);
  }
}
