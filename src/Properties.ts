//productor.comercial@foxtelecolombia.com
//Foxtc019
import { ENV } from '@app/env';

export class Properties {
    static get publicKey() {
        return 'U2FsdGVkX1+oic7V0jANGL8Ib1C20NIRqhyH53ZSxt0=';
    }
    static get baseUrl(): string {
        switch (ENV.production) {
            case 'qa':
                return '';
            case 'staging':
                return 'http://192.168.1.40:19899';
            case 'prod':
                return 'http://190.217.118.237';
            default:
                return 'http://190.217.118.235:19899';                
        }
    }
}
