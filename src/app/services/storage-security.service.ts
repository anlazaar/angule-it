import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageSecurityService {
  private readonly SECRET = 'AngulIT2026!';

  /**
   * Signs data by hashing SECRET + data.
   */
  async sign(data: string): Promise<string> {
    const encoder = new TextEncoder();

    const bytes = encoder.encode(this.SECRET + data);

    const hash = await crypto.subtle.digest('SHA-256', bytes);

    return this.toHex(new Uint8Array(hash));
  }

  /**
   * Returns true if the data has not been modified.
   */
  async verify(data: string, signature: string): Promise<boolean> {
    const expected = await this.sign(data);
    return expected === signature;
  }

  private toHex(bytes: Uint8Array): string {
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  }
}
