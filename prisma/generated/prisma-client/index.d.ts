
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
 * Model UserCource
 * 
 */
export type UserCource = $Result.DefaultSelection<Prisma.$UserCourcePayload>
/**
 * Model Cource
 * 
 */
export type Cource = $Result.DefaultSelection<Prisma.$CourcePayload>

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
   * `prisma.userCource`: Exposes CRUD operations for the **UserCource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserCources
    * const userCources = await prisma.userCource.findMany()
    * ```
    */
  get userCource(): Prisma.UserCourceDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.cource`: Exposes CRUD operations for the **Cource** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Cources
    * const cources = await prisma.cource.findMany()
    * ```
    */
  get cource(): Prisma.CourceDelegate<ExtArgs, ClientOptions>;
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
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
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
    UserCource: 'UserCource',
    Cource: 'Cource'
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
      modelProps: "user" | "userCource" | "cource"
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
      UserCource: {
        payload: Prisma.$UserCourcePayload<ExtArgs>
        fields: Prisma.UserCourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserCourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserCourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          findFirst: {
            args: Prisma.UserCourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserCourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          findMany: {
            args: Prisma.UserCourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>[]
          }
          create: {
            args: Prisma.UserCourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          createMany: {
            args: Prisma.UserCourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>[]
          }
          delete: {
            args: Prisma.UserCourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          update: {
            args: Prisma.UserCourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          deleteMany: {
            args: Prisma.UserCourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserCourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserCourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>[]
          }
          upsert: {
            args: Prisma.UserCourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserCourcePayload>
          }
          aggregate: {
            args: Prisma.UserCourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserCource>
          }
          groupBy: {
            args: Prisma.UserCourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserCourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCourceCountArgs<ExtArgs>
            result: $Utils.Optional<UserCourceCountAggregateOutputType> | number
          }
        }
      }
      Cource: {
        payload: Prisma.$CourcePayload<ExtArgs>
        fields: Prisma.CourceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CourceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CourceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          findFirst: {
            args: Prisma.CourceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CourceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          findMany: {
            args: Prisma.CourceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>[]
          }
          create: {
            args: Prisma.CourceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          createMany: {
            args: Prisma.CourceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CourceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>[]
          }
          delete: {
            args: Prisma.CourceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          update: {
            args: Prisma.CourceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          deleteMany: {
            args: Prisma.CourceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CourceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CourceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>[]
          }
          upsert: {
            args: Prisma.CourceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CourcePayload>
          }
          aggregate: {
            args: Prisma.CourceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCource>
          }
          groupBy: {
            args: Prisma.CourceGroupByArgs<ExtArgs>
            result: $Utils.Optional<CourceGroupByOutputType>[]
          }
          count: {
            args: Prisma.CourceCountArgs<ExtArgs>
            result: $Utils.Optional<CourceCountAggregateOutputType> | number
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
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
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
    userCource?: UserCourceOmit
    cource?: CourceOmit
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
    userCource: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userCource?: boolean | UserCountOutputTypeCountUserCourceArgs
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
  export type UserCountOutputTypeCountUserCourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCourceWhereInput
  }


  /**
   * Count Type CourceCountOutputType
   */

  export type CourceCountOutputType = {
    userCource: number
  }

  export type CourceCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userCource?: boolean | CourceCountOutputTypeCountUserCourceArgs
  }

  // Custom InputTypes
  /**
   * CourceCountOutputType without action
   */
  export type CourceCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourceCountOutputType
     */
    select?: CourceCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CourceCountOutputType without action
   */
  export type CourceCountOutputTypeCountUserCourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCourceWhereInput
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
    name: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    name: number
    email: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    createdAt?: true
    updatedAt?: true
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
    name: string | null
    email: string | null
    createdAt: Date
    updatedAt: Date
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
    name?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userCource?: boolean | User$userCourceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userCource?: boolean | User$userCourceArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      userCource: Prisma.$UserCourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string | null
      email: string | null
      createdAt: Date
      updatedAt: Date
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
    userCource<T extends User$userCourceArgs<ExtArgs> = {}>(args?: Subset<T, User$userCourceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
    readonly name: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
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
   * User.userCource
   */
  export type User$userCourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    where?: UserCourceWhereInput
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    cursor?: UserCourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserCourceScalarFieldEnum | UserCourceScalarFieldEnum[]
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
   * Model UserCource
   */

  export type AggregateUserCource = {
    _count: UserCourceCountAggregateOutputType | null
    _min: UserCourceMinAggregateOutputType | null
    _max: UserCourceMaxAggregateOutputType | null
  }

  export type UserCourceMinAggregateOutputType = {
    id: string | null
    userId: string | null
    courceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCourceMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    courceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCourceCountAggregateOutputType = {
    id: number
    userId: number
    courceId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserCourceMinAggregateInputType = {
    id?: true
    userId?: true
    courceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCourceMaxAggregateInputType = {
    id?: true
    userId?: true
    courceId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCourceCountAggregateInputType = {
    id?: true
    userId?: true
    courceId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserCourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCource to aggregate.
     */
    where?: UserCourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCources to fetch.
     */
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserCourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserCources
    **/
    _count?: true | UserCourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserCourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserCourceMaxAggregateInputType
  }

  export type GetUserCourceAggregateType<T extends UserCourceAggregateArgs> = {
        [P in keyof T & keyof AggregateUserCource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserCource[P]>
      : GetScalarType<T[P], AggregateUserCource[P]>
  }




  export type UserCourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserCourceWhereInput
    orderBy?: UserCourceOrderByWithAggregationInput | UserCourceOrderByWithAggregationInput[]
    by: UserCourceScalarFieldEnum[] | UserCourceScalarFieldEnum
    having?: UserCourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCourceCountAggregateInputType | true
    _min?: UserCourceMinAggregateInputType
    _max?: UserCourceMaxAggregateInputType
  }

  export type UserCourceGroupByOutputType = {
    id: string
    userId: string
    courceId: string
    createdAt: Date
    updatedAt: Date
    _count: UserCourceCountAggregateOutputType | null
    _min: UserCourceMinAggregateOutputType | null
    _max: UserCourceMaxAggregateOutputType | null
  }

  type GetUserCourceGroupByPayload<T extends UserCourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserCourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserCourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserCourceGroupByOutputType[P]>
            : GetScalarType<T[P], UserCourceGroupByOutputType[P]>
        }
      >
    >


  export type UserCourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCource"]>

  export type UserCourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCource"]>

  export type UserCourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    courceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userCource"]>

  export type UserCourceSelectScalar = {
    id?: boolean
    userId?: boolean
    courceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserCourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "courceId" | "createdAt" | "updatedAt", ExtArgs["result"]["userCource"]>
  export type UserCourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }
  export type UserCourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }
  export type UserCourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    cource?: boolean | CourceDefaultArgs<ExtArgs>
  }

  export type $UserCourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserCource"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      cource: Prisma.$CourcePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      courceId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userCource"]>
    composites: {}
  }

  type UserCourceGetPayload<S extends boolean | null | undefined | UserCourceDefaultArgs> = $Result.GetResult<Prisma.$UserCourcePayload, S>

  type UserCourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserCourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCourceCountAggregateInputType | true
    }

  export interface UserCourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserCource'], meta: { name: 'UserCource' } }
    /**
     * Find zero or one UserCource that matches the filter.
     * @param {UserCourceFindUniqueArgs} args - Arguments to find a UserCource
     * @example
     * // Get one UserCource
     * const userCource = await prisma.userCource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCourceFindUniqueArgs>(args: SelectSubset<T, UserCourceFindUniqueArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserCource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCourceFindUniqueOrThrowArgs} args - Arguments to find a UserCource
     * @example
     * // Get one UserCource
     * const userCource = await prisma.userCource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCourceFindUniqueOrThrowArgs>(args: SelectSubset<T, UserCourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceFindFirstArgs} args - Arguments to find a UserCource
     * @example
     * // Get one UserCource
     * const userCource = await prisma.userCource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCourceFindFirstArgs>(args?: SelectSubset<T, UserCourceFindFirstArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserCource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceFindFirstOrThrowArgs} args - Arguments to find a UserCource
     * @example
     * // Get one UserCource
     * const userCource = await prisma.userCource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCourceFindFirstOrThrowArgs>(args?: SelectSubset<T, UserCourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserCources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCources
     * const userCources = await prisma.userCource.findMany()
     * 
     * // Get first 10 UserCources
     * const userCources = await prisma.userCource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userCourceWithIdOnly = await prisma.userCource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserCourceFindManyArgs>(args?: SelectSubset<T, UserCourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserCource.
     * @param {UserCourceCreateArgs} args - Arguments to create a UserCource.
     * @example
     * // Create one UserCource
     * const UserCource = await prisma.userCource.create({
     *   data: {
     *     // ... data to create a UserCource
     *   }
     * })
     * 
     */
    create<T extends UserCourceCreateArgs>(args: SelectSubset<T, UserCourceCreateArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserCources.
     * @param {UserCourceCreateManyArgs} args - Arguments to create many UserCources.
     * @example
     * // Create many UserCources
     * const userCource = await prisma.userCource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCourceCreateManyArgs>(args?: SelectSubset<T, UserCourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserCources and returns the data saved in the database.
     * @param {UserCourceCreateManyAndReturnArgs} args - Arguments to create many UserCources.
     * @example
     * // Create many UserCources
     * const userCource = await prisma.userCource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserCources and only return the `id`
     * const userCourceWithIdOnly = await prisma.userCource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCourceCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserCource.
     * @param {UserCourceDeleteArgs} args - Arguments to delete one UserCource.
     * @example
     * // Delete one UserCource
     * const UserCource = await prisma.userCource.delete({
     *   where: {
     *     // ... filter to delete one UserCource
     *   }
     * })
     * 
     */
    delete<T extends UserCourceDeleteArgs>(args: SelectSubset<T, UserCourceDeleteArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserCource.
     * @param {UserCourceUpdateArgs} args - Arguments to update one UserCource.
     * @example
     * // Update one UserCource
     * const userCource = await prisma.userCource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserCourceUpdateArgs>(args: SelectSubset<T, UserCourceUpdateArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserCources.
     * @param {UserCourceDeleteManyArgs} args - Arguments to filter UserCources to delete.
     * @example
     * // Delete a few UserCources
     * const { count } = await prisma.userCource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserCourceDeleteManyArgs>(args?: SelectSubset<T, UserCourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCources
     * const userCource = await prisma.userCource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserCourceUpdateManyArgs>(args: SelectSubset<T, UserCourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserCources and returns the data updated in the database.
     * @param {UserCourceUpdateManyAndReturnArgs} args - Arguments to update many UserCources.
     * @example
     * // Update many UserCources
     * const userCource = await prisma.userCource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserCources and only return the `id`
     * const userCourceWithIdOnly = await prisma.userCource.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserCourceUpdateManyAndReturnArgs>(args: SelectSubset<T, UserCourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserCource.
     * @param {UserCourceUpsertArgs} args - Arguments to update or create a UserCource.
     * @example
     * // Update or create a UserCource
     * const userCource = await prisma.userCource.upsert({
     *   create: {
     *     // ... data to create a UserCource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCource we want to update
     *   }
     * })
     */
    upsert<T extends UserCourceUpsertArgs>(args: SelectSubset<T, UserCourceUpsertArgs<ExtArgs>>): Prisma__UserCourceClient<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserCources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceCountArgs} args - Arguments to filter UserCources to count.
     * @example
     * // Count the number of UserCources
     * const count = await prisma.userCource.count({
     *   where: {
     *     // ... the filter for the UserCources we want to count
     *   }
     * })
    **/
    count<T extends UserCourceCountArgs>(
      args?: Subset<T, UserCourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserCource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserCourceAggregateArgs>(args: Subset<T, UserCourceAggregateArgs>): Prisma.PrismaPromise<GetUserCourceAggregateType<T>>

    /**
     * Group by UserCource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourceGroupByArgs} args - Group by arguments.
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
      T extends UserCourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserCourceGroupByArgs['orderBy'] }
        : { orderBy?: UserCourceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, UserCourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserCource model
   */
  readonly fields: UserCourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserCource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserCourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    cource<T extends CourceDefaultArgs<ExtArgs> = {}>(args?: Subset<T, CourceDefaultArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the UserCource model
   */
  interface UserCourceFieldRefs {
    readonly id: FieldRef<"UserCource", 'String'>
    readonly userId: FieldRef<"UserCource", 'String'>
    readonly courceId: FieldRef<"UserCource", 'String'>
    readonly createdAt: FieldRef<"UserCource", 'DateTime'>
    readonly updatedAt: FieldRef<"UserCource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserCource findUnique
   */
  export type UserCourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter, which UserCource to fetch.
     */
    where: UserCourceWhereUniqueInput
  }

  /**
   * UserCource findUniqueOrThrow
   */
  export type UserCourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter, which UserCource to fetch.
     */
    where: UserCourceWhereUniqueInput
  }

  /**
   * UserCource findFirst
   */
  export type UserCourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter, which UserCource to fetch.
     */
    where?: UserCourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCources to fetch.
     */
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCources.
     */
    cursor?: UserCourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCources.
     */
    distinct?: UserCourceScalarFieldEnum | UserCourceScalarFieldEnum[]
  }

  /**
   * UserCource findFirstOrThrow
   */
  export type UserCourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter, which UserCource to fetch.
     */
    where?: UserCourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCources to fetch.
     */
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserCources.
     */
    cursor?: UserCourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserCources.
     */
    distinct?: UserCourceScalarFieldEnum | UserCourceScalarFieldEnum[]
  }

  /**
   * UserCource findMany
   */
  export type UserCourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter, which UserCources to fetch.
     */
    where?: UserCourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserCources to fetch.
     */
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserCources.
     */
    cursor?: UserCourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserCources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserCources.
     */
    skip?: number
    distinct?: UserCourceScalarFieldEnum | UserCourceScalarFieldEnum[]
  }

  /**
   * UserCource create
   */
  export type UserCourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * The data needed to create a UserCource.
     */
    data: XOR<UserCourceCreateInput, UserCourceUncheckedCreateInput>
  }

  /**
   * UserCource createMany
   */
  export type UserCourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCources.
     */
    data: UserCourceCreateManyInput | UserCourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserCource createManyAndReturn
   */
  export type UserCourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * The data used to create many UserCources.
     */
    data: UserCourceCreateManyInput | UserCourceCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCource update
   */
  export type UserCourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * The data needed to update a UserCource.
     */
    data: XOR<UserCourceUpdateInput, UserCourceUncheckedUpdateInput>
    /**
     * Choose, which UserCource to update.
     */
    where: UserCourceWhereUniqueInput
  }

  /**
   * UserCource updateMany
   */
  export type UserCourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCources.
     */
    data: XOR<UserCourceUpdateManyMutationInput, UserCourceUncheckedUpdateManyInput>
    /**
     * Filter which UserCources to update
     */
    where?: UserCourceWhereInput
    /**
     * Limit how many UserCources to update.
     */
    limit?: number
  }

  /**
   * UserCource updateManyAndReturn
   */
  export type UserCourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * The data used to update UserCources.
     */
    data: XOR<UserCourceUpdateManyMutationInput, UserCourceUncheckedUpdateManyInput>
    /**
     * Filter which UserCources to update
     */
    where?: UserCourceWhereInput
    /**
     * Limit how many UserCources to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserCource upsert
   */
  export type UserCourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * The filter to search for the UserCource to update in case it exists.
     */
    where: UserCourceWhereUniqueInput
    /**
     * In case the UserCource found by the `where` argument doesn't exist, create a new UserCource with this data.
     */
    create: XOR<UserCourceCreateInput, UserCourceUncheckedCreateInput>
    /**
     * In case the UserCource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserCourceUpdateInput, UserCourceUncheckedUpdateInput>
  }

  /**
   * UserCource delete
   */
  export type UserCourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    /**
     * Filter which UserCource to delete.
     */
    where: UserCourceWhereUniqueInput
  }

  /**
   * UserCource deleteMany
   */
  export type UserCourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserCources to delete
     */
    where?: UserCourceWhereInput
    /**
     * Limit how many UserCources to delete.
     */
    limit?: number
  }

  /**
   * UserCource without action
   */
  export type UserCourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
  }


  /**
   * Model Cource
   */

  export type AggregateCource = {
    _count: CourceCountAggregateOutputType | null
    _min: CourceMinAggregateOutputType | null
    _max: CourceMaxAggregateOutputType | null
  }

  export type CourceMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourceMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CourceCountAggregateOutputType = {
    id: number
    title: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CourceMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourceMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CourceCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CourceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cource to aggregate.
     */
    where?: CourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cources to fetch.
     */
    orderBy?: CourceOrderByWithRelationInput | CourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Cources
    **/
    _count?: true | CourceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CourceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CourceMaxAggregateInputType
  }

  export type GetCourceAggregateType<T extends CourceAggregateArgs> = {
        [P in keyof T & keyof AggregateCource]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCource[P]>
      : GetScalarType<T[P], AggregateCource[P]>
  }




  export type CourceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CourceWhereInput
    orderBy?: CourceOrderByWithAggregationInput | CourceOrderByWithAggregationInput[]
    by: CourceScalarFieldEnum[] | CourceScalarFieldEnum
    having?: CourceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CourceCountAggregateInputType | true
    _min?: CourceMinAggregateInputType
    _max?: CourceMaxAggregateInputType
  }

  export type CourceGroupByOutputType = {
    id: string
    title: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: CourceCountAggregateOutputType | null
    _min: CourceMinAggregateOutputType | null
    _max: CourceMaxAggregateOutputType | null
  }

  type GetCourceGroupByPayload<T extends CourceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CourceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CourceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CourceGroupByOutputType[P]>
            : GetScalarType<T[P], CourceGroupByOutputType[P]>
        }
      >
    >


  export type CourceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    userCource?: boolean | Cource$userCourceArgs<ExtArgs>
    _count?: boolean | CourceCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["cource"]>

  export type CourceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cource"]>

  export type CourceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["cource"]>

  export type CourceSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CourceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["cource"]>
  export type CourceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    userCource?: boolean | Cource$userCourceArgs<ExtArgs>
    _count?: boolean | CourceCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CourceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CourceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CourcePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Cource"
    objects: {
      userCource: Prisma.$UserCourcePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["cource"]>
    composites: {}
  }

  type CourceGetPayload<S extends boolean | null | undefined | CourceDefaultArgs> = $Result.GetResult<Prisma.$CourcePayload, S>

  type CourceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CourceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CourceCountAggregateInputType | true
    }

  export interface CourceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Cource'], meta: { name: 'Cource' } }
    /**
     * Find zero or one Cource that matches the filter.
     * @param {CourceFindUniqueArgs} args - Arguments to find a Cource
     * @example
     * // Get one Cource
     * const cource = await prisma.cource.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourceFindUniqueArgs>(args: SelectSubset<T, CourceFindUniqueArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Cource that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourceFindUniqueOrThrowArgs} args - Arguments to find a Cource
     * @example
     * // Get one Cource
     * const cource = await prisma.cource.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourceFindUniqueOrThrowArgs>(args: SelectSubset<T, CourceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cource that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceFindFirstArgs} args - Arguments to find a Cource
     * @example
     * // Get one Cource
     * const cource = await prisma.cource.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourceFindFirstArgs>(args?: SelectSubset<T, CourceFindFirstArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Cource that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceFindFirstOrThrowArgs} args - Arguments to find a Cource
     * @example
     * // Get one Cource
     * const cource = await prisma.cource.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourceFindFirstOrThrowArgs>(args?: SelectSubset<T, CourceFindFirstOrThrowArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Cources that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Cources
     * const cources = await prisma.cource.findMany()
     * 
     * // Get first 10 Cources
     * const cources = await prisma.cource.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const courceWithIdOnly = await prisma.cource.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CourceFindManyArgs>(args?: SelectSubset<T, CourceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Cource.
     * @param {CourceCreateArgs} args - Arguments to create a Cource.
     * @example
     * // Create one Cource
     * const Cource = await prisma.cource.create({
     *   data: {
     *     // ... data to create a Cource
     *   }
     * })
     * 
     */
    create<T extends CourceCreateArgs>(args: SelectSubset<T, CourceCreateArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Cources.
     * @param {CourceCreateManyArgs} args - Arguments to create many Cources.
     * @example
     * // Create many Cources
     * const cource = await prisma.cource.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CourceCreateManyArgs>(args?: SelectSubset<T, CourceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Cources and returns the data saved in the database.
     * @param {CourceCreateManyAndReturnArgs} args - Arguments to create many Cources.
     * @example
     * // Create many Cources
     * const cource = await prisma.cource.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Cources and only return the `id`
     * const courceWithIdOnly = await prisma.cource.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CourceCreateManyAndReturnArgs>(args?: SelectSubset<T, CourceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Cource.
     * @param {CourceDeleteArgs} args - Arguments to delete one Cource.
     * @example
     * // Delete one Cource
     * const Cource = await prisma.cource.delete({
     *   where: {
     *     // ... filter to delete one Cource
     *   }
     * })
     * 
     */
    delete<T extends CourceDeleteArgs>(args: SelectSubset<T, CourceDeleteArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Cource.
     * @param {CourceUpdateArgs} args - Arguments to update one Cource.
     * @example
     * // Update one Cource
     * const cource = await prisma.cource.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CourceUpdateArgs>(args: SelectSubset<T, CourceUpdateArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Cources.
     * @param {CourceDeleteManyArgs} args - Arguments to filter Cources to delete.
     * @example
     * // Delete a few Cources
     * const { count } = await prisma.cource.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CourceDeleteManyArgs>(args?: SelectSubset<T, CourceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Cources
     * const cource = await prisma.cource.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CourceUpdateManyArgs>(args: SelectSubset<T, CourceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Cources and returns the data updated in the database.
     * @param {CourceUpdateManyAndReturnArgs} args - Arguments to update many Cources.
     * @example
     * // Update many Cources
     * const cource = await prisma.cource.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Cources and only return the `id`
     * const courceWithIdOnly = await prisma.cource.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourceUpdateManyAndReturnArgs>(args: SelectSubset<T, CourceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Cource.
     * @param {CourceUpsertArgs} args - Arguments to update or create a Cource.
     * @example
     * // Update or create a Cource
     * const cource = await prisma.cource.upsert({
     *   create: {
     *     // ... data to create a Cource
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Cource we want to update
     *   }
     * })
     */
    upsert<T extends CourceUpsertArgs>(args: SelectSubset<T, CourceUpsertArgs<ExtArgs>>): Prisma__CourceClient<$Result.GetResult<Prisma.$CourcePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Cources.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceCountArgs} args - Arguments to filter Cources to count.
     * @example
     * // Count the number of Cources
     * const count = await prisma.cource.count({
     *   where: {
     *     // ... the filter for the Cources we want to count
     *   }
     * })
    **/
    count<T extends CourceCountArgs>(
      args?: Subset<T, CourceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CourceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Cource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourceAggregateArgs>(args: Subset<T, CourceAggregateArgs>): Prisma.PrismaPromise<GetCourceAggregateType<T>>

    /**
     * Group by Cource.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourceGroupByArgs} args - Group by arguments.
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
      T extends CourceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CourceGroupByArgs['orderBy'] }
        : { orderBy?: CourceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, CourceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Cource model
   */
  readonly fields: CourceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Cource.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CourceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    userCource<T extends Cource$userCourceArgs<ExtArgs> = {}>(args?: Subset<T, Cource$userCourceArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserCourcePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the Cource model
   */
  interface CourceFieldRefs {
    readonly id: FieldRef<"Cource", 'String'>
    readonly title: FieldRef<"Cource", 'String'>
    readonly description: FieldRef<"Cource", 'String'>
    readonly createdAt: FieldRef<"Cource", 'DateTime'>
    readonly updatedAt: FieldRef<"Cource", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Cource findUnique
   */
  export type CourceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter, which Cource to fetch.
     */
    where: CourceWhereUniqueInput
  }

  /**
   * Cource findUniqueOrThrow
   */
  export type CourceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter, which Cource to fetch.
     */
    where: CourceWhereUniqueInput
  }

  /**
   * Cource findFirst
   */
  export type CourceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter, which Cource to fetch.
     */
    where?: CourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cources to fetch.
     */
    orderBy?: CourceOrderByWithRelationInput | CourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cources.
     */
    cursor?: CourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cources.
     */
    distinct?: CourceScalarFieldEnum | CourceScalarFieldEnum[]
  }

  /**
   * Cource findFirstOrThrow
   */
  export type CourceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter, which Cource to fetch.
     */
    where?: CourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cources to fetch.
     */
    orderBy?: CourceOrderByWithRelationInput | CourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Cources.
     */
    cursor?: CourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cources.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Cources.
     */
    distinct?: CourceScalarFieldEnum | CourceScalarFieldEnum[]
  }

  /**
   * Cource findMany
   */
  export type CourceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter, which Cources to fetch.
     */
    where?: CourceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Cources to fetch.
     */
    orderBy?: CourceOrderByWithRelationInput | CourceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Cources.
     */
    cursor?: CourceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Cources from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Cources.
     */
    skip?: number
    distinct?: CourceScalarFieldEnum | CourceScalarFieldEnum[]
  }

  /**
   * Cource create
   */
  export type CourceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * The data needed to create a Cource.
     */
    data: XOR<CourceCreateInput, CourceUncheckedCreateInput>
  }

  /**
   * Cource createMany
   */
  export type CourceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Cources.
     */
    data: CourceCreateManyInput | CourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cource createManyAndReturn
   */
  export type CourceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * The data used to create many Cources.
     */
    data: CourceCreateManyInput | CourceCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Cource update
   */
  export type CourceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * The data needed to update a Cource.
     */
    data: XOR<CourceUpdateInput, CourceUncheckedUpdateInput>
    /**
     * Choose, which Cource to update.
     */
    where: CourceWhereUniqueInput
  }

  /**
   * Cource updateMany
   */
  export type CourceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Cources.
     */
    data: XOR<CourceUpdateManyMutationInput, CourceUncheckedUpdateManyInput>
    /**
     * Filter which Cources to update
     */
    where?: CourceWhereInput
    /**
     * Limit how many Cources to update.
     */
    limit?: number
  }

  /**
   * Cource updateManyAndReturn
   */
  export type CourceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * The data used to update Cources.
     */
    data: XOR<CourceUpdateManyMutationInput, CourceUncheckedUpdateManyInput>
    /**
     * Filter which Cources to update
     */
    where?: CourceWhereInput
    /**
     * Limit how many Cources to update.
     */
    limit?: number
  }

  /**
   * Cource upsert
   */
  export type CourceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * The filter to search for the Cource to update in case it exists.
     */
    where: CourceWhereUniqueInput
    /**
     * In case the Cource found by the `where` argument doesn't exist, create a new Cource with this data.
     */
    create: XOR<CourceCreateInput, CourceUncheckedCreateInput>
    /**
     * In case the Cource was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CourceUpdateInput, CourceUncheckedUpdateInput>
  }

  /**
   * Cource delete
   */
  export type CourceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
    /**
     * Filter which Cource to delete.
     */
    where: CourceWhereUniqueInput
  }

  /**
   * Cource deleteMany
   */
  export type CourceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Cources to delete
     */
    where?: CourceWhereInput
    /**
     * Limit how many Cources to delete.
     */
    limit?: number
  }

  /**
   * Cource.userCource
   */
  export type Cource$userCourceArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCource
     */
    select?: UserCourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserCource
     */
    omit?: UserCourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserCourceInclude<ExtArgs> | null
    where?: UserCourceWhereInput
    orderBy?: UserCourceOrderByWithRelationInput | UserCourceOrderByWithRelationInput[]
    cursor?: UserCourceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserCourceScalarFieldEnum | UserCourceScalarFieldEnum[]
  }

  /**
   * Cource without action
   */
  export type CourceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Cource
     */
    select?: CourceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Cource
     */
    omit?: CourceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CourceInclude<ExtArgs> | null
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
    name: 'name',
    email: 'email',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const UserCourceScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    courceId: 'courceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserCourceScalarFieldEnum = (typeof UserCourceScalarFieldEnum)[keyof typeof UserCourceScalarFieldEnum]


  export const CourceScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CourceScalarFieldEnum = (typeof CourceScalarFieldEnum)[keyof typeof CourceScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


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
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    email?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    userCource?: UserCourceListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userCource?: UserCourceOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    userCource?: UserCourceListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrderInput | SortOrder
    email?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    email?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type UserCourceWhereInput = {
    AND?: UserCourceWhereInput | UserCourceWhereInput[]
    OR?: UserCourceWhereInput[]
    NOT?: UserCourceWhereInput | UserCourceWhereInput[]
    id?: StringFilter<"UserCource"> | string
    userId?: StringFilter<"UserCource"> | string
    courceId?: StringFilter<"UserCource"> | string
    createdAt?: DateTimeFilter<"UserCource"> | Date | string
    updatedAt?: DateTimeFilter<"UserCource"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    cource?: XOR<CourceScalarRelationFilter, CourceWhereInput>
  }

  export type UserCourceOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    courceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    cource?: CourceOrderByWithRelationInput
  }

  export type UserCourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserCourceWhereInput | UserCourceWhereInput[]
    OR?: UserCourceWhereInput[]
    NOT?: UserCourceWhereInput | UserCourceWhereInput[]
    userId?: StringFilter<"UserCource"> | string
    courceId?: StringFilter<"UserCource"> | string
    createdAt?: DateTimeFilter<"UserCource"> | Date | string
    updatedAt?: DateTimeFilter<"UserCource"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    cource?: XOR<CourceScalarRelationFilter, CourceWhereInput>
  }, "id">

  export type UserCourceOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    courceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCourceCountOrderByAggregateInput
    _max?: UserCourceMaxOrderByAggregateInput
    _min?: UserCourceMinOrderByAggregateInput
  }

  export type UserCourceScalarWhereWithAggregatesInput = {
    AND?: UserCourceScalarWhereWithAggregatesInput | UserCourceScalarWhereWithAggregatesInput[]
    OR?: UserCourceScalarWhereWithAggregatesInput[]
    NOT?: UserCourceScalarWhereWithAggregatesInput | UserCourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserCource"> | string
    userId?: StringWithAggregatesFilter<"UserCource"> | string
    courceId?: StringWithAggregatesFilter<"UserCource"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserCource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserCource"> | Date | string
  }

  export type CourceWhereInput = {
    AND?: CourceWhereInput | CourceWhereInput[]
    OR?: CourceWhereInput[]
    NOT?: CourceWhereInput | CourceWhereInput[]
    id?: StringFilter<"Cource"> | string
    title?: StringFilter<"Cource"> | string
    description?: StringNullableFilter<"Cource"> | string | null
    createdAt?: DateTimeFilter<"Cource"> | Date | string
    updatedAt?: DateTimeFilter<"Cource"> | Date | string
    userCource?: UserCourceListRelationFilter
  }

  export type CourceOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    userCource?: UserCourceOrderByRelationAggregateInput
  }

  export type CourceWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: CourceWhereInput | CourceWhereInput[]
    OR?: CourceWhereInput[]
    NOT?: CourceWhereInput | CourceWhereInput[]
    title?: StringFilter<"Cource"> | string
    description?: StringNullableFilter<"Cource"> | string | null
    createdAt?: DateTimeFilter<"Cource"> | Date | string
    updatedAt?: DateTimeFilter<"Cource"> | Date | string
    userCource?: UserCourceListRelationFilter
  }, "id">

  export type CourceOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CourceCountOrderByAggregateInput
    _max?: CourceMaxOrderByAggregateInput
    _min?: CourceMinOrderByAggregateInput
  }

  export type CourceScalarWhereWithAggregatesInput = {
    AND?: CourceScalarWhereWithAggregatesInput | CourceScalarWhereWithAggregatesInput[]
    OR?: CourceScalarWhereWithAggregatesInput[]
    NOT?: CourceScalarWhereWithAggregatesInput | CourceScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Cource"> | string
    title?: StringWithAggregatesFilter<"Cource"> | string
    description?: StringNullableWithAggregatesFilter<"Cource"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Cource"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Cource"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userCource?: UserCourceCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    name?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userCource?: UserCourceUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userCource?: UserCourceUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userCource?: UserCourceUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    name?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserCourceInput
    cource: CourceCreateNestedOneWithoutUserCourceInput
  }

  export type UserCourceUncheckedCreateInput = {
    id?: string
    userId: string
    courceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserCourceNestedInput
    cource?: CourceUpdateOneRequiredWithoutUserCourceNestedInput
  }

  export type UserCourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceCreateManyInput = {
    id?: string
    userId: string
    courceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    courceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourceCreateInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userCource?: UserCourceCreateNestedManyWithoutCourceInput
  }

  export type CourceUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    userCource?: UserCourceUncheckedCreateNestedManyWithoutCourceInput
  }

  export type CourceUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userCource?: UserCourceUpdateManyWithoutCourceNestedInput
  }

  export type CourceUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    userCource?: UserCourceUncheckedUpdateManyWithoutCourceNestedInput
  }

  export type CourceCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourceUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourceUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type UserCourceListRelationFilter = {
    every?: UserCourceWhereInput
    some?: UserCourceWhereInput
    none?: UserCourceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type UserCourceOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type CourceScalarRelationFilter = {
    is?: CourceWhereInput
    isNot?: CourceWhereInput
  }

  export type UserCourceCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCourceMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCourceMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    courceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourceCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourceMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CourceMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserCourceCreateNestedManyWithoutUserInput = {
    create?: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput> | UserCourceCreateWithoutUserInput[] | UserCourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutUserInput | UserCourceCreateOrConnectWithoutUserInput[]
    createMany?: UserCourceCreateManyUserInputEnvelope
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
  }

  export type UserCourceUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput> | UserCourceCreateWithoutUserInput[] | UserCourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutUserInput | UserCourceCreateOrConnectWithoutUserInput[]
    createMany?: UserCourceCreateManyUserInputEnvelope
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserCourceUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput> | UserCourceCreateWithoutUserInput[] | UserCourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutUserInput | UserCourceCreateOrConnectWithoutUserInput[]
    upsert?: UserCourceUpsertWithWhereUniqueWithoutUserInput | UserCourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserCourceCreateManyUserInputEnvelope
    set?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    disconnect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    delete?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    update?: UserCourceUpdateWithWhereUniqueWithoutUserInput | UserCourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserCourceUpdateManyWithWhereWithoutUserInput | UserCourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
  }

  export type UserCourceUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput> | UserCourceCreateWithoutUserInput[] | UserCourceUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutUserInput | UserCourceCreateOrConnectWithoutUserInput[]
    upsert?: UserCourceUpsertWithWhereUniqueWithoutUserInput | UserCourceUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserCourceCreateManyUserInputEnvelope
    set?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    disconnect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    delete?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    update?: UserCourceUpdateWithWhereUniqueWithoutUserInput | UserCourceUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserCourceUpdateManyWithWhereWithoutUserInput | UserCourceUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutUserCourceInput = {
    create?: XOR<UserCreateWithoutUserCourceInput, UserUncheckedCreateWithoutUserCourceInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserCourceInput
    connect?: UserWhereUniqueInput
  }

  export type CourceCreateNestedOneWithoutUserCourceInput = {
    create?: XOR<CourceCreateWithoutUserCourceInput, CourceUncheckedCreateWithoutUserCourceInput>
    connectOrCreate?: CourceCreateOrConnectWithoutUserCourceInput
    connect?: CourceWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutUserCourceNestedInput = {
    create?: XOR<UserCreateWithoutUserCourceInput, UserUncheckedCreateWithoutUserCourceInput>
    connectOrCreate?: UserCreateOrConnectWithoutUserCourceInput
    upsert?: UserUpsertWithoutUserCourceInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutUserCourceInput, UserUpdateWithoutUserCourceInput>, UserUncheckedUpdateWithoutUserCourceInput>
  }

  export type CourceUpdateOneRequiredWithoutUserCourceNestedInput = {
    create?: XOR<CourceCreateWithoutUserCourceInput, CourceUncheckedCreateWithoutUserCourceInput>
    connectOrCreate?: CourceCreateOrConnectWithoutUserCourceInput
    upsert?: CourceUpsertWithoutUserCourceInput
    connect?: CourceWhereUniqueInput
    update?: XOR<XOR<CourceUpdateToOneWithWhereWithoutUserCourceInput, CourceUpdateWithoutUserCourceInput>, CourceUncheckedUpdateWithoutUserCourceInput>
  }

  export type UserCourceCreateNestedManyWithoutCourceInput = {
    create?: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput> | UserCourceCreateWithoutCourceInput[] | UserCourceUncheckedCreateWithoutCourceInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutCourceInput | UserCourceCreateOrConnectWithoutCourceInput[]
    createMany?: UserCourceCreateManyCourceInputEnvelope
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
  }

  export type UserCourceUncheckedCreateNestedManyWithoutCourceInput = {
    create?: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput> | UserCourceCreateWithoutCourceInput[] | UserCourceUncheckedCreateWithoutCourceInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutCourceInput | UserCourceCreateOrConnectWithoutCourceInput[]
    createMany?: UserCourceCreateManyCourceInputEnvelope
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
  }

  export type UserCourceUpdateManyWithoutCourceNestedInput = {
    create?: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput> | UserCourceCreateWithoutCourceInput[] | UserCourceUncheckedCreateWithoutCourceInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutCourceInput | UserCourceCreateOrConnectWithoutCourceInput[]
    upsert?: UserCourceUpsertWithWhereUniqueWithoutCourceInput | UserCourceUpsertWithWhereUniqueWithoutCourceInput[]
    createMany?: UserCourceCreateManyCourceInputEnvelope
    set?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    disconnect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    delete?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    update?: UserCourceUpdateWithWhereUniqueWithoutCourceInput | UserCourceUpdateWithWhereUniqueWithoutCourceInput[]
    updateMany?: UserCourceUpdateManyWithWhereWithoutCourceInput | UserCourceUpdateManyWithWhereWithoutCourceInput[]
    deleteMany?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
  }

  export type UserCourceUncheckedUpdateManyWithoutCourceNestedInput = {
    create?: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput> | UserCourceCreateWithoutCourceInput[] | UserCourceUncheckedCreateWithoutCourceInput[]
    connectOrCreate?: UserCourceCreateOrConnectWithoutCourceInput | UserCourceCreateOrConnectWithoutCourceInput[]
    upsert?: UserCourceUpsertWithWhereUniqueWithoutCourceInput | UserCourceUpsertWithWhereUniqueWithoutCourceInput[]
    createMany?: UserCourceCreateManyCourceInputEnvelope
    set?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    disconnect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    delete?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    connect?: UserCourceWhereUniqueInput | UserCourceWhereUniqueInput[]
    update?: UserCourceUpdateWithWhereUniqueWithoutCourceInput | UserCourceUpdateWithWhereUniqueWithoutCourceInput[]
    updateMany?: UserCourceUpdateManyWithWhereWithoutCourceInput | UserCourceUpdateManyWithWhereWithoutCourceInput[]
    deleteMany?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
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

  export type UserCourceCreateWithoutUserInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    cource: CourceCreateNestedOneWithoutUserCourceInput
  }

  export type UserCourceUncheckedCreateWithoutUserInput = {
    id?: string
    courceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceCreateOrConnectWithoutUserInput = {
    where: UserCourceWhereUniqueInput
    create: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput>
  }

  export type UserCourceCreateManyUserInputEnvelope = {
    data: UserCourceCreateManyUserInput | UserCourceCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserCourceUpsertWithWhereUniqueWithoutUserInput = {
    where: UserCourceWhereUniqueInput
    update: XOR<UserCourceUpdateWithoutUserInput, UserCourceUncheckedUpdateWithoutUserInput>
    create: XOR<UserCourceCreateWithoutUserInput, UserCourceUncheckedCreateWithoutUserInput>
  }

  export type UserCourceUpdateWithWhereUniqueWithoutUserInput = {
    where: UserCourceWhereUniqueInput
    data: XOR<UserCourceUpdateWithoutUserInput, UserCourceUncheckedUpdateWithoutUserInput>
  }

  export type UserCourceUpdateManyWithWhereWithoutUserInput = {
    where: UserCourceScalarWhereInput
    data: XOR<UserCourceUpdateManyMutationInput, UserCourceUncheckedUpdateManyWithoutUserInput>
  }

  export type UserCourceScalarWhereInput = {
    AND?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
    OR?: UserCourceScalarWhereInput[]
    NOT?: UserCourceScalarWhereInput | UserCourceScalarWhereInput[]
    id?: StringFilter<"UserCource"> | string
    userId?: StringFilter<"UserCource"> | string
    courceId?: StringFilter<"UserCource"> | string
    createdAt?: DateTimeFilter<"UserCource"> | Date | string
    updatedAt?: DateTimeFilter<"UserCource"> | Date | string
  }

  export type UserCreateWithoutUserCourceInput = {
    id?: string
    name?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUncheckedCreateWithoutUserCourceInput = {
    id?: string
    name?: string | null
    email?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCreateOrConnectWithoutUserCourceInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutUserCourceInput, UserUncheckedCreateWithoutUserCourceInput>
  }

  export type CourceCreateWithoutUserCourceInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourceUncheckedCreateWithoutUserCourceInput = {
    id?: string
    title: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CourceCreateOrConnectWithoutUserCourceInput = {
    where: CourceWhereUniqueInput
    create: XOR<CourceCreateWithoutUserCourceInput, CourceUncheckedCreateWithoutUserCourceInput>
  }

  export type UserUpsertWithoutUserCourceInput = {
    update: XOR<UserUpdateWithoutUserCourceInput, UserUncheckedUpdateWithoutUserCourceInput>
    create: XOR<UserCreateWithoutUserCourceInput, UserUncheckedCreateWithoutUserCourceInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutUserCourceInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutUserCourceInput, UserUncheckedUpdateWithoutUserCourceInput>
  }

  export type UserUpdateWithoutUserCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateWithoutUserCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    email?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourceUpsertWithoutUserCourceInput = {
    update: XOR<CourceUpdateWithoutUserCourceInput, CourceUncheckedUpdateWithoutUserCourceInput>
    create: XOR<CourceCreateWithoutUserCourceInput, CourceUncheckedCreateWithoutUserCourceInput>
    where?: CourceWhereInput
  }

  export type CourceUpdateToOneWithWhereWithoutUserCourceInput = {
    where?: CourceWhereInput
    data: XOR<CourceUpdateWithoutUserCourceInput, CourceUncheckedUpdateWithoutUserCourceInput>
  }

  export type CourceUpdateWithoutUserCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CourceUncheckedUpdateWithoutUserCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceCreateWithoutCourceInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutUserCourceInput
  }

  export type UserCourceUncheckedCreateWithoutCourceInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceCreateOrConnectWithoutCourceInput = {
    where: UserCourceWhereUniqueInput
    create: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput>
  }

  export type UserCourceCreateManyCourceInputEnvelope = {
    data: UserCourceCreateManyCourceInput | UserCourceCreateManyCourceInput[]
    skipDuplicates?: boolean
  }

  export type UserCourceUpsertWithWhereUniqueWithoutCourceInput = {
    where: UserCourceWhereUniqueInput
    update: XOR<UserCourceUpdateWithoutCourceInput, UserCourceUncheckedUpdateWithoutCourceInput>
    create: XOR<UserCourceCreateWithoutCourceInput, UserCourceUncheckedCreateWithoutCourceInput>
  }

  export type UserCourceUpdateWithWhereUniqueWithoutCourceInput = {
    where: UserCourceWhereUniqueInput
    data: XOR<UserCourceUpdateWithoutCourceInput, UserCourceUncheckedUpdateWithoutCourceInput>
  }

  export type UserCourceUpdateManyWithWhereWithoutCourceInput = {
    where: UserCourceScalarWhereInput
    data: XOR<UserCourceUpdateManyMutationInput, UserCourceUncheckedUpdateManyWithoutCourceInput>
  }

  export type UserCourceCreateManyUserInput = {
    id?: string
    courceId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    cource?: CourceUpdateOneRequiredWithoutUserCourceNestedInput
  }

  export type UserCourceUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    courceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    courceId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceCreateManyCourceInput = {
    id?: string
    userId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserCourceUpdateWithoutCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutUserCourceNestedInput
  }

  export type UserCourceUncheckedUpdateWithoutCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCourceUncheckedUpdateManyWithoutCourceInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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