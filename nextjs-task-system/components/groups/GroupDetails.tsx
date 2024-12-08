import { Group } from "@/types";
import { Modal } from "flowbite-react";

interface GroupDetailsProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
}

const GroupDetails = ({ group, isOpen, onClose }: GroupDetailsProps) => {
  const { name, users } = group;

  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <Modal.Header>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {name}
        </h2>
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
            Miembros del grupo
          </h3>
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {users?.map((user) => (
              <li
                key={user.id}
                className="flex items-center space-x-4 rounded-md px-2 py-3 transition hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-bold uppercase text-white dark:bg-gray-600">
                    {user.username.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ID: {user.id}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GroupDetails;
