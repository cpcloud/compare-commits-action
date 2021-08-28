import * as core from "@actions/core";
import { Octokit } from "@octokit/rest";
import { markdownTable } from "markdown-table";

interface TableOptions {
  owner: string;
  repo: string;
  basehead: string;
  includeMergeCommits: boolean;
  shaLength: number;
}

/**
 * Generator a markdown table of commits between a range
 * @param octokit A GitHub API instance
 */
async function* generateTableLines(
  octokit: Octokit,
  { owner, repo, basehead, includeMergeCommits, shaLength }: TableOptions
): AsyncIterable<string[]> {
  // yield the header
  yield ["SHA256", "Commit Message", "Timestamp"];
  for await (const {
    data: { commits },
  } of octokit.paginate.iterator(
    octokit.rest.repos.compareCommitsWithBasehead, // eslint-disable-line indent
    { owner, repo, basehead } // eslint-disable-line indent
  )) /* eslint-disable-line indent */ {
    yield* commits
      .filter(c => includeMergeCommits || c.parents.length < 2)
      .map(({ sha, html_url: shaUrl, commit: { message, committer } }) => {
        const sha256 = sha.slice(0, shaLength);
        const commitMessage = message.split("\n")[0];
        const date = committer?.date ?? "unknown";

        return [
          `[\`${sha256}\`](${shaUrl})`,
          `\`${commitMessage}\``,
          `\`${date.replace("T", " ")}\``,
        ];
      });
  }
}

/**
 * Convert an asynchronous generator to an array.
 *
 * @param generator An async generator
 */
async function generatorToArray<T>(generator: AsyncIterable<T>): Promise<T[]> {
  const values = [];
  for await (const value of generator) {
    values.push(value);
  }
  return values;
}

async function run(): Promise<void> {
  // try {
  //   const octokit = new Octokit({
  //     auth: core.getInput("token", { required: false }),
  //   });
  //
  //   const owner = core.getInput("owner", { required: true });
  //   const repo = core.getInput("repo", { required: true });
  //   const basehead = core.getInput("basehead", { required: true });
  //   const shaLength: number = JSON.parse(
  //     core.getInput("sha-length", { required: false })
  //   );
  //   const includeMergeCommits: boolean = JSON.parse(
  //     core.getInput("include-merge-commits", { required: false })
  //   );
  //   const verbose: boolean = JSON.parse(
  //     core.getInput("verbose", { required: false })
  //   );
  //
  //   const lines = await generatorToArray(
  //     generateTableLines(octokit, {
  //       owner,
  //       repo,
  //       basehead,
  //       includeMergeCommits,
  //       shaLength,
  //     })
  //   );
  //
  //   const table = markdownTable(lines.reverse());
  //
  //   if (verbose) {
  //     core.startGroup("Markdown table output"); // eslint-disable-line i18n-text/no-en
  //     core.info(table);
  //     core.endGroup();
  //   }
  //
  //   core.setOutput("differences", table);
  // } catch (error) {
  //   core.setFailed(`Action failed with error: ${error}`); // eslint-disable-line i18n-text/no-en
  // }
}

run();
