export as namespace gardens;

export interface Environment {
  browser: boolean,
  electron: boolean,
  node: boolean,
  performance: any,
  readonly defaultOutputType: OutputType
}

export class Manager {
  private scopes: ManagerScope;
  scope( ...names: string[] ): Garden;
}

export interface ManagerScope {
  default: Garden,
  nested: {
    [ name: string ]: ManagerScope
  }
}

export class Garden {
  private _super: Garden;
  private options: GardenOptions;
  private _times: TimesObject;
  private _counts: CountsObject;

  configure( update: GardenOptions ): this;

  private _checkOptions( update: GardenOptions ): void;
  
  createScope( scope: string, options?: GardenOptions ): Garden;
  createManager( scope: string, options?: GardenOptions ): Manager;

  assert( value: boolean, ...messages: any[] ): void;
  assert_eq( a: any, b: any, ...messages: any[] ): void;
  deny( value: boolean, ...messages: any[] ): void;
  throws( throws: () => never, ...messages: any[] ): void;

  raw( ...messages: any[] ): void;
  styled( message: any, style: CssObject ): void;

  log( ...messages: any[] ): void;
  info( ...messages: any[] ): void;
  success( ...messages: any[] ): void;
  warning( ...messages: any[] ): void;
  warn( ...messages: any[] ): void;
  fail( ...messages: any[] ): void;

  debug( ...messages: any[] ): boolean;
  trace( errorMessage: string, ...messages: any[] ): boolean;

  error( errorMessage: string, ...messages: any[] ): Error;
  typeerror( errorMessage: string, ...messages: any[] ): TypeError;
  referenceerror( errorMessage: string, ...messages: any[] ): ReferenceError;
  assertionerror( errorMessage: string, ...messages: any[] ): Error;
  
  catch( error: Error | any, ...messages: any[] ): Error;

  time( name: Name | null ): void;
  timeEnd( name: Name | null, ...messages: any[] ): void;
  count( name: Name | null, ...messages: any[] ): void;

  private _scopePrefix( outputType: OutputType ): StyledMessage[];
  private _print( type: PrintType, ...messages: any[] ): void;
  private _style( text, style, outputType: OutputType ): StyledMessage;
  private _transform( output: StyledMessage[] ): any[];
}

// These types are correct, but are unsupported by TypeScript and will cause errors
// to be thrown from tsc. Since these are only interal types maybe they should be
// removed and replaced with any in a future release? At least temporarily?
interface TimesObject {
  [ name: Name ]: number[]
}

interface CountsObject {
  [ name: Name ]: number
}

export interface GardenOptions {
  readonly scope?: string,
  stream?: WritableStreamish,
  outputType?: OutputType,
  timingPrecision?: number,
  scopeStyle?: CssObject,
  verbose?: boolean,
  displayTime?: boolean,
  displayDate?: boolean
}

export interface WritableStreamish {
  write( ...messages: any[] ): any
}

export type OutputType =
  | 'ansi'
  | 'console'
  | 'html'
  | 'text';

export type CssObject = object;

export type Name =
  | symbol
  | string;

interface PrintType {
  type: string,
  style?: CssObject
}

interface StyledMessage {
  text: string,
  // Only used for outputType 'console'. The CSS string that corresponds to
  // `text` and will be passed to console.log
  format?: string
}

// The type of our export has to be declared seperately, since you
// can't really declare the export directly.
declare const gardens: Garden & { environment: Environment };
export default gardens;
