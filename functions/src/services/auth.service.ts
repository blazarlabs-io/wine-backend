import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { error, log } from 'firebase-functions/logger';
import type {
    AdminUser,
    DeleteUser,
    NewUser,
    GetUserTierAndLevel,
    UpdateUserTierAndLevel,
    AuthUser,
} from '../models/auth.models';
import { auth, db, storage } from '../lib/firebase/admin';

export const createNewUser = functions.https.onCall(
    async (data: NewUser, context) => {
        try {
            // Check if the request is authenticated
            if (!context.auth) {
                error('User is not authenticated');
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    'You must be authenticated to create a user.'
                );
            }

            // Create the user using Firebase Authentication
            const userRecord = await auth.createUser({
                email: data.data.email,
                password: data.data.password,
            });

            await db.collection('wineries').doc(userRecord.uid).set({
                tier: data.data.tier,
                level: data.data.level,
                generalInfo: {},
                euLabels: [],
                wines: [],
            });

            log('User created successfully');

            // Return the user record
            return {
                uid: userRecord.uid,
                email: data.data.email,
                password: data.data.password,
                tier: data.data.tier,
                level: data.data.level,
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

export const deleteUser = functions.https.onCall(
    async (data: DeleteUser, context) => {
        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    'You must be authenticated to delete a user.'
                );
            }

            await auth.deleteUser(data.data.uid);

            return {
                message: 'User deleted successfully',
            };
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const createFirestoreForUser = functions.auth
    .user()
    .onCreate(async (user) => {
        const sysVarsRef = await db
            .collection('utils')
            .doc('systemVariables')
            .get();

        const sysVars = sysVarsRef.data();

        if (sysVars) {
            await db.collection('wineries').doc(user.uid).set({
                tier: sysVars.default.tier,
                level: sysVars.default.level,
                generalInfo: {},
                euLabels: [],
                wines: [],
            });
        }

        return {
            message: 'Firestore document created successfully',
        };
    });

export const deleteFirestoreForUser = functions.auth
    .user()
    .onDelete(async (user) => {
        const bucket = storage.bucket();

        await bucket.deleteFiles({
            prefix: `images/${user.uid}`,
        });

        return db.collection('wineries').doc(user.uid).delete();
    });

export const listAllUsers = functions.https.onCall(
    async (data: null, context) => {
        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    'You must be authenticated to list users.'
                );
            }

            const listUsers = await admin.auth().listUsers();

            return listUsers;
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const isUserAdmin = functions.https.onCall(
    async (data: AdminUser, context) => {
        log('Checking if user is an admin', data.data.email);

        try {
            const resData = await db.collection('utils').doc('users').get();

            log('User is an admin', resData.data());

            const adminObj = resData.data()?.admin;

            const isUserAdmin = adminObj.includes(data.data.email);

            log('Is user an admin?', isUserAdmin);

            return isUserAdmin;
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const getUserTierAndLevel = functions.https.onCall(
    async (data: GetUserTierAndLevel, context) => {
        log('Getting user tier and level', data.data.uid);

        try {
            const resData = await db
                .collection('wineries')
                .doc(data.data.uid)
                .get();

            log('User tier and level', resData.data());

            const tier = resData.data()?.tier;
            const level = resData.data()?.level;

            return { tier, level };
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const updateUserTierAndLevel = functions.https.onCall(
    async (data: UpdateUserTierAndLevel, context) => {
        log('Updating user tier and level', data.data.uid);

        try {
            await db.collection('wineries').doc(data.data.uid).update({
                tier: data.data.tier,
                level: data.data.level,
            });

            return {
                message: 'User tier and level updated successfully',
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

export const getWineryName = functions.https.onCall(
    async (data: AuthUser, context) => {
        log('Getting winery name', data.data.uid);

        try {
            const resData = await db
                .collection('wineries')
                .doc(data.data.uid)
                .get();

            log('Winery name', resData.data());

            const generalInfo = resData.data()?.generalInfo;

            return generalInfo?.name;
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);
