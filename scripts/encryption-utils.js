// scripts/encryption-utils.js
class EncryptionUtils {
    static encryptionKey = 'my-secure-encryption-key-12345';

    static stringToArrayBuffer(str) {
        const encoder = new TextEncoder();
        return encoder.encode(str);
    }

    static arrayBufferToString(buffer) {
        const decoder = new TextDecoder();
        return decoder.decode(buffer);
    }

    static base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    static arrayBufferToBase64(buffer) {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    static async deriveKey(password, salt) {
        const encoder = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveKey']
        );
        return window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        );
    }

    static async encrypt(plaintext) {
        try {
            const encoder = new TextEncoder();
            const data = encoder.encode(plaintext);
            const salt = window.crypto.getRandomValues(new Uint8Array(16));
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            
            const key = await this.deriveKey(this.encryptionKey, 'fixed-salt-for-now');
            const encrypted = await window.crypto.subtle.encrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                data
            );

            const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
            combined.set(salt, 0);
            combined.set(iv, salt.length);
            combined.set(new Uint8Array(encrypted), salt.length + iv.length);
            
            return this.arrayBufferToBase64(combined.buffer);
        } catch (error) {
            console.error('Encryption failed:', error);
            throw error;
        }
    }

    static async decrypt(encryptedData) {
        try {
            const combined = this.base64ToArrayBuffer(encryptedData);
            const combinedArray = new Uint8Array(combined);
            const salt = combinedArray.slice(0, 16);
            const iv = combinedArray.slice(16, 28);
            const encrypted = combinedArray.slice(28);

            const key = await this.deriveKey(this.encryptionKey, 'fixed-salt-for-now');
            const decrypted = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: iv
                },
                key,
                encrypted
            );
            
            return this.arrayBufferToString(decrypted);
        } catch (error) {
            console.error('Decryption failed:', error);
            throw error;
        }
    }
}