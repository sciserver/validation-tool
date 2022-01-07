export interface ReviewItem {
  user_metadata_source_id: number;
  dataset_mention_generic_metadata_id: number;
  dataset_mention: string;
  publication_id: number;
  publication_doi: string;
  publication_title: string;
  dataset_mention_alias: string;
  dataset_mention_alias_id: number;
  dataset_mention_parent_alias: string;
  dataset_mention_parent_alias_id: number;
}
