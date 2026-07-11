// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionHandler = (...args: any[]) => void | Promise<void>;

interface OptionDef {
  flags: string;
  description: string;
  defaultValue?: string | boolean;
  required?: boolean;
  variadic?: boolean;
}

interface ArgumentDef {
  name: string;
  description: string;
  required: boolean;
}

interface CommandNode {
  name: string;
  description?: string;
  options: OptionDef[];
  arguments: ArgumentDef[];
  action?: ActionHandler;
  children: Map<string, CommandNode>;
  isDefault?: boolean;
  parent?: CommandNode;
}

function parseOptionFlags(flags: string): {
  short?: string;
  long?: string;
  negatable?: boolean;
  valueName?: string;
  isBoolean: boolean;
  variadic: boolean;
} {
  const parts = flags.split(",").map((p) => p.trim());
  let short: string | undefined;
  let long: string | undefined;
  for (const part of parts) {
    if (part.startsWith("--no-")) {
      long = part;
    } else if (part.startsWith("--")) {
      long = part.split(" ")[0];
    } else if (part.startsWith("-")) {
      short = part.split(" ")[0];
    }
  }
  const valuePart = parts.find((p) => p.includes("<"));
  const valueName = valuePart?.match(/<([^>]+)>/)?.[1];
  const variadic = valueName?.endsWith("...") ?? false;
  const isBoolean = !valuePart && !long?.startsWith("--no-");
  return {
    short,
    long,
    negatable: long?.startsWith("--no-"),
    valueName,
    isBoolean,
    variadic,
  };
}

function optionKey(long?: string, short?: string): string {
  if (long?.startsWith("--no-")) return camelCase(long.slice(5));
  if (long) return camelCase(long.slice(2));
  if (short) return short.slice(1);
  return "option";
}

