
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model KickReward
 * 
 */
export type KickReward = $Result.DefaultSelection<Prisma.$KickRewardPayload>
/**
 * Model SiteSettings
 * 
 */
export type SiteSettings = $Result.DefaultSelection<Prisma.$SiteSettingsPayload>
/**
 * Model LeaderboardSettings
 * 
 */
export type LeaderboardSettings = $Result.DefaultSelection<Prisma.$LeaderboardSettingsPayload>
/**
 * Model LeaderboardPrizeTier
 * 
 */
export type LeaderboardPrizeTier = $Result.DefaultSelection<Prisma.$LeaderboardPrizeTierPayload>
/**
 * Model Raffle
 * 
 */
export type Raffle = $Result.DefaultSelection<Prisma.$RafflePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.kickReward`: Exposes CRUD operations for the **KickReward** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more KickRewards
    * const kickRewards = await prisma.kickReward.findMany()
    * ```
    */
  get kickReward(): Prisma.KickRewardDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.siteSettings`: Exposes CRUD operations for the **SiteSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SiteSettings
    * const siteSettings = await prisma.siteSettings.findMany()
    * ```
    */
  get siteSettings(): Prisma.SiteSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leaderboardSettings`: Exposes CRUD operations for the **LeaderboardSettings** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeaderboardSettings
    * const leaderboardSettings = await prisma.leaderboardSettings.findMany()
    * ```
    */
  get leaderboardSettings(): Prisma.LeaderboardSettingsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.leaderboardPrizeTier`: Exposes CRUD operations for the **LeaderboardPrizeTier** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LeaderboardPrizeTiers
    * const leaderboardPrizeTiers = await prisma.leaderboardPrizeTier.findMany()
    * ```
    */
  get leaderboardPrizeTier(): Prisma.LeaderboardPrizeTierDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.raffle`: Exposes CRUD operations for the **Raffle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Raffles
    * const raffles = await prisma.raffle.findMany()
    * ```
    */
  get raffle(): Prisma.RaffleDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.7.0
   * Query Engine version: 75cbdc1eb7150937890ad5465d861175c6624711
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    KickReward: 'KickReward',
    SiteSettings: 'SiteSettings',
    LeaderboardSettings: 'LeaderboardSettings',
    LeaderboardPrizeTier: 'LeaderboardPrizeTier',
    Raffle: 'Raffle'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "kickReward" | "siteSettings" | "leaderboardSettings" | "leaderboardPrizeTier" | "raffle"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      KickReward: {
        payload: Prisma.$KickRewardPayload<ExtArgs>
        fields: Prisma.KickRewardFieldRefs
        operations: {
          findUnique: {
            args: Prisma.KickRewardFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.KickRewardFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          findFirst: {
            args: Prisma.KickRewardFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.KickRewardFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          findMany: {
            args: Prisma.KickRewardFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>[]
          }
          create: {
            args: Prisma.KickRewardCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          createMany: {
            args: Prisma.KickRewardCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.KickRewardCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>[]
          }
          delete: {
            args: Prisma.KickRewardDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          update: {
            args: Prisma.KickRewardUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          deleteMany: {
            args: Prisma.KickRewardDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.KickRewardUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.KickRewardUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>[]
          }
          upsert: {
            args: Prisma.KickRewardUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$KickRewardPayload>
          }
          aggregate: {
            args: Prisma.KickRewardAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateKickReward>
          }
          groupBy: {
            args: Prisma.KickRewardGroupByArgs<ExtArgs>
            result: $Utils.Optional<KickRewardGroupByOutputType>[]
          }
          count: {
            args: Prisma.KickRewardCountArgs<ExtArgs>
            result: $Utils.Optional<KickRewardCountAggregateOutputType> | number
          }
        }
      }
      SiteSettings: {
        payload: Prisma.$SiteSettingsPayload<ExtArgs>
        fields: Prisma.SiteSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SiteSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SiteSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          findFirst: {
            args: Prisma.SiteSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SiteSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          findMany: {
            args: Prisma.SiteSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          create: {
            args: Prisma.SiteSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          createMany: {
            args: Prisma.SiteSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SiteSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          delete: {
            args: Prisma.SiteSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          update: {
            args: Prisma.SiteSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          deleteMany: {
            args: Prisma.SiteSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SiteSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SiteSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>[]
          }
          upsert: {
            args: Prisma.SiteSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SiteSettingsPayload>
          }
          aggregate: {
            args: Prisma.SiteSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSiteSettings>
          }
          groupBy: {
            args: Prisma.SiteSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<SiteSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.SiteSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<SiteSettingsCountAggregateOutputType> | number
          }
        }
      }
      LeaderboardSettings: {
        payload: Prisma.$LeaderboardSettingsPayload<ExtArgs>
        fields: Prisma.LeaderboardSettingsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeaderboardSettingsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeaderboardSettingsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          findFirst: {
            args: Prisma.LeaderboardSettingsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeaderboardSettingsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          findMany: {
            args: Prisma.LeaderboardSettingsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>[]
          }
          create: {
            args: Prisma.LeaderboardSettingsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          createMany: {
            args: Prisma.LeaderboardSettingsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeaderboardSettingsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>[]
          }
          delete: {
            args: Prisma.LeaderboardSettingsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          update: {
            args: Prisma.LeaderboardSettingsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          deleteMany: {
            args: Prisma.LeaderboardSettingsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeaderboardSettingsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeaderboardSettingsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>[]
          }
          upsert: {
            args: Prisma.LeaderboardSettingsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardSettingsPayload>
          }
          aggregate: {
            args: Prisma.LeaderboardSettingsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeaderboardSettings>
          }
          groupBy: {
            args: Prisma.LeaderboardSettingsGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardSettingsGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeaderboardSettingsCountArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardSettingsCountAggregateOutputType> | number
          }
        }
      }
      LeaderboardPrizeTier: {
        payload: Prisma.$LeaderboardPrizeTierPayload<ExtArgs>
        fields: Prisma.LeaderboardPrizeTierFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LeaderboardPrizeTierFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LeaderboardPrizeTierFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          findFirst: {
            args: Prisma.LeaderboardPrizeTierFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LeaderboardPrizeTierFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          findMany: {
            args: Prisma.LeaderboardPrizeTierFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>[]
          }
          create: {
            args: Prisma.LeaderboardPrizeTierCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          createMany: {
            args: Prisma.LeaderboardPrizeTierCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LeaderboardPrizeTierCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>[]
          }
          delete: {
            args: Prisma.LeaderboardPrizeTierDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          update: {
            args: Prisma.LeaderboardPrizeTierUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          deleteMany: {
            args: Prisma.LeaderboardPrizeTierDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LeaderboardPrizeTierUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LeaderboardPrizeTierUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>[]
          }
          upsert: {
            args: Prisma.LeaderboardPrizeTierUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LeaderboardPrizeTierPayload>
          }
          aggregate: {
            args: Prisma.LeaderboardPrizeTierAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLeaderboardPrizeTier>
          }
          groupBy: {
            args: Prisma.LeaderboardPrizeTierGroupByArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardPrizeTierGroupByOutputType>[]
          }
          count: {
            args: Prisma.LeaderboardPrizeTierCountArgs<ExtArgs>
            result: $Utils.Optional<LeaderboardPrizeTierCountAggregateOutputType> | number
          }
        }
      }
      Raffle: {
        payload: Prisma.$RafflePayload<ExtArgs>
        fields: Prisma.RaffleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RaffleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RaffleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          findFirst: {
            args: Prisma.RaffleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RaffleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          findMany: {
            args: Prisma.RaffleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          create: {
            args: Prisma.RaffleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          createMany: {
            args: Prisma.RaffleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RaffleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          delete: {
            args: Prisma.RaffleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          update: {
            args: Prisma.RaffleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          deleteMany: {
            args: Prisma.RaffleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RaffleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RaffleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>[]
          }
          upsert: {
            args: Prisma.RaffleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RafflePayload>
          }
          aggregate: {
            args: Prisma.RaffleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRaffle>
          }
          groupBy: {
            args: Prisma.RaffleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RaffleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RaffleCountArgs<ExtArgs>
            result: $Utils.Optional<RaffleCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    kickReward?: KickRewardOmit
    siteSettings?: SiteSettingsOmit
    leaderboardSettings?: LeaderboardSettingsOmit
    leaderboardPrizeTier?: LeaderboardPrizeTierOmit
    raffle?: RaffleOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LeaderboardSettingsCountOutputType
   */

  export type LeaderboardSettingsCountOutputType = {
    prizeTiers: number
  }

  export type LeaderboardSettingsCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prizeTiers?: boolean | LeaderboardSettingsCountOutputTypeCountPrizeTiersArgs
  }

  // Custom InputTypes
  /**
   * LeaderboardSettingsCountOutputType without action
   */
  export type LeaderboardSettingsCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettingsCountOutputType
     */
    select?: LeaderboardSettingsCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LeaderboardSettingsCountOutputType without action
   */
  export type LeaderboardSettingsCountOutputTypeCountPrizeTiersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaderboardPrizeTierWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    points: number | null
  }

  export type UserSumAggregateOutputType = {
    points: number | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    kick_user_id: string | null
    kick_username: string | null
    email: string | null
    avatar: string | null
    access_token: string | null
    refresh_token: string | null
    kick_token_expires_at: Date | null
    points: number | null
    isAdmin: boolean | null
    isKickBroadcaster: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    bio: string | null
    display_name: string | null
    profile_accent: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    kick_user_id: string | null
    kick_username: string | null
    email: string | null
    avatar: string | null
    access_token: string | null
    refresh_token: string | null
    kick_token_expires_at: Date | null
    points: number | null
    isAdmin: boolean | null
    isKickBroadcaster: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    bio: string | null
    display_name: string | null
    profile_accent: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    kick_user_id: number
    kick_username: number
    email: number
    avatar: number
    access_token: number
    refresh_token: number
    kick_token_expires_at: number
    points: number
    isAdmin: number
    isKickBroadcaster: number
    createdAt: number
    updatedAt: number
    bio: number
    display_name: number
    profile_accent: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    points?: true
  }

  export type UserSumAggregateInputType = {
    points?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    kick_user_id?: true
    kick_username?: true
    email?: true
    avatar?: true
    access_token?: true
    refresh_token?: true
    kick_token_expires_at?: true
    points?: true
    isAdmin?: true
    isKickBroadcaster?: true
    createdAt?: true
    updatedAt?: true
    bio?: true
    display_name?: true
    profile_accent?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    kick_user_id?: true
    kick_username?: true
    email?: true
    avatar?: true
    access_token?: true
    refresh_token?: true
    kick_token_expires_at?: true
    points?: true
    isAdmin?: true
    isKickBroadcaster?: true
    createdAt?: true
    updatedAt?: true
    bio?: true
    display_name?: true
    profile_accent?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    kick_user_id?: true
    kick_username?: true
    email?: true
    avatar?: true
    access_token?: true
    refresh_token?: true
    kick_token_expires_at?: true
    points?: true
    isAdmin?: true
    isKickBroadcaster?: true
    createdAt?: true
    updatedAt?: true
    bio?: true
    display_name?: true
    profile_accent?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    kick_user_id: string | null
    kick_username: string | null
    email: string | null
    avatar: string | null
    access_token: string | null
    refresh_token: string | null
    kick_token_expires_at: Date | null
    points: number
    isAdmin: boolean
    isKickBroadcaster: boolean
    createdAt: Date
    updatedAt: Date
    bio: string | null
    display_name: string | null
    profile_accent: string | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_user_id?: boolean
    kick_username?: boolean
    email?: boolean
    avatar?: boolean
    access_token?: boolean
    refresh_token?: boolean
    kick_token_expires_at?: boolean
    points?: boolean
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bio?: boolean
    display_name?: boolean
    profile_accent?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_user_id?: boolean
    kick_username?: boolean
    email?: boolean
    avatar?: boolean
    access_token?: boolean
    refresh_token?: boolean
    kick_token_expires_at?: boolean
    points?: boolean
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bio?: boolean
    display_name?: boolean
    profile_accent?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_user_id?: boolean
    kick_username?: boolean
    email?: boolean
    avatar?: boolean
    access_token?: boolean
    refresh_token?: boolean
    kick_token_expires_at?: boolean
    points?: boolean
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bio?: boolean
    display_name?: boolean
    profile_accent?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    kick_user_id?: boolean
    kick_username?: boolean
    email?: boolean
    avatar?: boolean
    access_token?: boolean
    refresh_token?: boolean
    kick_token_expires_at?: boolean
    points?: boolean
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    bio?: boolean
    display_name?: boolean
    profile_accent?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kick_user_id" | "kick_username" | "email" | "avatar" | "access_token" | "refresh_token" | "kick_token_expires_at" | "points" | "isAdmin" | "isKickBroadcaster" | "createdAt" | "updatedAt" | "bio" | "display_name" | "profile_accent", ExtArgs["result"]["user"]>

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kick_user_id: string | null
      kick_username: string | null
      email: string | null
      avatar: string | null
      access_token: string | null
      refresh_token: string | null
      kick_token_expires_at: Date | null
      points: number
      isAdmin: boolean
      isKickBroadcaster: boolean
      createdAt: Date
      updatedAt: Date
      bio: string | null
      display_name: string | null
      profile_accent: string | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly kick_user_id: FieldRef<"User", 'String'>
    readonly kick_username: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly access_token: FieldRef<"User", 'String'>
    readonly refresh_token: FieldRef<"User", 'String'>
    readonly kick_token_expires_at: FieldRef<"User", 'DateTime'>
    readonly points: FieldRef<"User", 'Int'>
    readonly isAdmin: FieldRef<"User", 'Boolean'>
    readonly isKickBroadcaster: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
    readonly bio: FieldRef<"User", 'String'>
    readonly display_name: FieldRef<"User", 'String'>
    readonly profile_accent: FieldRef<"User", 'String'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
  }


  /**
   * Model KickReward
   */

  export type AggregateKickReward = {
    _count: KickRewardCountAggregateOutputType | null
    _avg: KickRewardAvgAggregateOutputType | null
    _sum: KickRewardSumAggregateOutputType | null
    _min: KickRewardMinAggregateOutputType | null
    _max: KickRewardMaxAggregateOutputType | null
  }

  export type KickRewardAvgAggregateOutputType = {
    cost: number | null
  }

  export type KickRewardSumAggregateOutputType = {
    cost: number | null
  }

  export type KickRewardMinAggregateOutputType = {
    id: string | null
    kick_reward_id: string | null
    title: string | null
    description: string | null
    cost: number | null
    background_color: string | null
    is_enabled: boolean | null
    is_paused: boolean | null
    is_user_input_required: boolean | null
    should_redemptions_skip_request_queue: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KickRewardMaxAggregateOutputType = {
    id: string | null
    kick_reward_id: string | null
    title: string | null
    description: string | null
    cost: number | null
    background_color: string | null
    is_enabled: boolean | null
    is_paused: boolean | null
    is_user_input_required: boolean | null
    should_redemptions_skip_request_queue: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type KickRewardCountAggregateOutputType = {
    id: number
    kick_reward_id: number
    title: number
    description: number
    cost: number
    background_color: number
    is_enabled: number
    is_paused: number
    is_user_input_required: number
    should_redemptions_skip_request_queue: number
    raw_json: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type KickRewardAvgAggregateInputType = {
    cost?: true
  }

  export type KickRewardSumAggregateInputType = {
    cost?: true
  }

  export type KickRewardMinAggregateInputType = {
    id?: true
    kick_reward_id?: true
    title?: true
    description?: true
    cost?: true
    background_color?: true
    is_enabled?: true
    is_paused?: true
    is_user_input_required?: true
    should_redemptions_skip_request_queue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KickRewardMaxAggregateInputType = {
    id?: true
    kick_reward_id?: true
    title?: true
    description?: true
    cost?: true
    background_color?: true
    is_enabled?: true
    is_paused?: true
    is_user_input_required?: true
    should_redemptions_skip_request_queue?: true
    createdAt?: true
    updatedAt?: true
  }

  export type KickRewardCountAggregateInputType = {
    id?: true
    kick_reward_id?: true
    title?: true
    description?: true
    cost?: true
    background_color?: true
    is_enabled?: true
    is_paused?: true
    is_user_input_required?: true
    should_redemptions_skip_request_queue?: true
    raw_json?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type KickRewardAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KickReward to aggregate.
     */
    where?: KickRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KickRewards to fetch.
     */
    orderBy?: KickRewardOrderByWithRelationInput | KickRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: KickRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KickRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KickRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned KickRewards
    **/
    _count?: true | KickRewardCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: KickRewardAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: KickRewardSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: KickRewardMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: KickRewardMaxAggregateInputType
  }

  export type GetKickRewardAggregateType<T extends KickRewardAggregateArgs> = {
        [P in keyof T & keyof AggregateKickReward]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateKickReward[P]>
      : GetScalarType<T[P], AggregateKickReward[P]>
  }




  export type KickRewardGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: KickRewardWhereInput
    orderBy?: KickRewardOrderByWithAggregationInput | KickRewardOrderByWithAggregationInput[]
    by: KickRewardScalarFieldEnum[] | KickRewardScalarFieldEnum
    having?: KickRewardScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: KickRewardCountAggregateInputType | true
    _avg?: KickRewardAvgAggregateInputType
    _sum?: KickRewardSumAggregateInputType
    _min?: KickRewardMinAggregateInputType
    _max?: KickRewardMaxAggregateInputType
  }

  export type KickRewardGroupByOutputType = {
    id: string
    kick_reward_id: string
    title: string
    description: string | null
    cost: number
    background_color: string | null
    is_enabled: boolean
    is_paused: boolean
    is_user_input_required: boolean
    should_redemptions_skip_request_queue: boolean
    raw_json: JsonValue | null
    createdAt: Date
    updatedAt: Date
    _count: KickRewardCountAggregateOutputType | null
    _avg: KickRewardAvgAggregateOutputType | null
    _sum: KickRewardSumAggregateOutputType | null
    _min: KickRewardMinAggregateOutputType | null
    _max: KickRewardMaxAggregateOutputType | null
  }

  type GetKickRewardGroupByPayload<T extends KickRewardGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<KickRewardGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof KickRewardGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], KickRewardGroupByOutputType[P]>
            : GetScalarType<T[P], KickRewardGroupByOutputType[P]>
        }
      >
    >


  export type KickRewardSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_reward_id?: boolean
    title?: boolean
    description?: boolean
    cost?: boolean
    background_color?: boolean
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kickReward"]>

  export type KickRewardSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_reward_id?: boolean
    title?: boolean
    description?: boolean
    cost?: boolean
    background_color?: boolean
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kickReward"]>

  export type KickRewardSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kick_reward_id?: boolean
    title?: boolean
    description?: boolean
    cost?: boolean
    background_color?: boolean
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["kickReward"]>

  export type KickRewardSelectScalar = {
    id?: boolean
    kick_reward_id?: boolean
    title?: boolean
    description?: boolean
    cost?: boolean
    background_color?: boolean
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type KickRewardOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kick_reward_id" | "title" | "description" | "cost" | "background_color" | "is_enabled" | "is_paused" | "is_user_input_required" | "should_redemptions_skip_request_queue" | "raw_json" | "createdAt" | "updatedAt", ExtArgs["result"]["kickReward"]>

  export type $KickRewardPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "KickReward"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kick_reward_id: string
      title: string
      description: string | null
      cost: number
      background_color: string | null
      is_enabled: boolean
      is_paused: boolean
      is_user_input_required: boolean
      should_redemptions_skip_request_queue: boolean
      raw_json: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["kickReward"]>
    composites: {}
  }

  type KickRewardGetPayload<S extends boolean | null | undefined | KickRewardDefaultArgs> = $Result.GetResult<Prisma.$KickRewardPayload, S>

  type KickRewardCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<KickRewardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: KickRewardCountAggregateInputType | true
    }

  export interface KickRewardDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['KickReward'], meta: { name: 'KickReward' } }
    /**
     * Find zero or one KickReward that matches the filter.
     * @param {KickRewardFindUniqueArgs} args - Arguments to find a KickReward
     * @example
     * // Get one KickReward
     * const kickReward = await prisma.kickReward.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends KickRewardFindUniqueArgs>(args: SelectSubset<T, KickRewardFindUniqueArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one KickReward that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {KickRewardFindUniqueOrThrowArgs} args - Arguments to find a KickReward
     * @example
     * // Get one KickReward
     * const kickReward = await prisma.kickReward.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends KickRewardFindUniqueOrThrowArgs>(args: SelectSubset<T, KickRewardFindUniqueOrThrowArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KickReward that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardFindFirstArgs} args - Arguments to find a KickReward
     * @example
     * // Get one KickReward
     * const kickReward = await prisma.kickReward.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends KickRewardFindFirstArgs>(args?: SelectSubset<T, KickRewardFindFirstArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first KickReward that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardFindFirstOrThrowArgs} args - Arguments to find a KickReward
     * @example
     * // Get one KickReward
     * const kickReward = await prisma.kickReward.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends KickRewardFindFirstOrThrowArgs>(args?: SelectSubset<T, KickRewardFindFirstOrThrowArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more KickRewards that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all KickRewards
     * const kickRewards = await prisma.kickReward.findMany()
     * 
     * // Get first 10 KickRewards
     * const kickRewards = await prisma.kickReward.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const kickRewardWithIdOnly = await prisma.kickReward.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends KickRewardFindManyArgs>(args?: SelectSubset<T, KickRewardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a KickReward.
     * @param {KickRewardCreateArgs} args - Arguments to create a KickReward.
     * @example
     * // Create one KickReward
     * const KickReward = await prisma.kickReward.create({
     *   data: {
     *     // ... data to create a KickReward
     *   }
     * })
     * 
     */
    create<T extends KickRewardCreateArgs>(args: SelectSubset<T, KickRewardCreateArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many KickRewards.
     * @param {KickRewardCreateManyArgs} args - Arguments to create many KickRewards.
     * @example
     * // Create many KickRewards
     * const kickReward = await prisma.kickReward.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends KickRewardCreateManyArgs>(args?: SelectSubset<T, KickRewardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many KickRewards and returns the data saved in the database.
     * @param {KickRewardCreateManyAndReturnArgs} args - Arguments to create many KickRewards.
     * @example
     * // Create many KickRewards
     * const kickReward = await prisma.kickReward.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many KickRewards and only return the `id`
     * const kickRewardWithIdOnly = await prisma.kickReward.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends KickRewardCreateManyAndReturnArgs>(args?: SelectSubset<T, KickRewardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a KickReward.
     * @param {KickRewardDeleteArgs} args - Arguments to delete one KickReward.
     * @example
     * // Delete one KickReward
     * const KickReward = await prisma.kickReward.delete({
     *   where: {
     *     // ... filter to delete one KickReward
     *   }
     * })
     * 
     */
    delete<T extends KickRewardDeleteArgs>(args: SelectSubset<T, KickRewardDeleteArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one KickReward.
     * @param {KickRewardUpdateArgs} args - Arguments to update one KickReward.
     * @example
     * // Update one KickReward
     * const kickReward = await prisma.kickReward.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends KickRewardUpdateArgs>(args: SelectSubset<T, KickRewardUpdateArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more KickRewards.
     * @param {KickRewardDeleteManyArgs} args - Arguments to filter KickRewards to delete.
     * @example
     * // Delete a few KickRewards
     * const { count } = await prisma.kickReward.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends KickRewardDeleteManyArgs>(args?: SelectSubset<T, KickRewardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KickRewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many KickRewards
     * const kickReward = await prisma.kickReward.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends KickRewardUpdateManyArgs>(args: SelectSubset<T, KickRewardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more KickRewards and returns the data updated in the database.
     * @param {KickRewardUpdateManyAndReturnArgs} args - Arguments to update many KickRewards.
     * @example
     * // Update many KickRewards
     * const kickReward = await prisma.kickReward.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more KickRewards and only return the `id`
     * const kickRewardWithIdOnly = await prisma.kickReward.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends KickRewardUpdateManyAndReturnArgs>(args: SelectSubset<T, KickRewardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one KickReward.
     * @param {KickRewardUpsertArgs} args - Arguments to update or create a KickReward.
     * @example
     * // Update or create a KickReward
     * const kickReward = await prisma.kickReward.upsert({
     *   create: {
     *     // ... data to create a KickReward
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the KickReward we want to update
     *   }
     * })
     */
    upsert<T extends KickRewardUpsertArgs>(args: SelectSubset<T, KickRewardUpsertArgs<ExtArgs>>): Prisma__KickRewardClient<$Result.GetResult<Prisma.$KickRewardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of KickRewards.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardCountArgs} args - Arguments to filter KickRewards to count.
     * @example
     * // Count the number of KickRewards
     * const count = await prisma.kickReward.count({
     *   where: {
     *     // ... the filter for the KickRewards we want to count
     *   }
     * })
    **/
    count<T extends KickRewardCountArgs>(
      args?: Subset<T, KickRewardCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], KickRewardCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a KickReward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends KickRewardAggregateArgs>(args: Subset<T, KickRewardAggregateArgs>): Prisma.PrismaPromise<GetKickRewardAggregateType<T>>

    /**
     * Group by KickReward.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {KickRewardGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends KickRewardGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: KickRewardGroupByArgs['orderBy'] }
        : { orderBy?: KickRewardGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, KickRewardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKickRewardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the KickReward model
   */
  readonly fields: KickRewardFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for KickReward.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__KickRewardClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the KickReward model
   */
  interface KickRewardFieldRefs {
    readonly id: FieldRef<"KickReward", 'String'>
    readonly kick_reward_id: FieldRef<"KickReward", 'String'>
    readonly title: FieldRef<"KickReward", 'String'>
    readonly description: FieldRef<"KickReward", 'String'>
    readonly cost: FieldRef<"KickReward", 'Int'>
    readonly background_color: FieldRef<"KickReward", 'String'>
    readonly is_enabled: FieldRef<"KickReward", 'Boolean'>
    readonly is_paused: FieldRef<"KickReward", 'Boolean'>
    readonly is_user_input_required: FieldRef<"KickReward", 'Boolean'>
    readonly should_redemptions_skip_request_queue: FieldRef<"KickReward", 'Boolean'>
    readonly raw_json: FieldRef<"KickReward", 'Json'>
    readonly createdAt: FieldRef<"KickReward", 'DateTime'>
    readonly updatedAt: FieldRef<"KickReward", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * KickReward findUnique
   */
  export type KickRewardFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter, which KickReward to fetch.
     */
    where: KickRewardWhereUniqueInput
  }

  /**
   * KickReward findUniqueOrThrow
   */
  export type KickRewardFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter, which KickReward to fetch.
     */
    where: KickRewardWhereUniqueInput
  }

  /**
   * KickReward findFirst
   */
  export type KickRewardFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter, which KickReward to fetch.
     */
    where?: KickRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KickRewards to fetch.
     */
    orderBy?: KickRewardOrderByWithRelationInput | KickRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KickRewards.
     */
    cursor?: KickRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KickRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KickRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KickRewards.
     */
    distinct?: KickRewardScalarFieldEnum | KickRewardScalarFieldEnum[]
  }

  /**
   * KickReward findFirstOrThrow
   */
  export type KickRewardFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter, which KickReward to fetch.
     */
    where?: KickRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KickRewards to fetch.
     */
    orderBy?: KickRewardOrderByWithRelationInput | KickRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for KickRewards.
     */
    cursor?: KickRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KickRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KickRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KickRewards.
     */
    distinct?: KickRewardScalarFieldEnum | KickRewardScalarFieldEnum[]
  }

  /**
   * KickReward findMany
   */
  export type KickRewardFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter, which KickRewards to fetch.
     */
    where?: KickRewardWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of KickRewards to fetch.
     */
    orderBy?: KickRewardOrderByWithRelationInput | KickRewardOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing KickRewards.
     */
    cursor?: KickRewardWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` KickRewards from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` KickRewards.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of KickRewards.
     */
    distinct?: KickRewardScalarFieldEnum | KickRewardScalarFieldEnum[]
  }

  /**
   * KickReward create
   */
  export type KickRewardCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * The data needed to create a KickReward.
     */
    data: XOR<KickRewardCreateInput, KickRewardUncheckedCreateInput>
  }

  /**
   * KickReward createMany
   */
  export type KickRewardCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many KickRewards.
     */
    data: KickRewardCreateManyInput | KickRewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KickReward createManyAndReturn
   */
  export type KickRewardCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * The data used to create many KickRewards.
     */
    data: KickRewardCreateManyInput | KickRewardCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * KickReward update
   */
  export type KickRewardUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * The data needed to update a KickReward.
     */
    data: XOR<KickRewardUpdateInput, KickRewardUncheckedUpdateInput>
    /**
     * Choose, which KickReward to update.
     */
    where: KickRewardWhereUniqueInput
  }

  /**
   * KickReward updateMany
   */
  export type KickRewardUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update KickRewards.
     */
    data: XOR<KickRewardUpdateManyMutationInput, KickRewardUncheckedUpdateManyInput>
    /**
     * Filter which KickRewards to update
     */
    where?: KickRewardWhereInput
    /**
     * Limit how many KickRewards to update.
     */
    limit?: number
  }

  /**
   * KickReward updateManyAndReturn
   */
  export type KickRewardUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * The data used to update KickRewards.
     */
    data: XOR<KickRewardUpdateManyMutationInput, KickRewardUncheckedUpdateManyInput>
    /**
     * Filter which KickRewards to update
     */
    where?: KickRewardWhereInput
    /**
     * Limit how many KickRewards to update.
     */
    limit?: number
  }

  /**
   * KickReward upsert
   */
  export type KickRewardUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * The filter to search for the KickReward to update in case it exists.
     */
    where: KickRewardWhereUniqueInput
    /**
     * In case the KickReward found by the `where` argument doesn't exist, create a new KickReward with this data.
     */
    create: XOR<KickRewardCreateInput, KickRewardUncheckedCreateInput>
    /**
     * In case the KickReward was found with the provided `where` argument, update it with this data.
     */
    update: XOR<KickRewardUpdateInput, KickRewardUncheckedUpdateInput>
  }

  /**
   * KickReward delete
   */
  export type KickRewardDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
    /**
     * Filter which KickReward to delete.
     */
    where: KickRewardWhereUniqueInput
  }

  /**
   * KickReward deleteMany
   */
  export type KickRewardDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which KickRewards to delete
     */
    where?: KickRewardWhereInput
    /**
     * Limit how many KickRewards to delete.
     */
    limit?: number
  }

  /**
   * KickReward without action
   */
  export type KickRewardDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the KickReward
     */
    select?: KickRewardSelect<ExtArgs> | null
    /**
     * Omit specific fields from the KickReward
     */
    omit?: KickRewardOmit<ExtArgs> | null
  }


  /**
   * Model SiteSettings
   */

  export type AggregateSiteSettings = {
    _count: SiteSettingsCountAggregateOutputType | null
    _min: SiteSettingsMinAggregateOutputType | null
    _max: SiteSettingsMaxAggregateOutputType | null
  }

  export type SiteSettingsMinAggregateOutputType = {
    id: string | null
    kickUrl: string | null
    discordUrl: string | null
    youtubeUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteSettingsMaxAggregateOutputType = {
    id: string | null
    kickUrl: string | null
    discordUrl: string | null
    youtubeUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SiteSettingsCountAggregateOutputType = {
    id: number
    kickUrl: number
    discordUrl: number
    youtubeUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SiteSettingsMinAggregateInputType = {
    id?: true
    kickUrl?: true
    discordUrl?: true
    youtubeUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteSettingsMaxAggregateInputType = {
    id?: true
    kickUrl?: true
    discordUrl?: true
    youtubeUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SiteSettingsCountAggregateInputType = {
    id?: true
    kickUrl?: true
    discordUrl?: true
    youtubeUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SiteSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteSettings to aggregate.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SiteSettings
    **/
    _count?: true | SiteSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SiteSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SiteSettingsMaxAggregateInputType
  }

  export type GetSiteSettingsAggregateType<T extends SiteSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateSiteSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSiteSettings[P]>
      : GetScalarType<T[P], AggregateSiteSettings[P]>
  }




  export type SiteSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SiteSettingsWhereInput
    orderBy?: SiteSettingsOrderByWithAggregationInput | SiteSettingsOrderByWithAggregationInput[]
    by: SiteSettingsScalarFieldEnum[] | SiteSettingsScalarFieldEnum
    having?: SiteSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SiteSettingsCountAggregateInputType | true
    _min?: SiteSettingsMinAggregateInputType
    _max?: SiteSettingsMaxAggregateInputType
  }

  export type SiteSettingsGroupByOutputType = {
    id: string
    kickUrl: string
    discordUrl: string | null
    youtubeUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: SiteSettingsCountAggregateOutputType | null
    _min: SiteSettingsMinAggregateOutputType | null
    _max: SiteSettingsMaxAggregateOutputType | null
  }

  type GetSiteSettingsGroupByPayload<T extends SiteSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SiteSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SiteSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SiteSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], SiteSettingsGroupByOutputType[P]>
        }
      >
    >


  export type SiteSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kickUrl?: boolean
    discordUrl?: boolean
    youtubeUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kickUrl?: boolean
    discordUrl?: boolean
    youtubeUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    kickUrl?: boolean
    discordUrl?: boolean
    youtubeUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["siteSettings"]>

  export type SiteSettingsSelectScalar = {
    id?: boolean
    kickUrl?: boolean
    discordUrl?: boolean
    youtubeUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SiteSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "kickUrl" | "discordUrl" | "youtubeUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["siteSettings"]>

  export type $SiteSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SiteSettings"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      kickUrl: string
      discordUrl: string | null
      youtubeUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["siteSettings"]>
    composites: {}
  }

  type SiteSettingsGetPayload<S extends boolean | null | undefined | SiteSettingsDefaultArgs> = $Result.GetResult<Prisma.$SiteSettingsPayload, S>

  type SiteSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SiteSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SiteSettingsCountAggregateInputType | true
    }

  export interface SiteSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SiteSettings'], meta: { name: 'SiteSettings' } }
    /**
     * Find zero or one SiteSettings that matches the filter.
     * @param {SiteSettingsFindUniqueArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SiteSettingsFindUniqueArgs>(args: SelectSubset<T, SiteSettingsFindUniqueArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SiteSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SiteSettingsFindUniqueOrThrowArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SiteSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, SiteSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindFirstArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SiteSettingsFindFirstArgs>(args?: SelectSubset<T, SiteSettingsFindFirstArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SiteSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindFirstOrThrowArgs} args - Arguments to find a SiteSettings
     * @example
     * // Get one SiteSettings
     * const siteSettings = await prisma.siteSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SiteSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, SiteSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SiteSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SiteSettings
     * const siteSettings = await prisma.siteSettings.findMany()
     * 
     * // Get first 10 SiteSettings
     * const siteSettings = await prisma.siteSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SiteSettingsFindManyArgs>(args?: SelectSubset<T, SiteSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SiteSettings.
     * @param {SiteSettingsCreateArgs} args - Arguments to create a SiteSettings.
     * @example
     * // Create one SiteSettings
     * const SiteSettings = await prisma.siteSettings.create({
     *   data: {
     *     // ... data to create a SiteSettings
     *   }
     * })
     * 
     */
    create<T extends SiteSettingsCreateArgs>(args: SelectSubset<T, SiteSettingsCreateArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SiteSettings.
     * @param {SiteSettingsCreateManyArgs} args - Arguments to create many SiteSettings.
     * @example
     * // Create many SiteSettings
     * const siteSettings = await prisma.siteSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SiteSettingsCreateManyArgs>(args?: SelectSubset<T, SiteSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SiteSettings and returns the data saved in the database.
     * @param {SiteSettingsCreateManyAndReturnArgs} args - Arguments to create many SiteSettings.
     * @example
     * // Create many SiteSettings
     * const siteSettings = await prisma.siteSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SiteSettings and only return the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SiteSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, SiteSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SiteSettings.
     * @param {SiteSettingsDeleteArgs} args - Arguments to delete one SiteSettings.
     * @example
     * // Delete one SiteSettings
     * const SiteSettings = await prisma.siteSettings.delete({
     *   where: {
     *     // ... filter to delete one SiteSettings
     *   }
     * })
     * 
     */
    delete<T extends SiteSettingsDeleteArgs>(args: SelectSubset<T, SiteSettingsDeleteArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SiteSettings.
     * @param {SiteSettingsUpdateArgs} args - Arguments to update one SiteSettings.
     * @example
     * // Update one SiteSettings
     * const siteSettings = await prisma.siteSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SiteSettingsUpdateArgs>(args: SelectSubset<T, SiteSettingsUpdateArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SiteSettings.
     * @param {SiteSettingsDeleteManyArgs} args - Arguments to filter SiteSettings to delete.
     * @example
     * // Delete a few SiteSettings
     * const { count } = await prisma.siteSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SiteSettingsDeleteManyArgs>(args?: SelectSubset<T, SiteSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SiteSettings
     * const siteSettings = await prisma.siteSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SiteSettingsUpdateManyArgs>(args: SelectSubset<T, SiteSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SiteSettings and returns the data updated in the database.
     * @param {SiteSettingsUpdateManyAndReturnArgs} args - Arguments to update many SiteSettings.
     * @example
     * // Update many SiteSettings
     * const siteSettings = await prisma.siteSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SiteSettings and only return the `id`
     * const siteSettingsWithIdOnly = await prisma.siteSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SiteSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, SiteSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SiteSettings.
     * @param {SiteSettingsUpsertArgs} args - Arguments to update or create a SiteSettings.
     * @example
     * // Update or create a SiteSettings
     * const siteSettings = await prisma.siteSettings.upsert({
     *   create: {
     *     // ... data to create a SiteSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SiteSettings we want to update
     *   }
     * })
     */
    upsert<T extends SiteSettingsUpsertArgs>(args: SelectSubset<T, SiteSettingsUpsertArgs<ExtArgs>>): Prisma__SiteSettingsClient<$Result.GetResult<Prisma.$SiteSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsCountArgs} args - Arguments to filter SiteSettings to count.
     * @example
     * // Count the number of SiteSettings
     * const count = await prisma.siteSettings.count({
     *   where: {
     *     // ... the filter for the SiteSettings we want to count
     *   }
     * })
    **/
    count<T extends SiteSettingsCountArgs>(
      args?: Subset<T, SiteSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SiteSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SiteSettingsAggregateArgs>(args: Subset<T, SiteSettingsAggregateArgs>): Prisma.PrismaPromise<GetSiteSettingsAggregateType<T>>

    /**
     * Group by SiteSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SiteSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SiteSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SiteSettingsGroupByArgs['orderBy'] }
        : { orderBy?: SiteSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SiteSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSiteSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SiteSettings model
   */
  readonly fields: SiteSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SiteSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SiteSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SiteSettings model
   */
  interface SiteSettingsFieldRefs {
    readonly id: FieldRef<"SiteSettings", 'String'>
    readonly kickUrl: FieldRef<"SiteSettings", 'String'>
    readonly discordUrl: FieldRef<"SiteSettings", 'String'>
    readonly youtubeUrl: FieldRef<"SiteSettings", 'String'>
    readonly createdAt: FieldRef<"SiteSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"SiteSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SiteSettings findUnique
   */
  export type SiteSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings findUniqueOrThrow
   */
  export type SiteSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings findFirst
   */
  export type SiteSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteSettings.
     */
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings findFirstOrThrow
   */
  export type SiteSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteSettings.
     */
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings findMany
   */
  export type SiteSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter, which SiteSettings to fetch.
     */
    where?: SiteSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SiteSettings to fetch.
     */
    orderBy?: SiteSettingsOrderByWithRelationInput | SiteSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SiteSettings.
     */
    cursor?: SiteSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SiteSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SiteSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SiteSettings.
     */
    distinct?: SiteSettingsScalarFieldEnum | SiteSettingsScalarFieldEnum[]
  }

  /**
   * SiteSettings create
   */
  export type SiteSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data needed to create a SiteSettings.
     */
    data: XOR<SiteSettingsCreateInput, SiteSettingsUncheckedCreateInput>
  }

  /**
   * SiteSettings createMany
   */
  export type SiteSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SiteSettings.
     */
    data: SiteSettingsCreateManyInput | SiteSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SiteSettings createManyAndReturn
   */
  export type SiteSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many SiteSettings.
     */
    data: SiteSettingsCreateManyInput | SiteSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SiteSettings update
   */
  export type SiteSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data needed to update a SiteSettings.
     */
    data: XOR<SiteSettingsUpdateInput, SiteSettingsUncheckedUpdateInput>
    /**
     * Choose, which SiteSettings to update.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings updateMany
   */
  export type SiteSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SiteSettings.
     */
    data: XOR<SiteSettingsUpdateManyMutationInput, SiteSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SiteSettings to update
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to update.
     */
    limit?: number
  }

  /**
   * SiteSettings updateManyAndReturn
   */
  export type SiteSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The data used to update SiteSettings.
     */
    data: XOR<SiteSettingsUpdateManyMutationInput, SiteSettingsUncheckedUpdateManyInput>
    /**
     * Filter which SiteSettings to update
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to update.
     */
    limit?: number
  }

  /**
   * SiteSettings upsert
   */
  export type SiteSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * The filter to search for the SiteSettings to update in case it exists.
     */
    where: SiteSettingsWhereUniqueInput
    /**
     * In case the SiteSettings found by the `where` argument doesn't exist, create a new SiteSettings with this data.
     */
    create: XOR<SiteSettingsCreateInput, SiteSettingsUncheckedCreateInput>
    /**
     * In case the SiteSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SiteSettingsUpdateInput, SiteSettingsUncheckedUpdateInput>
  }

  /**
   * SiteSettings delete
   */
  export type SiteSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
    /**
     * Filter which SiteSettings to delete.
     */
    where: SiteSettingsWhereUniqueInput
  }

  /**
   * SiteSettings deleteMany
   */
  export type SiteSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SiteSettings to delete
     */
    where?: SiteSettingsWhereInput
    /**
     * Limit how many SiteSettings to delete.
     */
    limit?: number
  }

  /**
   * SiteSettings without action
   */
  export type SiteSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SiteSettings
     */
    select?: SiteSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SiteSettings
     */
    omit?: SiteSettingsOmit<ExtArgs> | null
  }


  /**
   * Model LeaderboardSettings
   */

  export type AggregateLeaderboardSettings = {
    _count: LeaderboardSettingsCountAggregateOutputType | null
    _min: LeaderboardSettingsMinAggregateOutputType | null
    _max: LeaderboardSettingsMaxAggregateOutputType | null
  }

  export type LeaderboardSettingsMinAggregateOutputType = {
    id: string | null
    title: string | null
    subtitle: string | null
    countdownTarget: Date | null
    startDate: Date | null
    endDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeaderboardSettingsMaxAggregateOutputType = {
    id: string | null
    title: string | null
    subtitle: string | null
    countdownTarget: Date | null
    startDate: Date | null
    endDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LeaderboardSettingsCountAggregateOutputType = {
    id: number
    title: number
    subtitle: number
    countdownTarget: number
    startDate: number
    endDate: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LeaderboardSettingsMinAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    countdownTarget?: true
    startDate?: true
    endDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeaderboardSettingsMaxAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    countdownTarget?: true
    startDate?: true
    endDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LeaderboardSettingsCountAggregateInputType = {
    id?: true
    title?: true
    subtitle?: true
    countdownTarget?: true
    startDate?: true
    endDate?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LeaderboardSettingsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaderboardSettings to aggregate.
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardSettings to fetch.
     */
    orderBy?: LeaderboardSettingsOrderByWithRelationInput | LeaderboardSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeaderboardSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeaderboardSettings
    **/
    _count?: true | LeaderboardSettingsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeaderboardSettingsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeaderboardSettingsMaxAggregateInputType
  }

  export type GetLeaderboardSettingsAggregateType<T extends LeaderboardSettingsAggregateArgs> = {
        [P in keyof T & keyof AggregateLeaderboardSettings]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeaderboardSettings[P]>
      : GetScalarType<T[P], AggregateLeaderboardSettings[P]>
  }




  export type LeaderboardSettingsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaderboardSettingsWhereInput
    orderBy?: LeaderboardSettingsOrderByWithAggregationInput | LeaderboardSettingsOrderByWithAggregationInput[]
    by: LeaderboardSettingsScalarFieldEnum[] | LeaderboardSettingsScalarFieldEnum
    having?: LeaderboardSettingsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeaderboardSettingsCountAggregateInputType | true
    _min?: LeaderboardSettingsMinAggregateInputType
    _max?: LeaderboardSettingsMaxAggregateInputType
  }

  export type LeaderboardSettingsGroupByOutputType = {
    id: string
    title: string
    subtitle: string
    countdownTarget: Date
    startDate: Date | null
    endDate: Date | null
    createdAt: Date
    updatedAt: Date
    _count: LeaderboardSettingsCountAggregateOutputType | null
    _min: LeaderboardSettingsMinAggregateOutputType | null
    _max: LeaderboardSettingsMaxAggregateOutputType | null
  }

  type GetLeaderboardSettingsGroupByPayload<T extends LeaderboardSettingsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeaderboardSettingsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeaderboardSettingsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeaderboardSettingsGroupByOutputType[P]>
            : GetScalarType<T[P], LeaderboardSettingsGroupByOutputType[P]>
        }
      >
    >


  export type LeaderboardSettingsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtitle?: boolean
    countdownTarget?: boolean
    startDate?: boolean
    endDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    prizeTiers?: boolean | LeaderboardSettings$prizeTiersArgs<ExtArgs>
    _count?: boolean | LeaderboardSettingsCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboardSettings"]>

  export type LeaderboardSettingsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtitle?: boolean
    countdownTarget?: boolean
    startDate?: boolean
    endDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["leaderboardSettings"]>

  export type LeaderboardSettingsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    subtitle?: boolean
    countdownTarget?: boolean
    startDate?: boolean
    endDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["leaderboardSettings"]>

  export type LeaderboardSettingsSelectScalar = {
    id?: boolean
    title?: boolean
    subtitle?: boolean
    countdownTarget?: boolean
    startDate?: boolean
    endDate?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LeaderboardSettingsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "subtitle" | "countdownTarget" | "startDate" | "endDate" | "createdAt" | "updatedAt", ExtArgs["result"]["leaderboardSettings"]>
  export type LeaderboardSettingsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    prizeTiers?: boolean | LeaderboardSettings$prizeTiersArgs<ExtArgs>
    _count?: boolean | LeaderboardSettingsCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LeaderboardSettingsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LeaderboardSettingsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LeaderboardSettingsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeaderboardSettings"
    objects: {
      prizeTiers: Prisma.$LeaderboardPrizeTierPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      subtitle: string
      countdownTarget: Date
      startDate: Date | null
      endDate: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["leaderboardSettings"]>
    composites: {}
  }

  type LeaderboardSettingsGetPayload<S extends boolean | null | undefined | LeaderboardSettingsDefaultArgs> = $Result.GetResult<Prisma.$LeaderboardSettingsPayload, S>

  type LeaderboardSettingsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeaderboardSettingsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeaderboardSettingsCountAggregateInputType | true
    }

  export interface LeaderboardSettingsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeaderboardSettings'], meta: { name: 'LeaderboardSettings' } }
    /**
     * Find zero or one LeaderboardSettings that matches the filter.
     * @param {LeaderboardSettingsFindUniqueArgs} args - Arguments to find a LeaderboardSettings
     * @example
     * // Get one LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaderboardSettingsFindUniqueArgs>(args: SelectSubset<T, LeaderboardSettingsFindUniqueArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LeaderboardSettings that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeaderboardSettingsFindUniqueOrThrowArgs} args - Arguments to find a LeaderboardSettings
     * @example
     * // Get one LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaderboardSettingsFindUniqueOrThrowArgs>(args: SelectSubset<T, LeaderboardSettingsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeaderboardSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsFindFirstArgs} args - Arguments to find a LeaderboardSettings
     * @example
     * // Get one LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaderboardSettingsFindFirstArgs>(args?: SelectSubset<T, LeaderboardSettingsFindFirstArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeaderboardSettings that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsFindFirstOrThrowArgs} args - Arguments to find a LeaderboardSettings
     * @example
     * // Get one LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaderboardSettingsFindFirstOrThrowArgs>(args?: SelectSubset<T, LeaderboardSettingsFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LeaderboardSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findMany()
     * 
     * // Get first 10 LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leaderboardSettingsWithIdOnly = await prisma.leaderboardSettings.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeaderboardSettingsFindManyArgs>(args?: SelectSubset<T, LeaderboardSettingsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LeaderboardSettings.
     * @param {LeaderboardSettingsCreateArgs} args - Arguments to create a LeaderboardSettings.
     * @example
     * // Create one LeaderboardSettings
     * const LeaderboardSettings = await prisma.leaderboardSettings.create({
     *   data: {
     *     // ... data to create a LeaderboardSettings
     *   }
     * })
     * 
     */
    create<T extends LeaderboardSettingsCreateArgs>(args: SelectSubset<T, LeaderboardSettingsCreateArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LeaderboardSettings.
     * @param {LeaderboardSettingsCreateManyArgs} args - Arguments to create many LeaderboardSettings.
     * @example
     * // Create many LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeaderboardSettingsCreateManyArgs>(args?: SelectSubset<T, LeaderboardSettingsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeaderboardSettings and returns the data saved in the database.
     * @param {LeaderboardSettingsCreateManyAndReturnArgs} args - Arguments to create many LeaderboardSettings.
     * @example
     * // Create many LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeaderboardSettings and only return the `id`
     * const leaderboardSettingsWithIdOnly = await prisma.leaderboardSettings.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeaderboardSettingsCreateManyAndReturnArgs>(args?: SelectSubset<T, LeaderboardSettingsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LeaderboardSettings.
     * @param {LeaderboardSettingsDeleteArgs} args - Arguments to delete one LeaderboardSettings.
     * @example
     * // Delete one LeaderboardSettings
     * const LeaderboardSettings = await prisma.leaderboardSettings.delete({
     *   where: {
     *     // ... filter to delete one LeaderboardSettings
     *   }
     * })
     * 
     */
    delete<T extends LeaderboardSettingsDeleteArgs>(args: SelectSubset<T, LeaderboardSettingsDeleteArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LeaderboardSettings.
     * @param {LeaderboardSettingsUpdateArgs} args - Arguments to update one LeaderboardSettings.
     * @example
     * // Update one LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeaderboardSettingsUpdateArgs>(args: SelectSubset<T, LeaderboardSettingsUpdateArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LeaderboardSettings.
     * @param {LeaderboardSettingsDeleteManyArgs} args - Arguments to filter LeaderboardSettings to delete.
     * @example
     * // Delete a few LeaderboardSettings
     * const { count } = await prisma.leaderboardSettings.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeaderboardSettingsDeleteManyArgs>(args?: SelectSubset<T, LeaderboardSettingsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeaderboardSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeaderboardSettingsUpdateManyArgs>(args: SelectSubset<T, LeaderboardSettingsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeaderboardSettings and returns the data updated in the database.
     * @param {LeaderboardSettingsUpdateManyAndReturnArgs} args - Arguments to update many LeaderboardSettings.
     * @example
     * // Update many LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LeaderboardSettings and only return the `id`
     * const leaderboardSettingsWithIdOnly = await prisma.leaderboardSettings.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeaderboardSettingsUpdateManyAndReturnArgs>(args: SelectSubset<T, LeaderboardSettingsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LeaderboardSettings.
     * @param {LeaderboardSettingsUpsertArgs} args - Arguments to update or create a LeaderboardSettings.
     * @example
     * // Update or create a LeaderboardSettings
     * const leaderboardSettings = await prisma.leaderboardSettings.upsert({
     *   create: {
     *     // ... data to create a LeaderboardSettings
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeaderboardSettings we want to update
     *   }
     * })
     */
    upsert<T extends LeaderboardSettingsUpsertArgs>(args: SelectSubset<T, LeaderboardSettingsUpsertArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LeaderboardSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsCountArgs} args - Arguments to filter LeaderboardSettings to count.
     * @example
     * // Count the number of LeaderboardSettings
     * const count = await prisma.leaderboardSettings.count({
     *   where: {
     *     // ... the filter for the LeaderboardSettings we want to count
     *   }
     * })
    **/
    count<T extends LeaderboardSettingsCountArgs>(
      args?: Subset<T, LeaderboardSettingsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeaderboardSettingsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeaderboardSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeaderboardSettingsAggregateArgs>(args: Subset<T, LeaderboardSettingsAggregateArgs>): Prisma.PrismaPromise<GetLeaderboardSettingsAggregateType<T>>

    /**
     * Group by LeaderboardSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardSettingsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeaderboardSettingsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeaderboardSettingsGroupByArgs['orderBy'] }
        : { orderBy?: LeaderboardSettingsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeaderboardSettingsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaderboardSettingsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeaderboardSettings model
   */
  readonly fields: LeaderboardSettingsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeaderboardSettings.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeaderboardSettingsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    prizeTiers<T extends LeaderboardSettings$prizeTiersArgs<ExtArgs> = {}>(args?: Subset<T, LeaderboardSettings$prizeTiersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeaderboardSettings model
   */
  interface LeaderboardSettingsFieldRefs {
    readonly id: FieldRef<"LeaderboardSettings", 'String'>
    readonly title: FieldRef<"LeaderboardSettings", 'String'>
    readonly subtitle: FieldRef<"LeaderboardSettings", 'String'>
    readonly countdownTarget: FieldRef<"LeaderboardSettings", 'DateTime'>
    readonly startDate: FieldRef<"LeaderboardSettings", 'DateTime'>
    readonly endDate: FieldRef<"LeaderboardSettings", 'DateTime'>
    readonly createdAt: FieldRef<"LeaderboardSettings", 'DateTime'>
    readonly updatedAt: FieldRef<"LeaderboardSettings", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LeaderboardSettings findUnique
   */
  export type LeaderboardSettingsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardSettings to fetch.
     */
    where: LeaderboardSettingsWhereUniqueInput
  }

  /**
   * LeaderboardSettings findUniqueOrThrow
   */
  export type LeaderboardSettingsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardSettings to fetch.
     */
    where: LeaderboardSettingsWhereUniqueInput
  }

  /**
   * LeaderboardSettings findFirst
   */
  export type LeaderboardSettingsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardSettings to fetch.
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardSettings to fetch.
     */
    orderBy?: LeaderboardSettingsOrderByWithRelationInput | LeaderboardSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaderboardSettings.
     */
    cursor?: LeaderboardSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardSettings.
     */
    distinct?: LeaderboardSettingsScalarFieldEnum | LeaderboardSettingsScalarFieldEnum[]
  }

  /**
   * LeaderboardSettings findFirstOrThrow
   */
  export type LeaderboardSettingsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardSettings to fetch.
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardSettings to fetch.
     */
    orderBy?: LeaderboardSettingsOrderByWithRelationInput | LeaderboardSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaderboardSettings.
     */
    cursor?: LeaderboardSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardSettings.
     */
    distinct?: LeaderboardSettingsScalarFieldEnum | LeaderboardSettingsScalarFieldEnum[]
  }

  /**
   * LeaderboardSettings findMany
   */
  export type LeaderboardSettingsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardSettings to fetch.
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardSettings to fetch.
     */
    orderBy?: LeaderboardSettingsOrderByWithRelationInput | LeaderboardSettingsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeaderboardSettings.
     */
    cursor?: LeaderboardSettingsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardSettings.
     */
    distinct?: LeaderboardSettingsScalarFieldEnum | LeaderboardSettingsScalarFieldEnum[]
  }

  /**
   * LeaderboardSettings create
   */
  export type LeaderboardSettingsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * The data needed to create a LeaderboardSettings.
     */
    data: XOR<LeaderboardSettingsCreateInput, LeaderboardSettingsUncheckedCreateInput>
  }

  /**
   * LeaderboardSettings createMany
   */
  export type LeaderboardSettingsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeaderboardSettings.
     */
    data: LeaderboardSettingsCreateManyInput | LeaderboardSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeaderboardSettings createManyAndReturn
   */
  export type LeaderboardSettingsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * The data used to create many LeaderboardSettings.
     */
    data: LeaderboardSettingsCreateManyInput | LeaderboardSettingsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeaderboardSettings update
   */
  export type LeaderboardSettingsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * The data needed to update a LeaderboardSettings.
     */
    data: XOR<LeaderboardSettingsUpdateInput, LeaderboardSettingsUncheckedUpdateInput>
    /**
     * Choose, which LeaderboardSettings to update.
     */
    where: LeaderboardSettingsWhereUniqueInput
  }

  /**
   * LeaderboardSettings updateMany
   */
  export type LeaderboardSettingsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeaderboardSettings.
     */
    data: XOR<LeaderboardSettingsUpdateManyMutationInput, LeaderboardSettingsUncheckedUpdateManyInput>
    /**
     * Filter which LeaderboardSettings to update
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * Limit how many LeaderboardSettings to update.
     */
    limit?: number
  }

  /**
   * LeaderboardSettings updateManyAndReturn
   */
  export type LeaderboardSettingsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * The data used to update LeaderboardSettings.
     */
    data: XOR<LeaderboardSettingsUpdateManyMutationInput, LeaderboardSettingsUncheckedUpdateManyInput>
    /**
     * Filter which LeaderboardSettings to update
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * Limit how many LeaderboardSettings to update.
     */
    limit?: number
  }

  /**
   * LeaderboardSettings upsert
   */
  export type LeaderboardSettingsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * The filter to search for the LeaderboardSettings to update in case it exists.
     */
    where: LeaderboardSettingsWhereUniqueInput
    /**
     * In case the LeaderboardSettings found by the `where` argument doesn't exist, create a new LeaderboardSettings with this data.
     */
    create: XOR<LeaderboardSettingsCreateInput, LeaderboardSettingsUncheckedCreateInput>
    /**
     * In case the LeaderboardSettings was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeaderboardSettingsUpdateInput, LeaderboardSettingsUncheckedUpdateInput>
  }

  /**
   * LeaderboardSettings delete
   */
  export type LeaderboardSettingsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
    /**
     * Filter which LeaderboardSettings to delete.
     */
    where: LeaderboardSettingsWhereUniqueInput
  }

  /**
   * LeaderboardSettings deleteMany
   */
  export type LeaderboardSettingsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaderboardSettings to delete
     */
    where?: LeaderboardSettingsWhereInput
    /**
     * Limit how many LeaderboardSettings to delete.
     */
    limit?: number
  }

  /**
   * LeaderboardSettings.prizeTiers
   */
  export type LeaderboardSettings$prizeTiersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    where?: LeaderboardPrizeTierWhereInput
    orderBy?: LeaderboardPrizeTierOrderByWithRelationInput | LeaderboardPrizeTierOrderByWithRelationInput[]
    cursor?: LeaderboardPrizeTierWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LeaderboardPrizeTierScalarFieldEnum | LeaderboardPrizeTierScalarFieldEnum[]
  }

  /**
   * LeaderboardSettings without action
   */
  export type LeaderboardSettingsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardSettings
     */
    select?: LeaderboardSettingsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardSettings
     */
    omit?: LeaderboardSettingsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardSettingsInclude<ExtArgs> | null
  }


  /**
   * Model LeaderboardPrizeTier
   */

  export type AggregateLeaderboardPrizeTier = {
    _count: LeaderboardPrizeTierCountAggregateOutputType | null
    _avg: LeaderboardPrizeTierAvgAggregateOutputType | null
    _sum: LeaderboardPrizeTierSumAggregateOutputType | null
    _min: LeaderboardPrizeTierMinAggregateOutputType | null
    _max: LeaderboardPrizeTierMaxAggregateOutputType | null
  }

  export type LeaderboardPrizeTierAvgAggregateOutputType = {
    place: number | null
    prize: number | null
  }

  export type LeaderboardPrizeTierSumAggregateOutputType = {
    place: number | null
    prize: number | null
  }

  export type LeaderboardPrizeTierMinAggregateOutputType = {
    id: string | null
    leaderboardId: string | null
    place: number | null
    prize: number | null
  }

  export type LeaderboardPrizeTierMaxAggregateOutputType = {
    id: string | null
    leaderboardId: string | null
    place: number | null
    prize: number | null
  }

  export type LeaderboardPrizeTierCountAggregateOutputType = {
    id: number
    leaderboardId: number
    place: number
    prize: number
    _all: number
  }


  export type LeaderboardPrizeTierAvgAggregateInputType = {
    place?: true
    prize?: true
  }

  export type LeaderboardPrizeTierSumAggregateInputType = {
    place?: true
    prize?: true
  }

  export type LeaderboardPrizeTierMinAggregateInputType = {
    id?: true
    leaderboardId?: true
    place?: true
    prize?: true
  }

  export type LeaderboardPrizeTierMaxAggregateInputType = {
    id?: true
    leaderboardId?: true
    place?: true
    prize?: true
  }

  export type LeaderboardPrizeTierCountAggregateInputType = {
    id?: true
    leaderboardId?: true
    place?: true
    prize?: true
    _all?: true
  }

  export type LeaderboardPrizeTierAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaderboardPrizeTier to aggregate.
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardPrizeTiers to fetch.
     */
    orderBy?: LeaderboardPrizeTierOrderByWithRelationInput | LeaderboardPrizeTierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LeaderboardPrizeTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardPrizeTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardPrizeTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LeaderboardPrizeTiers
    **/
    _count?: true | LeaderboardPrizeTierCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LeaderboardPrizeTierAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LeaderboardPrizeTierSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LeaderboardPrizeTierMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LeaderboardPrizeTierMaxAggregateInputType
  }

  export type GetLeaderboardPrizeTierAggregateType<T extends LeaderboardPrizeTierAggregateArgs> = {
        [P in keyof T & keyof AggregateLeaderboardPrizeTier]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLeaderboardPrizeTier[P]>
      : GetScalarType<T[P], AggregateLeaderboardPrizeTier[P]>
  }




  export type LeaderboardPrizeTierGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LeaderboardPrizeTierWhereInput
    orderBy?: LeaderboardPrizeTierOrderByWithAggregationInput | LeaderboardPrizeTierOrderByWithAggregationInput[]
    by: LeaderboardPrizeTierScalarFieldEnum[] | LeaderboardPrizeTierScalarFieldEnum
    having?: LeaderboardPrizeTierScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LeaderboardPrizeTierCountAggregateInputType | true
    _avg?: LeaderboardPrizeTierAvgAggregateInputType
    _sum?: LeaderboardPrizeTierSumAggregateInputType
    _min?: LeaderboardPrizeTierMinAggregateInputType
    _max?: LeaderboardPrizeTierMaxAggregateInputType
  }

  export type LeaderboardPrizeTierGroupByOutputType = {
    id: string
    leaderboardId: string
    place: number
    prize: number
    _count: LeaderboardPrizeTierCountAggregateOutputType | null
    _avg: LeaderboardPrizeTierAvgAggregateOutputType | null
    _sum: LeaderboardPrizeTierSumAggregateOutputType | null
    _min: LeaderboardPrizeTierMinAggregateOutputType | null
    _max: LeaderboardPrizeTierMaxAggregateOutputType | null
  }

  type GetLeaderboardPrizeTierGroupByPayload<T extends LeaderboardPrizeTierGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LeaderboardPrizeTierGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LeaderboardPrizeTierGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LeaderboardPrizeTierGroupByOutputType[P]>
            : GetScalarType<T[P], LeaderboardPrizeTierGroupByOutputType[P]>
        }
      >
    >


  export type LeaderboardPrizeTierSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leaderboardId?: boolean
    place?: boolean
    prize?: boolean
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboardPrizeTier"]>

  export type LeaderboardPrizeTierSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leaderboardId?: boolean
    place?: boolean
    prize?: boolean
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboardPrizeTier"]>

  export type LeaderboardPrizeTierSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    leaderboardId?: boolean
    place?: boolean
    prize?: boolean
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["leaderboardPrizeTier"]>

  export type LeaderboardPrizeTierSelectScalar = {
    id?: boolean
    leaderboardId?: boolean
    place?: boolean
    prize?: boolean
  }

  export type LeaderboardPrizeTierOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "leaderboardId" | "place" | "prize", ExtArgs["result"]["leaderboardPrizeTier"]>
  export type LeaderboardPrizeTierInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }
  export type LeaderboardPrizeTierIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }
  export type LeaderboardPrizeTierIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    leaderboard?: boolean | LeaderboardSettingsDefaultArgs<ExtArgs>
  }

  export type $LeaderboardPrizeTierPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LeaderboardPrizeTier"
    objects: {
      leaderboard: Prisma.$LeaderboardSettingsPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      leaderboardId: string
      place: number
      prize: number
    }, ExtArgs["result"]["leaderboardPrizeTier"]>
    composites: {}
  }

  type LeaderboardPrizeTierGetPayload<S extends boolean | null | undefined | LeaderboardPrizeTierDefaultArgs> = $Result.GetResult<Prisma.$LeaderboardPrizeTierPayload, S>

  type LeaderboardPrizeTierCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LeaderboardPrizeTierFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LeaderboardPrizeTierCountAggregateInputType | true
    }

  export interface LeaderboardPrizeTierDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LeaderboardPrizeTier'], meta: { name: 'LeaderboardPrizeTier' } }
    /**
     * Find zero or one LeaderboardPrizeTier that matches the filter.
     * @param {LeaderboardPrizeTierFindUniqueArgs} args - Arguments to find a LeaderboardPrizeTier
     * @example
     * // Get one LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LeaderboardPrizeTierFindUniqueArgs>(args: SelectSubset<T, LeaderboardPrizeTierFindUniqueArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LeaderboardPrizeTier that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LeaderboardPrizeTierFindUniqueOrThrowArgs} args - Arguments to find a LeaderboardPrizeTier
     * @example
     * // Get one LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LeaderboardPrizeTierFindUniqueOrThrowArgs>(args: SelectSubset<T, LeaderboardPrizeTierFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeaderboardPrizeTier that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierFindFirstArgs} args - Arguments to find a LeaderboardPrizeTier
     * @example
     * // Get one LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LeaderboardPrizeTierFindFirstArgs>(args?: SelectSubset<T, LeaderboardPrizeTierFindFirstArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LeaderboardPrizeTier that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierFindFirstOrThrowArgs} args - Arguments to find a LeaderboardPrizeTier
     * @example
     * // Get one LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LeaderboardPrizeTierFindFirstOrThrowArgs>(args?: SelectSubset<T, LeaderboardPrizeTierFindFirstOrThrowArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LeaderboardPrizeTiers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LeaderboardPrizeTiers
     * const leaderboardPrizeTiers = await prisma.leaderboardPrizeTier.findMany()
     * 
     * // Get first 10 LeaderboardPrizeTiers
     * const leaderboardPrizeTiers = await prisma.leaderboardPrizeTier.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const leaderboardPrizeTierWithIdOnly = await prisma.leaderboardPrizeTier.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LeaderboardPrizeTierFindManyArgs>(args?: SelectSubset<T, LeaderboardPrizeTierFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LeaderboardPrizeTier.
     * @param {LeaderboardPrizeTierCreateArgs} args - Arguments to create a LeaderboardPrizeTier.
     * @example
     * // Create one LeaderboardPrizeTier
     * const LeaderboardPrizeTier = await prisma.leaderboardPrizeTier.create({
     *   data: {
     *     // ... data to create a LeaderboardPrizeTier
     *   }
     * })
     * 
     */
    create<T extends LeaderboardPrizeTierCreateArgs>(args: SelectSubset<T, LeaderboardPrizeTierCreateArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LeaderboardPrizeTiers.
     * @param {LeaderboardPrizeTierCreateManyArgs} args - Arguments to create many LeaderboardPrizeTiers.
     * @example
     * // Create many LeaderboardPrizeTiers
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LeaderboardPrizeTierCreateManyArgs>(args?: SelectSubset<T, LeaderboardPrizeTierCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LeaderboardPrizeTiers and returns the data saved in the database.
     * @param {LeaderboardPrizeTierCreateManyAndReturnArgs} args - Arguments to create many LeaderboardPrizeTiers.
     * @example
     * // Create many LeaderboardPrizeTiers
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LeaderboardPrizeTiers and only return the `id`
     * const leaderboardPrizeTierWithIdOnly = await prisma.leaderboardPrizeTier.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LeaderboardPrizeTierCreateManyAndReturnArgs>(args?: SelectSubset<T, LeaderboardPrizeTierCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LeaderboardPrizeTier.
     * @param {LeaderboardPrizeTierDeleteArgs} args - Arguments to delete one LeaderboardPrizeTier.
     * @example
     * // Delete one LeaderboardPrizeTier
     * const LeaderboardPrizeTier = await prisma.leaderboardPrizeTier.delete({
     *   where: {
     *     // ... filter to delete one LeaderboardPrizeTier
     *   }
     * })
     * 
     */
    delete<T extends LeaderboardPrizeTierDeleteArgs>(args: SelectSubset<T, LeaderboardPrizeTierDeleteArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LeaderboardPrizeTier.
     * @param {LeaderboardPrizeTierUpdateArgs} args - Arguments to update one LeaderboardPrizeTier.
     * @example
     * // Update one LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LeaderboardPrizeTierUpdateArgs>(args: SelectSubset<T, LeaderboardPrizeTierUpdateArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LeaderboardPrizeTiers.
     * @param {LeaderboardPrizeTierDeleteManyArgs} args - Arguments to filter LeaderboardPrizeTiers to delete.
     * @example
     * // Delete a few LeaderboardPrizeTiers
     * const { count } = await prisma.leaderboardPrizeTier.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LeaderboardPrizeTierDeleteManyArgs>(args?: SelectSubset<T, LeaderboardPrizeTierDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeaderboardPrizeTiers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LeaderboardPrizeTiers
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LeaderboardPrizeTierUpdateManyArgs>(args: SelectSubset<T, LeaderboardPrizeTierUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LeaderboardPrizeTiers and returns the data updated in the database.
     * @param {LeaderboardPrizeTierUpdateManyAndReturnArgs} args - Arguments to update many LeaderboardPrizeTiers.
     * @example
     * // Update many LeaderboardPrizeTiers
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LeaderboardPrizeTiers and only return the `id`
     * const leaderboardPrizeTierWithIdOnly = await prisma.leaderboardPrizeTier.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LeaderboardPrizeTierUpdateManyAndReturnArgs>(args: SelectSubset<T, LeaderboardPrizeTierUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LeaderboardPrizeTier.
     * @param {LeaderboardPrizeTierUpsertArgs} args - Arguments to update or create a LeaderboardPrizeTier.
     * @example
     * // Update or create a LeaderboardPrizeTier
     * const leaderboardPrizeTier = await prisma.leaderboardPrizeTier.upsert({
     *   create: {
     *     // ... data to create a LeaderboardPrizeTier
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LeaderboardPrizeTier we want to update
     *   }
     * })
     */
    upsert<T extends LeaderboardPrizeTierUpsertArgs>(args: SelectSubset<T, LeaderboardPrizeTierUpsertArgs<ExtArgs>>): Prisma__LeaderboardPrizeTierClient<$Result.GetResult<Prisma.$LeaderboardPrizeTierPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LeaderboardPrizeTiers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierCountArgs} args - Arguments to filter LeaderboardPrizeTiers to count.
     * @example
     * // Count the number of LeaderboardPrizeTiers
     * const count = await prisma.leaderboardPrizeTier.count({
     *   where: {
     *     // ... the filter for the LeaderboardPrizeTiers we want to count
     *   }
     * })
    **/
    count<T extends LeaderboardPrizeTierCountArgs>(
      args?: Subset<T, LeaderboardPrizeTierCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LeaderboardPrizeTierCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LeaderboardPrizeTier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LeaderboardPrizeTierAggregateArgs>(args: Subset<T, LeaderboardPrizeTierAggregateArgs>): Prisma.PrismaPromise<GetLeaderboardPrizeTierAggregateType<T>>

    /**
     * Group by LeaderboardPrizeTier.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LeaderboardPrizeTierGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LeaderboardPrizeTierGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LeaderboardPrizeTierGroupByArgs['orderBy'] }
        : { orderBy?: LeaderboardPrizeTierGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LeaderboardPrizeTierGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLeaderboardPrizeTierGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LeaderboardPrizeTier model
   */
  readonly fields: LeaderboardPrizeTierFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LeaderboardPrizeTier.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LeaderboardPrizeTierClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    leaderboard<T extends LeaderboardSettingsDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LeaderboardSettingsDefaultArgs<ExtArgs>>): Prisma__LeaderboardSettingsClient<$Result.GetResult<Prisma.$LeaderboardSettingsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LeaderboardPrizeTier model
   */
  interface LeaderboardPrizeTierFieldRefs {
    readonly id: FieldRef<"LeaderboardPrizeTier", 'String'>
    readonly leaderboardId: FieldRef<"LeaderboardPrizeTier", 'String'>
    readonly place: FieldRef<"LeaderboardPrizeTier", 'Int'>
    readonly prize: FieldRef<"LeaderboardPrizeTier", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * LeaderboardPrizeTier findUnique
   */
  export type LeaderboardPrizeTierFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardPrizeTier to fetch.
     */
    where: LeaderboardPrizeTierWhereUniqueInput
  }

  /**
   * LeaderboardPrizeTier findUniqueOrThrow
   */
  export type LeaderboardPrizeTierFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardPrizeTier to fetch.
     */
    where: LeaderboardPrizeTierWhereUniqueInput
  }

  /**
   * LeaderboardPrizeTier findFirst
   */
  export type LeaderboardPrizeTierFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardPrizeTier to fetch.
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardPrizeTiers to fetch.
     */
    orderBy?: LeaderboardPrizeTierOrderByWithRelationInput | LeaderboardPrizeTierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaderboardPrizeTiers.
     */
    cursor?: LeaderboardPrizeTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardPrizeTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardPrizeTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardPrizeTiers.
     */
    distinct?: LeaderboardPrizeTierScalarFieldEnum | LeaderboardPrizeTierScalarFieldEnum[]
  }

  /**
   * LeaderboardPrizeTier findFirstOrThrow
   */
  export type LeaderboardPrizeTierFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardPrizeTier to fetch.
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardPrizeTiers to fetch.
     */
    orderBy?: LeaderboardPrizeTierOrderByWithRelationInput | LeaderboardPrizeTierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LeaderboardPrizeTiers.
     */
    cursor?: LeaderboardPrizeTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardPrizeTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardPrizeTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardPrizeTiers.
     */
    distinct?: LeaderboardPrizeTierScalarFieldEnum | LeaderboardPrizeTierScalarFieldEnum[]
  }

  /**
   * LeaderboardPrizeTier findMany
   */
  export type LeaderboardPrizeTierFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter, which LeaderboardPrizeTiers to fetch.
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LeaderboardPrizeTiers to fetch.
     */
    orderBy?: LeaderboardPrizeTierOrderByWithRelationInput | LeaderboardPrizeTierOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LeaderboardPrizeTiers.
     */
    cursor?: LeaderboardPrizeTierWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LeaderboardPrizeTiers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LeaderboardPrizeTiers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LeaderboardPrizeTiers.
     */
    distinct?: LeaderboardPrizeTierScalarFieldEnum | LeaderboardPrizeTierScalarFieldEnum[]
  }

  /**
   * LeaderboardPrizeTier create
   */
  export type LeaderboardPrizeTierCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * The data needed to create a LeaderboardPrizeTier.
     */
    data: XOR<LeaderboardPrizeTierCreateInput, LeaderboardPrizeTierUncheckedCreateInput>
  }

  /**
   * LeaderboardPrizeTier createMany
   */
  export type LeaderboardPrizeTierCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LeaderboardPrizeTiers.
     */
    data: LeaderboardPrizeTierCreateManyInput | LeaderboardPrizeTierCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LeaderboardPrizeTier createManyAndReturn
   */
  export type LeaderboardPrizeTierCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * The data used to create many LeaderboardPrizeTiers.
     */
    data: LeaderboardPrizeTierCreateManyInput | LeaderboardPrizeTierCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeaderboardPrizeTier update
   */
  export type LeaderboardPrizeTierUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * The data needed to update a LeaderboardPrizeTier.
     */
    data: XOR<LeaderboardPrizeTierUpdateInput, LeaderboardPrizeTierUncheckedUpdateInput>
    /**
     * Choose, which LeaderboardPrizeTier to update.
     */
    where: LeaderboardPrizeTierWhereUniqueInput
  }

  /**
   * LeaderboardPrizeTier updateMany
   */
  export type LeaderboardPrizeTierUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LeaderboardPrizeTiers.
     */
    data: XOR<LeaderboardPrizeTierUpdateManyMutationInput, LeaderboardPrizeTierUncheckedUpdateManyInput>
    /**
     * Filter which LeaderboardPrizeTiers to update
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * Limit how many LeaderboardPrizeTiers to update.
     */
    limit?: number
  }

  /**
   * LeaderboardPrizeTier updateManyAndReturn
   */
  export type LeaderboardPrizeTierUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * The data used to update LeaderboardPrizeTiers.
     */
    data: XOR<LeaderboardPrizeTierUpdateManyMutationInput, LeaderboardPrizeTierUncheckedUpdateManyInput>
    /**
     * Filter which LeaderboardPrizeTiers to update
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * Limit how many LeaderboardPrizeTiers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LeaderboardPrizeTier upsert
   */
  export type LeaderboardPrizeTierUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * The filter to search for the LeaderboardPrizeTier to update in case it exists.
     */
    where: LeaderboardPrizeTierWhereUniqueInput
    /**
     * In case the LeaderboardPrizeTier found by the `where` argument doesn't exist, create a new LeaderboardPrizeTier with this data.
     */
    create: XOR<LeaderboardPrizeTierCreateInput, LeaderboardPrizeTierUncheckedCreateInput>
    /**
     * In case the LeaderboardPrizeTier was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LeaderboardPrizeTierUpdateInput, LeaderboardPrizeTierUncheckedUpdateInput>
  }

  /**
   * LeaderboardPrizeTier delete
   */
  export type LeaderboardPrizeTierDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
    /**
     * Filter which LeaderboardPrizeTier to delete.
     */
    where: LeaderboardPrizeTierWhereUniqueInput
  }

  /**
   * LeaderboardPrizeTier deleteMany
   */
  export type LeaderboardPrizeTierDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LeaderboardPrizeTiers to delete
     */
    where?: LeaderboardPrizeTierWhereInput
    /**
     * Limit how many LeaderboardPrizeTiers to delete.
     */
    limit?: number
  }

  /**
   * LeaderboardPrizeTier without action
   */
  export type LeaderboardPrizeTierDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LeaderboardPrizeTier
     */
    select?: LeaderboardPrizeTierSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LeaderboardPrizeTier
     */
    omit?: LeaderboardPrizeTierOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LeaderboardPrizeTierInclude<ExtArgs> | null
  }


  /**
   * Model Raffle
   */

  export type AggregateRaffle = {
    _count: RaffleCountAggregateOutputType | null
    _avg: RaffleAvgAggregateOutputType | null
    _sum: RaffleSumAggregateOutputType | null
    _min: RaffleMinAggregateOutputType | null
    _max: RaffleMaxAggregateOutputType | null
  }

  export type RaffleAvgAggregateOutputType = {
    totalEntries: number | null
  }

  export type RaffleSumAggregateOutputType = {
    totalEntries: number | null
  }

  export type RaffleMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    image: string | null
    status: string | null
    entryMethod: string | null
    totalEntries: number | null
    startDate: Date | null
    endDate: Date | null
    winner: string | null
    prizeDetails: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RaffleMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    image: string | null
    status: string | null
    entryMethod: string | null
    totalEntries: number | null
    startDate: Date | null
    endDate: Date | null
    winner: string | null
    prizeDetails: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type RaffleCountAggregateOutputType = {
    id: number
    title: number
    description: number
    image: number
    status: number
    entryMethod: number
    totalEntries: number
    startDate: number
    endDate: number
    winner: number
    prizeDetails: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type RaffleAvgAggregateInputType = {
    totalEntries?: true
  }

  export type RaffleSumAggregateInputType = {
    totalEntries?: true
  }

  export type RaffleMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    status?: true
    entryMethod?: true
    totalEntries?: true
    startDate?: true
    endDate?: true
    winner?: true
    prizeDetails?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RaffleMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    status?: true
    entryMethod?: true
    totalEntries?: true
    startDate?: true
    endDate?: true
    winner?: true
    prizeDetails?: true
    createdAt?: true
    updatedAt?: true
  }

  export type RaffleCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    image?: true
    status?: true
    entryMethod?: true
    totalEntries?: true
    startDate?: true
    endDate?: true
    winner?: true
    prizeDetails?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type RaffleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Raffle to aggregate.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Raffles
    **/
    _count?: true | RaffleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RaffleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RaffleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RaffleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RaffleMaxAggregateInputType
  }

  export type GetRaffleAggregateType<T extends RaffleAggregateArgs> = {
        [P in keyof T & keyof AggregateRaffle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRaffle[P]>
      : GetScalarType<T[P], AggregateRaffle[P]>
  }




  export type RaffleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RaffleWhereInput
    orderBy?: RaffleOrderByWithAggregationInput | RaffleOrderByWithAggregationInput[]
    by: RaffleScalarFieldEnum[] | RaffleScalarFieldEnum
    having?: RaffleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RaffleCountAggregateInputType | true
    _avg?: RaffleAvgAggregateInputType
    _sum?: RaffleSumAggregateInputType
    _min?: RaffleMinAggregateInputType
    _max?: RaffleMaxAggregateInputType
  }

  export type RaffleGroupByOutputType = {
    id: string
    title: string
    description: string | null
    image: string | null
    status: string
    entryMethod: string
    totalEntries: number
    startDate: Date
    endDate: Date
    winner: string | null
    prizeDetails: string
    createdAt: Date
    updatedAt: Date
    _count: RaffleCountAggregateOutputType | null
    _avg: RaffleAvgAggregateOutputType | null
    _sum: RaffleSumAggregateOutputType | null
    _min: RaffleMinAggregateOutputType | null
    _max: RaffleMaxAggregateOutputType | null
  }

  type GetRaffleGroupByPayload<T extends RaffleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RaffleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RaffleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RaffleGroupByOutputType[P]>
            : GetScalarType<T[P], RaffleGroupByOutputType[P]>
        }
      >
    >


  export type RaffleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    status?: boolean
    entryMethod?: boolean
    totalEntries?: boolean
    startDate?: boolean
    endDate?: boolean
    winner?: boolean
    prizeDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    status?: boolean
    entryMethod?: boolean
    totalEntries?: boolean
    startDate?: boolean
    endDate?: boolean
    winner?: boolean
    prizeDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    status?: boolean
    entryMethod?: boolean
    totalEntries?: boolean
    startDate?: boolean
    endDate?: boolean
    winner?: boolean
    prizeDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["raffle"]>

  export type RaffleSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    image?: boolean
    status?: boolean
    entryMethod?: boolean
    totalEntries?: boolean
    startDate?: boolean
    endDate?: boolean
    winner?: boolean
    prizeDetails?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type RaffleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "image" | "status" | "entryMethod" | "totalEntries" | "startDate" | "endDate" | "winner" | "prizeDetails" | "createdAt" | "updatedAt", ExtArgs["result"]["raffle"]>

  export type $RafflePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Raffle"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      image: string | null
      status: string
      entryMethod: string
      totalEntries: number
      startDate: Date
      endDate: Date
      winner: string | null
      prizeDetails: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["raffle"]>
    composites: {}
  }

  type RaffleGetPayload<S extends boolean | null | undefined | RaffleDefaultArgs> = $Result.GetResult<Prisma.$RafflePayload, S>

  type RaffleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RaffleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RaffleCountAggregateInputType | true
    }

  export interface RaffleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Raffle'], meta: { name: 'Raffle' } }
    /**
     * Find zero or one Raffle that matches the filter.
     * @param {RaffleFindUniqueArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RaffleFindUniqueArgs>(args: SelectSubset<T, RaffleFindUniqueArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Raffle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RaffleFindUniqueOrThrowArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RaffleFindUniqueOrThrowArgs>(args: SelectSubset<T, RaffleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Raffle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindFirstArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RaffleFindFirstArgs>(args?: SelectSubset<T, RaffleFindFirstArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Raffle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindFirstOrThrowArgs} args - Arguments to find a Raffle
     * @example
     * // Get one Raffle
     * const raffle = await prisma.raffle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RaffleFindFirstOrThrowArgs>(args?: SelectSubset<T, RaffleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Raffles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Raffles
     * const raffles = await prisma.raffle.findMany()
     * 
     * // Get first 10 Raffles
     * const raffles = await prisma.raffle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const raffleWithIdOnly = await prisma.raffle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RaffleFindManyArgs>(args?: SelectSubset<T, RaffleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Raffle.
     * @param {RaffleCreateArgs} args - Arguments to create a Raffle.
     * @example
     * // Create one Raffle
     * const Raffle = await prisma.raffle.create({
     *   data: {
     *     // ... data to create a Raffle
     *   }
     * })
     * 
     */
    create<T extends RaffleCreateArgs>(args: SelectSubset<T, RaffleCreateArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Raffles.
     * @param {RaffleCreateManyArgs} args - Arguments to create many Raffles.
     * @example
     * // Create many Raffles
     * const raffle = await prisma.raffle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RaffleCreateManyArgs>(args?: SelectSubset<T, RaffleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Raffles and returns the data saved in the database.
     * @param {RaffleCreateManyAndReturnArgs} args - Arguments to create many Raffles.
     * @example
     * // Create many Raffles
     * const raffle = await prisma.raffle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Raffles and only return the `id`
     * const raffleWithIdOnly = await prisma.raffle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RaffleCreateManyAndReturnArgs>(args?: SelectSubset<T, RaffleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Raffle.
     * @param {RaffleDeleteArgs} args - Arguments to delete one Raffle.
     * @example
     * // Delete one Raffle
     * const Raffle = await prisma.raffle.delete({
     *   where: {
     *     // ... filter to delete one Raffle
     *   }
     * })
     * 
     */
    delete<T extends RaffleDeleteArgs>(args: SelectSubset<T, RaffleDeleteArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Raffle.
     * @param {RaffleUpdateArgs} args - Arguments to update one Raffle.
     * @example
     * // Update one Raffle
     * const raffle = await prisma.raffle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RaffleUpdateArgs>(args: SelectSubset<T, RaffleUpdateArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Raffles.
     * @param {RaffleDeleteManyArgs} args - Arguments to filter Raffles to delete.
     * @example
     * // Delete a few Raffles
     * const { count } = await prisma.raffle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RaffleDeleteManyArgs>(args?: SelectSubset<T, RaffleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Raffles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Raffles
     * const raffle = await prisma.raffle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RaffleUpdateManyArgs>(args: SelectSubset<T, RaffleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Raffles and returns the data updated in the database.
     * @param {RaffleUpdateManyAndReturnArgs} args - Arguments to update many Raffles.
     * @example
     * // Update many Raffles
     * const raffle = await prisma.raffle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Raffles and only return the `id`
     * const raffleWithIdOnly = await prisma.raffle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RaffleUpdateManyAndReturnArgs>(args: SelectSubset<T, RaffleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Raffle.
     * @param {RaffleUpsertArgs} args - Arguments to update or create a Raffle.
     * @example
     * // Update or create a Raffle
     * const raffle = await prisma.raffle.upsert({
     *   create: {
     *     // ... data to create a Raffle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Raffle we want to update
     *   }
     * })
     */
    upsert<T extends RaffleUpsertArgs>(args: SelectSubset<T, RaffleUpsertArgs<ExtArgs>>): Prisma__RaffleClient<$Result.GetResult<Prisma.$RafflePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Raffles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleCountArgs} args - Arguments to filter Raffles to count.
     * @example
     * // Count the number of Raffles
     * const count = await prisma.raffle.count({
     *   where: {
     *     // ... the filter for the Raffles we want to count
     *   }
     * })
    **/
    count<T extends RaffleCountArgs>(
      args?: Subset<T, RaffleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RaffleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Raffle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RaffleAggregateArgs>(args: Subset<T, RaffleAggregateArgs>): Prisma.PrismaPromise<GetRaffleAggregateType<T>>

    /**
     * Group by Raffle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RaffleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RaffleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RaffleGroupByArgs['orderBy'] }
        : { orderBy?: RaffleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RaffleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRaffleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Raffle model
   */
  readonly fields: RaffleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Raffle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RaffleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Raffle model
   */
  interface RaffleFieldRefs {
    readonly id: FieldRef<"Raffle", 'String'>
    readonly title: FieldRef<"Raffle", 'String'>
    readonly description: FieldRef<"Raffle", 'String'>
    readonly image: FieldRef<"Raffle", 'String'>
    readonly status: FieldRef<"Raffle", 'String'>
    readonly entryMethod: FieldRef<"Raffle", 'String'>
    readonly totalEntries: FieldRef<"Raffle", 'Int'>
    readonly startDate: FieldRef<"Raffle", 'DateTime'>
    readonly endDate: FieldRef<"Raffle", 'DateTime'>
    readonly winner: FieldRef<"Raffle", 'String'>
    readonly prizeDetails: FieldRef<"Raffle", 'String'>
    readonly createdAt: FieldRef<"Raffle", 'DateTime'>
    readonly updatedAt: FieldRef<"Raffle", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Raffle findUnique
   */
  export type RaffleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle findUniqueOrThrow
   */
  export type RaffleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle findFirst
   */
  export type RaffleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Raffles.
     */
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle findFirstOrThrow
   */
  export type RaffleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter, which Raffle to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Raffles.
     */
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle findMany
   */
  export type RaffleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter, which Raffles to fetch.
     */
    where?: RaffleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Raffles to fetch.
     */
    orderBy?: RaffleOrderByWithRelationInput | RaffleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Raffles.
     */
    cursor?: RaffleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Raffles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Raffles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Raffles.
     */
    distinct?: RaffleScalarFieldEnum | RaffleScalarFieldEnum[]
  }

  /**
   * Raffle create
   */
  export type RaffleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data needed to create a Raffle.
     */
    data: XOR<RaffleCreateInput, RaffleUncheckedCreateInput>
  }

  /**
   * Raffle createMany
   */
  export type RaffleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Raffles.
     */
    data: RaffleCreateManyInput | RaffleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Raffle createManyAndReturn
   */
  export type RaffleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data used to create many Raffles.
     */
    data: RaffleCreateManyInput | RaffleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Raffle update
   */
  export type RaffleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data needed to update a Raffle.
     */
    data: XOR<RaffleUpdateInput, RaffleUncheckedUpdateInput>
    /**
     * Choose, which Raffle to update.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle updateMany
   */
  export type RaffleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Raffles.
     */
    data: XOR<RaffleUpdateManyMutationInput, RaffleUncheckedUpdateManyInput>
    /**
     * Filter which Raffles to update
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to update.
     */
    limit?: number
  }

  /**
   * Raffle updateManyAndReturn
   */
  export type RaffleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The data used to update Raffles.
     */
    data: XOR<RaffleUpdateManyMutationInput, RaffleUncheckedUpdateManyInput>
    /**
     * Filter which Raffles to update
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to update.
     */
    limit?: number
  }

  /**
   * Raffle upsert
   */
  export type RaffleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * The filter to search for the Raffle to update in case it exists.
     */
    where: RaffleWhereUniqueInput
    /**
     * In case the Raffle found by the `where` argument doesn't exist, create a new Raffle with this data.
     */
    create: XOR<RaffleCreateInput, RaffleUncheckedCreateInput>
    /**
     * In case the Raffle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RaffleUpdateInput, RaffleUncheckedUpdateInput>
  }

  /**
   * Raffle delete
   */
  export type RaffleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
    /**
     * Filter which Raffle to delete.
     */
    where: RaffleWhereUniqueInput
  }

  /**
   * Raffle deleteMany
   */
  export type RaffleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Raffles to delete
     */
    where?: RaffleWhereInput
    /**
     * Limit how many Raffles to delete.
     */
    limit?: number
  }

  /**
   * Raffle without action
   */
  export type RaffleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Raffle
     */
    select?: RaffleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Raffle
     */
    omit?: RaffleOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    kick_user_id: 'kick_user_id',
    kick_username: 'kick_username',
    email: 'email',
    avatar: 'avatar',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    kick_token_expires_at: 'kick_token_expires_at',
    points: 'points',
    isAdmin: 'isAdmin',
    isKickBroadcaster: 'isKickBroadcaster',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    bio: 'bio',
    display_name: 'display_name',
    profile_accent: 'profile_accent'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const KickRewardScalarFieldEnum: {
    id: 'id',
    kick_reward_id: 'kick_reward_id',
    title: 'title',
    description: 'description',
    cost: 'cost',
    background_color: 'background_color',
    is_enabled: 'is_enabled',
    is_paused: 'is_paused',
    is_user_input_required: 'is_user_input_required',
    should_redemptions_skip_request_queue: 'should_redemptions_skip_request_queue',
    raw_json: 'raw_json',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type KickRewardScalarFieldEnum = (typeof KickRewardScalarFieldEnum)[keyof typeof KickRewardScalarFieldEnum]


  export const SiteSettingsScalarFieldEnum: {
    id: 'id',
    kickUrl: 'kickUrl',
    discordUrl: 'discordUrl',
    youtubeUrl: 'youtubeUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SiteSettingsScalarFieldEnum = (typeof SiteSettingsScalarFieldEnum)[keyof typeof SiteSettingsScalarFieldEnum]


  export const LeaderboardSettingsScalarFieldEnum: {
    id: 'id',
    title: 'title',
    subtitle: 'subtitle',
    countdownTarget: 'countdownTarget',
    startDate: 'startDate',
    endDate: 'endDate',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LeaderboardSettingsScalarFieldEnum = (typeof LeaderboardSettingsScalarFieldEnum)[keyof typeof LeaderboardSettingsScalarFieldEnum]


  export const LeaderboardPrizeTierScalarFieldEnum: {
    id: 'id',
    leaderboardId: 'leaderboardId',
    place: 'place',
    prize: 'prize'
  };

  export type LeaderboardPrizeTierScalarFieldEnum = (typeof LeaderboardPrizeTierScalarFieldEnum)[keyof typeof LeaderboardPrizeTierScalarFieldEnum]


  export const RaffleScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    image: 'image',
    status: 'status',
    entryMethod: 'entryMethod',
    totalEntries: 'totalEntries',
    startDate: 'startDate',
    endDate: 'endDate',
    winner: 'winner',
    prizeDetails: 'prizeDetails',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type RaffleScalarFieldEnum = (typeof RaffleScalarFieldEnum)[keyof typeof RaffleScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    kick_user_id?: StringNullableFilter<"User"> | string | null
    kick_username?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    access_token?: StringNullableFilter<"User"> | string | null
    refresh_token?: StringNullableFilter<"User"> | string | null
    kick_token_expires_at?: DateTimeNullableFilter<"User"> | Date | string | null
    points?: IntFilter<"User"> | number
    isAdmin?: BoolFilter<"User"> | boolean
    isKickBroadcaster?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bio?: StringNullableFilter<"User"> | string | null
    display_name?: StringNullableFilter<"User"> | string | null
    profile_accent?: StringNullableFilter<"User"> | string | null
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    kick_user_id?: SortOrderInput | SortOrder
    kick_username?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    refresh_token?: SortOrderInput | SortOrder
    kick_token_expires_at?: SortOrderInput | SortOrder
    points?: SortOrder
    isAdmin?: SortOrder
    isKickBroadcaster?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bio?: SortOrderInput | SortOrder
    display_name?: SortOrderInput | SortOrder
    profile_accent?: SortOrderInput | SortOrder
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kick_user_id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    kick_username?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    access_token?: StringNullableFilter<"User"> | string | null
    refresh_token?: StringNullableFilter<"User"> | string | null
    kick_token_expires_at?: DateTimeNullableFilter<"User"> | Date | string | null
    points?: IntFilter<"User"> | number
    isAdmin?: BoolFilter<"User"> | boolean
    isKickBroadcaster?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    bio?: StringNullableFilter<"User"> | string | null
    display_name?: StringNullableFilter<"User"> | string | null
    profile_accent?: StringNullableFilter<"User"> | string | null
  }, "id" | "kick_user_id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    kick_user_id?: SortOrderInput | SortOrder
    kick_username?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    access_token?: SortOrderInput | SortOrder
    refresh_token?: SortOrderInput | SortOrder
    kick_token_expires_at?: SortOrderInput | SortOrder
    points?: SortOrder
    isAdmin?: SortOrder
    isKickBroadcaster?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bio?: SortOrderInput | SortOrder
    display_name?: SortOrderInput | SortOrder
    profile_accent?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    kick_user_id?: StringNullableWithAggregatesFilter<"User"> | string | null
    kick_username?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    access_token?: StringNullableWithAggregatesFilter<"User"> | string | null
    refresh_token?: StringNullableWithAggregatesFilter<"User"> | string | null
    kick_token_expires_at?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
    points?: IntWithAggregatesFilter<"User"> | number
    isAdmin?: BoolWithAggregatesFilter<"User"> | boolean
    isKickBroadcaster?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    bio?: StringNullableWithAggregatesFilter<"User"> | string | null
    display_name?: StringNullableWithAggregatesFilter<"User"> | string | null
    profile_accent?: StringNullableWithAggregatesFilter<"User"> | string | null
  }

  export type KickRewardWhereInput = {
    AND?: KickRewardWhereInput | KickRewardWhereInput[]
    OR?: KickRewardWhereInput[]
    NOT?: KickRewardWhereInput | KickRewardWhereInput[]
    id?: StringFilter<"KickReward"> | string
    kick_reward_id?: StringFilter<"KickReward"> | string
    title?: StringFilter<"KickReward"> | string
    description?: StringNullableFilter<"KickReward"> | string | null
    cost?: IntFilter<"KickReward"> | number
    background_color?: StringNullableFilter<"KickReward"> | string | null
    is_enabled?: BoolFilter<"KickReward"> | boolean
    is_paused?: BoolFilter<"KickReward"> | boolean
    is_user_input_required?: BoolFilter<"KickReward"> | boolean
    should_redemptions_skip_request_queue?: BoolFilter<"KickReward"> | boolean
    raw_json?: JsonNullableFilter<"KickReward">
    createdAt?: DateTimeFilter<"KickReward"> | Date | string
    updatedAt?: DateTimeFilter<"KickReward"> | Date | string
  }

  export type KickRewardOrderByWithRelationInput = {
    id?: SortOrder
    kick_reward_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    cost?: SortOrder
    background_color?: SortOrderInput | SortOrder
    is_enabled?: SortOrder
    is_paused?: SortOrder
    is_user_input_required?: SortOrder
    should_redemptions_skip_request_queue?: SortOrder
    raw_json?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KickRewardWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    kick_reward_id?: string
    AND?: KickRewardWhereInput | KickRewardWhereInput[]
    OR?: KickRewardWhereInput[]
    NOT?: KickRewardWhereInput | KickRewardWhereInput[]
    title?: StringFilter<"KickReward"> | string
    description?: StringNullableFilter<"KickReward"> | string | null
    cost?: IntFilter<"KickReward"> | number
    background_color?: StringNullableFilter<"KickReward"> | string | null
    is_enabled?: BoolFilter<"KickReward"> | boolean
    is_paused?: BoolFilter<"KickReward"> | boolean
    is_user_input_required?: BoolFilter<"KickReward"> | boolean
    should_redemptions_skip_request_queue?: BoolFilter<"KickReward"> | boolean
    raw_json?: JsonNullableFilter<"KickReward">
    createdAt?: DateTimeFilter<"KickReward"> | Date | string
    updatedAt?: DateTimeFilter<"KickReward"> | Date | string
  }, "id" | "kick_reward_id">

  export type KickRewardOrderByWithAggregationInput = {
    id?: SortOrder
    kick_reward_id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    cost?: SortOrder
    background_color?: SortOrderInput | SortOrder
    is_enabled?: SortOrder
    is_paused?: SortOrder
    is_user_input_required?: SortOrder
    should_redemptions_skip_request_queue?: SortOrder
    raw_json?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: KickRewardCountOrderByAggregateInput
    _avg?: KickRewardAvgOrderByAggregateInput
    _max?: KickRewardMaxOrderByAggregateInput
    _min?: KickRewardMinOrderByAggregateInput
    _sum?: KickRewardSumOrderByAggregateInput
  }

  export type KickRewardScalarWhereWithAggregatesInput = {
    AND?: KickRewardScalarWhereWithAggregatesInput | KickRewardScalarWhereWithAggregatesInput[]
    OR?: KickRewardScalarWhereWithAggregatesInput[]
    NOT?: KickRewardScalarWhereWithAggregatesInput | KickRewardScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"KickReward"> | string
    kick_reward_id?: StringWithAggregatesFilter<"KickReward"> | string
    title?: StringWithAggregatesFilter<"KickReward"> | string
    description?: StringNullableWithAggregatesFilter<"KickReward"> | string | null
    cost?: IntWithAggregatesFilter<"KickReward"> | number
    background_color?: StringNullableWithAggregatesFilter<"KickReward"> | string | null
    is_enabled?: BoolWithAggregatesFilter<"KickReward"> | boolean
    is_paused?: BoolWithAggregatesFilter<"KickReward"> | boolean
    is_user_input_required?: BoolWithAggregatesFilter<"KickReward"> | boolean
    should_redemptions_skip_request_queue?: BoolWithAggregatesFilter<"KickReward"> | boolean
    raw_json?: JsonNullableWithAggregatesFilter<"KickReward">
    createdAt?: DateTimeWithAggregatesFilter<"KickReward"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"KickReward"> | Date | string
  }

  export type SiteSettingsWhereInput = {
    AND?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    OR?: SiteSettingsWhereInput[]
    NOT?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    id?: StringFilter<"SiteSettings"> | string
    kickUrl?: StringFilter<"SiteSettings"> | string
    discordUrl?: StringNullableFilter<"SiteSettings"> | string | null
    youtubeUrl?: StringNullableFilter<"SiteSettings"> | string | null
    createdAt?: DateTimeFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeFilter<"SiteSettings"> | Date | string
  }

  export type SiteSettingsOrderByWithRelationInput = {
    id?: SortOrder
    kickUrl?: SortOrder
    discordUrl?: SortOrderInput | SortOrder
    youtubeUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    OR?: SiteSettingsWhereInput[]
    NOT?: SiteSettingsWhereInput | SiteSettingsWhereInput[]
    kickUrl?: StringFilter<"SiteSettings"> | string
    discordUrl?: StringNullableFilter<"SiteSettings"> | string | null
    youtubeUrl?: StringNullableFilter<"SiteSettings"> | string | null
    createdAt?: DateTimeFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeFilter<"SiteSettings"> | Date | string
  }, "id">

  export type SiteSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    kickUrl?: SortOrder
    discordUrl?: SortOrderInput | SortOrder
    youtubeUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SiteSettingsCountOrderByAggregateInput
    _max?: SiteSettingsMaxOrderByAggregateInput
    _min?: SiteSettingsMinOrderByAggregateInput
  }

  export type SiteSettingsScalarWhereWithAggregatesInput = {
    AND?: SiteSettingsScalarWhereWithAggregatesInput | SiteSettingsScalarWhereWithAggregatesInput[]
    OR?: SiteSettingsScalarWhereWithAggregatesInput[]
    NOT?: SiteSettingsScalarWhereWithAggregatesInput | SiteSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SiteSettings"> | string
    kickUrl?: StringWithAggregatesFilter<"SiteSettings"> | string
    discordUrl?: StringNullableWithAggregatesFilter<"SiteSettings"> | string | null
    youtubeUrl?: StringNullableWithAggregatesFilter<"SiteSettings"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SiteSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SiteSettings"> | Date | string
  }

  export type LeaderboardSettingsWhereInput = {
    AND?: LeaderboardSettingsWhereInput | LeaderboardSettingsWhereInput[]
    OR?: LeaderboardSettingsWhereInput[]
    NOT?: LeaderboardSettingsWhereInput | LeaderboardSettingsWhereInput[]
    id?: StringFilter<"LeaderboardSettings"> | string
    title?: StringFilter<"LeaderboardSettings"> | string
    subtitle?: StringFilter<"LeaderboardSettings"> | string
    countdownTarget?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    startDate?: DateTimeNullableFilter<"LeaderboardSettings"> | Date | string | null
    endDate?: DateTimeNullableFilter<"LeaderboardSettings"> | Date | string | null
    createdAt?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    updatedAt?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    prizeTiers?: LeaderboardPrizeTierListRelationFilter
  }

  export type LeaderboardSettingsOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    countdownTarget?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    prizeTiers?: LeaderboardPrizeTierOrderByRelationAggregateInput
  }

  export type LeaderboardSettingsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LeaderboardSettingsWhereInput | LeaderboardSettingsWhereInput[]
    OR?: LeaderboardSettingsWhereInput[]
    NOT?: LeaderboardSettingsWhereInput | LeaderboardSettingsWhereInput[]
    title?: StringFilter<"LeaderboardSettings"> | string
    subtitle?: StringFilter<"LeaderboardSettings"> | string
    countdownTarget?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    startDate?: DateTimeNullableFilter<"LeaderboardSettings"> | Date | string | null
    endDate?: DateTimeNullableFilter<"LeaderboardSettings"> | Date | string | null
    createdAt?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    updatedAt?: DateTimeFilter<"LeaderboardSettings"> | Date | string
    prizeTiers?: LeaderboardPrizeTierListRelationFilter
  }, "id">

  export type LeaderboardSettingsOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    countdownTarget?: SortOrder
    startDate?: SortOrderInput | SortOrder
    endDate?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LeaderboardSettingsCountOrderByAggregateInput
    _max?: LeaderboardSettingsMaxOrderByAggregateInput
    _min?: LeaderboardSettingsMinOrderByAggregateInput
  }

  export type LeaderboardSettingsScalarWhereWithAggregatesInput = {
    AND?: LeaderboardSettingsScalarWhereWithAggregatesInput | LeaderboardSettingsScalarWhereWithAggregatesInput[]
    OR?: LeaderboardSettingsScalarWhereWithAggregatesInput[]
    NOT?: LeaderboardSettingsScalarWhereWithAggregatesInput | LeaderboardSettingsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeaderboardSettings"> | string
    title?: StringWithAggregatesFilter<"LeaderboardSettings"> | string
    subtitle?: StringWithAggregatesFilter<"LeaderboardSettings"> | string
    countdownTarget?: DateTimeWithAggregatesFilter<"LeaderboardSettings"> | Date | string
    startDate?: DateTimeNullableWithAggregatesFilter<"LeaderboardSettings"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"LeaderboardSettings"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LeaderboardSettings"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LeaderboardSettings"> | Date | string
  }

  export type LeaderboardPrizeTierWhereInput = {
    AND?: LeaderboardPrizeTierWhereInput | LeaderboardPrizeTierWhereInput[]
    OR?: LeaderboardPrizeTierWhereInput[]
    NOT?: LeaderboardPrizeTierWhereInput | LeaderboardPrizeTierWhereInput[]
    id?: StringFilter<"LeaderboardPrizeTier"> | string
    leaderboardId?: StringFilter<"LeaderboardPrizeTier"> | string
    place?: IntFilter<"LeaderboardPrizeTier"> | number
    prize?: IntFilter<"LeaderboardPrizeTier"> | number
    leaderboard?: XOR<LeaderboardSettingsScalarRelationFilter, LeaderboardSettingsWhereInput>
  }

  export type LeaderboardPrizeTierOrderByWithRelationInput = {
    id?: SortOrder
    leaderboardId?: SortOrder
    place?: SortOrder
    prize?: SortOrder
    leaderboard?: LeaderboardSettingsOrderByWithRelationInput
  }

  export type LeaderboardPrizeTierWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    leaderboardId_place?: LeaderboardPrizeTierLeaderboardIdPlaceCompoundUniqueInput
    AND?: LeaderboardPrizeTierWhereInput | LeaderboardPrizeTierWhereInput[]
    OR?: LeaderboardPrizeTierWhereInput[]
    NOT?: LeaderboardPrizeTierWhereInput | LeaderboardPrizeTierWhereInput[]
    leaderboardId?: StringFilter<"LeaderboardPrizeTier"> | string
    place?: IntFilter<"LeaderboardPrizeTier"> | number
    prize?: IntFilter<"LeaderboardPrizeTier"> | number
    leaderboard?: XOR<LeaderboardSettingsScalarRelationFilter, LeaderboardSettingsWhereInput>
  }, "id" | "leaderboardId_place">

  export type LeaderboardPrizeTierOrderByWithAggregationInput = {
    id?: SortOrder
    leaderboardId?: SortOrder
    place?: SortOrder
    prize?: SortOrder
    _count?: LeaderboardPrizeTierCountOrderByAggregateInput
    _avg?: LeaderboardPrizeTierAvgOrderByAggregateInput
    _max?: LeaderboardPrizeTierMaxOrderByAggregateInput
    _min?: LeaderboardPrizeTierMinOrderByAggregateInput
    _sum?: LeaderboardPrizeTierSumOrderByAggregateInput
  }

  export type LeaderboardPrizeTierScalarWhereWithAggregatesInput = {
    AND?: LeaderboardPrizeTierScalarWhereWithAggregatesInput | LeaderboardPrizeTierScalarWhereWithAggregatesInput[]
    OR?: LeaderboardPrizeTierScalarWhereWithAggregatesInput[]
    NOT?: LeaderboardPrizeTierScalarWhereWithAggregatesInput | LeaderboardPrizeTierScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LeaderboardPrizeTier"> | string
    leaderboardId?: StringWithAggregatesFilter<"LeaderboardPrizeTier"> | string
    place?: IntWithAggregatesFilter<"LeaderboardPrizeTier"> | number
    prize?: IntWithAggregatesFilter<"LeaderboardPrizeTier"> | number
  }

  export type RaffleWhereInput = {
    AND?: RaffleWhereInput | RaffleWhereInput[]
    OR?: RaffleWhereInput[]
    NOT?: RaffleWhereInput | RaffleWhereInput[]
    id?: StringFilter<"Raffle"> | string
    title?: StringFilter<"Raffle"> | string
    description?: StringNullableFilter<"Raffle"> | string | null
    image?: StringNullableFilter<"Raffle"> | string | null
    status?: StringFilter<"Raffle"> | string
    entryMethod?: StringFilter<"Raffle"> | string
    totalEntries?: IntFilter<"Raffle"> | number
    startDate?: DateTimeFilter<"Raffle"> | Date | string
    endDate?: DateTimeFilter<"Raffle"> | Date | string
    winner?: StringNullableFilter<"Raffle"> | string | null
    prizeDetails?: StringFilter<"Raffle"> | string
    createdAt?: DateTimeFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeFilter<"Raffle"> | Date | string
  }

  export type RaffleOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    status?: SortOrder
    entryMethod?: SortOrder
    totalEntries?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    winner?: SortOrderInput | SortOrder
    prizeDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: RaffleWhereInput | RaffleWhereInput[]
    OR?: RaffleWhereInput[]
    NOT?: RaffleWhereInput | RaffleWhereInput[]
    title?: StringFilter<"Raffle"> | string
    description?: StringNullableFilter<"Raffle"> | string | null
    image?: StringNullableFilter<"Raffle"> | string | null
    status?: StringFilter<"Raffle"> | string
    entryMethod?: StringFilter<"Raffle"> | string
    totalEntries?: IntFilter<"Raffle"> | number
    startDate?: DateTimeFilter<"Raffle"> | Date | string
    endDate?: DateTimeFilter<"Raffle"> | Date | string
    winner?: StringNullableFilter<"Raffle"> | string | null
    prizeDetails?: StringFilter<"Raffle"> | string
    createdAt?: DateTimeFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeFilter<"Raffle"> | Date | string
  }, "id">

  export type RaffleOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    image?: SortOrderInput | SortOrder
    status?: SortOrder
    entryMethod?: SortOrder
    totalEntries?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    winner?: SortOrderInput | SortOrder
    prizeDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: RaffleCountOrderByAggregateInput
    _avg?: RaffleAvgOrderByAggregateInput
    _max?: RaffleMaxOrderByAggregateInput
    _min?: RaffleMinOrderByAggregateInput
    _sum?: RaffleSumOrderByAggregateInput
  }

  export type RaffleScalarWhereWithAggregatesInput = {
    AND?: RaffleScalarWhereWithAggregatesInput | RaffleScalarWhereWithAggregatesInput[]
    OR?: RaffleScalarWhereWithAggregatesInput[]
    NOT?: RaffleScalarWhereWithAggregatesInput | RaffleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Raffle"> | string
    title?: StringWithAggregatesFilter<"Raffle"> | string
    description?: StringNullableWithAggregatesFilter<"Raffle"> | string | null
    image?: StringNullableWithAggregatesFilter<"Raffle"> | string | null
    status?: StringWithAggregatesFilter<"Raffle"> | string
    entryMethod?: StringWithAggregatesFilter<"Raffle"> | string
    totalEntries?: IntWithAggregatesFilter<"Raffle"> | number
    startDate?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
    winner?: StringNullableWithAggregatesFilter<"Raffle"> | string | null
    prizeDetails?: StringWithAggregatesFilter<"Raffle"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Raffle"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    kick_user_id?: string | null
    kick_username?: string | null
    email?: string | null
    avatar?: string | null
    access_token?: string | null
    refresh_token?: string | null
    kick_token_expires_at?: Date | string | null
    points?: number
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bio?: string | null
    display_name?: string | null
    profile_accent?: string | null
  }

  export type UserUncheckedCreateInput = {
    id?: string
    kick_user_id?: string | null
    kick_username?: string | null
    email?: string | null
    avatar?: string | null
    access_token?: string | null
    refresh_token?: string | null
    kick_token_expires_at?: Date | string | null
    points?: number
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bio?: string | null
    display_name?: string | null
    profile_accent?: string | null
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    kick_username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    kick_token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    points?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isKickBroadcaster?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    profile_accent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    kick_username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    kick_token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    points?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isKickBroadcaster?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    profile_accent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserCreateManyInput = {
    id?: string
    kick_user_id?: string | null
    kick_username?: string | null
    email?: string | null
    avatar?: string | null
    access_token?: string | null
    refresh_token?: string | null
    kick_token_expires_at?: Date | string | null
    points?: number
    isAdmin?: boolean
    isKickBroadcaster?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    bio?: string | null
    display_name?: string | null
    profile_accent?: string | null
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    kick_username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    kick_token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    points?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isKickBroadcaster?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    profile_accent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_user_id?: NullableStringFieldUpdateOperationsInput | string | null
    kick_username?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    access_token?: NullableStringFieldUpdateOperationsInput | string | null
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    kick_token_expires_at?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    points?: IntFieldUpdateOperationsInput | number
    isAdmin?: BoolFieldUpdateOperationsInput | boolean
    isKickBroadcaster?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    bio?: NullableStringFieldUpdateOperationsInput | string | null
    display_name?: NullableStringFieldUpdateOperationsInput | string | null
    profile_accent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type KickRewardCreateInput = {
    id?: string
    kick_reward_id: string
    title: string
    description?: string | null
    cost: number
    background_color?: string | null
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KickRewardUncheckedCreateInput = {
    id?: string
    kick_reward_id: string
    title: string
    description?: string | null
    cost: number
    background_color?: string | null
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KickRewardUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_reward_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    background_color?: NullableStringFieldUpdateOperationsInput | string | null
    is_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_paused?: BoolFieldUpdateOperationsInput | boolean
    is_user_input_required?: BoolFieldUpdateOperationsInput | boolean
    should_redemptions_skip_request_queue?: BoolFieldUpdateOperationsInput | boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KickRewardUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_reward_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    background_color?: NullableStringFieldUpdateOperationsInput | string | null
    is_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_paused?: BoolFieldUpdateOperationsInput | boolean
    is_user_input_required?: BoolFieldUpdateOperationsInput | boolean
    should_redemptions_skip_request_queue?: BoolFieldUpdateOperationsInput | boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KickRewardCreateManyInput = {
    id?: string
    kick_reward_id: string
    title: string
    description?: string | null
    cost: number
    background_color?: string | null
    is_enabled?: boolean
    is_paused?: boolean
    is_user_input_required?: boolean
    should_redemptions_skip_request_queue?: boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type KickRewardUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_reward_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    background_color?: NullableStringFieldUpdateOperationsInput | string | null
    is_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_paused?: BoolFieldUpdateOperationsInput | boolean
    is_user_input_required?: BoolFieldUpdateOperationsInput | boolean
    should_redemptions_skip_request_queue?: BoolFieldUpdateOperationsInput | boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type KickRewardUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kick_reward_id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    cost?: IntFieldUpdateOperationsInput | number
    background_color?: NullableStringFieldUpdateOperationsInput | string | null
    is_enabled?: BoolFieldUpdateOperationsInput | boolean
    is_paused?: BoolFieldUpdateOperationsInput | boolean
    is_user_input_required?: BoolFieldUpdateOperationsInput | boolean
    should_redemptions_skip_request_queue?: BoolFieldUpdateOperationsInput | boolean
    raw_json?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsCreateInput = {
    id?: string
    kickUrl: string
    discordUrl?: string | null
    youtubeUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUncheckedCreateInput = {
    id?: string
    kickUrl: string
    discordUrl?: string | null
    youtubeUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kickUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    kickUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsCreateManyInput = {
    id?: string
    kickUrl: string
    discordUrl?: string | null
    youtubeUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SiteSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    kickUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SiteSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    kickUrl?: StringFieldUpdateOperationsInput | string
    discordUrl?: NullableStringFieldUpdateOperationsInput | string | null
    youtubeUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardSettingsCreateInput = {
    id?: string
    title: string
    subtitle: string
    countdownTarget: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    prizeTiers?: LeaderboardPrizeTierCreateNestedManyWithoutLeaderboardInput
  }

  export type LeaderboardSettingsUncheckedCreateInput = {
    id?: string
    title: string
    subtitle: string
    countdownTarget: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    prizeTiers?: LeaderboardPrizeTierUncheckedCreateNestedManyWithoutLeaderboardInput
  }

  export type LeaderboardSettingsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prizeTiers?: LeaderboardPrizeTierUpdateManyWithoutLeaderboardNestedInput
  }

  export type LeaderboardSettingsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    prizeTiers?: LeaderboardPrizeTierUncheckedUpdateManyWithoutLeaderboardNestedInput
  }

  export type LeaderboardSettingsCreateManyInput = {
    id?: string
    title: string
    subtitle: string
    countdownTarget: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaderboardSettingsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardSettingsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardPrizeTierCreateInput = {
    id?: string
    place: number
    prize: number
    leaderboard: LeaderboardSettingsCreateNestedOneWithoutPrizeTiersInput
  }

  export type LeaderboardPrizeTierUncheckedCreateInput = {
    id?: string
    leaderboardId: string
    place: number
    prize: number
  }

  export type LeaderboardPrizeTierUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
    leaderboard?: LeaderboardSettingsUpdateOneRequiredWithoutPrizeTiersNestedInput
  }

  export type LeaderboardPrizeTierUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaderboardId?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }

  export type LeaderboardPrizeTierCreateManyInput = {
    id?: string
    leaderboardId: string
    place: number
    prize: number
  }

  export type LeaderboardPrizeTierUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }

  export type LeaderboardPrizeTierUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    leaderboardId?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }

  export type RaffleCreateInput = {
    id: string
    title: string
    description?: string | null
    image?: string | null
    status?: string
    entryMethod: string
    totalEntries?: number
    startDate: Date | string
    endDate: Date | string
    winner?: string | null
    prizeDetails: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleUncheckedCreateInput = {
    id: string
    title: string
    description?: string | null
    image?: string | null
    status?: string
    entryMethod: string
    totalEntries?: number
    startDate: Date | string
    endDate: Date | string
    winner?: string | null
    prizeDetails: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    entryMethod?: StringFieldUpdateOperationsInput | string
    totalEntries?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDetails?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    entryMethod?: StringFieldUpdateOperationsInput | string
    totalEntries?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDetails?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleCreateManyInput = {
    id: string
    title: string
    description?: string | null
    image?: string | null
    status?: string
    entryMethod: string
    totalEntries?: number
    startDate: Date | string
    endDate: Date | string
    winner?: string | null
    prizeDetails: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RaffleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    entryMethod?: StringFieldUpdateOperationsInput | string
    totalEntries?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDetails?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RaffleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    image?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    entryMethod?: StringFieldUpdateOperationsInput | string
    totalEntries?: IntFieldUpdateOperationsInput | number
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    winner?: NullableStringFieldUpdateOperationsInput | string | null
    prizeDetails?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    kick_user_id?: SortOrder
    kick_username?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    kick_token_expires_at?: SortOrder
    points?: SortOrder
    isAdmin?: SortOrder
    isKickBroadcaster?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bio?: SortOrder
    display_name?: SortOrder
    profile_accent?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    points?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    kick_user_id?: SortOrder
    kick_username?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    kick_token_expires_at?: SortOrder
    points?: SortOrder
    isAdmin?: SortOrder
    isKickBroadcaster?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bio?: SortOrder
    display_name?: SortOrder
    profile_accent?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    kick_user_id?: SortOrder
    kick_username?: SortOrder
    email?: SortOrder
    avatar?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    kick_token_expires_at?: SortOrder
    points?: SortOrder
    isAdmin?: SortOrder
    isKickBroadcaster?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    bio?: SortOrder
    display_name?: SortOrder
    profile_accent?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    points?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type KickRewardCountOrderByAggregateInput = {
    id?: SortOrder
    kick_reward_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    background_color?: SortOrder
    is_enabled?: SortOrder
    is_paused?: SortOrder
    is_user_input_required?: SortOrder
    should_redemptions_skip_request_queue?: SortOrder
    raw_json?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KickRewardAvgOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type KickRewardMaxOrderByAggregateInput = {
    id?: SortOrder
    kick_reward_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    background_color?: SortOrder
    is_enabled?: SortOrder
    is_paused?: SortOrder
    is_user_input_required?: SortOrder
    should_redemptions_skip_request_queue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KickRewardMinOrderByAggregateInput = {
    id?: SortOrder
    kick_reward_id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    cost?: SortOrder
    background_color?: SortOrder
    is_enabled?: SortOrder
    is_paused?: SortOrder
    is_user_input_required?: SortOrder
    should_redemptions_skip_request_queue?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type KickRewardSumOrderByAggregateInput = {
    cost?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type SiteSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    kickUrl?: SortOrder
    discordUrl?: SortOrder
    youtubeUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    kickUrl?: SortOrder
    discordUrl?: SortOrder
    youtubeUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SiteSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    kickUrl?: SortOrder
    discordUrl?: SortOrder
    youtubeUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaderboardPrizeTierListRelationFilter = {
    every?: LeaderboardPrizeTierWhereInput
    some?: LeaderboardPrizeTierWhereInput
    none?: LeaderboardPrizeTierWhereInput
  }

  export type LeaderboardPrizeTierOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LeaderboardSettingsCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    countdownTarget?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaderboardSettingsMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    countdownTarget?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaderboardSettingsMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    subtitle?: SortOrder
    countdownTarget?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LeaderboardSettingsScalarRelationFilter = {
    is?: LeaderboardSettingsWhereInput
    isNot?: LeaderboardSettingsWhereInput
  }

  export type LeaderboardPrizeTierLeaderboardIdPlaceCompoundUniqueInput = {
    leaderboardId: string
    place: number
  }

  export type LeaderboardPrizeTierCountOrderByAggregateInput = {
    id?: SortOrder
    leaderboardId?: SortOrder
    place?: SortOrder
    prize?: SortOrder
  }

  export type LeaderboardPrizeTierAvgOrderByAggregateInput = {
    place?: SortOrder
    prize?: SortOrder
  }

  export type LeaderboardPrizeTierMaxOrderByAggregateInput = {
    id?: SortOrder
    leaderboardId?: SortOrder
    place?: SortOrder
    prize?: SortOrder
  }

  export type LeaderboardPrizeTierMinOrderByAggregateInput = {
    id?: SortOrder
    leaderboardId?: SortOrder
    place?: SortOrder
    prize?: SortOrder
  }

  export type LeaderboardPrizeTierSumOrderByAggregateInput = {
    place?: SortOrder
    prize?: SortOrder
  }

  export type RaffleCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    status?: SortOrder
    entryMethod?: SortOrder
    totalEntries?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    winner?: SortOrder
    prizeDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleAvgOrderByAggregateInput = {
    totalEntries?: SortOrder
  }

  export type RaffleMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    status?: SortOrder
    entryMethod?: SortOrder
    totalEntries?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    winner?: SortOrder
    prizeDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    image?: SortOrder
    status?: SortOrder
    entryMethod?: SortOrder
    totalEntries?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    winner?: SortOrder
    prizeDetails?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type RaffleSumOrderByAggregateInput = {
    totalEntries?: SortOrder
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type LeaderboardPrizeTierCreateNestedManyWithoutLeaderboardInput = {
    create?: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput> | LeaderboardPrizeTierCreateWithoutLeaderboardInput[] | LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput[]
    connectOrCreate?: LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput | LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput[]
    createMany?: LeaderboardPrizeTierCreateManyLeaderboardInputEnvelope
    connect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
  }

  export type LeaderboardPrizeTierUncheckedCreateNestedManyWithoutLeaderboardInput = {
    create?: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput> | LeaderboardPrizeTierCreateWithoutLeaderboardInput[] | LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput[]
    connectOrCreate?: LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput | LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput[]
    createMany?: LeaderboardPrizeTierCreateManyLeaderboardInputEnvelope
    connect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
  }

  export type LeaderboardPrizeTierUpdateManyWithoutLeaderboardNestedInput = {
    create?: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput> | LeaderboardPrizeTierCreateWithoutLeaderboardInput[] | LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput[]
    connectOrCreate?: LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput | LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput[]
    upsert?: LeaderboardPrizeTierUpsertWithWhereUniqueWithoutLeaderboardInput | LeaderboardPrizeTierUpsertWithWhereUniqueWithoutLeaderboardInput[]
    createMany?: LeaderboardPrizeTierCreateManyLeaderboardInputEnvelope
    set?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    disconnect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    delete?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    connect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    update?: LeaderboardPrizeTierUpdateWithWhereUniqueWithoutLeaderboardInput | LeaderboardPrizeTierUpdateWithWhereUniqueWithoutLeaderboardInput[]
    updateMany?: LeaderboardPrizeTierUpdateManyWithWhereWithoutLeaderboardInput | LeaderboardPrizeTierUpdateManyWithWhereWithoutLeaderboardInput[]
    deleteMany?: LeaderboardPrizeTierScalarWhereInput | LeaderboardPrizeTierScalarWhereInput[]
  }

  export type LeaderboardPrizeTierUncheckedUpdateManyWithoutLeaderboardNestedInput = {
    create?: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput> | LeaderboardPrizeTierCreateWithoutLeaderboardInput[] | LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput[]
    connectOrCreate?: LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput | LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput[]
    upsert?: LeaderboardPrizeTierUpsertWithWhereUniqueWithoutLeaderboardInput | LeaderboardPrizeTierUpsertWithWhereUniqueWithoutLeaderboardInput[]
    createMany?: LeaderboardPrizeTierCreateManyLeaderboardInputEnvelope
    set?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    disconnect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    delete?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    connect?: LeaderboardPrizeTierWhereUniqueInput | LeaderboardPrizeTierWhereUniqueInput[]
    update?: LeaderboardPrizeTierUpdateWithWhereUniqueWithoutLeaderboardInput | LeaderboardPrizeTierUpdateWithWhereUniqueWithoutLeaderboardInput[]
    updateMany?: LeaderboardPrizeTierUpdateManyWithWhereWithoutLeaderboardInput | LeaderboardPrizeTierUpdateManyWithWhereWithoutLeaderboardInput[]
    deleteMany?: LeaderboardPrizeTierScalarWhereInput | LeaderboardPrizeTierScalarWhereInput[]
  }

  export type LeaderboardSettingsCreateNestedOneWithoutPrizeTiersInput = {
    create?: XOR<LeaderboardSettingsCreateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedCreateWithoutPrizeTiersInput>
    connectOrCreate?: LeaderboardSettingsCreateOrConnectWithoutPrizeTiersInput
    connect?: LeaderboardSettingsWhereUniqueInput
  }

  export type LeaderboardSettingsUpdateOneRequiredWithoutPrizeTiersNestedInput = {
    create?: XOR<LeaderboardSettingsCreateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedCreateWithoutPrizeTiersInput>
    connectOrCreate?: LeaderboardSettingsCreateOrConnectWithoutPrizeTiersInput
    upsert?: LeaderboardSettingsUpsertWithoutPrizeTiersInput
    connect?: LeaderboardSettingsWhereUniqueInput
    update?: XOR<XOR<LeaderboardSettingsUpdateToOneWithWhereWithoutPrizeTiersInput, LeaderboardSettingsUpdateWithoutPrizeTiersInput>, LeaderboardSettingsUncheckedUpdateWithoutPrizeTiersInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type LeaderboardPrizeTierCreateWithoutLeaderboardInput = {
    id?: string
    place: number
    prize: number
  }

  export type LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput = {
    id?: string
    place: number
    prize: number
  }

  export type LeaderboardPrizeTierCreateOrConnectWithoutLeaderboardInput = {
    where: LeaderboardPrizeTierWhereUniqueInput
    create: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput>
  }

  export type LeaderboardPrizeTierCreateManyLeaderboardInputEnvelope = {
    data: LeaderboardPrizeTierCreateManyLeaderboardInput | LeaderboardPrizeTierCreateManyLeaderboardInput[]
    skipDuplicates?: boolean
  }

  export type LeaderboardPrizeTierUpsertWithWhereUniqueWithoutLeaderboardInput = {
    where: LeaderboardPrizeTierWhereUniqueInput
    update: XOR<LeaderboardPrizeTierUpdateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedUpdateWithoutLeaderboardInput>
    create: XOR<LeaderboardPrizeTierCreateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedCreateWithoutLeaderboardInput>
  }

  export type LeaderboardPrizeTierUpdateWithWhereUniqueWithoutLeaderboardInput = {
    where: LeaderboardPrizeTierWhereUniqueInput
    data: XOR<LeaderboardPrizeTierUpdateWithoutLeaderboardInput, LeaderboardPrizeTierUncheckedUpdateWithoutLeaderboardInput>
  }

  export type LeaderboardPrizeTierUpdateManyWithWhereWithoutLeaderboardInput = {
    where: LeaderboardPrizeTierScalarWhereInput
    data: XOR<LeaderboardPrizeTierUpdateManyMutationInput, LeaderboardPrizeTierUncheckedUpdateManyWithoutLeaderboardInput>
  }

  export type LeaderboardPrizeTierScalarWhereInput = {
    AND?: LeaderboardPrizeTierScalarWhereInput | LeaderboardPrizeTierScalarWhereInput[]
    OR?: LeaderboardPrizeTierScalarWhereInput[]
    NOT?: LeaderboardPrizeTierScalarWhereInput | LeaderboardPrizeTierScalarWhereInput[]
    id?: StringFilter<"LeaderboardPrizeTier"> | string
    leaderboardId?: StringFilter<"LeaderboardPrizeTier"> | string
    place?: IntFilter<"LeaderboardPrizeTier"> | number
    prize?: IntFilter<"LeaderboardPrizeTier"> | number
  }

  export type LeaderboardSettingsCreateWithoutPrizeTiersInput = {
    id?: string
    title: string
    subtitle: string
    countdownTarget: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaderboardSettingsUncheckedCreateWithoutPrizeTiersInput = {
    id?: string
    title: string
    subtitle: string
    countdownTarget: Date | string
    startDate?: Date | string | null
    endDate?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LeaderboardSettingsCreateOrConnectWithoutPrizeTiersInput = {
    where: LeaderboardSettingsWhereUniqueInput
    create: XOR<LeaderboardSettingsCreateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedCreateWithoutPrizeTiersInput>
  }

  export type LeaderboardSettingsUpsertWithoutPrizeTiersInput = {
    update: XOR<LeaderboardSettingsUpdateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedUpdateWithoutPrizeTiersInput>
    create: XOR<LeaderboardSettingsCreateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedCreateWithoutPrizeTiersInput>
    where?: LeaderboardSettingsWhereInput
  }

  export type LeaderboardSettingsUpdateToOneWithWhereWithoutPrizeTiersInput = {
    where?: LeaderboardSettingsWhereInput
    data: XOR<LeaderboardSettingsUpdateWithoutPrizeTiersInput, LeaderboardSettingsUncheckedUpdateWithoutPrizeTiersInput>
  }

  export type LeaderboardSettingsUpdateWithoutPrizeTiersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardSettingsUncheckedUpdateWithoutPrizeTiersInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    subtitle?: StringFieldUpdateOperationsInput | string
    countdownTarget?: DateTimeFieldUpdateOperationsInput | Date | string
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LeaderboardPrizeTierCreateManyLeaderboardInput = {
    id?: string
    place: number
    prize: number
  }

  export type LeaderboardPrizeTierUpdateWithoutLeaderboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }

  export type LeaderboardPrizeTierUncheckedUpdateWithoutLeaderboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }

  export type LeaderboardPrizeTierUncheckedUpdateManyWithoutLeaderboardInput = {
    id?: StringFieldUpdateOperationsInput | string
    place?: IntFieldUpdateOperationsInput | number
    prize?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}