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
