import { RouterContext } from "https://deno.land/x/oak@v10.6.0/mod.ts";

export const validateId = async <T extends string>(ctx: RouterContext<T>, next: () => Promise<unknown>) => {
  const id = +ctx.params.id!;
  if (Number.isNaN(id)) {
    ctx.response.status = 400
    ctx.response.body = {
      succes: false,
      msg: "Id must be a number"
    }
    return
  }
  await next()
}