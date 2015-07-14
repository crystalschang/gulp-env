/// <reference path="./node.d.ts"/>

declare module "gulp-env" {
  interface EnvironmentMapping {
    [key: string]: any;
  }

  interface Env {
    (file: string): NodeJS.ReadWriteStream;

    (options: {
      vars: EnvironmentMapping,
    }): NodeJS.ReadWriteStream;

    (options: {
      file: string,
      handler?: (contents: string) => EnvironmentMapping,
      vars?: EnvironmentMapping,
    }): NodeJS.ReadWriteStream;

    (options: {
      file: string,
      type: string,
      vars?: EnvironmentMapping,
    }): NodeJS.ReadWriteStream;

    set(vars: EnvironmentMapping): NodeJS.ReadWriteStream;
  }

  export default Env;
}
