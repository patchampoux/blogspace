class BlogSpace {
	constructor() {
		this.posts = [];

		this.initDOMElements();
		this.addEventListeners();
		this.getPosts();
	}

	initDOMElements() {
		this.$blogPostsOutlet = this.getElement('#blog-posts-outlet');
		this.$newPost = this.getElement('#new-post');
		this.$postTitle = this.getElement('#post-title');
		this.$postBody = this.getElement('#post-body');
	}

	getElement(selector) {
		const $element = document.querySelector(selector);

		if (!$element) {
			console.error(`Element with selector "${selector}" not found.`);
		}

		return $element;
	}

	addEventListeners() {
		this.$newPost?.addEventListener('submit', e => {
			e.preventDefault();

			const data = {
				title: this.$postTitle.value,
				body: this.$postBody.value,
			};

			this.savePost(data);

			this.$newPost.reset();
		});
	}

	async getPosts() {
		const res = await fetch('https://jsonplaceholder.typicode.com/posts');
		const data = await res.json();

		this.posts = data.slice(0, 5);

		this.updatePostsUI();
	}

	async savePost({ title, body }) {
		const options = {
			method: 'POST',
			body: JSON.stringify({
				userId: 1,
				title,
				body,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const res = await fetch('https://jsonplaceholder.typicode.com/posts', options);
		const data = await res.json();

		this.posts = [data, ...this.posts];

		this.updatePostsUI();
	}

	updatePostsUI() {
		const postsElements = this.posts
			.map(post => {
				const { title, body } = post;

				return `
                <article>
                    <h2>${title}</h2>
                    <p>${body}</p>
                    <hr>
                </article>
            `;
			})
			.join('');

		this.$blogPostsOutlet.innerHTML = postsElements.length > 0 ? postsElements : 'Sorry, no posts found.';
	}
}

new BlogSpace();
