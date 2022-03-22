# auto-merge

Automatically merge branches when a labelled PR has been merged successfully.

# Example 
```yaml
on:
  pull_request:
    types:
      - closed

jobs:
  auto_merge_job:
  # The action also checks the merged status but better to terminate early
  if_merged:
    if: github.event.pull_request.merged == true
      runs-on: ubuntu-latest
      name: AutoMerge to UAT
      steps:
        - name: AutoMerge merge step
          id: AutoMerge
          uses: drnare/auto-merge@v1.0
          with:
            source: main # Branch to merge FROM
            target: uat # Branch to merge TO
            label: auto-merge-to-uat # Label must be present on PR
            token: ${{ secrets.GITHUB_TOKEN }}
```