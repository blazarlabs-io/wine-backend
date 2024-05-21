/* eslint-disable @typescript-eslint/no-explicit-any */
import { log, error } from 'firebase-functions/logger';
import { db, storage } from '../lib/firebase/admin';
import * as functions from 'firebase-functions';
import {
    CreateAdminNotification,
    CreateWineType,
    CreateWinery,
    LevelMap,
    NewWineryField,
    StringArray,
} from '../models/db.models';
import { NOTIFICATIONS, UTILS, WINERIES } from '../constants/collections';
import { SYSTEM_VARIABLES } from '../constants/documents';
import * as admin from 'firebase-admin';

export const createNotification = functions.https.onCall(
    async (data: CreateAdminNotification) => {
        const id = data.data.wineryName.replace(/\s/g, '').toLocaleLowerCase();
        log('Creating notification', id);

        try {
            const docRef = await db.collection(NOTIFICATIONS).doc(id).get();

            if (docRef.exists) {
                return {
                    exists: true,
                    message: 'Notification already exists',
                };
            } else {
                await db.collection(NOTIFICATIONS).doc(id).set(data.data);

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
    async (data: CreateAdminNotification) => {
        const id = data.data.wineryName.replace(/\s/g, '').toLocaleLowerCase();
        log('Deleting notification', id);

        try {
            await db.collection(NOTIFICATIONS).doc(id).delete();

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

export const getWineTypesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const wineTypes = sysVars?.data()?.wineTypes;

        return {
            wineTypes,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createNewFieldWineriesDb = functions.https.onCall(
    async (data: NewWineryField) => {
        const field = data.data.field;
        const value = data.data.value;

        try {
            const wineries = await db.collection(WINERIES).get();

            wineries.forEach(async (doc) => {
                await db
                    .collection(WINERIES)
                    .doc(doc.id)
                    .update({
                        [field]: value,
                    });
            });
            return {
                message: 'Wine type added successfully',
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

export const getFileDownloadUrlByPath = functions.https.onCall(
    async (data: { path: string }) => {
        const filePath = data.path;

        log('Getting download URL for file', filePath);

        try {
            const downloadURL = await storage
                .bucket()
                .file(filePath)
                .getSignedUrl({
                    action: 'read',
                    expires: '03-01-2500', // Adjust the expiration as needed
                });

            // Return the download URL to the client
            return { downloadURL };
        } catch (err) {
            error('An error occurred', err);
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);

export const replaceDbFieldName = functions.https.onCall(
    async (data, context) => {
        const { collectionName, oldFieldName, newFieldName } = data;

        if (!collectionName || !oldFieldName || !newFieldName) {
            throw new functions.https.HttpsError(
                'invalid-argument',
                'Missing required parameters'
            );
        }

        const collectionRef = db.collection(collectionName);
        const querySnapshot = await collectionRef.get();

        const batch = db.batch();

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data[oldFieldName]) {
                batch.update(doc.ref, { [newFieldName]: data[oldFieldName] });
                // Delete the old field after setting the new field
                batch.update(doc.ref, {
                    [oldFieldName]: admin.firestore.FieldValue.delete(),
                });
            }
        });

        await batch.commit();

        return {
            message: `Field name '${oldFieldName}' replaced with '${newFieldName}' for ${querySnapshot.size} docs.`,
        };
    }
);

export const createLevelMapInDb = functions.https.onCall(
    async (data: LevelMap, context) => {
        const levelMap = data.data;

        log('Creating level map', levelMap);

        try {
            await db
                .collection(UTILS)
                .doc(SYSTEM_VARIABLES)
                .update({ level: levelMap });

            return {
                message: 'Level map created successfully',
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

export const getTotalIncome = functions.https.onCall(async () => {
    try {
        const wineriesRef = await db.collection(WINERIES);
        const wineries = await wineriesRef.get();
        let totalIncome = 0;

        wineries.forEach(async (doc) => {
            const data = doc.data();
            const level = data.level;
            const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
            const sysVars = await sysVarsRef.get();
            const levelMap = sysVars?.data()?.level;
            const price = level && levelMap[level].price;
            totalIncome += price;
        });

        return {
            totalIncome,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createWineColourDb = functions.https.onCall(
    async (data: StringArray) => {
        const wineColours = data.data;

        log('Creating wine colours', wineColours);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                wineColours: wineColours,
            });

            return {
                message: 'Wine colours added successfully',
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

export const getWineColoursDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const wineColours = sysVars?.data()?.wineColours;

        return {
            wineColours,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const updateWineColoursDb = functions.https.onCall(
    async (data: StringArray) => {
        const wineColours = data.data;

        log('Updating wine colours', wineColours);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                wineColours: wineColours,
            });

            return {
                message: 'Wine colours updated successfully',
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

export const createAromaProfileDb = functions.https.onCall(
    async (data: StringArray) => {
        const aromaProfiles = data.data;

        log('Creating aroma profiles', aromaProfiles);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                aromaProfiles: aromaProfiles,
            });

            return {
                message: 'Aroma profiles added successfully',
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

export const getAromaProfilesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const aromaProfiles = sysVars?.data()?.aromaProfiles;

        return {
            aromaProfiles,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createFlavourProfileDb = functions.https.onCall(
    async (data: StringArray) => {
        const flavourProfiles = data.data;

        log('Creating flavour profiles', flavourProfiles);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                flavourProfiles: flavourProfiles,
            });

            return {
                message: 'Flavour profiles added successfully',
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

export const getFlavourProfilesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const flavourProfiles = sysVars?.data()?.flavourProfiles;

        return {
            flavourProfiles,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createSustainabilityPracticesDb = functions.https.onCall(
    async (data: StringArray) => {
        const sustainabilityPractices = data.data;

        log('Creating sustainability practices', sustainabilityPractices);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                sustainabilityPractices: sustainabilityPractices,
            });

            return {
                message: 'Sustainability practices added successfully',
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

export const getSustainabilityPracticesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const sustainabilityPractices =
            sysVars?.data()?.sustainabilityPractices;

        return {
            sustainabilityPractices,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createClosureTypesDb = functions.https.onCall(
    async (data: StringArray) => {
        const closureTypes = data.data;

        log('Creating closure types', closureTypes);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                closureTypes: closureTypes,
            });

            return {
                message: 'Closure types added successfully',
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

export const getClosureTypesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const closureTypes = sysVars?.data()?.closureTypes;

        return {
            closureTypes,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const createIrrigationPracticesDb = functions.https.onCall(
    async (data: StringArray) => {
        const irrigationPractices = data.data;

        log('Creating irrigation practices', irrigationPractices);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                irrigationPractices: irrigationPractices,
            });

            return {
                message: 'Irrigation practices added successfully',
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

export const getIrrigationPracticesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const irrigationPractices = sysVars?.data()?.irrigationPractices;

        return {
            irrigationPractices,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const updateWineTypesDb = functions.https.onCall(
    async (data: CreateWineType) => {
        const wineTypes = data.data;

        log('Updating wine types', wineTypes);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                wineTypes: wineTypes,
            });

            return {
                message: 'Wine type added successfully',
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

export const createWineBottleSizesDb = functions.https.onCall(
    async (data: StringArray) => {
        const wineBottleSizes = data.data;

        log('Creating wine bottle sizes', wineBottleSizes);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                wineBottleSizes: wineBottleSizes,
            });

            return {
                message: 'Wine bottle sizes added successfully',
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

export const getWineBottleSizesDb = functions.https.onCall(async () => {
    try {
        const sysVarsRef = db.collection(UTILS).doc(SYSTEM_VARIABLES);
        const sysVars = await sysVarsRef.get();
        const wineBottleSizes = sysVars?.data()?.wineBottleSizes;

        return {
            wineBottleSizes,
        };
    } catch (err) {
        error('An error occurred', err);
        throw new functions.https.HttpsError('internal', 'An error occurred.');
    }
});

export const updateWineBottleSizesDb = functions.https.onCall(
    async (data: StringArray) => {
        const wineBottleSizes = data.data;

        log('Updating wine bottle sizes', wineBottleSizes);

        try {
            await db.collection(UTILS).doc(SYSTEM_VARIABLES).update({
                wineBottleSizes: wineBottleSizes,
            });

            return {
                message: 'Wine bottle sizes updated successfully',
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

export const registerWineryGeneralInfoToDb = functions.https.onCall(
    async (data: CreateWinery) => {
        const { uid, generalInfo } = data;

        log('Registering winery general info', generalInfo);

        try {
            await db
                .collection(WINERIES)
                .doc(uid)
                .set({ generalInfo: generalInfo }, { merge: true });

            return {
                message: 'Winery general info registered successfully',
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
