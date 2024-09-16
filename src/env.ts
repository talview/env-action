import { keys, reduce, filter, startsWith } from 'lodash'
import { PromiseExtended } from './promise'
import Kv from './kv'
export async function setup(prefix: string): Promise<void> {
  const items = filter(keys(process.env), (i: string) => startsWith(i, 'INPUT_ENVKEY_') && !startsWith(i, 'INPUT_ENVKEY_AZURE_'))
  console.log(items)
  const res = await PromiseExtended.map(items, async (k: string): Promise<string> => {
    const key = k.split('INPUT_ENVKEY_')[1]
    const value: string = await Kv.getSecret(prefix, key)
    return `\n${key}=${value}`
  })
  const env = reduce(res, (acc, i) => `${acc}${i}`)
  const current = process.env.GITHUB_ENV
  process.env.GITHUB_ENV = `${current}${env}`
}
