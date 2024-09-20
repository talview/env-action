import { filter, startsWith, get } from 'lodash'
import * as core from '@actions/core'
import { PromiseExtended } from './promise'
import Kv from './kv'

export async function setup(prefix: string): Promise<void> {
  const items = filter(Object.keys(process.env), (i: string) => startsWith(i, `${prefix}_`) || startsWith(i, `KV_`))
  await PromiseExtended.map(items, async (k: string): Promise<void> => {
    try {
      const key = get(k.split(`${prefix}_`), '1') || get(k.split(`KV_`), '1')
      const value: string = await Kv.getSecret(prefix, key)
      core.exportVariable(key, value)
      core.setSecret(`${value}`)
    } catch (err) {
      core.setFailed(`err: ${err}`)
    }
  })
}
