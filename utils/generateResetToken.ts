import jwt from 'jsonwebtoken';

interface ResetTokenInput {
	email: string;
	role:string;
	userType:string
}

const generateResetToken = ({ email,role, userType }: ResetTokenInput): string => {
	const resetToken = jwt.sign(
		{
			email: email,
			role:role,
			userType:userType
		},
		`${process.env.SECRETKEY}`,
		{ expiresIn: '1h' } // Set the reset token expiration time as needed
	);

	return resetToken;
};

export default generateResetToken;
