import * as FS from 'fs';
import * as Path from 'path';

export const CONFIG_FILENAME = 'iveread.json';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export type keys<T> = T extends object ? keyof T : never;

export class ConfigService<T extends object> {
  private readonly data: T;

  constructor(filePath: string | undefined) {
    if (filePath) {
      this.data = JSON.parse(FS.readFileSync(filePath).toLocaleString());
    } else {
      this.data = {} as T;
    }
  }

  get(): T;
  get<K extends keys<T>>(key: K): T[K] | undefined;
  get<K extends keys<T>>(key: K, fallback: T[K]): T[K];
  get<K extends keys<T>>(key?: K, fallback?: T[K]): T[K] | T | undefined {
    let data = this.data;

    if (key) {
      if (hasOwnProperty.call(data, key)) {
        return data[key];
      }

      return fallback;
    }

    return data;
  }
}

export function getConfigPath(): string | undefined {
  let rootDir = __dirname;
  let lastRootDir;

  while (FS.existsSync(rootDir) && lastRootDir !== rootDir) {
    lastRootDir = rootDir;

    let configPath = Path.join(rootDir, CONFIG_FILENAME);

    if (FS.existsSync(configPath)) {
      return configPath;
    }

    rootDir = Path.join(rootDir, '..');
  }

  return undefined;
}

export function shortenPath(path: string): string {
  if (path.startsWith(CONFIG_DIR_PATH)) {
    return path.slice(CONFIG_DIR_PATH.length + 1);
  }

  return path;
}

export const CONFIG_PATH = getConfigPath();

export const CONFIG_DIR_PATH = CONFIG_PATH
  ? Path.dirname(CONFIG_PATH)
  : process.cwd();

export interface Config {
  docDir: string;
}

export const config = new ConfigService<Config>(CONFIG_PATH);

export const DOC_DIR_PATH = Path.join(
  CONFIG_DIR_PATH,
  config.get('docDir', ''),
);
