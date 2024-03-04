# React Redux Notes

## installation

```sh
npm install @reduxjs/toolkit react-redux
```

## fontawesome

```sh

npm install @fortawesome/fontawesome-svg-core @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome


```

## CRUD OPERATIONS FOR POSTS PROJECT

```sh
npm create vite@latest
cd react-project
npm install @reduxjs/toolkit react-redux axios

```

```text
redux-crud-app/
├── src/
│   ├── components/
│   │   ├── PostList.js
│   │   ├── PostForm.js
│   │   ├── CommentList.js
│   │   └── CommentForm.js
│   ├── store/
│   │   ├── postsSlice.js
│   │   ├── commentsSlice.js
│   │   └── store.js
│   ├── api.js
│   └── App.js
└── package.json

```

```javascript
//main.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

```javascript
//store.js

import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./postsSlice";
import commentsReducer from "./commentsSlice";

export default configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
  },
});
```

```javascript
// postsSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get("/api/posts");
  return response.data;
});

export const addPost = createAsyncThunk("posts/addPost", async (postData) => {
  const response = await axios.post("/api/posts", postData);
  return response.data;
});

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (postData) => {
    const response = await axios.put(`/api/posts/${postData.id}`, postData);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    await axios.delete(`/api/posts/${postId}`);
    return postId;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: {
    [fetchPosts.pending]: (state) => {
      state.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      state.posts = action.payload;
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [addPost.fulfilled]: (state, action) => {
      state.posts.push(action.payload);
    },
    [updatePost.fulfilled]: (state, action) => {
      const updatedPost = action.payload;
      const existingPost = state.posts.find(
        (post) => post.id === updatedPost.id
      );
      if (existingPost) {
        existingPost.title = updatedPost.title;
        existingPost.body = updatedPost.body;
      }
    },
    [deletePost.fulfilled]: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export default postsSlice.reducer;
```

```javascript
// PostList.js

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/postsSlice";

const PostList = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const status = useSelector((state) => state.posts.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </div>
      ))}
    </div>
  );
};

export default PostList;
```

```javascript
// PostForm.js

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addPost } from "../store/postsSlice";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addPost({ title, body }));
    setTitle("");
    setBody("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button type="submit">Add Post</button>
    </form>
  );
};

export default PostForm;
```

## COUNTER PROJECT

```javascript
//features/counter/counterSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    decrement: (state) => {
      state.count -= 1;
    },
    reset: (state) => {
      state.count = 0;
    },
    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },
  },
});

export const { increment, decrement, reset, incrementByAmount } =
  counterSlice.actions;
export default counterSlice.reducer;
```

```javascript
//Counter.jsx

import { useSelector, useDispatch } from "react-redux";
import { increment, decrement, reset, incrementByAmount } from "./counterSlice";
import { useState } from "react";

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();
  const [incrementAmount, setIncrementAmount] = useState(0);
  const addValue = Number(incrementAmount) || 0;

  const resetAll = () => {
    setIncrementAmount(0);
    dispatch(reset());
  };

  const addAmount = () => {
    //we pass the payload as an arguement
    dispatch(incrementByAmount(addValue));
  };

  return (
    <section className="counter">
      <h1>{count}</h1>
      <div className="buttons">
        <button className="btn" onClick={() => dispatch(increment())}>
          +
        </button>
        <button className="btn" onClick={() => dispatch(decrement())}>
          -
        </button>
        <button className="btn" onClick={resetAll}>
          Reset
        </button>
        <div className="input">
          <input
            type="text"
            value={incrementAmount}
            name="amount"
            id=""
            onChange={(e) => setIncrementAmount(e.target.value)}
          />
          <button onClick={addAmount}>Add Amount</button>
        </div>
      </div>
    </section>
  );
}

export default Counter;
```

## USERS CRUD OPERATIONS PROJECT

```javascript
//userSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = "https://jsonplaceholder.typicode.com/users";

const initialState = [];

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(baseURL);
  return response.data;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      //completely replacing the state
      return action.payload;
    });
  },
});

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, id) => {
  const user = state.users.find((user) => user.id === id);
  return user;
};

export default userSlice.reducer;
```

```javascript
//UsersLists.jsx

import { useSelector } from "react-redux";
import { selectAllUsers } from "./userSlice";
import { Link } from "react-router-dom";

