import {
    createNewUser,
    deleteUser,
    deleteFirestoreForUser,
    listAllUsers,
    isUserAdmin,
    getUserTierAndLevel,
    updateUserTierAndLevel,
    getWineryName,
} from './services/auth.service';
import { sendEmail } from './services/email.service';
import { deleteNotification, createNotification } from './services/db.service';

// Auth
exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;
exports.deleteFirestoreForUser = deleteFirestoreForUser;
exports.listAllUsers = listAllUsers;
exports.isUserAdmin = isUserAdmin;
exports.getUserTierAndLevel = getUserTierAndLevel;
exports.updateUserTierAndLevel = updateUserTierAndLevel;
exports.getWineryName = getWineryName;

// Email
exports.sendEmail = sendEmail;

// DB
exports.deleteNotification = deleteNotification;
exports.createNotification = createNotification;
