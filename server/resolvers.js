import {Company, Job} from "./db.js";

const rejectIf = (condition) => {
    if (condition) {
        throw new Error('Unauthorized')
    }
}

export const resolvers = {
    Query: {
        job: async (_root, {id}) => await Job.findById(id),
        jobs: async () => {
            const data = await Job.findAll();

            return data;
        },
        company: async (_root, {id}) => await Company.findById(id)
    },
    Mutation: {
        createJob: async (_root, {input}, {user}) => {
            rejectIf(!user);
            return Job.create({...input, companyId: user.companyId})
        },
        deleteJob: async (_root, {id}, {user}) => {
            rejectIf(!user);
            const job = await Job.findById(id);
            rejectIf(job.companyId !== user.companyId);
            return Job.delete(id)
        },
        updateJob: async (_root, {input}, {user}) => {
            rejectIf(!user)
            const job = await Job.findById(input.id);
            rejectIf(job.companyId !== user.companyId)
            return Job.update({...input, companyId: user.companyId})
        }
    },
    Company: {
        jobs: async (company) => await Job.findAll(job => job.companyId === company.id)
    },

    Job: {
        company: ({companyId}) => Company.findById(companyId)
    }
}