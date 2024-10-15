import { RedisArgument, RespVersions } from "../RESP/types";
import { RedisVariadicArgument } from "../commands/generic-transformers";

export interface CommandParser {
  redisArgs: ReadonlyArray<RedisArgument>;
  keys: ReadonlyArray<RedisArgument>;
  firstKey: RedisArgument | undefined;
  respVersion: RespVersions;
  preserve: unknown;
  cachable: boolean;

  push: (...arg: Array<RedisArgument>) => unknown;
  pushVariadic: (vals: RedisVariadicArgument) => unknown;
  pushVariadicWithLength: (vals: RedisVariadicArgument) => unknown;
  pushVariadicNumber: (vals: number | Array<number>) => unknown;
  pushKey: (key: RedisArgument) => unknown; // normal push of keys
  pushKeys: (keys: RedisVariadicArgument) => unknown; // push multiple keys at a time
  pushKeysLength: (keys: RedisVariadicArgument) => unknown; // push multiple keys at a time
  setCachable: () => unknown;
  setPreserve: (val: unknown) => unknown;
}

export class BasicCommandParser implements CommandParser {
  #redisArgs: Array<RedisArgument> = [];
  #keys: Array<RedisArgument> = [];
  #respVersion: RespVersions;
  #preserve: unknown;
  #cachable: boolean = false;

  constructor(respVersion: RespVersions = 2) {
    this.#respVersion = respVersion;
  }

  get redisArgs() {
    return this.#redisArgs;
  }

  get keys() {
    return this.#keys;
  }

  get firstKey() {
    return this.#keys.length != 0 ? this.#keys[0] : undefined;
  }

  get respVersion() {
    return this.#respVersion;
  }

  get preserve() {
    return this.#preserve;
  }

  get cachable() {
    return this.#cachable
  }

  get cacheKey() {
    let cacheKey = this.#redisArgs.map((arg) => arg.length).join('_');
    return cacheKey + '_' + this.#redisArgs.join('_');
  }

  push(...arg: Array<RedisArgument>) {
    this.#redisArgs.push(...arg);
  };

  pushVariadic(vals: RedisVariadicArgument) {
    if (Array.isArray(vals)) {
      for (const val of vals) {
        this.push(val);
      }
    } else {
      this.push(vals);
    }
  }

  pushVariadicWithLength(vals: RedisVariadicArgument) {
    if (Array.isArray(vals)) {
      this.#redisArgs.push(vals.length.toString());
    } else {
      this.#redisArgs.push('1');
    }
    this.pushVariadic(vals);
  }

  pushVariadicNumber(vals: number | number[]) {
    if (Array.isArray(vals)) {
      for (const val of vals) {
        this.push(val.toString());
      }
    } else {
      this.push(vals.toString());
    }
  }

  pushKey(key: RedisArgument) {
    this.#keys.push(key);
    this.#redisArgs.push(key);
  };

  pushKeysLength(keys: RedisVariadicArgument) {
    if (Array.isArray(keys)) {
      this.#redisArgs.push(keys.length.toString());
    } else {
      this.#redisArgs.push('1');
    }
    this.pushKeys(keys);
  }

  pushKeys(keys: RedisVariadicArgument) {
    if (Array.isArray(keys)) {
      this.#keys.push(...keys);
      this.#redisArgs.push(...keys);
    } else {
      this.#keys.push(keys);
      this.#redisArgs.push(keys);
    }
  }

  setPreserve(val: unknown) {
    this.#preserve = val;
  }

  setCachable() {
    this.#cachable = true;
  };
}
