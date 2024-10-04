import sgMail from '@sendgrid/mail';
import { Env } from '../types/types';

export const sendEmail = async (to: string, subject: string, text: string, env: Env) => {
	sgMail.setApiKey(env.SENDGRID_API_KEY);
	const msg = {
		to,
		from: 'shaeel678@gmail.com',
		subject,
		text,
	};
	try {
		await sgMail.send(msg);
		console.log(`Email sent to ${to}`);
	} catch (error: ErrorEvent | any) {
		console.error(`Error sending email: ${error}`);
		if (error.response) {
			console.error(error.response.body);
		}
		throw error;
	}
};
