import {
    createNewUser,
    deleteUser,
    deleteFirestoreForUser,
    listAllUsers,
    isUserAdmin,
} from './services/auth.service';
import { sendEmail } from './services/email.service';

// Auth
exports.createNewUser = createNewUser;
exports.deleteUser = deleteUser;
exports.deleteFirestoreForUser = deleteFirestoreForUser;
exports.listAllUsers = listAllUsers;
exports.isUserAdmin = isUserAdmin;

// Email
exports.sendEmail = sendEmail;
