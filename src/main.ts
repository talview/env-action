import * as core from '@actions/core'
import { setup } from './env'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

export async function run(): Promise<void> {
  try {
    // const version = process.env.VERSION as Version
    const SVC_PREFIX: string = process.env.SERVICE_PREFIX!
    const SECRETS: any = process.env.SECRETS_CONTEXT!
    await setup(SVC_PREFIX, SECRETS)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
