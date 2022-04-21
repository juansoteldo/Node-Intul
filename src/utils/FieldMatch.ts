import { Dictionary, TypedDictionary } from "typed-two-way-map";

export const JobFilter: any = {
  bullhorn: {
    id: "id",
    title: "title",
    skill: "skillList",
    city: "address_city",
    employmentType: "employmentType",
    onSite: "onSite",
    yearsRequired: "yearsRequired",
    willRelocate: "willRelocate",
    status: "status",
    hidden: "hidden",
    companyId: "clientCorporationID",
  },
  main: {
    id: "id",
    status: "status",
    skillList: "skillList",
    hidden: "hidden",
    employmentType: "employmentType",
    onSite: "onSite",
    yearsRequired: "yearsRequired",
    willRelocate: "willRelocate",
    city: "city",
    state: "state",
    isDeleted: "isDeleted",
    companyId: "companyId",
  },
};

export type CompanyFilterKey = "bullhorn" | "getro" | "joined";

export const CompanyFilter: TypedDictionary<
  CompanyFilterKey,
  Dictionary<string>
> = {
  bullhorn: {
    name: "name",
    city: "address_city",
    industry: "industryList",
  },
  getro: {
    name: "name",
    city: "locations",
  },
  joined: {
    name: "name",
  },
};

export const USER_FILTER: any = {
  firstname: "firstname",
  lastname: "lastname",
  role: "role",
  roles: "roles",
  city: "city",
  state: "state",
  skills: "skills",
  skillSet: "skillSet",
  expertise: "expertise",
  status: "status",
  email: "email",
  bh_email: "bh_email",
  companyName: "companyName",
  occupation: "occupation",
  workAuthorized: "workAuthorized",
  employeeType: "employeeType",
  willRelocate: "willRelocate",
  experienceYears: "experienceYears",
  seniority: "seniority",
  experience: "experience",
  employmentPreference: "employmentPreference",
  degreeList: "degreeList",
  certifications: "certifications",
};
