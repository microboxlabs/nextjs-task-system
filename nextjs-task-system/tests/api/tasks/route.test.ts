import { PrismaClient } from '@prisma/client';
import { POST } from '@/app/api/v1/tasks/route';
import { mockNextRequest } from '@/app/utils/mockRequest'; 

jest.mock('@prisma/client', () => {
  const mPrismaClient = {
    tasks: {
      create: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

const prisma = new PrismaClient();

describe('POST /api/tasks', () => {
  it('should create a task and return it', async () => {
    const mockData = {
      title: 'Test Task',
      description: 'Description',
      assigned_to: 'user123',
      status: 'pending',
      group_id: 1,
      due_date: '2024-12-31',
      priority: 'high',
    };

    const mockTask = { id: 1, ...mockData };
    (prisma.tasks.create as jest.Mock).mockResolvedValue(mockTask);

    const req = mockNextRequest(mockData);

    const res = await POST(req);
    const result = await res.json();

    expect(result).toEqual(mockTask);
    expect(prisma.tasks.create).toHaveBeenCalledWith({
      data: mockData,
    });
  });
});