# Socket.IO events

## Server provided

| Event name   | Content                              |
| ------------ | ------------------------------------ |
| `createTeam` | String, returns `teamCreated`        |
| `joinTeam`   | String, returns None or `teamJoined` |
| `adminLogin` | String (password), returns boolean   |
| `question`   | Question                             |

## Client provided

| Event name              | Content                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------- |
| `teamCreated`           | A **Team** object (name + unique string id + person count) or a string describing the error |
| `teamJoined`            | A **Team** object (name + unique string id + person count) or a string describing the error |
| `teamPersonCountUpdate` | An integer with the new personCount in the team                                             |
| `adminLogin`            | A boolean, wether the given password was correct or not                                     |
| `question`              | A new question replacing the old one                                                        |
