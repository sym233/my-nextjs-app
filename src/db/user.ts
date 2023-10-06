import { PasswordHasher } from '@/pwd';
import db from './client';

export class UserDb {
  static async createUserByPassword(
    username: string,
    password: string
  ): Promise<boolean> {
    const ret = await db
      .insertInto('userInfo')
      .values([{ username }])
      .onConflict(oc => oc.doNothing())
      .returning('userInfo.id')
      .execute();
    const userId = ret[0]?.id as number | undefined;

    if (userId === undefined) {
      return false;
    }

    const { hashedPassword, salt } =
      PasswordHasher.createHashedPassword(password);

    await db
      .insertInto('userPassword')
      .values({ userId, hashedPassword, salt })
      .execute();
    return true;
  }
  static async validateUserByPassword(
    username: string,
    password: string
  ): Promise<{ userId: number } | undefined> {
    const cred = await db
      .selectFrom('userInfo')
      .innerJoin('userPassword', 'userInfo.id', 'userPassword.userId')
      .select([
        'userInfo.id',
        'userPassword.hashedPassword',
        'userPassword.salt',
      ])
      .where('userInfo.username', '=', username)
      .executeTakeFirst();
    if (!cred) {
      return;
    }
    const { hashedPassword, salt } = cred;
    if (PasswordHasher.validate(password, salt, hashedPassword)) {
      return { userId: cred.id };
    }
    return;
  }

  static async deleteUser(username: string): Promise<boolean> {
    const deleted = await db
      .deleteFrom('userInfo')
      .where('userInfo.username', '=', username)
      .returning('userInfo.id')
      .executeTakeFirst();
    if (!deleted) {
      return false;
    }
    const { id } = deleted;
    await db
      .deleteFrom('userPassword')
      .where('userPassword.userId', '=', id)
      .execute();
    return true;
  }

  static async login(
    username: string,
    password: string
  ): Promise<{ sessionId: string } | undefined> {
    const userId = (await this.validateUserByPassword(username, password))
      ?.userId;
    if (userId === undefined) {
      return;
    }
    const session = await db
      .insertInto('session')
      .values({ userId, creationTime: Date.now() })
      .returning('id')
      .execute();
    return {
      sessionId: session[0].id,
    };
  }

  static async validateSession(
    sessionId: string
  ): Promise<{ userId: number; creationTime: number } | undefined> {
    const session = await db
      .selectFrom('session')
      .select(['session.userId', 'creationTime'])
      .where('session.id', '=', sessionId)
      .executeTakeFirst();
    if (!session) {
      return;
    }
    return {
      ...session,
      creationTime: Number.parseInt(session.creationTime as unknown as string),
    };
  }

  static async logout(sessionId: string): Promise<void> {
    await db
      .deleteFrom('session')
      .where('session.id', '=', sessionId)
      .execute();
  }
}
