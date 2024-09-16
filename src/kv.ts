import { DefaultAzureCredential } from '@azure/identity'
import { type KeyVaultSecret, SecretClient } from '@azure/keyvault-secrets'
import { get, set } from 'lodash'
import * as core from '@actions/core'

export class KeyVaultClient {
  static #instance: KeyVaultClient
  #client: SecretClient
  #keys: any = {}

  private constructor() {
    const credentials = new DefaultAzureCredential()
    // uses AZURE_CLIENT_ID,AZURE_TENANT_ID,AZURE_CLIENT_SECRET env vars
    this.#client = new SecretClient(process.env.AZURE_VAULT_URI!, credentials)
  }

  static get Instance(): KeyVaultClient {
    return this.#instance || (this.#instance = new this())
  }

  async getSecret(prefix: string, key: string): Promise<string> {
    let value = get(this.#keys, key) // in memory cache
    if (!value) {
      const k = key.replace(/_/g, '-')
      core.info(`fetching... ${k}`)
      const secret: KeyVaultSecret = await this.#client.getSecret(`${prefix}-${k}`)
      value = get(secret, 'value')
      core.info(value)
      if (!value) throw new Error(`Secret ${k} not found in service ${prefix}`)
      this.#keys = set(this.#keys, key, value)
    }
    return value
  }
}

export default KeyVaultClient.Instance
