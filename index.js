const core = require('@actions/core');
const github = require('@actions/github');

const merge = () => {
  const token = core.getInput('token');
  const base = core.getInput('base');
  const head = core.getInput('head');
  const labelName = core.getInput('label');

  const {
    pull_request: { labels },
    merged,
  } = github.context.payload;

  // if (!merged) {
  //   console.log(`Merge into ${head} skipped: PR not merged.`);
  //   return;
  // }

  if (!labels.find((label) => label.name === labelName)) {
    console.log(`Merge into ${head} skipped: Label '${label}' not found.`);
    return;
  }

  const octokit = github.getOctokit(token || '');

  try {
    return octokit.repos.merge({
      base,
      head,
      commit_message: `Merge branch '${base}' into ${head}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

merge();
