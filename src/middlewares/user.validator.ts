export const userValidator = {
    firstname: {
        notEmpty: {
            errorMessage: 'Firstname is required'
        }
    },
    lastname: {
        notEmpty: {
            errorMessage: 'Lastname is required'
        }
    },
    mail: {
        
        notEmpty: {
            errorMessage: 'Email is required'
        },
        isEmail: {
            errorMessage: 'Invalid email format'
        }
    },
    password: {
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long'
        }
    }
}

export const loginValidator = {
    mail: {
        isEmail: {
            errorMessage: 'Invalid email format'
        },
        notEmpty: {
            errorMessage: 'Email is required'
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'Password is required'
        }
    }
}