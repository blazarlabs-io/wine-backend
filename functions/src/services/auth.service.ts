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
    UpdatePassword,
} from '../models/auth.models';
import { auth, db, storage } from '../lib/firebase/admin';
import { TRASH, UTILS, WINERIES } from '../constants/collections';
import { SYSTEM_VARIABLES, USERS } from '../constants/documents';

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

            await db.collection(WINERIES).doc(userRecord.uid).set({
                tier: data.data.tier,
                level: data.data.level,
                generalInfo: {},
                euLabels: [],
                wines: [],
                disabled: false,
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

export const disableUser = functions.https.onCall(
    async (data: DeleteUser, context) => {
        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    'You must be authenticated to disable a user.'
                );
            }

            await auth.updateUser(data.data.uid, {
                disabled: true,
            });

            await db.collection(WINERIES).doc(data.data.uid).update({
                disabled: true,
            });

            return {
                message: 'User disabled successfully',
            };
        } catch (error) {
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

            const docRef = await db
                .collection(WINERIES)
                .doc(data.data.uid)
                .get();

            const backup = docRef.data();
            await db.collection(TRASH).doc(data.data.uid).set({ backup });

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

export const updateUserPassword = functions.https.onCall(
    async (data: UpdatePassword) => {
        try {
            await auth.updateUser(data.data.uid, {
                password: data.data.password,
            });

            return {
                message: 'User password updated successfully',
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
            .collection(UTILS)
            .doc(SYSTEM_VARIABLES)
            .get();

        const sysVars = sysVarsRef.data();

        if (sysVars) {
            await db.collection(WINERIES).doc(user.uid).set({
                tier: sysVars.default.tier,
                level: sysVars.default.level,
                generalInfo: {},
                euLabels: [],
                wines: [],
                disabled: false,
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

        return db.collection(WINERIES).doc(user.uid).delete();
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

export const isUserAdmin = functions.https.onCall(async (data: AdminUser) => {
    log('Checking if user is an admin', data.data.email);

    try {
        const resData = await db.collection(UTILS).doc(USERS).get();

        log('User is an admin', resData.data());

        const adminObj = resData.data()?.admin;

        const isUserAdmin = adminObj.includes(data.data.email);

        log('Is user an admin?', isUserAdmin);

        return isUserAdmin;
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const getUserTierAndLevel = functions.https.onCall(
    async (data: GetUserTierAndLevel) => {
        log('Getting user tier and level', data.data.uid);

        try {
            const resData = await db
                .collection(WINERIES)
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
    async (data: UpdateUserTierAndLevel) => {
        log('Updating user tier and level', data.data.uid);

        try {
            await db.collection(WINERIES).doc(data.data.uid).update({
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

export const getWineryName = functions.https.onCall(async (data: AuthUser) => {
    log('Getting winery name', data.data.uid);

    try {
        const resData = await db.collection(WINERIES).doc(data.data.uid).get();

        log('Winery name', resData.data());

        const generalInfo = resData.data()?.generalInfo;

        return generalInfo?.name;
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});
