import {
    createNewUser,
    deleteUser,
    disableUser,
    deleteFirestoreForUser,
    listAllUsers,
    isUserAdmin,
    getUserTierAndLevel,
    updateUserTierAndLevel,
    getWineryName,
    createFirestoreForUser,
    updateUserPassword,
} from './services/auth.service';
import { sendEmail } from './services/email.service';
import {
    deleteNotification,
    createNotification,
    updateWineTypesDb,
    getWineTypesDb,
    createNewFieldWineriesDb,
    getFileDownloadUrlByPath,
    replaceDbFieldName,
    createLevelMapInDb,
    getTotalIncome,
    createWineColourDb,
    getWineColoursDb,
    createWineBottleSizesDb,
    getWineBottleSizesDb,
    updateWineColoursDb,
    updateWineBottleSizesDb,
    createAromaProfileDb,
    getAromaProfilesDb,
    createFlavourProfileDb,
    getFlavourProfilesDb,
    createSustainabilityPracticesDb,
    getSustainabilityPracticesDb,
    createClosureTypesDb,
    getClosureTypesDb,
    createIrrigationPracticesDb,
    getIrrigationPracticesDb,
    registerWineryGeneralInfoToDb,
} from './services/db.service';

// Auth
exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;
exports.disableUser = disableUser;
exports.deleteFirestoreForUser = deleteFirestoreForUser;
exports.listAllUsers = listAllUsers;
exports.isUserAdmin = isUserAdmin;
exports.getUserTierAndLevel = getUserTierAndLevel;
exports.updateUserTierAndLevel = updateUserTierAndLevel;
exports.getWineryName = getWineryName;
exports.createFirestoreForUser = createFirestoreForUser;
exports.updateUserPassword = updateUserPassword;

// Email
exports.sendEmail = sendEmail;

// DB
exports.deleteNotification = deleteNotification;
exports.createNotification = createNotification;
exports.updateWineTypesDb = updateWineTypesDb;
exports.getWineTypesDb = getWineTypesDb;
exports.createNewFieldWineriesDb = createNewFieldWineriesDb;
exports.getFileDownloadUrlByPath = getFileDownloadUrlByPath;
exports.replaceDbFieldName = replaceDbFieldName;
exports.createLevelMapInDb = createLevelMapInDb;
exports.getTotalIncome = getTotalIncome;
exports.createWineColourDb = createWineColourDb;
exports.getWineColoursDb = getWineColoursDb;
exports.createWineBottleSizesDb = createWineBottleSizesDb;
exports.getWineBottleSizesDb = getWineBottleSizesDb;
exports.updateWineColoursDb = updateWineColoursDb;
exports.updateWineBottleSizesDb = updateWineBottleSizesDb;
exports.createAromaProfileDb = createAromaProfileDb;
exports.getAromaProfilesDb = getAromaProfilesDb;
exports.createFlavourProfileDb = createFlavourProfileDb;
exports.getFlavourProfilesDb = getFlavourProfilesDb;
exports.createSustainabilityPracticesDb = createSustainabilityPracticesDb;
exports.getSustainabilityPracticesDb = getSustainabilityPracticesDb;
exports.createClosureTypesDb = createClosureTypesDb;
exports.getClosureTypesDb = getClosureTypesDb;
exports.createIrrigationPracticesDb = createIrrigationPracticesDb;
exports.getIrrigationPracticesDb = getIrrigationPracticesDb;
exports.registerWineryGeneralInfoToDb = registerWineryGeneralInfoToDb;
