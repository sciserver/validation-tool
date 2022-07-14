function highlightCenterWord(text, word){
  let textLow = text.toLowerCase()
  let wordLow = word.toLowerCase()
  let indexes = []
  let index = textLow.indexOf(wordLow);
  while(index !== -1) {
    indexes.push(index)
    index = textLow.indexOf(wordLow, index + 1);
  }
  if(indexes.length == 0){
    return text
  }
  var centerIndex = parseInt(text.length/2)
  var closestCenterWordIndex = indexes.reduce(function(previousIndex, currentIndex) {
    return (Math.abs(currentIndex - centerIndex) < Math.abs(previousIndex - centerIndex) ? currentIndex : previousIndex);
  });
  return text.slice(0, closestCenterWordIndex) + '<b style="background-color: khaki;">' + word + '</b>' + text.slice(closestCenterWordIndex + word.length);
}



class Review {

  constructor(id, text, alias_candidate, dataset_parent_alias,
    publication_dataset_alias_id, publication_id, publication_title, publication_doi,
    dataset_alias_url, dataset_parent_alias_url, dataset_mention_answered, dataset_mention_parent_answered, publication_year, dataset_correct, alias_correct, dataset_alias2) {

    this.id = id
    this.text = text
    this.textAsHtml = highlightCenterWord(text, alias_candidate)
    this.dataset_alias = alias_candidate != null ? alias_candidate : undefined
    this.dataset_parent_alias = dataset_parent_alias != null ? dataset_parent_alias : undefined
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
    this.dataset_correct = dataset_correct != null ? parseInt(dataset_correct) : undefined
    this.alias_correct = alias_correct != null ? parseInt(alias_correct) : undefined
    this.dataset_alias2 = dataset_alias2 != null ? dataset_alias2 : undefined

    //
    // fields to control inputs
    //this.dataset_alias_result = dataset_mention_answered != null && dataset_mention_answered != undefined ? dataset_mention_answered : undefined
    this.dataset_alias_result = dataset_correct != null && dataset_correct != undefined ? parseInt(dataset_correct) : undefined
    //this.dataset_parent_alias_result = dataset_mention_parent_answered != null && dataset_mention_parent_answered != undefined ? dataset_mention_parent_answered : undefined
    this.dataset_parent_alias_result = alias_correct != null && alias_correct != undefined ? parseInt(alias_correct) : undefined
    this.dataset_alias_loading = false
    this.dataset_parent_alias_loading = false
    this.dataset_alias_check = dataset_mention_answered != null && dataset_mention_answered != undefined ? true : undefined
    this.dataset_parent_alias_check = dataset_mention_parent_answered != null && dataset_mention_parent_answered != undefined ? true : undefined 
    this.overlay = this.alias_correct != undefined && this.dataset_correct != undefined
    this.beingEdited = false
  }

  static fromData(data) {
    return new Review(
      data.dataset_mention_generic_metadata_id,
      data.dataset_mention,
      data.alias_candidate,
      data.dataset_mention_parent_alias,
      data.publication_dataset_alias_id,
      data.publication_id,
      data.publication_title,
      data.publication_doi,
      data.dataset_mention_alias_url,
      data.dataset_mention_parent_alias_url,
      data.dataset_mention_answered,
      data.dataset_mention_parent_answered,
      data.publication_year, data.dataset_correct, data.alias_correct, data.dataset_alias)
  }

  hasPendingAnswer() {
    console.group(this.dataset_alias_result, this.dataset_parent_alias_result)
    return this.dataset_alias && this.dataset_alias_result === undefined ||
      this.dataset_parent_alias && this.dataset_parent_alias_result === undefined;
  }

  datasetAliasButtons() {
    //return !this.dataset_alias_loading && !this.dataset_alias_check
    return true
  }

  datasetParentAliasButtons() {
    //return !this.dataset_parent_alias_loading && !this.dataset_parent_alias_check
    return true 
  }

}

export default Review