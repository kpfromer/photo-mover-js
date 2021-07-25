import { Command, flags } from '@oclif/command';
import exifr from 'exifr';
import { fetchFiles, fetchMetadata } from './helpers';

class PhotoMover extends Command {
  static description = 'move photos to folders based on metadata';

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: 'v' }),
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    // name: flags.string({ char: "n", description: "name to print" }),
    input: flags.string({ char: 'i', required: true }),

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
    const { input, dryrun, move } = flags;

    const files = await fetchFiles(input);

    const data = await fetchMetadata(files);

    data.forEach(({ location, metadata }) => {
      this.log(`${location}:`);
      this.log(
        metadata
          ? JSON.stringify(metadata, null, 2)
              .split('\n')
              .map((line) => `\t${line}`)
              .join('\n')
          : '\tnone',
      );
    });
  }
}

export = PhotoMover;
