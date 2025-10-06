import { User } from '@/api/user/userModel';
import { CreateUserInput } from '@/api/user/userModel';

export class UserRepository {
  private users: User[] = [
    {
      id: 1,
      name: 'Alice',
      email: 'alice@example.com',
      bio: 'Software Engineer',
      avatarUrl: 'http://example.com/alice.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: 'Bob',
      email: 'bob@example.com',
      bio: 'Data Scientist',
      avatarUrl: 'http://example.com/bob.jpg',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  async findAllAsync(): Promise<User[]> {
    return this.users;
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async createAsync(payload: CreateUserInput): Promise<User> {
    const newUser: User = {
      id: this.users.length ? this.users[this.users.length - 1].id + 1 : 1,
      name: payload.name,
      email: payload.email,
      bio: payload.bio ?? null,
      avatarUrl: payload.avatarUrl ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  
}

export const userRepository = new UserRepository();
