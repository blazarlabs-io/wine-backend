import { log, error } from 'firebase-functions/logger';
import { db } from '../lib/firebase/admin';
import * as functions from 'firebase-functions';
import { CreateAdminNotification } from '../models/db.models';

export const createNotification = functions.https.onCall(
    async (data: CreateAdminNotification, context) => {
        const id = data.data.wineryName.replace(/\s/g, '').toLocaleLowerCase();
        log('Creating notification', id);

        try {
            const docRef = await db.collection('notifications').doc(id).get();

            if (docRef.exists) {
                return {
                    exists: true,
                    message: 'Notification already exists',
                };
            } else {
                await db.collection('notifications').doc(id).set(data.data);

                return {
                    exists: false,
                    message: 'Notification created successfully',
                };
            }
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const deleteNotification = functions.https.onCall(
    async (data: CreateAdminNotification, context) => {
        const id = data.data.wineryName.replace(/\s/g, '').toLocaleLowerCase();
        log('Deleting notification', id);

        try {
            await db.collection('notifications').doc(id).delete();

            return {
                message: 'Notification deleted successfully',
            };
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);
