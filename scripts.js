const postsContainer = document.getElementById('posts-container');

async function fetchPosts() {
    try {
        const postsResponse = await fetch('https://jsonplaceholder.typicode.com/posts');
        const posts = await postsResponse.json();

        for (let post of posts) {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.setAttribute('data-id', post.id);
            postElement.innerHTML = `
                <h2>Post: ${post.title}</h2>
                <p>${post.body}</p>
                <button class="edit-button" onclick="editPost(${post.id})">Edit Post</button>
                <div class="comments" id="comments-${post.id}">
                    <h3>Comments:</h3>
                </div>
            `;
            postsContainer.appendChild(postElement);

            const commentsResponse = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`);
            const comments = await commentsResponse.json();

            const commentsContainer = document.getElementById(`comments-${post.id}`);
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.setAttribute('data-id', comment.id);
                commentElement.innerHTML = `
                    <h4>Comment by: ${comment.name}</h4>
                    <p>${comment.body}</p>
                    <button class="edit-button" onclick="editComment(${comment.id}, ${post.id})">Edit Comment</button>
                `;
                commentsContainer.appendChild(commentElement);
            });
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function editPost(postId) {
    const postElement = document.querySelector(`.post[data-id="${postId}"]`);
    const title = postElement.querySelector('h2').innerText.replace('Post: ', '');
    const body = postElement.querySelector('p').innerText;

    postElement.innerHTML = `
        <input type="text" class="editable" id="edit-title-${postId}" value="${title}">
        <textarea class="editable" id="edit-body-${postId}">${body}</textarea>
        <button class="save-button" onclick="savePost(${postId})">Save</button>
        <button class="cancel-button" onclick="cancelEditPost(${postId}, '${title}', '${body}')">Cancel</button>
        <div class="comments" id="comments-${postId}">
            <h3>Comments:</h3>
        </div>
    `;
    fetchComments(postId);
}

function savePost(postId) {
    const title = document.getElementById(`edit-title-${postId}`).value;
    const body = document.getElementById(`edit-body-${postId}`).value;

    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: postId,
            title: title,
            body: body,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(post => {
            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            postElement.innerHTML = `
                <h2>Post: ${post.title}</h2>
                <p>${post.body}</p>
                <button class="edit-button" onclick="editPost(${post.id})">Edit Post</button>
                <div class="comments" id="comments-${post.id}">
                    <h3>Comments:</h3>
                </div>
            `;
            fetchComments(post.id);
        });
}

function cancelEditPost(postId, title, body) {
    const postElement = document.querySelector(`.post[data-id="${postId}"]`);
    postElement.innerHTML = `
        <h2>Post: ${title}</h2>
        <p>${body}</p>
        <button class="edit-button" onclick="editPost(${postId})">Edit Post</button>
        <div class="comments" id="comments-${postId}">
            <h3>Comments:</h3>
        </div>
    `;
    fetchComments(postId);
}

function editComment(commentId, postId) {
    const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
    const name = commentElement.querySelector('h4').innerText.replace('Comment by: ', '');
    const body = commentElement.querySelector('p').innerText;

    commentElement.innerHTML = `
        <input type="text" class="editable" id="edit-comment-name-${commentId}" value="${name}">
        <textarea class="editable" id="edit-comment-body-${commentId}">${body}</textarea>
        <button class="save-button" onclick="saveComment(${commentId}, ${postId})">Save</button>
        <button class="cancel-button" onclick="cancelEditComment(${commentId}, '${name}', '${body}')">Cancel</button>
    `;
}

function saveComment(commentId, postId) {
    const name = document.getElementById(`edit-comment-name-${commentId}`).value;
    const body = document.getElementById(`edit-comment-body-${commentId}`).value;

    fetch(`https://jsonplaceholder.typicode.com/comments/${commentId}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: commentId,
            name: name,
            body: body,
            postId: postId,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
        .then(response => response.json())
        .then(comment => {
            const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
            commentElement.innerHTML = `
                <h4>Comment by: ${comment.name}</h4>
                <p>${comment.body}</p>
                <button class="edit-button" onclick="editComment(${comment.id}, ${postId})">Edit Comment</button>
            `;
        });
}

function cancelEditComment(commentId, name, body) {
    const commentElement = document.querySelector(`.comment[data-id="${commentId}"]`);
    commentElement.innerHTML = `
        <h4>Comment by: ${name}</h4>
        <p>${body}</p>
        <button class="edit-button" onclick="editComment(${commentId}, ${postId})">Edit Comment</button>
    `;
}

function fetchComments(postId) {
    fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
        .then(response => response.json())
        .then(comments => {
            const commentsContainer = document.getElementById(`comments-${postId}`);
            commentsContainer.innerHTML = '<h3>Comments:</h3>';
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment');
                commentElement.setAttribute('data-id', comment.id);
                commentElement.innerHTML = `
                    <h4>Comment by: ${comment.name}</h4>
                    <p>${comment.body}</p>
                    <button class="edit-button" onclick="editComment(${comment.id}, ${postId})">Edit Comment</button>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => console.error('Error fetching comments:', error));
}

fetchPosts();
