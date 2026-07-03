let page = 1;
let limit = 3; 
let downloadBtn = document.getElementById('download');
let box = document.getElementById('postsContainer');
let titleAdd = document.getElementById('titleInput');
let contentAdd = document.getElementById('contentInput');
// Отримання списку постів
    async function getPosts() {
        try {
            const params = new URLSearchParams({ _per_page:limit, _page: page });
            const response = await fetch(`http://localhost:3000/posts?${params}`);
            if (!response.ok) {
                throw new Error("ERROR");
            }
            return await response.json();
            } catch (error) {
            console.error(error);
            return [];
      }
    }
    // Створення нового поста
async function createPost(title, content) {
    const post = {
        title: title,
        content:content
    }
    const option = {
        method: "POST",
        body: JSON.stringify(post),
        headers: {"Content-Type": "application/json; charset=UTF-8",},
    }
        try {
            const response = await fetch('http://localhost:3000/posts', option);
            if (!response.ok) {
                throw new Error("ERROR");
            }
            } catch (error) {
        console.error(error);
   }
}


    // Оновлення поста
async function updatePost(id, title, content,comment) {
    const post = {
        title: title,
        content: content,
        comments:comment
    }
    const option = {
        method: "PUT",
        body: JSON.stringify(post),
        headers: {"Content-Type": "application/json; charset=UTF-8",},
        }
    try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, option);
            if (!response.ok) {
                throw new Error("ERROR");
            }
        } catch (error) {
        console.error(error);
      }
    }


    // Видалення поста
    async function deletePost(id) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, { method: "DELETE" })
            if (!response.ok) {
                throw new Error("ERROR");
            }
            } catch (error) {
        console.error(error);
      }
    }


    // Додавання коментаря до поста
    async function createComment(postId, comment) {
      try {
          const response = await fetch(`http://localhost:3000/posts/${postId}`);
          if (!response.ok) {
              throw new Error("ERROR");
          }
          const data = await response.json();
          console.log(data.comments);
          
          data.comments.push(comment);
          updatePost(postId, data.title, data.content,data.comments);
      } catch (error) {
        console.error(error);
      }
    }


// Оновлення відображення постів на сторінці

async function getTemplate() {
    const response = await fetch('./post.hbs');
    return await response.text();
}
async function renderPosts(posts) {
    const source = await getTemplate();
    const template = Handlebars.compile(source);
        posts.forEach(post => {
            const html = template(post);
            box.innerHTML += html;
        })
}
async function startApp() {
    const posts = await getPosts();
        console.log(posts);
    renderPosts(posts.data);

    
    page++;
}

downloadBtn.addEventListener('click', startApp);
function postCreate() {
    let title = titleAdd.value;
    let content = contentAdd.value;
    createPost(title, content);
}
    // Обробник події для створення поста
document.getElementById('createPostForm').addEventListener('submit', postCreate);


// // Обробник події для редагування поста
async function postUpdate(event) {
    if (event.target.dataset.id === 'update-btn') {
        let div = event.target.closest('div');
        let h2 = div.querySelector('h2');
        const response = await fetch("http://localhost:3000/posts")
        const posts = await response.json();
        let id;
        let comment;
        for (let element of posts) {
            if (element.title === h2.textContent) {
                id = element.id;
                comment = element.comment
            }
        }
        let title = prompt("Enter title");
        let content = prompt("Enter content");
        if (title !== null && content !== null) {
            updatePost(id, title, content, comment);
        }
    }
    }
    document.addEventListener('click', postUpdate);


// // Обробник події для видалення поста
async function postDelete(event) {
    if (event.target.dataset.id === 'delete-btn') {
        let div = event.target.closest('div');
        let h2 = div.querySelector('h2');
        const response = await fetch("http://localhost:3000/posts")
        const posts = await response.json();
        let id;
        for (let element of posts) {
            if (element.title === h2.textContent) {
                id = element.id;
            }
        }
        deletePost(id);
        }
    }
    document.addEventListener('click', postDelete);
// // Обробник події для додавання коментаря
async function commentCreate(event) {
        if (event.target.dataset.id === 'commentSection') {
            let div = event.target.closest('div');
            console.log(div);
            let comment = div.querySelector('.commentInput');
            const response = await fetch("http://localhost:3000/posts");
            const data = await response.json();
            for (let element of data) {
                if (element.id === div.dataset.id) {
                    createComment(element.id, comment.value);
                }
            }
        }
    }
    document.addEventListener('click', commentCreate);


    // Запуск додатку
