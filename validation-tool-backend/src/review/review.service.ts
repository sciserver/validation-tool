import { Injectable } from '@nestjs/common';
import { BigInt } from 'mssql';
import { DatabaseService } from 'src/database/database.service';
import { ReviewItem } from './review.interface';

@Injectable()
export class ReviewService {
  constructor(private databaseService: DatabaseService) {}

  async getReviewItens(source_id: number): Promise<ReviewItem[]> {
    let items: ReviewItem[] = [];
    const pool = await this.databaseService.getConnection();
    const result = await pool.request().input('EntityID', BigInt, source_id)
      .query(`select 
      gm.entity_id as user_metadata_source_id,
      gm2.generic_metadata_id as dataset_mention_generic_metadata_id,
      gm2.metadata  as dataset_mention,
      p.publication_id as publication_id,
      p.title as publication_title,
      p.doi as publication_doi,
      da.alias as dataset_mention_alias,
      da.alias_id as dataset_mention_alias_id,
      da2.alias as dataset_mention_parent_alias,
      da2.alias_id as dataset_mention_parent_alias_id
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
  where 
      gm.metadata_name = 'text_snippet_to_review'
      AND gm.entity_id = @EntityID
      AND cast(gm.metadata as INT) NOT IN (
		select v.entity_id from validation v where v.entity_type = 'dataset_alias' and v.source_id = @EntityID
	)`);
    if (result.recordset && result.recordset.length > 0) {
      items = result.recordset as ReviewItem[];
    }
    return items;
  }
}
