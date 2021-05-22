import React from 'react';

const CommentList = ({ comments }) => {
  const renderedComments = comments.map(({ id, status, content }) => {
    const value = status === 'approved'
      ? content
      : status === 'rejected'
        ? 'Comment is rejected'
        : 'Comment is pending for approval';

    return <li key={id}>
      {value}
    </li>
  });

  return <ul>
    {renderedComments}
  </ul>
};

export default CommentList;