
/**
 * Client
**/

import * as runtime from './runtime/library.js';
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
 * Model Spot
 * 
 */
export type Spot = $Result.DefaultSelection<Prisma.$SpotPayload>
/**
 * Model SpotReview
 * 
 */
export type SpotReview = $Result.DefaultSelection<Prisma.$SpotReviewPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
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
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
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
   * `prisma.spot`: Exposes CRUD operations for the **Spot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Spots
    * const spots = await prisma.spot.findMany()
    * ```
    */
  get spot(): Prisma.SpotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.spotReview`: Exposes CRUD operations for the **SpotReview** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SpotReviews
    * const spotReviews = await prisma.spotReview.findMany()
    * ```
    */
  get spotReview(): Prisma.SpotReviewDelegate<ExtArgs, ClientOptions>;
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
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

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
   * Prisma Client JS version: 6.14.0
   * Query Engine version: 717184b7b35ea05dfa71a3236b7af656013e1e49
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


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
    Spot: 'Spot',
    SpotReview: 'SpotReview'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "spot" | "spotReview"
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
      Spot: {
        payload: Prisma.$SpotPayload<ExtArgs>
        fields: Prisma.SpotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          findFirst: {
            args: Prisma.SpotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          findMany: {
            args: Prisma.SpotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>[]
          }
          create: {
            args: Prisma.SpotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          createMany: {
            args: Prisma.SpotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>[]
          }
          delete: {
            args: Prisma.SpotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          update: {
            args: Prisma.SpotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          deleteMany: {
            args: Prisma.SpotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>[]
          }
          upsert: {
            args: Prisma.SpotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotPayload>
          }
          aggregate: {
            args: Prisma.SpotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpot>
          }
          groupBy: {
            args: Prisma.SpotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpotCountArgs<ExtArgs>
            result: $Utils.Optional<SpotCountAggregateOutputType> | number
          }
        }
      }
      SpotReview: {
        payload: Prisma.$SpotReviewPayload<ExtArgs>
        fields: Prisma.SpotReviewFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SpotReviewFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SpotReviewFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          findFirst: {
            args: Prisma.SpotReviewFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SpotReviewFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          findMany: {
            args: Prisma.SpotReviewFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>[]
          }
          create: {
            args: Prisma.SpotReviewCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          createMany: {
            args: Prisma.SpotReviewCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SpotReviewCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>[]
          }
          delete: {
            args: Prisma.SpotReviewDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          update: {
            args: Prisma.SpotReviewUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          deleteMany: {
            args: Prisma.SpotReviewDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SpotReviewUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SpotReviewUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>[]
          }
          upsert: {
            args: Prisma.SpotReviewUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SpotReviewPayload>
          }
          aggregate: {
            args: Prisma.SpotReviewAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSpotReview>
          }
          groupBy: {
            args: Prisma.SpotReviewGroupByArgs<ExtArgs>
            result: $Utils.Optional<SpotReviewGroupByOutputType>[]
          }
          count: {
            args: Prisma.SpotReviewCountArgs<ExtArgs>
            result: $Utils.Optional<SpotReviewCountAggregateOutputType> | number
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
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
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
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
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
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    spot?: SpotOmit
    spotReview?: SpotReviewOmit
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
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    spot: number
    reviews: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spot?: boolean | UserCountOutputTypeCountSpotArgs
    reviews?: boolean | UserCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountSpotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotReviewWhereInput
  }


  /**
   * Count Type SpotCountOutputType
   */

  export type SpotCountOutputType = {
    reviews: number
  }

  export type SpotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reviews?: boolean | SpotCountOutputTypeCountReviewsArgs
  }

  // Custom InputTypes
  /**
   * SpotCountOutputType without action
   */
  export type SpotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotCountOutputType
     */
    select?: SpotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpotCountOutputType without action
   */
  export type SpotCountOutputTypeCountReviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotReviewWhereInput
  }


  /**
   * Count Type SpotReviewCountOutputType
   */

  export type SpotReviewCountOutputType = {
    replies: number
  }

  export type SpotReviewCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    replies?: boolean | SpotReviewCountOutputTypeCountRepliesArgs
  }

  // Custom InputTypes
  /**
   * SpotReviewCountOutputType without action
   */
  export type SpotReviewCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReviewCountOutputType
     */
    select?: SpotReviewCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SpotReviewCountOutputType without action
   */
  export type SpotReviewCountOutputTypeCountRepliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotReviewWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    password: string | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    password: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    password?: true
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
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string
    password: string
    _count: UserCountAggregateOutputType | null
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
    email?: boolean
    name?: boolean
    password?: boolean
    spot?: boolean | User$spotArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    password?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "password", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    spot?: boolean | User$spotArgs<ExtArgs>
    reviews?: boolean | User$reviewsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      spot: Prisma.$SpotPayload<ExtArgs>[]
      reviews: Prisma.$SpotReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string
      password: string
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
    spot<T extends User$spotArgs<ExtArgs> = {}>(args?: Subset<T, User$spotArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    reviews<T extends User$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, User$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
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
   * User.spot
   */
  export type User$spotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    where?: SpotWhereInput
    orderBy?: SpotOrderByWithRelationInput | SpotOrderByWithRelationInput[]
    cursor?: SpotWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpotScalarFieldEnum | SpotScalarFieldEnum[]
  }

  /**
   * User.reviews
   */
  export type User$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    where?: SpotReviewWhereInput
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    cursor?: SpotReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
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
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Spot
   */

  export type AggregateSpot = {
    _count: SpotCountAggregateOutputType | null
    _min: SpotMinAggregateOutputType | null
    _max: SpotMaxAggregateOutputType | null
  }

  export type SpotMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    authorId: string | null
    modality: string | null
    equipmentRequired: boolean | null
    isPaid: boolean | null
    alwaysOpen: boolean | null
    entryAmount: string | null
    openingHours: string | null
    hasCoverage: boolean | null
    createdAt: Date | null
  }

  export type SpotMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    authorId: string | null
    modality: string | null
    equipmentRequired: boolean | null
    isPaid: boolean | null
    alwaysOpen: boolean | null
    entryAmount: string | null
    openingHours: string | null
    hasCoverage: boolean | null
    createdAt: Date | null
  }

  export type SpotCountAggregateOutputType = {
    id: number
    name: number
    description: number
    authorId: number
    modality: number
    equipmentRequired: number
    isPaid: number
    alwaysOpen: number
    entryAmount: number
    openingHours: number
    hasCoverage: number
    coordinates: number
    images: number
    createdAt: number
    _all: number
  }


  export type SpotMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    modality?: true
    equipmentRequired?: true
    isPaid?: true
    alwaysOpen?: true
    entryAmount?: true
    openingHours?: true
    hasCoverage?: true
    createdAt?: true
  }

  export type SpotMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    modality?: true
    equipmentRequired?: true
    isPaid?: true
    alwaysOpen?: true
    entryAmount?: true
    openingHours?: true
    hasCoverage?: true
    createdAt?: true
  }

  export type SpotCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    authorId?: true
    modality?: true
    equipmentRequired?: true
    isPaid?: true
    alwaysOpen?: true
    entryAmount?: true
    openingHours?: true
    hasCoverage?: true
    coordinates?: true
    images?: true
    createdAt?: true
    _all?: true
  }

  export type SpotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Spot to aggregate.
     */
    where?: SpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spots to fetch.
     */
    orderBy?: SpotOrderByWithRelationInput | SpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Spots
    **/
    _count?: true | SpotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpotMaxAggregateInputType
  }

  export type GetSpotAggregateType<T extends SpotAggregateArgs> = {
        [P in keyof T & keyof AggregateSpot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpot[P]>
      : GetScalarType<T[P], AggregateSpot[P]>
  }




  export type SpotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotWhereInput
    orderBy?: SpotOrderByWithAggregationInput | SpotOrderByWithAggregationInput[]
    by: SpotScalarFieldEnum[] | SpotScalarFieldEnum
    having?: SpotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpotCountAggregateInputType | true
    _min?: SpotMinAggregateInputType
    _max?: SpotMaxAggregateInputType
  }

  export type SpotGroupByOutputType = {
    id: string
    name: string
    description: string
    authorId: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount: string | null
    openingHours: string | null
    hasCoverage: boolean
    coordinates: JsonValue
    images: string[]
    createdAt: Date
    _count: SpotCountAggregateOutputType | null
    _min: SpotMinAggregateOutputType | null
    _max: SpotMaxAggregateOutputType | null
  }

  type GetSpotGroupByPayload<T extends SpotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpotGroupByOutputType[P]>
            : GetScalarType<T[P], SpotGroupByOutputType[P]>
        }
      >
    >


  export type SpotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    modality?: boolean
    equipmentRequired?: boolean
    isPaid?: boolean
    alwaysOpen?: boolean
    entryAmount?: boolean
    openingHours?: boolean
    hasCoverage?: boolean
    coordinates?: boolean
    images?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    reviews?: boolean | Spot$reviewsArgs<ExtArgs>
    _count?: boolean | SpotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spot"]>

  export type SpotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    modality?: boolean
    equipmentRequired?: boolean
    isPaid?: boolean
    alwaysOpen?: boolean
    entryAmount?: boolean
    openingHours?: boolean
    hasCoverage?: boolean
    coordinates?: boolean
    images?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spot"]>

  export type SpotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    modality?: boolean
    equipmentRequired?: boolean
    isPaid?: boolean
    alwaysOpen?: boolean
    entryAmount?: boolean
    openingHours?: boolean
    hasCoverage?: boolean
    coordinates?: boolean
    images?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spot"]>

  export type SpotSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    authorId?: boolean
    modality?: boolean
    equipmentRequired?: boolean
    isPaid?: boolean
    alwaysOpen?: boolean
    entryAmount?: boolean
    openingHours?: boolean
    hasCoverage?: boolean
    coordinates?: boolean
    images?: boolean
    createdAt?: boolean
  }

  export type SpotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "description" | "authorId" | "modality" | "equipmentRequired" | "isPaid" | "alwaysOpen" | "entryAmount" | "openingHours" | "hasCoverage" | "coordinates" | "images" | "createdAt", ExtArgs["result"]["spot"]>
  export type SpotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    reviews?: boolean | Spot$reviewsArgs<ExtArgs>
    _count?: boolean | SpotCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SpotIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SpotIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SpotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Spot"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      reviews: Prisma.$SpotReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string
      authorId: string
      modality: string
      equipmentRequired: boolean
      isPaid: boolean
      alwaysOpen: boolean
      entryAmount: string | null
      openingHours: string | null
      hasCoverage: boolean
      coordinates: Prisma.JsonValue
      images: string[]
      createdAt: Date
    }, ExtArgs["result"]["spot"]>
    composites: {}
  }

  type SpotGetPayload<S extends boolean | null | undefined | SpotDefaultArgs> = $Result.GetResult<Prisma.$SpotPayload, S>

  type SpotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpotCountAggregateInputType | true
    }

  export interface SpotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Spot'], meta: { name: 'Spot' } }
    /**
     * Find zero or one Spot that matches the filter.
     * @param {SpotFindUniqueArgs} args - Arguments to find a Spot
     * @example
     * // Get one Spot
     * const spot = await prisma.spot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpotFindUniqueArgs>(args: SelectSubset<T, SpotFindUniqueArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Spot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpotFindUniqueOrThrowArgs} args - Arguments to find a Spot
     * @example
     * // Get one Spot
     * const spot = await prisma.spot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpotFindUniqueOrThrowArgs>(args: SelectSubset<T, SpotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Spot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotFindFirstArgs} args - Arguments to find a Spot
     * @example
     * // Get one Spot
     * const spot = await prisma.spot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpotFindFirstArgs>(args?: SelectSubset<T, SpotFindFirstArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Spot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotFindFirstOrThrowArgs} args - Arguments to find a Spot
     * @example
     * // Get one Spot
     * const spot = await prisma.spot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpotFindFirstOrThrowArgs>(args?: SelectSubset<T, SpotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Spots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Spots
     * const spots = await prisma.spot.findMany()
     * 
     * // Get first 10 Spots
     * const spots = await prisma.spot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spotWithIdOnly = await prisma.spot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpotFindManyArgs>(args?: SelectSubset<T, SpotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Spot.
     * @param {SpotCreateArgs} args - Arguments to create a Spot.
     * @example
     * // Create one Spot
     * const Spot = await prisma.spot.create({
     *   data: {
     *     // ... data to create a Spot
     *   }
     * })
     * 
     */
    create<T extends SpotCreateArgs>(args: SelectSubset<T, SpotCreateArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Spots.
     * @param {SpotCreateManyArgs} args - Arguments to create many Spots.
     * @example
     * // Create many Spots
     * const spot = await prisma.spot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpotCreateManyArgs>(args?: SelectSubset<T, SpotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Spots and returns the data saved in the database.
     * @param {SpotCreateManyAndReturnArgs} args - Arguments to create many Spots.
     * @example
     * // Create many Spots
     * const spot = await prisma.spot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Spots and only return the `id`
     * const spotWithIdOnly = await prisma.spot.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpotCreateManyAndReturnArgs>(args?: SelectSubset<T, SpotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Spot.
     * @param {SpotDeleteArgs} args - Arguments to delete one Spot.
     * @example
     * // Delete one Spot
     * const Spot = await prisma.spot.delete({
     *   where: {
     *     // ... filter to delete one Spot
     *   }
     * })
     * 
     */
    delete<T extends SpotDeleteArgs>(args: SelectSubset<T, SpotDeleteArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Spot.
     * @param {SpotUpdateArgs} args - Arguments to update one Spot.
     * @example
     * // Update one Spot
     * const spot = await prisma.spot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpotUpdateArgs>(args: SelectSubset<T, SpotUpdateArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Spots.
     * @param {SpotDeleteManyArgs} args - Arguments to filter Spots to delete.
     * @example
     * // Delete a few Spots
     * const { count } = await prisma.spot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpotDeleteManyArgs>(args?: SelectSubset<T, SpotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Spots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Spots
     * const spot = await prisma.spot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpotUpdateManyArgs>(args: SelectSubset<T, SpotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Spots and returns the data updated in the database.
     * @param {SpotUpdateManyAndReturnArgs} args - Arguments to update many Spots.
     * @example
     * // Update many Spots
     * const spot = await prisma.spot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Spots and only return the `id`
     * const spotWithIdOnly = await prisma.spot.updateManyAndReturn({
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
    updateManyAndReturn<T extends SpotUpdateManyAndReturnArgs>(args: SelectSubset<T, SpotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Spot.
     * @param {SpotUpsertArgs} args - Arguments to update or create a Spot.
     * @example
     * // Update or create a Spot
     * const spot = await prisma.spot.upsert({
     *   create: {
     *     // ... data to create a Spot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Spot we want to update
     *   }
     * })
     */
    upsert<T extends SpotUpsertArgs>(args: SelectSubset<T, SpotUpsertArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Spots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotCountArgs} args - Arguments to filter Spots to count.
     * @example
     * // Count the number of Spots
     * const count = await prisma.spot.count({
     *   where: {
     *     // ... the filter for the Spots we want to count
     *   }
     * })
    **/
    count<T extends SpotCountArgs>(
      args?: Subset<T, SpotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Spot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SpotAggregateArgs>(args: Subset<T, SpotAggregateArgs>): Prisma.PrismaPromise<GetSpotAggregateType<T>>

    /**
     * Group by Spot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotGroupByArgs} args - Group by arguments.
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
      T extends SpotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpotGroupByArgs['orderBy'] }
        : { orderBy?: SpotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SpotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Spot model
   */
  readonly fields: SpotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Spot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    reviews<T extends Spot$reviewsArgs<ExtArgs> = {}>(args?: Subset<T, Spot$reviewsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Spot model
   */
  interface SpotFieldRefs {
    readonly id: FieldRef<"Spot", 'String'>
    readonly name: FieldRef<"Spot", 'String'>
    readonly description: FieldRef<"Spot", 'String'>
    readonly authorId: FieldRef<"Spot", 'String'>
    readonly modality: FieldRef<"Spot", 'String'>
    readonly equipmentRequired: FieldRef<"Spot", 'Boolean'>
    readonly isPaid: FieldRef<"Spot", 'Boolean'>
    readonly alwaysOpen: FieldRef<"Spot", 'Boolean'>
    readonly entryAmount: FieldRef<"Spot", 'String'>
    readonly openingHours: FieldRef<"Spot", 'String'>
    readonly hasCoverage: FieldRef<"Spot", 'Boolean'>
    readonly coordinates: FieldRef<"Spot", 'Json'>
    readonly images: FieldRef<"Spot", 'String[]'>
    readonly createdAt: FieldRef<"Spot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Spot findUnique
   */
  export type SpotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter, which Spot to fetch.
     */
    where: SpotWhereUniqueInput
  }

  /**
   * Spot findUniqueOrThrow
   */
  export type SpotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter, which Spot to fetch.
     */
    where: SpotWhereUniqueInput
  }

  /**
   * Spot findFirst
   */
  export type SpotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter, which Spot to fetch.
     */
    where?: SpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spots to fetch.
     */
    orderBy?: SpotOrderByWithRelationInput | SpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Spots.
     */
    cursor?: SpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Spots.
     */
    distinct?: SpotScalarFieldEnum | SpotScalarFieldEnum[]
  }

  /**
   * Spot findFirstOrThrow
   */
  export type SpotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter, which Spot to fetch.
     */
    where?: SpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spots to fetch.
     */
    orderBy?: SpotOrderByWithRelationInput | SpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Spots.
     */
    cursor?: SpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Spots.
     */
    distinct?: SpotScalarFieldEnum | SpotScalarFieldEnum[]
  }

  /**
   * Spot findMany
   */
  export type SpotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter, which Spots to fetch.
     */
    where?: SpotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Spots to fetch.
     */
    orderBy?: SpotOrderByWithRelationInput | SpotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Spots.
     */
    cursor?: SpotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Spots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Spots.
     */
    skip?: number
    distinct?: SpotScalarFieldEnum | SpotScalarFieldEnum[]
  }

  /**
   * Spot create
   */
  export type SpotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * The data needed to create a Spot.
     */
    data: XOR<SpotCreateInput, SpotUncheckedCreateInput>
  }

  /**
   * Spot createMany
   */
  export type SpotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Spots.
     */
    data: SpotCreateManyInput | SpotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Spot createManyAndReturn
   */
  export type SpotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * The data used to create many Spots.
     */
    data: SpotCreateManyInput | SpotCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Spot update
   */
  export type SpotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * The data needed to update a Spot.
     */
    data: XOR<SpotUpdateInput, SpotUncheckedUpdateInput>
    /**
     * Choose, which Spot to update.
     */
    where: SpotWhereUniqueInput
  }

  /**
   * Spot updateMany
   */
  export type SpotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Spots.
     */
    data: XOR<SpotUpdateManyMutationInput, SpotUncheckedUpdateManyInput>
    /**
     * Filter which Spots to update
     */
    where?: SpotWhereInput
    /**
     * Limit how many Spots to update.
     */
    limit?: number
  }

  /**
   * Spot updateManyAndReturn
   */
  export type SpotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * The data used to update Spots.
     */
    data: XOR<SpotUpdateManyMutationInput, SpotUncheckedUpdateManyInput>
    /**
     * Filter which Spots to update
     */
    where?: SpotWhereInput
    /**
     * Limit how many Spots to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Spot upsert
   */
  export type SpotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * The filter to search for the Spot to update in case it exists.
     */
    where: SpotWhereUniqueInput
    /**
     * In case the Spot found by the `where` argument doesn't exist, create a new Spot with this data.
     */
    create: XOR<SpotCreateInput, SpotUncheckedCreateInput>
    /**
     * In case the Spot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpotUpdateInput, SpotUncheckedUpdateInput>
  }

  /**
   * Spot delete
   */
  export type SpotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
    /**
     * Filter which Spot to delete.
     */
    where: SpotWhereUniqueInput
  }

  /**
   * Spot deleteMany
   */
  export type SpotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Spots to delete
     */
    where?: SpotWhereInput
    /**
     * Limit how many Spots to delete.
     */
    limit?: number
  }

  /**
   * Spot.reviews
   */
  export type Spot$reviewsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    where?: SpotReviewWhereInput
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    cursor?: SpotReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
  }

  /**
   * Spot without action
   */
  export type SpotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Spot
     */
    select?: SpotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Spot
     */
    omit?: SpotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotInclude<ExtArgs> | null
  }


  /**
   * Model SpotReview
   */

  export type AggregateSpotReview = {
    _count: SpotReviewCountAggregateOutputType | null
    _min: SpotReviewMinAggregateOutputType | null
    _max: SpotReviewMaxAggregateOutputType | null
  }

  export type SpotReviewMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    authorId: string | null
    spotId: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type SpotReviewMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    authorId: string | null
    spotId: string | null
    parentId: string | null
    createdAt: Date | null
  }

  export type SpotReviewCountAggregateOutputType = {
    id: number
    title: number
    description: number
    authorId: number
    spotId: number
    parentId: number
    createdAt: number
    _all: number
  }


  export type SpotReviewMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    spotId?: true
    parentId?: true
    createdAt?: true
  }

  export type SpotReviewMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    spotId?: true
    parentId?: true
    createdAt?: true
  }

  export type SpotReviewCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    spotId?: true
    parentId?: true
    createdAt?: true
    _all?: true
  }

  export type SpotReviewAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpotReview to aggregate.
     */
    where?: SpotReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpotReviews to fetch.
     */
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SpotReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpotReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpotReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SpotReviews
    **/
    _count?: true | SpotReviewCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SpotReviewMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SpotReviewMaxAggregateInputType
  }

  export type GetSpotReviewAggregateType<T extends SpotReviewAggregateArgs> = {
        [P in keyof T & keyof AggregateSpotReview]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSpotReview[P]>
      : GetScalarType<T[P], AggregateSpotReview[P]>
  }




  export type SpotReviewGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SpotReviewWhereInput
    orderBy?: SpotReviewOrderByWithAggregationInput | SpotReviewOrderByWithAggregationInput[]
    by: SpotReviewScalarFieldEnum[] | SpotReviewScalarFieldEnum
    having?: SpotReviewScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SpotReviewCountAggregateInputType | true
    _min?: SpotReviewMinAggregateInputType
    _max?: SpotReviewMaxAggregateInputType
  }

  export type SpotReviewGroupByOutputType = {
    id: string
    title: string
    description: string
    authorId: string
    spotId: string
    parentId: string | null
    createdAt: Date
    _count: SpotReviewCountAggregateOutputType | null
    _min: SpotReviewMinAggregateOutputType | null
    _max: SpotReviewMaxAggregateOutputType | null
  }

  type GetSpotReviewGroupByPayload<T extends SpotReviewGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SpotReviewGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SpotReviewGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SpotReviewGroupByOutputType[P]>
            : GetScalarType<T[P], SpotReviewGroupByOutputType[P]>
        }
      >
    >


  export type SpotReviewSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    spotId?: boolean
    parentId?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
    replies?: boolean | SpotReview$repliesArgs<ExtArgs>
    _count?: boolean | SpotReviewCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["spotReview"]>

  export type SpotReviewSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    spotId?: boolean
    parentId?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
  }, ExtArgs["result"]["spotReview"]>

  export type SpotReviewSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    spotId?: boolean
    parentId?: boolean
    createdAt?: boolean
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
  }, ExtArgs["result"]["spotReview"]>

  export type SpotReviewSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    spotId?: boolean
    parentId?: boolean
    createdAt?: boolean
  }

  export type SpotReviewOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "authorId" | "spotId" | "parentId" | "createdAt", ExtArgs["result"]["spotReview"]>
  export type SpotReviewInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
    replies?: boolean | SpotReview$repliesArgs<ExtArgs>
    _count?: boolean | SpotReviewCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SpotReviewIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
  }
  export type SpotReviewIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    author?: boolean | UserDefaultArgs<ExtArgs>
    spot?: boolean | SpotDefaultArgs<ExtArgs>
    parent?: boolean | SpotReview$parentArgs<ExtArgs>
  }

  export type $SpotReviewPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SpotReview"
    objects: {
      author: Prisma.$UserPayload<ExtArgs>
      spot: Prisma.$SpotPayload<ExtArgs>
      parent: Prisma.$SpotReviewPayload<ExtArgs> | null
      replies: Prisma.$SpotReviewPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string
      authorId: string
      spotId: string
      parentId: string | null
      createdAt: Date
    }, ExtArgs["result"]["spotReview"]>
    composites: {}
  }

  type SpotReviewGetPayload<S extends boolean | null | undefined | SpotReviewDefaultArgs> = $Result.GetResult<Prisma.$SpotReviewPayload, S>

  type SpotReviewCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SpotReviewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SpotReviewCountAggregateInputType | true
    }

  export interface SpotReviewDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SpotReview'], meta: { name: 'SpotReview' } }
    /**
     * Find zero or one SpotReview that matches the filter.
     * @param {SpotReviewFindUniqueArgs} args - Arguments to find a SpotReview
     * @example
     * // Get one SpotReview
     * const spotReview = await prisma.spotReview.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SpotReviewFindUniqueArgs>(args: SelectSubset<T, SpotReviewFindUniqueArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SpotReview that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SpotReviewFindUniqueOrThrowArgs} args - Arguments to find a SpotReview
     * @example
     * // Get one SpotReview
     * const spotReview = await prisma.spotReview.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SpotReviewFindUniqueOrThrowArgs>(args: SelectSubset<T, SpotReviewFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpotReview that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewFindFirstArgs} args - Arguments to find a SpotReview
     * @example
     * // Get one SpotReview
     * const spotReview = await prisma.spotReview.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SpotReviewFindFirstArgs>(args?: SelectSubset<T, SpotReviewFindFirstArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SpotReview that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewFindFirstOrThrowArgs} args - Arguments to find a SpotReview
     * @example
     * // Get one SpotReview
     * const spotReview = await prisma.spotReview.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SpotReviewFindFirstOrThrowArgs>(args?: SelectSubset<T, SpotReviewFindFirstOrThrowArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SpotReviews that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SpotReviews
     * const spotReviews = await prisma.spotReview.findMany()
     * 
     * // Get first 10 SpotReviews
     * const spotReviews = await prisma.spotReview.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const spotReviewWithIdOnly = await prisma.spotReview.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SpotReviewFindManyArgs>(args?: SelectSubset<T, SpotReviewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SpotReview.
     * @param {SpotReviewCreateArgs} args - Arguments to create a SpotReview.
     * @example
     * // Create one SpotReview
     * const SpotReview = await prisma.spotReview.create({
     *   data: {
     *     // ... data to create a SpotReview
     *   }
     * })
     * 
     */
    create<T extends SpotReviewCreateArgs>(args: SelectSubset<T, SpotReviewCreateArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SpotReviews.
     * @param {SpotReviewCreateManyArgs} args - Arguments to create many SpotReviews.
     * @example
     * // Create many SpotReviews
     * const spotReview = await prisma.spotReview.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SpotReviewCreateManyArgs>(args?: SelectSubset<T, SpotReviewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SpotReviews and returns the data saved in the database.
     * @param {SpotReviewCreateManyAndReturnArgs} args - Arguments to create many SpotReviews.
     * @example
     * // Create many SpotReviews
     * const spotReview = await prisma.spotReview.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SpotReviews and only return the `id`
     * const spotReviewWithIdOnly = await prisma.spotReview.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SpotReviewCreateManyAndReturnArgs>(args?: SelectSubset<T, SpotReviewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SpotReview.
     * @param {SpotReviewDeleteArgs} args - Arguments to delete one SpotReview.
     * @example
     * // Delete one SpotReview
     * const SpotReview = await prisma.spotReview.delete({
     *   where: {
     *     // ... filter to delete one SpotReview
     *   }
     * })
     * 
     */
    delete<T extends SpotReviewDeleteArgs>(args: SelectSubset<T, SpotReviewDeleteArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SpotReview.
     * @param {SpotReviewUpdateArgs} args - Arguments to update one SpotReview.
     * @example
     * // Update one SpotReview
     * const spotReview = await prisma.spotReview.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SpotReviewUpdateArgs>(args: SelectSubset<T, SpotReviewUpdateArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SpotReviews.
     * @param {SpotReviewDeleteManyArgs} args - Arguments to filter SpotReviews to delete.
     * @example
     * // Delete a few SpotReviews
     * const { count } = await prisma.spotReview.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SpotReviewDeleteManyArgs>(args?: SelectSubset<T, SpotReviewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpotReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SpotReviews
     * const spotReview = await prisma.spotReview.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SpotReviewUpdateManyArgs>(args: SelectSubset<T, SpotReviewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SpotReviews and returns the data updated in the database.
     * @param {SpotReviewUpdateManyAndReturnArgs} args - Arguments to update many SpotReviews.
     * @example
     * // Update many SpotReviews
     * const spotReview = await prisma.spotReview.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SpotReviews and only return the `id`
     * const spotReviewWithIdOnly = await prisma.spotReview.updateManyAndReturn({
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
    updateManyAndReturn<T extends SpotReviewUpdateManyAndReturnArgs>(args: SelectSubset<T, SpotReviewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SpotReview.
     * @param {SpotReviewUpsertArgs} args - Arguments to update or create a SpotReview.
     * @example
     * // Update or create a SpotReview
     * const spotReview = await prisma.spotReview.upsert({
     *   create: {
     *     // ... data to create a SpotReview
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SpotReview we want to update
     *   }
     * })
     */
    upsert<T extends SpotReviewUpsertArgs>(args: SelectSubset<T, SpotReviewUpsertArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SpotReviews.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewCountArgs} args - Arguments to filter SpotReviews to count.
     * @example
     * // Count the number of SpotReviews
     * const count = await prisma.spotReview.count({
     *   where: {
     *     // ... the filter for the SpotReviews we want to count
     *   }
     * })
    **/
    count<T extends SpotReviewCountArgs>(
      args?: Subset<T, SpotReviewCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SpotReviewCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SpotReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SpotReviewAggregateArgs>(args: Subset<T, SpotReviewAggregateArgs>): Prisma.PrismaPromise<GetSpotReviewAggregateType<T>>

    /**
     * Group by SpotReview.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SpotReviewGroupByArgs} args - Group by arguments.
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
      T extends SpotReviewGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SpotReviewGroupByArgs['orderBy'] }
        : { orderBy?: SpotReviewGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SpotReviewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSpotReviewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SpotReview model
   */
  readonly fields: SpotReviewFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SpotReview.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SpotReviewClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    author<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    spot<T extends SpotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SpotDefaultArgs<ExtArgs>>): Prisma__SpotClient<$Result.GetResult<Prisma.$SpotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    parent<T extends SpotReview$parentArgs<ExtArgs> = {}>(args?: Subset<T, SpotReview$parentArgs<ExtArgs>>): Prisma__SpotReviewClient<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    replies<T extends SpotReview$repliesArgs<ExtArgs> = {}>(args?: Subset<T, SpotReview$repliesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SpotReviewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the SpotReview model
   */
  interface SpotReviewFieldRefs {
    readonly id: FieldRef<"SpotReview", 'String'>
    readonly title: FieldRef<"SpotReview", 'String'>
    readonly description: FieldRef<"SpotReview", 'String'>
    readonly authorId: FieldRef<"SpotReview", 'String'>
    readonly spotId: FieldRef<"SpotReview", 'String'>
    readonly parentId: FieldRef<"SpotReview", 'String'>
    readonly createdAt: FieldRef<"SpotReview", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SpotReview findUnique
   */
  export type SpotReviewFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter, which SpotReview to fetch.
     */
    where: SpotReviewWhereUniqueInput
  }

  /**
   * SpotReview findUniqueOrThrow
   */
  export type SpotReviewFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter, which SpotReview to fetch.
     */
    where: SpotReviewWhereUniqueInput
  }

  /**
   * SpotReview findFirst
   */
  export type SpotReviewFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter, which SpotReview to fetch.
     */
    where?: SpotReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpotReviews to fetch.
     */
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpotReviews.
     */
    cursor?: SpotReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpotReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpotReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpotReviews.
     */
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
  }

  /**
   * SpotReview findFirstOrThrow
   */
  export type SpotReviewFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter, which SpotReview to fetch.
     */
    where?: SpotReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpotReviews to fetch.
     */
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SpotReviews.
     */
    cursor?: SpotReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpotReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpotReviews.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SpotReviews.
     */
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
  }

  /**
   * SpotReview findMany
   */
  export type SpotReviewFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter, which SpotReviews to fetch.
     */
    where?: SpotReviewWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SpotReviews to fetch.
     */
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SpotReviews.
     */
    cursor?: SpotReviewWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SpotReviews from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SpotReviews.
     */
    skip?: number
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
  }

  /**
   * SpotReview create
   */
  export type SpotReviewCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * The data needed to create a SpotReview.
     */
    data: XOR<SpotReviewCreateInput, SpotReviewUncheckedCreateInput>
  }

  /**
   * SpotReview createMany
   */
  export type SpotReviewCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SpotReviews.
     */
    data: SpotReviewCreateManyInput | SpotReviewCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SpotReview createManyAndReturn
   */
  export type SpotReviewCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * The data used to create many SpotReviews.
     */
    data: SpotReviewCreateManyInput | SpotReviewCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpotReview update
   */
  export type SpotReviewUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * The data needed to update a SpotReview.
     */
    data: XOR<SpotReviewUpdateInput, SpotReviewUncheckedUpdateInput>
    /**
     * Choose, which SpotReview to update.
     */
    where: SpotReviewWhereUniqueInput
  }

  /**
   * SpotReview updateMany
   */
  export type SpotReviewUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SpotReviews.
     */
    data: XOR<SpotReviewUpdateManyMutationInput, SpotReviewUncheckedUpdateManyInput>
    /**
     * Filter which SpotReviews to update
     */
    where?: SpotReviewWhereInput
    /**
     * Limit how many SpotReviews to update.
     */
    limit?: number
  }

  /**
   * SpotReview updateManyAndReturn
   */
  export type SpotReviewUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * The data used to update SpotReviews.
     */
    data: XOR<SpotReviewUpdateManyMutationInput, SpotReviewUncheckedUpdateManyInput>
    /**
     * Filter which SpotReviews to update
     */
    where?: SpotReviewWhereInput
    /**
     * Limit how many SpotReviews to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SpotReview upsert
   */
  export type SpotReviewUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * The filter to search for the SpotReview to update in case it exists.
     */
    where: SpotReviewWhereUniqueInput
    /**
     * In case the SpotReview found by the `where` argument doesn't exist, create a new SpotReview with this data.
     */
    create: XOR<SpotReviewCreateInput, SpotReviewUncheckedCreateInput>
    /**
     * In case the SpotReview was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SpotReviewUpdateInput, SpotReviewUncheckedUpdateInput>
  }

  /**
   * SpotReview delete
   */
  export type SpotReviewDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    /**
     * Filter which SpotReview to delete.
     */
    where: SpotReviewWhereUniqueInput
  }

  /**
   * SpotReview deleteMany
   */
  export type SpotReviewDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SpotReviews to delete
     */
    where?: SpotReviewWhereInput
    /**
     * Limit how many SpotReviews to delete.
     */
    limit?: number
  }

  /**
   * SpotReview.parent
   */
  export type SpotReview$parentArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    where?: SpotReviewWhereInput
  }

  /**
   * SpotReview.replies
   */
  export type SpotReview$repliesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
    where?: SpotReviewWhereInput
    orderBy?: SpotReviewOrderByWithRelationInput | SpotReviewOrderByWithRelationInput[]
    cursor?: SpotReviewWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SpotReviewScalarFieldEnum | SpotReviewScalarFieldEnum[]
  }

  /**
   * SpotReview without action
   */
  export type SpotReviewDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SpotReview
     */
    select?: SpotReviewSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SpotReview
     */
    omit?: SpotReviewOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SpotReviewInclude<ExtArgs> | null
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
    email: 'email',
    name: 'name',
    password: 'password'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const SpotScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    authorId: 'authorId',
    modality: 'modality',
    equipmentRequired: 'equipmentRequired',
    isPaid: 'isPaid',
    alwaysOpen: 'alwaysOpen',
    entryAmount: 'entryAmount',
    openingHours: 'openingHours',
    hasCoverage: 'hasCoverage',
    coordinates: 'coordinates',
    images: 'images',
    createdAt: 'createdAt'
  };

  export type SpotScalarFieldEnum = (typeof SpotScalarFieldEnum)[keyof typeof SpotScalarFieldEnum]


  export const SpotReviewScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    authorId: 'authorId',
    spotId: 'spotId',
    parentId: 'parentId',
    createdAt: 'createdAt'
  };

  export type SpotReviewScalarFieldEnum = (typeof SpotReviewScalarFieldEnum)[keyof typeof SpotReviewScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


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
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    spot?: SpotListRelationFilter
    reviews?: SpotReviewListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    spot?: SpotOrderByRelationAggregateInput
    reviews?: SpotReviewOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    spot?: SpotListRelationFilter
    reviews?: SpotReviewListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
  }

  export type SpotWhereInput = {
    AND?: SpotWhereInput | SpotWhereInput[]
    OR?: SpotWhereInput[]
    NOT?: SpotWhereInput | SpotWhereInput[]
    id?: StringFilter<"Spot"> | string
    name?: StringFilter<"Spot"> | string
    description?: StringFilter<"Spot"> | string
    authorId?: StringFilter<"Spot"> | string
    modality?: StringFilter<"Spot"> | string
    equipmentRequired?: BoolFilter<"Spot"> | boolean
    isPaid?: BoolFilter<"Spot"> | boolean
    alwaysOpen?: BoolFilter<"Spot"> | boolean
    entryAmount?: StringNullableFilter<"Spot"> | string | null
    openingHours?: StringNullableFilter<"Spot"> | string | null
    hasCoverage?: BoolFilter<"Spot"> | boolean
    coordinates?: JsonFilter<"Spot">
    images?: StringNullableListFilter<"Spot">
    createdAt?: DateTimeFilter<"Spot"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviews?: SpotReviewListRelationFilter
  }

  export type SpotOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    modality?: SortOrder
    equipmentRequired?: SortOrder
    isPaid?: SortOrder
    alwaysOpen?: SortOrder
    entryAmount?: SortOrderInput | SortOrder
    openingHours?: SortOrderInput | SortOrder
    hasCoverage?: SortOrder
    coordinates?: SortOrder
    images?: SortOrder
    createdAt?: SortOrder
    author?: UserOrderByWithRelationInput
    reviews?: SpotReviewOrderByRelationAggregateInput
  }

  export type SpotWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SpotWhereInput | SpotWhereInput[]
    OR?: SpotWhereInput[]
    NOT?: SpotWhereInput | SpotWhereInput[]
    name?: StringFilter<"Spot"> | string
    description?: StringFilter<"Spot"> | string
    authorId?: StringFilter<"Spot"> | string
    modality?: StringFilter<"Spot"> | string
    equipmentRequired?: BoolFilter<"Spot"> | boolean
    isPaid?: BoolFilter<"Spot"> | boolean
    alwaysOpen?: BoolFilter<"Spot"> | boolean
    entryAmount?: StringNullableFilter<"Spot"> | string | null
    openingHours?: StringNullableFilter<"Spot"> | string | null
    hasCoverage?: BoolFilter<"Spot"> | boolean
    coordinates?: JsonFilter<"Spot">
    images?: StringNullableListFilter<"Spot">
    createdAt?: DateTimeFilter<"Spot"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    reviews?: SpotReviewListRelationFilter
  }, "id">

  export type SpotOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    modality?: SortOrder
    equipmentRequired?: SortOrder
    isPaid?: SortOrder
    alwaysOpen?: SortOrder
    entryAmount?: SortOrderInput | SortOrder
    openingHours?: SortOrderInput | SortOrder
    hasCoverage?: SortOrder
    coordinates?: SortOrder
    images?: SortOrder
    createdAt?: SortOrder
    _count?: SpotCountOrderByAggregateInput
    _max?: SpotMaxOrderByAggregateInput
    _min?: SpotMinOrderByAggregateInput
  }

  export type SpotScalarWhereWithAggregatesInput = {
    AND?: SpotScalarWhereWithAggregatesInput | SpotScalarWhereWithAggregatesInput[]
    OR?: SpotScalarWhereWithAggregatesInput[]
    NOT?: SpotScalarWhereWithAggregatesInput | SpotScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Spot"> | string
    name?: StringWithAggregatesFilter<"Spot"> | string
    description?: StringWithAggregatesFilter<"Spot"> | string
    authorId?: StringWithAggregatesFilter<"Spot"> | string
    modality?: StringWithAggregatesFilter<"Spot"> | string
    equipmentRequired?: BoolWithAggregatesFilter<"Spot"> | boolean
    isPaid?: BoolWithAggregatesFilter<"Spot"> | boolean
    alwaysOpen?: BoolWithAggregatesFilter<"Spot"> | boolean
    entryAmount?: StringNullableWithAggregatesFilter<"Spot"> | string | null
    openingHours?: StringNullableWithAggregatesFilter<"Spot"> | string | null
    hasCoverage?: BoolWithAggregatesFilter<"Spot"> | boolean
    coordinates?: JsonWithAggregatesFilter<"Spot">
    images?: StringNullableListFilter<"Spot">
    createdAt?: DateTimeWithAggregatesFilter<"Spot"> | Date | string
  }

  export type SpotReviewWhereInput = {
    AND?: SpotReviewWhereInput | SpotReviewWhereInput[]
    OR?: SpotReviewWhereInput[]
    NOT?: SpotReviewWhereInput | SpotReviewWhereInput[]
    id?: StringFilter<"SpotReview"> | string
    title?: StringFilter<"SpotReview"> | string
    description?: StringFilter<"SpotReview"> | string
    authorId?: StringFilter<"SpotReview"> | string
    spotId?: StringFilter<"SpotReview"> | string
    parentId?: StringNullableFilter<"SpotReview"> | string | null
    createdAt?: DateTimeFilter<"SpotReview"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    spot?: XOR<SpotScalarRelationFilter, SpotWhereInput>
    parent?: XOR<SpotReviewNullableScalarRelationFilter, SpotReviewWhereInput> | null
    replies?: SpotReviewListRelationFilter
  }

  export type SpotReviewOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    spotId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    author?: UserOrderByWithRelationInput
    spot?: SpotOrderByWithRelationInput
    parent?: SpotReviewOrderByWithRelationInput
    replies?: SpotReviewOrderByRelationAggregateInput
  }

  export type SpotReviewWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SpotReviewWhereInput | SpotReviewWhereInput[]
    OR?: SpotReviewWhereInput[]
    NOT?: SpotReviewWhereInput | SpotReviewWhereInput[]
    title?: StringFilter<"SpotReview"> | string
    description?: StringFilter<"SpotReview"> | string
    authorId?: StringFilter<"SpotReview"> | string
    spotId?: StringFilter<"SpotReview"> | string
    parentId?: StringNullableFilter<"SpotReview"> | string | null
    createdAt?: DateTimeFilter<"SpotReview"> | Date | string
    author?: XOR<UserScalarRelationFilter, UserWhereInput>
    spot?: XOR<SpotScalarRelationFilter, SpotWhereInput>
    parent?: XOR<SpotReviewNullableScalarRelationFilter, SpotReviewWhereInput> | null
    replies?: SpotReviewListRelationFilter
  }, "id">

  export type SpotReviewOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    spotId?: SortOrder
    parentId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: SpotReviewCountOrderByAggregateInput
    _max?: SpotReviewMaxOrderByAggregateInput
    _min?: SpotReviewMinOrderByAggregateInput
  }

  export type SpotReviewScalarWhereWithAggregatesInput = {
    AND?: SpotReviewScalarWhereWithAggregatesInput | SpotReviewScalarWhereWithAggregatesInput[]
    OR?: SpotReviewScalarWhereWithAggregatesInput[]
    NOT?: SpotReviewScalarWhereWithAggregatesInput | SpotReviewScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SpotReview"> | string
    title?: StringWithAggregatesFilter<"SpotReview"> | string
    description?: StringWithAggregatesFilter<"SpotReview"> | string
    authorId?: StringWithAggregatesFilter<"SpotReview"> | string
    spotId?: StringWithAggregatesFilter<"SpotReview"> | string
    parentId?: StringNullableWithAggregatesFilter<"SpotReview"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SpotReview"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name: string
    password: string
    spot?: SpotCreateNestedManyWithoutAuthorInput
    reviews?: SpotReviewCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name: string
    password: string
    spot?: SpotUncheckedCreateNestedManyWithoutAuthorInput
    reviews?: SpotReviewUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    spot?: SpotUpdateManyWithoutAuthorNestedInput
    reviews?: SpotReviewUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    spot?: SpotUncheckedUpdateManyWithoutAuthorNestedInput
    reviews?: SpotReviewUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name: string
    password: string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
  }

  export type SpotCreateInput = {
    id?: string
    name: string
    description: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutSpotInput
    reviews?: SpotReviewCreateNestedManyWithoutSpotInput
  }

  export type SpotUncheckedCreateInput = {
    id?: string
    name: string
    description: string
    authorId: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
    reviews?: SpotReviewUncheckedCreateNestedManyWithoutSpotInput
  }

  export type SpotUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutSpotNestedInput
    reviews?: SpotReviewUpdateManyWithoutSpotNestedInput
  }

  export type SpotUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: SpotReviewUncheckedUpdateManyWithoutSpotNestedInput
  }

  export type SpotCreateManyInput = {
    id?: string
    name: string
    description: string
    authorId: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
  }

  export type SpotUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewCreateInput = {
    id?: string
    title: string
    description: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutReviewsInput
    spot: SpotCreateNestedOneWithoutReviewsInput
    parent?: SpotReviewCreateNestedOneWithoutRepliesInput
    replies?: SpotReviewCreateNestedManyWithoutParentInput
  }

  export type SpotReviewUncheckedCreateInput = {
    id?: string
    title: string
    description: string
    authorId: string
    spotId: string
    parentId?: string | null
    createdAt?: Date | string
    replies?: SpotReviewUncheckedCreateNestedManyWithoutParentInput
  }

  export type SpotReviewUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutReviewsNestedInput
    spot?: SpotUpdateOneRequiredWithoutReviewsNestedInput
    parent?: SpotReviewUpdateOneWithoutRepliesNestedInput
    replies?: SpotReviewUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: SpotReviewUncheckedUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewCreateManyInput = {
    id?: string
    title: string
    description: string
    authorId: string
    spotId: string
    parentId?: string | null
    createdAt?: Date | string
  }

  export type SpotReviewUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type SpotListRelationFilter = {
    every?: SpotWhereInput
    some?: SpotWhereInput
    none?: SpotWhereInput
  }

  export type SpotReviewListRelationFilter = {
    every?: SpotReviewWhereInput
    some?: SpotReviewWhereInput
    none?: SpotReviewWhereInput
  }

  export type SpotOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SpotReviewOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    password?: SortOrder
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

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
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
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
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

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SpotCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    modality?: SortOrder
    equipmentRequired?: SortOrder
    isPaid?: SortOrder
    alwaysOpen?: SortOrder
    entryAmount?: SortOrder
    openingHours?: SortOrder
    hasCoverage?: SortOrder
    coordinates?: SortOrder
    images?: SortOrder
    createdAt?: SortOrder
  }

  export type SpotMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    modality?: SortOrder
    equipmentRequired?: SortOrder
    isPaid?: SortOrder
    alwaysOpen?: SortOrder
    entryAmount?: SortOrder
    openingHours?: SortOrder
    hasCoverage?: SortOrder
    createdAt?: SortOrder
  }

  export type SpotMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    modality?: SortOrder
    equipmentRequired?: SortOrder
    isPaid?: SortOrder
    alwaysOpen?: SortOrder
    entryAmount?: SortOrder
    openingHours?: SortOrder
    hasCoverage?: SortOrder
    createdAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
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
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
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

  export type SpotScalarRelationFilter = {
    is?: SpotWhereInput
    isNot?: SpotWhereInput
  }

  export type SpotReviewNullableScalarRelationFilter = {
    is?: SpotReviewWhereInput | null
    isNot?: SpotReviewWhereInput | null
  }

  export type SpotReviewCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    spotId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type SpotReviewMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    spotId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type SpotReviewMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    spotId?: SortOrder
    parentId?: SortOrder
    createdAt?: SortOrder
  }

  export type SpotCreateNestedManyWithoutAuthorInput = {
    create?: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput> | SpotCreateWithoutAuthorInput[] | SpotUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotCreateOrConnectWithoutAuthorInput | SpotCreateOrConnectWithoutAuthorInput[]
    createMany?: SpotCreateManyAuthorInputEnvelope
    connect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
  }

  export type SpotReviewCreateNestedManyWithoutAuthorInput = {
    create?: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput> | SpotReviewCreateWithoutAuthorInput[] | SpotReviewUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutAuthorInput | SpotReviewCreateOrConnectWithoutAuthorInput[]
    createMany?: SpotReviewCreateManyAuthorInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type SpotUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput> | SpotCreateWithoutAuthorInput[] | SpotUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotCreateOrConnectWithoutAuthorInput | SpotCreateOrConnectWithoutAuthorInput[]
    createMany?: SpotCreateManyAuthorInputEnvelope
    connect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
  }

  export type SpotReviewUncheckedCreateNestedManyWithoutAuthorInput = {
    create?: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput> | SpotReviewCreateWithoutAuthorInput[] | SpotReviewUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutAuthorInput | SpotReviewCreateOrConnectWithoutAuthorInput[]
    createMany?: SpotReviewCreateManyAuthorInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type SpotUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput> | SpotCreateWithoutAuthorInput[] | SpotUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotCreateOrConnectWithoutAuthorInput | SpotCreateOrConnectWithoutAuthorInput[]
    upsert?: SpotUpsertWithWhereUniqueWithoutAuthorInput | SpotUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: SpotCreateManyAuthorInputEnvelope
    set?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    disconnect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    delete?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    connect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    update?: SpotUpdateWithWhereUniqueWithoutAuthorInput | SpotUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: SpotUpdateManyWithWhereWithoutAuthorInput | SpotUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: SpotScalarWhereInput | SpotScalarWhereInput[]
  }

  export type SpotReviewUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput> | SpotReviewCreateWithoutAuthorInput[] | SpotReviewUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutAuthorInput | SpotReviewCreateOrConnectWithoutAuthorInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutAuthorInput | SpotReviewUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: SpotReviewCreateManyAuthorInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutAuthorInput | SpotReviewUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutAuthorInput | SpotReviewUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
  }

  export type SpotUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput> | SpotCreateWithoutAuthorInput[] | SpotUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotCreateOrConnectWithoutAuthorInput | SpotCreateOrConnectWithoutAuthorInput[]
    upsert?: SpotUpsertWithWhereUniqueWithoutAuthorInput | SpotUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: SpotCreateManyAuthorInputEnvelope
    set?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    disconnect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    delete?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    connect?: SpotWhereUniqueInput | SpotWhereUniqueInput[]
    update?: SpotUpdateWithWhereUniqueWithoutAuthorInput | SpotUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: SpotUpdateManyWithWhereWithoutAuthorInput | SpotUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: SpotScalarWhereInput | SpotScalarWhereInput[]
  }

  export type SpotReviewUncheckedUpdateManyWithoutAuthorNestedInput = {
    create?: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput> | SpotReviewCreateWithoutAuthorInput[] | SpotReviewUncheckedCreateWithoutAuthorInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutAuthorInput | SpotReviewCreateOrConnectWithoutAuthorInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutAuthorInput | SpotReviewUpsertWithWhereUniqueWithoutAuthorInput[]
    createMany?: SpotReviewCreateManyAuthorInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutAuthorInput | SpotReviewUpdateWithWhereUniqueWithoutAuthorInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutAuthorInput | SpotReviewUpdateManyWithWhereWithoutAuthorInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
  }

  export type SpotCreateimagesInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutSpotInput = {
    create?: XOR<UserCreateWithoutSpotInput, UserUncheckedCreateWithoutSpotInput>
    connectOrCreate?: UserCreateOrConnectWithoutSpotInput
    connect?: UserWhereUniqueInput
  }

  export type SpotReviewCreateNestedManyWithoutSpotInput = {
    create?: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput> | SpotReviewCreateWithoutSpotInput[] | SpotReviewUncheckedCreateWithoutSpotInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutSpotInput | SpotReviewCreateOrConnectWithoutSpotInput[]
    createMany?: SpotReviewCreateManySpotInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type SpotReviewUncheckedCreateNestedManyWithoutSpotInput = {
    create?: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput> | SpotReviewCreateWithoutSpotInput[] | SpotReviewUncheckedCreateWithoutSpotInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutSpotInput | SpotReviewCreateOrConnectWithoutSpotInput[]
    createMany?: SpotReviewCreateManySpotInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type SpotUpdateimagesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserUpdateOneRequiredWithoutSpotNestedInput = {
    create?: XOR<UserCreateWithoutSpotInput, UserUncheckedCreateWithoutSpotInput>
    connectOrCreate?: UserCreateOrConnectWithoutSpotInput
    upsert?: UserUpsertWithoutSpotInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSpotInput, UserUpdateWithoutSpotInput>, UserUncheckedUpdateWithoutSpotInput>
  }

  export type SpotReviewUpdateManyWithoutSpotNestedInput = {
    create?: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput> | SpotReviewCreateWithoutSpotInput[] | SpotReviewUncheckedCreateWithoutSpotInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutSpotInput | SpotReviewCreateOrConnectWithoutSpotInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutSpotInput | SpotReviewUpsertWithWhereUniqueWithoutSpotInput[]
    createMany?: SpotReviewCreateManySpotInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutSpotInput | SpotReviewUpdateWithWhereUniqueWithoutSpotInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutSpotInput | SpotReviewUpdateManyWithWhereWithoutSpotInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
  }

  export type SpotReviewUncheckedUpdateManyWithoutSpotNestedInput = {
    create?: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput> | SpotReviewCreateWithoutSpotInput[] | SpotReviewUncheckedCreateWithoutSpotInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutSpotInput | SpotReviewCreateOrConnectWithoutSpotInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutSpotInput | SpotReviewUpsertWithWhereUniqueWithoutSpotInput[]
    createMany?: SpotReviewCreateManySpotInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutSpotInput | SpotReviewUpdateWithWhereUniqueWithoutSpotInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutSpotInput | SpotReviewUpdateManyWithWhereWithoutSpotInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutReviewsInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    connect?: UserWhereUniqueInput
  }

  export type SpotCreateNestedOneWithoutReviewsInput = {
    create?: XOR<SpotCreateWithoutReviewsInput, SpotUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: SpotCreateOrConnectWithoutReviewsInput
    connect?: SpotWhereUniqueInput
  }

  export type SpotReviewCreateNestedOneWithoutRepliesInput = {
    create?: XOR<SpotReviewCreateWithoutRepliesInput, SpotReviewUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: SpotReviewCreateOrConnectWithoutRepliesInput
    connect?: SpotReviewWhereUniqueInput
  }

  export type SpotReviewCreateNestedManyWithoutParentInput = {
    create?: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput> | SpotReviewCreateWithoutParentInput[] | SpotReviewUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutParentInput | SpotReviewCreateOrConnectWithoutParentInput[]
    createMany?: SpotReviewCreateManyParentInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type SpotReviewUncheckedCreateNestedManyWithoutParentInput = {
    create?: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput> | SpotReviewCreateWithoutParentInput[] | SpotReviewUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutParentInput | SpotReviewCreateOrConnectWithoutParentInput[]
    createMany?: SpotReviewCreateManyParentInputEnvelope
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: UserCreateOrConnectWithoutReviewsInput
    upsert?: UserUpsertWithoutReviewsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutReviewsInput, UserUpdateWithoutReviewsInput>, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type SpotUpdateOneRequiredWithoutReviewsNestedInput = {
    create?: XOR<SpotCreateWithoutReviewsInput, SpotUncheckedCreateWithoutReviewsInput>
    connectOrCreate?: SpotCreateOrConnectWithoutReviewsInput
    upsert?: SpotUpsertWithoutReviewsInput
    connect?: SpotWhereUniqueInput
    update?: XOR<XOR<SpotUpdateToOneWithWhereWithoutReviewsInput, SpotUpdateWithoutReviewsInput>, SpotUncheckedUpdateWithoutReviewsInput>
  }

  export type SpotReviewUpdateOneWithoutRepliesNestedInput = {
    create?: XOR<SpotReviewCreateWithoutRepliesInput, SpotReviewUncheckedCreateWithoutRepliesInput>
    connectOrCreate?: SpotReviewCreateOrConnectWithoutRepliesInput
    upsert?: SpotReviewUpsertWithoutRepliesInput
    disconnect?: SpotReviewWhereInput | boolean
    delete?: SpotReviewWhereInput | boolean
    connect?: SpotReviewWhereUniqueInput
    update?: XOR<XOR<SpotReviewUpdateToOneWithWhereWithoutRepliesInput, SpotReviewUpdateWithoutRepliesInput>, SpotReviewUncheckedUpdateWithoutRepliesInput>
  }

  export type SpotReviewUpdateManyWithoutParentNestedInput = {
    create?: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput> | SpotReviewCreateWithoutParentInput[] | SpotReviewUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutParentInput | SpotReviewCreateOrConnectWithoutParentInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutParentInput | SpotReviewUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: SpotReviewCreateManyParentInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutParentInput | SpotReviewUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutParentInput | SpotReviewUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
  }

  export type SpotReviewUncheckedUpdateManyWithoutParentNestedInput = {
    create?: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput> | SpotReviewCreateWithoutParentInput[] | SpotReviewUncheckedCreateWithoutParentInput[]
    connectOrCreate?: SpotReviewCreateOrConnectWithoutParentInput | SpotReviewCreateOrConnectWithoutParentInput[]
    upsert?: SpotReviewUpsertWithWhereUniqueWithoutParentInput | SpotReviewUpsertWithWhereUniqueWithoutParentInput[]
    createMany?: SpotReviewCreateManyParentInputEnvelope
    set?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    disconnect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    delete?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    connect?: SpotReviewWhereUniqueInput | SpotReviewWhereUniqueInput[]
    update?: SpotReviewUpdateWithWhereUniqueWithoutParentInput | SpotReviewUpdateWithWhereUniqueWithoutParentInput[]
    updateMany?: SpotReviewUpdateManyWithWhereWithoutParentInput | SpotReviewUpdateManyWithWhereWithoutParentInput[]
    deleteMany?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
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

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
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

  export type SpotCreateWithoutAuthorInput = {
    id?: string
    name: string
    description: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
    reviews?: SpotReviewCreateNestedManyWithoutSpotInput
  }

  export type SpotUncheckedCreateWithoutAuthorInput = {
    id?: string
    name: string
    description: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
    reviews?: SpotReviewUncheckedCreateNestedManyWithoutSpotInput
  }

  export type SpotCreateOrConnectWithoutAuthorInput = {
    where: SpotWhereUniqueInput
    create: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput>
  }

  export type SpotCreateManyAuthorInputEnvelope = {
    data: SpotCreateManyAuthorInput | SpotCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type SpotReviewCreateWithoutAuthorInput = {
    id?: string
    title: string
    description: string
    createdAt?: Date | string
    spot: SpotCreateNestedOneWithoutReviewsInput
    parent?: SpotReviewCreateNestedOneWithoutRepliesInput
    replies?: SpotReviewCreateNestedManyWithoutParentInput
  }

  export type SpotReviewUncheckedCreateWithoutAuthorInput = {
    id?: string
    title: string
    description: string
    spotId: string
    parentId?: string | null
    createdAt?: Date | string
    replies?: SpotReviewUncheckedCreateNestedManyWithoutParentInput
  }

  export type SpotReviewCreateOrConnectWithoutAuthorInput = {
    where: SpotReviewWhereUniqueInput
    create: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput>
  }

  export type SpotReviewCreateManyAuthorInputEnvelope = {
    data: SpotReviewCreateManyAuthorInput | SpotReviewCreateManyAuthorInput[]
    skipDuplicates?: boolean
  }

  export type SpotUpsertWithWhereUniqueWithoutAuthorInput = {
    where: SpotWhereUniqueInput
    update: XOR<SpotUpdateWithoutAuthorInput, SpotUncheckedUpdateWithoutAuthorInput>
    create: XOR<SpotCreateWithoutAuthorInput, SpotUncheckedCreateWithoutAuthorInput>
  }

  export type SpotUpdateWithWhereUniqueWithoutAuthorInput = {
    where: SpotWhereUniqueInput
    data: XOR<SpotUpdateWithoutAuthorInput, SpotUncheckedUpdateWithoutAuthorInput>
  }

  export type SpotUpdateManyWithWhereWithoutAuthorInput = {
    where: SpotScalarWhereInput
    data: XOR<SpotUpdateManyMutationInput, SpotUncheckedUpdateManyWithoutAuthorInput>
  }

  export type SpotScalarWhereInput = {
    AND?: SpotScalarWhereInput | SpotScalarWhereInput[]
    OR?: SpotScalarWhereInput[]
    NOT?: SpotScalarWhereInput | SpotScalarWhereInput[]
    id?: StringFilter<"Spot"> | string
    name?: StringFilter<"Spot"> | string
    description?: StringFilter<"Spot"> | string
    authorId?: StringFilter<"Spot"> | string
    modality?: StringFilter<"Spot"> | string
    equipmentRequired?: BoolFilter<"Spot"> | boolean
    isPaid?: BoolFilter<"Spot"> | boolean
    alwaysOpen?: BoolFilter<"Spot"> | boolean
    entryAmount?: StringNullableFilter<"Spot"> | string | null
    openingHours?: StringNullableFilter<"Spot"> | string | null
    hasCoverage?: BoolFilter<"Spot"> | boolean
    coordinates?: JsonFilter<"Spot">
    images?: StringNullableListFilter<"Spot">
    createdAt?: DateTimeFilter<"Spot"> | Date | string
  }

  export type SpotReviewUpsertWithWhereUniqueWithoutAuthorInput = {
    where: SpotReviewWhereUniqueInput
    update: XOR<SpotReviewUpdateWithoutAuthorInput, SpotReviewUncheckedUpdateWithoutAuthorInput>
    create: XOR<SpotReviewCreateWithoutAuthorInput, SpotReviewUncheckedCreateWithoutAuthorInput>
  }

  export type SpotReviewUpdateWithWhereUniqueWithoutAuthorInput = {
    where: SpotReviewWhereUniqueInput
    data: XOR<SpotReviewUpdateWithoutAuthorInput, SpotReviewUncheckedUpdateWithoutAuthorInput>
  }

  export type SpotReviewUpdateManyWithWhereWithoutAuthorInput = {
    where: SpotReviewScalarWhereInput
    data: XOR<SpotReviewUpdateManyMutationInput, SpotReviewUncheckedUpdateManyWithoutAuthorInput>
  }

  export type SpotReviewScalarWhereInput = {
    AND?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
    OR?: SpotReviewScalarWhereInput[]
    NOT?: SpotReviewScalarWhereInput | SpotReviewScalarWhereInput[]
    id?: StringFilter<"SpotReview"> | string
    title?: StringFilter<"SpotReview"> | string
    description?: StringFilter<"SpotReview"> | string
    authorId?: StringFilter<"SpotReview"> | string
    spotId?: StringFilter<"SpotReview"> | string
    parentId?: StringNullableFilter<"SpotReview"> | string | null
    createdAt?: DateTimeFilter<"SpotReview"> | Date | string
  }

  export type UserCreateWithoutSpotInput = {
    id?: string
    email: string
    name: string
    password: string
    reviews?: SpotReviewCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutSpotInput = {
    id?: string
    email: string
    name: string
    password: string
    reviews?: SpotReviewUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutSpotInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSpotInput, UserUncheckedCreateWithoutSpotInput>
  }

  export type SpotReviewCreateWithoutSpotInput = {
    id?: string
    title: string
    description: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutReviewsInput
    parent?: SpotReviewCreateNestedOneWithoutRepliesInput
    replies?: SpotReviewCreateNestedManyWithoutParentInput
  }

  export type SpotReviewUncheckedCreateWithoutSpotInput = {
    id?: string
    title: string
    description: string
    authorId: string
    parentId?: string | null
    createdAt?: Date | string
    replies?: SpotReviewUncheckedCreateNestedManyWithoutParentInput
  }

  export type SpotReviewCreateOrConnectWithoutSpotInput = {
    where: SpotReviewWhereUniqueInput
    create: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput>
  }

  export type SpotReviewCreateManySpotInputEnvelope = {
    data: SpotReviewCreateManySpotInput | SpotReviewCreateManySpotInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutSpotInput = {
    update: XOR<UserUpdateWithoutSpotInput, UserUncheckedUpdateWithoutSpotInput>
    create: XOR<UserCreateWithoutSpotInput, UserUncheckedCreateWithoutSpotInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSpotInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSpotInput, UserUncheckedUpdateWithoutSpotInput>
  }

  export type UserUpdateWithoutSpotInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    reviews?: SpotReviewUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutSpotInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    reviews?: SpotReviewUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type SpotReviewUpsertWithWhereUniqueWithoutSpotInput = {
    where: SpotReviewWhereUniqueInput
    update: XOR<SpotReviewUpdateWithoutSpotInput, SpotReviewUncheckedUpdateWithoutSpotInput>
    create: XOR<SpotReviewCreateWithoutSpotInput, SpotReviewUncheckedCreateWithoutSpotInput>
  }

  export type SpotReviewUpdateWithWhereUniqueWithoutSpotInput = {
    where: SpotReviewWhereUniqueInput
    data: XOR<SpotReviewUpdateWithoutSpotInput, SpotReviewUncheckedUpdateWithoutSpotInput>
  }

  export type SpotReviewUpdateManyWithWhereWithoutSpotInput = {
    where: SpotReviewScalarWhereInput
    data: XOR<SpotReviewUpdateManyMutationInput, SpotReviewUncheckedUpdateManyWithoutSpotInput>
  }

  export type UserCreateWithoutReviewsInput = {
    id?: string
    email: string
    name: string
    password: string
    spot?: SpotCreateNestedManyWithoutAuthorInput
  }

  export type UserUncheckedCreateWithoutReviewsInput = {
    id?: string
    email: string
    name: string
    password: string
    spot?: SpotUncheckedCreateNestedManyWithoutAuthorInput
  }

  export type UserCreateOrConnectWithoutReviewsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
  }

  export type SpotCreateWithoutReviewsInput = {
    id?: string
    name: string
    description: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutSpotInput
  }

  export type SpotUncheckedCreateWithoutReviewsInput = {
    id?: string
    name: string
    description: string
    authorId: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
  }

  export type SpotCreateOrConnectWithoutReviewsInput = {
    where: SpotWhereUniqueInput
    create: XOR<SpotCreateWithoutReviewsInput, SpotUncheckedCreateWithoutReviewsInput>
  }

  export type SpotReviewCreateWithoutRepliesInput = {
    id?: string
    title: string
    description: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutReviewsInput
    spot: SpotCreateNestedOneWithoutReviewsInput
    parent?: SpotReviewCreateNestedOneWithoutRepliesInput
  }

  export type SpotReviewUncheckedCreateWithoutRepliesInput = {
    id?: string
    title: string
    description: string
    authorId: string
    spotId: string
    parentId?: string | null
    createdAt?: Date | string
  }

  export type SpotReviewCreateOrConnectWithoutRepliesInput = {
    where: SpotReviewWhereUniqueInput
    create: XOR<SpotReviewCreateWithoutRepliesInput, SpotReviewUncheckedCreateWithoutRepliesInput>
  }

  export type SpotReviewCreateWithoutParentInput = {
    id?: string
    title: string
    description: string
    createdAt?: Date | string
    author: UserCreateNestedOneWithoutReviewsInput
    spot: SpotCreateNestedOneWithoutReviewsInput
    replies?: SpotReviewCreateNestedManyWithoutParentInput
  }

  export type SpotReviewUncheckedCreateWithoutParentInput = {
    id?: string
    title: string
    description: string
    authorId: string
    spotId: string
    createdAt?: Date | string
    replies?: SpotReviewUncheckedCreateNestedManyWithoutParentInput
  }

  export type SpotReviewCreateOrConnectWithoutParentInput = {
    where: SpotReviewWhereUniqueInput
    create: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput>
  }

  export type SpotReviewCreateManyParentInputEnvelope = {
    data: SpotReviewCreateManyParentInput | SpotReviewCreateManyParentInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutReviewsInput = {
    update: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
    create: XOR<UserCreateWithoutReviewsInput, UserUncheckedCreateWithoutReviewsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutReviewsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutReviewsInput, UserUncheckedUpdateWithoutReviewsInput>
  }

  export type UserUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    spot?: SpotUpdateManyWithoutAuthorNestedInput
  }

  export type UserUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    spot?: SpotUncheckedUpdateManyWithoutAuthorNestedInput
  }

  export type SpotUpsertWithoutReviewsInput = {
    update: XOR<SpotUpdateWithoutReviewsInput, SpotUncheckedUpdateWithoutReviewsInput>
    create: XOR<SpotCreateWithoutReviewsInput, SpotUncheckedCreateWithoutReviewsInput>
    where?: SpotWhereInput
  }

  export type SpotUpdateToOneWithWhereWithoutReviewsInput = {
    where?: SpotWhereInput
    data: XOR<SpotUpdateWithoutReviewsInput, SpotUncheckedUpdateWithoutReviewsInput>
  }

  export type SpotUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutSpotNestedInput
  }

  export type SpotUncheckedUpdateWithoutReviewsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewUpsertWithoutRepliesInput = {
    update: XOR<SpotReviewUpdateWithoutRepliesInput, SpotReviewUncheckedUpdateWithoutRepliesInput>
    create: XOR<SpotReviewCreateWithoutRepliesInput, SpotReviewUncheckedCreateWithoutRepliesInput>
    where?: SpotReviewWhereInput
  }

  export type SpotReviewUpdateToOneWithWhereWithoutRepliesInput = {
    where?: SpotReviewWhereInput
    data: XOR<SpotReviewUpdateWithoutRepliesInput, SpotReviewUncheckedUpdateWithoutRepliesInput>
  }

  export type SpotReviewUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutReviewsNestedInput
    spot?: SpotUpdateOneRequiredWithoutReviewsNestedInput
    parent?: SpotReviewUpdateOneWithoutRepliesNestedInput
  }

  export type SpotReviewUncheckedUpdateWithoutRepliesInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewUpsertWithWhereUniqueWithoutParentInput = {
    where: SpotReviewWhereUniqueInput
    update: XOR<SpotReviewUpdateWithoutParentInput, SpotReviewUncheckedUpdateWithoutParentInput>
    create: XOR<SpotReviewCreateWithoutParentInput, SpotReviewUncheckedCreateWithoutParentInput>
  }

  export type SpotReviewUpdateWithWhereUniqueWithoutParentInput = {
    where: SpotReviewWhereUniqueInput
    data: XOR<SpotReviewUpdateWithoutParentInput, SpotReviewUncheckedUpdateWithoutParentInput>
  }

  export type SpotReviewUpdateManyWithWhereWithoutParentInput = {
    where: SpotReviewScalarWhereInput
    data: XOR<SpotReviewUpdateManyMutationInput, SpotReviewUncheckedUpdateManyWithoutParentInput>
  }

  export type SpotCreateManyAuthorInput = {
    id?: string
    name: string
    description: string
    modality: string
    equipmentRequired: boolean
    isPaid: boolean
    alwaysOpen: boolean
    entryAmount?: string | null
    openingHours?: string | null
    hasCoverage: boolean
    coordinates: JsonNullValueInput | InputJsonValue
    images?: SpotCreateimagesInput | string[]
    createdAt?: Date | string
  }

  export type SpotReviewCreateManyAuthorInput = {
    id?: string
    title: string
    description: string
    spotId: string
    parentId?: string | null
    createdAt?: Date | string
  }

  export type SpotUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: SpotReviewUpdateManyWithoutSpotNestedInput
  }

  export type SpotUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reviews?: SpotReviewUncheckedUpdateManyWithoutSpotNestedInput
  }

  export type SpotUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    modality?: StringFieldUpdateOperationsInput | string
    equipmentRequired?: BoolFieldUpdateOperationsInput | boolean
    isPaid?: BoolFieldUpdateOperationsInput | boolean
    alwaysOpen?: BoolFieldUpdateOperationsInput | boolean
    entryAmount?: NullableStringFieldUpdateOperationsInput | string | null
    openingHours?: NullableStringFieldUpdateOperationsInput | string | null
    hasCoverage?: BoolFieldUpdateOperationsInput | boolean
    coordinates?: JsonNullValueInput | InputJsonValue
    images?: SpotUpdateimagesInput | string[]
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    spot?: SpotUpdateOneRequiredWithoutReviewsNestedInput
    parent?: SpotReviewUpdateOneWithoutRepliesNestedInput
    replies?: SpotReviewUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: SpotReviewUncheckedUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateManyWithoutAuthorInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewCreateManySpotInput = {
    id?: string
    title: string
    description: string
    authorId: string
    parentId?: string | null
    createdAt?: Date | string
  }

  export type SpotReviewUpdateWithoutSpotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutReviewsNestedInput
    parent?: SpotReviewUpdateOneWithoutRepliesNestedInput
    replies?: SpotReviewUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateWithoutSpotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: SpotReviewUncheckedUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateManyWithoutSpotInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    parentId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SpotReviewCreateManyParentInput = {
    id?: string
    title: string
    description: string
    authorId: string
    spotId: string
    createdAt?: Date | string
  }

  export type SpotReviewUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    author?: UserUpdateOneRequiredWithoutReviewsNestedInput
    spot?: SpotUpdateOneRequiredWithoutReviewsNestedInput
    replies?: SpotReviewUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    replies?: SpotReviewUncheckedUpdateManyWithoutParentNestedInput
  }

  export type SpotReviewUncheckedUpdateManyWithoutParentInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    authorId?: StringFieldUpdateOperationsInput | string
    spotId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
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