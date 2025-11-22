// auto-setup.js
import { exec } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

// UPDATE THESE PATHS
const FRONTEND_PATH = "./frontend";   
const BACKEND_PATH = "./backend";

// --------------------------------------------------
// EXEC HELPER (Promise-based)
// --------------------------------------------------
function runCommand(cmd, cwd) {
    console.log(`\n➡️ Running: ${cmd} in ${cwd}`);
    return new Promise((resolve, reject) => {
        const child = exec(cmd, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            console.log(stdout);
            resolve(true);
        });

        child.stdout?.pipe(process.stdout);
        child.stderr?.pipe(process.stderr);
    });
}

// --------------------------------------------------
// CHECK HELPERS
// --------------------------------------------------
function isNodeModulesPresent(cwd) {
    return fs.existsSync(path.join(cwd, "node_modules"));
}

function isNodemonPresent(cwd) {
    const localPath = path.join(cwd, "node_modules", ".bin", "nodemon");
    return fs.existsSync(localPath);
}

// --------------------------------------------------
// OS-Specific Command Lists
// --------------------------------------------------
function getNpmInstallCommands() {
    const isWin = os.platform() === "win32";

    return isWin
        ? [
              "npm install",
              "npm i",
              "npm install --force",
              "npm install --legacy-peer-deps",
          ]
        : [
              "npm install",
              "sudo npm install",
              "npm i --legacy-peer-deps",
              "sudo npm i --force",
          ];
}

function getNodemonInstallCommands() {
    return os.platform() === "win32"
        ? ["npm install nodemon -D", "npm install nodemon"]
        : ["npm install nodemon -D", "sudo npm install nodemon -D"];
}

function getNodemonRunCommands() {
    return os.platform() === "win32"
        ? ["npx nodemon server.js", "nodemon server.js"]
        : ["npx nodemon server.js", "sudo npx nodemon server.js"];
}

// --------------------------------------------------
// TRY MULTIPLE COMMANDS UNTIL ONE WORKS
// --------------------------------------------------
async function tryCommands(commands, cwd) {
    for (const cmd of commands) {
        try {
            await runCommand(cmd, cwd);
            return true;
        } catch (err) {
            console.log(`⚠️ Failed: ${cmd} — trying next option...`);
        }
    }
    throw new Error("All commands failed.");
}

// --------------------------------------------------
// INSTALL ONLY IF NEEDED
// --------------------------------------------------
async function installIfNeeded(folder, installCommands) {
    if (isNodeModulesPresent(folder)) {
        console.log(`\n✔ node_modules already present in: ${folder}`);
        console.log("➡️ Skipping installation.");
        return;
    }

    console.log(`\n📦 node_modules missing in ${folder}, installing...`);
    await tryCommands(installCommands, folder);
}

// --------------------------------------------------
// MAIN WORKFLOW
// --------------------------------------------------
async function main() {
    try {
        console.log("\n===============================");
        console.log("🚀 AUTO SETUP STARTED");
        console.log("===============================\n");

        // ----------------------------------------
        // BACKEND INSTALLATION
        // ----------------------------------------
        await installIfNeeded(BACKEND_PATH, getNpmInstallCommands());

        // ----------------------------------------
        // NODEMON INSTALL
        // ----------------------------------------
        if (isNodemonPresent(BACKEND_PATH)) {
            console.log("\n✔ Nodemon already installed in backend.");
        } else {
            console.log("\n📦 Installing nodemon (backend only)...");
            await tryCommands(getNodemonInstallCommands(), BACKEND_PATH);
        }

        // ----------------------------------------
        // START BACKEND
        // ----------------------------------------
        console.log("\n📌 Starting backend with nodemon...");
        tryCommands(getNodemonRunCommands(), BACKEND_PATH).catch(() => {
            console.log("❌ Could not start nodemon. Continuing...");
        });

        // ----------------------------------------
        // FRONTEND INSTALLATION
        // ----------------------------------------
        await installIfNeeded(FRONTEND_PATH, getNpmInstallCommands());

        // ----------------------------------------
        // START FRONTEND
        // ----------------------------------------
        console.log("\n📌 Starting frontend (npm run dev)...");
        const devCommands = os.platform() === "win32"
            ? ["npm run dev"]
            : ["npm run dev", "sudo npm run dev"];

        await tryCommands(devCommands, FRONTEND_PATH);

        console.log("\n🎉 ALL DONE!");
    } catch (error) {
        console.log("\n❌ FATAL ERROR:", error.message);
    }
}

main();
