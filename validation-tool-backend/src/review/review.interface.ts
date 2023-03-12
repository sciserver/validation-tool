export interface ReviewItem {
  user_metadata_source_id: number;
  dataset_mention_generic_metadata_id: number;
  dataset_mention: string;
  publication_id: number;
  publication_doi: string;
  publication_title: string;
  alias_candidate: string;
  dataset_mention_alias_url: string;
  dataset_mention_parent_alias: string;
  dataset_mention_parent_alias_url: string;
  publication_dataset_alias_id: number;
  dataset_mention_answered: boolean;
  dataset_mention_parent_answered: boolean;
  publication_year: number;
  dataset_correct: number;
  alias_correct: number;
  dataset_alias: string;
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

export interface ReviewProgressDto {
  run_id: number;
  n_revd: number;
  n_tot: number;
  pct_complete: number;
}

export interface ReviewStatisticsDto {
  n_datasets: number;
  n_dyads: number;
  n_mention_candidates: number;
  n_publications: number;
  n_snippets_noempty: number;
  n_snippets_total: number;
  n_total_dyads: number;
}

export interface DatasetNamesDto {
  dataset: string;
  alias: string;
  alias_type: string;
}

export interface DatasetStatisticsDto {
  dataset: string;
  alias: string;
  alias_id: number;
  parent_alias_id: number;
  agency_dataset_identified: number;
  n_total: number;
}

export interface TopicOccurencesDto {
  topic: string;
  n_occurrences: number;
}

export interface MLModelStatisticsDto {
  dataset: string;
  n_publications: number;
  n_topics: number;
  topics: TopicOccurencesDto[];
}

export interface PublicationsPerTopicDto {
  topic: string;
  n_publications: number;
}

export interface ReviewersDto {
  susd_user_id: number;
  first_name: string;
  last_name: string;
  roles: string;
  agency_dataset_identified: number;
  n_total: number;
}
