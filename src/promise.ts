export class PromiseExtended<T> extends Promise<T> {
  // eslint-disable-next-line @typescript-eslint/ban-types
  static async map(it: any[], func: Function, options?: { concurrency?: number }): Promise<any[]> {
    const res: any[] = []
    await Promise.allSettled(
      Array(options?.concurrency || 3)
        .fill(Array.from(it).entries())
        .map(async iterator => {
          for (const [, item] of iterator) {
            try {
              const i = await func(item)
              res.push(i)
            } catch (e) {
              console.log(e)
            }
          }
        })
    )
    return res
  }
}

export default PromiseExtended