function camelCase(key: string): string {
  return key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

export class Command {
  private node: CommandNode;

  constructor(name = "") {
    this.node = { name, options: [], arguments: [], children: new Map() };
  }

  name(name: string): this {
    this.node.name = name;
    return this;
  }

  description(desc: string): this {
    this.node.description = desc;
    return this;
  }

  version(version: string): this {
    this.node.options.push({
      flags: "-V, --version",
      description: "output the version number",
      defaultValue: version,
    });
    return this;
  }

  command(name: string, opts?: { isDefault?: boolean }): Command {
    const parts = name.trim().split(/\s+/);
    let current = this.node;
    for (const part of parts) {
      const cmdName = part.replace(/<[^>]+>|\[[^\]]+\]/g, "").trim() || part;
      const argMatch = part.match(/<([^>]+)>/) ?? part.match(/\[([^\]]+)\]/);
      if (!current.children.has(cmdName)) {
        const child: CommandNode = {
          name: cmdName,
          options: [],
          arguments: [],
          children: new Map(),
          parent: current,
        };
        if (argMatch) {
          child.arguments.push({
            name: argMatch[1]!.replace(/\.\.\.$/, ""),
            description: "",
            required: part.startsWith("<"),
          });
        }
        current.children.set(cmdName, child);
      } else if (argMatch) {
        const child = current.children.get(cmdName)!;
        if (!child.arguments.length) {
          child.arguments.push({
            name: argMatch[1]!.replace(/\.\.\.$/, ""),
            description: "",
            required: part.startsWith("<"),
          });
        }
      }
      current = current.children.get(cmdName)!;
    }
    if (opts?.isDefault) current.isDefault = true;
    const cmd = new Command();
    cmd.node = current;
    return cmd;
  }

  option(flags: string, description: string, defaultValue?: string): this;
  option(flags: string, description: string): this;
  option(flags: string, description: string, defaultValue?: string): this {
    const parsed = parseOptionFlags(flags);
    this.node.options.push({
      flags,
      description,
      defaultValue,
      variadic: parsed.variadic,
    });
    return this;
  }

  requiredOption(flags: string, description: string): this {
    const parsed = parseOptionFlags(flags);
    this.node.options.push({
      flags,
      description,
      required: true,
      variadic: parsed.variadic,
    });
    return this;
  }

  argument(name: string, description: string): this {
    const required = !name.startsWith("[");
    const clean = name.replace(/[<[\]>]/g, "");
    this.node.arguments.push({ name: clean, description, required });
    return this;
  }

  action(handler: ActionHandler): this {
    this.node.action = handler;
    return this;
  }

  parse(argv = process.argv): void {
    const args = argv.slice(2);
    const root = this.node;

    if (args.includes("-V") || args.includes("--version")) {
      const versionOpt = root.options.find((o) => o.flags.includes("--version"));
      console.log(versionOpt?.defaultValue ?? "0.0.0");
      return;
    }

    if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
      this.printHelp(root);
      return;
    }

    const { command, remaining } = this.resolveCommand(root, args);
    if (!command) {
      console.error("Unknown command");
      this.printHelp(root);
      process.exit(1);
    }

    const { options, positional } = this.parseArgs(command, remaining);
    const missing = command.options
      .filter((o) => o.required)
      .filter((o) => {
        const parsed = parseOptionFlags(o.flags);
        const key = camelCase(optionKey(parsed.long, parsed.short));
        return options[key] === undefined;
      });
    if (missing.length) {
      console.error(`Missing required option: ${missing[0]!.flags}`);
      process.exit(1);
    }

    for (const argDef of command.arguments) {
      if (argDef.required && positional.length === 0) {
        console.error(`Missing required argument: ${argDef.name}`);
        process.exit(1);
      }
    }

    if (command.action) {
      const result = command.action(...positional, options);
      if (result instanceof Promise) {
        result.catch((err: unknown) => {
          console.error(err);
          process.exit(1);
        });
      }
    }
  }

  private resolveCommand(
    root: CommandNode,
    args: string[],
  ): { command: CommandNode | null; remaining: string[] } {
    let current = root;
    const consumed: string[] = [];
    let i = 0;

    while (i < args.length && !args[i]!.startsWith("-")) {
      const part = args[i]!;
      if (current.children.has(part)) {
        consumed.push(part);
        current = current.children.get(part)!;
        i++;
        continue;
      }
      break;
    }

    if (consumed.length === 0 && root.children.size > 0) {
      const defaultChild = [...root.children.values()].find((c) => c.isDefault);
      if (defaultChild) current = defaultChild;
    }

    const hasAction = !!current.action || current.children.size === 0;
    return {
      command: hasAction || consumed.length > 0 ? current : null,
      remaining: args.slice(i),
    };
  }

  private parseArgs(
    command: CommandNode,
    args: string[],
  ): { options: Record<string, unknown>; positional: string[] } {
    const options: Record<string, unknown> = {};
    const positional: string[] = [];

    for (const opt of command.options) {
      const parsed = parseOptionFlags(opt.flags);
      const key = camelCase(optionKey(parsed.long, parsed.short));
      if (parsed.negatable) {
        options[key] = true;
      } else if (opt.defaultValue !== undefined) {
        options[key] = opt.defaultValue;
      }
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i]!;
      if (arg === "--") {
        positional.push(...args.slice(i + 1));
        break;
      }
      if (arg.startsWith("--no-")) {
        const key = camelCase(arg.slice(5));
        options[key] = false;
        continue;
      }
      if (arg.startsWith("--")) {
        const eq = arg.indexOf("=");
        if (eq > -1) {
          const flag = arg.slice(2, eq);
          options[camelCase(flag)] = arg.slice(eq + 1);
          continue;
        }
        const flag = arg.slice(2);
        const optDef = command.options.find((o) => parseOptionFlags(o.flags).long === `--${flag}`);
        const parsed = optDef ? parseOptionFlags(optDef.flags) : { isBoolean: false, variadic: false };
        if (parsed.isBoolean) {
          options[camelCase(flag)] = true;
        } else if (parsed.variadic) {
          const values: string[] = [];
          while (i + 1 < args.length && !args[i + 1]!.startsWith("-")) {
            i++;
            values.push(args[i]!);
          }
          options[camelCase(flag)] = values;
        } else {
          options[camelCase(flag)] = args[++i];
        }
        continue;
      }
      if (arg.startsWith("-") && arg.length === 2) {
        const optDef = command.options.find((o) => parseOptionFlags(o.flags).short === arg);
        if (optDef) {
          const parsed = parseOptionFlags(optDef.flags);
          const key = camelCase(optionKey(parsed.long, parsed.short));
          if (parsed.isBoolean) {
            options[key] = true;
          } else {
            options[key] = args[++i];
          }
          continue;
        }
      }
      positional.push(arg);
    }

    return { options, positional };
  }

  private printHelp(node: CommandNode): void {
    console.log(`${node.name || "dna"} — ${node.description ?? ""}`);
    if (node.children.size) {
      console.log("\nCommands:");
      for (const child of node.children.values()) {
        console.log(`  ${child.name}  ${child.description ?? ""}`);
      }
    }
  }
}
