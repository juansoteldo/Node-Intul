import { v4 as uuid4 } from 'uuid';
import { BigQueryService } from "../services/BigQueryService";
import { DataSource } from "../types/Common";

export const isExistByID = async (id: string, datset: string, table: string) => {
    try {
        const query = `
            SELECT * FROM \`${datset}.${table}\`
            WHERE id=${id}
        `;
        const options = {
            query: query,
            location: 'US',
        };
        console.log(query)
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        const [res] = await job.getQueryResults();

        if (res && res.length > 0 && `'${res[0].id}'` === id) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const isExistByCondition = async (condition: string, datset: string, table: string) => {
    try {
        const query = `
            SELECT * FROM \`${datset}.${table}\`
            WHERE ${condition}
        `;
        const options = {
            query: query,
            location: 'US',
        };
        console.log(query)
        const [job] = await BigQueryService.getClient().createQueryJob(options);
        const [res] = await job.getQueryResults();
        console.log(res);
        if (res && res.length > 0) {
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return true;
    }
}

export const consoleLog = (message: any, newLine = true) =>{
    console.log(`${newLine ? '\n' : ''}${message}`);
}

export const sleep = async (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const getDataSource = (id: string) => {
    const prefix = id.slice(0, 2);
    if (prefix === 'bl') return DataSource.BULLHORN;
    if (prefix === 'gt') return DataSource.GETRO;
    return DataSource.UNKNOWN;
}

export const genUUID = () => uuid4();