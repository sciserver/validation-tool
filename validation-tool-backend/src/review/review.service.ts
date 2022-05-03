import { Injectable } from '@nestjs/common';
import { BigInt, VarChar } from 'mssql';
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

  async getReviewItens(
    source_id: number,
    page_size = 10,
    page_number = 0,
  ): Promise<ReviewItem[]> {
    let items: ReviewItem[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('EntityID', BigInt, source_id)
      .input('Fetch', BigInt, page_size)
      .input('Offset', BigInt, page_number * page_size).query(`select distinct
      gm.entity_id as user_metadata_source_id,
      gm2.generic_metadata_id as dataset_mention_generic_metadata_id,
      gm2.metadata  as dataset_mention,
      pda.publication_dataset_alias_id as publication_dataset_alias_id,
      p.publication_id as publication_id,
      p.title as publication_title,
      p.year as publication_year,
      p.doi as publication_doi,
      da.alias as dataset_mention_alias,
      da.url as dataset_mention_alias_url,
      CASE 
        WHEN v_alias.value is null
          THEN CAST(0 AS BIT)
        ELSE CAST(1 AS BIT)
      END as dataset_mention_answered,
      CASE 
        WHEN v_alias_parent.value is null
          THEN CAST(0 AS BIT)
        ELSE CAST(1 AS BIT)
      END as dataset_mention_parent_answered,
      case
        when da2.alias is null
          then da.alias 
        else da2.alias
      end as dataset_mention_parent_alias,
      case
        when da2.alias is null
          then da.url 
        else da2.url 
      end as dataset_mention_parent_alias_url
    from 
      generic_metadata gm 
    left join 
      generic_metadata gm2 on cast(gm.metadata as INT)  = gm2.generic_metadata_id 
    left join 
      publication_dataset_alias pda on pda.publication_dataset_alias_id = gm2.entity_id 
    left join
      publication p on p.publication_id = pda.publication_id 
    left JOIN 
      dataset_alias da on da.alias_id = pda.alias_id
    LEFT JOIN
      dataset_alias da2 on da2.alias_id = da.parent_alias_id and da.alias_id <> da.parent_alias_id 
    left join 
      validation v_alias 
      on gm2.generic_metadata_id = v_alias.entity_id 
      and v_alias.source_id = @EntityID
      and v_alias.entity_type = 'generic_metadata'
      and v_alias.validation_type = 'text_snippet_dataset_alias'
    left join 
      validation v_alias_parent 
      on gm2.generic_metadata_id = v_alias_parent.entity_id 
      and v_alias_parent.source_id = @EntityID
      and v_alias_parent.entity_type = 'generic_metadata'
      and v_alias_parent.validation_type = 'dataset_alias_official_name'
    where 
      gm.metadata_name = 'text_snippet_to_review'
      AND gm.entity_id = @EntityID
    ORDER BY dataset_mention_generic_metadata_id
    OFFSET @Offset ROWS FETCH NEXT @Fetch ROWS ONLY;`);
    if (result.recordset && result.recordset.length > 0) {
      items = result.recordset as ReviewItem[];
    }
    return items;
  }

  async getReviewItensCount(
    source_id: number,
  ): Promise<{ total: number; answered: number }> {
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().input('EntityID', BigInt, source_id)
      .query(`select count(distinct gm2.generic_metadata_id) as items_number,
      sum(
        case when (v_alias.value is null or v_alias_parent.value is null)
        then 0
        else 1 end
      ) as answered,
      gm.entity_id 
      from 
          generic_metadata gm 
      left join 
          generic_metadata gm2 on cast(gm.metadata as INT)  = gm2.generic_metadata_id 
      left join 
          publication_dataset_alias pda on pda.publication_dataset_alias_id = gm2.entity_id 
      left join
          publication p on p.publication_id = pda.publication_id 
      left JOIN 
          dataset_alias da on da.alias_id = pda.alias_id
      LEFT JOIN
          dataset_alias da2 on da2.alias_id = da.parent_alias_id and da.alias_id <> da.parent_alias_id 
        left join 
          validation v_alias 
          on gm2.generic_metadata_id = v_alias.entity_id 
          and v_alias.source_id = @EntityID
          and v_alias.entity_type = 'generic_metadata'
          and v_alias.validation_type = 'text_snippet_dataset_alias'
        left join 
          validation v_alias_parent 
          on gm2.generic_metadata_id = v_alias_parent.entity_id 
          and v_alias_parent.source_id = @EntityID
          and v_alias_parent.entity_type = 'generic_metadata'
          and v_alias_parent.validation_type = 'dataset_alias_official_name'
      where 
          gm.metadata_name = 'text_snippet_to_review'
          AND gm.entity_id = @EntityID
      group by gm.entity_id`);
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

  async addDatasetMentionAliasReview(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('EntityID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value).query(`INSERT INTO validation
      (entity_id, source_id, entity_type, value, validation_type)
      VALUES 
      ( @EntityID, @SourceID, 'generic_metadata', @Value, 'text_snippet_dataset_alias' );`);
    return result.rowsAffected;
  }

  async updateDatasetMentionAliasReview(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('EntityID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value)
      .query(`update validation set value = @Value 
      where source_id = @SourceID 
      and entity_type = 'generic_metadata' 
      and validation_type = 'text_snippet_dataset_alias'
      and entity_id = @EntityID`);
    return result.rowsAffected;
  }

  async reviewDatasetMentionAlias(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const row = await this.getValidation(
      source_id,
      'generic_metadata',
      validation.dataset_mention_generic_metadata_id,
      'text_snippet_dataset_alias',
    );
    if (!row) {
      return this.addDatasetMentionAliasReview(source_id, validation);
    } else {
      return this.updateDatasetMentionAliasReview(source_id, validation);
    }
  }

  async addDatasetMentionParentAliasReview(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('EntityID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value).query(`INSERT INTO validation
      ( entity_id, source_id, entity_type, value, validation_type)
      VALUES 
      ( @EntityID, @SourceID, 'generic_metadata', @Value, 'dataset_alias_official_name' );`);
    return result.rowsAffected;
  }

  async updateDatasetMentionParentAliasReview(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('EntityID', BigInt, validation.dataset_mention_generic_metadata_id)
      .input('Value', BigInt, validation.value)
      .query(`update validation set value = @Value 
      where source_id = @SourceID 
      and entity_type = 'generic_metadata' 
      and validation_type = 'dataset_alias_official_name'
      and entity_id = @EntityID`);
    return result.rowsAffected;
  }

  async reviewDatasetMentionParentAlias(
    source_id: number,
    validation: ValidationGenericMetadataDto,
  ) {
    const row = await this.getValidation(
      source_id,
      'generic_metadata',
      validation.dataset_mention_generic_metadata_id,
      'dataset_alias_official_name',
    );
    if (!row) {
      return this.addDatasetMentionParentAliasReview(source_id, validation);
    } else {
      return this.updateDatasetMentionParentAliasReview(source_id, validation);
    }
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
    ms.source_id  as user_metadata_source_id, ms.email, ms.organization_name,
sum(case when gm.generic_metadata_id is not null then 1 else 0 end) as assigned_items,
   sum(case when gm.generic_metadata_id is not null and (v_alias.value is null or v_alias_parent.value is null) then 1 else 0 end) as not_answered
 from 
   metadata_source ms
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

  async assignitems(source_id: number, organization_name: string) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('OrganizationName', VarChar, organization_name)
      .query(`INSERT INTO generic_metadata
      (source_id, entity_id, entity_type, metadata_name, metadata, last_updated_date)
      SELECT TOP 50
        1,
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
      if (
        reportItem.not_answered === 0 &&
        ![6, 7].includes(reportItem.user_metadata_source_id)
      ) {
        await this.deleteAssignments(reportItem.user_metadata_source_id);
        await this.assignitems(
          reportItem.user_metadata_source_id,
          reportItem.organization_name,
        );
      }
    }
  }
}
