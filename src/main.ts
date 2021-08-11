import { Octokit } from "@octokit/rest";
import * as core from "@actions/core";
import { markdownTable } from "markdown-table";

async function run(): Promise<void> {
  try {
    const octokit = new Octokit({
      auth: core.getInput("token"),
    });

    const owner = core.getInput("owner");
    const repo = core.getInput("repo");
    const basehead = core.getInput("basehead");
    const shaLength: number = JSON.parse(core.getInput("sha-length"));
    const showMergeCommits: boolean = JSON.parse(
      core.getInput("show-merge-commits")
    );
    const showDifferences: boolean = JSON.parse(
      core.getInput("show-differences")
    );

    const lines = [];

    for await (const {
      data: { commits },
    } of octokit.paginate.iterator(
      octokit.rest.repos.compareCommitsWithBasehead, // eslint-disable-line indent
      { owner, repo, basehead } // eslint-disable-line indent
    )) /* eslint-disable-line indent */ {
      lines.push(
        ...commits
          .filter(c => showMergeCommits || c.parents.length < 2)
          .map(({ sha, html_url: shaUrl, commit: { message, committer } }) => {
            const sha256 = sha.slice(0, shaLength);
            const commitMessage = message.split("\n")[0];
            const date = committer?.date ?? "unknown";

            return [
              `[\`${sha256}\`](${shaUrl})`,
              `\`${commitMessage}\``,
              `\`${date.replace("T", " ")}\``,
            ];
          })
      );
    }

    const headerLines = [["SHA256", "Commit Message", "Timestamp"]];
    const table = markdownTable(headerLines.concat(lines.reverse()));

    if (showDifferences) {
      core.startGroup("Show the markdown output");
      core.info(table);
      core.endGroup();
    }

    core.setOutput("differences", table);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
