import { User } from "../types/User";
import { BigQueryService } from "./BigQueryService";
import { DATASET_MAIN, Tables } from "../types/Common";
import { ROLES } from "../utils/constant";
import { validate } from "class-validator";
import { genUUID } from "../utils";

const isNullOrEmpty = (value: any) => {
    return !value || (value && !`${value}`.trim())
};

const validateUser = ({
    firstname,
    lastname,
    email,
    password,
    role,
    city = '',
    state = '',
    resume,
    linkedin,
    skills,
    expertise,
}: User) => {
    try {
        if (isNullOrEmpty(firstname) || isNullOrEmpty(lastname))
            return 'firstname and lastname is required';
        if (isNullOrEmpty(email)) 
            return 'email is invalid';
        if (ROLES.find(r => r === role) === null)
            return `role is invalid, it should be one in [${ROLES.join(', ')}]`;
        if (isNullOrEmpty(password))
            return 'password is required';
        if (isNullOrEmpty(resume))
            return 'resume is required';
        if (isNullOrEmpty(linkedin))
            return 'linkedin is required';
        if (isNullOrEmpty(skills))
            return 'skill is required';
        if (isNullOrEmpty(expertise))
            return 'expertise is required';
    } catch (error) {
        return 'something is wrong, please check params';
    }
    return false;
}

export const register = async (data: User) => {
    try {

        const validate = validateUser(data);
        if (validate) return { result: false, error: validate };

        const {
            firstname,
            lastname,
            email,
            password,
            role,
            city = '',
            state = '',
            resume,
            linkedin,
            skills,
            expertise,
        } = data;

        const existing = await isExistUser(email);
        if (existing) {
            return {
                result: false,
                error: `User with ${email} exists`
            };
        }

        const query = `
            INSERT INTO \`${DATASET_MAIN}.${Tables.USER}\` (id, firstname, lastname, email, password, role, city, state, resume, linkedin, skills, expertise)
            VALUES ("${genUUID()}", "${firstname}", "${lastname}", "${email}", "${password}", "${role}", "${city}", "${state}", "${resume}", "${linkedin}", "${skills}", "${expertise}")
        `;
        const options = {
            query: query,
            location: 'US',
        };
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        await job.getQueryResults();

        return { result: true };
    } catch (error) {
        return { result: false, error };
    }
}

export const isExistUser = async (email: string) => {
    try {
        const query = `
            SELECT * FROM \`${DATASET_MAIN}.${Tables.USER}\`
            WHERE email='${email}'
        `;
        const options = {
            query: query,
            location: 'US',
        };
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        const [res] = await job.getQueryResults();
        if (res && res.length > 0 && res[0].email === email) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const login = async (email: string, password: string) => {
    try {
        const query = `
            SELECT * FROM \`${DATASET_MAIN}.${Tables.USER}\`
            WHERE email='${email}' AND password='${password}'
        `;
        const options = {
            query: query,
            location: 'US',
        };
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        const [res] = await job.getQueryResults();
        if (res && res.length > 0 && res[0].email === email) {
            return { result: true };
        }
        return { result: false, error: 'wrong credential' };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
};

export const findUserByEmail = async (email: string) => {
    try {
        const query = `
            SELECT * FROM \`${DATASET_MAIN}.${Tables.USER}\`
            WHERE email='${email}'
        `;
        const options = {
            query: query,
            location: 'US',
        };
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        const [res] = await job.getQueryResults();
        if (res && res.length > 0 && res[0].email === email) {
            return res[0];
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }
};
