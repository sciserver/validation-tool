class Review {
    
    constructor(id, text, dataset, publication_id, publication_title, publication_doi) {
      this.id = id
      this.text = text
      this.dataset = dataset
      this.publication_id = publication_id
      this.publication_title = publication_title
      this.publication_doi = publication_doi
    }
    
    static fromData(data) {
      return new Review(
        data.dataset_mention_generic_metadata_id, 
        data.dataset_mention, 
        data.dataset_alias,
        data.publication_id, 
        data.publication_title, 
        data.publication_doi)
    }
  }
  
  export default Review