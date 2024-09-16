import { reduce, filter, startsWith } from 'lodash'
import * as core from '@actions/core'
import { PromiseExtended } from './promise'
import Kv from './kv'
export async function setup(prefix: string): Promise<void> {
  const items = filter(Object.keys(process.env), (i: string) => startsWith(i, `${prefix}_`))
  const res = await PromiseExtended.map(items, async (k: string): Promise<string> => {
    const key = k.split(`${prefix}_`)[1]
    console.log(key)
    const value: string = await Kv.getSecret(prefix, key)
    console.log(value)
    return `\n${key}=${value}`
  })
  core.info(res.toString())
  const env = reduce(res, (acc, i) => `${acc}${i}`)
  const current = process.env.GITHUB_ENV
  core.info(env)
  process.env.GITHUB_ENV = `${current}${env}`
}
