import { filter, startsWith } from 'lodash'
import * as core from '@actions/core'
import { PromiseExtended } from './promise'
import Kv from './kv'

export async function setup(prefix: string): Promise<void> {
  const items = filter(Object.keys(process.env), (i: string) => startsWith(i, `${prefix}_`))
  await PromiseExtended.map(items, async (k: string): Promise<void> => {
    const key = k.split(`${prefix}_`)[1]
    const value: string = await Kv.getSecret(prefix, key)
    core.exportVariable(key, value)
    core.setSecret(`${value}`)
  })
}
