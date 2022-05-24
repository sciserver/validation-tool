export interface ReviewItem {
  user_metadata_source_id: number;
  dataset_mention_generic_metadata_id: number;
  dataset_mention: string;
  publication_id: number;
  publication_doi: string;
  publication_title: string;
  dataset_mention_alias: string;
  dataset_mention_alias_url: string;
  dataset_mention_parent_alias: string;
  dataset_mention_parent_alias_url: string;
  publication_dataset_alias_id: number;
  dataset_mention_answered: boolean;
  dataset_mention_parent_answered: boolean;
  publication_year: number;
}

export interface ValidationGenericMetadataDto {
  dataset_mention_generic_metadata_id: number;
  value: number;
}

// export interface ValidationPublicationDatasetAliasDto {
//   value: number;
//   dataset_mention_generic_metadata_id: number;
// }

export interface ValidationTableItemDto {
  validation_id: number;
  entity_id: number;
  source_id: number;
  entity_type: string;
  value: number;
}

export interface ReviewReportItem {
  user_metadata_source_id: number;
  organization_source_id: number;
  email: string;
  organization_name: string;
  assigned_items: number;
  not_answered: number;
}
