import { Link } from 'react-router-dom';
import React from 'react';
import './Home.css';

const UsersPostedRecently = props => {
  const articles = props.articles;
  if (articles) {

    let date = new Date();
    date.setDate(date.getDate() - 1);
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let formattedDateYesterday = date.getFullYear() + '-' + month + '-' + date.getDate();
   
    let users = [props.currentUser];

    return (
      <div>
        <ul className="no-punct">
        {
          articles.map(article => {

            const handleClick = ev => {
              ev.preventDefault();
              if (article.author.following) {
                props.unfollow(article.author.username);
              } else {
                props.follow(article.author.username);
              }
            };

            let datePosted = article.updatedAt.substring(0,10);
            if (datePosted === formattedDateYesterday && !users.includes(article.author.username)) {
              users.push(article.author.username);
              return (
                <li key={article.author.username} className="no-punct">
                 <a href="" onClick={handleClick}>
                 {article.author.following ?
                  <i className="ion-minus"></i> : 
                  <i className="ion-plus"></i>}
                  </a>&nbsp;
                 <Link to={`/@${article.author.username}`}>{article.author.username}</Link>
                 </li>
              );
            }
            return null;
          })
        }
        </ul>
      </div>
    )
  } else {
    return (
      <div>Loading users...</div>
    );
  }
};

export default UsersPostedRecently;
