import BoardViewContainer from './BoardViewContainer';

const BoardClient = ({ tasks, isAdmin }: { tasks: any[]; isAdmin: boolean }) => {

    return (
        <div>
            <BoardViewContainer tasks={tasks} />
        </div>
    )
}

export default BoardClient