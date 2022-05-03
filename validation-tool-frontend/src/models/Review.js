class Review {

  constructor(id, text, dataset_alias, dataset_parent_alias,
    publication_dataset_alias_id, publication_id, publication_title, publication_doi,
    dataset_alias_url, dataset_parent_alias_url, dataset_mention_answered, dataset_mention_parent_answered, publication_year) {

    var regEx = new RegExp(dataset_alias, "ig");
    this.id = id
    this.text = text
    this.textAsHtml = text?.replace(regEx, `<b>${dataset_alias}</b>`)
    this.dataset_alias = dataset_alias
    this.dataset_parent_alias = dataset_parent_alias
    this.dataset_alias_url = dataset_alias_url
    this.dataset_parent_alias_url = dataset_parent_alias_url
    this.publication_dataset_alias_id = publication_dataset_alias_id
    this.publication_id = publication_id
    this.publication_title = publication_title
    this.publication_doi = publication_doi
    this.publication_year = publication_year
    if (publication_year) {
      this.publication_title = `${this.publication_title} (${this.publication_year})`
    }
    this.dataset_mention_answered = dataset_mention_answered
    this.dataset_mention_parent_answered = dataset_mention_parent_answered
    //
    // fields to control inputs
    this.dataset_alias_result = dataset_mention_answered ? dataset_mention_answered : undefined
    this.dataset_parent_alias_result = dataset_mention_parent_answered ? dataset_mention_parent_answered : undefined
    this.dataset_alias_loading = false
    this.dataset_parent_alias_loading = false
    this.dataset_alias_check = dataset_mention_answered
    this.dataset_parent_alias_check = dataset_mention_parent_answered
    this.overlay = dataset_mention_parent_answered && dataset_mention_answered
    this.beingEdited = false
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
      data.publication_doi,
      data.dataset_mention_alias_url,
      data.dataset_mention_parent_alias_url,
      data.dataset_mention_answered,
      data.dataset_mention_parent_answered,
      data.publication_year)
  }

  hasPendingAnswer() {
    return this.dataset_alias && this.dataset_alias_result === undefined ||
      this.dataset_parent_alias && this.dataset_parent_alias_result === undefined;
  }

  datasetAliasButtons() {
    return !this.dataset_alias_loading && !this.dataset_alias_check
  }

  datasetParentAliasButtons() {
    return !this.dataset_parent_alias_loading && !this.dataset_parent_alias_check
  }

}

export default Review