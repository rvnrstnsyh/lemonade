// deno-lint-ignore-file no-console

import { join } from '$std/path/mod.ts'
import { ensureDir, exists } from '$std/fs/mod.ts'

/**
 * Ed25519 Key Management System for Deno
 * - Generate Ed25519 key pairs for EdDSA/JWT
 * - Save keys to files with versioning
 * - Rotate keys while preserving old ones
 */

interface KeyPair {
	privateKey: string
	publicKey: string
	createdAt: string
	version: number
}

interface KeyStore {
	currentVersion: number
	keys: KeyPair[]
}

const KEYS_DIR: string = './.keys'
const KEY_STORE_FILE: string = join(KEYS_DIR, 'keystore.json')

/**
 * Convert ArrayBuffer to PEM format
 */
function toPEM(buffer: ArrayBuffer, label: string): string {
	const base64: string = btoa(String.fromCharCode(...new Uint8Array(buffer))).replace(/(.{64})/g, '$1\n').trim()
	return `-----BEGIN ${label}-----\n${base64}\n-----END ${label}-----\n`
}

/**
 * Initialize keys directory
 */
async function initKeysDirectory(): Promise<void> {
	await ensureDir(KEYS_DIR)
	console.log(`Keys directory ready (${KEYS_DIR})`)
}

/**
 * Load existing keystore or create new one
 */
async function loadKeyStore(): Promise<KeyStore> {
	try {
		if (await exists(KEY_STORE_FILE)) {
			const data: string = await Deno.readTextFile(KEY_STORE_FILE)
			return JSON.parse(data)
		}
	} catch (_error) {
		console.warn('Could not load keystore, creating new one')
	}
	return {
		currentVersion: 0,
		keys: [],
	}
}

/**
 * Save keystore to file
 */
async function saveKeyStore(keyStore: KeyStore): Promise<void> {
	await Deno.writeTextFile(KEY_STORE_FILE, JSON.stringify(keyStore, null, 2))
}

/**
 * Generate Ed25519 key pair for EdDSA signatures
 */
async function generateKeyPair(): Promise<{ privateKey: string; publicKey: string }> {
	const keyPair: CryptoKeyPair = await crypto.subtle.generateKey(
		'Ed25519',
		true,
		['sign', 'verify'],
	)
	// Export PKCS8 private key
	const privateBuf: ArrayBuffer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey)
	const privatePem: string = toPEM(privateBuf, 'PRIVATE KEY')
	// Export SPKI public key
	const publicBuf: ArrayBuffer = await crypto.subtle.exportKey('spki', keyPair.publicKey)
	const publicPem: string = toPEM(publicBuf, 'PUBLIC KEY')

	return {
		privateKey: privatePem,
		publicKey: publicPem,
	}
}

/**
 * Save individual key files
 */
async function saveKeyFiles(version: number, privateKey: string, publicKey: string): Promise<void> {
	const privateKeyPath: string = join(KEYS_DIR, `private-v${version}.pem`)
	const publicKeyPath: string = join(KEYS_DIR, `public-v${version}.pem`)

	await Deno.writeTextFile(privateKeyPath, privateKey)
	await Deno.writeTextFile(publicKeyPath, publicKey)
}

/**
 * Generate and save new key pair
 */
async function createNewKeyPair(): Promise<KeyStore> {
	await initKeysDirectory()

	const keyStore: KeyStore = await loadKeyStore()
	const newVersion: number = keyStore.currentVersion + 1

	console.log(`Generating Ed25519 key pair (version ${newVersion})...`)

	const { privateKey, publicKey }: {
		privateKey: string
		publicKey: string
	} = await generateKeyPair()

	// Save to individual files
	await saveKeyFiles(newVersion, privateKey, publicKey)

	// Add to keystore
	const newKeyPair: KeyPair = {
		privateKey,
		publicKey,
		createdAt: new Date().toISOString(),
		version: newVersion,
	}

	keyStore.keys.push(newKeyPair)
	keyStore.currentVersion = newVersion

	// Save keystore
	await saveKeyStore(keyStore)

	console.log(`Key pair successfully generated (PKCS8/SPKI)`)

	return keyStore
}

/**
 * Rotate keys - generate new key pair while keeping old ones
 */
async function rotateKeys(): Promise<KeyStore> {
	const keyStore: KeyStore = await loadKeyStore()

	if (keyStore.keys.length === 0) {
		console.log('No existing keys found, creating first key pair...')
		return await createNewKeyPair()
	}

	console.log(`Rotating keys from version ${keyStore.currentVersion}...`)
	console.log(`Preserving ${keyStore.keys.length} previous key(s)`)

	const newKeyStore: KeyStore = await createNewKeyPair()

	console.log(`Key rotation complete:`)
	console.log(`  - Current version: ${newKeyStore.currentVersion}`)
	console.log(`  - Total keys stored: ${newKeyStore.keys.length}`)
	console.log(`  - Previous versions: ${newKeyStore.keys.slice(0, -1).map((k) => `v${k.version}`).join(', ') || 'none'}`)

	return newKeyStore
}

/**
 * List all stored keys
 */
async function listKeys(): Promise<void> {
	const keyStore: KeyStore = await loadKeyStore()

	if (keyStore.keys.length === 0) {
		console.log('No keys found in keystore')
		return
	}

	console.log('Stored Keys:')
	console.log('─'.repeat(70))

	keyStore.keys.forEach((key) => {
		const isCurrent: boolean = key.version === keyStore.currentVersion
		const marker: string = isCurrent ? '  Current ' : '  Archived'
		console.log(`${marker} │ Version ${key.version} │ Created: ${new Date(key.createdAt).toLocaleString()}`)
	})

	console.log('─'.repeat(70))
	console.log(`Total: ${keyStore.keys.length} key pair(s)\n`)
}

// Export functions
export { listKeys, loadKeyStore, rotateKeys }

// CLI usage
if (import.meta.main) {
	switch (Deno.args[0]) {
		case 'rotate':
			await rotateKeys()
			break
		case 'list':
			await listKeys()
			break
		default:
			console.log('Usage:')
			console.log('  deno run --allow-read --allow-write .scripts/key-manager.ts rotate    # Rotate keys (keeps old ones)')
			console.log('  deno run --allow-read --allow-write .scripts/key-manager.ts list      # List all stored keys')
	}
}
