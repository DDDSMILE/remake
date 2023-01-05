import React from "react";
import { db, deleteDisLike, deleteLike } from "../../../firebase/firebaseUtils";
// import ReactStars from "react-rating-stars-component";
export default function CommentUser(props) {
  const arr = [];
  for (let i = 0; i < props.starts; i++) {
    arr.push(
      <i
        key={i}
        style={{ color: "yellow" }}
        className="fa-solid fa-star mx-2"
      ></i>
    );
  }
  const handleLike = async (comment_id, user_id) => {
    try {
      const likes = await db.collection("like").get();
      const checkUser = [];
      likes.forEach((l) => {
        if (
          l.data()?.user_id == user_id &&
          l.data()?.comment_id == comment_id
        ) {
          checkUser.push(l?.id);
        }
      });
      if (checkUser.length > 0) {
        for (let i = 0; i < checkUser.length; i++) {
          const like = deleteLike(checkUser[i]);
          like.get().then(async () => {
            await like.delete();
          });
        }
      } else {
        let document = db.collection("like");
        await document.add({ comment_id, user_id });
      }
      setTimeout(() => {
        props.getList();
      });
    } catch (error) {
      console.log(error);
    }
    // document
    //   .update({ content })
    //   .then(() => {
    //     alert.success("Update Comment Success");
    //     setContent("");
    //     set_isUpdate(false);
    //     getComments();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert.error("Update Comment Fail");
    //   });
  };
  const handleDislike = async (comment_id, user_id) => {
    try {
      const likes = await db.collection("dislike").get();
      const checkUser = [];
      likes.forEach((l) => {
        if (
          l.data()?.user_id == user_id &&
          l.data()?.comment_id == comment_id
        ) {
          checkUser.push(l?.id);
        }
      });
      if (checkUser.length > 0) {
        for (let i = 0; i < checkUser.length; i++) {
          const like = deleteDisLike(checkUser[i]);
          like.get().then(async () => {
            await like.delete();
          });
        }
      } else {
        let document = db.collection("dislike");
        await document.add({ comment_id, user_id });
      }
      setTimeout(() => {
        props.getList();
      });
    } catch (error) {
      console.log(error);
    }
    // document
    //   .update({ content })
    //   .then(() => {
    //     alert.success("Update Comment Success");
    //     setContent("");
    //     set_isUpdate(false);
    //     getComments();
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //     alert.error("Update Comment Fail");
    //   });
  };
  return (
    <div>
      <div
        className="Comment__item--user"
        style={{ marginBottom: props.isReply ? "20px" : 0 }}
      >
        <div className="Comment__item--header">
          <div className="Comment__item--avatar">
            <img src={props?.image} alt="" />
          </div>
          <div className="Comment__item--username">
            <h3 style={{ fontSize: props.isReply ? 14 : 20 }}>
              {props?.username}
            </h3>
          </div>
          {arr}
        </div>
        <div className="Comment__item--main">
          <div className="Comment__item--content">{props?.content}</div>
          {!props.isReply && (
            <div className="Comment__item-react">
              <div className="Comment__item-react--like">
                {/* .not-allowed {cursor: not-allowed;} checkout-button */}
                <i
                  className={`fa-solid fa-thumbs-up ${
                    props.isDisLike && "checkout-button"
                  }`}
                  disabled
                  style={{
                    color: props?.isLike && "#4da6ff",
                    cursor: props.isDisLike && "not-allowed",
                  }}
                  onClick={() => handleLike(props?.id, props?.user_id)}
                ></i>
                <span>{props?.like}</span>
              </div>
              <div className="Comment__item-react--disklike">
                <i
                  className={`fa-solid fa-thumbs-down ${
                    props.isLike && "checkout-button"
                  }`}
                  onClick={() => handleDislike(props?.id, props?.user_id)}
                  style={{
                    color: props?.isDisLike && "#4da6ff",
                    cursor: props.isLike && "not-allowed",
                  }}
                ></i>
                <span>{props?.disLike}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
