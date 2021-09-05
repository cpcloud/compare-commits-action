# Compare the Differences Between Two Commits

This action will compare the differences in a commit range and generate a Markdown table that looks like this:

| SHA256                                                                                                      | Commit Message                                                     | Pull Requests                                                                                 |
| ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`59be1f49`](https://github.com/nix-community/home-manager/commit/59be1f4983ee3689de3172716a6c7e95a6a37bb7) | `dunst: add option to read alternative configuration file (#2113)` | <ul><li><a href="https://github.com/nix-community/home-manager/pull/2113">#2113</a></li></ul> |

## Usage in a GitHub workflow

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Compare commits
        uses: cpcloud/compare-commits-action@v2.0.4
        with:
          owner: nix-community
          repo: home-manager
          basehead: A...B
          token: ${{ secrets.GITHUB_TOKEN }}
          verbose: true # this will print the markdown table to the console
```

## Inputs

```yaml
inputs:
  owner:
    required: true
    description: "The owner of the GitHub repository"
  repo:
    required: true
    description: "The GitHub repository name"
  basehead:
    required: true
    description: "The commit range to compare"
  token:
    required: false
    description: "Access token to increase the rate limit for GitHub API requests"
  include-merge-commits:
    required: false
    description: "Whether to show merge commits in the log"
    default: "false"
  sha-length:
    required: false
    description: "The short length of the SHA256 displayed in the output table"
    default: "8"
  verbose:
    required: false
    description: "Print the generated Markdown table to the console"
    default: "false"
  list-type:
    required: false
    description: 'The kind of HTML list to generate for associated pull requests; valid values are "ol" and "ul"'
    default: "ul"
```

## Outputs

```yaml
outputs:
  differences:
    description: "A markdown formatted table of differences between two commits"
```
