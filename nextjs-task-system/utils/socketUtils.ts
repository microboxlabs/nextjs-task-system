import { socket } from '@/utils/socket';

export const onConnect = (fnSetConnected: any, fnSetTransport: any) => {
    fnSetConnected(true);
    fnSetTransport(socket.io.engine.transport.name);
    socket.io.engine.on("upgrade", (transport) => {
        fnSetTransport(transport.name);
    });
}

export const onDisconnect = (fnSetConnected: any, fnSetTransport: any) => {
    fnSetConnected(false);
    fnSetTransport("N/A");
}

export const updateTask = (updatedTask: any, fnSet: any) => {
    fnSet((prevTasks: any) =>
        prevTasks.map((task: any) =>
            task.id === updatedTask.id ? updatedTask : task
        )
    );
};