function UsersList() {
  const users = useSelector(selectAllUsers);
  const renderedUsers = users.map((user) => {
    return (
      <li key={user.id} className="list-group-item py-3">
        <Link to={`/user/${user.id}`}>{user.name}</Link>
      </li>
    );
  });
  return (
    <section className="card my-5">
      <div className="card-header">UsersLists</div>
      <ul className="list-group list-group-flush">{renderedUsers}</ul>
    </section>
  );
}

export default UsersList;
```

```javascript
//SingleUser.jsx

import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "./userSlice";
import { useParams } from "react-router-dom";
import { selectPostsByUser } from "../post/postSlice";
import PostsExcerpt from "../post/PostsExcerpt";

function SingleUser() {
  const { id } = useParams();
  const user = useSelector((state) => selectUserById(state, Number(id)));

  const postsForUser = useSelector((state) =>
    selectPostsByUser(state, Number(id))
  );

  console.log(postsForUser);
  let content = postsForUser.map((post) => (
    <PostsExcerpt key={post.id} postId={post.id} />
  ));
  return (
    <section>
      {user ? (
        <div className="col-md-9 my-5 mx-auto">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Full Name</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user?.name}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Email</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user?.email}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Phone</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user?.phone}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Website</h6>
                </div>
                <div className="col-sm-9 text-secondary">{user?.website}</div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <h6 className="mb-0">Address</h6>
                </div>
                <div className="col-sm-9 text-secondary">
                  {user?.address?.city}
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-12">
                  <a
                    className="btn btn-info "
                    target="__blank"
                    href="https://www.bootdey.com/snippets/view/profile-edit-data-and-skills"
                  >
                    Edit
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>The user was not found</p>
      )}
      <div className="row">{content}</div>
    </section>
  );
}

export default SingleUser;
```

## COMPLETE CRUD OPERATIONS BLOG APP

```javascript
//postSlice.js

import {
  createAsyncThunk,
  createSlice,
  createSelector,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import { sub } from "date-fns";
import axios from "axios";

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

const initialState = postsAdapter.getInitialState({
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  count: 0,
});

// const initialState = {
//     posts:[],
//     status:"idle", // idle | loading | succeeded | failed
//     error: null,
//     count:0
// }

/*
asycn thunk accepts two arguements
A string => The string is used as the prefix for the generated action type
callback function => The callback function is a payload creator callback. its returns a promise that
contains some data or rejected promise with an error
 */
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axios.get(POSTS_URL);
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPost",
  async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost);
    return response.data;
  }
);

export const updatePosts = createAsyncThunk(
  "posts/updatePost",
  async (initialPost) => {
    const { id, post } = initialPost;
    const response = await axios.put(`${POSTS_URL}/${id}`, post);
    return response.data;
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (initialPost) => {
    const response = await axios.put(`${POSTS_URL}/${initialPost}`);
    if (response?.status === 200) return initialPost;
    return `${response?.status}:${response?.statusText}`;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload;
      const existingPost = state.entities[postId];
      console.log(postId);
      if (existingPost) {
        existingPost.reactions[reaction]++;
      }
    },
    increaseCount(state, action) {
      state.count = state.count += 1;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Adding date and reactions
        let min = 1;
        const loadedPosts = action.payload.map((post) => {
          post.date = sub(new Date(), { minutes: min++ }).toISOString();
          post.reactions = {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          };
          return post;
        });
        // add any fetched posts to the state
        postsAdapter.upsertMany(state, loadedPosts);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        const sortedPosts = state.posts.sort((a, b) => {
          if (a.id > b.id) return 1;
          if (a.id < b.id) return -1;
          return 0;
        });
        action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1;
        action.payload.useId = Number(action.payload.useId);
        action.payload.date = new Date().toISOString();
        action.payload.reactions = {
          thumbsUp: 0,
          wow: 0,
          heart: 0,
          rocket: 0,
          coffee: 0,
        };
        // state.posts.push(action.payload)
        postsAdapter.addOne(state, action.payload);
      })
      .addCase(updatePosts.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log("update could not be complere");
          console.log(action.payload);
          return;
        }
        // const { id } = action.payload
        action.payload.date = new Date().toISOString();
        // const posts = state.posts.filter(post => post.id !== id)
        // state.posts = [...posts, action.payload]
        postsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (!action?.payload) {
          console.log("Delete could not be complete");
          console.log(action.payload);
          return;
        }
        // const posts = state.posts.filter(post => post.id !== action.payload)
        // state.posts  =posts
        postsAdapter.removeOne(state, action.payload);
      });
  },
});

