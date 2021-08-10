import { Octokit } from "@octokit/rest";
import * as core from "@actions/core";

async function run(): Promise<void> {
  try {
    const octokit = new Octokit({
      auth: core.getInput("token"),
    });

    const owner = core.getInput("owner");
    const repo = core.getInput("repo");
    const basehead = core.getInput("basehead");

    const header = ["SHA256", "Commit Message", "Timestamp"];
    const headerLine = `|${header.join("|")}|`;
    const headerSepLine = `|${new Array(header.length).fill("---").join("|")}|`;
    const headerLines = [headerLine, headerSepLine];
    const shaLength: number = JSON.parse(core.getInput("sha-length"));
    const showMergeCommits: boolean = JSON.parse(
      core.getInput("show-merge-commits")
    );

    const lines = [];

    for await (const {
      data: { commits },
    } of octokit.paginate.iterator(
      octokit.rest.repos.compareCommitsWithBasehead, // eslint-disable-line indent
      { owner, repo, basehead } // eslint-disable-line indent
    )) /* eslint-disable-line indent */ {
      for (const {
        sha,
        html_url: shaUrl,
        commit: { message, committer },
      } of commits.filter(c => showMergeCommits || c.parents.length < 2)) {
        const sha256 = sha.slice(0, shaLength);
        const commitMessage = message.split("\n")[0];
        const date = committer?.date ?? "unknown";

        const fields = [
          `[\`${sha256}\`](${shaUrl})`,
          `\`${commitMessage}\``,
          `\`${date.replace("T", " ")}\``,
        ];
        lines.push(`|${fields.join("|")}|`);
      }
    }

    const joinedLines = headerLines.concat(lines.reverse()).join("\n");
    core.info("Hello world!");
    core.info(joinedLines);
    core.setOutput("differences", joinedLines);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
