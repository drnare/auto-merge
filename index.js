const core = require('@actions/core');
const github = require('@actions/github');

const merge = () => {
  const token = core.getInput('token');
  const base = core.getInput('target');
  const head = core.getInput('source');
  const labelName = core.getInput('label');

  const {
    pull_request: {
      labels,
      base: { repo },
    },
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

  const octokit = github.getOctokit(token);

  try {
    return octokit.rest.repos.merge({
      owner: repo.owner.login,
      repo: repo.name,
      base,
      head,
      commit_message: `Merge branch '${head}' into ${base}`,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

merge();
