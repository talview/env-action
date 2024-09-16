import { keys, reduce, filter, startsWith } from 'lodash'
import { PromiseExtended } from './promise'
import Kv from './kv'
export async function setup(prefix: string, secrets: any): Promise<void> {
  const items = filter(keys(secrets), i => !startsWith(i, 'AZURE'))
  const res = await PromiseExtended.map(items, async (key: string): Promise<string> => {
    const value: string = await Kv.getSecret(prefix, key)
    return `\n${key}=${value}`
  })
  const env = reduce(res, (acc, i) => `${acc}${i}`)
  const current = process.env.GITHUB_ENV
  process.env.GITHUB_ENV = `${current}${env}`
  console.log(process.env.GITHUB_ENV)
}
