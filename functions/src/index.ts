import {
    createNewUser,
    deleteUser,
    deleteFirestoreForUser,
    listAllUsers,
    isUserAdmin,
    getUserTierAndLevel,
    updateUserTierAndLevel,
} from './services/auth.service';
import { sendEmail } from './services/email.service';

// Auth
exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;
exports.deleteFirestoreForUser = deleteFirestoreForUser;
exports.listAllUsers = listAllUsers;
exports.isUserAdmin = isUserAdmin;
exports.getUserTierAndLevel = getUserTierAndLevel;
exports.updateUserTierAndLevel = updateUserTierAndLevel;

// Email
exports.sendEmail = sendEmail;
