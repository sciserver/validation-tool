import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BigInt, VarChar } from 'mssql';
import { DatabaseService } from 'src/database/database.service';
import {
  ReviewItem,
  ValidationGenericMetadataDto,
  ValidationPublicationDatasetAliasDto,
  ValidationTableItemDto,
} from './review.interface';

@Injectable()
export class ReviewService {
  constructor(private databaseService: DatabaseService) {}

  async getReviewItens(source_id: number): Promise<ReviewItem[]> {
    let items: ReviewItem[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().input('EntityID', BigInt, source_id)
      .query(`select DISTINCT top 10
      gm.entity_id as user_metadata_source_id,
      gm2.generic_metadata_id as dataset_mention_generic_metadata_id,
      gm2.metadata  as dataset_mention,
      pda.publication_dataset_alias_id as publication_dataset_alias_id,
      p.publication_id as publication_id,
      p.title as publication_title,
      p.doi as publication_doi,
      case
          when v_alias.value is null
              then da.alias 
          else NULL
      end as dataset_mention_alias,
     case
          when v_parent_alias.value is null
              then da2.alias 
          else NULL
      end as dataset_mention_parent_alias
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
      and v_alias.notes is null 
      and v_alias.entity_type = 'generic_metadata'
  left join 
      validation v_parent_alias 
      on pda.publication_dataset_alias_id = v_parent_alias.entity_id 
      and v_parent_alias.entity_type = 'publication_dataset_alias'
  where 
      gm.metadata_name = 'text_snippet_to_review'
      AND gm.entity_id = @EntityID
      AND (v_alias.value is null or (da2.alias_id is not null and v_parent_alias.value is null))`);
    if (result.recordset && result.recordset.length > 0) {
      items = result.recordset as ReviewItem[];
    }
    return items;
  }

  async getReviewItensCount(source_id: number): Promise<number> {
    let count = 0;
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().input('EntityID', BigInt, source_id)
      .query(`select count(distinct gm2.metadata) as items_number
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
      and v_alias.notes is null 
      and v_alias.entity_type = 'generic_metadata'
  left join 
      validation v_parent_alias 
      on pda.publication_dataset_alias_id = v_parent_alias.entity_id 
      and v_parent_alias.entity_type = 'publication_dataset_alias'
  where 
      gm.metadata_name = 'text_snippet_to_review'
      AND gm.entity_id = @EntityID
      AND (v_alias.value is null or (da2.alias_id is not null and v_parent_alias.value is null));`);
    if (
      result.recordset &&
      result.recordset.length > 0 &&
      result.recordset[0].items_number
    ) {
      count = result.recordset[0].items_number;
    }
    return count;
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
      .input('Value', BigInt, validation.value)
      .query(`INSERT INTO richcontext_dev_redesign.dbo.validation
      (validation_id, entity_id, source_id, entity_type, value)
      SELECT 
      MAX( validation_id ) + 1, @EntityID, @SourceID, 'generic_metadata', @Value 
      FROM richcontext_dev_redesign.dbo.validation;`);
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
    );
    if (!row) {
      return this.addDatasetMentionAliasReview(source_id, validation);
    } else {
      throw new HttpException(
        'Validation already exists for this user',
        HttpStatus.CONFLICT,
      );
    }
  }

  async addDatasetMentionParentAliasReview(
    source_id: number,
    validation: ValidationPublicationDatasetAliasDto,
  ) {
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('SourceID', BigInt, source_id)
      .input('EntityID', BigInt, validation.publication_dataset_alias_id)
      .input('Value', BigInt, validation.value)
      .query(`INSERT INTO richcontext_dev_redesign.dbo.validation
      (validation_id, entity_id, source_id, entity_type, value)
      SELECT 
      MAX( validation_id ) + 1, @EntityID, @SourceID, 'publication_dataset_alias', @Value 
      FROM richcontext_dev_redesign.dbo.validation;`);
    return result.rowsAffected;
  }

  async reviewDatasetMentionParentAlias(
    source_id: number,
    validation: ValidationPublicationDatasetAliasDto,
  ) {
    const row = await this.getValidation(
      source_id,
      'publication_dataset_alias',
      validation.publication_dataset_alias_id,
    );
    if (!row) {
      return this.addDatasetMentionParentAliasReview(source_id, validation);
    } else {
      throw new HttpException(
        'Validation already exists for this user',
        HttpStatus.CONFLICT,
      );
    }
  }

  async getValidation(
    source_id: number,
    entity_type: string,
    entity_id: number,
  ): Promise<ValidationTableItemDto> {
    let item: ValidationTableItemDto = undefined;
    const pool = await this.databaseService.getConnection();
    const result = await pool
      .request()
      .input('EntityID', BigInt, entity_id)
      .input('SourceID', BigInt, source_id)
      .input('EntityType', VarChar, entity_type).query(`SELECT 
      validation_id, entity_id, source_id, entity_type, value
      FROM richcontext_dev_redesign.dbo.validation v
      WHERE 
          v.source_id = @SourceID
          and v.entity_id = @EntityID
          and v.entity_type = @EntityType`);
    if (result.recordset && result.recordset.length > 0) {
      item = result.recordset[0];
    }
    return item;
  }
}
