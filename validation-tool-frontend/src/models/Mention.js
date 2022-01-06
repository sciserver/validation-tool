class Mention {
    
    constructor(id, text, publication_id, publication_title, publication_link) {
      this.id = id;
      this.name = text;
      this.publication_id = publication_id
      this.publication_title = publication_title
      this.publication_link = publication_link
    }
    
    static fromData(data) {
      return new Mention(data.id, data.text, data.publication_id, data.publication_title, data.publication_link);
    }
  }
  
  export default Mention;