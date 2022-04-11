import { User } from "../types/User";
import { BigQueryService } from "../services/BigQueryService";
import { DATASET_BULLHORN, Tables } from "../types/Common";
import { isExistByID } from "./";

export const saveCompanies = async (companies: any[]) => {
    const expludeFields = ['address', 'billingAddress', '_score', 'notes','dateAdded', 'dateLastModified'];
    try {
        for (const company of companies) {
            try {
                console.log(`Savng company with ID = ${company.id}`);
                const existing = await isExistByID(`'${company.id}'`, DATASET_BULLHORN, Tables.COMPANIES);
                if (existing) {
                    console.log(`Company with ID: ${company.id} exists`);
                    continue;
                }
                const keys: string[] = Object.keys(company).filter(k => expludeFields.indexOf(k) === -1 && !!company[k]);
                const values = keys.map(k => `"""${company[k]}"""`);
                const query = `
                    INSERT INTO \`${DATASET_BULLHORN}.${Tables.COMPANIES}\` (${keys.join(', ')})
                    VALUES (${values.join(', ')})
                `;
                console.log(query);
                const options = {
                    query: query,
                    location: 'US',
                };
                const [job] = await BigQueryService.getClient().createQueryJob(options);
                await job.getQueryResults();
                console.log(`Saved company with ID = ${company.id} successfully`);
            } catch (error) {
                console.log(error);
                console.log(`ERROR: while saving company with ID = ${company.id}`);
            }
        };

        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
}

export const saveJobs = async (jobs: any[]) => {
    const expludeFields = [
        'address',
        'location',
        '_score',
        'publicDescription', //
        'clientCorporation',
        'dateAdded',
        'dateClosed',
        'date_end',
        'dateLastExported',
        'dateLastModified',
        'dateLastPublished',
        'startDate', //
    ];
    try {
        for (const job of jobs) {
            try {
                console.log(`Savng job with ID = ${job.id}`);
                const existing = await isExistByID(`'${job.id}'`, DATASET_BULLHORN, Tables.JOBS);
                if (existing) {
                    console.log(`Job with ID: ${job.id} exists`);
                    continue;
                }
                const keys: string[] = Object.keys(job).filter(k => expludeFields.indexOf(k) === -1 && !!job[k]);
                const values: any = keys.map(k => `"""${job[k]}"""`);
                const query = `
                    INSERT INTO \`${DATASET_BULLHORN}.${Tables.JOBS}\` (${keys.join(', ')})
                    VALUES (${values.join(', ')})
                `;
                console.log(query);
                const options = {
                    query: query,
                    location: 'US',
                };
                const [bgJob] = await BigQueryService.getClient().createQueryJob(options);
                await bgJob.getQueryResults();
                console.log(`Saved job with ID = ${job.id} successfully`);
            } catch (error) {
                console.log(error);
                console.log(`ERROR: while saving job with ID = ${job.id}`);
            }
        };

        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
}


export const saveClientContacts = async (contacts: any[]) => {
    const expludeFields = [
        'address',
        'location',
        '_score',
    ];
    try {
        for (const contact of contacts) {
            try {
                console.log(`Savng ClientContact with ID = ${contact.id}`);
                const existing = await isExistByID(`'${contact.id}'`, DATASET_BULLHORN, Tables.CONTACTS);
                if (existing) {
                    console.log(`ClientContact with ID: ${contact.id} exists`);
                    continue;
                }
                console.log('------')
                const keys: string[] = Object.keys(contact).filter(k => expludeFields.indexOf(k) === -1 && !!contact[k]);
                const values: any = keys.map(k => `"""${contact[k]}"""`);
                const query = `
                    INSERT INTO \`${DATASET_BULLHORN}.${Tables.CONTACTS}\` (${keys.join(', ')})
                    VALUES (${values.join(', ')})
                `;
                console.log(query);
                const options = {
                    query: query,
                    location: 'US',
                };
                const [bgJob] = await BigQueryService.getClient().createQueryJob(options);
                await bgJob.getQueryResults();
                console.log(`Saved ClientContact with ID = ${contact.id} successfully`);
            } catch (error) {
                console.log(error);
                console.log(`ERROR: while saving ClientContact with ID = ${contact.id}`);
            }
        };

        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
}

export const saveCandidates = async (candidates: any[]) => {
    const expludeFields = [
        'address',
        '_score'
    ];
    try {
        for (const candidate of candidates) {
            try {
                console.log(`Savng Candidate with ID = ${candidate.id}`);
                const existing = await isExistByID(`'${candidate.id}'`, DATASET_BULLHORN, Tables.CANDIDATES);
                if (existing) {
                    console.log(`Candidate with ID: ${candidate.id} exists`);
                    continue;
                }
                const keys: string[] = Object.keys(candidate).filter(k => expludeFields.indexOf(k) === -1 && !!candidate[k]);
                const values: any = keys.map(k => `"""${candidate[k]}"""`);
                const query = `
                    INSERT INTO \`${DATASET_BULLHORN}.${Tables.CANDIDATES}\` (${keys.join(', ')})
                    VALUES (${values.join(', ')})
                `;
                console.log(query);
                const options = {
                    query: query,
                    location: 'US',
                };
                const [bgJob] = await BigQueryService.getClient().createQueryJob(options);
                await bgJob.getQueryResults();
                console.log(`Saved Candidate with ID = ${candidate.id} successfully`);
            } catch (error) {
                console.log(error);
                console.log(`ERROR: while saving Candidate with ID = ${candidate.id}`);
            }
        };

        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
}

export const saveLeads = async (leads: any[]) => {
    const expludeFields = [
        'address',
        '_score'
    ];
    try {
        for (const lead of leads) {
            try {
                console.log(`Savng Lead with ID = ${lead.id}`);
                const existing = await isExistByID(`'${lead.id}'`, DATASET_BULLHORN, Tables.LEADS);
                if (existing) {
                    console.log(`Lead with ID: ${lead.id} exists`);
                    continue;
                }
                const keys: string[] = Object.keys(lead).filter(k => expludeFields.indexOf(k) === -1 && !!lead[k]);
                const values: any = keys.map(k => `"""${lead[k]}"""`);
                const query = `
                    INSERT INTO \`${DATASET_BULLHORN}.${Tables.LEADS}\` (${keys.join(', ')})
                    VALUES (${values.join(', ')})
                `;
                console.log(query);
                const options = {
                    query: query,
                    location: 'US',
                };
                const [bgJob] = await BigQueryService.getClient().createQueryJob(options);
                await bgJob.getQueryResults();
                console.log(`Saved Lead with ID = ${lead.id} successfully`);
            } catch (error) {
                console.log(error);
                console.log(`ERROR: while saving Lead with ID = ${lead.id}`);
            }
        };

        return { result: true };
    } catch (error) {
        console.log(error);
        return { result: false, error };
    }
}