// export const selectAllPosts = (state) => state.posts.posts
export const getPostsError = (state) => state.posts.error;
export const getPostsStatus = (state) => state.posts.status;
export const getCount = (state) => state.posts.count;

// export const selectPostById = (state, id) => {
//     const singlePost = state.posts.posts.find(post => post.id === id)
//     return singlePost
// }

// getSelctor creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
  //Pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors((state) => state.posts);

//memorize selector
export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter((post) => post.userId === userId)
);

export const { reactionAdded, increaseCount } = postsSlice.actions;

export default postsSlice.reducer;
```

```javascript
//PostList.jsx

import { useSelector } from "react-redux";
import { selectPostIds, getPostsError, getPostsStatus } from "./postSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostList = () => {
  const orderedPosts = useSelector(selectPostIds);
  const postStatus = useSelector(getPostsStatus);
  const error = useSelector(getPostsError);

  let content;

  if (postStatus === "loading") {
    content = <p>Loading...</p>;
  } else if (postStatus === "succeeded") {
    content = orderedPosts.map((postId) => (
      <PostsExcerpt key={postId} postId={postId} />
    ));
  } else if (postStatus === "failed") {
    content = <p>{error}</p>;
  }

  return (
    <div className="row">
      <h2 className="text-center my-3">Posts</h2>
      {content}
    </div>
  );
};

export default PostList;
```

```javascript
//SinglePost.jsx

import { useSelector, useDispatch } from "react-redux";
import { selectPostById } from "./postSlice";
import { useParams } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import { deletePost } from "./postSlice";
import { useNavigate, Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";

const SinglePost = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const post = useSelector((state) => selectPostById(state, Number(id)));

  const handleDelete = () => {
    dispatch(deletePost(post.id));
    nagivate("/", { replace: true });
  };
  return (
    <div className="card text-center mt-5 card-h">
      <div className="card-header mb-5">Single Post</div>
      {post ? (
        <>
          <div className="card-body">
            <h5 className="card-title">{post.title}</h5>
            <p className="card-text">{post.body}</p>
            <ReactionButtons post={post} />
            <div className="mt-3">
              <Link to={`/edit/${post.id}`} className="btn btn-warning mx-2">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
          <div className="card-footer text-muted">
            <div className="mx-3">
              <span>Written </span>
              <PostAuthor userId={post.userId} />
            </div>
            <TimeAgo timestamp={post.date} />
          </div>
        </>
      ) : (
        <p>Post was not found</p>
      )}
    </div>
  );
};

export default SinglePost;
```

```javascript
//EditPost.jsx

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { selectAllUsers } from "../users/userSlice";
import { useNavigate } from "react-router-dom";
import { selectPostById, updatePosts } from "./postSlice";
import { useParams } from "react-router-dom";

