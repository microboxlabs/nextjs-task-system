import { useEffect, useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { Task, Comment } from '../types';

export const AddComments = ({ taskId }: { taskId: string }) => {
    const [task, setTask] = useState<Task | null>(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetch(`/api/v1/tasks/${taskId}`)
            .then((response) => response.json())
            .then((data) => {
                setTask(data);
            });
    }, [newComment]);

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(newComment)
        const addComment = await fetch(`/api/v1/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                comment: newComment,
                task_id: taskId,
                user_id: task?.user.id,
            }),
        })
        setNewComment('');
    }

    return (
        <div>
            <h4 className="mb-2 font-semibold">Comments:</h4>
            {task?.comments && task.comments.length > 0 ? (
                <ul className="list-disc pl-5">
                    {task.comments.map((comment) => (
                        <li key={comment?.id}>{comment.comment}</li>
                    ))}
                </ul>
            ) : (
                <p>No comments yet.</p>
            )}
            
            <form onSubmit={handleAddComment} className="flex gap-2">
                <TextInput
                    type="text"
                    placeholder="Añadir un comentario"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow"
                />
                <Button type="submit">Añadir</Button>
            </form>
        </div>
    )
}
