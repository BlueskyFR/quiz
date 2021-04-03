import { Server, Socket } from "socket.io";

import {} from "./types";
import {
  MultipleChoiceQuestion,
  Question,
  SingleChoiceQuestion,
  TextualQuestion,
  TrueFalseQuestion,
} from "./types/questions";

export default class QuestionManager {
  constructor(private io: Server, private config: any) {}

  currentQuestion: Question | null = null;
  votes: string[] = [];
  questionStartTime: number = 0;

  get isQuestionBeingPlayed(): boolean {
    return this.currentQuestion !== null;
  }

  get timeLeft(): number {
    if (this.currentQuestion === null) return 0;
    let timeLeft = this.currentQuestion.timer - (Date.now() - this.questionStartTime) / 1000;
    return Math.max(timeLeft, 0);
  }

  get questionWithoutAnswer(): Question | null {
    if (this.currentQuestion === null) return null;
    let q = this.currentQuestion;
    if (q.type === "textual")
      return new TextualQuestion(q.title, q.timer, q.points, q.everyoneGetsPoints);
    if (q.type === "trueFalse")
      return new TrueFalseQuestion(q.title, q.timer, q.points, q.everyoneGetsPoints);
    if (q.type === "multipleChoice")
      return new MultipleChoiceQuestion(
        q.title,
        q.timer,
        q.points,
        q.everyoneGetsPoints,
        (<MultipleChoiceQuestion>q).choices
      );
    if (q.type === "singleChoice")
      return new SingleChoiceQuestion(
        q.title,
        q.timer,
        q.points,
        q.everyoneGetsPoints,
        (<SingleChoiceQuestion>q).choices
      );

    return null;
  }

  question(question: Question | null) {
    this.currentQuestion = question;
    console.log(`Got a new question! -> ${JSON.stringify(question)}`);
    this.questionStartTime = Date.now();
    this.votes = [];
    this.io.emit("question", this.questionWithoutAnswer);
  }

  isVoteValid(vote: any): boolean {
    let q = this.currentQuestion;
    if (q === null) return false;
    if (q.type === "textual") return typeof vote === "string";
    if (q.type === "trueFalse") return typeof vote === "boolean";
    if (q.type === "multipleChoice")
      return vote instanceof Array && vote.every((v) => typeof v === "number" && v >= 0 && v <= 3);
    if (q.type === "singleChoice") return typeof vote === "number" && vote >= 0 && vote <= 3;

    return false;
  }
}
