# Compare the Differences Between Two Commits

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
    description: "Access token to increase the rate limit for GitHub API requests, recommended"
  show-merge-commits:
    required: false
    description: "Whether to show merge commits in the log"
    default: "false"
  sha-length:
    required: false
    description: "The short length of the SHA256 displayed in the output table"
    default: "8"
  show-differences:
    required: false
    description: "Print the generated Markdown table to the console"
    default: "false"
```

## Outputs

```yaml
outputs:
  differences:
    description: "A markdown formatted table of differences between two commits"
```
