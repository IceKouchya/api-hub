import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repository = "IceKouchya/api-hub";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const token = process.env.GITHUB_TOKEN;

if (!token) {
  throw new Error("GITHUB_TOKEN is required");
}

function git(args, encoding = "utf8") {
  return execFileSync("git", ["-C", root, ...args], { encoding }).trimEnd();
}

async function api(method, path, body) {
  const response = await fetch(`https://api.github.com/repos/${repository}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${method} ${path} failed (${response.status}): ${data.message ?? text}`);
  }

  return data;
}

function parseCommit(commit) {
  const raw = git([
    "show",
    "-s",
    "--format=%an%x00%ae%x00%aI%x00%cn%x00%ce%x00%cI%x00%P%x00%B",
    commit,
  ]);
  const parts = raw.split("\0");
  const [authorName, authorEmail, authorDate, committerName, committerEmail, committerDate, parents, message] = parts;

  return {
    author: { name: authorName, email: authorEmail, date: authorDate },
    committer: { name: committerName, email: committerEmail, date: committerDate },
    parents: parents ? parents.split(" ") : [],
    message,
  };
}

function parseTree(commit) {
  const raw = execFileSync("git", ["-C", root, "ls-tree", "-r", "-z", "--full-tree", commit]);
  return raw
    .toString("utf8")
    .split("\0")
    .filter(Boolean)
    .map((line) => {
      const [metadata, path] = line.split("\t");
      const [mode, type, sha] = metadata.split(" ");
      if (type !== "blob") {
        throw new Error(`Unsupported tree entry type: ${type} at ${path}`);
      }
      return { mode, path, sha };
    });
}

async function main() {
  const remote = await api("GET", "", undefined);
  if (!remote.permissions?.push) {
    throw new Error("The GitHub token does not have push permission for this repository");
  }

  let remoteBaseSha;
  let createdBootstrap = false;

  try {
    const existingRef = await api("GET", "/git/ref/heads/main", undefined);
    remoteBaseSha = existingRef.object.sha;
  } catch (error) {
    if (!String(error.message).includes("(409)")) {
      throw error;
    }

    const bootstrap = await api("PUT", "/contents/README.md", {
      message: "chore: initialize repository for project import",
      content: Buffer.from("# API Hub\n\nRepository initialization commit.\n").toString("base64"),
      branch: "main",
    });
    remoteBaseSha = bootstrap.commit.sha;
    createdBootstrap = true;
  }

  const localTip = git(["rev-parse", "main"]);
  const localTree = git(["rev-parse", "main^{tree}"]);

  if (!createdBootstrap) {
    const remoteCommit = await api("GET", `/git/commits/${remoteBaseSha}`, undefined);
    if (remoteCommit.tree.sha === localTree) {
      console.log(JSON.stringify({ publishedCommits: 0, publishedBlobs: 0, remoteTip: remoteBaseSha }, null, 2));
      return;
    }
  }

  const commits = createdBootstrap
    ? git(["rev-list", "--reverse", "main"]).split("\n").filter(Boolean)
    : [localTip];
  const blobMap = new Map();
  const commitMap = new Map();

  for (const localCommit of commits) {
    const entries = [];
    for (const entry of parseTree(localCommit)) {
      let remoteBlob = blobMap.get(entry.sha);
      if (!remoteBlob) {
        const content = execFileSync("git", ["-C", root, "show", `${localCommit}:${entry.path}`]);
        const blob = await api("POST", "/git/blobs", {
          content: content.toString("base64"),
          encoding: "base64",
        });
        remoteBlob = blob.sha;
        blobMap.set(entry.sha, remoteBlob);
      }
      entries.push({ path: entry.path, mode: entry.mode, type: "blob", sha: remoteBlob });
    }

    const tree = await api("POST", "/git/trees", { tree: entries });
    const details = parseCommit(localCommit);
    const parents = createdBootstrap
      ? details.parents.length
        ? details.parents.map((parent) => {
          const mappedParent = commitMap.get(parent);
          if (!mappedParent) {
            throw new Error(`Missing published parent for ${parent}`);
          }
          return mappedParent;
        })
        : [remoteBaseSha]
      : [remoteBaseSha];
    const created = await api("POST", "/git/commits", {
      message: details.message,
      tree: tree.sha,
      parents,
      author: details.author,
      committer: details.committer,
    });

    commitMap.set(localCommit, created.sha);
    console.log(`${localCommit.slice(0, 7)} -> ${created.sha.slice(0, 7)}`);
  }

  const publishedTip = commits.at(-1);
  const remoteTip = commitMap.get(publishedTip);
  await api("PATCH", "/git/refs/heads/main", { sha: remoteTip, force: false });
  const verified = await api("GET", "/git/ref/heads/main", undefined);

  if (verified.object.sha !== remoteTip) {
    throw new Error(`Remote main verification failed: expected ${remoteTip}, got ${verified.object.sha}`);
  }

  console.log(JSON.stringify({ publishedCommits: commits.length, publishedBlobs: blobMap.size, remoteTip }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
