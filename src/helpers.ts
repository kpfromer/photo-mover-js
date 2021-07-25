import { promises as fs } from 'fs';
import exifr from 'exifr';
import * as path from 'path';

export interface File {
  location: string;
  // todo:
  metadata: any;
}

/**
 * Returns wehther or not the file is hidden.
 * Assumes the `location` is a file.
 */
function isHiddenFile(location: string): boolean {
  const { name } = path.parse(location);
  return name.startsWith('.');
}

async function group(location: string): Promise<{ files: string[]; directories: string[] }> {
  const items = await fs.readdir(location);
  const info = await Promise.all(
    items
      .filter((location) => !isHiddenFile(location))
      .map(async (itemLocation) => {
        const absolutePath = path.join(location, itemLocation);
        return {
          location: absolutePath,
          stat: await fs.stat(absolutePath),
        };
      }),
  );

  const files = info.filter((file) => file.stat.isFile()).map((file) => file.location);
  const directories = info.filter((file) => file.stat.isDirectory()).map((file) => file.location);

  return { files, directories };
}

export async function fetchFiles(location: string): Promise<string[]> {
  const files: string[] = [];

  const find = async (location: string) => {
    const { files: foundFiles, directories } = await group(location);

    for (const file of foundFiles) {
      files.push(file);
    }

    await Promise.all(directories.map((dir) => find(dir)));
  };

  await find(location);

  return files;
}

export async function fetchMetadata(
  locations: string[],
): Promise<{ location: string; metadata: any }[]> {
  return await Promise.all(
    locations.map(async (location) => ({
      location,
      metadata: await exifr.parse(location),
    })),
  );
}
