import { Command, flags } from "@oclif/command";

class PhotoMover extends Command {
  static description = "move photos to folders based on metadata";

  static flags = {
    // add --version flag to show CLI version
    version: flags.version({ char: "v" }),
    help: flags.help({ char: "h" }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: "n", description: "name to print" }),

    dryrun: flags.boolean({
      char: "d",
      description: "run without moving/copying files",
    }),
    move: flags.boolean({
      char: "m",
      description: "moves files instead of copying",
    }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: "f" }),
  };

  static args = [{ name: "file" }];

  async run() {
    const { args, flags } = this.parse(PhotoMover);

    const name = flags.name ?? "world";
    this.log(`hello ${name} from ./src/index.ts`);
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`);
    }
  }
}

export = PhotoMover;
