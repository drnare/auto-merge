const core = require('@actions/core');
const github = require('@actions/github');

import { PullRequestEvent } from '@octokit/webhooks-types';

export const merge = () => {
  const token = core.getInput('token');
  const base = core.getInput('target');
  const head = core.getInput('source');
  const labelName = core.getInput('label');

  const {
    pull_request: {
      labels,
      base: { repo },
      merged,
      number
    },
  } = github.context.payload as PullRequestEvent;


  if (!merged) {
    console.log(`Merge into ${head} skipped: PR#${number} not merged.`);
    return;
  }

  if (!labels.find((label) => label.name === labelName)) {
    console.log(`Merge into ${head} skipped: Label '${labelName}' not found.`);
    return;
  }

  const octokit = github.getOctokit(token);

  try {
    octokit.rest.repos.merge({
      owner: repo.owner.login,
      repo: repo.name,
      base,
      head,
      commit_message: `Merge branch '${head}' into ${base}`,
    })
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('Failed to merge.');
    }
  };
};
