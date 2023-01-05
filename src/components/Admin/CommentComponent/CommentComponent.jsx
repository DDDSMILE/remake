import React, { useEffect, useState } from "react";
import "./comment.css";
import { useAlert } from "react-alert";
import { db } from "../../../firebase/firebaseUtils";
export default function CommentComponent() {
  const alert = useAlert();
  const [comments, set_comments] = useState([]);
  const [id, set_id] = useState(null);
  const [isUpdate, set_isUpdate] = useState(false);
  const [content, setContent] = useState("");
  const getComments = async () => {
    const comments = await db.collection("comment").get();
    const commentList = comments.docs.map((comment) => {
      return { id: comment.id, ...comment.data() };
    });
    set_comments([...commentList]);
  };
  useEffect(() => {
    getComments();
  }, []);
  const handleDelete = async (id) => {
    const comments = db.doc(`/comment/${id}`);
    comments
      .get()
      .then((doc) => {
        if (!doc.exists) {
          alert.error("Delete Comment Fail");
        }
        return comments.delete();
      })
      .then(() => {
        alert.success("Delete Comment Success");
        getComments();
      })
      .catch((ee) => {
        console.log("====================================");
        console.log(ee);
        console.log("====================================");
        alert.error("Delete Comment Fail");
      });
  };
  const handleChange = (e) => {
    setContent(e.target.value);
  };
  const handleUpdate = (comment) => {
    set_id(comment?.id);
    setContent(comment?.content);
    set_isUpdate(true);
  };
  const handleCreate = async () => {
    let document = db.collection("comment").doc(`${id}`);
    document
      .update({ content })
      .then(() => {
        alert.success("Update Comment Success");
        setContent("");
        set_isUpdate(false);
        getComments();
      })
      .catch((err) => {
        console.log(err);
        alert.error("Update Comment Fail");
      });
  };
  return (
    <div>
      <div className="row">
        {isUpdate && (
          <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
            <legend>Update Content</legend>
            <div className="form-group my-3">
              <label>Content</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Content"
                onChange={handleChange}
                value={content}
              />
            </div>

            <button
              onClick={handleCreate}
              type="submit"
              className="btn btn-primary"
            >
              Update Comment
            </button>
          </div>
        )}

        <div
          className={
            isUpdate
              ? "col-xs-9 col-sm-9 col-md-9 col-lg-9 comment"
              : "col-xs-12 col-sm-12 col-md-12 col-lg-12 comment"
          }
        >
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Content</th>
                <th>MovieId</th>
                <th>Star</th>
                <th>Username</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => {
                return (
                  <tr key={comment?.id}>
                    <td>{comment?.id}</td>
                    <td>{comment?.content}</td>
                    <td>{comment?.movieId}</td>
                    <td>{comment?.star}</td>
                    <td>{comment?.username}</td>
                    <td>
                      <button
                        onClick={() => handleUpdate(comment)}
                        type="button"
                        className="btn btn-primary mx-2"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleDelete(comment?.id)}
                        type="button"
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
