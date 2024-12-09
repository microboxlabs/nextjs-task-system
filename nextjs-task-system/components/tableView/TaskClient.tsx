
import HeaderTableView from './HeaderTableView'
import { TableComponent } from './TableComponent'
import { TaskProvider } from '@/context/TasksContext';


const TaskClient = ({ tasks, isAdmin }: { tasks: any[]; isAdmin: boolean }) => {

    return (
        <TaskProvider tasks={tasks} isAdmin={isAdmin}>
            <div>
                <HeaderTableView />
                <TableComponent />
            </div>
        </TaskProvider>
    )
}

export default TaskClient