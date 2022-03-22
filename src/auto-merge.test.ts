import { merge } from './auto-merge'
import core from '@actions/core'
import github from '@actions/github'

const mockMerge = jest.fn()

jest.mock('@actions/core', () => {
  const core = jest.requireActual('@actions/github');
  const input = {
    token: '123',
    target: 'target',
    source: 'source',
    label: 'auto-merge'
  }
  return {
    ...core,
    getInput: (key: keyof typeof input) => input[key],
  };
});

jest.mock('@actions/github', () => {
  const github = jest.requireActual('@actions/github');

  return {
    ...github,
    context: {
      payload: {
        pull_request: {
          base: {
            repo: {
              name: 'drnare/auto-merge',
              owner: {
                login: 'drnare'
              }
            },
          },
          labels: [{ name: 'auto-merge' }],
          merged: true,
          number: 123,
        }
      }
    },
    getOctokit: jest.fn()
  }
});

(github.getOctokit as jest.Mock) = jest.fn().mockReturnValue({
  rest: {
    repos: {
      merge: mockMerge
    }
  }
}
)
const log = console.log;

describe('Auto-merge', () => {

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => jest.clearAllMocks())

  afterAll(() => {
    console.log = log;
  });


  test('it should merge a PR', () => {
    merge()
    expect(mockMerge).toHaveBeenCalledWith(expect.objectContaining({
      base: 'target',
      head: 'source'
    }))
  })

  test('it should not run if PR is not merged', () => {
    github.context.payload.pull_request!.merged = false
    merge()
    expect(mockMerge).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith('Merge into source skipped: PR#123 not merged.')
  })

  test('it should not run if label is not found', () => {
    github.context.payload.pull_request!.merged = true
    github.context.payload.pull_request!.labels = [{ name: 'any-other-label' }]
    merge()
    expect(mockMerge).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith("Merge into source skipped: Label 'auto-merge' not found.")
  })

})

