import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "../../ui/skeleton";

type TaskCommentProps = {
  author: string;
  avatar: string;
  content: string;
  createdAt: string;
};

export default function TaskComment({
  author,
  avatar,
  content,
  createdAt,
}: TaskCommentProps) {
  return (
    <div className="flex items-start space-x-4 py-4">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>{author[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{author}</p>
        <p className="text-sm text-gray-500">{content}</p>
        <p className="text-xs text-gray-400">
          {new Date(createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function CommentSkeleton() {
  return (
    <div className="flex items-start space-x-4 py-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}
