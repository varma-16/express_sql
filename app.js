const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
let databasePath = path.join(__dirname, "cricketTeam.db");
const initialDB = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running");
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};
initialDB();
const convertObject = (obj) => {
  return {
    playerId: obj.player_id,
    playerName: obj.player_name,
    jerseyNumber: obj.jersey_number,
    role: obj.role,
  };
};

app.get("/players", async (req, res) => {
  const query = "select * from cricket_team";
  const players = await db.all(query);
  const res_arr = players.map((ele) => convertObject(ele));
  res.send(res_arr);
});

app.post("/players", async (req, res) => {
  const { playerName, jerseyNumber, role } = req.body;
  const query = `insert into cricket_team (player_name,jersey_number,role) values('${playerName}','${jerseyNumber}','${role}');`;
  const playerId = await db.run(query);
  res.send("Player Added to Team");
});

app.get("/players/:player", async (req, res) => {
  const { player } = req.params;
  const query = `select * from cricket_team where player_id='${player}'`;
  const player_info = await db.get(query);
  res.send(player_info);
});

app.put("/players/:player", async (req, res) => {
  const { player } = req.params;
  const { playerName, jerseyNumber, role } = req.body;
  const query = `update cricket_team set
                  player_name='${playerName}',
                  jersey_number='${jerseyNumber}',
                  role='${role}' where  player_id='${player}';`;
  await db.run(query);
  res.send("Player Details Updated");
});

app.delete("/players/:player", async (req, res) => {
  const { player } = req.params;
  const query = `delete from cricket_team where  player_id='${player}';`;
  await db.run(query);
  res.send("player removed");
});
