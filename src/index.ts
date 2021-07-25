import { Command, flags } from '@oclif/command';
import * as path from 'path';
import exifr from 'exifr';
import { fetchFiles, fetchMetadata, generateOutputter } from './helpers';

class PhotoMover extends Command {
  static description = 'move photos to folders based on metadata';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),

    input: flags.string({ char: 'i', required: true }),
    output: flags.string({ char: 'o', required: true }),

    dryrun: flags.boolean({
      char: 'd',
      description: 'run without moving/copying files',
    }),
    move: flags.boolean({
      char: 'm',
      description: 'moves files instead of copying',
    }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(PhotoMover);
    const { input, output, dryrun, move } = flags;

    // TODO: LOAD DATA
    // TODO: MAP LOCATIONS TO DESIRED OUTPUT
    // TODO: CHECK IF CONFLICTING FILES WITH TRANSFORMED AND EXISTING

    const inputFiles = await fetchFiles(input);
    const inputData = await fetchMetadata(inputFiles);

    const outputter = generateOutputter(output);
    const pendingOutputFiles = inputData.map((data) => {
      // TODO: handle missing metadata

      const dateTimeOriginal = data.metadata.DateTimeOriginal as Date;

      const year = String(dateTimeOriginal.getFullYear() + 1);
      const month = String(dateTimeOriginal.getMonth() + 1);
      const day = String(dateTimeOriginal.getDay() + 1);

      const metadata = {
        ...data.metadata,
        name: path.parse(data.location).base,
        year,
        month,
        day,
      };

      return outputter(metadata);
    });

    console.log(pendingOutputFiles.join('\n'));

    // inputData.forEach(({ location, metadata }) => {
    //   this.log(`${location}:`);
    //   this.log(
    //     metadata
    //       ? JSON.stringify(metadata, null, 2)
    //           .split('\n')
    //           .map((line) => `\t${line}`)
    //           .join('\n')
    //       : '\tnone',
    //   );
    // });
  }
}

export = PhotoMover;
