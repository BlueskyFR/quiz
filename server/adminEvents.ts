import { Socket } from "socket.io";

import {} from "./types";
import { Question } from "./types/questions";
import QuestionManager from "./QuestionManager";

export default function registerAdminEvents(
  socket: Socket,
  questionManager: QuestionManager,
  config: any
) {
  socket.on("adminLogin", (password) => {
    let isPasswordCorrect: boolean = false;

    // Safety checks
    // We do not return an error because the client is supposed to handle this, we simply do nothing
    if (password === config.adminPassword) {
      isPasswordCorrect = true;
      enableAdminTools(socket, questionManager, config);
    }

    socket.emit("adminLogin", isPasswordCorrect);
  });
}

function enableAdminTools(socket: Socket, questionManager: QuestionManager, config: any) {
  socket.join("admin");
  socket.on("question", (question: Question) => {
    questionManager.question(question);
  });
}
