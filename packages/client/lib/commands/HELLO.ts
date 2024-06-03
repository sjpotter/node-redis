import { RedisArgument, RespVersions, TuplesToMapReply, BlobStringReply, NumberReply, ArrayReply, UnwrapReply, Resp2Reply, Command, SimpleStringReply } from '../RESP/types';

export interface HelloOptions {
  protover?: RespVersions;
  AUTH?: {
    username: RedisArgument;
    password: RedisArgument;
  };
  SETNAME?: string;
}

export type HelloReply = TuplesToMapReply<[
  [SimpleStringReply<'server'>, BlobStringReply],
  [SimpleStringReply<'version'>, BlobStringReply],
  [SimpleStringReply<'proto'>, NumberReply<RespVersions>],
  [SimpleStringReply<'id'>, NumberReply],
  [SimpleStringReply<'mode'>, BlobStringReply],
  [SimpleStringReply<'role'>, BlobStringReply],
  [SimpleStringReply<'modules'>, ArrayReply<BlobStringReply>]
]>;

export default {
  transformArguments(protover?: RespVersions, options?: HelloOptions) {
    const args: Array<RedisArgument> = ['HELLO'];

    if (protover) {
      args.push(protover.toString());

      if (options?.AUTH) {
        args.push(
          'AUTH',
          options.AUTH.username,
          options.AUTH.password
        );
      }
  
      if (options?.SETNAME) {
        args.push(
          'SETNAME',
          options.SETNAME
        );
      }
    }
    
    return args;
  },
  transformReply: {
    2: (reply: UnwrapReply<Resp2Reply<HelloReply>>) => ({
      server: reply[1],
      version: reply[3],
      proto: reply[5],
      id: reply[7],
      mode: reply[9],
      role: reply[11],
      modules: reply[13]
    }),
    3: undefined as unknown as () => HelloReply
  }
} as const satisfies Command;
