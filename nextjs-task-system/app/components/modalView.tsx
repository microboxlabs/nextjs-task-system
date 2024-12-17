"use client";
import { Badge, Button, Card, Modal, Spinner, Textarea } from "flowbite-react";
import { useContext, useEffect, useState } from "react";
import { AuthContexts } from "../contexts/authContexts";
import { TaskContexts } from "../contexts/taskContexts";

interface ModalFormProps {
    openModal: boolean;
    setOpenModal: (value: boolean) => void;
    task: any;
}

export const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'low':
            return 'green';
        case 'medium':
            return 'yellow';
        case 'high':
            return 'red';
        default:
            return 'gray';
    }
};

export const getStatusColor = (status: string) => {
    switch (status) {
        case 'pending':
            return 'yellow';
        case 'in progress':
            return 'blue';
        case 'completed':
            return 'green';
        default:
            return 'gray';
    }
};

export function ModalView({ openModal, setOpenModal, task }: ModalFormProps) {


    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState<{ comment: string; user_id: any; created_at: Date }[]>([]);
    const { state: stateUser } = useContext(AuthContexts);
    const { state: stateTask, getCommentsTask, addCommentTask } = useContext(TaskContexts);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getComments = async () => {
            setIsLoading(true);
            await getCommentsTask(task.id);
            setIsLoading(false);
        };

        getComments();
        
    }, [openModal, task.id]);

    useEffect(() => {
        setComments(stateTask.comments); 
    }, [stateTask.comments]);

    if (isLoading) {
        return (
            <div className="text-center">
                <Spinner aria-label="Center-aligned spinner example" />
            </div>
        );
    }

    const handleAddComment = async () => {
        if (newComment.trim()) {
            await addCommentTask({ task_id: task.id, user_id: stateUser.user.id, comment: newComment });
            setNewComment("");
            setComments(prev => [
                ...prev,
                { comment: newComment, user_id: stateUser.user.id, created_at: new Date() }
            ]);

            await getCommentsTask(task.id);
        }
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <Modal show={openModal} onClose={handleClose}>
            <Modal.Header className="h-10 p-2" ></Modal.Header>
            <Modal.Body>
                <div className="space-y-6">
                    <Card href="#" className="w-100">
                        <div className="flex w-100 justify-between">
                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                {task?.title}
                            </h5>
                            <Badge
                                size="sm"
                                color={getStatusColor(task?.status)}
                                className="uppercase"
                            >
                                {task?.status}
                            </Badge>
                        </div>

                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            {task?.description}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Assigned To:
                            <Badge size="sm" color="info" className="uppercase">
                                {task?.assigned_to || 'Unassigned'}
                            </Badge>
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400">
                            Due Date: {task?.due_date}
                        </p>
                        <p className="font-normal text-gray-700 dark:text-gray-400 flex gap-2">
                            Priority:
                            <Badge
                                size="sm"
                                color={getPriorityColor(task?.priority)}
                                className="uppercase"
                            >
                                {task?.priority}
                            </Badge>
                        </p>
                    </Card>
                    <div className="mt-4">
                        <h5 className="text-xl font-bold">Comments</h5>
                        <div className="space-y-4">
                            {comments.map((comment: any, index: number) => (
                                <div key={index} className="border p-4 rounded-md">
                                    <p className="font-medium">{comment.username}</p>
                                    <p>{comment.comment}</p>
                                </div>
                            ))}
                        </div>

                        <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            rows={3}
                            className="mt-4"
                        />
                        <Button
                            onClick={handleAddComment}
                            className="mt-2"
                            color="light"
                            size="sm"
                        >
                            Add Comment
                        </Button>
                    </div>

                </div>
            </Modal.Body>

        </Modal>
    );
}
