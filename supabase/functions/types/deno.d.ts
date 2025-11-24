declare namespace Deno {
  interface EnvAccessor {
    get(key: string): string | undefined;
  }

  const env: EnvAccessor;
}

declare module "https://deno.land/std@0.168.0/http/server.ts" {
  export function serve(
    handler: (request: Request) => Response | Promise<Response>,
  ): Promise<void>;
}
