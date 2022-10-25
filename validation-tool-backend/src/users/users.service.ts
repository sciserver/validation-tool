import { Injectable } from '@nestjs/common';
import { VarChar, Int } from 'mssql';
import { DatabaseService } from 'src/database/database.service';
import { User } from './user.interface';

// This should be a real class/interface representing a user entity

/**
 * Description placeholder
 * @date 1/6/2022 - 10:20:26 PM
 *
 * @export
 * @class UsersService
 * @typedef {UsersService}
 */
@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  /**
   * Description placeholder
   * @date 1/6/2022 - 10:20:26 PM
   *
   * @private
   * @readonly
   * @type {{}}
   */
  private readonly users = [
    {
      id: 3,
      source_type: 'user',
      last_name: 'tester',
      first_name: 'john',
      email: 'john@test.com',
      password: 'changeme',
    },
    // {
    //   userId: 2,
    //   username: 'maria',
    //   password: 'guess',
    // },
  ];

  /**
   * Description placeholder
   * @date 1/6/2022 - 10:20:26 PM
   *
   * @async
   * @param {string} email
   * @returns {(Promise<User | undefined>)}
   */
  async findOne(email: string): Promise<User | undefined> {
    return this.users.find((user) => user.email === email);
  }

  /**
   * Description placeholder
   * @date 1/6/2022 - 10:20:26 PM
   *
   * @async
   * @param {string} email
   * @returns {*}
   */
  async loginUserByEmail(email: string, password: string): Promise<User> {
    let user: User = null;
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('Email', VarChar, email)
      .input('Password', VarChar, password)
      .query(`SELECT id, first_name, last_name, email
        FROM susd_user WHERE email = @Email
        AND password = HASHBYTES('SHA2_256', @Password)`);
    const userArray: User[] = result.recordset;
    if (userArray?.length) {
      user = userArray[0] as User;
      const roles = await pool.request()
        .input('SUSD_USER_ID', Int, user.id)
        .query('SELECT run_id, roles FROM reviewer where susd_user_id = @SUSD_USER_ID');
      const privileges = roles.recordset;
      if (privileges?.length) {
        privileges.forEach(element => {
          element['roles'] = JSON.parse(element['roles'])
        });
        user['privileges'] = privileges;
      }
    }

    return user;
  }
}
