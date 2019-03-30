import ArticleMeta from './ArticleMeta';
import CommentContainer from './CommentContainer';
import React from 'react';
import agent from '../../agent';
import { connect } from 'react-redux';
import marked from 'marked';
import { ARTICLE_PAGE_LOADED, ARTICLE_PAGE_UNLOADED, FILE_LINK_INSERT} from '../../constants/actionTypes';
import '../App.css';

const mapStateToProps = state => ({
  ...state.article,
  fileArticleSlug: state.common.fileArticleSlug,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onFileLinkInsert: payload =>
    dispatch({ type: FILE_LINK_INSERT, payload }),
  onLoad: payload =>
    dispatch({ type: ARTICLE_PAGE_LOADED, payload }),
  onUnload: () =>
    dispatch({ type: ARTICLE_PAGE_UNLOADED })
});

class Article extends React.Component {
  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Articles.get(this.props.match.params.id),
      agent.Comments.forArticle(this.props.match.params.id)
    ]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    if (!this.props.article) {
      return null;
    }

    const markup = { __html: marked(this.props.article.body, { sanitize: true }) };
    const canModify = this.props.currentUser &&
      this.props.currentUser.username === this.props.article.author.username;

    if (this.props.fileArticleSlug && this.props.fileArticleSlug === this.props.article.slug) {
      this.props.onFileLinkInsert(agent.Articles.get(this.props.match.params.id));
    }

    return (
      <div className="article-page">

        <div className="banner">
          <div className="container">

            <h1>{this.props.article.title}</h1>
            <ArticleMeta
              article={this.props.article}
              canModify={canModify} />

          </div>
        </div>

        <div className="container page">

          <div className="row article-content">
            <div className="col-xs-12">

              
                <div dangerouslySetInnerHTML={markup}></div>
                <a target="_blank" href={this.props.fileId && this.props.fileId.length > 1 ?
                  'https://drive.google.com/open?id=' + this.props.fileId :
                  'https://drive.google.com/open?id=' + this.props.article.description }>
                  {(this.props.fileId && this.props.fileId.length > 1) ||
                  this.props.article.description.length > 1 ?
                  "File on Google Drive " : ""}
                  <i className={(this.props.fileId && this.props.fileId.length > 1) ||
                  this.props.article.description.length > 1 ?
                  "ion-link" : "no-display"}></i>
                </a>

              <ul className="tag-list">
                {
                  this.props.article.tagList.map(tag => {
                    return (
                      <li
                        className="tag-default tag-pill tag-outline"
                        key={tag}>
                        {tag}
                      </li>
                    );
                  })
                }
              </ul>

            </div>
          </div>

          <hr />

          <div className="article-actions">
          </div>

          <div className="row">
            <CommentContainer
              comments={this.props.comments || []}
              errors={this.props.commentErrors}
              slug={this.props.match.params.id}
              currentUser={this.props.currentUser} />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Article);
