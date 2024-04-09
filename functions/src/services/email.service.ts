import * as dotenv from 'dotenv';
import * as sgMail from '@sendgrid/mail';
import * as functions from 'firebase-functions';
import { SendEmail } from '../models/email.models';
import { log } from 'firebase-functions/logger';
dotenv.config();

export const sendEmail = functions.https.onCall(
    async (data: SendEmail, context) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

        log('Sending email', data.data);

        try {
            if (!context.auth) {
                throw new functions.https.HttpsError(
                    'unauthenticated',
                    'You must be authenticated to send a password reset email.'
                );
            }

            const msg = {
                to: data.data.to,
                from: data.data.from,
                subject: data.data.subject,
                text: data.data.text,
                html: data.data.html,
            };
            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent');
                })
                .catch((error) => {
                    console.error(error);
                });
            return {
                message: 'Email sent',
            };
        } catch (error) {
            throw new functions.https.HttpsError(
                'internal',
                'An error occurred.'
            );
        }
    }
);
