import { stat } from 'node:fs/promises';
import { $ } from 'execa';
import { settings } from './settings.js';

export async function doesDirectoryExist(directoryPath) {
  try {
    const stats = await stat(directoryPath);
    return stats.isDirectory();
  } catch (error) {
    if (error.code === 'ENOENT') {
      // The directory does not exist.
      return false;
    }
    throw error; // For other errors, rethrow the error.
  }
}
export async function downloadRepo() {
  if (!settings.projectTemplate) {
    throw new Error('No project template specified');
  }
  // make sure repo doesn't exist
  const isDir = await doesDirectoryExist(settings.projectName);
  if (isDir) {
    return;
  }
  const repo = settings.projectTemplate.url;
  const result =
    await $`git clone --depth=1 https://github.com/${repo} ${settings.projectName}`;
  console.log(result.stdout);
}
