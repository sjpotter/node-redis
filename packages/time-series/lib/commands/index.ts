import type { CommandArguments, DoubleReply, NumberReply, RedisArgument, RedisCommands, TuplesReply, UnwrapReply, Resp2Reply, ArrayReply, BlobStringReply, MapReply } from '@redis/client/dist/lib/RESP/types';
import ADD from './ADD';
import ALTER from './ALTER';
import CREATE from './CREATE';
import CREATERULE from './CREATERULE';
import DECRBY from './DECRBY';
import DEL from './DEL';
import DELETERULE from './DELETERULE';
import GET from './GET';
import INCRBY from './INCRBY';
import INFO_DEBUG from './INFO_DEBUG';
import INFO from './INFO';
import MADD from './MADD';
import MGET_WITHLABELS from './MGET_WITHLABELS';
import MGET from './MGET';
import MRANGE_WITHLABELS from './MRANGE_WITHLABELS';
import MRANGE from './MRANGE';
import MREVRANGE_WITHLABELS from './MREVRANGE_WITHLABELS';
import MREVRANGE from './MREVRANGE';
import QUERYINDEX from './QUERYINDEX';
import RANGE from './RANGE';
import REVRANGE from './REVRANGE';
import { RedisVariadicArgument, pushVariadicArguments } from '@redis/client/dist/lib/commands/generic-transformers';

export default {
  ADD,
  add: ADD,
  ALTER,
  alter: ALTER,
  CREATE,
  create: CREATE,
  CREATERULE,
  createRule: CREATERULE,
  DECRBY,
  decrBy: DECRBY,
  DEL,
  del: DEL,
  DELETERULE,
  deleteRule: DELETERULE,
  GET,
  get: GET,
  INCRBY,
  incrBy: INCRBY,
  INFO_DEBUG,
  infoDebug: INFO_DEBUG,
  INFO,
  info: INFO,
  MADD,
  mAdd: MADD,
  MGET_WITHLABELS,
  mGetWithLabels: MGET_WITHLABELS,
  MGET,
  mGet: MGET,
  MRANGE_WITHLABELS,
  mRangeWithLabels: MRANGE_WITHLABELS,
  MRANGE,
  mRange: MRANGE,
  MREVRANGE_WITHLABELS,
  mRevRangeWithLabels: MREVRANGE_WITHLABELS,
  MREVRANGE,
  mRevRange: MREVRANGE,
  QUERYINDEX,
  queryIndex: QUERYINDEX,
  RANGE,
  range: RANGE,
  REVRANGE,
  revRange: REVRANGE
} as const satisfies RedisCommands;

export function pushRetentionArgument(args: Array<RedisArgument>, retention?: number) {
  if (retention !== undefined) {
    args.push('RETENTION', retention.toString());
  }
}

export const TIME_SERIES_ENCODING = {
  COMPRESSED: 'COMPRESSED',
  UNCOMPRESSED: 'UNCOMPRESSED'
} as const;

export type TimeSeriesEncoding = typeof TIME_SERIES_ENCODING[keyof typeof TIME_SERIES_ENCODING];

export function pushEncodingArgument(args: Array<RedisArgument>, encoding?: TimeSeriesEncoding) {
  if (encoding !== undefined) {
    args.push('ENCODING', encoding);
  }
}

export function pushChunkSizeArgument(args: Array<RedisArgument>, chunkSize?: number) {
  if (chunkSize !== undefined) {
    args.push('CHUNK_SIZE', chunkSize.toString());
  }
}

export const TIME_SERIES_DUPLICATE_POLICIES = {
  BLOCK: 'BLOCK',
  FIRST: 'FIRST',
  LAST: 'LAST',
  MIN: 'MIN',
  MAX: 'MAX',
  SUM: 'SUM'
} as const;

export type TimeSeriesDuplicatePolicies = typeof TIME_SERIES_DUPLICATE_POLICIES[keyof typeof TIME_SERIES_DUPLICATE_POLICIES];

export function pushDuplicatePolicy(args: Array<RedisArgument>, duplicatePolicy?: TimeSeriesDuplicatePolicies) {
  if (duplicatePolicy !== undefined) {
    args.push('DUPLICATE_POLICY', duplicatePolicy);
  }
}

export type Timestamp = number | Date | string;

export function transformTimestampArgument(timestamp: Timestamp): string {
  if (typeof timestamp === 'string') return timestamp;

  return (
    typeof timestamp === 'number' ?
      timestamp :
      timestamp.getTime()
  ).toString();
}

export type RawLabels = Array<[label: BlobStringReply, value: BlobStringReply]>;

export type Labels = {
  [label: string]: string;
};

export function pushLabelsArgument(args: Array<RedisArgument>, labels?: Labels) {
  if (labels) {
    args.push('LABELS');

    for (const [label, value] of Object.entries(labels)) {
      args.push(label, value);
    }
  }

  return args;
}

export type SampleRawReply = TuplesReply<[timestamp: NumberReply, value: DoubleReply]>;

export const transformSampleReply = {
  2(reply: Resp2Reply<SampleRawReply>) {
    const [ timestamp, value ] = reply as unknown as UnwrapReply<typeof reply>;
    return {
      timestamp,
      value: Number(value)
    };
  },
  3(reply: SampleRawReply) {
    const [ timestamp, value ] = reply as unknown as UnwrapReply<typeof reply>;
    return {
      timestamp,
      value
    };
  }
};

export type SamplesRawReply = ArrayReply<SampleRawReply>;

export const transformSamplesReply = {
  2(reply: Resp2Reply<SamplesRawReply>) {
    return (reply as unknown as UnwrapReply<typeof reply>)
      .map(sample => transformSampleReply[2](sample));
  },
  3(reply: SamplesRawReply) {
    return (reply as unknown as UnwrapReply<typeof reply>)
      .map(sample => transformSampleReply[3](sample));  }
};

export function transformLablesReply2(reply: RawLabels): Labels {
  const labels: Labels = {};

  for (const [k, v] of reply) {
    const key = k as unknown as UnwrapReply<BlobStringReply>;
    const value = v as unknown as UnwrapReply<BlobStringReply>;
      labels[key.toString()] = value.toString()
  }

  return labels
}

export function transformLablesReply3(reply: UnwrapReply<MapReply<any, any>>): Labels {
  const labels: Labels = {};

  if (reply instanceof Map) {
    for (const [key, value] of reply) {
      labels[key.toString()] = value.toString();
    }
  } else if (reply instanceof Array) {
    return transformLablesReply2(reply);
  } else {
    for (const [key, value] of Object.entries(reply)) {
      labels[key] = value;
    }
  }

  return labels
}

export function pushWithLabelsArgument(args: CommandArguments, selectedLabels?: RedisVariadicArgument) {
  if (!selectedLabels) {
    args.push('WITHLABELS');
    return args;
  } else {
    args.push('SELECTED_LABELS');
    return pushVariadicArguments(args, selectedLabels);
  }
}
