// Allow parsing of .json5 files (with comments and all the good stuff)
require("json5/lib/register");

const config = require("./config.json5");

import {} from "./types";
import { Question } from "./types/questions";

import { createServer } from "http";
import { Server, Socket } from "socket.io";
import * as he from "he";
import cryptoRandomString from "crypto-random-string";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

import registerAdminEvents from "./adminEvents";
import QuestionManager from "./QuestionManager";

let connectedPlayers: Socket[] = [];
let teams: Team[] = [];
let currentQuestion: Question;

const questionManager = new QuestionManager(io, config);

function createTeam(name: string): Team {
  let id: string = "";
  // Repeat until we find a unique team id
  do {
    id = cryptoRandomString({ length: config.randomTeamCodeLength, type: "distinguishable" });
  } while (teams.some((t) => t.id == id));

  const team = <Team>{
    name: name,
    id: id,
    personCount: 1,
    points: 0,
  };

  teams.push(team);
  return team;
}

io.on("connection", (socket: Socket) => {
  let team: Team;
  const _addTeamMembers = (amount: number) => {
    team.personCount += amount;
    // Broadcast the personCount update to the team
    socket.to(team.id).emit("teamPersonCountUpdate", team.personCount);
  };
  const addTeamMember = () => _addTeamMembers(1);
  const removeTeamMember = () => {
    _addTeamMembers(-1);
    if (team.personCount === 0) {
      console.log(`Removing team ${team.name}!`);
      let index = teams.indexOf(team);
      // Remove the team from the array
      if (index >= 0) teams.splice(index, 1);
    }
  };

  const sendQuestionIfAvailable = () => {
    if (questionManager.isQuestionBeingPlayed) {
      let question = questionManager.questionWithoutAnswer;
      question!.timer = questionManager.timeLeft;
      socket.emit("question", question);
    }
  };

  socket.on("disconnect", () => {
    if (team) {
      console.log(`Someone left team ${team.name}!`);
      removeTeamMember();
    }
  });

  socket.on("createTeam", (name) => {
    let response: EventResponse<Team>;

    // Safety checks
    // We do not return an error because the client is supposed to handle this, we simply do nothing
    if (
      team ||
      typeof name != "string" ||
      name.length < config.minTeamNameLength ||
      name.length > config.maxTeamNameLength
    )
      return;

    console.log(`Got a team creation request! -> ${name}`);

    // Sanitize the string (XSS)
    name = he.encode(name);

    // Check if team name is already in the list but preserve the new one's case
    let lower_name = name.toLowerCase();
    if (teams.some((t) => t.name.toLowerCase() == lower_name))
      response = <EventResponse<Team>>{ error: "Une équipe du même nom existe déjà !" };
    else {
      // Create the team (name + id) and join it
      team = createTeam(name);
      socket.join(team.id);
      console.log(`Someone created team ${team.name}!`);

      response = <EventResponse<Team>>{
        data: team,
      };
    }

    socket.emit("teamCreated", response);
    sendQuestionIfAvailable();
  });

  socket.on("joinTeam", (id) => {
    let response: EventResponse<Team>;

    // Safety checks
    // We do not return an error because the client is supposed to handle this, we simply do nothing
    if (typeof id != "string" || id.length != config.randomTeamCodeLength) return;

    console.log(`Got a team join request! -> ${id}`);

    let targetTeam: Team | undefined = teams.find((t) => t.id == id);
    if (targetTeam == undefined)
      response = <EventResponse<Team>>{ error: "Aucune équipe avec cet id n'a été trouvée !" };
    else if (targetTeam.personCount == config.maxPersonCountPerTeam) {
      response = <EventResponse<Team>>{
        error: `Cette équipe est déjà pleine (${config.maxPersonCountPerTeam} personnes) !`,
      };
    } else {
      // Add the player to the team
      team = targetTeam;
      socket.join(team.id);
      console.log(`Someone joined team ${team.name}!`);
      addTeamMember();

      response = <EventResponse<Team>>{
        data: team,
      };
    }

    socket.emit("teamJoined", response);
    sendQuestionIfAvailable();
  });

  socket.on("vote", (vote: Vote) => {
    if (!team || !questionManager.isQuestionBeingPlayed || questionManager.votes.includes(team.id))
      return;

    // Check if vote is valid
    if (!questionManager.isVoteValid(vote)) return;

    questionManager.votes.push(team.id);
    socket.to(team.id).emit("vote", vote);
    socket.to("admin").emit("vote", {
      team: team,
      vote: vote,
    });
  });

  registerAdminEvents(socket, questionManager, config);
});

//TODO: ask question (+ question type)
//TODO: clear question
//TODO: vote
//TODO: admin panel -> admin controls
//TODO: scores + add/remove 1 point for a team

console.log("✨ Server starting...");
httpServer.listen(config.port, () =>
  console.log(`✅ http server listening on port ${config.port}!`)
);
