import argon2 from 'argon2';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { getConnection } from 'typeorm';
import { User } from './../entities/User';

@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async getUsers(): Promise<User[]> {
    const users = (await getConnection().query(`SELECT * FORM "users"`)) as Promise<[User]>;
    return users;
  }

  @Mutation(() => Boolean)
  async login(
    @Arg('username') username: string,
    @Arg('password') password: string
  ): Promise<boolean> {
    const user = await User.findOne({ where: { username } });
    if (!user) return false;
    const valid = await argon2.verify(user.password, password);
    if (!valid) return false;

    return true;
  }

  @Mutation(() => User)
  async register(
    @Arg('username') username: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ): Promise<User | undefined> {
    const hashedPassword = await argon2.hash(password);

    await getConnection().query(
      `INSERT INTO "users" (username, email, password) VALUES ($1, $2, $3)`,
      [username, email, hashedPassword]
    );

    const user = await User.findOne({ where: { username } });

    return user;
  }
}
