import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import {
  DatasetNamesDto,
  DatasetStatisticsDto,
  TopicOccurencesDto,
  MLModelStatisticsDto,
  PublicationsPerTopicDto,
  ReviewersDto,
} from './admin.interface';

@Injectable()
export class AdminService {
  constructor(private databaseService: DatabaseService) { }

  async getDatasetNamesAndAliases(
    run_id: number,
  ): Promise<DatasetNamesDto[]> {
    let response: DatasetNamesDto[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().query(`
        select 
          da.parent_alias_id as parent_alias_id, 
          da.alias_id as alias_id,
          ds.alias as dataset, 
          da.alias as alias, 
          da.alias_type as alias_type
        from dataset_alias da
        join dataset_alias ds on da.parent_alias_id = ds.alias_id and ds.run_id=da.run_id
        where da.run_id = ${run_id}
        order by ds.alias, da.alias`);
    if (result?.recordset.length) {
      response = result.recordset;
    }
    return response;
  }

  async getDatasetStatistics(
    run_id: number,
  ): Promise<DatasetStatisticsDto[]> {
    let response: DatasetStatisticsDto[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().query(`
          SELECT ds.alias as dataset
          ,      da.alias 
          ,      da.alias_id 
          ,      da.parent_alias_id
          ,      sv.agency_dataset_identified
          ,      COUNT(sv.id) as n_total
            FROM snippet_validation sv
            JOIN dyad d ON sv.dyad_id = d.id
            JOIN dataset_alias da ON da.id = d.dataset_alias_id
            JOIN dataset_alias ds ON ds.alias_id = da.parent_alias_id and ds.run_id=da.run_id
          WHERE d.run_id = ${run_id}
          GROUP BY sv.agency_dataset_identified, da.alias, da.alias_id, da.parent_alias_id, ds.alias 
          ORDER BY ds.alias, da.alias
    `);

    if (result?.recordset.length) {
      response = result.recordset;
    }
    return response;
  }

  async getMachineLearningModelStatistics(
    run_id: number,
  ): Promise<MLModelStatisticsDto[]> {
    let response: MLModelStatisticsDto[] = [];
    const pool = await this.databaseService.getConnection();
    const publications_and_topics_per_dataset = await pool.request().query(`
        select 
          ds.alias as dataset,
          count(distinct d.publication_id) as n_publications,
          count(distinct pt.topic_id) as n_topics
        from dyad d 
        join dataset_alias da on da.id=d.dataset_alias_id
        join dataset_alias ds on da.parent_alias_id=ds.alias_id and da.run_id=ds.run_id
        join publication_topic pt on pt.publication_id=d.publication_id  
        where d.run_id = ${run_id}
        group by ds.id, ds.alias
        order by ds.alias`);

    const topic_occurences_per_dataset = await pool.request().query(`
        with t as (
          select 
            ds.alias as dataset, 
            t.keywords as topic,
            -- rank() over (partition by ds.alias order by count(*) desc) as n_rank,
            count(*) as n_occurrences
          from dyad d 
          join dataset_alias da on da.id=d.dataset_alias_id
          join dataset_alias ds on da.parent_alias_id=ds.alias_id and da.run_id=ds.run_id
          join publication_topic pt on pt.publication_id=d.publication_id  
          join topic t on t.id=pt.topic_id
          where d.run_id = ${run_id}
          group by ds.alias, t.keywords
        ) 
        select dataset, topic, n_occurrences
        from t 
        order by dataset, n_occurrences desc`);

    if (publications_and_topics_per_dataset?.recordset.length) {
      response = publications_and_topics_per_dataset.recordset;
      const topics_per_dataset = {};
      response.forEach((r) => {
        topics_per_dataset[r['dataset']] = [] as TopicOccurencesDto[];
      });

      topic_occurences_per_dataset.recordset.forEach((t) => {
        const topic = {
          topic: t['topic'],
          n_occurrences: t['n_occurrences'],
        } as TopicOccurencesDto;
        topics_per_dataset[t['dataset']].push(topic);
      });

      response.forEach((r) => {
        r['topics'] = topics_per_dataset[r['dataset']];
      });
    }
    return response;
  }

  async getTotalPublicationsPerTopic(
    run_id: number,
  ): Promise<PublicationsPerTopicDto[]> {
    let response: PublicationsPerTopicDto[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().query(`
        select 
          t.keywords as topic, 
          count(distinct pt.publication_id) as n_publications
        from topic t
        join publication_topic pt on pt.topic_id=t.id
        where t.run_id = ${run_id}
        group by t.keywords
        order by n_publications desc`);
    if (result?.recordset.length) {
      response = result.recordset;
    }
    return response;
  }

  async getReviewers(run_id: number): Promise<ReviewersDto[]> {
    let response: ReviewersDto[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().query(`
        SELECT
          susd_user_id,
          first_name,
          last_name,
          roles,
          agency_dataset_identified,
          COUNT(*) as n_total
        FROM reviewer
        JOIN susd_user ON susd_user_id = susd_user.id
        JOIN snippet_validation ON reviewer_id = reviewer.id
        WHERE reviewer.run_id = ${run_id}
        GROUP BY susd_user_id, first_name, last_name, agency_dataset_identified, roles`);
    if (result?.recordset.length) {
      result.recordset.forEach((rc) => {
        rc['susd_user_id'] = parseInt(rc['susd_user_id']);
        rc['roles'] = JSON.parse(rc['roles']);
      });
      response = result.recordset;
    }
    return response;
  }
}
