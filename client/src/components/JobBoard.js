import JobList from './JobList';
import {useJobs} from "../graphql/hooks";

function JobBoard() {
    const {jobs, error, loading} = useJobs()

    if (loading) {
        return <p>loading</p>
    }
    if (error) {
        return <p>error</p>
    }

    return (<div>
        <h1 className="title">
            Job Board
        </h1>
        <JobList jobs={jobs}/>
    </div>);
}

export default JobBoard;
