import * as admin from 'firebase-admin';
import credentials from '../credentials.json'
admin.initializeApp({
    credential: admin.credential.cert(credentials as admin.ServiceAccount),
});

export default admin;

