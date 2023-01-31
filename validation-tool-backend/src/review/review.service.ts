import { Injectable } from '@nestjs/common';
import { BigInt, Int, Bit, VarChar } from 'mssql';
import { DatabaseService } from 'src/database/database.service';
import {
  ReviewItem,
  ValidationGenericMetadataDto,
  ValidationTableItemDto,
  ReviewReportItem,
} from './review.interface';

@Injectable()
export class ReviewService {
  constructor(private databaseService: DatabaseService) {}

  async getReviewItems(
    source_id: number,
    page_size = 10,
    page_number = 0,
    do_show_reviewed_items = 1,
  ): Promise<ReviewItem[]> {
    let items: ReviewItem[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('EntityID', BigInt, source_id) // EntityID or source_id is the ID of the user.
      .input('Fetch', BigInt, page_size)
      .input('Offset', BigInt, page_number * page_size)
      .input('DoShowWReviewedItems', Bit, do_show_reviewed_items).query(`SELECT 
      su.id as user_metadata_source_id,
      sv.id as dataset_mention_generic_metadata_id,
      dy.snippet as dataset_mention,
      dy.id as publication_dataset_alias_id,
      dy.publication_id as publication_id, 
      pu.title as publication_title,
      pu.year as publication_year, 
      pu.doi as publication_doi,
      dy.mention_candidate as alias_candidate,
      da.url as dataset_mention_alias_url,
      CASE WHEN sv.is_dataset_reference is null THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END as dataset_mention_answered,
      CASE WHEN sv.agency_dataset_identified is null THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END as dataset_mention_parent_answered,
      CASE WHEN da_parent.alias is null THEN da.alias ELSE da_parent.alias END AS dataset_mention_parent_alias,
      CASE WHEN da_parent.alias is null THEN da.url ELSE da_parent.url END as dataset_mention_parent_alias_url,
      sv.is_dataset_reference as dataset_correct,
      sv.agency_dataset_identified as alias_correct,
      da.alias as dataset_alias
      FROM susd_user su 
      JOIN reviewer re ON re.susd_user_id=su.id
      JOIN snippet_validation sv ON sv.reviewer_id = re.id  and sv.run_id=re.run_id
      JOIN dyad dy ON dy.id = sv.dyad_id AND dy.run_id=sv.run_id
      JOIN publication pu ON pu.id = dy.publication_id AND pu.run_id=dy.run_id
      LEFT JOIN dataset_alias da ON da.id = dy.dataset_alias_id AND da.run_id = sv.run_id
      LEFT JOIN dataset_alias da_parent ON da.parent_alias_id = da_parent.alias_id AND da_parent.run_id = sv.run_id
      JOIN agency_run ar ON ar.id=re.run_id
      WHERE su.id = @EntityID
      and dy.snippet is not null 
      and dy.mention_candidate is not null 
      and CASE WHEN sv.is_dataset_reference is null THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END & CASE WHEN sv.agency_dataset_identified is null THEN CAST(0 AS BIT) ELSE CAST(1 AS BIT) END <= @DoShowWReviewedItems
      ORDER BY dy.id
      OFFSET @Offset ROWS FETCH NEXT @Fetch ROWS ONLY;`);
    if (result.recordset && result.recordset.length > 0) {
      items = result.recordset as ReviewItem[];
    }
    return items;
  }

  async getReviewItensCount(
    source_id: number,
    do_show_reviewed_items = 1,
  ): Promise<{ total: number; answered: number }> {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('EntityID', BigInt, source_id)
      .input('DoShowWReviewedItems', Bit, do_show_reviewed_items).query(`SELECT 
      COUNT(*) as items_number,
      SUM (CASE WHEN sv.agency_dataset_identified is not null and sv.is_dataset_reference is not null THEN 1 ELSE 0 END) as answered,
      su.id as entity_id
      from susd_user su 
      join reviewer re on re.susd_user_id=su.id
      join snippet_validation sv on sv.reviewer_id = re.id  and sv.run_id=re.run_id
      join dyad dy on dy.id = sv.dyad_id  and dy.run_id=sv.run_id
      join publication pu on pu.id = dy.publication_id and pu.run_id=dy.run_id
      join dataset_alias da on da.id = dy.dataset_alias_id and da.run_id = sv.run_id
      left join dataset_alias da_parent on da.parent_alias_id = da_parent.alias_id  and da_parent.run_id = sv.run_id
      join agency_run ar on ar.id=re.run_id
      where su.id = @EntityID
      and (CASE WHEN sv.agency_dataset_identified is not null and sv.is_dataset_reference is not null THEN 1 ELSE 0 END)  <= @DoShowWReviewedItems
      group by su.id`);
    const count_result = {
      total: 0,
      answered: 0,
    };
    if (
      result.recordset &&
      result.recordset.length > 0 &&
      result.recordset[0].items_number
    ) {
      count_result.total = result.recordset[0].items_number;
      count_result.answered = result.recordset[0].answered;
    }
    return count_result;
  }

  async updateDatasetAliasCandidateReview(
    user_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('ID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value)
      .query(`update snippet_validation set is_dataset_reference = @Value, last_updated_date = GETDATE() 
      where id = @ID`);
    return result.rowsAffected;
  }

  async reviewDatasetMentionAlias(
    user_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    return this.updateDatasetAliasCandidateReview(user_id, validation);
  }

  async updateParentAliasReview(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('ID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value)
      .query(`update snippet_validation set agency_dataset_identified = @Value, last_updated_date = GETDATE() 
      where id = @ID`);
    return result.rowsAffected;
  }

  async reviewDatasetMentionParentAlias(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    return this.updateParentAliasReview(source_id, validation);
  }

  async getValidation(
    source_id: number,
    entity_type: string,
    entity_id: number,
    validation_type: string,
  ): Promise<ValidationTableItemDto> {
    let item: ValidationTableItemDto = undefined;
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('EntityID', BigInt, entity_id)
      .input('SourceID', BigInt, source_id)
      .input('EntityType', VarChar, entity_type)
      .input('ValidationType', VarChar, validation_type).query(`SELECT 
      validation_id, entity_id, source_id, entity_type, value
      FROM validation v
      WHERE 
          v.source_id = @SourceID
          and v.entity_id = @EntityID
          and v.entity_type = @EntityType
          and v.validation_type = @ValidationType`);
    if (result.recordset && result.recordset.length > 0) {
      item = result.recordset[0];
    }
    return item;
  }

  async deleteAssignments(source_id: number) {
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().input('SourceID', BigInt, source_id)
      .query(`DELETE FROM generic_metadata WHERE 
        metadata_name = 'text_snippet_to_review' and entity_id = @SourceID`);
    return result.rowsAffected;
  }

  async getReviewReport() {
    let items: ReviewReportItem[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().query(`	select 
    ms.source_id  as user_metadata_source_id, ms2.source_id as organization_source_id, ms.email, ms.organization_name,
sum(case when gm.generic_metadata_id is not null then 1 else 0 end) as assigned_items,
   sum(case when gm.generic_metadata_id is not null and (v_alias.value is null or v_alias_parent.value is null) then 1 else 0 end) as not_answered
 from 
   metadata_source ms
 join metadata_source ms2 on (ms2.organization_name = ms.organization_name and ms2.source_type = 'org')
 left join generic_metadata gm on ms.source_id = gm.entity_id and gm.metadata_name = 'text_snippet_to_review'-- added to see emails
 left join 
   generic_metadata gm2 on cast(gm.metadata as INT)  = gm2.generic_metadata_id --removed double casting  
 left join 
   validation v_alias 
   on gm2.generic_metadata_id = v_alias.entity_id 
   and v_alias.entity_type = 'generic_metadata'
   and v_alias.validation_type = 'text_snippet_dataset_alias'
 left join 
   validation v_alias_parent 
   on gm2.generic_metadata_id = v_alias_parent.entity_id 
   and v_alias_parent.entity_type = 'generic_metadata'
   and v_alias_parent.validation_type = 'dataset_alias_official_name'
 where 
   ms.source_type = 'reviewer'
 GROUP BY ms.source_id ,  ms.email, ms.organization_name`);
    if (result.recordset && result.recordset.length > 0) {
      items = result.recordset as ReviewReportItem[];
    }
    return items;
  }

  async assignitems(
    source_id: number,
    organization_source_id: number,
    organization_name: string,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('OrganizationSourceID', BigInt, organization_source_id)
      .input('OrganizationName', VarChar, organization_name)
      .query(`INSERT INTO generic_metadata
      (source_id, entity_id, entity_type, metadata_name, metadata, last_updated_date)
      SELECT TOP 50
        @OrganizationSourceID,
        @SourceID, 
        'metadata_source',
        'text_snippet_to_review',
        gm.generic_metadata_id,
        getdate()
      FROM
        generic_metadata gm
      left join
        publication_dataset_alias pda on pda.publication_dataset_alias_id = gm.entity_id
      LEFT JOIN
        dataset_alias da on pda.alias_id = da.alias_id
      LEFT JOIN 
        generic_metadata gm2 on da.parent_alias_id = gm2.entity_id  and gm2.metadata_name = 'dataset_validation_group'
      left JOIN
        generic_metadata gm3 on gm3.metadata_name = 'text_snippet_to_review' and cast(gm3.metadata as INT)  = gm.generic_metadata_id
      left join 
            validation v_alias 
            on gm.generic_metadata_id = v_alias.entity_id 
            and v_alias.entity_type = 'generic_metadata'
            and v_alias.validation_type = 'text_snippet_dataset_alias'
      left join 
            validation v_alias_parent 
            on gm.generic_metadata_id = v_alias_parent.entity_id 
            and v_alias_parent.entity_type = 'generic_metadata'
            and v_alias_parent.validation_type = 'dataset_alias_official_name'
      WHERE
        gm.metadata_name = 'text_snippet'
        and gm2.metadata = @OrganizationName 
        and (v_alias.value is null or v_alias_parent.value is null)
        and gm3.generic_metadata_id is null`);
    return result.rowsAffected;
  }

  async checkAndAssignNewItems() {
    const report = await this.getReviewReport();
    for (const reportItem of report) {
      if (reportItem.not_answered === 0) {
        await this.deleteAssignments(reportItem.user_metadata_source_id);
        await this.assignitems(
          reportItem.user_metadata_source_id,
          reportItem.organization_source_id,
          reportItem.organization_name,
        );
      }
    }
  }
}
