/// <reference path="./node.d.ts"/>

declare module "gulp-env" {
  interface Env {
    (file: string): NodeJS.ReadWriteStream;

    (options: {
      vars: {[key: string]: any},
    }): NodeJS.ReadWriteStream;

    (options: {
      file: string,
      handler?: (contents: string) => {[key: string]: any},
      vars?: {[key: string]: any},
    }): NodeJS.ReadWriteStream;

    (options: {
      file: string,
      type: string,
      vars?: {[key: string]: any},
    }): NodeJS.ReadWriteStream;

    set(vars: {[key: string]: any}): NodeJS.ReadWriteStream;
  }

  export default Env;
}
