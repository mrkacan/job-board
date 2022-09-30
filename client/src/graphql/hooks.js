import {useMutation, useQuery} from "@apollo/client";
import {COMPANY_QUERY, CREATE_JOB_MUTATION, JOB_QUERY, JOBS_QUERY} from "./queries";
import {getAccessToken} from "../auth";

export const useJob = (id) => {
    const {data, error, loading} = useQuery(JOB_QUERY, {
        variables: {id},
    });

    return {
        job: data?.job, error: Boolean(error), loading
    }
}

export const useCompany = (id) => {
    const {data, error, loading} = useQuery(COMPANY_QUERY, {
        variables: {id},
    });

    return {
        company: data?.company, error: Boolean(error), loading
    }
}

export const useJobs = () => {
    const {data, error, loading} = useQuery(JOBS_QUERY, {
        fetchPolicy: 'network-only'
    });

    return {
        jobs: data?.jobs, error: Boolean(error), loading
    }
}

export const useCreateJob = () => {
    const [mutate, {loading, error}] = useMutation(CREATE_JOB_MUTATION);

    const createJob = async ({title, description}) => {
        const {data: {job}} = await mutate({
            variables: {input: {title, description}},
            context: {
                headers: {'Authorization': 'Bearer ' + getAccessToken()}
            },
            update: (cache, {data: {job}}) => {
                cache.writeQuery({
                    query: JOB_QUERY,
                    variables: {
                        id: job.id
                    },
                    data: {job}
                })
            }
        })

        return {
            job
        }
    }

    return {
        createJob, loading, error: Boolean(error)
    }
}