const EditPost = () => {
  const users = useSelector(selectAllUsers);
  const { id } = useParams();
  const dispatch = useDispatch();
  const nagivate = useNavigate();
  const current_post = useSelector((state) =>
    selectPostById(state, Number(id))
  );

  const [post, setPost] = useState({
    title: current_post?.title,
    body: current_post?.body,
    userId: current_post?.userId,
  });

  if (!current_post) {
    return (
      <section>
        <h2>Post not found</h2>
      </section>
    );
  }

  function handleChange(e) {
    setPost((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  const canSave = Boolean(post.title) && Boolean(post.body);

  function handleSubmit(e) {
    e.preventDefault();
    if (canSave) {
      const new_post = {
        id: current_post.id,
        reactions: current_post.reactions,
        ...post,
      };
      const new_obj = {
        id: current_post.id,
        post: new_post,
      };
      console.log(new_obj);
      dispatch(updatePosts(new_obj));
      nagivate("/", { replace: true });
    } else {
      console.log("Enter all the values");
    }
  }
  return (
    <section className="container">
      <h2 className="text-center my-3">Add a New Post</h2>
      <form action="" onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Post Title:{" "}
          </label>
          <input
            className="form-control"
            type="text"
            name="title"
            id="title"
            value={post.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="author">
            Author:
          </label>
          <select
            className="form-select"
            name="userId"
            value={post.userId}
            onChange={handleChange}
            id="author"
          >
            <option value="">Enter an Author</option>
            {users.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="content">
            Content:{" "}
          </label>
          <textarea
            className="form-control"
            name="body"
            id="content"
            value={post.body}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={!canSave}>
          Submit
        </button>
      </form>
    </section>
  );
};

export default EditPost;
```

```javascript
//PostsExcerpt.jsx

import PostAuthor from "./PostAuthor";
import TimeAgo from "./TimeAgo";
import ReactionButtons from "./ReactionButtons";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postSlice";

const PostsExcerpt = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));

  return (
    <div className="card m-3 col-md-5 ">
      {post ? (
        <div className="card-body">
          <h5 className="card-title">{post.title}</h5>
          <h6 className="card-subtitle mb-2 text-muted">
            <PostAuthor userId={post.userId} />
          </h6>
          <p className="text-muted">
            <TimeAgo timestamp={post.date} />
          </p>
          <p className="card-text">{post.body.substring(0, 75)}...</p>
          <ReactionButtons post={post} />
          <Link to={`/post/${post.id}`} className="card-link">
            Visit Post
          </Link>
        </div>
      ) : (
        <p>Something went wrong</p>
      )}
    </div>
  );
};

export default PostsExcerpt;
```

```javascript
//postAuthor.jsx

import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/userSlice";

const PostAuthor = (props) => {
  const users = useSelector(selectAllUsers);

  const author = users.find((user) => user.id === props.userId);
  return <span>by {author ? author.username : "unknown author"}</span>;
};

export default PostAuthor;
```

```javascript
//AddPostForm.jsx

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { selectAllUsers } from "../users/userSlice";
import { useNavigate } from "react-router-dom";
import { addNewPost } from "./postSlice";

const AddPostForm = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const nagivate = useNavigate();
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [post, setPost] = useState({
    title: "",
    body: "",
    userId: "",
  });

  function handleChange(e) {
    setPost((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    console.log(post);
  }

  const canSave =
    [post.title, post.body, post.userId].every(Boolean) &&
    addRequestStatus === "idle";

  function handleSubmit(e) {
    e.preventDefault();
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        dispatch(addNewPost(post));
        setPost({
          title: "",
          content: "",
          userId: "",
        });
        nagivate("/", { replace: true });
      } catch (err) {
        console.error("Failed to save the post");
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }
  return (
    <section className="container">
      <h2 className="text-center my-3">Add a New Post</h2>
      <form action="" onSubmit={handleSubmit} className="form">
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Post Title:{" "}
          </label>
          <input
            className="form-control"
            type="text"
            name="title"
            id="title"
            value={post.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="author">
            Author:
          </label>
          <select
            className="form-select"
            name="userId"
            value={post.userId}
            onChange={handleChange}
            id="author"
          >
            <option value="">Enter an Author</option>
            {users.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="content">
            Content:{" "}
          </label>
          <textarea
            className="form-control"
            name="body"
            id="content"
            value={post.content}
            onChange={handleChange}
            rows="3"
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={!canSave}>
          Submit
        </button>
      </form>
    </section>
  );
};

export default AddPostForm;
```

```javascript
//ReactionButtons.jsx

import { useDispatch } from "react-redux";
import { reactionAdded } from "./postSlice";

function ReactionButtons({ post }) {
  const dispatch = useDispatch();
  const reactionEmoji = {
    thumbsUp: "👍",
    wow: "😮",
    heart: "❤️",
    rocket: "🚀",
    coffee: "☕",
  };
  const reactions_arr = Object.entries(reactionEmoji);
  const reaction_buttons = reactions_arr.map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() => {
          dispatch(reactionAdded({ postId: post.id, reaction: name }));
        }}
      >
        {emoji}
        {post.reactions[name]}
      </button>
    );
  });
  return <div>{reaction_buttons}</div>;
}

export default ReactionButtons;
```

```javascript
//TimeAgo.jsx

import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }) => {
  let timeAgo = "";
  if (timestamp) {
    const date = parseISO(timestamp);
    const timePeriod = formatDistanceToNow(date);
    timeAgo = `${timePeriod} ago`;
  }
  return (
    <span title={timestamp}>
      &nbsp;<small>{timeAgo}</small>
    </span>
  );
};

export default TimeAgo;
```
