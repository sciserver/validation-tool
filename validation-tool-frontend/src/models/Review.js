class Review {
    
    constructor(id, text, dataset_alias, dataset_parent_alias, 
        publication_dataset_alias_id, publication_id, publication_title, publication_doi) {
      this.id = id
      this.text = text
      this.dataset_alias = dataset_alias
      this.dataset_parent_alias = dataset_parent_alias
      this.publication_dataset_alias_id = publication_dataset_alias_id
      this.publication_id = publication_id
      this.publication_title = publication_title
      this.publication_doi = publication_doi
      this.dataset_alias_result = undefined
      this.dataset_parent_alias_result = undefined
    }
    
    static fromData(data) {
      return new Review(
        data.dataset_mention_generic_metadata_id, 
        data.dataset_mention, 
        data.dataset_mention_alias,
        data.dataset_mention_parent_alias,
        data.publication_dataset_alias_id,
        data.publication_id, 
        data.publication_title, 
        data.publication_doi)
    }

    hasPendingAnswer() {
      return this.dataset_alias && !this.dataset_alias_result || 
             this.dataset_parent_alias && !this.dataset_parent_alias_result;
    }
}

export default Review