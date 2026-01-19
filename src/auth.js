const { useMultiFileAuthState } = require("baileys");
const path = require("path");

async function getAuthState() {
  return await useMultiFileAuthState(
    path.join(__dirname, "../sessions/mutanox-bot")
  );
}

module.exports = { getAuthState };
