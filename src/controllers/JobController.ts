import { Datasource, Prisma, PrismaClient } from "@prisma/client";
import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  QueryParam,
  JsonController,
  Authorized,
  CurrentUser,
  Patch,
} from "routing-controllers";
import { Dictionary } from "typed-two-way-map";
import { BigQueryService } from "../services/BigQueryService";
import { GetroService } from "../services/GetroService";
import { createJob, getAppliedJobsByUser, updateJob } from "../services/Job";
import {
  DATASET_BULLHORN,
  DATASET_GETRO,
  FilterOption,
  Job,
  FilterBody,
  JobSearchByFilterResponse,
  JobSearchByID,
  DataSource,
  Tables,
  ApplyResponse,
  GetSavedJobsResponse,
  AdvancedFilterOption,
  DATASET_MAIN,
  DataSources,
  Operator,
} from "../types/Common";
import { ALLOWED_GETRO_FILTERS } from "../types/Getro";
import { ALLOWED_JOB_KEYS, JobKey } from "../types/Job";
import { User } from "../types/User";
import { getDataSource } from "../utils";
import db from "../utils/db";
import { JobFilter } from "../utils/FieldMatch";
import {
  getCandidatesOnJob,
  getSavedJobs,
  saveApplication,
  saveJob,
} from "../utils/MainCrud";

import { Job as DbJob } from "prisma/prisma-client";

@JsonController("/api/job")
export class JobController {
  @Get("/search")
  async searchJobByID(@QueryParam("id") id: string) {
    const job = await db.job.findFirst({
      where: {
        id,
      },
      include: {
        getroJobInfo: true,
      },
    });

    if (job) {
      return {
        ...(job?.getroJobInfo || {}),
        ...job,
      };
    } else {
      return null;
    }
  }

  @Post("/search")
  async searchByFilter(
    @Body() body: FilterBody & { datasource?: DataSources }
  ) {
    try {
      const { filters, fields, page, count, datasource } = body;

      const datasourceToEnum: Dictionary<Datasource> = {
        main: Datasource.main,
        bullhorn: Datasource.bullhorn,
        getro: Datasource.getro,
      };

      const _datasource = datasource ? datasourceToEnum[datasource] : undefined;

      const jobs = (await db.job.findMany({
        where: {
          datasource: _datasource as any,
          ...(filters || {}),
        },
        take: count,
        skip: count * page,
        select: fields,
      })) as DbJob[]; // TODO: assumes we are changing frontend to pass compatible fields and filters params

      return {
        jobs,
        total: jobs?.length,
        message: null,
      };
    } catch (error) {
      return {
        message: error,
      };
    }
  }

  determineCondition = (
    key: string,
    value: string,
    specialHandlers: Dictionary<(key: string, value: string) => string>,
    nonStringFields: Set<string> = new Set()
  ) => {
    if (specialHandlers[key] != null) {
      return specialHandlers[key](key, value);
    } else if (nonStringFields.has(key) || typeof value !== "string") {
      return `${key} = ${value}`;
    } else {
      return `LOWER(${key}) LIKE '%${value.toLowerCase()}%'`;
    }
  };

  getFilterConditions = (
    filters: AdvancedFilterOption[],
    operator: Operator = "OR",
    specialHandlers: Dictionary<(key: string, value: string) => string> = {},
    nonStringFields: Set<string> = new Set()
  ) => {
    const conditions = filters.map((opt) => {
      if (Array.isArray(opt.value)) {
        const operator = opt.operator || "AND";
        const baseCondition = (value: string) =>
          this.determineCondition(
            opt.key,
            value,
            specialHandlers,
            nonStringFields
          );
        return opt.value.map(baseCondition).join(` ${operator} `);
      } else {
        return this.determineCondition(opt.key, opt.value, specialHandlers);
      }
    });
    return conditions.join(` ${operator} `);
  };

  @Authorized()
  @Get("/apply")
  async apply(
    @QueryParam("candidate") candidate: string,
    @QueryParam("job") job: string
  ): Promise<ApplyResponse> {
    return await saveApplication(job, candidate);
  }

  @Authorized()
  @Get("/candidates")
  async getCandidates(@QueryParam("job") job: string) {
    return await getCandidatesOnJob(job);
  }

  @Authorized()
  @Put("/save")
  async save(
    @QueryParam("candidate") candidate: string,
    @QueryParam("job") job: string
  ): Promise<ApplyResponse> {
    return await saveJob(job, candidate);
  }

  @Authorized()
  @Patch()
  async update(
    @Body() body: Partial<Job> & { id: string }
  ): Promise<ApplyResponse> {
    return await updateJob(body);
  }

  @Authorized()
  @Get("/applied")
  async getAppliedJobs(
    @CurrentUser() authUser: User,
    @QueryParam("candidate") candidate: string
  ) {
    return await getAppliedJobsByUser(candidate || authUser.id!);
  }

  @Authorized()
  @Get("/savedJobs")
  async savedJobs(
    @QueryParam("candidate") candidate: string
  ): Promise<GetSavedJobsResponse> {
    return await getSavedJobs(candidate);
  }

  @Authorized()
  @Put()
  async createJob(@Body() body: Job): Promise<ApplyResponse> {
    return await createJob(body);
  }
}
