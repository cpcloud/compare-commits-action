import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import { longestRepeatedCharLength } from "./charseq";
import { markdownTable } from "markdown-table";

interface CompareCommitsOptions {
  owner: string;
  repo: string;
  basehead: string;
  includeMergeCommits: boolean;
  shaLength: number;
}

const TICK = "`";

/**
 * Generate a markdown table of commits between a range
 * @param octokit A GitHub API instance
 */
async function generateTableLines(
  octokit: Octokit,
  {
    owner,
    repo,
    basehead,
    includeMergeCommits,
    shaLength,
  }: CompareCommitsOptions
): Promise<string[][]> {
  const lines = [];

  for await (const {
    data: { commits },
  } of octokit.paginate.iterator(
    octokit.rest.repos.compareCommitsWithBasehead, // eslint-disable-line indent
    { owner, repo, basehead } // eslint-disable-line indent
  )) /* eslint-disable-line indent */ {
    for (const {
      sha: commitSha,
      html_url: shaUrl,
      parents,
      commit: { message },
    } of commits) {
      if (includeMergeCommits || parents.length < 2) {
        const sha = commitSha.slice(0, shaLength);
        const commitMessage = message.split("\n")[0];
        const numEmbeddedTicks = longestRepeatedCharLength(commitMessage, TICK);
        const ticks = TICK.repeat(numEmbeddedTicks + 1);

        lines.push([
          `[${TICK}${sha}${TICK}](${shaUrl})`,
          `${ticks}${commitMessage}${ticks}`,
        ]);
      }
    }
  }

  lines.push(["SHA256", "Commit Message"]);
  return lines;
}

async function run(): Promise<void> {
  try {
    const octokit = new Octokit({
      auth: core.getInput("token", { required: false }),
    });

    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const basehead = core.getInput("basehead", { required: true });
    const shaLength: number = JSON.parse(
      core.getInput("sha-length", { required: false })
    );
    const includeMergeCommits: boolean = JSON.parse(
      core.getInput("include-merge-commits", { required: false })
    );
    const verbose: boolean = JSON.parse(
      core.getInput("verbose", { required: false })
    );

    const lines = await generateTableLines(octokit, {
      owner,
      repo,
      basehead,
      includeMergeCommits,
      shaLength,
    });
    const table = markdownTable(lines.reverse());

    if (verbose) {
      core.startGroup("Markdown table output"); // eslint-disable-line i18n-text/no-en
      core.info(table);
      core.endGroup();
    }

    core.setOutput("differences", table);
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`); // eslint-disable-line i18n-text/no-en
  }
}

run();
