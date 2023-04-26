import { Injectable } from '@nestjs/common';
import { VarChar, Int } from 'mssql';
import { DatabaseService } from '../database/database.service';
import { Role } from '../auth/role.enum';
import { User } from './user.interface';

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
  constructor(private databaseService: DatabaseService) { }

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
      privileges: [
        {
          run_id: 1,
          agency: 'NASA',
          roles: [Role.ADMIN],
        },
        //{
        //  run_id: 2,
        //  agency: 'USDA',
        //  roles: [Role.REVIEWER],
        //},
      ],
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
      const roles = await pool
        .request()
        .input('SUSD_USER_ID', Int, user.id)
        .query('SELECT r.run_id, ar.agency, r.roles FROM reviewer r join agency_run ar on r.run_id = ar.id  where r.susd_user_id = @SUSD_USER_ID');
      // .query(`SELECT p.agency as project_agency,
      //         ar.agency,
      //         ar.id as run_id, 
      //         pm.roles
      //         FROM project p
      //         JOIN project_member pm on pm.project_id=p.id
      //         JOIN susd_user su on su.id=pm.susd_user_id 
      //         JOIN project_run pr on pr.project_id=p.id
      //         JOIN agency_run ar on ar.id = pr.run_id
      //         AND su.id = @SUSD_USER_ID
      //         AND exists (select r.id from reviewer r where r.run_id = pr.run_id)
      //         ORDER BY p.agency, p.id
      //     `);
      const privileges = roles.recordset;

      if (privileges?.length) {
        privileges.forEach((element) => {
          element['roles'] = JSON.parse(element['roles']);
        });
        user['privileges'] = privileges;
      }
    }
    return user;
  }

  async getUserInfo(requestUser: User): Promise<User> {
    let user: User = JSON.parse(JSON.stringify(requestUser));
    delete user['iat']; // remove jwt field
    delete user['exp']; // remove jwt field
    return user;
  }
}
