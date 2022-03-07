import core from '@actions/core';
import github from '@actions/github';

const merge = () => {
  const token = core.getInput('token');
  const base = core.getInput('base');
  const head = core.getInput('head');
  const label = core.getInput('label');

  const { labels, merged } = github.context.payload;

  if (!merged) {
    console.log(`Merge into ${head} skipped: PR not merged.`);
    return;
  }

  if (!labels.includes(label)) {
    console.log(`Merge into ${head} skipped: Label '${label}' not found.`);
    return;
  }

  const octokit = github.getOctokit(token);

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

await merge();
